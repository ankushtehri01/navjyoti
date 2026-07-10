import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiBell, FiCheckCircle, FiInfo, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader.jsx';
import { Card, Button, Skeleton, EmptyState } from '@/components/ui';
import { notificationService } from '@/services/notification.service.js';
import { formatDate } from '@/utils/format.js';
import { cn } from '@/utils/cn.js';

const ICONS = { info: FiInfo, success: FiCheckCircle, warning: FiAlertTriangle, error: FiXCircle };
const COLORS = { info: 'text-cyan-300', success: 'text-green-300', warning: 'text-amber-300', error: 'text-red-300' };

const NotificationsPage = () => {
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => notificationService.list({ limit: 30 }),
    retry: false,
  });
  const items = data?.items ?? [];
  const hasUnread = items.some((n) => !n.isRead);

  const markRead = useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const markAll = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on your applications and account."
        actions={
          hasUnread && (
            <Button variant="glass" size="sm" onClick={() => markAll.mutate()} isLoading={markAll.isPending}>
              Mark all as read
            </Button>
          )
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><Skeleton className="h-6 w-full" /></Card>
          ))}
        </div>
      ) : isError || items.length === 0 ? (
        <Card padding="none">
          <EmptyState icon={FiBell} title="You’re all caught up" description="New notifications will appear here." />
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const Icon = ICONS[n.type] || FiInfo;
            return (
              <Card
                key={n._id}
                className={cn('flex items-start gap-4', !n.isRead && 'border-brand-500/30')}
              >
                <span className={cn('mt-0.5 shrink-0', COLORS[n.type] || COLORS.info)}>
                  <Icon size={20} />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{n.title}</p>
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => markRead.mutate(n._id)}
                    className="focus-ring shrink-0 rounded-lg px-2 py-1 text-xs text-brand-300 hover:text-brand-200"
                  >
                    Mark read
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default NotificationsPage;
