/**
 * Offer — a promotional banner/campaign, optionally scoped to a loan category
 * and time-bound by a validity window.
 */
import mongoose from 'mongoose';
import { mediaSchema } from './common.schema.js';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    badge: { type: String, default: '' }, // e.g. "Limited Time"
    image: { type: mediaSchema, default: () => ({}) },

    category: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanCategory', default: null },
    code: { type: String, default: '', uppercase: true, trim: true },
    highlightRate: { type: Number, default: null }, // e.g. 8.5 (%)

    ctaLabel: { type: String, default: 'Apply Now' },
    ctaLink: { type: String, default: '' },

    validFrom: { type: Date, default: Date.now },
    validTo: { type: Date, default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

/** True when active and within its validity window. */
offerSchema.virtual('isLive').get(function isLive() {
  const now = Date.now();
  const started = !this.validFrom || this.validFrom.getTime() <= now;
  const notEnded = !this.validTo || this.validTo.getTime() >= now;
  return this.isActive && started && notEnded;
});

offerSchema.set('toJSON', { virtuals: true });
offerSchema.set('toObject', { virtuals: true });

export const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
