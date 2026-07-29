import axios from "axios";

const BASE_URL = "https://cloudlearner.duckdns.org:1124/api/v1";

// Main instance — used by all feature services
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // bounds every request so it always settles, even if the network hangs
  withCredentials: true,
});

// Separate plain instance for the refresh call itself,
// so it never gets caught by our own response interceptor below
const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  withCredentials: true,
});


// Request interceptor: attach access token to every outgoing request
api.interceptors.request.use((config) => {
  // Fail fast if the browser already knows there's no connection —
  // no point sending a request we know will fail.
  // (Note: this won't reliably trigger from DevTools' "Offline" throttle —
  // it's meant for real connectivity loss. The `timeout` above is what
  // guarantees DevTools-simulated offline requests still resolve.)
  if (!navigator.onLine) {
    return Promise.reject({
      isOffline: true,
      message: "You appear to be offline.",
      response: {
        data: { message: "You appear to be offline. Please check your connection and try again." },
      },
    });
  }
  return config;
});

// Response interceptor: on 401, try refreshing the token once, then retry
let isRefreshing = false;
let pendingRequests = [];

const resolvePending = () => {
  pendingRequests.forEach((cb) => cb());
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for the in-flight refresh to finish, then retry
        return new Promise((resolve) => {
          pendingRequests.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;
      try {
        await refreshClient.post("/user/refreshToken");
        resolvePending();
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;