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