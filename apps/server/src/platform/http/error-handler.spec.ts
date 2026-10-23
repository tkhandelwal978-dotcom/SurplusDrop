import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { AppError } from '../errors.js';
import { toAppError } from './error-handler.js';

describe('toAppError', () => {
  it('passes an AppError through unchanged', () => {
    const error = new AppError('FORBIDDEN', 'Not your lot');
    expect(toAppError(error)).toBe(error);
  });

  it('turns a ZodError into VALIDATION_FAILED with field paths', () => {
    const result = z.object({ qty: z.number().int().positive() }).safeParse({ qty: -1 });
    if (result.success) throw new Error('expected validation to fail');
    const appError = toAppError(result.error);
    expect(appError.code).toBe('VALIDATION_FAILED');
    expect(appError.status).toBe(400);
    expect(appError.details).toEqual([{ path: 'qty', message: expect.any(String) as string }]);
  });

  it('hides the message of an unknown error, which may contain SQL or secrets', () => {
    const appError = toAppError(new Error('password authentication failed for user "surplusdrop"'));
    expect(appError.code).toBe('INTERNAL');
    expect(appError.status).toBe(500);
    expect(appError.message).toBe('Something went wrong');
  });

  it('handles values that are not Error objects', () => {
    expect(toAppError('boom').code).toBe('INTERNAL');
    expect(toAppError(null).code).toBe('INTERNAL');
  });
});
