-- Extensions the schema depends on. Also created by infra/sql/01-init.sql for local Docker, but a
-- migration is the only thing that runs everywhere (Testcontainers, CI, production).
-- Requires a role allowed to CREATE EXTENSION (superuser locally; check on managed Postgres).
CREATE EXTENSION IF NOT EXISTS postgis;   -- geography columns, ST_DWithin for "lots within N km"
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- trigram index for fuzzy lot search
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS citext;    -- case-insensitive unique emails
