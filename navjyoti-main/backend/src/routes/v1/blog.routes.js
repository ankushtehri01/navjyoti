import { Router } from 'express';
import { body } from 'express-validator';
import { Blog } from '../../models/blog.model.js';
import { createCrudController } from '../../controllers/crud.factory.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { MESSAGES } from '../../constants/messages.js';
import { HTTP_STATUS, ROLES, BLOG_STATUS } from '../../constants/index.js';
import { authenticate, authorize, optionalAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { idParam } from '../../validators/common.validator.js';
import { pick } from '../../utils/pick.js';

const router = Router();
const isStaff = (req) => [ROLES.ADMIN, ROLES.EMPLOYEE].includes(req.user?.role);
const WRITABLE = ['title', 'excerpt', 'content', 'coverImage', 'category', 'tags', 'status', 'isFeatured'];

const controller = createCrudController(Blog, {
  resourceName: 'Blog',
  searchFields: ['title', 'excerpt', 'category'],
  filterFields: ['status', 'category', 'isFeatured'],
  defaultSort: { publishedAt: -1, createdAt: -1 },
  populate: { path: 'author', select: 'name' },
  baseFilter: (req) => (isStaff(req) ? {} : { status: BLOG_STATUS.PUBLISHED }),
  writableFields: WRITABLE,
});

const create = asyncHandler(async (req, res) => {
  const doc = await Blog.create({ ...pick(req.body, WRITABLE), author: req.user._id });
  return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.CREATED, { item: doc }).send(res);
});

const getBySlug = asyncHandler(async (req, res) => {
  const filter = { slug: req.params.slug };
  if (!isStaff(req)) filter.status = BLOG_STATUS.PUBLISHED;
  const item = await Blog.findOneAndUpdate(filter, { $inc: { views: 1 } }, { returnDocument: 'after' }).populate('author', 'name');
  if (!item) throw ApiError.notFound('Blog not found');
  return ApiResponse.ok(res, MESSAGES.FETCHED, { item });
});

const writeValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

router.get('/', optionalAuth, controller.list);
router.get('/:slug', optionalAuth, getBySlug);

const staff = [authenticate, authorize(ROLES.ADMIN, ROLES.EMPLOYEE)];
router.post('/', staff, validate(writeValidator), create);
router.put('/:id', staff, validate([...idParam(), ...writeValidator]), controller.update);
router.delete('/:id', staff, validate(idParam()), controller.remove);

export default router;
