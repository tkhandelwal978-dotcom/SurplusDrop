import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { Logger } from 'pino';
import { pinoHttp } from 'pino-http';
import { healthRoutes } from '../../modules/health/health.routes.js';
import type { HealthService } from '../../modules/health/health.service.js';
import type { Config } from '../config.js';
import { errorHandler } from './error-handler.js';
import { notFound } from './not-found.js';
import { getRequestId, requestId } from './request-id.js';

export interface AppDeps {
  config: Pick<Config, 'CORS_ORIGINS'>;
  logger: Logger;
  health: HealthService;
}

const QUIET_PATHS = new Set(['/health', '/ready']);

/**
 * Builds the Express app without starting it, so tests can call it with Supertest and fake deps.
 * Middleware order follows apps/server/CLAUDE.md; cookies, rawBody (webhooks), auth and rateLimit
 * slot in at their marked places when those features arrive.
 */
export function createApp(deps: AppDeps): Express {
  const app = express();
  app.disable('x-powered-by');

  app.use(requestId());
  app.use(
    pinoHttp({
      logger: deps.logger,
      genReqId: getRequestId,
      // Probes hit these every few seconds; logging each one would drown real traffic.
      autoLogging: { ignore: (req) => QUIET_PATHS.has(req.url ?? '') },
    }),
  );
  app.use(helmet());
  app.use(cors({ origin: deps.config.CORS_ORIGINS, credentials: true }));
  // cookies → rawBody (webhook route only) go here.
  app.use(express.json({ limit: '100kb' }));
  // auth (optional) → rateLimit go here.

  app.use(healthRoutes(deps.health));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
