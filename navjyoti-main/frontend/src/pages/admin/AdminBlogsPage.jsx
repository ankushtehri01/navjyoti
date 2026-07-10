import AdminResourcePage from '@/components/admin/AdminResourcePage.jsx';
import SimpleForm from '@/components/admin/SimpleForm.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { blogsResource } from '@/services/admin.js';
import { blogFormSchema } from '@/validators/adminSchemas.js';
import { BLOG_STATUS_OPTIONS } from '@/constants/options.js';
import { formatDate } from '@/utils/format.js';

const FIELDS = [
  { name: 'title', label: 'Title', colSpan: 2, placeholder: 'How working capital works' },
  { name: 'category', label: 'Category', placeholder: 'Finance' },
  { name: 'status', label: 'Status', type: 'select', options: BLOG_STATUS_OPTIONS },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea', colSpan: 2, rows: 2 },
  { name: 'content', label: 'Content', type: 'textarea', colSpan: 2, rows: 8 },
  { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
];

const BlogForm = (props) => <SimpleForm fields={FIELDS} schema={blogFormSchema} {...props} />;

const STATUS_VARIANT = { published: 'success', draft: 'neutral', archived: 'warning' };

const columns = [
  { key: 'title', header: 'Title', cellClassName: 'font-medium text-white max-w-xs truncate' },
  { key: 'category', header: 'Category' },
  { key: 'status', header: 'Status', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'neutral'} dot>{r.status}</Badge> },
  { key: 'views', header: 'Views', align: 'right', render: (r) => r.views ?? 0 },
  { key: 'createdAt', header: 'Created', render: (r) => formatDate(r.createdAt) },
];

const AdminBlogsPage = () => (
  <AdminResourcePage
    title="Blogs"
    subtitle="Publish and manage financial insights."
    queryKey={['admin', 'blogs']}
    resource={blogsResource}
    columns={columns}
    Form={BlogForm}
    searchPlaceholder="Search articles…"
    filters={[{ key: 'status', placeholder: 'Status', options: BLOG_STATUS_OPTIONS }]}
    exportName="blogs.csv"
  />
);

export default AdminBlogsPage;
