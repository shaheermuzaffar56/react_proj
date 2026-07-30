// src/features/users/components/ProfileHeader.jsx
import { useState, useRef } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

// user: current user object — reads user.avatar / user.coverImage
// isOwnProfile: hides edit controls entirely when false (view-only mode)
// onUpdateAvatar / onUpdateCover: (file: File) => Promise — parent wraps this in FormData
export default function ProfileHeader({ user, isOwnProfile, onUpdateAvatar, onUpdateCover }) {
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [coverPreview, setCoverPreview] = useState(user.coverImage);

  const [pendingAvatar, setPendingAvatar] = useState(null); // { file, previewUrl }
  const [pendingCover, setPendingCover] = useState(null);

  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [isSavingCover, setIsSavingCover] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const [coverError, setCoverError] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    setPendingAvatar({ file, previewUrl: URL.createObjectURL(file) });
    e.target.value = ""; // allow re-selecting the same file later
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverError(null);
    setPendingCover({ file, previewUrl: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const confirmAvatar = async () => {
    setIsSavingAvatar(true);
    setAvatarError(null);
    try {
      await onUpdateAvatar(pendingAvatar.file);
      setAvatarPreview(pendingAvatar.previewUrl);
      setPendingAvatar(null);
    } catch (err) {
      setAvatarError(err.response?.data?.message || "Failed to update avatar. Please try again.");
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const confirmCover = async () => {
    setIsSavingCover(true);
    setCoverError(null);
    try {
      await onUpdateCover(pendingCover.file);
      setCoverPreview(pendingCover.previewUrl);
      setPendingCover(null);
    } catch (err) {
      setCoverError(err.response?.data?.message || "Failed to update cover image. Please try again.");
    } finally {
      setIsSavingCover(false);
    }
  };

  return (
    <Box>
      {/* Cover */}
      <Box sx={{ position: "relative", height: 180, bgcolor: "grey.200", overflow: "hidden" }}>
        {coverPreview && (
          <Box
            component="img"
            src={coverPreview}
            alt=""
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        {isOwnProfile && (
          <>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/webp"
              style={{ display: "none" }}
              onChange={handleCoverChange}
            />
            <Button
              onClick={() => coverInputRef.current?.click()}
              startIcon={<PhotoCameraIcon sx={{ fontSize: 14 }} />}
              size="small"
              sx={{
                position: "absolute",
                bottom: 12,
                right: 12,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                borderRadius: 2,
                px: 1.5,
                py: 0.75,
                fontSize: 12,
                fontWeight: 500,
                textTransform: "none",
                backdropFilter: "blur(4px)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              Update cover
            </Button>
          </>
        )}
      </Box>

      {/* Avatar */}
      <Box sx={{ px: 2.5, position: "relative", mt: -4.5 }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Box
            sx={{
              border: "3px solid",
              borderColor: "background.paper",
              borderRadius: "50%",
              bgcolor: "background.paper",
              display: "inline-block",
            }}
          >
            <Avatar src={avatarPreview} alt={user.fullName} sx={{ width: 72, height: 72 }} />
          </Box>
          {isOwnProfile && (
            <>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/webp"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              <IconButton
                onClick={() => avatarInputRef.current?.click()}
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  bgcolor: "primary.main",
                  border: "2px solid",
                  borderColor: "background.paper",
                  color: "white",
                  width: 26,
                  height: 26,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <EditIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      {/* Avatar confirm dialog */}
      <Dialog open={!!pendingAvatar} onClose={() => setPendingAvatar(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Update avatar?</DialogTitle>
        <DialogContent>
          {avatarError && <Alert severity="error" sx={{ mb: 2 }}>{avatarError}</Alert>}
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Avatar
              src={pendingAvatar?.previewUrl}
              sx={{ width: 80, height: 80, mx: "auto", mb: 1, border: "2px solid", borderColor: "divider" }}
            />
            <Typography variant="body2" color="text.secondary">
              This will replace your current avatar.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingAvatar(null)} disabled={isSavingAvatar}>Cancel</Button>
          <Button onClick={confirmAvatar} variant="contained" disabled={isSavingAvatar}>
            {isSavingAvatar ? "Saving..." : "Update Avatar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cover confirm dialog */}
      <Dialog open={!!pendingCover} onClose={() => setPendingCover(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Update cover image?</DialogTitle>
        <DialogContent>
          {coverError && <Alert severity="error" sx={{ mb: 2 }}>{coverError}</Alert>}
          <Box
            component="img"
            src={pendingCover?.previewUrl}
            alt="New cover"
            sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1, border: "1px solid", borderColor: "divider", mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            This will replace your current cover image.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingCover(null)} disabled={isSavingCover}>Cancel</Button>
          <Button onClick={confirmCover} variant="contained" disabled={isSavingCover}>
            {isSavingCover ? "Saving..." : "Update Cover"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}