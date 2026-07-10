import AdminResourcePage from '@/components/admin/AdminResourcePage.jsx';
import SimpleForm from '@/components/admin/SimpleForm.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { notificationsResource } from '@/services/admin.js';
import { notificationFormSchema } from '@/validators/adminSchemas.js';
import { NOTIFICATION_TYPE_OPTIONS } from '@/constants/options.js';
import { truncate, formatDate } from '@/utils/format.js';

const FIELDS = [
  { name: 'title', label: 'Title', colSpan: 2 },
  { name: 'message', label: 'Message', type: 'textarea', colSpan: 2, rows: 3 },
  { name: 'type', label: 'Type', type: 'select', options: NOTIFICATION_TYPE_OPTIONS },
];

const NotificationForm = (props) => (
  <SimpleForm fields={FIELDS} schema={notificationFormSchema} {...props} />
);

const TYPE_VARIANT = { info: 'info', success: 'success', warning: 'warning', error: 'danger' };

const columns = [
  { key: 'title', header: 'Title', cellClassName: 'font-medium text-white' },
  { key: 'message', header: 'Message', render: (r) => truncate(r.message, 60) },
  { key: 'type', header: 'Type', render: (r) => <Badge variant={TYPE_VARIANT[r.type] || 'neutral'} dot>{r.type}</Badge> },
  { key: 'audience', header: 'Audience', render: (r) => (r.user ? 'User' : 'Broadcast') },
  { key: 'createdAt', header: 'Sent', render: (r) => formatDate(r.createdAt) },
];

const AdminNotificationsPage = () => (
  <AdminResourcePage
    title="Notifications"
    subtitle="Broadcast announcements to users."
    queryKey={['admin', 'notifications']}
    resource={notificationsResource}
    columns={columns}
    Form={NotificationForm}
    canEdit={false}
    searchPlaceholder="Search notifications…"
    exportName="notifications.csv"
  />
);

export default AdminNotificationsPage;
