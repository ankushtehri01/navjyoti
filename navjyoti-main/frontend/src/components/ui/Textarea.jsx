import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn.js';

/** Labeled textarea with error/hint states. forwardRef for React Hook Form. */
const Textarea = forwardRef(
  ({ label, error, hint, rows = 4, className, containerClassName, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id || autoId;
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <textarea
          id={fieldId}
          ref={ref}
          rows={rows}
          aria-invalid={Boolean(error)}
          className={cn(
            'glass w-full resize-y rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus-ring',
            error && 'border-danger/60',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
export default Textarea;
