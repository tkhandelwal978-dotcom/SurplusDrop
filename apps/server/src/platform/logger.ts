import { pino, type Logger } from 'pino';
import type { Config } from './config.js';

// CLAUDE.md: never log email, phone, tokens, pickup codes or secrets. Redaction is the safety net;
// the first rule is still not to pass them to the logger at all.
const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
  '*.password',
  '*.token',
  '*.accessToken',
  '*.refreshToken',
  '*.otp',
  '*.email',
  '*.phone',
  '*.pickupCode',
];

export function createLogger(
  config: Pick<Config, 'LOG_LEVEL' | 'NODE_ENV'>,
  service: string,
): Logger {
  return pino({
    level: config.LOG_LEVEL,
    base: { service },
    redact: { paths: REDACT_PATHS, censor: '[REDACTED]' },
    // Pretty, coloured lines for humans in development; plain JSON everywhere else for log tools.
    ...(config.NODE_ENV === 'development' && { transport: { target: 'pino-pretty' } }),
  });
}
