import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
  useListRequests,
  useGetRequest,
  useListNotifications,
  useAdvanceRequest,
} from "@workspace/api-client-react";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText, CheckCircle2, AlertTriangle, Clock,
  Bell, BrainCircuit, ArrowRight, ChevronRight,
  Sparkles, CalendarClock, AlertCircle, Info,
  CircleDot, Circle, CheckCircle, Hourglass,
  TrendingUp,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  const label = t(`status.${status}`) || status;
  switch (status) {
    case "completed": return <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-300 shadow-none text-xs">{label}</Badge>;
    case "active":    return <Badge className="bg-blue-500/10 text-blue-700 border border-blue-300 shadow-none text-xs">{label}</Badge>;
    case "rejected":  return <Badge className="bg-red-500/10 text-red-700 border border-red-300 shadow-none text-xs">{label}</Badge>;
    case "escalated": return <Badge className="bg-orange-500/10 text-orange-700 border border-orange-300 shadow-none text-xs">{label}</Badge>;
    default:          return <Badge className="bg-slate-100 text-slate-600 border border-slate-200 shadow-none text-xs">{label}</Badge>;
  }
}

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    critical: "bg-red-500",
    high: "bg-orange-400",
    medium: "bg-amber-400",
    low: "bg-slate-300",
  };
  return <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${colors[priority] ?? "bg-slate-300"}`} />;
}

function NotifIcon({ type }: { type: string }) {
  switch (type) {
    case "assigned":    return <Info className="h-4 w-4 text-blue-500" />;
    case "completed":   return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "rejected":    return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "escalated":   return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case "sla_warning": return <Clock className="h-4 w-4 text-amber-500" />;
    case "ai_alert":    return <BrainCircuit className="h-4 w-4 text-primary" />;
    default:            return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
}

// ─── Loading skeleton ──────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-56 bg-muted rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="h-48 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
        <div className="space-y-5">
          <div className="h-72 bg-muted rounded-xl" />
          <div className="h-56 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { t, isRTL } = useLanguage();

  // Data
  const { data: allRequests, isLoading: loadingReqs } = useListRequests({});
  const { data: notifications, isLoading: loadingNotifs } = useListNotifications({});
  const advanceMut = useAdvanceRequest();

  // Latest request for journey view (first in list = most recent)
  const latestReq = allRequests?.[0];
  const { data: latestDetail } = useGetRequest(latestReq?.id ?? 0, {
    query: { enabled: !!latestReq?.id },
  });

  // Derived KPIs
  const kpis = useMemo(() => {
    if (!allRequests) return { active: 0, completed: 0, delayed: 0, pending: 0 };
    return {
      active:    allRequests.filter(r => r.status === "active").length,
      completed: allRequests.filter(r => r.status === "completed").length,
      delayed:   allRequests.filter(r => r.delayRisk === "high" || r.delayRisk === "critical").length,
      pending:   allRequests.filter(r => r.status === "pending").length,
    };
  }, [allRequests]);

  // My Tasks = active + pending requests sorted by risk
  const myTasks = useMemo(() => {
    if (!allRequests) return [];
    const riskOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, "": 4 };
    return allRequests
      .filter(r => r.status === "active" || r.status === "pending" || r.status === "escalated")
      .sort((a, b) => (riskOrder[a.delayRisk ?? ""] ?? 4) - (riskOrder[b.delayRisk ?? ""] ?? 4));
  }, [allRequests]);

  // Recent requests (last 6)
  const recentRequests = useMemo(() => allRequests?.slice(0, 6) ?? [], [allRequests]);

  // AI insights — derived from request data
  const aiInsights = useMemo(() => {
    if (!allRequests) return [];
    const insights: { icon: React.ReactNode; text: string; type: "alert" | "info" | "tip" }[] = [];

    const critical = allRequests.filter(r => r.delayRisk === "critical");
    const high = allRequests.filter(r => r.delayRisk === "high");
    const urgentSla = allRequests.filter(r =>
      r.remainingSlaHours !== undefined && r.remainingSlaHours !== null && r.remainingSlaHours < 24 && r.status === "active"
    );
    const escalated = allRequests.filter(r => r.status === "escalated");

    if (critical.length > 0) {
      insights.push({
        icon: <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />,
        text: `${critical.length} request${critical.length > 1 ? "s" : ""} at critical delay risk — immediate attention needed.`,
        type: "alert",
      });
    }
    if (urgentSla.length > 0) {
      insights.push({
        icon: <CalendarClock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />,
        text: `${urgentSla.length} request${urgentSla.length > 1 ? "s have" : " has"} SLA deadlines within the next 24 hours.`,
        type: "alert",
      });
    }
    if (escalated.length > 0) {
      insights.push({
        icon: <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />,
        text: `${escalated.length} escalated request${escalated.length > 1 ? "s require" : " requires"} your review.`,
        type: "alert",
      });
    }
    if (high.length > 0) {
      insights.push({
        icon: <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />,
        text: `${high.length} request${high.length > 1 ? "s are" : " is"} at high risk of delay. Consider following up with the approving department.`,
        type: "info",
      });
    }
    if (kpis.completed > 0) {
      insights.push({
        icon: <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />,
        text: `You've completed ${kpis.completed} request${kpis.completed > 1 ? "s" : ""} so far. Keep up the great work!`,
        type: "tip",
      });
    }
    if (latestReq?.estimatedCompletionDate) {
      insights.push({
        icon: <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
        text: `AI estimates your latest request will complete by ${format(new Date(latestReq.estimatedCompletionDate), "MMM d, yyyy")}.`,
        type: "tip",
      });
    }
    if (insights.length === 0) {
      insights.push({
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />,
        text: "All your requests are on track. No immediate actions required.",
        type: "tip",
      });
    }
    return insights;
  }, [allRequests, kpis, latestReq]);

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = "Alex"; // demo user

  if (loadingReqs) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400 pb-12">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, <span className="text-primary">{displayName}</span> 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {format(new Date(), "EEEE, MMMM d, yyyy")} · Here's your daily overview
          </p>
        </div>
        <Link href="/requests/new">
          <Button className="gap-2 shadow-sm shrink-0">
            <FileText className="h-4 w-4" /> New Request
          </Button>
        </Link>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active */}
        <Card className="border-blue-200/80 bg-gradient-to-br from-blue-50/80 to-white hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <CircleDot className="h-5 w-5" />
              </div>
              <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full">
                In Progress
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-700">{kpis.active}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">My Active Requests</p>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card className="border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-white hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                Done
              </span>
            </div>
            <p className="text-3xl font-bold text-emerald-700">{kpis.completed}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">My Completed Requests</p>
          </CardContent>
        </Card>

        {/* Delayed */}
        <Card className="border-red-200/80 bg-gradient-to-br from-red-50/80 to-white hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              {kpis.delayed > 0 && (
                <span className="text-xs text-red-600 font-semibold bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
                  Attention
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-red-700">{kpis.delayed}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">My Delayed Requests</p>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-white hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Hourglass className="h-5 w-5" />
              </div>
              <span className="text-xs text-amber-600 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                Waiting
              </span>
            </div>
            <p className="text-3xl font-bold text-amber-700">{kpis.pending}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">My Pending Tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Left: Journey + Recent Requests */}
        <div className="xl:col-span-2 space-y-5">

          {/* My Latest Request Journey */}
          {latestReq && (
            <Card>
              <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="text-base font-semibold">My Latest Request Journey</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    <span className="font-mono">REQ-{latestReq.id.toString().padStart(4, "0")}</span>
                    {" · "}
                    <span className="font-medium text-foreground truncate">{latestReq.title}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={latestReq.status} />
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setLocation(`/requests/${latestReq.id}`)}>
                    View <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span className="font-semibold text-foreground">{latestReq.progressPercent ?? 0}%</span>
                  </div>
                  <Progress value={latestReq.progressPercent ?? 0} className="h-2" />
                </div>

                {/* Timeline steps */}
                {latestDetail?.timeline && latestDetail.timeline.length > 0 ? (
                  <div className="relative">
                    {/* Horizontal scroll on mobile, flex-wrap on desktop */}
                    <div className="flex items-start gap-0 overflow-x-auto pb-2 -mx-1 px-1">
                      {latestDetail.timeline.map((event: any, i: number) => {
                        const isLast = i === latestDetail.timeline.length - 1;
                        const isCurrent = isLast && latestReq.status !== "completed" && latestReq.status !== "rejected";
                        const isCompleted = !isCurrent;
                        return (
                          <div key={event.id} className="flex items-center min-w-0">
                            <div className="flex flex-col items-center gap-1.5 min-w-[80px] max-w-[100px]">
                              {/* Circle indicator */}
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                isCurrent
                                  ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30 ring-4 ring-primary/20"
                                  : isCompleted
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "bg-muted border-border text-muted-foreground"
                              }`}>
                                {isCurrent
                                  ? <CircleDot className="h-4 w-4" />
                                  : isCompleted
                                  ? <CheckCircle2 className="h-4 w-4" />
                                  : <Circle className="h-4 w-4" />
                                }
                              </div>
                              {/* Label */}
                              <div className="text-center px-1">
                                <p className={`text-[10px] font-semibold leading-tight line-clamp-2 ${isCurrent ? "text-primary" : isCompleted ? "text-emerald-700" : "text-muted-foreground"}`}>
                                  {event.departmentName || event.description?.split(" ")[0] || `Step ${i + 1}`}
                                </p>
                                <p className="text-[9px] text-muted-foreground mt-0.5 hidden sm:block">
                                  {format(new Date(event.createdAt), "MMM d")}
                                </p>
                              </div>
                            </div>
                            {/* Connector line */}
                            {!isLast && (
                              <div className={`h-0.5 w-6 sm:w-10 shrink-0 mx-1 rounded-full ${
                                isCompleted ? "bg-emerald-400" : "bg-border"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <CircleDot className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Request submitted</p>
                      <p className="text-xs text-muted-foreground">Awaiting first review · {latestReq.currentDepartmentName || "Processing"}</p>
                    </div>
                  </div>
                )}

                {/* Current stage info */}
                <div className="mt-3 rounded-lg bg-muted/40 border px-4 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-muted-foreground">
                  {latestReq.currentDepartmentName && (
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      Current dept: <span className="font-semibold text-foreground">{latestReq.currentDepartmentName}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 shrink-0" />
                    Waiting: <span className="font-semibold text-foreground">{latestReq.waitingHours}h</span>
                  </span>
                  {latestReq.delayRisk && latestReq.delayRisk !== "low" && (
                    <span className={`flex items-center gap-1.5 font-semibold ${
                      latestReq.delayRisk === "critical" ? "text-red-600" :
                      latestReq.delayRisk === "high" ? "text-orange-600" : "text-amber-600"
                    }`}>
                      <AlertTriangle className="h-3 w-3" />
                      {latestReq.delayRisk} risk
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Recent Requests */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">My Recent Requests</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setLocation("/requests")}>
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {recentRequests.length === 0 ? (
                <div className="px-6 py-10 text-center text-muted-foreground text-sm">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>No requests yet.</p>
                  <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={() => setLocation("/requests/new")}>
                    <FileText className="h-3.5 w-3.5" /> Create your first request
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {recentRequests.map((req) => (
                    <div
                      key={req.id}
                      className="px-5 py-3 flex items-center gap-3 hover:bg-muted/30 cursor-pointer transition-colors group"
                      onClick={() => setLocation(`/requests/${req.id}`)}
                    >
                      <PriorityDot priority={req.priority} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                            REQ-{req.id.toString().padStart(4, "0")}
                          </span>
                          <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {req.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {req.currentDepartmentName && (
                            <span className="text-[11px] text-muted-foreground">{req.currentDepartmentName}</span>
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            {formatDistanceToNow(new Date(req.updatedAt ?? req.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={req.status} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: AI + Notifications */}
        <div className="space-y-5">

          {/* AI Assistant Panel */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                AI Assistant
              </CardTitle>
              <p className="text-xs text-muted-foreground">Personalized insights for your requests</p>
            </CardHeader>
            <CardContent className="pt-0 space-y-2.5">
              {aiInsights.map((insight, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 rounded-lg p-3 text-sm leading-relaxed border ${
                    insight.type === "alert"
                      ? "bg-red-50/80 border-red-100 text-red-800"
                      : insight.type === "info"
                      ? "bg-amber-50/80 border-amber-100 text-amber-800"
                      : "bg-emerald-50/80 border-emerald-100 text-emerald-800"
                  }`}
                >
                  {insight.icon}
                  <span>{insight.text}</span>
                </div>
              ))}

              {/* Quick actions */}
              {kpis.delayed > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-1 gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5"
                  onClick={() => setLocation("/requests")}
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  View delayed requests
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                Notifications
                {notifications && notifications.filter(n => !n.isRead).length > 0 && (
                  <Badge className="h-5 min-w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] px-1.5">
                    {notifications.filter(n => !n.isRead).length}
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setLocation("/notifications")}>
                All <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loadingNotifs ? (
                <div className="divide-y">
                  {[1,2,3].map(i => (
                    <div key={i} className="px-4 py-3 flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications && notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 flex gap-3 hover:bg-muted/30 transition-colors cursor-pointer ${!notif.isRead ? "bg-primary/5" : ""}`}
                      onClick={() => setLocation("/notifications")}
                    >
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <NotifIcon type={notif.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-snug ${!notif.isRead ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                  <Bell className="h-7 w-7 mx-auto mb-2 opacity-20" />
                  <p className="text-xs">No notifications yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── My Tasks ────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold">My Tasks</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Requests requiring your attention</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setLocation("/requests")}>
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {myTasks.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-emerald-400" />
              <p className="font-medium text-foreground">All caught up!</p>
              <p className="text-sm mt-1">You have no active tasks right now.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {myTasks.slice(0, 6).map((req) => {
              const riskColor =
                req.delayRisk === "critical" ? "border-s-red-500 bg-red-50/40" :
                req.delayRisk === "high"     ? "border-s-orange-400 bg-orange-50/40" :
                req.delayRisk === "medium"   ? "border-s-amber-400 bg-amber-50/20" :
                                               "border-s-slate-200 bg-white";

              return (
                <Card
                  key={req.id}
                  className={`border-s-4 hover:shadow-md transition-all cursor-pointer group ${riskColor}`}
                  onClick={() => setLocation(`/requests/${req.id}`)}
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          REQ-{req.id.toString().padStart(4, "0")}
                        </span>
                        <p className="text-sm font-semibold leading-tight mt-0.5 line-clamp-2 group-hover:text-primary transition-colors">
                          {req.title}
                        </p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>

                    {/* Meta */}
                    <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1.5">
                        <ArrowRight className="h-3 w-3 shrink-0" />
                        {req.currentDepartmentName
                          ? <span>At <span className="font-medium text-foreground">{req.currentDepartmentName}</span></span>
                          : <span>Processing…</span>
                        }
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 shrink-0" />
                        Waiting <span className="font-medium text-foreground">{req.waitingHours}h</span>
                        {req.remainingSlaHours !== undefined && req.remainingSlaHours !== null && req.remainingSlaHours < 48 && (
                          <span className="text-amber-600 font-semibold">· SLA: {req.remainingSlaHours}h left</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <PriorityDot priority={req.priority} />
                          <span className="capitalize">{t(`priority.${req.priority}`) || req.priority} priority</span>
                        </span>
                        {req.delayRisk && req.delayRisk !== "low" && (
                          <span className={`font-semibold ${
                            req.delayRisk === "critical" ? "text-red-600" :
                            req.delayRisk === "high" ? "text-orange-600" : "text-amber-600"
                          }`}>
                            {req.delayRisk} risk
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    {req.progressPercent !== undefined && (
                      <div className="mb-3">
                        <Progress value={req.progressPercent} className="h-1.5" />
                        <span className="text-[10px] text-muted-foreground mt-1 block">{req.progressPercent}% complete</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-7 text-xs"
                        onClick={(e) => { e.stopPropagation(); setLocation(`/requests/${req.id}`); }}
                      >
                        View Details
                      </Button>
                      {(req.status === "active" || req.status === "pending") && (
                        <Button
                          size="sm"
                          className="flex-1 h-7 text-xs gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            advanceMut.mutate(
                              { requestId: req.id, data: { comment: "Approved" } },
                              { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listRequests"] }) }
                            );
                          }}
                          disabled={advanceMut.isPending}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Advance
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
