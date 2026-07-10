import { z } from 'zod';

export const applicationSchema = z.object({
  category: z.string().min(1, 'Please select a loan type'),
  amount: z.coerce
    .number({ invalid_type_error: 'Enter an amount' })
    .min(10000, 'Minimum amount is ₹10,000')
    .max(50000000, 'Amount is too large'),
  tenureMonths: z.coerce
    .number({ invalid_type_error: 'Select a tenure' })
    .min(3, 'Minimum tenure is 3 months')
    .max(360, 'Maximum tenure is 360 months'),
  employmentType: z.string().min(1, 'Select your employment type'),
  monthlyIncome: z.coerce
    .number({ invalid_type_error: 'Enter your monthly income' })
    .min(1, 'Enter your monthly income'),
  companyName: z.string().trim().optional().or(z.literal('')),
  purpose: z.string().trim().max(300).optional().or(z.literal('')),
});
