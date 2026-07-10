/**
 * Loan application workflow. Customers create & view their own applications;
 * staff review and update status. Approval/disbursement spawns a Loan and a
 * notification for the applicant.
 */
import { Application } from '../models/application.model.js';
import { LoanCategory } from '../models/loanCategory.model.js';
import { Loan } from '../models/loan.model.js';
import { Notification } from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import {
  HTTP_STATUS, ROLES, APPLICATION_STATUS, APPLICATION_STATUS_VALUES,
} from '../constants/index.js';
import { paginate } from '../utils/query.js';
import { pick } from '../utils/pick.js';
import { calculateEMI } from '../utils/finance.js';

const isStaff = (req) => [ROLES.ADMIN, ROLES.EMPLOYEE].includes(req.user.role);
const scopeFilter = (req) => (isStaff(req) ? {} : { user: req.user._id });

const computeStats = async (baseFilter) => {
  const rows = await Application.aggregate([
    { $match: baseFilter },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const byStatus = Object.fromEntries(rows.map((r) => [r._id, r.count]));
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  const approved = (byStatus[APPLICATION_STATUS.APPROVED] || 0) + (byStatus[APPLICATION_STATUS.DISBURSED] || 0);
  const pending =
    (byStatus[APPLICATION_STATUS.SUBMITTED] || 0) +
    (byStatus[APPLICATION_STATUS.UNDER_REVIEW] || 0) +
    (byStatus[APPLICATION_STATUS.DOCUMENTS_PENDING] || 0);
  return { total, approved, pending, rejected: byStatus[APPLICATION_STATUS.REJECTED] || 0 };
};

/** GET /applications */
export const list = asyncHandler(async (req, res) => {
  const baseFilter = scopeFilter(req);
  const result = await paginate(Application, {
    query: req.query,
    baseFilter,
    searchFields: ['applicationNumber'],
    filterFields: ['status'],
    populate: [
      { path: 'category', select: 'name' },
      { path: 'user', select: 'name email' },
    ],
  });
  const stats = await computeStats(baseFilter);
  return ApiResponse.ok(res, MESSAGES.FETCHED, { ...result, stats });
});

/** GET /applications/stats/me */
export const myStats = asyncHandler(async (req, res) => {
  const stats = await computeStats({ user: req.user._id });
  return ApiResponse.ok(res, MESSAGES.FETCHED, stats);
});

/** GET /applications/:id */
export const getOne = asyncHandler(async (req, res) => {
  const item = await Application.findOne({ _id: req.params.id, ...scopeFilter(req) })
    .populate('category', 'name interestRateMin')
    .populate('user', 'name email phone')
    .populate('documents');
  if (!item) throw ApiError.notFound('Application not found');
  return ApiResponse.ok(res, MESSAGES.FETCHED, { item });
});

/** POST /applications (customer) */
export const create = asyncHandler(async (req, res) => {
  const data = pick(req.body, [
    'category', 'amount', 'tenureMonths', 'purpose', 'employmentType', 'monthlyIncome', 'companyName',
  ]);

  const category = await LoanCategory.findOne({ _id: data.category, isActive: true });
  if (!category) throw ApiError.badRequest('Selected loan category is unavailable');
  if (data.amount < category.minAmount || data.amount > category.maxAmount) {
    throw ApiError.badRequest(`Amount must be between ${category.minAmount} and ${category.maxAmount}`);
  }

  const application = await Application.create({
    ...data,
    user: req.user._id,
    status: APPLICATION_STATUS.SUBMITTED,
    statusHistory: [{ status: APPLICATION_STATUS.SUBMITTED, changedBy: req.user._id, note: 'Application submitted' }],
  });

  return new ApiResponse(HTTP_STATUS.CREATED, 'Application submitted successfully.', {
    item: application,
    applicationNumber: application.applicationNumber,
  }).send(res);
});

/** PUT /applications/:id (staff) — status workflow. */
export const updateStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('category', 'interestRateMin');
  if (!application) throw ApiError.notFound('Application not found');

  const { status, remarks, approvedAmount, approvedRate, rejectionReason } = req.body;
  if (status && !APPLICATION_STATUS_VALUES.includes(status)) {
    throw ApiError.badRequest('Invalid status');
  }

  if (status) {
    application.status = status;
    application.statusHistory.push({ status, changedBy: req.user._id, note: remarks || '' });
  }
  if (remarks !== undefined) application.remarks = remarks;
  if (approvedAmount !== undefined) application.approvedAmount = approvedAmount;
  if (approvedRate !== undefined) application.approvedRate = approvedRate;
  if (rejectionReason !== undefined) application.rejectionReason = rejectionReason;
  await application.save();

  // On disbursement, create the Loan record (idempotent).
  if (status === APPLICATION_STATUS.DISBURSED) {
    const exists = await Loan.findOne({ application: application._id });
    if (!exists) {
      const principal = application.approvedAmount || application.amount;
      const rate = application.approvedRate || application.category?.interestRateMin || 12;
      const { emi, totalPayable } = calculateEMI(principal, rate, application.tenureMonths);
      await Loan.create({
        user: application.user,
        application: application._id,
        category: application.category,
        principal,
        interestRate: rate,
        tenureMonths: application.tenureMonths,
        emi,
        totalPayable,
        outstanding: totalPayable,
      });
    }
  }

  // Notify the applicant of the status change.
  if (status) {
    await Notification.create({
      user: application.user,
      title: 'Application update',
      message: `Your application ${application.applicationNumber} is now "${status.replace(/_/g, ' ')}".`,
      type: status === APPLICATION_STATUS.REJECTED ? 'error' : status === APPLICATION_STATUS.APPROVED ? 'success' : 'info',
      link: '/dashboard/applications',
    });
  }

  return ApiResponse.ok(res, MESSAGES.UPDATED, { item: application });
});
