import AdminResourcePage from '@/components/admin/AdminResourcePage.jsx';
import SimpleForm from '@/components/admin/SimpleForm.jsx';
import StatusBadge from '@/components/common/StatusBadge.jsx';
import { applicationsResource } from '@/services/admin.js';
import { applicationStatusSchema } from '@/validators/adminSchemas.js';
import { APPLICATION_STATUS_OPTIONS } from '@/constants/options.js';
import { formatCurrency, formatDate } from '@/utils/format.js';

const FIELDS = [
  { name: 'status', label: 'Status', type: 'select', options: APPLICATION_STATUS_OPTIONS, colSpan: 2 },
  { name: 'remarks', label: 'Remarks', type: 'textarea', colSpan: 2, rows: 3 },
];

const StatusForm = (props) => <SimpleForm fields={FIELDS} schema={applicationStatusSchema} {...props} />;

const columns = [
  { key: 'applicationNumber', header: 'Application #', cellClassName: 'font-medium text-white' },
  { key: 'applicant', header: 'Applicant', render: (r) => r.user?.name || '—', exportAccessor: (r) => r.user?.name },
  { key: 'category', header: 'Loan Type', render: (r) => r.category?.name || '—', exportAccessor: (r) => r.category?.name },
  { key: 'amount', header: 'Amount', align: 'right', render: (r) => formatCurrency(r.amount) },
  { key: 'createdAt', header: 'Applied', render: (r) => formatDate(r.createdAt) },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
];

const AdminApplicationsPage = () => (
  <AdminResourcePage
    title="Applications"
    subtitle="Review and update loan applications."
    queryKey={['admin', 'applications']}
    resource={applicationsResource}
    columns={columns}
    Form={StatusForm}
    canCreate={false}
    canDelete={false}
    searchPlaceholder="Search by application #…"
    filters={[{ key: 'status', placeholder: 'Status', options: APPLICATION_STATUS_OPTIONS }]}
    exportName="applications.csv"
  />
);

export default AdminApplicationsPage;
