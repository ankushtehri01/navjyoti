/**
 * In-app notifications. Users see their own + broadcasts; "unread" is a
 * per-user concept, so read-state filters/mutations target user-owned docs.
 */
import { Notification } from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/index.js';
import { paginate } from '../utils/query.js';
import { pick } from '../utils/pick.js';

/** GET /notifications */
export const list = asyncHandler(async (req, res) => {
  const uid = req.user._id;

  // Read-state is per-user → when filtering by isRead, only user-owned docs.
  const baseFilter =
    req.query.isRead !== undefined
      ? { user: uid, isRead: req.query.isRead === 'true' }
      : { $or: [{ user: uid }, { user: null }] };

  const result = await paginate(Notification, {
    query: { ...req.query, isRead: undefined }, // isRead handled in baseFilter
    baseFilter,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.ok(res, MESSAGES.FETCHED, result);
});

/** PATCH /notifications/:id/read */
export const markRead = asyncHandler(async (req, res) => {
  const doc = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true, readAt: new Date() },
    { returnDocument: 'after' }
  );
  if (!doc) throw ApiError.notFound('Notification not found');
  return ApiResponse.ok(res, MESSAGES.UPDATED, { item: doc });
});

/** POST /notifications/read-all */
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  return ApiResponse.ok(res, 'All notifications marked as read.', null);
});

/** POST /notifications (admin) — targeted or broadcast (user: null). */
export const create = asyncHandler(async (req, res) => {
  const payload = pick(req.body, ['user', 'title', 'message', 'type', 'link']);
  const doc = await Notification.create({ ...payload, user: payload.user || null });
  return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.CREATED, { item: doc }).send(res);
});

/** DELETE /notifications/:id (admin) */
export const remove = asyncHandler(async (req, res) => {
  const doc = await Notification.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Notification not found');
  return ApiResponse.ok(res, MESSAGES.DELETED, null);
});
