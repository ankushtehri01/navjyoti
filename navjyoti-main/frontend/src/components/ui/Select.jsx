import { forwardRef, useId } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '@/utils/cn.js';

/**
 * Styled native select — accessible and lightweight. `options` is an array of
 * { value, label } or plain strings. forwardRef for React Hook Form.
 */
const Select = forwardRef(
  (
    { label, error, hint, options = [], placeholder, className, containerClassName, id, ...props },
    ref
  ) => {
    const autoId = useId();
    const fieldId = id || autoId;
    const normalized = options.map((o) =>
      typeof o === 'object' ? o : { value: o, label: o }
    );

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={fieldId}
            ref={ref}
            aria-invalid={Boolean(error)}
            className={cn(
              'glass h-11 w-full appearance-none rounded-xl bg-white/[0.03] px-4 pr-10 text-sm text-white focus-ring',
              '[&>option]:bg-ink-800 [&>option]:text-white',
              error && 'border-danger/60',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {normalized.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <FiChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = 'Select';
export default Select;
