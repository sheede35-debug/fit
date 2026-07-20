import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FileBarChart2, Sparkles, RefreshCw, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Clock, Building2, ArrowRight, Minus,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function useAiReport(period: "weekly" | "monthly") {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
      const res = await fetch(`${base}/api/ai/reports?period=${period}`);
      if (!res.ok) throw new Error("Failed to generate report");
      const json = await res.json();
      setData(json);
      setGenerated(true);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, generated, generate };
}

interface ReportViewProps {
  data: any;
  period: "weekly" | "monthly";
}

function ReportView({ data, period }: ReportViewProps) {
  const { t, isRTL } = useLanguage();

  const trendIcon = (trend: string) => {
    if (trend === "improving") return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    if (trend === "declining") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const impactColor = (impact: string) => {
    if (impact === "high") return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900";
    if (impact === "medium") return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-400">
      {/* Headline KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('reports.totalNew'), value: data.newRequests, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
          { label: t('reports.completed'), value: data.completedRequests, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
          { label: t('reports.delayed'), value: data.delayedRequests, color: "text-red-700", bg: "bg-red-50 border-red-200" },
          { label: t('reports.avgCompletion'), value: `${data.avgCompletionHours}h`, color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-xl border p-4 ${bg}`}>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* SLA + Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('reports.slaCompliance')}</span>
              <span className={`text-lg font-bold ${data.slaComplianceRate >= 0.8 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {Math.round(data.slaComplianceRate * 100)}%
              </span>
            </div>
            <Progress value={data.slaComplianceRate * 100} className="h-3" />
            <p className="text-xs text-muted-foreground">{t('reports.slaDesc')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                {trendIcon(data.performanceTrend)}
              </div>
              <div>
                <p className="text-sm font-medium">{t('reports.overallTrend')}</p>
                <p className={`text-lg font-bold capitalize ${
                  data.performanceTrend === "improving" ? "text-emerald-600" :
                  data.performanceTrend === "declining" ? "text-red-600" : "text-muted-foreground"
                }`}>
                  {t(`reports.trend.${data.performanceTrend}`) || data.performanceTrend}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-3 text-xs text-muted-foreground flex-wrap">
              {data.bestPerformingDepartment && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {t('reports.best')}: <span className="font-semibold text-foreground ms-1">{data.bestPerformingDepartment}</span>
                </span>
              )}
              {data.slowestDepartment && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  {t('reports.slowest')}: <span className="font-semibold text-foreground ms-1">{data.slowestDepartment}</span>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Department Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {t('reports.deptPerformance')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="ps-4">{t('reports.deptName')}</TableHead>
                    <TableHead className="text-center">{t('reports.completed')}</TableHead>
                    <TableHead className="text-center">{t('reports.avgHours')}</TableHead>
                    <TableHead className="text-center">{t('reports.slaRate')}</TableHead>
                    <TableHead className="text-center">{t('reports.score')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.departmentSummary?.map((dept: any) => (
                    <TableRow key={dept.departmentName} className="text-sm">
                      <TableCell className="ps-4 font-medium">{dept.departmentName}</TableCell>
                      <TableCell className="text-center">{dept.completedRequests}</TableCell>
                      <TableCell className="text-center">{dept.avgHours}h</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${dept.slaRate >= 0.8 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {Math.round(dept.slaRate * 100)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-bold ${dept.score >= 75 ? 'text-emerald-600' : dept.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                          {dept.score}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top Issues + Recommendations */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {t('reports.topIssues')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.topIssues?.map((issue: any, i: number) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${impactColor(issue.impact)}`}>
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="leading-relaxed">{issue.issue}</p>
                    <p className="text-xs mt-1 opacity-75">{t('reports.affectedCount')}: {issue.count}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {t('reports.recommendations')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.recommendations?.map((rec: string, i: number) => (
                <div key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                  <ArrowRight className={`h-3.5 w-3.5 shrink-0 mt-0.5 text-primary ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{rec}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delay Causes */}
      {data.mainDelayCauses?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('reports.delayCauses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.mainDelayCauses.map((cause: string, i: number) => (
                <Badge key={i} variant="outline" className="text-sm">{cause}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-end">
        {t('reports.generatedAt')}: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}

export default function Reports() {
  const { t } = useLanguage();
  const [activePeriod, setActivePeriod] = useState<"weekly" | "monthly">("weekly");

  const weekly = useAiReport("weekly");
  const monthly = useAiReport("monthly");

  const current = activePeriod === "weekly" ? weekly : monthly;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
            <FileBarChart2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('reports.title')}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{t('reports.subtitle')}</p>
          </div>
        </div>

        {/* Period tabs + Generate */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-lg border bg-muted/40 p-1 gap-1">
            {(["weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  activePeriod === p
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "weekly" ? t('reports.weekly') : t('reports.monthly')}
              </button>
            ))}
          </div>
          <Button
            onClick={() => current.generate()}
            disabled={current.loading}
            className="gap-2"
          >
            {current.loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {current.loading ? t('reports.generating') : (current.generated ? t('reports.regenerate') : t('reports.generate'))}
          </Button>
        </div>
      </div>

      {/* Content */}
      {!current.generated && !current.loading && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <FileBarChart2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold mb-2">
              {activePeriod === "weekly" ? t('reports.emptyWeekly') : t('reports.emptyMonthly')}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              {t('reports.emptyDesc')}
            </p>
            <Button onClick={() => current.generate()} className="gap-2">
              <Sparkles className="h-4 w-4" />
              {t('reports.generate')}
            </Button>
          </CardContent>
        </Card>
      )}

      {current.loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      )}

      {current.error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-8 text-center text-destructive">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">{t('reports.errorTitle')}</p>
            <p className="text-sm mt-1">{current.error}</p>
          </CardContent>
        </Card>
      )}

      {current.generated && current.data && !current.loading && (
        <ReportView data={current.data} period={activePeriod} />
      )}
    </div>
  );
}
