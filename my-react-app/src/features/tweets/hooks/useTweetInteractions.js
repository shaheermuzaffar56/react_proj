// src/features/tweets/hooks/useTweetInteractions.js
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { likeTweet, dislikeTweet, repostTweet } from "../services/tweetService";

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

  const likeMutation = useMutation({
    mutationFn: () => likeTweet(tweet._id),
    meta: { errorTitle: "Couldn't update like" },
    onMutate: () => {
      setError(null);
      const previous = state;
      setState((s) => ({
        ...s,
        isLiked: !s.isLiked,
        likesCount: s.likesCount + (s.isLiked ? -1 : 1),
        isDisliked: s.isLiked ? s.isDisliked : false,
        dislikesCount: !s.isLiked && s.isDisliked ? s.dislikesCount - 1 : s.dislikesCount,
      }));
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) setState(context.previous);
      setError(err.response?.data?.message || "Couldn't update like. Please try again.");
    },
    onSuccess: (res) => {
      const { isLiked, likesCount, dislikesCount } = res.data.data;
      setState((s) => ({ ...s, isLiked, likesCount, dislikesCount }));
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: () => dislikeTweet(tweet._id),
    meta: { errorTitle: "Couldn't update dislike" },
    onMutate: () => {
      setError(null);
      const previous = state;
      setState((s) => ({
        ...s,
        isDisliked: !s.isDisliked,
        dislikesCount: s.dislikesCount + (s.isDisliked ? -1 : 1),
        isLiked: s.isDisliked ? s.isLiked : false,
        likesCount: !s.isDisliked && s.isLiked ? s.likesCount - 1 : s.likesCount,
      }));
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) setState(context.previous);
      setError(err.response?.data?.message || "Couldn't update dislike. Please try again.");
    },
    onSuccess: (res) => {
      const { isDisliked, likesCount, dislikesCount } = res.data.data;
      setState((s) => ({ ...s, isDisliked, likesCount, dislikesCount }));
    },
  });

  const repostMutation = useMutation({
    mutationFn: () => repostTweet(tweet._id),
    meta: { errorTitle: "Couldn't update repost" },
    onMutate: () => {
      setError(null);
      const previous = state;
      setState((s) => ({
        ...s,
        isReposted: !s.isReposted,
        repostsCount: s.repostsCount + (s.isReposted ? -1 : 1),
      }));
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) setState(context.previous);
      setError(err.response?.data?.message || "Couldn't update repost. Please try again.");
    },
    onSuccess: (res) => {
      const { isReposted, repostsCount } = res.data.data;
      setState((s) => ({ ...s, isReposted, repostsCount }));
    },
  });

  return {
    ...state,
    error,
    toggleLike: () => likeMutation.mutate(),
    toggleDislike: () => dislikeMutation.mutate(),
    toggleRepost: () => repostMutation.mutate(),
  };
}