// src/context/AuthContext.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, loginUser, logoutUser } from "../features/auth/services/authService";
import { getAccessToken, setTokens, clearTokens } from "../utils/tokenStorage";
import { authKeys } from "../constants/queryKeys";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const { data: user = null, isLoading } = useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      try {
        const { data } = await getCurrentUser();
        return data.data.userData;
      } catch (err) {
        clearTokens();
        throw err;
      }
    },
    enabled: !!getAccessToken(),
    retry: false,
    staleTime: Infinity,
    meta: { skipGlobalErrorToast: true }, // matches old behavior: silent on failed session restore
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    meta: { skipGlobalErrorToast: true }, // LoginPage already shows its own error UI
    onSuccess: ({ data }) => {
      setTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
      queryClient.setQueryData(authKeys.me(), data.data.userData);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearTokens();
      queryClient.setQueryData(authKeys.me(), null);
    },
  });

  const login = (credentials) => loginMutation.mutateAsync(credentials);
  const logout = () => logoutMutation.mutateAsync();

  const value = { user, isAuthenticated: !!user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}