/**
 * Application — a customer's loan request and its review workflow.
 * On approval, a Loan document is created from it.
 */
import mongoose from 'mongoose';
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_VALUES,
  EMPLOYMENT_TYPE_VALUES,
} from '../constants/index.js';
import { statusHistorySchema } from './common.schema.js';

const applicationSchema = new mongoose.Schema(
  {
    applicationNumber: { type: String, unique: true, index: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanCategory',
      required: true,
    },

    amount: { type: Number, required: true, min: 0 },
    tenureMonths: { type: Number, required: true, min: 1 },
    purpose: { type: String, default: '' },

    // Applicant snapshot (kept even if profile changes later)
    employmentType: { type: String, enum: EMPLOYMENT_TYPE_VALUES },
    monthlyIncome: { type: Number, min: 0 },
    companyName: { type: String, default: '' },

    status: {
      type: String,
      enum: APPLICATION_STATUS_VALUES,
      default: APPLICATION_STATUS.SUBMITTED,
      index: true,
    },
    statusHistory: { type: [statusHistorySchema], default: [] },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],

    approvedAmount: { type: Number, default: null },
    approvedRate: { type: Number, default: null },
    rejectionReason: { type: String, default: '' },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

// Common admin queries: filter by status within a user, or by assignee.
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ assignedTo: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

// Generate a human-friendly, collision-resistant application number:
// NJ-YYYY-<ms tail><2 random> — unique per ms and hardened by the unique index.
applicationSchema.pre('save', function setNumber() {
  if (!this.applicationNumber) {
    const year = new Date().getFullYear();
    const tail = Date.now().toString().slice(-7);
    const rand = Math.floor(10 + Math.random() * 90);
    this.applicationNumber = `NJ-${year}-${tail}${rand}`;
  }
});

export const Application = mongoose.model('Application', applicationSchema);
export default Application;
