---
name: new-migration
description: Create a safe Drizzle migration for packages/db with constraints, indexes and a rollback note.
---
Schema change: $ARGUMENTS

1. Update the Drizzle schema in packages/db/src/schema.
2. Run `pnpm db:generate` and read the generated SQL line by line.
3. Check and report:
   - Is it backward compatible with the currently deployed code? (expand/contract)
   - Does it lock a large table (e.g. adding NOT NULL without default, rewriting a column type)?
   - Are CHECK constraints added for business rules (reference BR-* IDs in comments)?
   - Does every new foreign key used in a WHERE clause have an index?
4. Write the rollback plan (down migration or forward fix).
5. Run `pnpm db:migrate` against the local database and `pnpm test:integration`.
Never edit a migration that is already on main.
