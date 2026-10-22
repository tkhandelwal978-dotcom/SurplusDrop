import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Per-package module cache. Vitest's default is one folder at the repo root, and turbo runs
    // packages in parallel, so two processes racing on a cold cache crashed with ENOTEMPTY.
    fsModuleCachePath: 'node_modules/.vitest-cache',
  },
});
