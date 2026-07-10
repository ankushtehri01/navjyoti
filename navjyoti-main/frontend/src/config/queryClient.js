import { QueryClient } from '@tanstack/react-query';

/**
 * Shared React Query client with sensible caching defaults:
 * - data considered fresh for 1 min (fewer refetches, minimal re-render)
 * - retry once on failure, no refetch on window focus for a calmer UX
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
