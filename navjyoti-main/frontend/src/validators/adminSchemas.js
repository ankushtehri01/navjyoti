import { z } from 'zod';

const num = (msg) => z.coerce.number({ invalid_type_error: msg });

export const loanCategoryFormSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  tagline: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
  minAmount: num('Enter min amount').min(0),
  maxAmount: num('Enter max amount').min(0),
  minTenureMonths: num('Enter min tenure').min(1),
  maxTenureMonths: num('Enter max tenure').min(1),
  interestRateMin: num('Enter min rate').min(0),
  interestRateMax: num('Enter max rate').min(0),
  processingFeePercent: num('Enter fee').min(0).optional(),
  isActive: z.boolean().optional(),
});

export const blogFormSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  category: z.string().trim().optional().or(z.literal('')),
  excerpt: z.string().trim().optional().or(z.literal('')),
  content: z.string().trim().min(10, 'Content is too short'),
  status: z.string().min(1, 'Select a status'),
  isFeatured: z.boolean().optional(),
});

export const faqFormSchema = z.object({
  question: z.string().trim().min(5, 'Question is required'),
  answer: z.string().trim().min(5, 'Answer is required'),
  category: z.string().trim().optional().or(z.literal('')),
  order: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

export const offerFormSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  description: z.string().trim().optional().or(z.literal('')),
  badge: z.string().trim().optional().or(z.literal('')),
  code: z.string().trim().optional().or(z.literal('')),
  highlightRate: z.coerce.number().optional(),
  ctaLabel: z.string().trim().optional().or(z.literal('')),
  ctaLink: z.string().trim().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

export const employeeFormSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(8, 'Min 8 characters').optional().or(z.literal('')),
  employeeId: z.string().trim().min(1, 'Employee ID is required'),
  department: z.string().min(1, 'Select a department'),
  designation: z.string().trim().optional().or(z.literal('')),
});

export const notificationFormSchema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  message: z.string().trim().min(2, 'Message is required'),
  type: z.string().min(1, 'Select a type'),
});

export const userEditSchema = z.object({
  role: z.string().min(1, 'Select a role'),
  isActive: z.boolean().optional(),
});

export const applicationStatusSchema = z.object({
  status: z.string().min(1, 'Select a status'),
  remarks: z.string().trim().optional().or(z.literal('')),
});

export const contactStatusSchema = z.object({
  status: z.string().min(1, 'Select a status'),
  response: z.string().trim().optional().or(z.literal('')),
});
