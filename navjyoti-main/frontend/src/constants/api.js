/**
 * API endpoint paths (relative to VITE_API_URL).
 * Keeps request URLs consistent and discoverable in one place.
 */
export const API = Object.freeze({
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: '/users',
  ME: '/users/me',
  ME_AVATAR: '/users/me/avatar',
  ME_PASSWORD: '/users/me/password',
  EMPLOYEES: '/employees',
  LOANS: '/loans',
  LOAN_CATEGORIES: '/loan-categories',
  APPLICATIONS: '/applications',
  DOCUMENTS: '/documents',
  BLOGS: '/blogs',
  FAQS: '/faqs',
  REVIEWS: '/reviews',
  OFFERS: '/offers',
  CONTACTS: '/contacts',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  HEALTH: '/health',
});
