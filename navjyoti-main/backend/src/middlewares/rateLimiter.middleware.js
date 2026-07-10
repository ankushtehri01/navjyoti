/**
 * Reusable rate limiters. `apiLimiter` guards the whole API surface;
 * `authLimiter` is stricter for auth-sensitive endpoints (login/register/reset).
 */
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/index.js';
import { MESSAGES } from '../constants/messages.js';

const handler = (_req, res) =>
  res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
    success: false,
    message: MESSAGES.TOO_MANY_REQUESTS,
    errors: [],
  });

export const apiLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.isTest,
  handler,
});

export const authLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: () => env.isTest,
  handler,
});
