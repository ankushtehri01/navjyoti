import AdminResourcePage from '@/components/admin/AdminResourcePage.jsx';
import SimpleForm from '@/components/admin/SimpleForm.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { usersResource } from '@/services/admin.js';
import { userEditSchema } from '@/validators/adminSchemas.js';
import { ROLE_OPTIONS } from '@/constants/options.js';
import { formatDate } from '@/utils/format.js';

const FIELDS = [
  { name: 'role', label: 'Role', type: 'select', options: ROLE_OPTIONS },
  { name: 'isActive', label: 'Account active', type: 'checkbox' },
];

const UserForm = (props) => <SimpleForm fields={FIELDS} schema={userEditSchema} {...props} />;

const ROLE_VARIANT = { admin: 'brand', employee: 'info', customer: 'neutral' };

const columns = [
  { key: 'name', header: 'Name', cellClassName: 'font-medium text-white' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', render: (r) => <Badge variant={ROLE_VARIANT[r.role]}>{r.role}</Badge> },
  { key: 'isActive', header: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'danger'} dot>{r.isActive ? 'Active' : 'Disabled'}</Badge>, exportAccessor: (r) => (r.isActive ? 'active' : 'disabled') },
  { key: 'createdAt', header: 'Joined', render: (r) => formatDate(r.createdAt) },
];

const AdminUsersPage = () => (
  <AdminResourcePage
    title="Users"
    subtitle="Manage customer accounts and roles."
    queryKey={['admin', 'users']}
    resource={usersResource}
    columns={columns}
    Form={UserForm}
    canCreate={false}
    searchPlaceholder="Search by name or email…"
    filters={[{ key: 'role', placeholder: 'Role', options: ROLE_OPTIONS }]}
    exportName="users.csv"
  />
);

export default AdminUsersPage;
