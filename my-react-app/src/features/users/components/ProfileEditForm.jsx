// src/features/users/components/ProfileEditForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Alert } from "@mui/material";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
});

// user: current user object (for defaultValues)
// onSubmit: useProfile().updateProfile
// isPaused: from useProfile()
export default function ProfileEditForm({ user, onSubmit, onDone, isPaused }) {
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
    },
  });

  const handleFormSubmit = async (values) => {
    setServerError(null);
    try {
      await onSubmit(values);
      onDone?.();
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ maxWidth: 480 }}>
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

      <TextField label="Full Name" fullWidth margin="normal" {...register("fullName")}
        error={!!errors.fullName} helperText={errors.fullName?.message} />

      {isPaused && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          You're offline. This will send automatically once your connection is back.
        </Alert>
      )}

      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 3 }}>
        {isPaused ? "Waiting for connection..." : isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </Box>
  );
}