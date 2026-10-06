-- Runs once, the first time the Postgres container starts with an empty data volume.

-- Extensions used by SurplusDrop
CREATE EXTENSION IF NOT EXISTS postgis;   -- location queries ("lots within 3 km")
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- fuzzy text search ("multigran" finds "multigrain")
CREATE EXTENSION IF NOT EXISTS citext;    -- case-insensitive emails

-- Read-only user for Claude Code's database MCP (LOCAL ONLY, never in production)
CREATE ROLE sd_readonly LOGIN PASSWORD 'sd_readonly';
GRANT CONNECT ON DATABASE surplusdrop TO sd_readonly;
GRANT USAGE ON SCHEMA public TO sd_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO sd_readonly;

-- Tables created later by migrations are also readable (but never writable)
ALTER DEFAULT PRIVILEGES FOR ROLE surplusdrop IN SCHEMA public
  GRANT SELECT ON TABLES TO sd_readonly;