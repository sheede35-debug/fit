import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useListWorkflows } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, GitBranch, Clock, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Workflows() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const { data: workflows, isLoading } = useListWorkflows({ search: search || undefined });
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('workflows.title')}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{t('workflows.subtitle')}</p>
        </div>
        <Link href="/workflows/new">
          <Button className="shadow-sm gap-2">
            <Plus className="h-4 w-4" /> {t('workflows.new')}
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('workflows.searchPlaceholder')}
            className="ps-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : workflows?.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground bg-muted/20 border rounded-xl border-dashed">
            <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground">{t('workflows.none')}</h3>
            <p className="mt-1 text-sm">{t('workflows.noneDesc')}</p>
          </div>
        ) : (
          workflows?.map((wf) => (
            <Card
              key={wf.id}
              className="cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group flex flex-col"
              onClick={() => setLocation(`/workflows/${wf.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                    <GitBranch className="h-5 w-5" />
                  </div>
                  {wf.isActive ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 shadow-none border border-emerald-500/20">{t('common.active')}</Badge>
                  ) : (
                    <Badge variant="secondary">{t('common.inactive')}</Badge>
                  )}
                </div>
                <CardTitle className="text-base group-hover:text-primary transition-colors leading-snug">{wf.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[36px] text-sm">{wf.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 border-t bg-muted/20 grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Activity className="h-3 w-3" /> {t('workflows.stepsLabel')}
                  </span>
                  <p className="font-semibold text-sm">{wf.stepsCount}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t('workflows.avgTime')}
                  </span>
                  <p className="font-semibold text-sm">{wf.avgCompletionHours}h</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
