/**
 * 404 handler + centralized error handler.
 * Normalizes Mongoose/JWT/known errors into the standard error envelope:
 *   { success: false, message, errors: [] }
 */
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS as STATUS } from '../constants/index.js';
import { env } from '../config/env.js';

/** Fallback for unmatched routes. */
export const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

/** Convert framework/library errors into a consistent ApiError. */
const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  // Mongoose validation error -> 422 with field errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiError.unprocessable(MESSAGES.VALIDATION_FAILED, errors);
  }

  // Invalid ObjectId / cast error -> 400
  if (err instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for field: ${err.path}`);
  }

  // Duplicate key -> 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiError.conflict(`A record with this ${field} already exists.`);
  }

  // JWT errors -> 401
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return ApiError.unauthorized(MESSAGES.INVALID_TOKEN);
  }

  // Multer file-size error -> 400
  if (err.code === 'LIMIT_FILE_SIZE') {
    return ApiError.badRequest('File is too large.');
  }

  return new ApiError(
    err.statusCode || STATUS.INTERNAL,
    err.message || MESSAGES.SERVER_ERROR,
    err.errors || [],
    false
  );
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const error = normalizeError(err);

  if (!error.isOperational || error.statusCode >= STATUS.INTERNAL) {
    logger.error(`${req.method} ${req.originalUrl} -> ${error.message}\n${err.stack || ''}`);
  }

  const body = {
    success: false,
    message: error.statusCode >= STATUS.INTERNAL && env.isProd
      ? MESSAGES.SERVER_ERROR
      : error.message,
    errors: error.errors || [],
  };

  // Expose stack only in non-production for easier debugging.
  if (!env.isProd && err.stack) body.stack = err.stack;

  return res.status(error.statusCode).json(body);
};
