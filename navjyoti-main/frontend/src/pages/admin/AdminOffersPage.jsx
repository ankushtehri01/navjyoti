import AdminResourcePage from '@/components/admin/AdminResourcePage.jsx';
import SimpleForm from '@/components/admin/SimpleForm.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { offersResource } from '@/services/admin.js';
import { offerFormSchema } from '@/validators/adminSchemas.js';
import { formatDate } from '@/utils/format.js';

const FIELDS = [
  { name: 'title', label: 'Title', colSpan: 2 },
  { name: 'description', label: 'Description', type: 'textarea', colSpan: 2, rows: 3 },
  { name: 'badge', label: 'Badge', placeholder: 'Limited Time' },
  { name: 'code', label: 'Promo code', placeholder: 'FESTIVE10' },
  { name: 'highlightRate', label: 'Highlight rate (%)', type: 'number' },
  { name: 'ctaLabel', label: 'CTA label', placeholder: 'Apply Now' },
  { name: 'ctaLink', label: 'CTA link', placeholder: '/loans/personal' },
  { name: 'isActive', label: 'Active', type: 'checkbox' },
];

const OfferForm = (props) => <SimpleForm fields={FIELDS} schema={offerFormSchema} {...props} />;

const columns = [
  { key: 'title', header: 'Title', cellClassName: 'font-medium text-white' },
  { key: 'code', header: 'Code', render: (r) => r.code || '—' },
  { key: 'highlightRate', header: 'Rate', render: (r) => (r.highlightRate ? `${r.highlightRate}%` : '—') },
  { key: 'isActive', header: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'neutral'} dot>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
  { key: 'createdAt', header: 'Created', render: (r) => formatDate(r.createdAt) },
];

const AdminOffersPage = () => (
  <AdminResourcePage
    title="Offers"
    subtitle="Manage promotional campaigns."
    queryKey={['admin', 'offers']}
    resource={offersResource}
    columns={columns}
    Form={OfferForm}
    searchPlaceholder="Search offers…"
    exportName="offers.csv"
  />
);

export default AdminOffersPage;
