// src/features/users/pages/ProfilePage.jsx
import { useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, Divider, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useMyTweetsFeed } from "../../tweets/hooks/useMyTweetsFeed";
import ProfileHeader from "../components/ProfileHeader";
import StatsRow from "../components/StatsRow";
import ProfileEditForm from "../components/ProfileEditForm";
import DeleteAccountDialog from "../components/DeleteAccountDialog";
import { useChangePassword } from "../../../features/auth/hooks/useChangePassword";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function ProfilePage() {
  const { user } = useAuth();
  const { updateProfile, updateAvatar, updateCover, deleteAccount, isPaused } = useProfile();
  const { totalCount } = useMyTweetsFeed();
  const { changePassword, isPaused: isPasswordPaused } = useChangePassword();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!user) return null; // ProtectedRoute guarantees a session, but guards a render-before-hydration flash

  const handleUpdateAvatar = (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return updateAvatar(formData);
  };

  const handleUpdateCover = (file) => {
    const formData = new FormData();
    formData.append("coverImage", file);
    return updateCover(formData);
  };

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <Box sx={{ maxWidth: 680, mx: "auto", pb: 6 }}>
      <ProfileHeader
        user={user}
        isOwnProfile={true}
        onUpdateAvatar={handleUpdateAvatar}
        onUpdateCover={handleUpdateCover}
      />

      <Box sx={{ px: 2.5, pt: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5, mb: 1.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{user.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">@{user.userName}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{user.email}</Typography>
          </Box>
          <Button variant="outlined" size="small" startIcon={<EditIcon sx={{ fontSize: 13 }} />} onClick={() => setIsEditOpen(true)}>
            Edit Profile
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2.5 }}>
          Joined {joinDate}
        </Typography>

        <StatsRow
          stats={[
            { label: "Tweets", value: totalCount },
            { label: "Role", value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
            { label: "Status", value: user.isDisabled ? "Inactive" : "Active" },
          ]}
        />

        <Box
          sx={{
            border: "1px solid",
            borderColor: "error.main",
            borderRadius: 2,
            p: 2,
            bgcolor: "#FFEBEF",
          }}
        >
          <Typography variant="subtitle2" color="error" sx={{ fontWeight: 700, mb: 0.5 }}>
            Danger Zone
          </Typography>
          <Typography variant="body2" color="error" sx={{ opacity: 0.8, mb: 1.5 }}>
            Deleting your account is permanent. All your tweets and data will be removed.
          </Typography>
          <Button color="error" variant="contained" size="small" onClick={() => setIsDeleteOpen(true)}>
            Delete My Account
          </Button>
        </Box>
      </Box>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <ProfileEditForm
            user={user}
            onSubmit={updateProfile}
            onDone={() => setIsEditOpen(false)}
            isPaused={isPaused}
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ mb: 1 }}>Change Password</Typography>
          <ChangePasswordForm onSubmit={changePassword} isPaused={isPasswordPaused} />
        </DialogContent>
      </Dialog>

      <DeleteAccountDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={deleteAccount}
      />
    </Box>
  );
}