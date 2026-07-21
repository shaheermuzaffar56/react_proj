// src/features/tweets/hooks/useTweetInteractions.js
import { useState } from "react";
import { likeTweet, dislikeTweet, repostTweet } from "../services/tweetService";
import { useErrorToast } from "../../../hooks/useErrorToast";

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
  const { showError } = useErrorToast();

  const toggleLike = async () => {
    const previous = state;
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
      setState(previous);
      setError(err.response?.data?.message || "Couldn't update like. Please try again.");
      showError(err, "Couldn't update like");
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
      showError(err, "Couldn't update dislike");
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
      showError(err, "Couldn't update repost");
    }
  };

  return { ...state, error, toggleLike, toggleDislike, toggleRepost };
}