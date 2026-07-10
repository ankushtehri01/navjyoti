/**
 * Builds and configures the Express application: security, parsing,
 * performance, logging, routing, and error handling — in the correct order.
 */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';

import { env } from '../config/env.js';
import { morganStream } from '../utils/logger.js';
import { mongoSanitize } from '../middlewares/sanitize.middleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.middleware.js';
import { notFound, errorHandler } from '../middlewares/error.middleware.js';
import v1Routes from '../routes/v1/index.js';

export const createApp = () => {
  const app = express();

  // Trust the first proxy (needed for correct client IPs behind Nginx/Vercel).
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // ---------- Security ----------
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  );

  // ---------- Body & cookie parsing ----------
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser(env.cookieSecret));

  // ---------- Injection / pollution protection ----------
  app.use(mongoSanitize);
  app.use(hpp());

  // ---------- Performance ----------
  app.use(compression());

  // ---------- Logging ----------
  if (!env.isTest) {
    app.use(morgan(env.isDev ? 'dev' : 'combined', { stream: morganStream }));
  }

  // ---------- Rate limiting (API-wide) ----------
  app.use(env.apiPrefix, apiLimiter);

  // ---------- Routes ----------
  app.use(env.apiPrefix, v1Routes);
  app.get('/', (_req, res) =>
    res.json({ success: true, message: 'Nav Jyoti API', data: { version: 'v1' } })
  );

  // ---------- 404 + error handling (must be last) ----------
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;
