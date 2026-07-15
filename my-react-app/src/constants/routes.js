export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FEED: "/feed",
  MY_TWEETS: "/tweets/mine",
  TWEET_DETAIL: "/tweets/:id",       // dynamic — Sub-step 5 covers usage
  PROFILE: "/profile",
  USER_DETAIL: "/users/:id",         // dynamic
  MODERATION: "/moderation",
  NOT_FOUND: "*",
};

// Helper for building dynamic paths at call sites, e.g. buildPath(ROUTES.TWEET_DETAIL, { id: "123" })
export function buildPath(pattern, params = {}) {
  let path = pattern;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, value);
  }
  return path;
}