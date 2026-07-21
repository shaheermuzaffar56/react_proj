// src/features/tweets/components/TweetReactorsList.jsx
import { useRef, useEffect, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress, Alert, Typography, Box } from "@mui/material";
import { useReactorsList } from "../hooks/useReactorsList";

// fetchFn passed in by the caller — decides which of the three endpoints this dialog shows
export default function TweetReactorsList({ open, onClose, title, tweetId, fetchFn }) {
  const { users, isLoading, error, hasMore, loadMore } = useReactorsList(fetchFn, tweetId, open);

  const sentinelRef = useRef(null);
  const observerCallback = useCallback(
    (entries) => {
      if (entries[0].isIntersecting) loadMore();
    },
    [loadMore]
  );

  useEffect(() => {
    if (!open) return;
    const observer = new IntersectionObserver(observerCallback, { threshold: 1.0 });
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [open, observerCallback]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: 400 }}>
        {error && <Alert severity="error">{error}</Alert>}

        {!error && users.length === 0 && !isLoading && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
            No one yet.
          </Typography>
        )}

        <List dense>
          {users.map((u) => (
            <ListItem key={u._id}>
              <ListItemAvatar>
                <Avatar src={u.avatar} alt={u.fullName} />
              </ListItemAvatar>
              <ListItemText primary={u.fullName} secondary={`@${u.userName}`} />
            </ListItem>
          ))}
        </List>

        <div ref={sentinelRef} style={{ height: 1 }} />

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {!hasMore && users.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", py: 1 }}>
            End of list.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}