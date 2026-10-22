import { z } from 'zod';

/**
 * Every error code the API can return. This list is a contract with apps/web: adding a code is
 * safe, renaming or removing one is a breaking change. Feature codes (PRICE_MISMATCH, SOLD_OUT, ...)
 * are added together with the feature that throws them.
 */
export const errorCodes = [
  'VALIDATION_FAILED',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'RATE_LIMITED',
  'INTERNAL',
] as const;

export const errorCodeSchema = z.enum(errorCodes);
export type ErrorCode = z.infer<typeof errorCodeSchema>;

/** `Record<ErrorCode, ...>` makes the compiler reject a new code that has no status. */
export const httpStatusByErrorCode: Readonly<Record<ErrorCode, number>> = {
  VALIDATION_FAILED: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INTERNAL: 500,
};
