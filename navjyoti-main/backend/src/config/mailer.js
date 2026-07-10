/**
 * Nodemailer transporter factory.
 * Returns a shared transporter when SMTP is configured, otherwise `null`
 * so the mail service can degrade gracefully in local dev.
 */
import nodemailer from 'nodemailer';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let transporter = null;

export const getTransporter = () => {
  if (transporter) return transporter;
  if (!env.mail.enabled) {
    logger.warn('SMTP not configured — emails will be skipped/logged only.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure,
    auth: { user: env.mail.user, pass: env.mail.pass },
  });

  return transporter;
};

export default getTransporter;
