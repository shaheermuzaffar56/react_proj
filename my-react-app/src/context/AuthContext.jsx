// src/context/AuthContext.jsx
import { useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../features/auth/services/authService";
import { getAccessToken, setTokens, clearTokens } from "../utils/tokenStorage";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await getCurrentUser();
        setUser(data.data.userData);
      } catch {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    setTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
    setUser(data.data.userData);
  };

  const logout = async () => {
    await logoutUser();
    clearTokens();
    setUser(null);
  };

  const value = { user, isAuthenticated: !!user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}