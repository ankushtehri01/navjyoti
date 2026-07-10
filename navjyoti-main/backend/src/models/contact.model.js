/**
 * Contact — a query submitted from the public contact form, with a
 * lightweight resolution workflow for the admin inbox.
 */
import mongoose from 'mongoose';
import { CONTACT_STATUS, CONTACT_STATUS_VALUES_LIST } from '../constants/index.js';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: '' },
    message: { type: String, required: true },

    status: {
      type: String,
      enum: CONTACT_STATUS_VALUES_LIST,
      default: CONTACT_STATUS.NEW,
      index: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    response: { type: String, default: '' },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });

export const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
