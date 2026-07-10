import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '@/utils/cn.js';

/** Build a compact page list with ellipses, e.g. 1 … 4 5 6 … 20. */
const buildRange = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push('…');
    out.push(p);
    prev = p;
  }
  return out;
};

/** Accessible pagination control. */
const Pagination = ({ page, totalPages, onChange, className }) => {
  if (!totalPages || totalPages <= 1) return null;
  const go = (p) => p >= 1 && p <= totalPages && p !== page && onChange?.(p);
  const range = buildRange(page, totalPages);

  const base =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition focus-ring';

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1.5', className)}>
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(base, 'glass text-slate-300 hover:text-white disabled:opacity-40')}
      >
        <FiChevronLeft size={16} />
      </button>

      {range.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-1.5 text-slate-500">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              base,
              p === page
                ? 'gradient-brand text-white'
                : 'glass text-slate-300 hover:text-white'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(base, 'glass text-slate-300 hover:text-white disabled:opacity-40')}
      >
        <FiChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
