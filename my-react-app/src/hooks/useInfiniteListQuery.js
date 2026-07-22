// src/hooks/useInfiniteListQuery.js
import { useInfiniteQuery } from "@tanstack/react-query";

const DEFAULT_PAGE_SIZE = 10;

// queryFn(page, limit) must resolve to { items: Array, totalPages: number }
export function useInfiniteListQuery({
  queryKey,
  queryFn,
  enabled = true,
  pageSize = DEFAULT_PAGE_SIZE,
  meta,
}) {
  const {
    data,
    isPending,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => queryFn(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length < lastPage.totalPages ? allPages.length + 1 : undefined,
    enabled,
    meta,
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    items,
    isLoading: isPending || isFetchingNextPage,
    error: error ? (error.response?.data?.message || "Something went wrong. Please try again.") : null,
    hasMore: !!hasNextPage,
    loadMore: fetchNextPage,
  };
}