// src/features/users/pages/UsersListPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import PageHeader, { TOPBAR_HEIGHT } from "../../../components/PageHeader";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAllUsers } from "../hooks/useAllUsers";
import UserListItem from "../components/UserListItem";

const ROLE_PILLS = [
  { value: "", label: "All" },
  { value: "user", label: "User" },
  { value: "moderator", label: "Moderator" },
  { value: "admin", label: "Admin" },
];

export default function UsersListPage() {
  const { user } = useAuth();
  const canFilterByRole = ["admin", "moderator"].includes(user?.role);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const { users, total, isLoading, error, hasMore, loadMore } = useAllUsers(canFilterByRole ? role : undefined);

  // Client-side only — /user/allUsers has no `search` param, and users
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
      <PageHeader
        title="Users"
        subtitle={`${total} member${total === 1 ? "" : "s"} in the community`}
        search={{ value: search, onChange: setSearch, placeholder: "Search by name or username…" }}
        pillGroups={canFilterByRole ? [{ options: ROLE_PILLS, value: role, onChange: setRole }] : []}
        stickyTop={TOPBAR_HEIGHT}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>No users found</Box>
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
        <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
          All {total} member{total === 1 ? "" : "s"} shown ✓
        </Box>
      )}
    </Box>
  );
}