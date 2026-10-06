# packages/db — Drizzle schema and migrations

- Never edit a migration that has been merged to `main`; create a new one.
- Expand → migrate → contract: additive changes first, destructive changes one release later.
- Every business rule that can be a CHECK constraint is one (mirror the SRS BR-* IDs in comments).
- Every foreign key used in a WHERE clause has an index.
- Backfills run as throttled worker jobs, never inside a migration.
