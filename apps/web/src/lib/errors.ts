import type { ErrorCode } from '@surplusdrop/shared';

export interface ErrorCopy {
  message: string;
  action: string;
}

/**
 * What the user sees for every API error code, and what they can do next. `Record<ErrorCode, ...>`
 * means adding a code in packages/shared fails the web build until it has copy here.
 */
export const errorCopy: Readonly<Record<ErrorCode, ErrorCopy>> = {
  VALIDATION_FAILED: {
    message: 'Some details don’t look right.',
    action: 'Check the highlighted fields and try again.',
  },
  UNAUTHENTICATED: {
    message: 'You’re signed out.',
    action: 'Sign in to continue.',
  },
  FORBIDDEN: {
    message: 'You don’t have access to this.',
    action: 'Switch to the right account or go back.',
  },
  NOT_FOUND: {
    message: 'We couldn’t find that.',
    action: 'It may have sold out or been removed. Go back and pick another deal.',
  },
  RATE_LIMITED: {
    message: 'That was a lot of requests in a short time.',
    action: 'Wait a few seconds and try again.',
  },
  INTERNAL: {
    message: 'Something went wrong on our side.',
    action: 'Try again in a moment. If it keeps happening, contact support.',
  },
};

export const networkErrorCopy: ErrorCopy = {
  message: 'Can’t reach SurplusDrop right now.',
  action: 'Check your connection. We’ll retry automatically.',
};

export const offlineCopy: ErrorCopy = {
  message: 'You’re offline.',
  action: 'Prices will update again when you reconnect.',
};
