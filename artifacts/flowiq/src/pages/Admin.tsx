import { useState } from "react";
import { useListUsers, useListDepartments, useListCompanies, useHealthCheck } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Building2, Shield, Activity, Globe, FlaskConical } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Admin() {
  const { data: users, isLoading: isLoadingUsers } = useListUsers({});
  const { data: depts, isLoading: isLoadingDepts } = useListDepartments();
  const { data: companies, isLoading: isLoadingCompanies } = useListCompanies();
  const { data: health, isLoading: isLoadingHealth } = useHealthCheck();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.title')}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{t('admin.subtitle')}</p>
        </div>
        <Badge
          variant={health?.status === 'ok' ? 'success' : 'outline'}
          className="gap-1.5 px-3 py-1 shrink-0"
        >
          <Activity className="h-3 w-3" />
          {t('admin.systemStatus')}: {isLoadingHealth ? t('admin.checking') : health?.status || t('admin.unknown')}
        </Badge>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 flex-wrap h-auto gap-0.5">
          <TabsTrigger value="users" className="data-[state=active]:bg-background gap-1.5">
            <Users className="w-4 h-4" /> {t('admin.users')}
          </TabsTrigger>
          <TabsTrigger value="departments" className="data-[state=active]:bg-background gap-1.5">
            <Building2 className="w-4 h-4" /> {t('admin.departments')}
          </TabsTrigger>
          <TabsTrigger value="companies" className="data-[state=active]:bg-background gap-1.5">
            <Globe className="w-4 h-4" /> {t('admin.companies')}
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-background gap-1.5">
            <Shield className="w-4 h-4" /> {t('admin.security')}
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-background gap-1.5">
            <Settings className="w-4 h-4" /> {t('admin.settings')}
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('admin.employees')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingUsers ? (
                <div className="divide-y">{Array(5).fill(0).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-10 w-full" /></div>)}</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="ps-4">{t('common.name')}</TableHead>
                        <TableHead>{t('common.email')}</TableHead>
                        <TableHead className="hidden md:table-cell">{t('common.role')}</TableHead>
                        <TableHead className="hidden md:table-cell">{t('common.department')}</TableHead>
                        <TableHead className="hidden lg:table-cell">{t('common.status')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user) => (
                        <TableRow key={user.id} className="text-sm">
                          <TableCell className="ps-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                                  {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="capitalize text-xs">{user.role?.replace('_', ' ')}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{user.departmentName || '—'}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge className={user.isActive ? 'bg-emerald-500/10 text-emerald-600 shadow-none border border-emerald-500/20' : 'bg-muted text-muted-foreground shadow-none'}>
                              {user.isActive ? t('common.active') : t('common.inactive')}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('admin.departments')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingDepts ? (
                <div className="divide-y">{Array(4).fill(0).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-10 w-full" /></div>)}</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="ps-4">{t('common.name')}</TableHead>
                        <TableHead>{t('admin.manager')}</TableHead>
                        <TableHead className="hidden md:table-cell">{t('admin.memberCount')}</TableHead>
                        <TableHead className="hidden md:table-cell">{t('common.status')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {depts?.map((dept) => (
                        <TableRow key={dept.id} className="text-sm">
                          <TableCell className="ps-4 font-medium">{dept.name}</TableCell>
                          <TableCell className="text-muted-foreground">{dept.managerName || '—'}</TableCell>
                          <TableCell className="hidden md:table-cell">{dept.memberCount ?? 0}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge className={dept.isActive ? 'bg-emerald-500/10 text-emerald-600 shadow-none border border-emerald-500/20' : 'bg-muted text-muted-foreground shadow-none'}>
                              {dept.isActive ? t('common.active') : t('common.inactive')}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('admin.companies')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingCompanies ? (
                <div className="divide-y">{Array(2).fill(0).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-12 w-full" /></div>)}</div>
              ) : (
                <div className="divide-y">
                  {companies?.map((company) => (
                    <div key={company.id} className="p-4 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-semibold">{company.name}</p>
                        <p className="text-sm text-muted-foreground">{t('admin.industry')}: {company.industry}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="hidden sm:inline">{t('admin.plan')}: <span className="font-medium text-foreground capitalize">{company.plan}</span></span>
                        <Badge className={company.isActive ? 'bg-emerald-500/10 text-emerald-600 shadow-none border border-emerald-500/20' : ''}>
                          {company.isActive ? t('common.active') : t('common.inactive')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-amber-500" />
                {t('admin.demoMode')}
              </CardTitle>
              <CardDescription>{t('admin.demoModeDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200 font-mono">
                {t('admin.enableAuth')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('admin.settings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t('admin.settingsPlaceholder')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
