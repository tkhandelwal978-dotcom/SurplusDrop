import { z } from 'zod';

export const checkStatusSchema = z.enum(['ok', 'fail']);
export type CheckStatus = z.infer<typeof checkStatusSchema>;

/** GET /health: the process is up. Never touches dependencies. */
export const livenessResponseSchema = z.object({ status: z.literal('ok') });
export type LivenessResponse = z.infer<typeof livenessResponseSchema>;

/** GET /ready: 200 when every dependency check passes, 503 otherwise. */
export const readinessResponseSchema = z.object({
  status: checkStatusSchema,
  checks: z.record(z.string(), checkStatusSchema),
});
export type ReadinessResponse = z.infer<typeof readinessResponseSchema>;
