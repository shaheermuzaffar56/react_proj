// src/features/moderation/components/ModerationUserList.jsx
import { CircularProgress, Alert, Typography, Box, Stack } from "@mui/material";
import ModerationUserListItem from "./ModerationUserListItem";

// Same "3 states" convention as TweetList.jsx / ModerationTweetList.jsx (Rules.md)
export default function ModerationUserList({
  users,
  isLoading,
  error,
  onToggleDisabled,
  onRoleChange,
  onDeleteRequest,
  isPaused,
}) {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!users || users.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No users to moderate right now.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {users.map((u) => (
        <ModerationUserListItem
          key={u._id}
          user={u}
          onToggleDisabled={onToggleDisabled}
          onRoleChange={onRoleChange}
          onDeleteRequest={onDeleteRequest}
          isPaused={isPaused}
        />
      ))}
    </Stack>
  );
}