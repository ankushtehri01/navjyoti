/**
 * Reusable embedded sub-schemas shared across models.
 * `_id: false` since these are value objects, not standalone documents.
 */
import mongoose from 'mongoose';

/** Cloudinary (or external) media reference. */
export const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
    mimeType: { type: String, default: '' },
    size: { type: Number, default: 0 },
  },
  { _id: false }
);

/** A single entry in an application's status timeline. */
export const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);
