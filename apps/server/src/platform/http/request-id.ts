import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import type { RequestHandler } from 'express';
// pino-http adds `req.id` and `req.log` to Node's request type; load that type change explicitly.
import type {} from 'pino-http';

export const REQUEST_ID_HEADER = 'x-request-id';

// Accept an upstream id (e.g. from a load balancer) only if it is short and plain, so a client
// cannot inject newlines or huge strings into our logs.
const SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/;

/** pino-http types `req.id` as string | number | object; ours is always a string. */
export function getRequestId(req: IncomingMessage): string {
  return typeof req.id === 'string' ? req.id : 'unknown';
}

/** Gives every request an id, echoed in the response header, logs and error bodies. */
export function requestId(): RequestHandler {
  return (req, res, next) => {
    const incoming = req.get(REQUEST_ID_HEADER);
    const id = incoming && SAFE_ID.test(incoming) ? incoming : randomUUID();
    req.id = id;
    res.setHeader(REQUEST_ID_HEADER, id);
    next();
  };
}
