import { useGetDepartmentPerformance, useGetRequestTrends, useGetEmployeePerformance } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Analytics() {
  const { data: deptPerf, isLoading: isLoadingDept } = useGetDepartmentPerformance({ period: 'month' });
  const { data: trends, isLoading: isLoadingTrends } = useGetRequestTrends({ period: 'month' });
  const { data: empPerf, isLoading: isLoadingEmp } = useGetEmployeePerformance();
  const { t } = useLanguage();

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
    if (trend === 'down') return <ArrowDownRight className="h-4 w-4 text-destructive" />;
    return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('analytics.title')}</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{t('analytics.subtitle')}</p>
      </div>

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
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
                <Area type="monotone" dataKey="created" name={t('dashboard.newReqs')} stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorCreated)" />
                <Area type="monotone" dataKey="completed" name={t('analytics.completed')} stroke="hsl(var(--chart-3))" strokeWidth={2} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Department Performance */}
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
                      <TableHead className="text-center">{t('analytics.trend')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deptPerf?.map((dept) => (
                      <TableRow key={dept.departmentId} className="text-sm">
                        <TableCell className="ps-3 font-medium">{dept.departmentName}</TableCell>
                        <TableCell className="text-center">{dept.completedRequests}</TableCell>
                        <TableCell className="text-center">{dept.avgCompletionHours}h</TableCell>
                        <TableCell className="text-center">
                          <span className={dept.slaCompliance >= 90 ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                            {dept.slaCompliance}%
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
                {empPerf?.slice(0, 8).map((emp) => (
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
                      <span className={`font-semibold ${emp.slaCompliance >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
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
    </div>
  );
}
