import { sql, type Database } from '@surplusdrop/db';
import type { Redis } from 'ioredis';
import type { Probe } from './health.service.js';

/** The real dependency checks used by /ready. Tests pass fake probes to the service instead. */
export function createHealthProbes(db: Database, redis: Redis): Record<string, Probe> {
  return {
    db: () => db.execute(sql`select 1`),
    redis: () => redis.ping(),
  };
}
