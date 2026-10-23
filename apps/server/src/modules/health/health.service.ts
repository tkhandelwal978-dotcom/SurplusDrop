import type { CheckStatus, ReadinessResponse } from '@surplusdrop/shared';

/** A dependency check: resolves if the dependency is usable, rejects otherwise. */
export type Probe = () => Promise<unknown>;

export interface HealthService {
  readiness: () => Promise<ReadinessResponse>;
}

const DEFAULT_PROBE_TIMEOUT_MS = 1_000;

function withTimeout(probe: Probe, timeoutMs: number): Promise<unknown> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`probe timed out after ${timeoutMs} ms`)), timeoutMs);
  });
  return Promise.race([probe(), timeout]).finally(() => clearTimeout(timer));
}

/**
 * Runs every probe in parallel with a timeout. A hung dependency must make /ready fail fast,
 * not hang the probe request until the load balancer gives up.
 */
export function createHealthService(
  probes: Record<string, Probe>,
  timeoutMs: number = DEFAULT_PROBE_TIMEOUT_MS,
): HealthService {
  return {
    async readiness() {
      const names = Object.keys(probes);
      const results = await Promise.allSettled(
        names.map((name) => withTimeout(probes[name] as Probe, timeoutMs)),
      );
      const checks: Record<string, CheckStatus> = {};
      names.forEach((name, index) => {
        checks[name] = results[index]?.status === 'fulfilled' ? 'ok' : 'fail';
      });
      const status = Object.values(checks).every((check) => check === 'ok') ? 'ok' : 'fail';
      return { status, checks };
    },
  };
}
