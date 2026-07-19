import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateWorkflow, useListDepartments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Plus, Trash2, GitBranch, GripVertical } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Step {
  id: string;
  name: string;
  departmentId: string;
  slaHours: number;
  isParallel: boolean;
  isRequired: boolean;
}

export default function NewWorkflow() {
  const [, setLocation] = useLocation();
  const { data: depts } = useListDepartments();
  const createMut = useCreateWorkflow();
  const { t, isRTL } = useLanguage();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', name: "", departmentId: "", slaHours: 24, isParallel: false, isRequired: true }
  ]);

  const addStep = () => {
    setSteps(prev => [...prev, {
      id: String(Date.now()),
      name: "",
      departmentId: "",
      slaHours: 24,
      isParallel: false,
      isRequired: true
    }]);
  };

  const removeStep = (id: string) => {
    if (steps.length <= 1) return;
    setSteps(prev => prev.filter(s => s.id !== id));
  };

  const updateStep = (id: string, field: keyof Step, value: any) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    createMut.mutate({
      data: {
        name,
        description,
        isActive: false,
        steps: steps.map((s, i) => ({
          stepOrder: i + 1,
          name: s.name || `${t('newWorkflow.stepNum')} ${i + 1}`,
          departmentId: s.departmentId ? parseInt(s.departmentId, 10) : undefined,
          slaHours: s.slaHours,
          isParallel: s.isParallel,
          isRequired: s.isRequired,
        }))
      } as any
    }, {
      onSuccess: (wf) => setLocation(`/workflows/${wf.id}`)
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/workflows')}
          className="gap-1.5 text-muted-foreground hover:text-foreground mb-2 -ms-2 ps-2"
        >
          <ChevronLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
          {t('workflows.backToWorkflows')}
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{t('newWorkflow.title')}</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{t('newWorkflow.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              {t('workflows.workflowName')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">{t('newWorkflow.nameLabel')}</Label>
              <Input
                placeholder={t('newWorkflow.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">{t('newWorkflow.descLabel')}</Label>
              <Textarea
                placeholder={t('newWorkflow.descPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">{t('newWorkflow.steps')}</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addStep} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> {t('newWorkflow.addStep')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step, i) => (
              <div key={step.id} className="rounded-lg border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                    <Badge variant="outline" className="text-xs shrink-0">{t('newWorkflow.stepNum')} {i + 1}</Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeStep(step.id)}
                    disabled={steps.length <= 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{t('common.name')}</Label>
                    <Input
                      placeholder={`${t('newWorkflow.stepNum')} ${i + 1}`}
                      value={step.name}
                      onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{t('newWorkflow.dept')}</Label>
                    <Select value={step.departmentId} onValueChange={(v) => updateStep(step.id, 'departmentId', v)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {depts?.map((d) => (
                          <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{t('newWorkflow.slaHours')}</Label>
                    <Input
                      type="number"
                      min={1}
                      value={step.slaHours}
                      onChange={(e) => updateStep(step.id, 'slaHours', parseInt(e.target.value) || 24)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3 flex-wrap">
          <Button type="button" variant="outline" onClick={() => setLocation('/workflows')} className="flex-1 sm:flex-none">
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={createMut.isPending || !name}
            className="flex-1 sm:flex-none gap-1.5"
          >
            {createMut.isPending ? t('newWorkflow.saving') : t('newWorkflow.saveWorkflow')}
          </Button>
        </div>
      </form>
    </div>
  );
}
