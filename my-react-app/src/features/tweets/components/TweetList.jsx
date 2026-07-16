// src/features/tweets/components/TweetList.jsx
import { CircularProgress, Alert, Typography, Box } from "@mui/material";
import TweetCard from "./TweetCard";

// Explicit loading / error / empty states, per Rules.md's "3 states" requirement
export default function TweetList({ tweets, isLoading, error, onEdit, onDelete }) {
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
        No tweets yet.
      </Typography>
    );
  }

  return (
    <Box>
      {tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </Box>
  );
}