/**
 * Reusable Button. Variants + sizes + loading state, theme-aware.
 * Renders as <button> or, when `as` is provided (e.g. Link), that element.
 */
import { forwardRef } from 'react';
import { cn } from '@/utils/cn.js';

const VARIANTS = {
  primary:
    'gradient-brand text-white shadow-lg shadow-brand-900/30 hover:-translate-y-0.5',
  glass: 'glass text-white hover:bg-white/10',
  outline:
    'border border-white/15 text-white hover:bg-white/5',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  danger: 'bg-danger text-white hover:brightness-110',
};

const SIZES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
};

const Spinner = () => (
  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
);

const Button = forwardRef(
  (
    {
      as: Component = 'button',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    return (
      <Component
        ref={ref}
        type={Component === 'button' ? type : undefined}
        disabled={Component === 'button' ? isDisabled : undefined}
        aria-busy={isLoading || undefined}
        className={cn(
          'focus-ring inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200',
          'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
          VARIANTS[variant],
          SIZES[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? <Spinner /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </Component>
    );
  }
);

Button.displayName = 'Button';
export default Button;
