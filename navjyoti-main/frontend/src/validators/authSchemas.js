/**
 * Zod schemas for auth forms. Mirrors backend validation so client-side
 * errors match server expectations. Used via @hookform/resolvers/zod.
 */
import { z } from 'zod';

const email = z.string().trim().min(1, 'Email is required').email('Enter a valid email');

const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Add a lowercase letter')
  .regex(/[A-Z]/, 'Add an uppercase letter')
  .regex(/\d/, 'Add a number');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email,
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]{7,15}$/, 'Enter a valid phone number')
      .optional()
      .or(z.literal('')),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
