/** User roles — must mirror the backend constants. */
export const ROLES = Object.freeze({
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer',
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));
