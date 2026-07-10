/**
 * Authentication business logic. Controllers stay thin and delegate here.
 * Returns plain data; HTTP concerns (cookies, status) live in the controller.
 */
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { ROLES } from '../constants/index.js';
import {
  issueTokenPair,
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
  verifyResetToken,
} from './token.service.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from './mail.service.js';
import { logger } from '../utils/logger.js';

/** Register a new customer account. */
export const register = async ({ name, email, password, phone }) => {
  const exists = await User.exists({ email: email.toLowerCase() });
  if (exists) throw ApiError.conflict(MESSAGES.EMAIL_IN_USE);

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: ROLES.CUSTOMER,
  });

  // Fire-and-forget welcome email; never block or fail registration on mail errors.
  sendWelcomeEmail(user).catch((err) => logger.warn(`Welcome email failed: ${err.message}`));

  return { user, ...issueTokenPair(user) };
};

/** Authenticate with email + password. */
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw ApiError.unauthorized(MESSAGES.INVALID_CREDENTIALS);

  const matches = await user.comparePassword(password);
  if (!matches) throw ApiError.unauthorized(MESSAGES.INVALID_CREDENTIALS);

  if (!user.isActive) throw ApiError.forbidden(MESSAGES.ACCOUNT_DISABLED);

  user.lastLogin = new Date();
  await user.save();

  return { user, ...issueTokenPair(user) };
};

/** Rotate tokens using a valid refresh token. */
export const refresh = async (refreshToken) => {
  if (!refreshToken) throw ApiError.unauthorized(MESSAGES.INVALID_TOKEN);

  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.sub);

  if (!user || !user.isActive) throw ApiError.unauthorized(MESSAGES.INVALID_TOKEN);
  if (payload.tokenVersion !== user.tokenVersion) {
    throw ApiError.unauthorized(MESSAGES.INVALID_TOKEN);
  }

  return {
    user,
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user), // rotate
  };
};

/** Begin password reset. Always resolves to avoid account enumeration. */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (user && user.isActive) {
    const resetToken = generateResetToken(user);
    await sendPasswordResetEmail(user, resetToken).catch((err) =>
      logger.warn(`Reset email failed: ${err.message}`)
    );
  }
  return { message: MESSAGES.PASSWORD_RESET_SENT };
};

/** Complete password reset; bumps tokenVersion to invalidate old sessions. */
export const resetPassword = async (token, newPassword) => {
  const payload = verifyResetToken(token);
  const user = await User.findById(payload.sub);

  if (!user || payload.tokenVersion !== user.tokenVersion) {
    throw ApiError.badRequest(MESSAGES.INVALID_TOKEN);
  }

  user.password = newPassword;
  user.tokenVersion += 1; // log out all existing sessions
  await user.save();

  return { message: MESSAGES.PASSWORD_RESET_SUCCESS };
};

/** Fetch the current user's profile. */
export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};
