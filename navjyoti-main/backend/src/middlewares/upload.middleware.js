/**
 * Multer configured with in-memory storage (buffers are streamed to Cloudinary),
 * a size limit, and an image/PDF file filter.
 */
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED.includes(file.mimetype)) return cb(null, true);
  return cb(ApiError.badRequest('Only images and PDF files are allowed'), false);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.upload.maxFileSizeBytes },
  fileFilter,
});
