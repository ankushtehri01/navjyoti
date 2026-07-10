import { Router } from 'express';
import { body } from 'express-validator';
import { Contact } from '../../models/contact.model.js';
import { createCrudController } from '../../controllers/crud.factory.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { MESSAGES } from '../../constants/messages.js';
import { HTTP_STATUS, ROLES, CONTACT_STATUS_VALUES_LIST } from '../../constants/index.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { idParam } from '../../validators/common.validator.js';
import { pick } from '../../utils/pick.js';

const router = Router();

const controller = createCrudController(Contact, {
  resourceName: 'Contact',
  searchFields: ['name', 'email', 'subject'],
  filterFields: ['status'],
});

const createContact = asyncHandler(async (req, res) => {
  const doc = await Contact.create(pick(req.body, ['name', 'email', 'phone', 'subject', 'message']));
  return new ApiResponse(HTTP_STATUS.CREATED, 'Message sent successfully.', { item: { _id: doc._id } }).send(res);
});

const updateContact = asyncHandler(async (req, res) => {
  const doc = await Contact.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Contact not found');
  Object.assign(doc, pick(req.body, ['status', 'response', 'assignedTo']));
  if (req.body.response) doc.respondedAt = new Date();
  await doc.save();
  return ApiResponse.ok(res, MESSAGES.UPDATED, { item: doc });
});

const createValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];
const updateValidator = [
  body('status').optional().isIn(CONTACT_STATUS_VALUES_LIST).withMessage('Invalid status'),
];

// Public
router.post('/', authLimiter, validate(createValidator), createContact);

// Admin
const staff = [authenticate, authorize(ROLES.ADMIN, ROLES.EMPLOYEE)];
router.get('/', staff, controller.list);
router.put('/:id', staff, validate([...idParam(), ...updateValidator]), updateContact);
router.delete('/:id', staff, validate(idParam()), controller.remove);

export default router;
