/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
    include: ['src/**/*.test.{js,jsx}'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // Ensure a single React instance (recharts otherwise resolves its own copy,
    // triggering "invalid hook call" errors).
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split heavy vendors so the initial bundle stays small (Lighthouse-friendly).
        // Rolldown (Vite 8) requires the function form of manualChunks.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id))
            return 'react-vendor';
          if (/[\\/](@reduxjs|react-redux|redux|@tanstack)[\\/]/.test(id))
            return 'state-vendor';
          if (/[\\/]framer-motion[\\/]/.test(id)) return 'motion-vendor';
          if (/[\\/](recharts|d3-|victory-)/.test(id)) return 'chart-vendor';
          if (/[\\/](react-hook-form|@hookform|zod)[\\/]/.test(id)) return 'form-vendor';
          return undefined;
        },
      },
    },
  },
});
