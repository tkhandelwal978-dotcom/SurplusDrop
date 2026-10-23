import type { LivenessResponse, ReadinessResponse } from '@surplusdrop/shared';
import type { RequestHandler } from 'express';
import type {} from 'pino-http';
import type { HealthService } from './health.service.js';

export interface HealthController {
  liveness: RequestHandler;
  readiness: RequestHandler;
}

export function createHealthController(service: HealthService): HealthController {
  const liveness: RequestHandler = (_req, res) => {
    const body: LivenessResponse = { status: 'ok' };
    res.json(body);
  };

  const readiness: RequestHandler = async (req, res) => {
    const body: ReadinessResponse = await service.readiness();
    if (body.status !== 'ok') req.log.warn({ checks: body.checks }, 'readiness check failed');
    res.status(body.status === 'ok' ? 200 : 503).json(body);
  };

  return { liveness, readiness };
}
