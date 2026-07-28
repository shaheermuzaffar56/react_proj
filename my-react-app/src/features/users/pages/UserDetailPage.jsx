// src/features/users/pages/UserDetailPage.jsx
import { useParams } from "react-router-dom";
import { Box, Typography, Avatar, CircularProgress, Alert } from "@mui/material";
import { useUser } from "../hooks/useUser";

export default function UserDetailPage() {
  const { id } = useParams();
  const { user, isLoading, error } = useUser(id);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 480, mx: "auto", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src={user.avatar} alt={user.fullName} sx={{ width: 72, height: 72 }} />
        <Box>
          <Typography variant="h6">{user.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">@{user.userName}</Typography>
        </Box>
      </Box>
    </Box>
  );
}