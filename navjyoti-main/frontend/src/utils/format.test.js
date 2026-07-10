import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCompactCurrency, formatNumber, truncate } from './format.js';

describe('format utils', () => {
  it('formats currency in INR', () => {
    expect(formatCurrency(500000)).toContain('5,00,000');
    expect(formatCurrency('abc')).toBe('—');
  });

  it('compacts large currency to Cr/L', () => {
    expect(formatCompactCurrency(12000000)).toBe('₹1.20 Cr');
    expect(formatCompactCurrency(350000)).toBe('₹3.50 L');
  });

  it('groups numbers with Indian digit grouping', () => {
    expect(formatNumber(1234567)).toBe('12,34,567');
    expect(formatNumber(NaN)).toBe('—');
  });

  it('truncates long text with an ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('hello…');
    expect(truncate('short', 20)).toBe('short');
  });
});
