import { useState } from 'react';
import { Link } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { FiFilePlus, FiLayers } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader.jsx';
import StatusBadge from '@/components/common/StatusBadge.jsx';
import { Table, Pagination, Button, EmptyState } from '@/components/ui';
import { applicationService } from '@/services/application.service.js';
import { ROUTES } from '@/constants/routes.js';
import { formatCurrency, formatDate } from '@/utils/format.js';

const ApplicationsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['applications', { page }],
    queryFn: () => applicationService.list({ page, limit: 10, sort: '-createdAt' }),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const items = data?.items ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const empty = !isLoading && (isError || items.length === 0);

  const columns = [
    { key: 'applicationNumber', header: 'Application #', cellClassName: 'font-medium text-white' },
    { key: 'category', header: 'Loan Type', render: (r) => r.category?.name || '—' },
    { key: 'amount', header: 'Amount', align: 'right', render: (r) => formatCurrency(r.amount) },
    { key: 'createdAt', header: 'Applied', render: (r) => formatDate(r.createdAt) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="My Applications"
        subtitle="Track the status of every loan application."
        actions={
          <Button as={Link} to={ROUTES.DASHBOARD_APPLY} leftIcon={<FiFilePlus />}>
            New Application
          </Button>
        }
      />

      {empty ? (
        <EmptyState
          icon={FiLayers}
          title="No applications yet"
          description="When you apply for a loan, it will appear here with live status updates."
          action={<Button as={Link} to={ROUTES.DASHBOARD_APPLY} size="sm">Apply now</Button>}
        />
      ) : (
        <>
          <Table columns={columns} data={items} loading={isLoading} />
          <div className="mt-6 flex justify-end">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </>
  );
};

export default ApplicationsPage;
