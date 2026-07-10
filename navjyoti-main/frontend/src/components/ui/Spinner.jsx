import { cn } from '@/utils/cn.js';

const SIZES = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

/** Accessible loading spinner. */
const Spinner = ({ size = 'md', className, label = 'Loading' }) => (
  <span
    role="status"
    aria-label={label}
    className={cn(
      'inline-block animate-spin rounded-full border-2 border-white/15 border-t-brand-500',
      SIZES[size],
      className
    )}
  />
);

export default Spinner;
