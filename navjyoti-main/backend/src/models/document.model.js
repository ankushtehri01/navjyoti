/**
 * Document — a KYC/financial file uploaded for an application, with a
 * verification workflow. File bytes live in Cloudinary; we store the reference.
 */
import mongoose from 'mongoose';
import {
  DOCUMENT_STATUS,
  DOCUMENT_STATUS_VALUES,
  DOCUMENT_TYPE_VALUES,
} from '../constants/index.js';
import { mediaSchema } from './common.schema.js';

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
      index: true,
    },
    type: { type: String, enum: DOCUMENT_TYPE_VALUES, required: true },
    label: { type: String, default: '' },
    file: { type: mediaSchema, required: true },

    status: {
      type: String,
      enum: DOCUMENT_STATUS_VALUES,
      default: DOCUMENT_STATUS.PENDING,
      index: true,
    },
    remarks: { type: String, default: '' },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Document = mongoose.model('Document', documentSchema);
export default Document;
