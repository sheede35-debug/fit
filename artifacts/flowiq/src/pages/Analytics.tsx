import { useState } from "react";
import { useGetDepartmentPerformance, useGetRequestTrends, useGetEmployeePerformance, useGetDashboardStats, useGetAiInsights } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell,
} from "recharts";
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Minus,
  BarChart3, Building2, Users, AlertTriangle, BrainCircuit, Sparkles, Clock, CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function useWorkloadStats() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const loaded = data !== null;

  const load = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
      const res = await fetch(`${base}/api/analytics/workload`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, load, loaded };
}

const TABS = ["overview", "departments", "trends"] as const;
type Tab = typeof TABS[number];

const PIE_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6B7280"];

export default function Analytics() {
  const { data: deptPerf, isLoading: isLoadingDept } = useGetDepartmentPerformance({ period: 'month' });
  const { data: trends, isLoading: isLoadingTrends } = useGetRequestTrends({ period: 'month' });
  const { data: empPerf, isLoading: isLoadingEmp } = useGetEmployeePerformance();
  const { data: stats, isLoading: isLoadingStats } = useGetDashboardStats();
  const { data: insights, isLoading: isLoadingInsights } = useGetAiInsights();
  const workload = useWorkloadStats();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabLabels: Record<Tab, string> = {
    overview: t('analytics.tabs.overview'),
    departments: t('analytics.tabs.departments'),
    trends: t('analytics.tabs.trends'),
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
    if (trend === 'down') return <ArrowDownRight className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('analytics.execTitle')}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{t('analytics.execSubtitle')}</p>
          </div>
        </div>
        {/* Tab switcher */}
        <div className="flex rounded-lg border bg-muted/40 p-1 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "departments") workload.load();
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB: OVERVIEW ─────────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {isLoadingStats ? (
              Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            ) : stats ? (
              <>
                {[
                  { label: t('analytics.kpi.total'), value: stats.totalRequests, color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
                  { label: t('analytics.kpi.active'), value: stats.activeRequests, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
                  { label: t('analytics.kpi.completed'), value: stats.completedRequests, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
                  { label: t('analytics.kpi.delayed'), value: stats.delayedRequests, color: "text-red-700", bg: "bg-red-50 border-red-200" },
                  { label: t('analytics.kpi.avgHours'), value: `${stats.avgCompletionHours}h`, color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
                  { label: t('analytics.kpi.sla'), value: `${Math.round((stats.slaComplianceRate ?? 0) * 100)}%`, color: stats.slaComplianceRate >= 0.8 ? "text-emerald-700" : "text-amber-700", bg: stats.slaComplianceRate >= 0.8 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200" },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`rounded-xl border p-3 ${bg}`}>
                    <p className="text-xs text-muted-foreground mb-1 leading-tight">{label}</p>
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </>
            ) : null}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* AI Risk + Bottlenecks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  {t('analytics.bottleneckTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Risk gauge */}
                {stats && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('analytics.riskScore')}</span>
                      <span className={`font-bold text-lg ${stats.aiRiskScore > 70 ? 'text-red-500' : stats.aiRiskScore > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {stats.aiRiskScore}/100
                      </span>
                    </div>
                    <Progress
                      value={stats.aiRiskScore}
                      className={`h-3 ${stats.aiRiskScore > 70 ? '[&>div]:bg-red-500' : stats.aiRiskScore > 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
                    />
                  </div>
                )}
                {/* Bottleneck list */}
                {isLoadingInsights ? (
                  <div className="space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
                ) : insights?.bottlenecks?.slice(0, 4).map((b: any) => (
                  <div key={b.departmentId} className="flex items-center gap-3 py-2 border-b last:border-0">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${
                      b.severity === 'critical' ? 'bg-red-500' :
                      b.severity === 'high' ? 'bg-orange-400' :
                      b.severity === 'medium' ? 'bg-amber-400' : 'bg-slate-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{b.departmentName}</p>
                      <p className="text-xs text-muted-foreground">{b.affectedRequests} {t('analytics.requests')} · {b.avgWaitHours}h {t('analytics.avgWait')}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs shrink-0 ${getRiskColor(b.severity)}`}>
                      {t(`risk.${b.severity}`) || b.severity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  {t('analytics.aiRecs')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoadingInsights ? (
                  <div className="space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
                ) : insights?.topRecommendations?.slice(0, 5).map((rec: string, i: number) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">{rec}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Status breakdown + weekly performance */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('dashboard.requestStatus')}</CardTitle>
                <CardDescription>{t('dashboard.distributionByStatus')}</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px]">
                {isLoadingStats ? <Skeleton className="w-full h-full" /> : stats?.requestStatusBreakdown ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.requestStatusBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {stats.requestStatusBreakdown.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('dashboard.weeklyPerformance')}</CardTitle>
                <CardDescription>{t('dashboard.requestsOverTime')}</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px]">
                {isLoadingStats ? <Skeleton className="w-full h-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.weeklyPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="value" name={t('analytics.completed')} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="secondary" name={t('analytics.delayed')} fill="hsl(var(--destructive))" opacity={0.7} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: DEPARTMENTS ──────────────────────────────────────────────────── */}
      {activeTab === "departments" && (
        <div className="space-y-6">
          {/* Workload Cards */}
          <div>
            <h2 className="text-base font-semibold mb-4">{t('analytics.workloadCards')}</h2>
            {workload.loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
              </div>
            ) : workload.data ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workload.data.map((d: any) => (
                  <Card key={d.departmentId} className={`${
                    d.status === 'overloaded' ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' :
                    d.status === 'busy' ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20' :
                    'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold">{d.departmentName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{d.activeRequests} / {d.capacity} {t('analytics.requests')}</p>
                        </div>
                        <Badge className={`text-xs shrink-0 ${
                          d.status === 'overloaded' ? 'bg-red-100 text-red-700 border-red-300' :
                          d.status === 'busy' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                          'bg-emerald-100 text-emerald-700 border-emerald-300'
                        } shadow-none border`}>
                          {t(`analytics.status.${d.status}`) || d.status}
                        </Badge>
                      </div>
                      <Progress
                        value={Math.min(100, d.capacityPercent)}
                        className={`h-2 ${
                          d.status === 'overloaded' ? '[&>div]:bg-red-500' :
                          d.status === 'busy' ? '[&>div]:bg-amber-500' :
                          '[&>div]:bg-emerald-500'
                        }`}
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">{d.capacityPercent}% {t('analytics.capacity')}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>{t('common.loading')}</p>
              </div>
            )}
          </div>

          {/* Dept performance table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('analytics.deptPerformance')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingDept ? (
                <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="ps-3">{t('analytics.deptName')}</TableHead>
                        <TableHead className="text-center">{t('analytics.completed')}</TableHead>
                        <TableHead className="text-center">{t('analytics.avgHours')}</TableHead>
                        <TableHead className="text-center">{t('analytics.slaRate')}</TableHead>
                        <TableHead className="text-center">{t('analytics.score')}</TableHead>
                        <TableHead className="text-center">{t('analytics.trend')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deptPerf?.map((dept: any) => (
                        <TableRow key={dept.departmentId} className="text-sm">
                          <TableCell className="ps-3 font-medium">{dept.departmentName}</TableCell>
                          <TableCell className="text-center">{dept.completedRequests}</TableCell>
                          <TableCell className="text-center">{Math.round(dept.avgCompletionHours)}h</TableCell>
                          <TableCell className="text-center">
                            <span className={dept.slaCompliance >= 80 ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                              {dept.slaCompliance}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`font-bold ${dept.score >= 75 ? 'text-emerald-600' : dept.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                              {dept.score}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="flex items-center justify-center">{getTrendIcon(dept.trend)}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB: TRENDS ───────────────────────────────────────────────────────── */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('analytics.reqTrends')}</CardTitle>
              <CardDescription>{t('analytics.reqTrendsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              {isLoadingTrends ? <Skeleton className="w-full h-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
                    <Area type="monotone" dataKey="created" name={t('dashboard.newReqs')} stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorCreated)" />
                    <Area type="monotone" dataKey="completed" name={t('analytics.completed')} stroke="hsl(var(--chart-3))" strokeWidth={2} fill="url(#colorCompleted)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Employee Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('analytics.empPerformance')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEmp ? (
                <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : (
                <div className="space-y-2">
                  {empPerf?.slice(0, 8).map((emp: any) => (
                    <div key={emp.userId} className="flex items-center justify-between gap-3 py-2 border-b last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                            {emp.userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{emp.userName}</p>
                          <p className="text-xs text-muted-foreground truncate">{emp.departmentName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-sm">
                        <span className="text-muted-foreground hidden sm:inline">{emp.completedRequests} {t('analytics.completed').toLowerCase()}</span>
                        <span className={`font-semibold ${emp.slaCompliance >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {emp.slaCompliance}%
                        </span>
                        {getTrendIcon(emp.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
