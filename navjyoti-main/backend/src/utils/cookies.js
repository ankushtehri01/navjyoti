/**
 * Refresh-token cookie helpers. The refresh token is stored in an httpOnly,
 * SameSite cookie scoped to the auth path so it is never exposed to JS and
 * only travels to auth endpoints.
 */
import { env } from '../config/env.js';
import { COOKIE_NAMES } from '../constants/index.js';

const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const baseOptions = () => ({
  httpOnly: true,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite,
  path: `${env.apiPrefix}/auth`,
});

export const setRefreshCookie = (res, token) => {
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, token, {
    ...baseOptions(),
    maxAge: REFRESH_MAX_AGE_MS,
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, baseOptions());
};

export const readRefreshCookie = (req) => req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];
