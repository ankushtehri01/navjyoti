import { forwardRef, useId } from 'react';
import { FiCheck } from 'react-icons/fi';
import { cn } from '@/utils/cn.js';

/**
 * Custom-styled checkbox backed by a real input for accessibility.
 * The box and check icon are direct siblings of the input so Tailwind's
 * `peer-checked:` (general-sibling) selectors apply correctly.
 * forwardRef for React Hook Form.
 */
const Checkbox = forwardRef(({ label, error, className, id, ...props }, ref) => {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className={cn('w-full', className)}>
      <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0">
          <input id={fieldId} ref={ref} type="checkbox" className="peer sr-only" {...props} />
          <span
            className={cn(
              'absolute inset-0 rounded-md border border-white/20 bg-white/[0.03] transition',
              'peer-checked:gradient-brand peer-checked:border-transparent',
              'peer-focus-visible:shadow-[0_0_0_2px_var(--color-ink-950),0_0_0_4px_var(--color-brand-500)]'
            )}
          />
          <FiCheck
            size={13}
            className="pointer-events-none absolute inset-0 m-auto text-white opacity-0 transition peer-checked:opacity-100"
          />
        </span>
        {label && <span className="text-sm text-slate-300">{label}</span>}
      </label>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
});
Checkbox.displayName = 'Checkbox';
export default Checkbox;
