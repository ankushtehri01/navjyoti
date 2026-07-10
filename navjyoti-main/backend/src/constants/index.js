/**
 * Application-wide constants and enums.
 * Import from a single place to avoid magic strings across the codebase.
 */

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer',
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));

export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL: 500,
  SERVICE_UNAVAILABLE: 503,
});

export const APPLICATION_STATUS = Object.freeze({
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  DOCUMENTS_PENDING: 'documents_pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DISBURSED: 'disbursed',
});

export const APPLICATION_STATUS_VALUES = Object.freeze(
  Object.values(APPLICATION_STATUS)
);

export const DOCUMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
});

export const DOCUMENT_STATUS_VALUES = Object.freeze(Object.values(DOCUMENT_STATUS));

export const DOCUMENT_TYPE = Object.freeze({
  AADHAAR: 'aadhaar',
  PAN: 'pan',
  PASSPORT: 'passport',
  PHOTO: 'photo',
  ADDRESS_PROOF: 'address_proof',
  SALARY_SLIP: 'salary_slip',
  BANK_STATEMENT: 'bank_statement',
  ITR: 'itr',
  BUSINESS_PROOF: 'business_proof',
  OTHER: 'other',
});

export const DOCUMENT_TYPE_VALUES = Object.freeze(Object.values(DOCUMENT_TYPE));

export const LOAN_STATUS = Object.freeze({
  ACTIVE: 'active',
  CLOSED: 'closed',
  FORECLOSED: 'foreclosed',
  DEFAULTED: 'defaulted',
});

export const LOAN_STATUS_VALUES = Object.freeze(Object.values(LOAN_STATUS));

export const EMPLOYMENT_TYPE = Object.freeze({
  SALARIED: 'salaried',
  SELF_EMPLOYED: 'self_employed',
  BUSINESS: 'business',
  STUDENT: 'student',
  RETIRED: 'retired',
});

export const EMPLOYMENT_TYPE_VALUES = Object.freeze(Object.values(EMPLOYMENT_TYPE));

export const BLOG_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
});

export const BLOG_STATUS_VALUES = Object.freeze(Object.values(BLOG_STATUS));

export const CONTACT_STATUS_VALUES_LIST = Object.freeze(['new', 'in_progress', 'resolved']);

export const DEPARTMENT = Object.freeze({
  SALES: 'sales',
  CREDIT: 'credit',
  OPERATIONS: 'operations',
  SUPPORT: 'support',
  MANAGEMENT: 'management',
});

export const DEPARTMENT_VALUES = Object.freeze(Object.values(DEPARTMENT));

export const NOTIFICATION_TYPE_VALUES = Object.freeze([
  'info',
  'success',
  'warning',
  'error',
]);

export const CONTACT_STATUS = Object.freeze({
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
});

export const NOTIFICATION_TYPE = Object.freeze({
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
});

export const TOKEN_TYPE = Object.freeze({
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET: 'reset',
});

export const COOKIE_NAMES = Object.freeze({
  REFRESH_TOKEN: 'nj_refresh',
});

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
});
