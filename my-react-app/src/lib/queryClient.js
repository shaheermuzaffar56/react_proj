// src/lib/queryClient.js
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

export function createQueryClient(showError) {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // a query can opt out via `meta: { skipGlobalErrorToast: true }`
        if (query.meta?.skipGlobalErrorToast) return;
        showError(error, query.meta?.errorTitle);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.skipGlobalErrorToast) return;
        showError(error, mutation.meta?.errorTitle);
      },
    }),
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}