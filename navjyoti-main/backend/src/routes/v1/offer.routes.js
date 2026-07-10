import { Router } from 'express';
import { body } from 'express-validator';
import { Offer } from '../../models/offer.model.js';
import { createCrudController } from '../../controllers/crud.factory.js';
import { ROLES } from '../../constants/index.js';
import { authenticate, authorize, optionalAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { idParam } from '../../validators/common.validator.js';

const router = Router();
const isStaff = (req) => [ROLES.ADMIN, ROLES.EMPLOYEE].includes(req.user?.role);

const controller = createCrudController(Offer, {
  resourceName: 'Offer',
  searchFields: ['title', 'code'],
  filterFields: ['isActive'],
  baseFilter: (req) => (isStaff(req) ? {} : { isActive: true }),
  writableFields: [
    'title', 'description', 'badge', 'image', 'category', 'code', 'highlightRate',
    'ctaLabel', 'ctaLink', 'validFrom', 'validTo', 'isActive',
  ],
});

const writeValidator = [body('title').trim().notEmpty().withMessage('Title is required')];

router.get('/', optionalAuth, controller.list);

const staff = [authenticate, authorize(ROLES.ADMIN, ROLES.EMPLOYEE)];
router.post('/', staff, validate(writeValidator), controller.create);
router.put('/:id', staff, validate([...idParam(), ...writeValidator]), controller.update);
router.delete('/:id', staff, validate(idParam()), controller.remove);

export default router;
