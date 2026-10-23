import { readinessResponseSchema } from '@surplusdrop/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, getJson, NetworkError } from './api-client';

function respondWith(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve(new Response(JSON.stringify(body), { status }))),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getJson', () => {
  it('returns the body validated by the schema', async () => {
    respondWith(200, { status: 'ok', checks: { db: 'ok' } });
    await expect(getJson('/ready', readinessResponseSchema)).resolves.toEqual({
      status: 'ok',
      checks: { db: 'ok' },
    });
  });

  it('turns an error response into an ApiError with the shared code and request id', async () => {
    respondWith(404, { error: { code: 'NOT_FOUND', message: 'Lot not found', requestId: 'r-1' } });
    const error = await getJson('/api/lots/1', readinessResponseSchema).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: 'NOT_FOUND', status: 404, requestId: 'r-1' });
  });

  it('falls back to INTERNAL when the error body is not in the shared shape', async () => {
    respondWith(502, '<html>Bad Gateway</html>');
    const error = await getJson('/ready', readinessResponseSchema).catch((e: unknown) => e);
    expect(error).toMatchObject({ code: 'INTERNAL', status: 502 });
  });

  it('accepts listed non-2xx statuses as results', async () => {
    respondWith(503, { status: 'fail', checks: { redis: 'fail' } });
    const result = await getJson('/ready', readinessResponseSchema, { acceptStatuses: [503] });
    expect(result.status).toBe('fail');
  });

  it('throws NetworkError when there is no response at all', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
    );
    await expect(getJson('/ready', readinessResponseSchema)).rejects.toBeInstanceOf(NetworkError);
  });

  it('fails loudly when a 200 body breaks the contract', async () => {
    respondWith(200, { status: 'maybe' });
    await expect(getJson('/ready', readinessResponseSchema)).rejects.toThrow();
  });
});
