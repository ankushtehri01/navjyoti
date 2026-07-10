import { Router } from 'express';
import { Settings } from '../../models/settings.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { MESSAGES } from '../../constants/messages.js';
import { ROLES } from '../../constants/index.js';
import { authenticate, authorize, optionalAuth } from '../../middlewares/auth.middleware.js';
import { pick } from '../../utils/pick.js';

const router = Router();

const WRITABLE = ['siteName', 'tagline', 'supportEmail', 'supportPhone', 'address', 'socials', 'hero', 'stats', 'maintenanceMode'];

const get = asyncHandler(async (_req, res) => {
  const settings = await Settings.getSingleton();
  return ApiResponse.ok(res, MESSAGES.FETCHED, settings);
});

const update = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  Object.assign(settings, pick(req.body, WRITABLE));
  await settings.save();
  return ApiResponse.ok(res, MESSAGES.UPDATED, settings);
});

router.get('/', optionalAuth, get);
router.put('/', authenticate, authorize(ROLES.ADMIN), update);

export default router;
