import { Router } from 'express';
import { body } from 'express-validator';
import * as ctrl from '../../controllers/application.controller.js';
import { ROLES, EMPLOYMENT_TYPE_VALUES } from '../../constants/index.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { idParam } from '../../validators/common.validator.js';

const router = Router();
router.use(authenticate);

const createValidator = [
  body('category').isMongoId().withMessage('Select a valid loan category'),
  body('amount').isFloat({ min: 1 }).withMessage('Enter a valid amount'),
  body('tenureMonths').isInt({ min: 1 }).withMessage('Enter a valid tenure'),
  body('employmentType').optional().isIn(EMPLOYMENT_TYPE_VALUES).withMessage('Invalid employment type'),
  body('monthlyIncome').optional().isFloat({ min: 0 }),
];

router.get('/', ctrl.list);
router.get('/stats/me', ctrl.myStats);
router.get('/:id', validate(idParam()), ctrl.getOne);
router.post('/', authorize(ROLES.CUSTOMER), validate(createValidator), ctrl.create);
router.put(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.EMPLOYEE),
  validate([...idParam(), body('status').optional().isString()]),
  ctrl.updateStatus
);

export default router;
