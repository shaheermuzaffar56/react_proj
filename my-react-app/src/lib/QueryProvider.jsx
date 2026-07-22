// src/lib/QueryProvider.jsx
import { useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "./queryClient";
import { useErrorToast } from "../hooks/useErrorToast";

export function QueryProvider({ children }) {
  const { showError } = useErrorToast();
  const queryClient = useMemo(() => createQueryClient(showError), [showError]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}