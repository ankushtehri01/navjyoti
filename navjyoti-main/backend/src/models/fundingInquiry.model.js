/**
 * FundingInquiry — a public pre-application lead collected by the Get Funding
 * wizard before a visitor has created an account.
 */
import mongoose from 'mongoose';
import { CONTACT_STATUS, CONTACT_STATUS_VALUES_LIST } from '../constants/index.js';

const fundingInquirySchema = new mongoose.Schema(
  {
    inquiryNumber: { type: String, unique: true, index: true },
    fundingNeed: { type: String, required: true, trim: true },
    fundingNeedLabel: { type: String, required: true, trim: true },
    amountRange: { type: String, required: true, trim: true },
    applicantProfile: { type: String, required: true, trim: true },
    applicantProfileLabel: { type: String, required: true, trim: true },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, default: '', trim: true },
    companyName: { type: String, default: '', trim: true },
    note: { type: String, default: '', trim: true, maxlength: 500 },

    status: {
      type: String,
      enum: CONTACT_STATUS_VALUES_LIST,
      default: CONTACT_STATUS.NEW,
      index: true,
    },
  },
  { timestamps: true }
);

fundingInquirySchema.index({ createdAt: -1 });

fundingInquirySchema.pre('save', function setInquiryNumber() {
  if (!this.inquiryNumber) {
    const tail = Date.now().toString().slice(-7);
    const random = Math.floor(10 + Math.random() * 90);
    this.inquiryNumber = `NJF-${new Date().getFullYear()}-${tail}${random}`;
  }
});

export const FundingInquiry = mongoose.model('FundingInquiry', fundingInquirySchema);
export default FundingInquiry;
