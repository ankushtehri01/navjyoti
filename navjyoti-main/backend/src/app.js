/**
 * App composition root. Exports the configured Express app
 * (kept separate from server.js so it can be imported in tests).
 */
import { createApp } from './loaders/express.loader.js';

const app = createApp();

export default app;
