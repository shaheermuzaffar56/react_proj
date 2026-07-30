// src/features/users/pages/UsersListPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress, Alert, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAllUsers } from "../hooks/useAllUsers";
import UserListItem from "../components/UserListItem";

export default function UsersListPage() {
  const { users, total, isLoading, error, hasMore, loadMore } = useAllUsers();
  const [search, setSearch] = useState("");

  // NOTE: client-side only — /user/allUsers has no `search` param, and users
  // arrive via infinite scroll, so this filters what's currently loaded,
  // not the full user base. Revisit if/when the backend adds server search.
  const q = search.trim().toLowerCase();
  const filtered = q
    ? users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.userName.toLowerCase().includes(q)
      )
    : users;

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
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2.5 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Users
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {total} member{total === 1 ? "" : "s"} in the community
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Search by name or username…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 2.5,
          position: "sticky",
          top: 64, // matches TopBar's fixed height in theme.js
          bgcolor: "background.default",
          zIndex: 1,
          py: 1,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="disabled" />
            </InputAdornment>
          ),
        }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {filtered.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
          No users found
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 1.5,
          }}
        >
          {filtered.map((u) => (
            <UserListItem key={u._id} user={u} />
          ))}
        </Box>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!hasMore && filtered.length > 0 && !q && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          All {total} member{total === 1 ? "" : "s"} shown ✓
        </Typography>
      )}
    </Box>
  );
}