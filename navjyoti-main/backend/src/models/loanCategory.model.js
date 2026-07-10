/**
 * LoanCategory — a loan product type (Personal, Business, Home, Car, Education, Gold).
 * Drives public listings, calculators, and application forms.
 */
import mongoose from 'mongoose';
import slugify from 'slugify';
import { mediaSchema } from './common.schema.js';

const loanCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, unique: true, index: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: '' }, // icon key rendered on the client
    image: { type: mediaSchema, default: () => ({}) },

    minAmount: { type: Number, required: true, min: 0 },
    maxAmount: { type: Number, required: true, min: 0 },
    minTenureMonths: { type: Number, required: true, min: 1 },
    maxTenureMonths: { type: Number, required: true, min: 1 },
    interestRateMin: { type: Number, required: true, min: 0 }, // annual %
    interestRateMax: { type: Number, required: true, min: 0 },
    processingFeePercent: { type: Number, default: 1, min: 0 },

    features: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    requiredDocuments: { type: [String], default: [] },

    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

loanCategorySchema.pre('save', function setSlug() {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

export const LoanCategory = mongoose.model('LoanCategory', loanCategorySchema);
export default LoanCategory;
