// src/features/moderation/components/EditUserDialog.jsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";

// user: target user object (or null to keep dialog closed) — same convention as DeleteUserDialog.jsx
// onClose: called to dismiss without saving
// onConfirm: (id, data) => useModerationActions().moderateUser
export default function EditUserDialog({ user, onClose, onConfirm }) {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Reset the form fields whenever a new user is opened into the dialog
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setUserName(user.userName || "");
      setError(null);
    }
  }, [user]);

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await onConfirm(user._id, { fullName, userName });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={!!user} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}