/**
 * Auth controllers — thin HTTP layer over auth.service.
 * The refresh token is delivered as an httpOnly cookie; the access token
 * and sanitized user are returned in the JSON body.
 */
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/index.js';
import { setRefreshCookie, clearRefreshCookie, readRefreshCookie } from '../utils/cookies.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  setRefreshCookie(res, refreshToken);
  return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.REGISTERED, {
    user,
    accessToken,
  }).send(res);
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setRefreshCookie(res, refreshToken);
  return ApiResponse.ok(res, MESSAGES.LOGGED_IN, { user, accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.refresh(
    readRefreshCookie(req)
  );
  setRefreshCookie(res, refreshToken);
  return ApiResponse.ok(res, MESSAGES.TOKEN_REFRESHED, { user, accessToken });
});

export const logout = asyncHandler(async (_req, res) => {
  clearRefreshCookie(res);
  return ApiResponse.ok(res, MESSAGES.LOGGED_OUT, null);
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  return ApiResponse.ok(res, MESSAGES.FETCHED, { user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  return ApiResponse.ok(res, result.message, null);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body.token, req.body.password);
  clearRefreshCookie(res);
  return ApiResponse.ok(res, result.message, null);
});
