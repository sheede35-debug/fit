import { useListNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@workspace/api-client-react";
import { queryClient } from "@/lib/queryClient";
import { getListNotificationsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Check, CheckCircle2, AlertTriangle, AlertCircle, Info, BrainCircuit } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Notifications() {
  const { data: notifications, isLoading } = useListNotifications({});
  const markReadMut = useMarkNotificationRead();
  const markAllMut = useMarkAllNotificationsRead();
  const { t } = useLanguage();

  const handleMarkRead = (id: number) => {
    markReadMut.mutate({ notificationId: id } as any, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() })
    });
  };

  const handleMarkAll = () => {
    markAllMut.mutate({} as any, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() })
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'assigned':   return <Info className="h-5 w-5 text-blue-500" />;
      case 'completed':  return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'rejected':   return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'escalated':  return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'sla_warning':return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'ai_alert':   return <BrainCircuit className="h-5 w-5 text-primary" />;
      default:           return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const unreadCount = notifications?.filter(n => !n.isRead).length ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('notifications.title')}</h1>
            <p className="text-muted-foreground text-sm">{t('notifications.subtitle')}</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground rounded-full h-6 min-w-6 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAll}
          disabled={markAllMut.isPending || unreadCount === 0}
          className="gap-2"
        >
          <Check className="h-3.5 w-3.5" /> {t('notifications.markAllRead')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications?.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">{t('notifications.none')}</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications?.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 flex gap-4 transition-colors hover:bg-muted/30 ${!notif.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className="shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start gap-3 flex-wrap">
                      <p className={`text-sm ${!notif.isRead ? 'font-semibold' : 'font-medium text-muted-foreground'}`}>
                        {notif.title}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug">{notif.message}</p>
                    {notif.requestTitle && (
                      <div className="mt-1.5">
                        <Badge variant="outline" className="text-xs font-normal">REQ: {notif.requestTitle}</Badge>
                      </div>
                    )}
                  </div>
                  {!notif.isRead && (
                    <div className="shrink-0 flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                        onClick={() => handleMarkRead(notif.id)}
                        title={t('notifications.markAllRead')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
