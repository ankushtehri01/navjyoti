import AdminResourcePage from '@/components/admin/AdminResourcePage.jsx';
import SimpleForm from '@/components/admin/SimpleForm.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { loanCategoriesResource } from '@/services/admin.js';
import { loanCategoryFormSchema } from '@/validators/adminSchemas.js';
import { formatCompactCurrency } from '@/utils/format.js';

const FIELDS = [
  { name: 'name', label: 'Name', placeholder: 'Personal Loan' },
  { name: 'tagline', label: 'Tagline', placeholder: 'Funds for any need' },
  { name: 'description', label: 'Description', type: 'textarea', colSpan: 2 },
  { name: 'minAmount', label: 'Min amount (₹)', type: 'number' },
  { name: 'maxAmount', label: 'Max amount (₹)', type: 'number' },
  { name: 'minTenureMonths', label: 'Min tenure (months)', type: 'number' },
  { name: 'maxTenureMonths', label: 'Max tenure (months)', type: 'number' },
  { name: 'interestRateMin', label: 'Min rate (%)', type: 'number' },
  { name: 'interestRateMax', label: 'Max rate (%)', type: 'number' },
  { name: 'processingFeePercent', label: 'Processing fee (%)', type: 'number' },
  { name: 'isActive', label: 'Active', type: 'checkbox' },
];

const CategoryForm = (props) => <SimpleForm fields={FIELDS} schema={loanCategoryFormSchema} {...props} />;

const columns = [
  { key: 'name', header: 'Name', cellClassName: 'font-medium text-white' },
  { key: 'range', header: 'Amount Range', render: (r) => `${formatCompactCurrency(r.minAmount)} – ${formatCompactCurrency(r.maxAmount)}`, exportAccessor: (r) => `${r.minAmount}-${r.maxAmount}` },
  { key: 'rate', header: 'Rate', render: (r) => `${r.interestRateMin}% – ${r.interestRateMax}%`, exportAccessor: (r) => `${r.interestRateMin}-${r.interestRateMax}` },
  { key: 'isActive', header: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'neutral'} dot>{r.isActive ? 'Active' : 'Inactive'}</Badge>, exportAccessor: (r) => (r.isActive ? 'active' : 'inactive') },
];

const AdminLoanCategoriesPage = () => (
  <AdminResourcePage
    title="Loan Categories"
    subtitle="Manage loan products and their terms."
    queryKey={['admin', 'loan-categories']}
    resource={loanCategoriesResource}
    columns={columns}
    Form={CategoryForm}
    searchPlaceholder="Search categories…"
    exportName="loan-categories.csv"
  />
);

export default AdminLoanCategoriesPage;
