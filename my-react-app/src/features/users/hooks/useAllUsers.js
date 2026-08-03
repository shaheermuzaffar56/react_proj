// src/features/users/hooks/useAllUsers.js
import { useInfiniteListQuery } from "../../../hooks/useInfiniteListQuery";
import { getAllUsers } from "../services/userService";
import { userKeys } from "../../../constants/queryKeys";

export function useAllUsers(role) {
  const { items, total, isLoading, error, hasMore, loadMore } = useInfiniteListQuery({
    queryKey: userKeys.list({ role }),
    queryFn: async (page, limit) => {
      const res = await getAllUsers({ page, limit, ...(role && { role }) });
      const { users, pagination } = res.data.data;
      return { items: users, totalPages: pagination.totalPages, totalResults: pagination.totalResults };
    },
    meta: { errorTitle: "Couldn't load users" },
  });

  return { users: items, total, isLoading, error, hasMore, loadMore };
}