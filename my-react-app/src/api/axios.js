import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../utils/tokenStorage";

const BASE_URL = "https://cloudlearner.duckdns.org:1124/api/v1";

// Main instance — used by all feature services
const api = axios.create({
  baseURL: BASE_URL,
});

// Separate plain instance for the refresh call itself,
// so it never gets caught by our own response interceptor below
const refreshClient = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor: attach access token to every outgoing request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: on 401, try refreshing the token once, then retry
let isRefreshing = false;
let pendingRequests = [];

const resolvePending = (newToken) => {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Wait for the in-flight refresh to finish, then retry with new token
        return new Promise((resolve, reject) => {
          pendingRequests.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await refreshClient.post("/user/refreshToken", { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = data.data;
        setTokens({ accessToken, refreshToken: newRefreshToken });
        resolvePending(accessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;