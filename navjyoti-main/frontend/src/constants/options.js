/** Select/filter option lists derived from the shared enums. */
import { APPLICATION_STATUS_META } from './status.js';

export const ROLE_OPTIONS = [
  { value: 'customer', label: 'Customer' },
  { value: 'employee', label: 'Employee' },
  { value: 'admin', label: 'Admin' },
];

export const DEPARTMENT_OPTIONS = [
  { value: 'sales', label: 'Sales' },
  { value: 'credit', label: 'Credit' },
  { value: 'operations', label: 'Operations' },
  { value: 'support', label: 'Support' },
  { value: 'management', label: 'Management' },
];

export const BLOG_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export const NOTIFICATION_TYPE_OPTIONS = [
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
];

export const APPLICATION_STATUS_OPTIONS = Object.entries(APPLICATION_STATUS_META).map(
  ([value, meta]) => ({ value, label: meta.label })
);

export const CONTACT_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

export const YESNO_STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];
