import { useState } from "react";
import { useGetAiInsights, useGetWeeklySummary, useChatWithAi, useRunWhatIfSimulation, useListDepartments, useListRequests, useGetRequestJourney, getGetRequestJourneyQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BrainCircuit, AlertTriangle, Lightbulb, UserX, Send, Bot, User, Sparkles,
  SlidersHorizontal, ArrowRight, ChevronDown, ChevronUp, Clock, CheckCircle2, Circle,
  Route,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

// ── Journey Analysis Section ────────────────────────────────────────────────
function JourneyStageRow({ stage, index }: { stage: any; index: number }) {
  const { t } = useLanguage();
  return (
    <div className={`rounded-lg border p-3 ${
      stage.status === 'delayed' ? 'border-red-200 bg-red-50/40 dark:bg-red-950/20' :
      stage.status === 'active' ? 'border-primary/30 bg-primary/5' :
      'border-border bg-muted/20'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
            stage.status === 'delayed' ? 'bg-red-100 text-red-600' :
            stage.status === 'active' ? 'bg-primary/10 text-primary' :
            'bg-emerald-100 text-emerald-600'
          }`}>
            {stage.status === 'completed' ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{stage.stageName}</p>
            <p className="text-xs text-muted-foreground">{stage.departmentName}{stage.assigneeName ? ` · ${stage.assigneeName}` : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className={`text-xs ${
            stage.status === 'delayed' ? 'text-red-600 border-red-300 bg-red-50' :
            stage.status === 'active' ? 'text-primary border-primary/30 bg-primary/5' :
            'text-emerald-600 border-emerald-300 bg-emerald-50'
          }`}>
            {stage.durationHours}h
          </Badge>
          {stage.isOverSla && (
            <Badge className="text-xs bg-red-100 text-red-600 border border-red-200 shadow-none">
              +{stage.delayHours}h {t('ai.journey.delay')}
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t('ai.journey.slaUsage')}</span>
          <span className={stage.slaUsagePercent > 100 ? 'text-red-500 font-semibold' : 'text-foreground'}>{Math.min(stage.slaUsagePercent, 150)}%</span>
        </div>
        <Progress
          value={Math.min(stage.slaUsagePercent, 100)}
          className={`h-1.5 ${stage.slaUsagePercent > 100 ? '[&>div]:bg-red-500' : stage.slaUsagePercent > 70 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
        />
      </div>
    </div>
  );
}

function JourneyAnalysisPanel() {
  const { t } = useLanguage();
  const { data: requests } = useListRequests({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: journey, isLoading: isLoadingJourney } = useGetRequestJourney(selectedId ?? 0, {
    query: { enabled: !!selectedId, queryKey: getGetRequestJourneyQueryKey(selectedId ?? 0) }
  });

  const activeRequests = requests?.filter(r => r.status === 'active' || r.status === 'pending') ?? [];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('ai.journey.desc')}</p>

      {/* Request selector */}
      <div className="space-y-1.5">
        <Label className="text-sm">{t('ai.journey.selectRequest')}</Label>
        <Select value={selectedId ? String(selectedId) : ""} onValueChange={(v) => setSelectedId(Number(v))}>
          <SelectTrigger>
            <SelectValue placeholder={t('ai.journey.selectPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {activeRequests.map((r) => (
              <SelectItem key={r.id} value={String(r.id)}>
                REQ-{r.id.toString().padStart(4, '0')} · {r.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Journey result */}
      {selectedId && isLoadingJourney && (
        <div className="space-y-2">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      )}

      {journey && !isLoadingJourney && (
        <div className="space-y-4">
          {/* Summary row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t('ai.journey.totalStages'), value: journey.totalStages },
              { label: t('ai.journey.completedStages'), value: journey.completedStages },
              { label: t('ai.journey.totalDelay'), value: `${journey.totalDelayHours}h`, accent: journey.totalDelayHours > 0 ? 'text-red-600' : 'text-emerald-600' },
              { label: t('ai.journey.risk'), value: t(`risk.${journey.overallRisk}`) || journey.overallRisk, accent: journey.overallRisk === 'low' ? 'text-emerald-600' : journey.overallRisk === 'medium' ? 'text-amber-600' : 'text-red-600' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className={`font-bold text-base ${accent || ''}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Bottleneck tip */}
          {journey.improvementTips?.length > 0 && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1.5">{t('ai.journey.tips')}</p>
              {journey.improvementTips.map((tip: string, i: number) => (
                <div key={i} className="flex gap-2 text-xs text-amber-700 dark:text-amber-300 mt-1">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stages */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('ai.journey.stages')}</p>
            {journey.stages?.map((stage: any, i: number) => (
              <JourneyStageRow key={i} stage={stage} index={i} />
            ))}
          </div>
        </div>
      )}

      {selectedId && !journey && !isLoadingJourney && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          <Route className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>{t('ai.journey.noData')}</p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AiHub() {
  const { data: insights, isLoading: isLoadingInsights } = useGetAiInsights();
  const { data: summary, isLoading: isLoadingSummary } = useGetWeeklySummary();
  const { data: depts } = useListDepartments();
  const chatMut = useChatWithAi();
  const simMut = useRunWhatIfSimulation();
  const { t, isRTL } = useLanguage();

  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([
    { role: 'ai', content: t('ai.chatGreeting') }
  ]);
  const [journeyOpen, setJourneyOpen] = useState(false);

  const [simScenario, setSimScenario] = useState("");
  const [simDept, setSimDept] = useState<string>("");
  const [simAddEmp, setSimAddEmp] = useState<number>(1);

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    const newMsg = chatMessage;
    setChatMessage("");
    setMessages(prev => [...prev, { role: 'user', content: newMsg }]);
    chatMut.mutate({ data: { message: newMsg } }, {
      onSuccess: (res) => {
        setMessages(prev => [...prev, { role: 'ai', content: res.message }]);
      }
    });
  };

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simScenario) return;
    simMut.mutate({
      data: {
        scenario: simScenario,
        departmentId: simDept ? parseInt(simDept, 10) : undefined,
        additionalEmployees: simAddEmp
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('ai.title')}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{t('ai.subtitle')}</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoadingInsights ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : insights ? (
          <>
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t('ai.riskScore')}</span>
                  <BrainCircuit className="h-4 w-4 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">{insights.riskScore}<span className="text-sm">/100</span></div>
                <Progress value={insights.riskScore} className="mt-2 h-1.5" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t('ai.bottlenecks')}</span>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-3xl font-bold">{insights.bottlenecks?.length ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('ai.bottlenecks')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t('ai.overloaded')}</span>
                  <UserX className="h-4 w-4 text-red-500" />
                </div>
                <div className="text-3xl font-bold">{insights.overloadedEmployees?.length ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('ai.overloaded')}</p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Journey Analysis Accordion */}
      <Card>
        <CardHeader
          className="cursor-pointer select-none pb-3"
          onClick={() => setJourneyOpen(v => !v)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Route className="h-4 w-4 text-primary" />
              {t('ai.journey.title')}
            </CardTitle>
            {journeyOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
          {!journeyOpen && <p className="text-xs text-muted-foreground mt-1">{t('ai.journey.collapsed')}</p>}
        </CardHeader>
        {journeyOpen && (
          <CardContent className="pt-0">
            <JourneyAnalysisPanel />
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* AI Insights */}
        {insights && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                {t('ai.recommendations')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.topRecommendations?.map((rec: string, i: number) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">{rec}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Weekly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {t('ai.weeklySummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
              </div>
            ) : summary ? (
              <div className="space-y-4 text-sm">
                {summary.bestDepartment && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{t('ai.bestDept')}</span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 shadow-none border border-emerald-500/20">{summary.bestDepartment}</Badge>
                  </div>
                )}
                {summary.slowestDepartment && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{t('ai.slowestDept')}</span>
                    <Badge variant="destructive" className="bg-red-500/10 text-red-500 shadow-none border border-red-500/20">{summary.slowestDepartment}</Badge>
                  </div>
                )}
                {summary.mainDelayCauses?.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">{t('ai.delayCauses')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {summary.mainDelayCauses.map((cause: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{cause}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {summary.recommendations?.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium">{t('ai.recommendations')}</p>
                    {summary.recommendations.map((rec: string, i: number) => (
                      <div key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <ArrowRight className={`h-3.5 w-3.5 shrink-0 mt-0.5 text-primary ${isRTL ? 'rotate-180' : ''}`} />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* AI Chat */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              {t('ai.chatTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1">
            <div className="flex-1 space-y-3 max-h-[320px] overflow-y-auto pe-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${
                    msg.role === 'user'
                      ? (isRTL ? '' : 'flex-row-reverse')
                      : (isRTL ? 'flex-row-reverse' : '')
                  }`}
                >
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'ai' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {msg.role === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-xl px-4 py-2.5 text-sm max-w-[80%] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'ai'
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatMut.isPending && (
                <div className={`flex gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-7 w-7 rounded-full flex items-center justify-center bg-primary/10 text-primary shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-xl px-4 py-2.5">
                    <div className="flex gap-1 items-center h-4">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={t('ai.chatPlaceholder')}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendChat} disabled={!chatMessage.trim() || chatMut.isPending} className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What-If Simulation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              {t('ai.whatIf')}
            </CardTitle>
            <CardDescription className="text-sm">{t('ai.whatIfDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRunSimulation} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm">{t('ai.scenarioLabel')}</Label>
                <Input
                  placeholder={t('ai.scenarioPlaceholder')}
                  value={simScenario}
                  onChange={(e) => setSimScenario(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">{t('ai.dept')}</Label>
                  <Select value={simDept} onValueChange={setSimDept}>
                    <SelectTrigger><SelectValue placeholder={t('common.all')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('common.all')}</SelectItem>
                      {depts?.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">{t('ai.additionalEmployees')}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={simAddEmp}
                    onChange={(e) => setSimAddEmp(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={!simScenario || simMut.isPending}>
                <Sparkles className="h-4 w-4" />
                {simMut.isPending ? t('common.loading') : t('ai.simulate')}
              </Button>
            </form>

            {simMut.data && (
              <div className="mt-4 space-y-3 pt-4 border-t">
                <p className="text-sm font-semibold">{t('ai.simMetrics')}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { label: t('ai.avgCompletionHrs'), key: 'avgCompletionHours', suffix: 'h', from: (simMut.data as any).currentMetrics?.avgCompletionHours, to: (simMut.data as any).simulatedMetrics?.avgCompletionHours },
                    { label: t('ai.slaCompliance'), key: 'slaComplianceRate', suffix: '%', from: Math.round(((simMut.data as any).currentMetrics?.slaComplianceRate ?? 0) * 100), to: Math.round(((simMut.data as any).simulatedMetrics?.slaComplianceRate ?? 0) * 100) },
                  ].map(({ label, key, suffix, from, to }) => (
                    <div key={key} className="rounded-lg bg-muted/50 p-2.5">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground line-through text-xs">{from}{suffix}</span>
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        <span className="font-bold text-primary">{to}{suffix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
