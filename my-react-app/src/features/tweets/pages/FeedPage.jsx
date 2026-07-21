// src/features/tweets/pages/FeedPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, CircularProgress } from "@mui/material";
import { useTweetFeed } from "../hooks/useTweetFeed";
import TweetList from "../components/TweetList";

const STATUS_OPTIONS = ["", "published", "draft", "awaiting_approval", "approved", "rejected", "archived"];
const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "-likes", label: "Most liked" },
  { value: "title", label: "Title (A–Z)" },
];

export default function FeedPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");

  const { tweets, isLoading, error, hasMore, loadMore } = useTweetFeed({ search, status, sortBy });

  // Sentinel element — when it becomes visible, load the next page
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
      <Typography variant="h5" sx={{ mb: 2 }}>Feed</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Search"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          select
          label="Status"
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>{s || "All"}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sort"
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Reused unchanged from Phase 6 — no onEdit/onDelete passed, so those buttons won't render */}
      <TweetList tweets={tweets} isLoading={tweets.length === 0 && isLoading} error={error} />

      {/* Sentinel — invisible, just triggers loadMore() when scrolled into view */}
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
    </Box>
  );
}