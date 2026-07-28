// src/features/users/components/ChangePasswordForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Alert } from "@mui/material";

const passwordSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// onSubmit: useChangePassword().changePassword
export default function ChangePasswordForm({ onSubmit, isPaused }) {
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const handleFormSubmit = async (values) => {
    setServerError(null);
    setSuccess(false);
    try {
      await onSubmit({ password: values.password, newPassword: values.newPassword });
      reset();
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ maxWidth: 480 }}>
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Password updated successfully.</Alert>}

      <TextField label="Current Password" type="password" fullWidth margin="normal" {...register("password")}
        error={!!errors.password} helperText={errors.password?.message} />

      <TextField label="New Password" type="password" fullWidth margin="normal" {...register("newPassword")}
        error={!!errors.newPassword} helperText={errors.newPassword?.message} />

      <TextField label="Confirm New Password" type="password" fullWidth margin="normal" {...register("confirmPassword")}
        error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />

      {isPaused && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          You're offline. This will send automatically once your connection is back.
        </Alert>
      )}

      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 3 }}>
        {isPaused ? "Waiting for connection..." : isSubmitting ? "Updating..." : "Update Password"}
      </Button>
    </Box>
  );
}