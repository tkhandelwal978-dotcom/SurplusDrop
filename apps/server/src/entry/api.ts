import { createDb } from '@surplusdrop/db';
import { Redis } from 'ioredis';
import { createHealthProbes } from '../modules/health/health.repository.js';
import { createHealthService } from '../modules/health/health.service.js';
import { ConfigError, loadConfig, type Config } from '../platform/config.js';
import { createApp } from '../platform/http/app.js';
import { createLogger } from '../platform/logger.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

function readConfigOrExit(): Config {
  try {
    return loadConfig(process.env);
  } catch (error) {
    // The logger needs config, so report config problems straight to stderr and stop.
    process.stderr.write(`${error instanceof ConfigError ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

const config = readConfigOrExit();
const logger = createLogger(config, 'api');

const database = createDb({
  url: config.DATABASE_URL,
  applicationName: 'surplusdrop-api',
  onPoolError: (err) => logger.error({ err }, 'postgres pool error'),
});

// No offline queue: while Redis is down, commands fail at once instead of piling up in memory,
// so /ready reports the outage instead of hanging.
const redis = new Redis(config.REDIS_URL, { enableOfflineQueue: false, maxRetriesPerRequest: 1 });
redis.on('error', (err) => logger.warn({ err }, 'redis connection error'));

const health = createHealthService(createHealthProbes(database.db, redis));
const app = createApp({ config, logger, health });

const server = app.listen(config.PORT, config.HOST, (error) => {
  if (error) {
    logger.fatal({ err: error }, 'failed to start http server');
    process.exit(1);
  }
  logger.info({ host: config.HOST, port: config.PORT }, 'api listening');
});

let shuttingDown = false;
function shutdown(signal: string): void {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'shutting down');

  // If connections refuse to drain, exit anyway rather than hang the deploy.
  setTimeout(() => {
    logger.error('shutdown timed out, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();

  server.close(() => {
    void Promise.allSettled([database.close(), redis.quit()]).then(() => {
      logger.info('shutdown complete');
      process.exit(0);
    });
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'unhandled promise rejection');
  process.exit(1);
});
