import { z } from 'zod';
import { errorCodeSchema } from './errors.js';

/** Body of every non-2xx API response. Rendered by the server's error middleware. */
export const errorResponseSchema = z.object({
  error: z.object({
    code: errorCodeSchema,
    message: z.string(),
    details: z.unknown().optional(),
    requestId: z.string(),
  }),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
