// src/features/tweets/pages/FeedPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, CircularProgress, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader, { TOPBAR_HEIGHT } from "../../../components/PageHeader";
import { useTweetFeed } from "../hooks/useTweetFeed";
import { useTweets } from "../hooks/useTweets";
import TweetList from "../components/TweetList";
import TweetForm from "../components/TweetForm";

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "-likes", label: "Most liked" },
  { value: "title", label: "Title (A–Z)" },
];

export default function FeedPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { tweets, isLoading, error, hasMore, loadMore } = useTweetFeed({ search, sortBy });
  const { isPaused, create } = useTweets();

  const sentinelRef = useRef(null);

  const observerCallback = useCallback(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
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
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <PageHeader
        title="Feed"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsFormOpen(true)}>
            Create Tweet
          </Button>
        }
        search={{ value: search, onChange: setSearch, placeholder: "Search tweets…" }}
        pillGroups={[{ options: SORT_OPTIONS, value: sortBy, onChange: setSortBy }]}
        stickyTop={TOPBAR_HEIGHT}
      />

      {/* Reused unchanged from Phase 6 — no onEdit/onDelete passed, so those buttons won't render */}
      <TweetList tweets={tweets} isLoading={tweets.length === 0 && isLoading} error={error} />

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

      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Tweet</DialogTitle>
        <DialogContent>
          <TweetForm
            tweet={null}
            onSubmit={create}
            onDone={() => setIsFormOpen(false)}
            isPaused={isPaused}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}