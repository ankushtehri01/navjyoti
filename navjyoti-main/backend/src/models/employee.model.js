/**
 * Employee — an employment profile extending a User whose role is `employee`
 * (or admin). Auth lives on User; this holds org-specific fields.
 */
import mongoose from 'mongoose';
import { DEPARTMENT_VALUES } from '../constants/index.js';

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: { type: String, required: true, unique: true, index: true },
    department: { type: String, enum: DEPARTMENT_VALUES, required: true, index: true },
    designation: { type: String, default: '' },
    permissions: { type: [String], default: [] },
    reportsTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    joinedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
