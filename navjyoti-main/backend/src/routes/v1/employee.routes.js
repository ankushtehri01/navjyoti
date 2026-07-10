import { Router } from 'express';
import { body } from 'express-validator';
import * as ctrl from '../../controllers/employee.controller.js';
import { ROLES, DEPARTMENT_VALUES } from '../../constants/index.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { idParam } from '../../validators/common.validator.js';

const router = Router();
router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', ctrl.list);
router.post(
  '/',
  validate([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
    body('department').isIn(DEPARTMENT_VALUES).withMessage('Invalid department'),
  ]),
  ctrl.create
);
router.put('/:id', validate(idParam()), ctrl.update);
router.delete('/:id', validate(idParam()), ctrl.remove);

export default router;
