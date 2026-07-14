/**
 * Centralized route paths. Import these instead of hardcoding URLs
 * so links and navigation stay consistent and refactor-safe.
 */
export const ROUTES = Object.freeze({
  // Public
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  LOANS: '/loans',
  LOAN_PERSONAL: '/loans/personal',
  LOAN_BUSINESS: '/loans/business',
  LOAN_HOME: '/loans/home',
  LOAN_CAR: '/loans/car',
  LOAN_EDUCATION: '/loans/education',
  LOAN_GOLD: '/loans/gold',
  CREDIT_CARDS: '/credit-cards',
  INSURANCE: '/insurance',
  INVESTMENTS: '/investments',
  EMI_CALCULATOR: '/emi-calculator',
  ELIGIBILITY_CALCULATOR: '/eligibility-calculator',
  BLOGS: '/blogs',
  BLOG_DETAIL: '/blogs/:slug',
  FAQ: '/faq',
  TESTIMONIALS: '/testimonials',
  CONTACT: '/contact',
  GET_FUNDING: '/get-funding',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',

  // Customer dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_APPLY: '/dashboard/apply',
  DASHBOARD_APPLICATIONS: '/dashboard/applications',
  DASHBOARD_DOCUMENTS: '/dashboard/documents',
  DASHBOARD_NOTIFICATIONS: '/dashboard/notifications',
  DASHBOARD_SUPPORT: '/dashboard/support',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_EMPLOYEES: '/admin/employees',
  ADMIN_LOANS: '/admin/loans',
  ADMIN_APPLICATIONS: '/admin/applications',
  ADMIN_BLOGS: '/admin/blogs',
  ADMIN_FAQS: '/admin/faqs',
  ADMIN_TESTIMONIALS: '/admin/testimonials',
  ADMIN_CONTACTS: '/admin/contacts',
  ADMIN_OFFERS: '/admin/offers',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_SETTINGS: '/admin/settings',

  // Fallback
  NOT_FOUND: '*',
});

/** Build a concrete path from a param template, e.g. buildPath(ROUTES.BLOG_DETAIL, { slug }). */
export const buildPath = (template, params = {}) =>
  Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(value)),
    template
  );
