/**
 * Operational error type carrying an HTTP status and optional field errors.
 * Thrown anywhere in the request lifecycle and handled by the error middleware.
 */
import { HTTP_STATUS } from '../constants/index.js';

export class ApiError extends Error {
  /**
   * @param {number} statusCode HTTP status code
   * @param {string} message    Human-readable message
   * @param {Array}  errors     Optional array of field-level errors
   * @param {boolean} isOperational Whether the error is expected/handled
   */
  constructor(statusCode, message, errors = [], isOperational = true) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad request', errors = []) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message = 'Not found') {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  static unprocessable(message = 'Unprocessable entity', errors = []) {
    return new ApiError(HTTP_STATUS.UNPROCESSABLE, message, errors);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(HTTP_STATUS.INTERNAL, message, [], false);
  }
}

export default ApiError;
