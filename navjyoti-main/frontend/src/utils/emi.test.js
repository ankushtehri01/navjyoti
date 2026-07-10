import { describe, it, expect } from 'vitest';
import { calculateEMI } from './emi.js';

describe('calculateEMI', () => {
  it('computes EMI for a standard loan', () => {
    const { emi, totalPayable, totalInterest } = calculateEMI(500000, 12, 24);
    expect(emi).toBe(23537);
    // emi and totalPayable are each rounded independently from the exact figure.
    expect(totalPayable).toBe(564882);
    expect(totalInterest).toBe(totalPayable - 500000);
  });

  it('handles a zero interest rate', () => {
    const { emi, totalInterest } = calculateEMI(120000, 0, 12);
    expect(emi).toBe(10000);
    expect(totalInterest).toBe(0);
  });

  it('returns zeros for invalid input', () => {
    expect(calculateEMI(0, 10, 12)).toEqual({ emi: 0, totalPayable: 0, totalInterest: 0 });
    expect(calculateEMI(100000, 10, 0)).toEqual({ emi: 0, totalPayable: 0, totalInterest: 0 });
  });
});
