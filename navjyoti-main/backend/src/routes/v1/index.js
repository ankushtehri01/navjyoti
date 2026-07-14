/**
 * v1 API router. Mounts all feature routers.
 */
import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import employeeRoutes from './employee.routes.js';
import loanCategoryRoutes from './loanCategory.routes.js';
import applicationRoutes from './application.routes.js';
import documentRoutes from './document.routes.js';
import contactRoutes from './contact.routes.js';
import fundingInquiryRoutes from './fundingInquiry.routes.js';
import blogRoutes from './blog.routes.js';
import faqRoutes from './faq.routes.js';
import reviewRoutes from './review.routes.js';
import offerRoutes from './offer.routes.js';
import notificationRoutes from './notification.routes.js';
import settingsRoutes from './settings.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/loan-categories', loanCategoryRoutes);
router.use('/applications', applicationRoutes);
router.use('/documents', documentRoutes);
router.use('/contacts', contactRoutes);
router.use('/funding-inquiries', fundingInquiryRoutes);
router.use('/blogs', blogRoutes);
router.use('/faqs', faqRoutes);
router.use('/reviews', reviewRoutes);
router.use('/offers', offerRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin', analyticsRoutes);

export default router;
