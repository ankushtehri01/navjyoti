/**
 * Formatting helpers (currency, numbers, dates) — locale-aware, reusable.
 */

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const NUM = new Intl.NumberFormat('en-IN');

/** Format a number as Indian Rupees (no decimals by default). */
export const formatCurrency = (value) =>
  Number.isFinite(Number(value)) ? INR.format(Number(value)) : '—';

/** Compact currency for large figures, e.g. ₹1.2 Cr / ₹3.5 L. */
export const formatCompactCurrency = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return INR.format(n);
};

/** Group a number with Indian digit grouping. */
export const formatNumber = (value) =>
  Number.isFinite(Number(value)) ? NUM.format(Number(value)) : '—';

/** Human-readable date, e.g. "8 Jul 2026". */
export const formatDate = (value) => {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/** Truncate text with an ellipsis. */
export const truncate = (text = '', max = 120) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
