import { httpStatusByErrorCode, type ErrorCode } from '@surplusdrop/shared';

/**
 * The only error type services should throw on purpose. The error middleware turns it into
 * `{ error: { code, message, details, requestId } }` with the status mapped from the code.
 */
export class AppError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string = code,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }

  get status(): number {
    return httpStatusByErrorCode[this.code];
  }
}
