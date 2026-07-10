/**
 * Document uploads. Customers manage their own; staff can view/verify all.
 */
import { Document } from '../models/document.model.js';
import { Application } from '../models/application.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS, ROLES, DOCUMENT_TYPE_VALUES } from '../constants/index.js';
import { paginate } from '../utils/query.js';
import { uploadBuffer, deleteAsset } from '../services/upload.service.js';

const isStaff = (req) => [ROLES.ADMIN, ROLES.EMPLOYEE].includes(req.user.role);
const scopeFilter = (req) => (isStaff(req) ? {} : { user: req.user._id });

/** GET /documents */
export const list = asyncHandler(async (req, res) => {
  const result = await paginate(Document, {
    query: req.query,
    baseFilter: scopeFilter(req),
    filterFields: ['type', 'status', 'application'],
    populate: isStaff(req) ? { path: 'user', select: 'name email' } : undefined,
  });
  return ApiResponse.ok(res, MESSAGES.FETCHED, result);
});

/** POST /documents (multipart) */
export const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file provided');
  const { type, application } = req.body;
  if (!DOCUMENT_TYPE_VALUES.includes(type)) throw ApiError.badRequest('Invalid document type');

  // If tied to an application, ensure it belongs to the user.
  if (application) {
    const owns = await Application.exists({ _id: application, user: req.user._id });
    if (!owns && !isStaff(req)) throw ApiError.forbidden('Invalid application reference');
  }

  const media = await uploadBuffer(req.file, 'documents');
  const doc = await Document.create({
    user: req.user._id,
    application: application || null,
    type,
    file: media,
  });

  return new ApiResponse(HTTP_STATUS.CREATED, 'Document uploaded.', { item: doc }).send(res);
});

/** DELETE /documents/:id */
export const remove = asyncHandler(async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, ...scopeFilter(req) });
  if (!doc) throw ApiError.notFound('Document not found');
  await deleteAsset(doc.file?.publicId);
  await doc.deleteOne();
  return ApiResponse.ok(res, MESSAGES.DELETED, null);
});

/** PATCH /documents/:id/verify (staff) */
export const verify = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Document not found');
  doc.status = req.body.status;
  doc.remarks = req.body.remarks || '';
  doc.verifiedBy = req.user._id;
  doc.verifiedAt = new Date();
  await doc.save();
  return ApiResponse.ok(res, MESSAGES.UPDATED, { item: doc });
});
