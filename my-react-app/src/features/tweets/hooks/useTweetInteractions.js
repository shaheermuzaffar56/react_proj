// src/features/tweets/hooks/useTweetInteractions.js
import { useState } from "react";
import { likeTweet, dislikeTweet, repostTweet } from "../services/tweetService";

// tweet: the full tweet object (needs isLiked, isDisliked, isRetweeted, likesCount, dislikesCount, repostsCount)
export function useTweetInteractions(tweet) {
  const [state, setState] = useState({
    isLiked: tweet.isLiked,
    isDisliked: tweet.isDisliked,
    isReposted: tweet.isRetweeted,
    likesCount: tweet.likesCount,
    dislikesCount: tweet.dislikesCount,
    repostsCount: tweet.repostsCount,
  });
  const [error, setError] = useState(null);

  const toggleLike = async () => {
    const previous = state; // snapshot for rollback
    // Optimistic guess: flip isLiked, adjust counts, and clear dislike if it was active
    setState((s) => ({
      ...s,
      isLiked: !s.isLiked,
      likesCount: s.likesCount + (s.isLiked ? -1 : 1),
      isDisliked: s.isLiked ? s.isDisliked : false,
      dislikesCount: !s.isLiked && s.isDisliked ? s.dislikesCount - 1 : s.dislikesCount,
    }));
    setError(null);
    try {
      const res = await likeTweet(tweet._id);
      const { isLiked, likesCount, dislikesCount } = res.data.data;
      setState((s) => ({ ...s, isLiked, likesCount, dislikesCount }));
    } catch (err) {
      setState(previous); // roll back on failure
      setError(err.response?.data?.message || "Couldn't update like. Please try again.");
    }
  };

  const toggleDislike = async () => {
    const previous = state;
    setState((s) => ({
      ...s,
      isDisliked: !s.isDisliked,
      dislikesCount: s.dislikesCount + (s.isDisliked ? -1 : 1),
      isLiked: s.isDisliked ? s.isLiked : false,
      likesCount: !s.isDisliked && s.isLiked ? s.likesCount - 1 : s.likesCount,
    }));
    setError(null);
    try {
      const res = await dislikeTweet(tweet._id);
      const { isDisliked, likesCount, dislikesCount } = res.data.data;
      setState((s) => ({ ...s, isDisliked, likesCount, dislikesCount }));
    } catch (err) {
      setState(previous);
      setError(err.response?.data?.message || "Couldn't update dislike. Please try again.");
    }
  };

  const toggleRepost = async () => {
    const previous = state;
    setState((s) => ({
      ...s,
      isReposted: !s.isReposted,
      repostsCount: s.repostsCount + (s.isReposted ? -1 : 1),
    }));
    setError(null);
    try {
      const res = await repostTweet(tweet._id);
      const { isReposted, repostsCount } = res.data.data;
      setState((s) => ({ ...s, isReposted, repostsCount }));
    } catch (err) {
      setState(previous);
      setError(err.response?.data?.message || "Couldn't update repost. Please try again.");
    }
  };

  return { ...state, error, toggleLike, toggleDislike, toggleRepost };
}