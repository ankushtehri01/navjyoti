/**
 * Process entrypoint: connect to MongoDB, start the HTTP server,
 * and wire graceful-shutdown / crash handlers.
 */
import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

let server;

const start = async () => {
  try {
    await connectDatabase();
    server = app.listen(env.port, () => {
      logger.info(`Nav Jyoti API running in ${env.nodeEnv} at http://localhost:${env.port}${env.apiPrefix}`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  logger.warn(`${signal} received — shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    // Force-exit if graceful close hangs.
    setTimeout(() => process.exit(1), 10000).unref();
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  process.exit(1);
});

start();
