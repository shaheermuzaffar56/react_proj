// src/features/tweets/hooks/useReactorsList.js
import { useInfiniteListQuery } from "../../../hooks/useInfiniteListQuery";
import { tweetKeys } from "../../../constants/queryKeys";

export function useReactorsList(fetchFn, tweetId, enabled, type) {
  const { items, isLoading, error, hasMore, loadMore } = useInfiniteListQuery({
    queryKey: tweetKeys.reactors(tweetId, type),
    queryFn: async (page, limit) => {
      const res = await fetchFn(tweetId, { page, limit });
      const { users, pagination } = res.data.data;
      return { items: users, totalPages: pagination.totalPages };
    },
    enabled,
    meta: { errorTitle: "Couldn't load list" },
  });

  return { users: items, isLoading, error, hasMore, loadMore };
}