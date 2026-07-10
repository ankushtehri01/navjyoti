import AdminResourcePage from '@/components/admin/AdminResourcePage.jsx';
import SimpleForm from '@/components/admin/SimpleForm.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { employeesResource } from '@/services/admin.js';
import { employeeFormSchema } from '@/validators/adminSchemas.js';
import { DEPARTMENT_OPTIONS } from '@/constants/options.js';

const FIELDS = [
  { name: 'name', label: 'Full name', placeholder: 'Employee name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'name@navjyoti.com' },
  { name: 'password', label: 'Temp password', type: 'password', createOnly: true, hint: 'Min 8 characters' },
  { name: 'employeeId', label: 'Employee ID', placeholder: 'EMP001' },
  { name: 'department', label: 'Department', type: 'select', options: DEPARTMENT_OPTIONS },
  { name: 'designation', label: 'Designation', placeholder: 'Credit Analyst' },
];

const EmployeeForm = (props) => <SimpleForm fields={FIELDS} schema={employeeFormSchema} {...props} />;

const columns = [
  { key: 'employeeId', header: 'ID', cellClassName: 'font-medium text-white' },
  { key: 'name', header: 'Name', render: (r) => r.user?.name || r.name || '—', exportAccessor: (r) => r.user?.name },
  { key: 'department', header: 'Department', render: (r) => <span className="capitalize">{r.department}</span> },
  { key: 'designation', header: 'Designation', render: (r) => r.designation || '—' },
  { key: 'isActive', header: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'neutral'} dot>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
];

const AdminEmployeesPage = () => (
  <AdminResourcePage
    title="Employees"
    subtitle="Manage staff accounts and departments."
    queryKey={['admin', 'employees']}
    resource={employeesResource}
    columns={columns}
    Form={EmployeeForm}
    searchPlaceholder="Search employees…"
    filters={[{ key: 'department', placeholder: 'Department', options: DEPARTMENT_OPTIONS }]}
    exportName="employees.csv"
  />
);

export default AdminEmployeesPage;
