// src/features/users/pages/UsersListPage.jsx
import { useRef, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress, Alert, Stack } from "@mui/material";
import { useAllUsers } from "../hooks/useAllUsers";
import UserListItem from "../components/UserListItem";

export default function UsersListPage() {
  const { users, isLoading, error, hasMore, loadMore } = useAllUsers();

  // Same IntersectionObserver sentinel pattern as FeedPage.jsx
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
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Users</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={1.5}>
        {users.map((u) => (
          <UserListItem key={u._id} user={u} />
        ))}
      </Stack>

      <div ref={sentinelRef} style={{ height: 1 }} />

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!hasMore && users.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          You've reached the end.
        </Typography>
      )}
    </Box>
  );
}