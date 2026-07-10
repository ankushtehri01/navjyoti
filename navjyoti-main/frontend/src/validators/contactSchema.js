import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,15}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  subject: z.string().trim().optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});
