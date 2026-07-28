// src/features/tweets/hooks/useTweets.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTweet,
  getMyTweets,
  updateTweet,
  deleteTweet,
} from "../services/tweetService";
import { tweetKeys } from "../../../constants/queryKeys";

export function useTweets() {
  const queryClient = useQueryClient();

  const {
    data: tweets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: tweetKeys.myTweets(),
    queryFn: async () => {
      const res = await getMyTweets();
      return res.data.data.tweets ?? res.data.data;
    },
    meta: { errorTitle: "Couldn't load your tweets" },
  });

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
    tweets,
    isLoading,
    error: error ? (error.response?.data?.message || "Something went wrong. Please try again.") : null,
    refetch,
    // true while a create/update mutation is queued by TanStack waiting for the
    // browser to come back online (networkMode: 'online' default) — mutationFn
    // hasn't fired yet, so isSubmitting alone can't distinguish this from a normal in-flight request
    isPaused: createMutation.isPaused || updateMutation.isPaused,
    create: (formData) => createMutation.mutateAsync(formData),
    update: (id, data) => updateMutation.mutateAsync({ id, data }),
    remove: (id) => removeMutation.mutateAsync(id),
  };
}