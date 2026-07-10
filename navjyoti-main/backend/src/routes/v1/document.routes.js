import { Router } from 'express';
import { body } from 'express-validator';
import * as ctrl from '../../controllers/document.controller.js';
import { ROLES, DOCUMENT_STATUS_VALUES } from '../../constants/index.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { upload as multerUpload } from '../../middlewares/upload.middleware.js';
import { idParam } from '../../validators/common.validator.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrl.list);
router.post('/', multerUpload.single('document'), ctrl.upload);
router.delete('/:id', validate(idParam()), ctrl.remove);
router.patch(
  '/:id/verify',
  authorize(ROLES.ADMIN, ROLES.EMPLOYEE),
  validate([...idParam(), body('status').isIn(DOCUMENT_STATUS_VALUES).withMessage('Invalid status')]),
  ctrl.verify
);

export default router;
