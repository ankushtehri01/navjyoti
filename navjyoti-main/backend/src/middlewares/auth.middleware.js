/**
 * authenticate  — verifies the Bearer access token and loads the live user
 *                 (so disabled/deleted accounts are rejected immediately).
 * authorize(...) — restricts a route to the given roles.
 */
import { User } from '../models/user.model.js';
import { verifyAccessToken } from '../services/token.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { MESSAGES } from '../constants/messages.js';

const extractToken = (req) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
};

export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) throw ApiError.unauthorized(MESSAGES.UNAUTHORIZED);

  const payload = verifyAccessToken(token); // throws -> handled as 401
  const user = await User.findById(payload.sub);

  if (!user) throw ApiError.unauthorized(MESSAGES.INVALID_TOKEN);
  if (!user.isActive) throw ApiError.forbidden(MESSAGES.ACCOUNT_DISABLED);

  req.user = user;
  return next();
});

export const authorize = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!req.user) throw ApiError.unauthorized(MESSAGES.UNAUTHORIZED);
    if (roles.length && !roles.includes(req.user.role)) {
      throw ApiError.forbidden(MESSAGES.FORBIDDEN);
    }
    return next();
  });

/**
 * Attaches req.user if a valid token is present, but never rejects.
 * Used on endpoints that are public yet richer for authenticated/admin users.
 */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && user.isActive) req.user = user;
  } catch {
    // ignore invalid token — treat as anonymous
  }
  return next();
});
