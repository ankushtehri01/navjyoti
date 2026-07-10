import { Router } from 'express';
import { body } from 'express-validator';
import { FAQ } from '../../models/faq.model.js';
import { createCrudController } from '../../controllers/crud.factory.js';
import { ROLES } from '../../constants/index.js';
import { authenticate, authorize, optionalAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { idParam } from '../../validators/common.validator.js';

const router = Router();
const isStaff = (req) => [ROLES.ADMIN, ROLES.EMPLOYEE].includes(req.user?.role);

const controller = createCrudController(FAQ, {
  resourceName: 'FAQ',
  searchFields: ['question', 'answer', 'category'],
  filterFields: ['category', 'isActive'],
  defaultSort: { category: 1, order: 1 },
  baseFilter: (req) => (isStaff(req) ? {} : { isActive: true }),
  writableFields: ['question', 'answer', 'category', 'order', 'isActive'],
});

const writeValidator = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('answer').trim().notEmpty().withMessage('Answer is required'),
];

router.get('/', optionalAuth, controller.list);

const staff = [authenticate, authorize(ROLES.ADMIN, ROLES.EMPLOYEE)];
router.post('/', staff, validate(writeValidator), controller.create);
router.put('/:id', staff, validate([...idParam(), ...writeValidator]), controller.update);
router.delete('/:id', staff, validate(idParam()), controller.remove);

export default router;
