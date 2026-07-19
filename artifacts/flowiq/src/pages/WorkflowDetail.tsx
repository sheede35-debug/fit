import { useLocation, useParams } from "wouter";
import {
  useGetWorkflow,
  useOptimizeWorkflow,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft, GitBranch, Clock, Activity, BrainCircuit,
  CheckCircle2, Circle, ArrowRight, Sparkles, Timer
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WorkflowDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [, setLocation] = useLocation();
  const { t, isRTL } = useLanguage();

  const { data: wf, isLoading } = useGetWorkflow(id, {
    query: { enabled: !!id }
  });
  const optimizeMut = useOptimizeWorkflow();

  if (isLoading || !wf) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const steps = (wf as any).steps || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Back + Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/workflows')}
          className="gap-1.5 text-muted-foreground hover:text-foreground mb-2 -ms-2 ps-2"
        >
          <ChevronLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
          {t('workflowDetail.backToWorkflows')}
        </Button>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{wf.name}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{wf.description}</p>
          </div>
          <Badge className={`ms-auto ${wf.isActive ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-muted text-muted-foreground'} shadow-none`}>
            {wf.isActive ? t('common.active') : t('common.inactive')}
          </Badge>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Activity className="h-3.5 w-3.5" /> {t('workflowDetail.activeReqs')}
            </div>
            <p className="text-2xl font-bold">{(wf as any).activeRequestsCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> {t('workflowDetail.slaCompliance')}
            </div>
            <p className="text-2xl font-bold text-emerald-600">{wf.slaCompliance ?? 0}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Timer className="h-3.5 w-3.5" /> {t('workflowDetail.avgCompletion')}
            </div>
            <p className="text-2xl font-bold">{wf.avgCompletionHours ?? 0}h</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('workflowDetail.steps')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
              ) : (
                steps.map((step: any, i: number) => (
                  <div key={step.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                        {i + 1}
                      </div>
                      {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-1 mb-0" style={{ minHeight: 12 }} />}
                    </div>
                    <div className="pb-4 flex-1 min-w-0">
                      <p className="text-sm font-semibold">{step.name}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {step.departmentName && (
                          <Badge variant="outline" className="text-xs">{step.departmentName}</Badge>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {step.slaHours}h SLA
                        </span>
                        {step.isRequired && (
                          <Badge className="text-xs bg-blue-500/10 text-blue-600 border-blue-200 shadow-none">{t('workflows.required')}</Badge>
                        )}
                        {step.isParallel && (
                          <Badge className="text-xs bg-purple-500/10 text-purple-600 border-purple-200 shadow-none">{t('workflows.parallel')}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Optimization */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-primary" />
                {t('workflowDetail.aiSuggestions')}
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => optimizeMut.mutate({ workflowId: id })}
              disabled={optimizeMut.isPending}
              className="gap-1.5 shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {optimizeMut.isPending ? t('common.loading') : t('workflows.optimize')}
            </Button>
          </CardHeader>
          <CardContent>
            {!optimizeMut.data ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                <BrainCircuit className="h-10 w-10 mx-auto mb-3 text-primary/30" />
                <p>Click "{t('workflows.optimize')}" to generate AI suggestions for this workflow.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {optimizeMut.data.suggestions?.map((sug: any, i: number) => (
                  <div key={i} className="rounded-lg border bg-muted/30 p-3 space-y-2">
                    <p className="text-sm font-medium">{sug.suggestion}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3 text-emerald-500" />
                        {t('workflowDetail.improvement')}: <span className="font-semibold text-emerald-600 ms-1">{sug.estimatedImprovement}</span>
                      </span>
                      <span>
                        {t('workflowDetail.confidence')}: <span className="font-semibold">{Math.round((sug.confidence || 0) * 100)}%</span>
                      </span>
                    </div>
                    <Progress value={(sug.confidence || 0) * 100} className="h-1" />
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
