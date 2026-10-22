import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema/index.js';

export type Database = NodePgDatabase<typeof schema>;

export interface DbOptions {
  url: string;
  /**
   * Called when an idle pooled connection fails (e.g. Postgres restarts). Required because `pg`
   * crashes the process on an unhandled pool 'error' event; the caller decides how to log it.
   */
  onPoolError: (error: Error) => void;
  maxConnections?: number;
  /** Server-side limit so one slow query cannot hold a connection forever. */
  statementTimeoutMs?: number;
  applicationName?: string;
}

export interface DbHandle {
  db: Database;
  pool: pg.Pool;
  close: () => Promise<void>;
}

export function createDb(options: DbOptions): DbHandle {
  const pool = new pg.Pool({
    connectionString: options.url,
    max: options.maxConnections ?? 10,
    statement_timeout: options.statementTimeoutMs ?? 5_000,
    application_name: options.applicationName ?? 'surplusdrop',
  });
  pool.on('error', options.onPoolError);

  const db = drizzle({ client: pool, schema });
  return { db, pool, close: () => pool.end() };
}
