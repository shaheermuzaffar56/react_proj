// src/features/users/pages/UserDetailPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Chip, CircularProgress, Alert, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUser } from "../hooks/useUser";
import { useAuth } from "../../auth/hooks/useAuth";
import { useModerationActions } from "../../moderation/hooks/useModerationActions";
import ProfileHeader from "../components/ProfileHeader";
import StatsRow from "../components/StatsRow";
import { ROUTES } from "../../../constants/routes";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading, error } = useUser(id);
  const { user: currentUser } = useAuth();
  const { deleteUser } = useModerationActions();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 680, mx: "auto", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const isAdmin = currentUser?.role === "admin";
  const isSelf = currentUser?._id === user._id;

  const handleDelete = async () => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await deleteUser(user._id);
      navigate(ROUTES.USERS);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 680, mx: "auto", pb: 6 }}>
      <Box sx={{ px: 2.5, pt: 2 }}>
        <Button
          onClick={() => navigate(ROUTES.USERS)}
          startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
          size="small"
          sx={{ color: "text.secondary", textTransform: "none" }}
        >
          Back to People
        </Button>
      </Box>

      <ProfileHeader user={user} isOwnProfile={false} />

      <Box sx={{ px: 2.5, pt: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>{user.fullName}</Typography>
          <Chip label={user.role} size="small" variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>@{user.userName}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75, mb: 2 }}>
          Joined {joinDate}
        </Typography>

        <StatsRow
          stats={[
            { label: "Role", value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
            { label: "Status", value: user.isDisabled ? "Inactive" : "Active" },
          ]}
        />

        {isAdmin && !isSelf && (
          <Box sx={{ border: "1px solid", borderColor: "error.main", borderRadius: 2, p: 2, bgcolor: "error.lighter" }}>
            {deleteError && <Alert severity="error" sx={{ mb: 1.5 }}>{deleteError}</Alert>}
            <Typography variant="subtitle2" color="error" sx={{ fontWeight: 700, mb: 1 }}>
              Admin Actions
            </Typography>
            <Button color="error" variant="contained" size="small" disabled={isDeleting} onClick={handleDelete}>
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}