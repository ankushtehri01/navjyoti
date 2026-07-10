import AdminResourcePage from '@/components/admin/AdminResourcePage.jsx';
import SimpleForm from '@/components/admin/SimpleForm.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { faqsResource } from '@/services/admin.js';
import { faqFormSchema } from '@/validators/adminSchemas.js';
import { truncate } from '@/utils/format.js';

const FIELDS = [
  { name: 'question', label: 'Question', colSpan: 2 },
  { name: 'answer', label: 'Answer', type: 'textarea', colSpan: 2, rows: 5 },
  { name: 'category', label: 'Category', placeholder: 'General' },
  { name: 'order', label: 'Display order', type: 'number' },
  { name: 'isActive', label: 'Active', type: 'checkbox' },
];

const FaqForm = (props) => <SimpleForm fields={FIELDS} schema={faqFormSchema} {...props} />;

const columns = [
  { key: 'question', header: 'Question', cellClassName: 'font-medium text-white', render: (r) => truncate(r.question, 60) },
  { key: 'category', header: 'Category' },
  { key: 'order', header: 'Order', align: 'right' },
  { key: 'isActive', header: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'neutral'} dot>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
];

const AdminFaqsPage = () => (
  <AdminResourcePage
    title="FAQs"
    subtitle="Manage frequently asked questions."
    queryKey={['admin', 'faqs']}
    resource={faqsResource}
    columns={columns}
    Form={FaqForm}
    searchPlaceholder="Search questions…"
    exportName="faqs.csv"
  />
);

export default AdminFaqsPage;
