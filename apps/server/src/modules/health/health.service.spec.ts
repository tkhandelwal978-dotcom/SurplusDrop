import { describe, expect, it } from 'vitest';
import { createHealthService } from './health.service.js';

const ok = () => Promise.resolve('ok');
const fail = () => Promise.reject(new Error('connection refused'));
const hang = () => new Promise(() => {});

describe('createHealthService.readiness', () => {
  it('is ok when every probe succeeds', async () => {
    const service = createHealthService({ db: ok, redis: ok });
    await expect(service.readiness()).resolves.toEqual({
      status: 'ok',
      checks: { db: 'ok', redis: 'ok' },
    });
  });

  it('fails and names the failing probe when one rejects', async () => {
    const service = createHealthService({ db: ok, redis: fail });
    await expect(service.readiness()).resolves.toEqual({
      status: 'fail',
      checks: { db: 'ok', redis: 'fail' },
    });
  });

  it('fails a probe that hangs instead of waiting forever', async () => {
    const service = createHealthService({ db: hang, redis: ok }, 20);
    const started = performance.now();
    const report = await service.readiness();
    expect(report).toEqual({ status: 'fail', checks: { db: 'fail', redis: 'ok' } });
    expect(performance.now() - started).toBeLessThan(1_000);
  });
});
