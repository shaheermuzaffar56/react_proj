// src/features/users/hooks/useAllUsers.js
import { useInfiniteListQuery } from "../../../hooks/useInfiniteListQuery";
import { getAllUsers } from "../services/userService";
import { userKeys } from "../../../constants/queryKeys";

export function useAllUsers() {
  const { items, isLoading, error, hasMore, loadMore } = useInfiniteListQuery({
    queryKey: userKeys.list(),
    queryFn: async (page, limit) => {
      const res = await getAllUsers({ page, limit });
      const { users, pagination } = res.data.data;
      return { items: users, totalPages: pagination.totalPages };
    },
    meta: { errorTitle: "Couldn't load users" },
  });

  return { users: items, isLoading, error, hasMore, loadMore };
}