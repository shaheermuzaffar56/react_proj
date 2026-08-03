// src/features/tweets/pages/MyTweetsPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader, { TOPBAR_HEIGHT } from "../../../components/PageHeader";
import { useTweets } from "../hooks/useTweets";
import { useMyTweetsFeed } from "../hooks/useMyTweetsFeed";
import { useMyTweetsCounts, STATUS_PILLS } from "../hooks/useMyTweetsCounts";
import MyTweetList from "../components/MyTweetList";
import TweetForm from "../components/TweetForm";
import DeleteTweetDialog from "../components/DeleteTweetDialog";

export default function MyTweetsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { tweets, isLoading, error, hasMore, loadMore } = useMyTweetsFeed(
    statusFilter === "all" ? undefined : statusFilter
  );
  const { counts } = useMyTweetsCounts();
  const { isPaused, create, update, remove } = useTweets();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);
  const [deletingTweet, setDeletingTweet] = useState(null);

  // Client-side only — getMyTweets has no `search` param, so this filters
  // whatever's currently loaded via infinite scroll, same caveat as
  // UsersListPage.jsx's search. Revisit if the backend adds server search.
  const q = search.trim().toLowerCase();
  const filteredTweets = q
    ? tweets.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    : tweets;

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
      <PageHeader
        title="My Tweets"
        subtitle={`${counts.all} post${counts.all === 1 ? "" : "s"} total`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateForm}>
            New Tweet
          </Button>
        }
        search={{ value: search, onChange: setSearch, placeholder: "Search your tweets…" }}
        pillGroups={[{
          options: STATUS_PILLS.map(({ value, label }) => ({
            value,
            label: `${label}  ${counts[value] ?? 0}`,
          })),
          value: statusFilter,
          onChange: setStatusFilter,
        }]}
        stickyTop={TOPBAR_HEIGHT}
      />

      <MyTweetList
        tweets={filteredTweets}
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