/**
 * Loan math. EMI = P·r·(1+r)^n / ((1+r)^n − 1), r = monthly rate, n = months.
 */
export const calculateEMI = (principal, annualRatePercent, months) => {
  const p = Number(principal);
  const n = Number(months);
  const r = Number(annualRatePercent) / 12 / 100;
  if (!p || !n) return { emi: 0, totalPayable: 0, totalInterest: 0 };
  if (r === 0) return { emi: Math.round(p / n), totalPayable: p, totalInterest: 0 };

  const factor = (1 + r) ** n;
  const emi = (p * r * factor) / (factor - 1);
  const totalPayable = emi * n;
  return {
    emi: Math.round(emi),
    totalPayable: Math.round(totalPayable),
    totalInterest: Math.round(totalPayable - p),
  };
};
