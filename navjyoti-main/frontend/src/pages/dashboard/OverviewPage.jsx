import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiFilePlus, FiLayers, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader.jsx';
import StatusBadge from '@/components/common/StatusBadge.jsx';
import { Card, Button, Skeleton, EmptyState } from '@/components/ui';
import { applicationService } from '@/services/application.service.js';
import { useAuth } from '@/hooks/useAuth.js';
import { ROUTES } from '@/constants/routes.js';
import { formatCurrency, formatDate } from '@/utils/format.js';

const StatTile = ({ icon: Icon, label, value }) => (
  <Card className="flex items-center gap-4">
    <span className="gradient-brand flex h-12 w-12 items-center justify-center rounded-xl text-white">
      <Icon size={20} />
    </span>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  </Card>
);

const OverviewPage = () => {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['applications', { scope: 'me', limit: 5 }],
    queryFn: () => applicationService.list({ limit: 5, sort: '-createdAt' }),
    retry: false,
  });

  const items = data?.items ?? [];
  const stats = data?.stats ?? { total: 0, approved: 0, pending: 0 };

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        subtitle="Here’s a snapshot of your loans and applications."
        actions={
          <Button as={Link} to={ROUTES.DASHBOARD_APPLY} leftIcon={<FiFilePlus />}>
            Apply for Loan
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatTile icon={FiLayers} label="Total Applications" value={stats.total} />
        <StatTile icon={FiCheckCircle} label="Approved" value={stats.approved} />
        <StatTile icon={FiClock} label="In Progress" value={stats.pending} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent applications</h2>
          <Link to={ROUTES.DASHBOARD_APPLICATIONS} className="inline-flex items-center gap-1 text-sm text-brand-300 hover:text-brand-200">
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}><Skeleton className="h-6 w-full" /></Card>
            ))}
          </div>
        ) : isError || items.length === 0 ? (
          <Card padding="none">
            <EmptyState
              icon={FiLayers}
              title="No applications yet"
              description="Start your first loan application — it only takes a few minutes."
              action={<Button as={Link} to={ROUTES.DASHBOARD_APPLY} size="sm">Apply now</Button>}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((app) => (
              <Card key={app._id} hover className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{app.category?.name || 'Loan'}</p>
                  <p className="text-xs text-slate-400">
                    {app.applicationNumber} · {formatDate(app.createdAt)}
                  </p>
                </div>
                <p className="font-semibold text-white">{formatCurrency(app.amount)}</p>
                <StatusBadge status={app.status} />
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OverviewPage;
