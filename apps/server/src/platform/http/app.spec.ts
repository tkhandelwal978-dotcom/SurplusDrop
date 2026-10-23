import { errorResponseSchema, readinessResponseSchema } from '@surplusdrop/shared';
import { pino } from 'pino';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createHealthService, type Probe } from '../../modules/health/health.service.js';
import { createApp } from './app.js';

function buildApp(probes: Record<string, Probe> = { db: () => Promise.resolve() }) {
  return createApp({
    config: { CORS_ORIGINS: ['http://localhost:5173'] },
    logger: pino({ level: 'silent' }),
    health: createHealthService(probes, 50),
  });
}

describe('GET /health', () => {
  it('returns 200 without touching dependencies', async () => {
    const app = buildApp({ db: () => Promise.reject(new Error('down')) });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /ready', () => {
  it('returns 200 when all checks pass', async () => {
    const res = await request(buildApp()).get('/ready');
    expect(res.status).toBe(200);
    expect(readinessResponseSchema.parse(res.body)).toEqual({ status: 'ok', checks: { db: 'ok' } });
  });

  it('returns 503 and names the failed check when a dependency is down', async () => {
    const app = buildApp({
      db: () => Promise.resolve(),
      redis: () => Promise.reject(new Error('down')),
    });
    const res = await request(app).get('/ready');
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: 'fail', checks: { db: 'ok', redis: 'fail' } });
  });
});

describe('request id', () => {
  it('generates one and returns it in the header', async () => {
    const res = await request(buildApp()).get('/health');
    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('keeps a safe incoming id', async () => {
    const res = await request(buildApp()).get('/health').set('X-Request-Id', 'lb-abc_123');
    expect(res.headers['x-request-id']).toBe('lb-abc_123');
  });

  it('replaces an unsafe incoming id', async () => {
    const res = await request(buildApp()).get('/health').set('X-Request-Id', 'bad id with spaces');
    expect(res.headers['x-request-id']).not.toBe('bad id with spaces');
  });
});

describe('error responses', () => {
  it('returns NOT_FOUND in the shared error shape with the request id', async () => {
    const res = await request(buildApp()).get('/nope').set('X-Request-Id', 'req-404');
    expect(res.status).toBe(404);
    const body = errorResponseSchema.parse(res.body);
    expect(body.error).toMatchObject({ code: 'NOT_FOUND', requestId: 'req-404' });
  });

  it('returns VALIDATION_FAILED for a malformed JSON body', async () => {
    const res = await request(buildApp())
      .post('/nope')
      .set('Content-Type', 'application/json')
      .send('{"broken":');
    expect(res.status).toBe(400);
    expect(errorResponseSchema.parse(res.body).error.code).toBe('VALIDATION_FAILED');
  });

  it('sets security headers and hides the framework', async () => {
    const res = await request(buildApp()).get('/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
