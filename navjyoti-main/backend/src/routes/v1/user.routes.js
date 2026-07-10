import { Router } from 'express';
import { body } from 'express-validator';
import * as ctrl from '../../controllers/user.controller.js';
import { ROLES, ROLE_VALUES } from '../../constants/index.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { idParam } from '../../validators/common.validator.js';

const router = Router();

// ---- Self-service (any authenticated user) ----
router.use(authenticate);

router.put(
  '/me',
  validate([body('name').optional().trim().isLength({ min: 2 }).withMessage('Name too short')]),
  ctrl.updateMe
);

router.put(
  '/me/password',
  validate([
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[a-z]/).withMessage('Add a lowercase letter')
      .matches(/[A-Z]/).withMessage('Add an uppercase letter')
      .matches(/\d/).withMessage('Add a number'),
  ]),
  ctrl.changePassword
);

router.post('/me/avatar', upload.single('avatar'), ctrl.updateAvatar);

// ---- Admin ----
const admin = authorize(ROLES.ADMIN);
router.get('/', admin, ctrl.listUsers);
router.put(
  '/:id',
  admin,
  validate([...idParam(), body('role').optional().isIn(ROLE_VALUES).withMessage('Invalid role')]),
  ctrl.updateUser
);
router.delete('/:id', admin, validate(idParam()), ctrl.deleteUser);

export default router;
