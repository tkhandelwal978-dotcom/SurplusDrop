import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import type { Database } from './client.js';

/** `../migrations` resolves to packages/db/migrations from both src/ (tests) and dist/ (build). */
export const migrationsFolder = fileURLToPath(new URL('../migrations', import.meta.url));

/**
 * Applies pending migrations. Safe to run repeatedly: Drizzle records applied migrations in
 * `drizzle.__drizzle_migrations` and skips them. Used by integration tests; locally use `pnpm db:migrate`.
 */
export async function runMigrations(db: Database): Promise<void> {
  await migrate(db, { migrationsFolder });
}
