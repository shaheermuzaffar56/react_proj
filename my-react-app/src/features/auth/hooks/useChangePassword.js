// src/features/auth/hooks/useChangePassword.js
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../services/authService";

export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: updatePassword,
    meta: { errorTitle: "Couldn't update password" },
  });

  return {
    changePassword: (data) => mutation.mutateAsync(data),
    isPaused: mutation.isPaused,
  };
}