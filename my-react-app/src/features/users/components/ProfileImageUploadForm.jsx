// src/features/users/components/ProfileImageUploadForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Button, Alert } from "@mui/material";
import UploadBox from "../../../components/UploadBox";
import { useFilePreview } from "../../../hooks/useFilePreview";

const WEBP_TYPE = "image/webp";

const imageSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Please choose an image")
    .refine((files) => files[0]?.type === WEBP_TYPE, "Image must be .webp"),
});

// kind: "avatar" | "cover" — only used for labels/sizing, not sent to the server
// currentImage: existing avatar/coverImage URL, shown before a new file is picked
// fieldName: "avatar" | "coverImage" — the FormData field name the backend expects
// onSubmit: useProfile().updateAvatar or updateCover
export default function ProfileImageUploadForm({ kind, currentImage, fieldName, onSubmit, isPaused }) {
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(imageSchema) });

  const preview = useFilePreview(watch("file")) ?? currentImage;

  const handleFormSubmit = async (values) => {
    setServerError(null);
    const formData = new FormData();
    formData.append(fieldName, values.file[0]);
    try {
      await onSubmit(formData);
      reset();
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ maxWidth: 320 }}>
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

      <UploadBox
        label={kind === "avatar" ? "Avatar" : "Cover Image"}
        height={kind === "avatar" ? 100 : 70}
        preview={preview}
        error={errors.file?.message}
        inputProps={register("file")}
      />

      {isPaused && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          You're offline. This will send automatically once your connection is back.
        </Alert>
      )}

      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 2 }}>
        {isPaused ? "Waiting for connection..." : isSubmitting ? "Uploading..." : `Update ${kind === "avatar" ? "Avatar" : "Cover"}`}
      </Button>
    </Box>
  );
}