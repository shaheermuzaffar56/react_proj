// src/features/moderation/components/ModerationUserListItem.jsx
import { useState } from "react";
import {
  Paper,
  Avatar,
  Box,
  Typography,
  Chip,
  Stack,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../../features/auth/hooks/useAuth";

const ROLE_OPTIONS = ["user", "moderator", "admin"];

// onToggleDisabled(id, nextIsDisabled) / onRoleChange(id, role) / onDeleteRequest(user)
export default function ModerationUserListItem({ user, onToggleDisabled, onRoleChange, onDeleteRequest, isPaused }) {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const [roleDraft, setRoleDraft] = useState(user.role);

  const handleRoleChange = (e) => {
    const nextRole = e.target.value;
    setRoleDraft(nextRole);
    onRoleChange(user._id, nextRole);
  };

  return (
    <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}>
      <Avatar src={user.avatar} alt={user.fullName} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body1" fontWeight={600} noWrap>{user.fullName}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>@{user.userName}</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
          {/* Role assignment — admin only, per PRD.md §2.6 */}
          {isAdmin ? (
            <Select
              size="small"
              value={roleDraft}
              onChange={handleRoleChange}
              disabled={isPaused}
              sx={{ height: 28, fontSize: "0.8rem" }}
            >
              {ROLE_OPTIONS.map((r) => (
                <MenuItem key={r} value={r} sx={{ fontSize: "0.8rem" }}>{r}</MenuItem>
              ))}
            </Select>
          ) : (
            <Chip label={user.role} size="small" variant="outlined" />
          )}
          {user.isDisabled && <Chip label="Disabled" size="small" color="error" />}
        </Stack>
      </Box>

      <Stack direction="row" spacing={0.5}>
        <Button
          size="small"
          variant="outlined"
          color={user.isDisabled ? "success" : "warning"}
          startIcon={user.isDisabled ? <CheckCircleOutlineIcon /> : <BlockIcon />}
          disabled={isPaused}
          onClick={() => onToggleDisabled(user._id, !user.isDisabled)}
        >
          {user.isDisabled ? "Enable" : "Disable"}
        </Button>

        {/* Delete — admin only, per PRD.md §2.6 */}
        {isAdmin && (
          <IconButton
            size="small"
            color="error"
            aria-label="delete user"
            disabled={isPaused}
            onClick={() => onDeleteRequest(user)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
    </Paper>
  );
}