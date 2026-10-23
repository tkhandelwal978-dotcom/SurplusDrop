import { Router } from 'express';
import { createHealthController } from './health.controller.js';
import type { HealthService } from './health.service.js';

/**
 * /health = liveness ("restart me if this fails"); /ready = readiness ("stop sending me traffic
 * if this fails"). Kept at the root, outside /api, because infrastructure probes call them.
 */
export function healthRoutes(service: HealthService): Router {
  const controller = createHealthController(service);
  const router = Router();
  router.get('/health', controller.liveness);
  router.get('/ready', controller.readiness);
  return router;
}
