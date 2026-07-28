// src/features/users/components/DeleteAccountDialog.jsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";

// open: boolean controlling visibility
// onClose: called to dismiss without deleting
// onConfirm: useProfile().deleteAccount
export default function DeleteAccountDialog({ open, onClose, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      await onConfirm();
      // no onClose() here — a successful delete clears auth state and
      // ProtectedRoute will redirect away from this page entirely
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Account</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <DialogContentText>
          Are you sure you want to delete your account? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete Account"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}