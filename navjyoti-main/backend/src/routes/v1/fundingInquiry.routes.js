import { Router } from 'express';
import { body } from 'express-validator';
import { FundingInquiry } from '../../models/fundingInquiry.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { HTTP_STATUS } from '../../constants/index.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { pick } from '../../utils/pick.js';

const router = Router();

const createValidator = [
  body('fundingNeed').trim().notEmpty().withMessage('Select what you need funding for'),
  body('fundingNeedLabel').trim().notEmpty(),
  body('amountRange').trim().notEmpty().withMessage('Select a funding range'),
  body('applicantProfile').trim().notEmpty().withMessage('Select your profile'),
  body('applicantProfileLabel').trim().notEmpty(),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('phone').trim().isLength({ min: 8, max: 20 }).withMessage('Enter a valid phone number'),
  body('city').optional().trim().isLength({ max: 100 }),
  body('companyName').optional().trim().isLength({ max: 150 }),
  body('note').optional().trim().isLength({ max: 500 }),
];

router.post(
  '/',
  authLimiter,
  validate(createValidator),
  asyncHandler(async (req, res) => {
    const inquiry = await FundingInquiry.create(
      pick(req.body, [
        'fundingNeed', 'fundingNeedLabel', 'amountRange', 'applicantProfile',
        'applicantProfileLabel', 'name', 'email', 'phone', 'city', 'companyName', 'note',
      ])
    );

    return new ApiResponse(HTTP_STATUS.CREATED, 'Your funding request has been submitted.', {
      inquiryNumber: inquiry.inquiryNumber,
    }).send(res);
  })
);

export default router;
