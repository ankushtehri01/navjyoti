/**
 * Winston logger. Pretty, colorized console in dev; JSON + file transports in prod.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import winston from 'winston';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.resolve(__dirname, '../../logs');

const isProd = process.env.NODE_ENV === 'production';

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(
    ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
  )
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [new winston.transports.Console()];

if (isProd) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  );
}

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: isProd ? prodFormat : devFormat,
  transports,
  exitOnError: false,
});

/** Stream adapter so morgan can pipe HTTP logs through winston. */
export const morganStream = {
  write: (message) => logger.http?.(message.trim()) ?? logger.info(message.trim()),
};

export default logger;
