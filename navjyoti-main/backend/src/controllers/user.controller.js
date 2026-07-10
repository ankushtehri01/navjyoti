/**
 * User controllers: self-service profile (me) and admin user management.
 */
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { ROLE_VALUES } from '../constants/index.js';
import { paginate } from '../utils/query.js';
import { pick } from '../utils/pick.js';
import { uploadBuffer, deleteAsset } from '../services/upload.service.js';

/** PUT /users/me */
export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  Object.assign(user, pick(req.body, ['name', 'phone']));
  await user.save();
  return ApiResponse.ok(res, MESSAGES.UPDATED, { user });
});

/** PUT /users/me/password */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const matches = await user.comparePassword(currentPassword);
  if (!matches) throw ApiError.badRequest('Current password is incorrect');
  user.password = newPassword;
  await user.save();
  return ApiResponse.ok(res, 'Password changed successfully.', null);
});

/** POST /users/me/avatar */
export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No image provided');
  const user = await User.findById(req.user._id);
  const media = await uploadBuffer(req.file, 'avatars');
  if (user.avatar?.publicId) await deleteAsset(user.avatar.publicId);
  user.avatar = { url: media.url, publicId: media.publicId };
  await user.save();
  return ApiResponse.ok(res, 'Photo updated.', { user });
});

/** GET /users (admin) */
export const listUsers = asyncHandler(async (req, res) => {
  const result = await paginate(User, {
    query: req.query,
    searchFields: ['name', 'email'],
    filterFields: ['role', 'isActive'],
  });
  return ApiResponse.ok(res, MESSAGES.FETCHED, result);
});

/** PUT /users/:id (admin) */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');

  const { role, isActive } = req.body;
  if (role !== undefined) {
    if (!ROLE_VALUES.includes(role)) throw ApiError.badRequest('Invalid role');
    user.role = role;
  }
  if (isActive !== undefined) user.isActive = isActive;
  if (role !== undefined || isActive === false) user.tokenVersion += 1; // invalidate sessions
  await user.save();
  return ApiResponse.ok(res, MESSAGES.UPDATED, { user });
});

/** DELETE /users/:id (admin) */
export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    throw ApiError.badRequest('You cannot delete your own account');
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  return ApiResponse.ok(res, MESSAGES.DELETED, null);
});
