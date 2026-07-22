// src/features/tweets/components/TweetForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Alert } from "@mui/material";
import { useState } from "react";
import UploadBox from "../../../components/UploadBox";
import { useFilePreview } from "../../../hooks/useFilePreview";

const WEBP_TYPE = "image/webp";

const tweetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.string().optional(), // comma-separated input, split on submit
  image: z
    .instanceof(FileList)
    .optional()
    .refine((files) => !files || files.length === 0 || files[0]?.type === WEBP_TYPE, "Image must be .webp"),
});

// tweet: pass an existing tweet object to edit; omit/null for create mode
// onSubmit: the `create` or `update` function from useTweets, passed in by the parent page
export default function TweetForm({ tweet, onSubmit, onDone }) {
  const isEditMode = !!tweet;
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tweetSchema),
    defaultValues: {
      title: tweet?.title ?? "",
      description: tweet?.description ?? "",
      tags: tweet?.tags?.join(", ") ?? "",
    },
  });

  const imagePreview = useFilePreview(watch("image")) ?? (isEditMode ? tweet?.image : null);

  const handleFormSubmit = async (values) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    if (values.tags) {
      formData.append("tags", values.tags);
    }
    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      if (isEditMode) {
        await onSubmit(tweet._id, formData);
      } else {
        await onSubmit(formData);
      }
      onDone?.(); // let the parent close a dialog / navigate away
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ maxWidth: 480 }}>
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

      <TextField label="Title" fullWidth margin="normal" {...register("title")}
        error={!!errors.title} helperText={errors.title?.message} />

      <TextField label="Description" fullWidth multiline rows={3} margin="normal" {...register("description")}
        error={!!errors.description} helperText={errors.description?.message} />

      <TextField label="Tags (comma-separated)" fullWidth margin="normal" {...register("tags")}
        error={!!errors.tags} helperText={errors.tags?.message} />

      <Box sx={{ mt: 2 }}>
        <UploadBox
          label={`Image${isEditMode ? " — leave blank to keep current" : ""}`}
          height={140}
          preview={imagePreview}
          error={errors.image?.message}
          inputProps={register("image")}
        />
      </Box>

      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 3 }}>
        {isSubmitting ? "Saving..." : isEditMode ? "Update Tweet" : "Create Tweet"}
      </Button>
    </Box>
  );
}