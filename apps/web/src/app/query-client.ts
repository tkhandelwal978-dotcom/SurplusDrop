import { QueryClient } from '@tanstack/react-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // One quick retry hides a blip; more would delay showing the error state.
        retry: 1,
        staleTime: 10_000,
        refetchOnWindowFocus: true,
      },
      // CLAUDE.md: never optimistic UI or silent retries for reservations, payments, pickups.
      mutations: { retry: 0 },
    },
  });
}
