/**
 * Cloudinary upload/delete from in-memory buffers (Multer memoryStorage).
 * Falls back to a data-URI stub when Cloudinary isn't configured, so uploads
 * still succeed locally in development.
 */
import { cloudinary } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/** Upload a single file buffer; returns a media reference. */
export const uploadBuffer = (file, folder = 'misc') =>
  new Promise((resolve, reject) => {
    if (!file) return reject(ApiError.badRequest('No file provided'));

    if (!env.cloudinary.enabled) {
      // Dev fallback: no external storage — return a lightweight reference.
      return resolve({
        url: `local://${folder}/${Date.now()}-${file.originalname}`,
        publicId: `${folder}/${Date.now()}`,
        mimeType: file.mimetype,
        size: file.size,
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: `${env.cloudinary.folder}/${folder}`, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(ApiError.internal('File upload failed'));
        return resolve({
          url: result.secure_url,
          publicId: result.public_id,
          mimeType: file.mimetype,
          size: file.size,
        });
      }
    );
    stream.end(file.buffer);
  });

/** Delete a previously uploaded asset by public id (no-op in dev fallback). */
export const deleteAsset = async (publicId) => {
  if (!publicId || !env.cloudinary.enabled) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // best-effort cleanup
  }
};
