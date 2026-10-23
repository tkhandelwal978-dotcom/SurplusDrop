import { errorResponseSchema, type ErrorCode } from '@surplusdrop/shared';
import type { z } from 'zod';

/** An error response from our API, already decoded into the shared error contract. */
export class ApiError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly status: number,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** The request never got an HTTP response (offline, DNS, server down, CORS). */
export class NetworkError extends Error {
  constructor(cause: unknown) {
    super('Network request failed', { cause });
    this.name = 'NetworkError';
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

/** Turns a non-2xx response into an ApiError, falling back to INTERNAL for unexpected bodies. */
export async function toApiError(response: Response): Promise<ApiError> {
  const parsed = errorResponseSchema.safeParse(await readJson(response));
  if (parsed.success) {
    const { code, message, requestId } = parsed.data.error;
    return new ApiError(code, message, response.status, requestId);
  }
  return new ApiError('INTERNAL', `Unexpected ${response.status} response`, response.status);
}

export interface RequestOptions {
  /** Extra statuses whose body is a valid result rather than an error (e.g. 503 from /ready). */
  acceptStatuses?: readonly number[];
  signal?: AbortSignal;
}

/**
 * GET a JSON endpoint and validate the body with a shared Zod schema, so a server/client contract
 * mismatch fails loudly here instead of as `undefined` deep inside a component.
 */
export async function getJson<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestOptions = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
      signal: options.signal ?? null,
    });
  } catch (error) {
    throw new NetworkError(error);
  }

  if (!response.ok && !options.acceptStatuses?.includes(response.status)) {
    throw await toApiError(response);
  }
  return schema.parse(await readJson(response));
}
