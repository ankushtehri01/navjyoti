import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiCheck, FiStar } from 'react-icons/fi';
import AdminResourcePage from '@/components/admin/AdminResourcePage.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Tooltip from '@/components/ui/Tooltip.jsx';
import { reviewsResource } from '@/services/admin.js';
import { truncate, formatDate } from '@/utils/format.js';
import { cn } from '@/utils/cn.js';

/** Approve / feature toggles for a review row. */
const ReviewActions = ({ row, onDone }) => {
  const patch = useMutation({
    mutationFn: (payload) => reviewsResource.patch(row._id, payload),
    onSuccess: () => {
      toast.success('Updated.');
      onDone?.();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <>
      <Tooltip content={row.isApproved ? 'Approved' : 'Approve'}>
        <button
          type="button"
          onClick={() => patch.mutate({ isApproved: !row.isApproved })}
          aria-label="Toggle approve"
          className={cn('focus-ring rounded-lg p-2 transition', row.isApproved ? 'text-green-400' : 'text-slate-400 hover:text-green-300')}
        >
          <FiCheck size={15} />
        </button>
      </Tooltip>
      <Tooltip content={row.isFeatured ? 'Featured' : 'Feature'}>
        <button
          type="button"
          onClick={() => patch.mutate({ isFeatured: !row.isFeatured })}
          aria-label="Toggle feature"
          className={cn('focus-ring rounded-lg p-2 transition', row.isFeatured ? 'text-amber-400' : 'text-slate-400 hover:text-amber-300')}
        >
          <FiStar size={15} className={row.isFeatured ? 'fill-amber-400' : ''} />
        </button>
      </Tooltip>
    </>
  );
};

const columns = [
  { key: 'name', header: 'Name', cellClassName: 'font-medium text-white' },
  { key: 'rating', header: 'Rating', render: (r) => `${r.rating}★` },
  { key: 'message', header: 'Testimonial', render: (r) => truncate(r.message, 60) },
  { key: 'isApproved', header: 'Approved', render: (r) => <Badge variant={r.isApproved ? 'success' : 'neutral'} dot>{r.isApproved ? 'Yes' : 'No'}</Badge>, exportAccessor: (r) => (r.isApproved ? 'yes' : 'no') },
  { key: 'createdAt', header: 'Date', render: (r) => formatDate(r.createdAt) },
];

const AdminTestimonialsPage = () => (
  <AdminResourcePage
    title="Testimonials"
    subtitle="Approve and feature customer reviews."
    queryKey={['admin', 'reviews']}
    resource={reviewsResource}
    columns={columns}
    canCreate={false}
    searchPlaceholder="Search testimonials…"
    rowActions={(row, { invalidate }) => <ReviewActions row={row} onDone={invalidate} />}
    exportName="testimonials.csv"
  />
);

export default AdminTestimonialsPage;
