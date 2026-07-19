import { useState } from "react";
import { Link } from "wouter";
import { useListRequests } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Filter, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Requests() {
  const [search, setSearch] = useState("");
  const { data: requests, isLoading } = useListRequests({ search: search || undefined });
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    const label = t(`status.${status}`) || status;
    switch (status) {
      case 'completed': return <Badge variant="success">{label}</Badge>;
      case 'active':    return <Badge variant="info">{label}</Badge>;
      case 'rejected':  return <Badge variant="destructive">{label}</Badge>;
      case 'escalated': return <Badge variant="warning">{label}</Badge>;
      default:          return <Badge variant="secondary">{label}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const label = t(`priority.${priority}`) || priority;
    switch (priority) {
      case 'critical': return <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20">{label}</Badge>;
      case 'high':     return <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 shadow-none">{label}</Badge>;
      case 'medium':   return <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 shadow-none">{label}</Badge>;
      default:         return <Badge variant="outline" className="text-slate-500">{label}</Badge>;
    }
  };

  const getDelayRiskIcon = (risk?: string) => {
    if (!risk) return null;
    switch (risk) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'high':     return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'medium':   return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:         return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('requests.title')}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{t('requests.subtitle')}</p>
        </div>
        <Link href="/requests/new">
          <Button className="shadow-sm gap-2">
            <Plus className="h-4 w-4" /> {t('requests.new')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('requests.searchPlaceholder')}
                className="ps-9 bg-muted/40 border-transparent focus-visible:border-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 w-full md:w-auto">
              <Filter className="h-4 w-4" /> {t('common.filter')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 flex gap-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                </div>
              ))}
            </div>
          ) : requests?.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Filter className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>{t('requests.none')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="ps-4">{t('requests.requestTitle')}</TableHead>
                    <TableHead>{t('requests.workflow')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('common.status')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('common.priority')}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t('requests.currentDept')}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t('requests.waitingHours')}</TableHead>
                    <TableHead>{t('requests.delayRisk')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests?.map((req) => (
                    <TableRow key={req.id} className="cursor-pointer hover:bg-muted/30 group">
                      <TableCell className="ps-4">
                        <Link href={`/requests/${req.id}`} className="block">
                          <span className="font-mono text-xs text-muted-foreground">REQ-{req.id.toString().padStart(4, '0')}</span>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">{req.title}</p>
                          <span className="text-xs text-muted-foreground hidden sm:block">
                            {format(new Date(req.createdAt), 'MMM d, yyyy')}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <span className="line-clamp-1">{req.workflowName || '—'}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{getStatusBadge(req.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{getPriorityBadge(req.priority)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{req.currentDepartmentName || '—'}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {req.waitingHours}h
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          {getDelayRiskIcon(req.delayRisk)}
                          {req.delayRisk ? (
                            <span className="text-xs hidden sm:inline">{t(`risk.${req.delayRisk}`)}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </span>
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
  );
}
