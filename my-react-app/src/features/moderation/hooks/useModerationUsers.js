// src/features/moderation/hooks/useModerationUsers.js
import { useInfiniteListQuery } from "../../../hooks/useInfiniteListQuery";
import { getModerationUsers } from "../services/moderationService";
import { moderationKeys } from "../../../constants/queryKeys";

// filters: { username, email, fullName, role, isDisabled } — all optional
// (verified against live Swagger — no unified "search" param, unlike getAllTweets)
export function useModerationUsers(filters = {}) {
  const { items, isLoading, error, hasMore, loadMore } = useInfiniteListQuery({
    queryKey: moderationKeys.users(filters),
    queryFn: async (page, limit) => {
      const res = await getModerationUsers({ ...filters, page, limit });
      // Verified live against Swagger — { users, pagination: { totalPages, ... } }
      const { users, pagination } = res.data.data;
      return { items: users, totalPages: pagination.totalPages };
    },
    meta: { errorTitle: "Couldn't load the user moderation queue" },
  });

  return { users: items, isLoading, error, hasMore, loadMore };
}