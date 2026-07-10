import { cn } from '@/utils/cn.js';

/**
 * Shimmering placeholder. Compose to build loading states for cards, tables,
 * and text blocks. `variant` picks common shapes.
 */
const VARIANTS = {
  text: 'h-4 rounded-md',
  title: 'h-6 rounded-md',
  circle: 'rounded-full',
  rect: 'rounded-xl',
};

const Skeleton = ({ variant = 'text', className, ...props }) => (
  <div
    aria-hidden="true"
    className={cn(
      'animate-pulse bg-white/8',
      VARIANTS[variant],
      className
    )}
    {...props}
  />
);

/** Convenience: N shimmering text lines. */
export const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn('space-y-2.5', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={i === lines - 1 ? 'w-2/3' : 'w-full'}
      />
    ))}
  </div>
);

export default Skeleton;
