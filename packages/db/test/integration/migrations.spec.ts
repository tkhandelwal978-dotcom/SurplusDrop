import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDb, runMigrations, type DbHandle } from '../../src/index.js';

// Same image as infra/docker-compose.yml, but without our init SQL mounted: this proves the
// migrations alone are enough to prepare an empty database (as in CI and production).
const POSTGIS_IMAGE = 'postgis/postgis:16-3.4';

describe('migrations', () => {
  let container: StartedPostgreSqlContainer;
  let handle: DbHandle;

  beforeAll(async () => {
    container = await new PostgreSqlContainer(POSTGIS_IMAGE).start();
    handle = createDb({
      url: container.getConnectionUri(),
      onPoolError: (error) => {
        throw error;
      },
    });
  }, 180_000);

  afterAll(async () => {
    await handle?.close();
    await container?.stop();
  });

  it('creates the required extensions on an empty database', async () => {
    await runMigrations(handle.db);

    const result = await handle.db.execute<{ extname: string }>(
      sql`select extname from pg_extension`,
    );
    const names = result.rows.map((row) => row.extname);
    expect(names).toEqual(expect.arrayContaining(['postgis', 'pg_trgm', 'citext']));
  });

  it('is idempotent: running again applies nothing new', async () => {
    await runMigrations(handle.db);

    const result = await handle.db.execute<{ count: string }>(
      sql`select count(*)::text as count from drizzle.__drizzle_migrations`,
    );
    expect(result.rows[0]?.count).toBe('1');
  });
});
