import { describe, expect, it } from 'vitest';
import { errorCodes, httpStatusByErrorCode } from './errors.js';
import { errorResponseSchema } from './http.js';

describe('error codes', () => {
  it('has no duplicate codes', () => {
    expect(new Set(errorCodes).size).toBe(errorCodes.length);
  });

  it('maps every code to a 4xx or 5xx status', () => {
    for (const code of errorCodes) {
      const status = httpStatusByErrorCode[code];
      expect(status, code).toBeGreaterThanOrEqual(400);
      expect(status, code).toBeLessThan(600);
    }
  });
});

describe('errorResponseSchema', () => {
  it('accepts a well-formed error body', () => {
    const body = { error: { code: 'NOT_FOUND', message: 'Lot not found', requestId: 'req-1' } };
    expect(errorResponseSchema.safeParse(body).success).toBe(true);
  });

  it('rejects an unknown error code', () => {
    const body = { error: { code: 'TEAPOT', message: 'x', requestId: 'req-1' } };
    expect(errorResponseSchema.safeParse(body).success).toBe(false);
  });
});
