// src/features/auth/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Alert, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { ROUTES } from "../../../constants/routes";
import AuthLayout from "../components/AuthLayout";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showError } = useErrorToast();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ identifier, password }) => {
    setServerError(null);
    const isEmail = identifier.includes("@");
    try {
      await login({
        email: isEmail ? identifier : undefined,
        userName: isEmail ? undefined : identifier,
        password,
      });
      navigate(ROUTES.HOME);
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please try again.");
      showError(err, "Login failed");
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your CloudLearner account.">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        {serverError && <Alert severity="error">{serverError}</Alert>}

        <TextField
          label="Email or Username"
          fullWidth
          {...register("identifier")}
          error={!!errors.identifier}
          helperText={errors.identifier?.message}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting} sx={{ mt: 1 }}>
          {isSubmitting ? "Logging in..." : "Log In"}
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", borderTop: "1px solid", borderColor: "divider", pt: 2, mt: 1 }}
        >
          Don&apos;t have an account?{" "}
          <Box
            component="span"
            onClick={() => navigate(ROUTES.REGISTER)}
            sx={{ color: "primary.main", fontWeight: 600, cursor: "pointer" }}
          >
            Create one
          </Box>
        </Typography>
      </Box>
    </AuthLayout>
  );
}

export default LoginPage;