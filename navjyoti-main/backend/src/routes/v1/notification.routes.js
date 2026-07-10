import { Router } from 'express';
import { body } from 'express-validator';
import * as ctrl from '../../controllers/notification.controller.js';
import { ROLES, NOTIFICATION_TYPE_VALUES } from '../../constants/index.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { idParam } from '../../validators/common.validator.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrl.list);
router.patch('/:id/read', validate(idParam()), ctrl.markRead);
router.post('/read-all', ctrl.markAllRead);

const admin = authorize(ROLES.ADMIN, ROLES.EMPLOYEE);
router.post(
  '/',
  admin,
  validate([
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('type').optional().isIn(NOTIFICATION_TYPE_VALUES).withMessage('Invalid type'),
  ]),
  ctrl.create
);
router.delete('/:id', admin, validate(idParam()), ctrl.remove);

export default router;
