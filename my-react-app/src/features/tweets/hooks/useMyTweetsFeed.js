// src/features/tweets/hooks/useMyTweetsFeed.js
import { getMyTweets } from "../services/tweetService";
import { useInfiniteListQuery } from "../../../hooks/useInfiniteListQuery";
import { tweetKeys } from "../../../constants/queryKeys";

export function useMyTweetsFeed() {
  const { items, pages, isLoading, error, hasMore, loadMore } = useInfiniteListQuery({
    queryKey: tweetKeys.myTweets(),
    queryFn: async (page, limit) => {
      const res = await getMyTweets({ page, limit });
      const { tweets, pagination } = res.data.data;
      return { items: tweets, totalPages: pagination.totalPages, totalCount: pagination.totalCount };
    },
    meta: { errorTitle: "Couldn't load your tweets" },
  });

  return {
    tweets: items,
    totalCount: pages[0]?.totalCount ?? 0,
    isLoading,
    error,
    hasMore,
    loadMore,
  };
}