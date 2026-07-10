/**
 * JWT signing/verification for access, refresh, and password-reset tokens.
 * Access tokens are short-lived; refresh/reset embed `tokenVersion` so they
 * can be invalidated by bumping the user's version.
 */
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { TOKEN_TYPE } from '../constants/index.js';

export const generateAccessToken = (user) =>
  jwt.sign(
    { sub: String(user._id), role: user.role, type: TOKEN_TYPE.ACCESS },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiry }
  );

export const generateRefreshToken = (user) =>
  jwt.sign(
    { sub: String(user._id), tokenVersion: user.tokenVersion, type: TOKEN_TYPE.REFRESH },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiry }
  );

export const generateResetToken = (user) =>
  jwt.sign(
    { sub: String(user._id), tokenVersion: user.tokenVersion, type: TOKEN_TYPE.RESET },
    env.jwt.resetSecret,
    { expiresIn: env.jwt.resetExpiry }
  );

export const verifyAccessToken = (token) => jwt.verify(token, env.jwt.accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwt.refreshSecret);
export const verifyResetToken = (token) => jwt.verify(token, env.jwt.resetSecret);

/** Issue a fresh access + refresh pair for a user. */
export const issueTokenPair = (user) => ({
  accessToken: generateAccessToken(user),
  refreshToken: generateRefreshToken(user),
});
