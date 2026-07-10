/**
 * Admin analytics — aggregated KPIs and chart data for the dashboard.
 */
import { Router } from 'express';
import { User } from '../../models/user.model.js';
import { Application } from '../../models/application.model.js';
import { Loan } from '../../models/loan.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { MESSAGES } from '../../constants/messages.js';
import { APPLICATION_STATUS, ROLES } from '../../constants/index.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const titleCase = (s = '') => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const overview = asyncHandler(async (_req, res) => {
  const [users, applications, approved, disbursedAgg, statusAgg, categoryAgg, monthlyAgg] =
    await Promise.all([
      User.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({
        status: { $in: [APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.DISBURSED] },
      }),
      Loan.aggregate([{ $group: { _id: null, total: { $sum: '$principal' } } }]),
      Application.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]),
      Application.aggregate([
        { $lookup: { from: 'loancategories', localField: 'category', foreignField: '_id', as: 'cat' } },
        { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
        { $group: { _id: '$cat.name', value: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $group: { _id: { $month: '$createdAt' }, applications: { $sum: 1 },
          approved: { $sum: { $cond: [{ $in: ['$status', [APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.DISBURSED]] }, 1, 0] } } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

  const data = {
    kpis: {
      users,
      applications,
      approved,
      disbursed: disbursedAgg[0]?.total || 0,
    },
    byStatus: statusAgg.map((s) => ({ name: titleCase(s._id) || 'Unknown', value: s.value })),
    byCategory: categoryAgg.filter((c) => c._id).map((c) => ({ name: c._id, value: c.value })),
    monthly: monthlyAgg.map((m) => ({ month: MONTHS[m._id - 1] || '—', applications: m.applications, approved: m.approved })),
  };

  return ApiResponse.ok(res, MESSAGES.FETCHED, data);
});

router.get('/analytics', authenticate, authorize(ROLES.ADMIN, ROLES.EMPLOYEE), overview);

export default router;
