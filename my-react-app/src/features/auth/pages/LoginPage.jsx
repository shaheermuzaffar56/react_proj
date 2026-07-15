// src/features/auth/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Alert } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";

// Zod schema: one "identifier" field (email OR username), split apart on submit
const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ identifier, password }) => {
    setServerError(null);
    // Backend accepts either field — send as email if it looks like one, else userName
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
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 360, mx: "auto", mt: 8 }}>
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

      <TextField
        label="Email or Username"
        fullWidth
        margin="normal"
        {...register("identifier")}
        error={!!errors.identifier}
        helperText={errors.identifier?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 2 }}>
        {isSubmitting ? "Logging in..." : "Log In"}
      </Button>
    </Box>
  );
}

export default LoginPage;