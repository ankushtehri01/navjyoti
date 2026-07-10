import { Router } from 'express';
import { body } from 'express-validator';
import { Review } from '../../models/review.model.js';
import { createCrudController } from '../../controllers/crud.factory.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { MESSAGES } from '../../constants/messages.js';
import { HTTP_STATUS, ROLES } from '../../constants/index.js';
import { authenticate, authorize, optionalAuth } from '../../middlewares/auth.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { idParam } from '../../validators/common.validator.js';
import { pick } from '../../utils/pick.js';

const router = Router();
const isStaff = (req) => [ROLES.ADMIN, ROLES.EMPLOYEE].includes(req.user?.role);

const controller = createCrudController(Review, {
  resourceName: 'Review',
  searchFields: ['name', 'message', 'designation'],
  filterFields: ['isApproved', 'isFeatured'],
  defaultSort: { isFeatured: -1, createdAt: -1 },
  baseFilter: (req) => (isStaff(req) ? {} : { isApproved: true }),
});

const createReview = asyncHandler(async (req, res) => {
  const payload = pick(req.body, ['name', 'designation', 'rating', 'title', 'message']);
  if (req.user) {
    payload.user = req.user._id;
    payload.name = payload.name || req.user.name;
  }
  const doc = await Review.create(payload);
  return new ApiResponse(HTTP_STATUS.CREATED, 'Thanks for your review!', { item: { _id: doc._id } }).send(res);
});

const patchReview = asyncHandler(async (req, res) => {
  const doc = await Review.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Review not found');
  Object.assign(doc, pick(req.body, ['isApproved', 'isFeatured']));
  await doc.save();
  return ApiResponse.ok(res, MESSAGES.UPDATED, { item: doc });
});

const createValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
  body('message').trim().isLength({ min: 5 }).withMessage('Message is too short'),
];

router.get('/', optionalAuth, controller.list);
router.post('/', authLimiter, optionalAuth, validate(createValidator), createReview);

const staff = [authenticate, authorize(ROLES.ADMIN, ROLES.EMPLOYEE)];
router.patch('/:id', staff, validate(idParam()), patchReview);
router.delete('/:id', staff, validate(idParam()), controller.remove);

export default router;
