import { useState } from "react";
import { useLocation } from "wouter";
import { useListWorkflows, useCreateRequest, useClassifyRequest } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, BrainCircuit, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NewRequest() {
  const [, setLocation] = useLocation();
  const { data: workflows, isLoading: isLoadingWorkflows } = useListWorkflows({});
  const createMut = useCreateRequest();
  const classifyMut = useClassifyRequest();
  const { t, isRTL } = useLanguage();

  const [form, setForm] = useState({
    title: "",
    description: "",
    workflowId: "",
    priority: "medium" as string,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.workflowId) return;
    createMut.mutate({
      data: {
        title: form.title,
        description: form.description,
        workflowId: parseInt(form.workflowId, 10),
        priority: form.priority,
      } as any
    }, {
      onSuccess: (req) => {
        setLocation(`/requests/${req.id}`);
      }
    });
  };

  const handleAiClassify = () => {
    if (!form.title && !form.description) return;
    classifyMut.mutate({
      data: { title: form.title, description: form.description }
    }, {
      onSuccess: (res) => {
        if (res.priority) setForm(f => ({ ...f, priority: res.priority! }));
        if (res.workflowId) setForm(f => ({ ...f, workflowId: String(res.workflowId) }));
      }
    });
  };

  const priorities = [
    { value: 'low', label: t('priority.low') },
    { value: 'medium', label: t('priority.medium') },
    { value: 'high', label: t('priority.high') },
    { value: 'critical', label: t('priority.critical') },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
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
        <h1 className="text-2xl font-bold tracking-tight">{t('newRequest.title')}</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{t('newRequest.subtitle')}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Workflow */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">{t('newRequest.selectWorkflow')}</Label>
              {isLoadingWorkflows ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={form.workflowId} onValueChange={(v) => setForm(f => ({ ...f, workflowId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('newRequest.selectWorkflowPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {workflows?.map((wf) => (
                      <SelectItem key={wf.id} value={String(wf.id)}>{wf.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">{t('newRequest.titleLabel')}</Label>
              <Input
                placeholder={t('newRequest.titlePlaceholder')}
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">{t('newRequest.descLabel')}</Label>
              <Textarea
                placeholder={t('newRequest.descPlaceholder')}
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Priority + AI Classify */}
            <div className="flex gap-3 items-end flex-wrap">
              <div className="space-y-1.5 flex-1 min-w-[140px]">
                <Label className="text-sm font-medium">{t('newRequest.priorityLabel')}</Label>
                <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAiClassify}
                disabled={classifyMut.isPending || (!form.title && !form.description)}
                className="gap-1.5 shrink-0"
              >
                <BrainCircuit className="h-4 w-4 text-primary" />
                {classifyMut.isPending ? t('newRequest.classifying') : t('newRequest.aiClassify')}
              </Button>
            </div>

            {/* Priority badge */}
            {form.priority && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{t('common.priority')}:</span>
                <Badge className="capitalize">{t(`priority.${form.priority}`)}</Badge>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t flex-wrap">
              <Button type="button" variant="outline" onClick={() => setLocation('/requests')} className="flex-1 sm:flex-none">
                {t('newRequest.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={createMut.isPending || !form.title || !form.workflowId}
                className="flex-1 sm:flex-none gap-1.5"
              >
                <Plus className="h-4 w-4" />
                {createMut.isPending ? t('newRequest.submitting') : t('newRequest.submitRequest')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
