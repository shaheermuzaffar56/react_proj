// src/features/auth/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Alert, Typography } from "@mui/material";
import { registerUser } from "../services/authService";
import { setTokens } from "../../../utils/tokenStorage";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";

const WEBP_TYPE = "image/webp";

const registerSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  fullName: z.string().min(1, "Full name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  avatar: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Avatar is required")
    .refine((files) => files[0]?.type === WEBP_TYPE, "Avatar must be a .webp image"),
  coverImage: z
    .instanceof(FileList)
    .optional()
    .refine((files) => !files || files.length === 0 || files[0]?.type === WEBP_TYPE, "Cover image must be .webp"),
});

function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // used later once we add role-aware redirect logic
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (formValues) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("userName", formValues.userName);
    formData.append("email", formValues.email);
    formData.append("fullName", formValues.fullName);
    formData.append("password", formValues.password);
    formData.append("avatar", formValues.avatar[0]);
    if (formValues.coverImage?.[0]) {
      formData.append("coverImage", formValues.coverImage[0]);
    }

    try {
      await registerUser(formData);
      navigate(ROUTES.LOGIN); // register doesn't return tokens — user logs in next
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 360, mx: "auto", mt: 6 }}>
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

      <TextField label="Username" fullWidth margin="normal" {...register("userName")}
        error={!!errors.userName} helperText={errors.userName?.message} />
      <TextField label="Email" fullWidth margin="normal" {...register("email")}
        error={!!errors.email} helperText={errors.email?.message} />
      <TextField label="Full Name" fullWidth margin="normal" {...register("fullName")}
        error={!!errors.fullName} helperText={errors.fullName?.message} />
      <TextField label="Password" type="password" fullWidth margin="normal" {...register("password")}
        error={!!errors.password} helperText={errors.password?.message} />

      <Typography variant="body2" sx={{ mt: 2 }}>Avatar (webp, required)</Typography>
      <input type="file" accept="image/webp" {...register("avatar")} />
      {errors.avatar && <Typography color="error" variant="caption">{errors.avatar.message}</Typography>}

      <Typography variant="body2" sx={{ mt: 2 }}>Cover image (webp, optional)</Typography>
      <input type="file" accept="image/webp" {...register("coverImage")} />
      {errors.coverImage && <Typography color="error" variant="caption">{errors.coverImage.message}</Typography>}

      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 3 }}>
        {isSubmitting ? "Registering..." : "Register"}
      </Button>
    </Box>
  );
}

export default RegisterPage;