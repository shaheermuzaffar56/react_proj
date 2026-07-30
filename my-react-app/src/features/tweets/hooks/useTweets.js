// src/features/tweets/hooks/useTweets.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTweet, updateTweet, deleteTweet } from "../services/tweetService";
import { tweetKeys } from "../../../constants/queryKeys";

export function useTweets() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: tweetKeys.myTweets() });

  const createMutation = useMutation({
    mutationFn: createTweet,
    meta: { errorTitle: "Couldn't post tweet" },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTweet(id, data),
    meta: { errorTitle: "Couldn't update tweet" },
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: deleteTweet,
    meta: { errorTitle: "Couldn't delete tweet" },
    onSuccess: invalidate,
  });

  return {
    isPaused: createMutation.isPaused || updateMutation.isPaused,
    create: (formData) => createMutation.mutateAsync(formData),
    update: (id, data) => updateMutation.mutateAsync({ id, data }),
    remove: (id) => removeMutation.mutateAsync(id),
  };
}