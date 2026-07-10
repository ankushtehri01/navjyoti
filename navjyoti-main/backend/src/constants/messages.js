/**
 * Centralized user-facing response messages.
 * Keeps copy consistent and easy to localize later.
 */
export const MESSAGES = Object.freeze({
  // Generic
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_FAILED: 'Validation failed. Please check your input.',
  UNAUTHORIZED: 'You are not authenticated.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  TOO_MANY_REQUESTS: 'Too many requests. Please slow down and try again shortly.',

  // Auth
  REGISTERED: 'Registration successful.',
  LOGGED_IN: 'Logged in successfully.',
  LOGGED_OUT: 'Logged out successfully.',
  TOKEN_REFRESHED: 'Session refreshed.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_IN_USE: 'An account with this email already exists.',
  INVALID_TOKEN: 'Invalid or expired token.',
  PASSWORD_RESET_SENT: 'If an account exists, a reset link has been sent.',
  PASSWORD_RESET_SUCCESS: 'Password has been reset successfully.',
  ACCOUNT_DISABLED: 'Your account has been disabled. Contact support.',

  // CRUD
  CREATED: 'Created successfully.',
  UPDATED: 'Updated successfully.',
  DELETED: 'Deleted successfully.',
  FETCHED: 'Fetched successfully.',
});

export default MESSAGES;
