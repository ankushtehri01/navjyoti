/**
 * Admin entity services — one line each via the resource factory.
 */
import { createResource } from './resource.js';
import { http } from './http.js';
import { API } from '@/constants/api.js';

export const usersResource = createResource(API.USERS);
export const employeesResource = createResource(API.EMPLOYEES);
export const applicationsResource = createResource(API.APPLICATIONS);
export const loanCategoriesResource = createResource(API.LOAN_CATEGORIES);
export const blogsResource = createResource(API.BLOGS);
export const faqsResource = createResource(API.FAQS);
export const reviewsResource = createResource(API.REVIEWS);
export const contactsResource = createResource(API.CONTACTS);
export const offersResource = createResource(API.OFFERS);
export const notificationsResource = createResource(API.NOTIFICATIONS);

export const settingsService = {
  get: () => http.get(API.SETTINGS),
  update: (payload) => http.put(API.SETTINGS, payload),
};

export const analyticsService = {
  overview: () => http.get('/admin/analytics'),
};
