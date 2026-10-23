export { createDb, type Database, type DbHandle, type DbOptions } from './client.js';
export { migrationsFolder, runMigrations } from './migrate.js';
export * as schema from './schema/index.js';
// Re-exported so apps write raw SQL (guarded UPDATEs, PostGIS) without their own drizzle-orm copy.
export { sql } from 'drizzle-orm';
