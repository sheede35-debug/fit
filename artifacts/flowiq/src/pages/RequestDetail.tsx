import { useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  useGetRequest,
  usePredictRequestDelay,
  useAdvanceRequest,
  useRejectRequest,
  useCreateComment
} from "@workspace/api-client-react";
import { queryClient } from "@/lib/queryClient";
import { getGetRequestQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2, Clock, XCircle, ArrowRight, BrainCircuit,
  Paperclip, Send, AlertTriangle, FileText, Activity,
  ChevronLeft
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

  const { data: req, isLoading } = useGetRequest(id, {
    query: { enabled: !!id, queryKey: getGetRequestQueryKey(id) }
  });

  const { data: prediction } = usePredictRequestDelay(id, {
    query: { enabled: !!id && !!req && req.status !== 'completed' && req.status !== 'rejected' }
  });

  const advanceMut = useAdvanceRequest();
  const rejectMut = useRejectRequest();
  const commentMut = useCreateComment();

  const handleAdvance = () => {
    advanceMut.mutate({ data: { comment: advanceComment } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetRequestQueryKey(id) });
        setAdvanceComment("");
      }
    });
  };

  const handleReject = () => {
    rejectMut.mutate({ data: { reason: rejectReason } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetRequestQueryKey(id) });
        setRejectReason("");
      }
    });
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    commentMut.mutate({ data: { content: commentText, requestId: id } as any }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetRequestQueryKey(id) });
        setCommentText("");
      }
    });
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
            <Badge variant="outline">{req.workflowName || 'Custom Request'}</Badge>
            {getStatusBadge(req.status)}
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
                  <div className="flex gap-2">
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
                  <div className="flex gap-2">
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

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                {t('requests.timeline')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {req.timeline?.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('requests.noTimeline')}</p>
              ) : (
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
                        <p className="text-sm font-medium">{event.action}</p>
                        {event.comment && <p className="text-xs text-muted-foreground mt-0.5">{event.comment}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.actorName} · {format(new Date(event.createdAt), 'MMM d, h:mm a')}
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
              <CardTitle className="text-base">{t('requests.comments')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {req.comments?.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('requests.noComments')}</p>
              ) : (
                <div className="space-y-3">
                  {req.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {comment.authorName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{comment.authorName}</span>
                          <span className="text-xs text-muted-foreground">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment */}
              <div className="flex gap-2 pt-2 border-t">
                <Input
                  placeholder={t('requests.writeComment')}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleComment}
                  disabled={!commentText.trim() || commentMut.isPending}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
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
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('requests.delayProbability')}</span>
                  <span className={`font-bold text-lg ${prediction.delayProbability > 0.6 ? 'text-red-500' : prediction.delayProbability > 0.3 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {Math.round((prediction.delayProbability ?? 0) * 100)}%
                  </span>
                </div>
                <Progress value={(prediction.delayProbability ?? 0) * 100} className="h-2" />

                {prediction.estimatedCompletionHours && (
                  <div className="flex justify-between items-center py-2 border-t">
                    <span className="text-muted-foreground">{t('requests.estimatedCompletion')}</span>
                    <span className="font-semibold">{prediction.estimatedCompletionHours}h</span>
                  </div>
                )}

                {prediction.riskFactors?.length > 0 && (
                  <div>
                    <p className="font-medium mb-1.5">{t('requests.riskFactors')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {prediction.riskFactors.map((factor: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
                      <span className="truncate">{att.name}</span>
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
