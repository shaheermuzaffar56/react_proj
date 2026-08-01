// src/features/tweets/components/MyTweetList.jsx
import { CircularProgress, Alert, Typography, Box, Stack } from "@mui/material";
import MyTweetCard from "./MyTweetCard";

export default function MyTweetList({ tweets, isLoading, error, statusFilter, onEdit, onDelete }) {
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

  if (!tweets || tweets.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        {statusFilter === "all" ? "No tweets yet." : `No ${statusFilter} tweets.`}
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {tweets.map((tweet) => (
        <MyTweetCard key={tweet._id} tweet={tweet} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </Stack>
  );
}