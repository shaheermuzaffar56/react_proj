// src/features/users/pages/ProfilePage.jsx
import { useState } from "react";
import { Box, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, Divider } from "@mui/material";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import ProfileEditForm from "../components/ProfileEditForm";
import ProfileImageUploadForm from "../components/ProfileImageUploadForm";
import DeleteAccountDialog from "../components/DeleteAccountDialog";
import { useChangePassword } from "../../../features/auth/hooks/useChangePassword";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function ProfilePage() {
  const { user } = useAuth();
  const { updateProfile, updateAvatar, updateCover, deleteAccount, isPaused } = useProfile();
  const { changePassword, isPaused: isPasswordPaused } = useChangePassword();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!user) return null; // ProtectedRoute guarantees a session, but guards a render-before-hydration flash

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Profile</Typography>
        <Button variant="outlined" onClick={() => setIsEditOpen(true)}>
          Edit Profile
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar src={user.avatar} alt={user.fullName} sx={{ width: 72, height: 72 }} />
        <Box>
          <Typography variant="h6">{user.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">@{user.userName}</Typography>
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" sx={{ mb: 1 }}>Avatar</Typography>
      <ProfileImageUploadForm
        kind="avatar"
        currentImage={user.avatar}
        fieldName="avatar"
        onSubmit={updateAvatar}
        isPaused={isPaused}
      />

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Cover Image</Typography>
      <ProfileImageUploadForm
        kind="cover"
        currentImage={user.coverImage}
        fieldName="coverImage"
        onSubmit={updateCover}
        isPaused={isPaused}
      />

      <Divider sx={{ my: 3 }} />

      <Button color="error" variant="text" onClick={() => setIsDeleteOpen(true)}>
        Delete Account
      </Button>

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