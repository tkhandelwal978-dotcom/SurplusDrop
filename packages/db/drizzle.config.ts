import { existsSync } from 'node:fs';
import { defineConfig } from 'drizzle-kit';

// Local runs read the repo-root .env (pnpm runs this from packages/db). CI sets DATABASE_URL directly.
const rootEnvFile = '../../.env';
if (!process.env.DATABASE_URL && existsSync(rootEnvFile)) {
  process.loadEnvFile(rootEnvFile);
}

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env at the repo root.');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './migrations',
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
