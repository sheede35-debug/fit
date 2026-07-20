import { useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  useGetRequest,
  usePredictRequestDelay,
  useAdvanceRequest,
  useRejectRequest,
  useCreateComment,
  useGetRequestJourney,
  getGetRequestQueryKey,
  getPredictRequestDelayQueryKey,
  getGetRequestJourneyQueryKey,
  getListCommentsQueryKey,
} from "@workspace/api-client-react";
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2, Clock, XCircle, ArrowRight, BrainCircuit,
  Paperclip, Send, AlertTriangle, FileText, Activity,
  ChevronLeft, Route, Sparkles, Building2, User as UserIcon,
  Circle, CircleDot, Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RequestDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [, setLocation] = useLocation();
  const { t, isRTL } = useLanguage();

  const [commentText, setCommentText] = useState("");
  const [advanceComment, setAdvanceComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // Optimistic comments shown instantly before the server round-trip
  const [optimisticComments, setOptimisticComments] = useState<
    Array<{ _optimisticId: string; content: string; authorName: string; createdAt: string }>
  >([]);

  const { data: req, isLoading } = useGetRequest(id, {
    query: { enabled: !!id, queryKey: getGetRequestQueryKey(id) }
  });

  const { data: prediction } = usePredictRequestDelay(id, {
    query: { enabled: !!id && !!req && req.status !== 'completed' && req.status !== 'rejected', queryKey: getPredictRequestDelayQueryKey(id) }
  });

  const { data: journey } = useGetRequestJourney(id, {
    query: { enabled: !!id && !!req, queryKey: getGetRequestJourneyQueryKey(id) }
  });

  const advanceMut = useAdvanceRequest();
  const rejectMut = useRejectRequest();
  const commentMut = useCreateComment();

  const handleAdvance = () => {
    advanceMut.mutate({ requestId: id, data: { comment: advanceComment } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetRequestQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: ["listRequests"] });
        setAdvanceComment("");
      }
    });
  };

  const handleReject = () => {
    rejectMut.mutate({ requestId: id, data: { reason: rejectReason } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetRequestQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: ["listRequests"] });
        setRejectReason("");
      }
    });
  };

  const handleComment = () => {
    const content = commentText.trim();
    if (!content || commentMut.isPending) return;

    // Show comment instantly before the server responds
    const optimisticId = `opt-${Date.now()}`;
    setOptimisticComments(prev => [
      ...prev,
      { _optimisticId: optimisticId, content, authorName: "You", createdAt: new Date().toISOString() },
    ]);
    setCommentText("");

    // ✅ Correct shape: requestId as path param, content in body
    commentMut.mutate(
      { requestId: id, data: { content } },
      {
        onSuccess: () => {
          // Remove the optimistic entry — server data will replace it via invalidation
          setOptimisticComments(prev => prev.filter(c => c._optimisticId !== optimisticId));
          queryClient.invalidateQueries({ queryKey: getGetRequestQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey(id) });
          toast({ title: "Comment posted", description: "Your comment has been saved." });
        },
        onError: (err: any) => {
          // Roll back the optimistic entry and restore the input text
          setOptimisticComments(prev => prev.filter(c => c._optimisticId !== optimisticId));
          setCommentText(content);
          toast({
            title: "Failed to post comment",
            description: err?.message ?? "Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

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

  const getRiskLabel = (risk?: string) => {
    if (!risk || risk === 'low') return { label: t('requests.risk.onTrack'), color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (risk === 'medium') return { label: t('requests.risk.atRisk'), color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: t('requests.risk.delayed'), color: 'text-red-600 bg-red-50 border-red-200' };
  };

  if (isLoading || !req) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const riskLabel = getRiskLabel(req.delayRisk ?? undefined);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Back + Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/requests')}
            className="gap-1.5 text-muted-foreground hover:text-foreground mb-2 -ms-2 ps-2"
          >
            <ChevronLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            {t('requests.backToRequests')}
          </Button>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-sm text-muted-foreground">REQ-{req.id.toString().padStart(4, '0')}</span>
            <Badge variant="outline">{req.workflowName || t('requests.customRequest')}</Badge>
            {getStatusBadge(req.status)}
            {/* Risk chip inline */}
            <span className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-0.5 border ${riskLabel.color}`}>
              {riskLabel.label}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-2">{req.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Request Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {t('requests.details')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{req.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">{t('common.priority')}</p>
                  <Badge className="capitalize">{t(`priority.${req.priority}`) || req.priority}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">{t('common.department')}</p>
                  <p className="font-medium">{req.currentDepartmentName || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">{t('requests.waitingHours')}</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {req.waitingHours}h
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">{t('common.createdAt')}</p>
                  <p className="font-medium">{format(new Date(req.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>

              {/* Progress */}
              {req.progressPercent !== undefined && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('requests.progress')}</span>
                    <span className="font-medium text-foreground">{req.progressPercent}%</span>
                  </div>
                  <Progress value={req.progressPercent} className="h-2" />
                </div>
              )}

              {/* Actions */}
              {req.status !== 'completed' && req.status !== 'rejected' && (
                <div className="pt-2 border-t space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder={t('requests.advanceNote')}
                      value={advanceComment}
                      onChange={(e) => setAdvanceComment(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAdvance}
                      disabled={advanceMut.isPending}
                      className="gap-1.5 shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t('requests.advance')}
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder={t('requests.rejectionReason')}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={rejectMut.isPending || !rejectReason.trim()}
                      className="gap-1.5 shrink-0"
                    >
                      <XCircle className="h-4 w-4" />
                      {t('requests.reject')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Request Journey Visualization ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Route className="h-4 w-4 text-primary" />
                {t('requests.journeyTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Journey analysis tip */}
              {journey?.improvementTips && journey.improvementTips.length > 0 && journey.totalDelayHours > 0 && (
                <div className="flex gap-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                  <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">{journey.improvementTips[0]}</p>
                </div>
              )}

              {/* Journey stage stepper */}
              {journey?.stages && journey.stages.length > 0 ? (
                <div className="space-y-0">
                  {journey.stages.map((stage: any, i: number) => {
                    const isLast = i === journey.stages.length - 1;
                    return (
                      <div key={i} className="flex gap-3">
                        {/* Timeline column */}
                        <div className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${
                            stage.status === 'active'
                              ? 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20'
                              : stage.status === 'delayed'
                              ? 'bg-red-50 border-red-400 text-red-500'
                              : 'bg-emerald-50 border-emerald-400 text-emerald-600'
                          }`}>
                            {stage.status === 'active'
                              ? <CircleDot className="h-4 w-4" />
                              : stage.status === 'delayed'
                              ? <AlertTriangle className="h-3.5 w-3.5" />
                              : <CheckCircle2 className="h-3.5 w-3.5" />
                            }
                          </div>
                          {!isLast && <div className="w-0.5 flex-1 bg-border mt-1 mb-1 min-h-[24px]" />}
                        </div>

                        {/* Stage info */}
                        <div className={`flex-1 pb-4 min-w-0 ${isLast ? 'pb-0' : ''}`}>
                          <div className={`rounded-lg border p-3 ${
                            stage.status === 'active' ? 'border-primary/30 bg-primary/5' :
                            stage.status === 'delayed' ? 'border-red-200 bg-red-50/40 dark:bg-red-950/20' :
                            'border-border bg-muted/20'
                          }`}>
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <p className="text-sm font-semibold">{stage.stageName}</p>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />{stage.departmentName}
                                  </span>
                                  {stage.assigneeName && (
                                    <span className="flex items-center gap-1">
                                      <UserIcon className="h-3 w-3" />{stage.assigneeName}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />{stage.durationHours}h
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {stage.isOverSla && (
                                  <Badge className="text-xs bg-red-100 text-red-600 border border-red-200 shadow-none">
                                    +{stage.delayHours}h
                                  </Badge>
                                )}
                                <Badge variant="outline" className={`text-xs ${
                                  stage.status === 'active' ? 'border-primary/30 text-primary' :
                                  stage.status === 'delayed' ? 'border-red-300 text-red-600' :
                                  'border-emerald-300 text-emerald-600'
                                }`}>
                                  {stage.status === 'active' ? t('status.active') :
                                   stage.status === 'delayed' ? t('requests.risk.delayed') :
                                   t('status.completed')}
                                </Badge>
                              </div>
                            </div>

                            {/* SLA usage bar */}
                            <div className="mt-2 space-y-0.5">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{t('requests.slaUsage')}</span>
                                <span className={stage.slaUsagePercent > 100 ? 'text-red-500 font-semibold' : ''}>{Math.min(stage.slaUsagePercent, 150)}%</span>
                              </div>
                              <Progress
                                value={Math.min(stage.slaUsagePercent, 100)}
                                className={`h-1.5 ${
                                  stage.slaUsagePercent > 100 ? '[&>div]:bg-red-500' :
                                  stage.slaUsagePercent > 70 ? '[&>div]:bg-amber-500' :
                                  '[&>div]:bg-emerald-500'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : req.timeline?.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('requests.noTimeline')}</p>
              ) : (
                /* Fallback: basic timeline */
                <div className="space-y-3">
                  {req.timeline?.map((event: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        {i < (req.timeline?.length ?? 0) - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                      </div>
                      <div className="pb-4 min-w-0">
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(event.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {t('requests.comments')}
                {((req.comments?.length ?? 0) + optimisticComments.length) > 0 && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {(req.comments?.length ?? 0) + optimisticComments.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Merge server comments with optimistic ones, sorted by time */}
              {(() => {
                const serverComments: any[] = req.comments ?? [];
                // Only show optimistic entries that aren't already in the server list
                const pendingOptimistic = optimisticComments.filter(
                  oc => !serverComments.some(sc => sc.content === oc.content)
                );
                const allComments = [...serverComments, ...pendingOptimistic].sort(
                  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );

                if (allComments.length === 0) {
                  return <p className="text-sm text-muted-foreground">{t('requests.noComments')}</p>;
                }

                return (
                  <div className="space-y-3">
                    {allComments.map((comment: any, i: number) => {
                      const isOptimistic = !!comment._optimisticId;
                      return (
                        <div
                          key={comment._optimisticId ?? comment.id ?? i}
                          className={`flex gap-3 transition-opacity duration-200 ${isOptimistic ? 'opacity-60' : 'opacity-100'}`}
                        >
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                              {comment.authorName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold">{comment.authorName}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                              </span>
                              {isOptimistic && (
                                <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                  sending…
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Input row */}
              <div className="flex gap-2 pt-2 border-t">
                <Input
                  placeholder={t('requests.writeComment')}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
                  disabled={commentMut.isPending}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleComment}
                  disabled={!commentText.trim() || commentMut.isPending}
                  className="shrink-0"
                  title="Send comment"
                >
                  {commentMut.isPending
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Send className="h-4 w-4" />
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* AI Prediction */}
          {prediction && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  {t('requests.aiPrediction')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {/* Risk level chip */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('requests.riskLevel')}</span>
                  <span className={`font-bold text-sm px-2.5 py-1 rounded-full border ${getRiskLabel(prediction.riskLevel ?? undefined).color}`}>
                    {getRiskLabel(prediction.riskLevel ?? undefined).label}
                  </span>
                </div>

                {/* Delay probability */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('requests.delayProbability')}</span>
                    <span className={`font-bold text-lg ${prediction.delayProbability > 0.6 ? 'text-red-500' : prediction.delayProbability > 0.3 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {Math.round((prediction.delayProbability ?? 0) * 100)}%
                    </span>
                  </div>
                  <Progress value={(prediction.delayProbability ?? 0) * 100} className="h-2" />
                </div>

                {/* Estimated completion */}
                {prediction.estimatedCompletionDate && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">{t('requests.estimatedCompletion')}</p>
                    <p className="font-semibold text-sm">
                      {format(new Date(prediction.estimatedCompletionDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ~{prediction.estimatedRemainingDays} {t('requests.daysRemaining')}
                    </p>
                  </div>
                )}

                {/* Risk factors */}
                {prediction.factors && prediction.factors.length > 0 && (
                  <div>
                    <p className="font-medium mb-2 text-xs text-muted-foreground uppercase tracking-wide">{t('requests.riskFactors')}</p>
                    <div className="space-y-1.5">
                      {prediction.factors.map((factor: string, i: number) => (
                        <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence */}
                {prediction.confidenceScore && (
                  <p className="text-xs text-muted-foreground">
                    {t('requests.confidence')}: {Math.round(prediction.confidenceScore * 100)}%
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                {t('requests.attachments')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {req.attachments?.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('requests.noAttachments')}</p>
              ) : (
                <div className="space-y-2">
                  {req.attachments?.map((att: any) => (
                    <div key={att.id} className="flex items-center gap-2 text-sm py-1">
                      <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{att.fileName || att.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
