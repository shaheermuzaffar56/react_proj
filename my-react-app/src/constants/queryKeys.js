// src/constants/queryKeys.js
export const authKeys = {
  all: ["auth"],
  me: () => [...authKeys.all, "me"],
};

export const tweetKeys = {
  all: ["tweets"],
  feed: (filters) => [...tweetKeys.all, "feed", filters],
  myTweets: () => [...tweetKeys.all, "my"],
  reactors: (tweetId, type) => [...tweetKeys.all, tweetId, type],
};

export const userKeys = {
  all: ["users"],
  detail: (id) => [...userKeys.all, "detail", id],
  list: () => [...userKeys.all, "list"],
};

export const moderationKeys = {
  all: ["moderation"],
  tweets: (filters) => [...moderationKeys.all, "tweets", filters],
  users: (filters) => [...moderationKeys.all, "users", filters],
};