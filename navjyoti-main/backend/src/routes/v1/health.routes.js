/**
 * Liveness / readiness endpoints.
 */
import { Router } from 'express';
import mongoose from 'mongoose';
import { ApiResponse } from '../../utils/ApiResponse.js';

const router = Router();

router.get('/', (_req, res) =>
  ApiResponse.ok(res, 'Nav Jyoti API is healthy.', {
    uptime: Number(process.uptime().toFixed(0)),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
);

export default router;
