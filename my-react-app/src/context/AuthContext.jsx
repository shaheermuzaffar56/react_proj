// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../features/auth/services/authService";
import { getAccessToken, setTokens, clearTokens } from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while we check for an existing session

  // On app load: if a token exists, fetch the real user and restore session
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
        clearTokens(); // token invalid/expired and refresh already failed
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