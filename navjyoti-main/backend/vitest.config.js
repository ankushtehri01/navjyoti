import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.js'],
    setupFiles: ['tests/setup/env.js'],
    testTimeout: 30000,
    hookTimeout: 60000,
    // In-memory Mongo shares state across a file; run test files serially.
    fileParallelism: false,
  },
});
