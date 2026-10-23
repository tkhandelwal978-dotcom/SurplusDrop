import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// The API runs on 127.0.0.1:3000 (apps/server). Proxying keeps the browser on one origin in dev,
// like production behind a reverse proxy, so no CORS or cookie surprises appear only after deploy.
const API_ORIGIN = 'http://127.0.0.1:3000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': API_ORIGIN,
      '/health': API_ORIGIN,
      '/ready': API_ORIGIN,
    },
  },
  test: {
    environment: 'jsdom',
    // Per-package module cache. Vitest's default is one folder at the repo root, and turbo runs
    // packages in parallel, so two processes racing on a cold cache crashed with ENOTEMPTY.
    fsModuleCachePath: 'node_modules/.vitest-cache',
  },
});
