// src/features/tweets/pages/MyTweetsPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, Button, Chip, Stack, Dialog, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTweets } from "../hooks/useTweets";
import { useMyTweetsFeed } from "../hooks/useMyTweetsFeed";
import { useMyTweetsCounts, STATUS_PILLS } from "../hooks/useMyTweetsCounts";
import MyTweetList from "../components/MyTweetList";
import TweetForm from "../components/TweetForm";
import DeleteTweetDialog from "../components/DeleteTweetDialog";

export default function MyTweetsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { tweets, isLoading, error, hasMore, loadMore } = useMyTweetsFeed(
    statusFilter === "all" ? undefined : statusFilter
  );
  const { counts } = useMyTweetsCounts();
  const { isPaused, create, update, remove } = useTweets();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);
  const [deletingTweet, setDeletingTweet] = useState(null);

  const openCreateForm = () => {
    setEditingTweet(null);
    setIsFormOpen(true);
  };

  const openEditForm = (tweet) => {
    setEditingTweet(tweet);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTweet(null);
  };

  const sentinelRef = useRef(null);
  const observerCallback = useCallback(
    (entries) => {
      if (entries[0].isIntersecting) loadMore();
    },
    [loadMore]
  );
  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, { threshold: 1.0 });
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [observerCallback]);

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h5">My Tweets</Typography>
          <Typography variant="body2" color="text.secondary">
            {counts.all} post{counts.all === 1 ? "" : "s"} total
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateForm}>
          New Tweet
        </Button>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", rowGap: 1 }}>
        {STATUS_PILLS.map(({ value, label }) => (
          <Chip
            key={value}
            label={`${label}  ${counts[value] ?? 0}`}
            onClick={() => setStatusFilter(value)}
            color={statusFilter === value ? "primary" : "default"}
            variant={statusFilter === value ? "filled" : "outlined"}
            sx={{ fontWeight: statusFilter === value ? 600 : 500 }}
          />
        ))}
      </Stack>

      <MyTweetList
        tweets={tweets}
        isLoading={tweets.length === 0 && isLoading}
        error={error}
        statusFilter={statusFilter}
        onEdit={openEditForm}
        onDelete={(id) => setDeletingTweet(tweets.find((t) => t._id === id))}
      />

      <div ref={sentinelRef} style={{ height: 1 }} />

      {isLoading && tweets.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {!hasMore && tweets.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          You've reached the end.
        </Typography>
      )}

      <Dialog open={isFormOpen} onClose={closeForm} fullWidth maxWidth="sm">
        <DialogTitle>{editingTweet ? "Edit Tweet" : "New Tweet"}</DialogTitle>
        <DialogContent>
          <TweetForm
            tweet={editingTweet}
            onSubmit={editingTweet ? update : create}
            onDone={closeForm}
            isPaused={isPaused}
          />
        </DialogContent>
      </Dialog>

      <DeleteTweetDialog
        open={!!deletingTweet}
        tweet={deletingTweet}
        onClose={() => setDeletingTweet(null)}
        onConfirm={remove}
      />
    </Box>
  );
}