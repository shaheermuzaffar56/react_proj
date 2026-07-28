// src/features/moderation/components/ModerationTweetList.jsx
import { CircularProgress, Alert, Typography, Box } from "@mui/material";
import ModerationTweetCard from "./ModerationTweetCard";

// Same "3 states" convention as TweetList.jsx (Rules.md)
export default function ModerationTweetList({ tweets, isLoading, error, onModerate, isPaused }) {
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
        Nothing to moderate right now.
      </Typography>
    );
  }

  return (
    <Box>
      {tweets.map((tweet) => (
        <ModerationTweetCard key={tweet._id} tweet={tweet} onModerate={onModerate} isPaused={isPaused} />
      ))}
    </Box>
  );
}