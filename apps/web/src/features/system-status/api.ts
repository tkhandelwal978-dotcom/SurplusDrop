import { readinessResponseSchema, type ReadinessResponse } from '@surplusdrop/shared';
import { getJson } from '../../lib/api-client';

/** GET /ready. A 503 still carries a readiness report (which checks failed), so it is a result. */
export function fetchReadiness(signal?: AbortSignal): Promise<ReadinessResponse> {
  return getJson('/ready', readinessResponseSchema, {
    acceptStatuses: [503],
    ...(signal && { signal }),
  });
}
