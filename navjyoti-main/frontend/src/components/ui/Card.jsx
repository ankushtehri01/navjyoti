import { forwardRef } from 'react';
import { cn } from '@/utils/cn.js';

/**
 * Glassmorphic surface. `hover` adds a lift on hover; `as motion` when a
 * whileHover/animate prop is passed via `motionProps`.
 */
const VARIANTS = {
  glass: 'glass',
  strong: 'glass-strong',
  solid: 'bg-ink-900 border border-white/10',
  outline: 'border border-white/10 bg-transparent',
};

const PADDING = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card = forwardRef(
  (
    { variant = 'glass', padding = 'md', hover = false, interactive = false, className, children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl transition-all duration-300',
        VARIANTS[variant],
        PADDING[padding],
        hover && 'hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-brand-950/30',
        interactive && 'cursor-pointer focus-ring',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export default Card;
