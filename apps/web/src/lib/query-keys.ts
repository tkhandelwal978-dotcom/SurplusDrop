// Every TanStack Query key lives here, so cache updates (e.g. from socket events) and
// invalidations always target the same key a component reads.
export const queryKeys = {
  system: {
    readiness: ['system', 'readiness'] as const,
  },
} as const;
