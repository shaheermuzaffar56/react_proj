// src/features/auth/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, TextField, Button, Alert, Typography } from "@mui/material";
import { registerUser } from "../services/authService";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { ROUTES } from "../../../constants/routes";
import AuthLayout from "../components/AuthLayout";
import UploadBox from "../../../components/UploadBox";
import { useFilePreview } from "../../../hooks/useFilePreview";

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
  const { showError } = useErrorToast();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const avatarPreview = useFilePreview(watch("avatar"));
  const coverPreview = useFilePreview(watch("coverImage"));

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
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
      showError(err, "Registration failed");
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join CloudLearner and start sharing knowledge.">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}
      >
        {serverError && <Alert severity="error">{serverError}</Alert>}

        <TextField
          label="Username"
          fullWidth
          {...register("userName")}
          error={!!errors.userName}
          helperText={errors.userName?.message}
        />
        <TextField
          label="Email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Full Name"
          fullWidth
          {...register("fullName")}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <UploadBox
          label="Avatar"
          required
          height={100}
          preview={avatarPreview}
          error={errors.avatar?.message}
          inputProps={register("avatar")}
        />
        <UploadBox
          label="Cover Image"
          height={70}
          preview={coverPreview}
          error={errors.coverImage?.message}
          inputProps={register("coverImage")}
        />

        <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting} sx={{ mt: 1 }}>
          {isSubmitting ? "Registering..." : "Create account"}
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", borderTop: "1px solid", borderColor: "divider", pt: 2, mt: 1 }}
        >
          Already have an account?{" "}
          <Box
            component="span"
            onClick={() => navigate(ROUTES.LOGIN)}
            sx={{ color: "primary.main", fontWeight: 600, cursor: "pointer" }}
          >
            Sign in
          </Box>
        </Typography>
      </Box>
    </AuthLayout>
  );
}

export default RegisterPage;