// src/features/moderation/hooks/useModerationTweets.js
import { useInfiniteListQuery } from "../../../hooks/useInfiniteListQuery";
import { getModerationTweets } from "../services/moderationService";
import { moderationKeys } from "../../../constants/queryKeys";

// filters: { author, status, isSensitive, search } — all optional (verified against live Swagger)
export function useModerationTweets(filters = {}) {
  const { items, isLoading, error, hasMore, loadMore } = useInfiniteListQuery({
    queryKey: moderationKeys.tweets(filters),
    queryFn: async (page, limit) => {
      const res = await getModerationTweets({ ...filters, page, limit });
      // Verified live against Swagger — { tweets, pagination: { totalPages, ... } }
      const { tweets, pagination } = res.data.data;
      return { items: tweets, totalPages: pagination.totalPages };
    },
    meta: { errorTitle: "Couldn't load the moderation queue" },
  });

  return { tweets: items, isLoading, error, hasMore, loadMore };
}