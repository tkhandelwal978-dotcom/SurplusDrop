import type { ErrorResponse } from '@surplusdrop/shared';
import type { ErrorRequestHandler } from 'express';
// pino-http adds `req.id` and `req.log` to Node's request type; load that type change explicitly.
import type {} from 'pino-http';
import { ZodError } from 'zod';
import { AppError } from '../errors.js';
import { getRequestId } from './request-id.js';

/** Shape of the errors Express's built-in body parser raises (it has no exported type). */
function isBodyParserError(error: unknown): error is { type: string } {
  return (
    typeof error === 'object' && error !== null && 'type' in error && typeof error.type === 'string'
  );
}

/** Maps anything thrown into an AppError. Unknown errors become INTERNAL with a generic message. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return new AppError('VALIDATION_FAILED', 'Request is invalid', details);
  }
  if (isBodyParserError(error)) {
    if (error.type === 'entity.parse.failed')
      return new AppError('VALIDATION_FAILED', 'Malformed JSON body');
    if (error.type === 'entity.too.large')
      return new AppError('VALIDATION_FAILED', 'Request body too large');
  }
  // Never echo an unknown error's message: it can contain SQL, file paths or secrets.
  return new AppError('INTERNAL', 'Something went wrong');
}

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  const appError = toAppError(error);
  if (appError.status >= 500) {
    req.log.error({ err: error }, 'request failed');
  } else {
    req.log.info({ code: appError.code }, 'request rejected');
  }

  const body: ErrorResponse = {
    error: {
      code: appError.code,
      message: appError.message,
      details: appError.details,
      requestId: getRequestId(req),
    },
  };
  res.status(appError.status).json(body);
};
