/**
 * Loan — a sanctioned/disbursed loan created from an approved Application.
 * Tracks the amortization terms and lifecycle status.
 */
import mongoose from 'mongoose';
import { LOAN_STATUS, LOAN_STATUS_VALUES } from '../constants/index.js';

const loanSchema = new mongoose.Schema(
  {
    loanNumber: { type: String, unique: true, index: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanCategory', required: true },

    principal: { type: Number, required: true, min: 0 },
    interestRate: { type: Number, required: true, min: 0 }, // annual %
    tenureMonths: { type: Number, required: true, min: 1 },
    emi: { type: Number, required: true, min: 0 },
    totalPayable: { type: Number, required: true, min: 0 },
    outstanding: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: LOAN_STATUS_VALUES,
      default: LOAN_STATUS.ACTIVE,
      index: true,
    },
    disbursedAt: { type: Date, default: Date.now },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

loanSchema.pre('save', function setNumber() {
  if (!this.loanNumber) {
    const year = new Date().getFullYear();
    const tail = Date.now().toString().slice(-7);
    const rand = Math.floor(10 + Math.random() * 90);
    this.loanNumber = `NJL-${year}-${tail}${rand}`;
  }
});

export const Loan = mongoose.model('Loan', loanSchema);
export default Loan;
