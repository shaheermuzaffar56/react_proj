// src/features/tweets/hooks/useTweetFeed.js
import { getAllTweets } from "../services/tweetService";
import { useInfiniteListQuery } from "../../../hooks/useInfiniteListQuery";
import { tweetKeys } from "../../../constants/queryKeys";

export function useTweetFeed({ search = "", status = "", sortBy = "-createdAt" } = {}) {
  const { items, isLoading, error, hasMore, loadMore } = useInfiniteListQuery({
    queryKey: tweetKeys.feed({ search, status, sortBy }),
    queryFn: async (page, limit) => {
      const res = await getAllTweets({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
        sortBy,
      });
      const { tweets, pagination } = res.data.data;
      return { items: tweets, totalPages: pagination.totalPages };
    },
    meta: { errorTitle: "Couldn't load the feed" },
  });

  return { tweets: items, isLoading, error, hasMore, loadMore };
}