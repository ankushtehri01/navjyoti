import AdminResourcePage from '@/components/admin/AdminResourcePage.jsx';
import SimpleForm from '@/components/admin/SimpleForm.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { contactsResource } from '@/services/admin.js';
import { contactStatusSchema } from '@/validators/adminSchemas.js';
import { CONTACT_STATUS_OPTIONS } from '@/constants/options.js';
import { truncate, formatDate } from '@/utils/format.js';

const FIELDS = [
  { name: 'status', label: 'Status', type: 'select', options: CONTACT_STATUS_OPTIONS, colSpan: 2 },
  { name: 'response', label: 'Internal note / response', type: 'textarea', colSpan: 2, rows: 3 },
];

const ContactForm = (props) => <SimpleForm fields={FIELDS} schema={contactStatusSchema} {...props} />;

const STATUS_VARIANT = { new: 'info', in_progress: 'warning', resolved: 'success' };

const columns = [
  { key: 'name', header: 'Name', cellClassName: 'font-medium text-white' },
  { key: 'email', header: 'Email' },
  { key: 'subject', header: 'Subject', render: (r) => truncate(r.subject || '—', 40) },
  { key: 'status', header: 'Status', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'neutral'} dot>{r.status?.replace('_', ' ')}</Badge> },
  { key: 'createdAt', header: 'Received', render: (r) => formatDate(r.createdAt) },
];

const AdminContactsPage = () => (
  <AdminResourcePage
    title="Contact Queries"
    subtitle="Respond to customer enquiries."
    queryKey={['admin', 'contacts']}
    resource={contactsResource}
    columns={columns}
    Form={ContactForm}
    canCreate={false}
    searchPlaceholder="Search by name or email…"
    filters={[{ key: 'status', placeholder: 'Status', options: CONTACT_STATUS_OPTIONS }]}
    exportName="contacts.csv"
  />
);

export default AdminContactsPage;
