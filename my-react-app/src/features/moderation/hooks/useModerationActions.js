// src/features/moderation/hooks/useModerationActions.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTweetStatus,
  updateUserModeration,
  deleteUserByAdmin,
} from "../services/moderationService";
import { moderationKeys } from "../../../constants/queryKeys";

export function useModerationActions() {
  const queryClient = useQueryClient();

  // Prefix match — invalidates every filtered variant of both moderation lists.
  const invalidateAll = () => queryClient.invalidateQueries({ queryKey: moderationKeys.all });

  const moderateTweetMutation = useMutation({
    mutationFn: ({ id, status }) => updateTweetStatus(id, status),
    meta: { errorTitle: "Couldn't update tweet status" },
    onSuccess: invalidateAll,
  });

  const moderateUserMutation = useMutation({
    mutationFn: ({ id, data }) => updateUserModeration(id, data),
    meta: { errorTitle: "Couldn't update user" },
    onSuccess: invalidateAll,
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserByAdmin,
    meta: { errorTitle: "Couldn't delete user" },
    onSuccess: invalidateAll,
  });

  return {
    moderateTweet: (id, status) => moderateTweetMutation.mutateAsync({ id, status }),
    moderateUser: (id, data) => moderateUserMutation.mutateAsync({ id, data }),
    deleteUser: (id) => deleteUserMutation.mutateAsync(id),
    isPaused:
      moderateTweetMutation.isPaused ||
      moderateUserMutation.isPaused ||
      deleteUserMutation.isPaused,
  };
}