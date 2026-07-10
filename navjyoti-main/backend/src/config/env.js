/**
 * Centralized, validated environment configuration.
 * Loads `.env`, validates required keys, and exposes a typed, frozen `env` object.
 * Nothing else in the app should read `process.env` directly.
 */
import dotenv from 'dotenv';

dotenv.config();

/** Read a required variable; throw fast if missing in production. */
const required = (key, fallback = undefined) => {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === '') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`[env] Missing required environment variable: ${key}`);
    }
    // In non-production we warn but allow boot so devs can iterate.
    console.warn(`[env] Warning: ${key} is not set (using fallback).`);
  }
  return value;
};

const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const bool = (value, fallback = false) =>
  value === undefined ? fallback : String(value).toLowerCase() === 'true';

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isTest: process.env.NODE_ENV === 'test',

  port: num(process.env.PORT, 5000),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  mongoUri: required('MONGO_URI', 'mongodb://127.0.0.1:27017/navjyoti'),

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', 'dev_access_secret'),
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev_refresh_secret'),
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    resetSecret: required('JWT_RESET_SECRET', 'dev_reset_secret'),
    resetExpiry: process.env.JWT_RESET_EXPIRY || '15m',
  },

  cookieSecret: required('COOKIE_SECRET', 'dev_cookie_secret'),

  cookie: {
    // Defaults to production, but overridable so TLS-terminated-upstream or
    // local HTTP demos can control cookie flags independently of NODE_ENV.
    secure: bool(process.env.COOKIE_SECURE, process.env.NODE_ENV === 'production'),
    sameSite:
      process.env.COOKIE_SAMESITE ||
      (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'navjyoti',
    get enabled() {
      return Boolean(this.cloudName && this.apiKey && this.apiSecret);
    },
  },

  mail: {
    host: process.env.SMTP_HOST || '',
    port: num(process.env.SMTP_PORT, 587),
    secure: bool(process.env.SMTP_SECURE, false),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromName: process.env.MAIL_FROM_NAME || 'Nav Jyoti',
    fromAddress: process.env.MAIL_FROM_ADDRESS || 'no-reply@navjyoti.com',
    get enabled() {
      return Boolean(this.host && this.user && this.pass);
    },
  },

  rateLimit: {
    windowMs: num(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: num(process.env.RATE_LIMIT_MAX, 100),
    authMax: num(process.env.AUTH_RATE_LIMIT_MAX, 10),
  },

  upload: {
    maxFileSizeBytes: num(process.env.MAX_FILE_SIZE_MB, 5) * 1024 * 1024,
  },

  seed: {
    adminName: process.env.SEED_ADMIN_NAME || 'Super Admin',
    adminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@navjyoti.com',
    adminPassword: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
  },
});

export default env;
