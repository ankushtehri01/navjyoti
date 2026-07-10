import { cn } from '@/utils/cn.js';

/** Status/label pill with semantic color variants. */
const VARIANTS = {
  neutral: 'bg-white/8 text-slate-300 border-white/10',
  brand: 'bg-brand-500/15 text-brand-200 border-brand-500/30',
  success: 'bg-success/15 text-green-300 border-success/30',
  warning: 'bg-warning/15 text-amber-300 border-warning/30',
  danger: 'bg-danger/15 text-red-300 border-danger/30',
  info: 'bg-accent-500/15 text-cyan-200 border-accent-500/30',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
};

const Badge = ({ variant = 'neutral', size = 'md', dot = false, className, children }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-medium',
      VARIANTS[variant],
      SIZES[size],
      className
    )}
  >
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
    {children}
  </span>
);

export default Badge;
