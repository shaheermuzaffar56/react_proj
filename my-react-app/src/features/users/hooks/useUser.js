// src/features/users/hooks/useUser.js
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../services/userService";
import { userKeys } from "../../../constants/queryKeys";

export function useUser(id) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: userKeys.detail(id),
    // data IS the user object directly here — no .userData nesting (verified against Swagger)
    queryFn: async () => {
      const res = await getUserById(id);
      return res.data.data;
    },
    enabled: !!id,
    meta: { errorTitle: "Couldn't load user" },
  });

  return {
    user,
    isLoading,
    error: error ? (error.response?.data?.message || "Something went wrong. Please try again.") : null,
  };
}