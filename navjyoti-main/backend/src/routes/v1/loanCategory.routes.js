import { Router } from 'express';
import { body } from 'express-validator';
import { LoanCategory } from '../../models/loanCategory.model.js';
import { createCrudController } from '../../controllers/crud.factory.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { MESSAGES } from '../../constants/messages.js';
import { ROLES } from '../../constants/index.js';
import { authenticate, authorize, optionalAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { idParam } from '../../validators/common.validator.js';

const router = Router();
const isStaff = (req) => [ROLES.ADMIN, ROLES.EMPLOYEE].includes(req.user?.role);

const controller = createCrudController(LoanCategory, {
  resourceName: 'Loan category',
  searchFields: ['name', 'tagline'],
  filterFields: ['isActive'],
  defaultSort: { order: 1, createdAt: -1 },
  baseFilter: (req) => (isStaff(req) ? {} : { isActive: true }),
  writableFields: [
    'name', 'tagline', 'description', 'icon', 'image', 'minAmount', 'maxAmount',
    'minTenureMonths', 'maxTenureMonths', 'interestRateMin', 'interestRateMax',
    'processingFeePercent', 'features', 'eligibility', 'requiredDocuments', 'order', 'isActive',
  ],
});

const getBySlug = asyncHandler(async (req, res) => {
  const filter = { slug: req.params.slug };
  if (![ROLES.ADMIN, ROLES.EMPLOYEE].includes(req.user?.role)) filter.isActive = true;
  const item = await LoanCategory.findOne(filter);
  if (!item) throw ApiError.notFound('Loan category not found');
  return ApiResponse.ok(res, MESSAGES.FETCHED, { item });
});

const writeValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('minAmount').isFloat({ min: 0 }),
  body('maxAmount').isFloat({ min: 0 }),
  body('minTenureMonths').isInt({ min: 1 }),
  body('maxTenureMonths').isInt({ min: 1 }),
  body('interestRateMin').isFloat({ min: 0 }),
  body('interestRateMax').isFloat({ min: 0 }),
];

router.get('/', optionalAuth, controller.list);
router.get('/:slug', optionalAuth, getBySlug);

const staff = [authenticate, authorize(ROLES.ADMIN, ROLES.EMPLOYEE)];
router.post('/', staff, validate(writeValidator), controller.create);
router.put('/:id', staff, validate([...idParam(), ...writeValidator]), controller.update);
router.delete('/:id', staff, validate(idParam()), controller.remove);

export default router;
