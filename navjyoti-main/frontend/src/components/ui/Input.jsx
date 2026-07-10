/**
 * Reusable labeled input with error + hint states and optional adornments.
 * forwardRef-compatible for React Hook Form's register().
 */
import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn.js';

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightSlot,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id || autoId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              'glass h-11 w-full rounded-xl bg-white/[0.03] px-4 text-sm text-white placeholder:text-slate-500',
              'transition focus-ring',
              leftIcon && 'pl-11',
              rightSlot && 'pr-11',
              error && 'border-danger/60 focus-visible:shadow-[0_0_0_2px_var(--color-ink-950),0_0_0_4px_var(--color-danger)]',
              className
            )}
            {...props}
          />
          {rightSlot && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</span>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
