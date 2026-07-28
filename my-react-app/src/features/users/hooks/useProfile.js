// src/features/users/hooks/useProfile.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUser,
  updateAvatar,
  updateCover,
  deleteUser,
} from "../services/userService";
import { authKeys } from "../../../constants/queryKeys";
import { clearTokens } from "../../../utils/tokenStorage";

export function useProfile() {
  const queryClient = useQueryClient();

  // Writes the fresh userData straight into authKeys.me() — the same cache
  // AuthContext/Sidebar/TopBar read from — so they update instantly without
  // an extra refetch.
  const applyUpdatedUser = (res) => {
    queryClient.setQueryData(authKeys.me(), res.data.data.userData);
  };

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    meta: { errorTitle: "Couldn't update profile" },
    onSuccess: applyUpdatedUser,
  });

  const updateAvatarMutation = useMutation({
    mutationFn: updateAvatar,
    meta: { errorTitle: "Couldn't update avatar" },
    onSuccess: applyUpdatedUser,
  });

  const updateCoverMutation = useMutation({
    mutationFn: updateCover,
    meta: { errorTitle: "Couldn't update cover image" },
    onSuccess: applyUpdatedUser,
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteUser,
    meta: { errorTitle: "Couldn't delete account" },
    onSuccess: () => {
      clearTokens();
      queryClient.setQueryData(authKeys.me(), null);
    },
  });

  return {
    updateProfile: (data) => updateUserMutation.mutateAsync(data),
    updateAvatar: (formData) => updateAvatarMutation.mutateAsync(formData),
    updateCover: (formData) => updateCoverMutation.mutateAsync(formData),
    deleteAccount: () => deleteAccountMutation.mutateAsync(),
    isPaused:
      updateUserMutation.isPaused ||
      updateAvatarMutation.isPaused ||
      updateCoverMutation.isPaused ||
      deleteAccountMutation.isPaused,
  };
}