// src/features/moderation/pages/ModerationPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useModerationTweets } from "../hooks/useModerationTweets";
import { useModerationUsers } from "../hooks/useModerationUsers";
import { useModerationActions } from "../hooks/useModerationActions";
import ModerationTweetList from "../components/ModerationTweetList";
import ModerationUserList from "../components/ModerationUserList";
import DeleteUserDialog from "../components/DeleteUserDialog";

const STATUS_OPTIONS = ["", "draft", "awaiting_approval", "approved", "published", "rejected", "archived"];
const SENSITIVE_OPTIONS = [
  { value: "", label: "All" },
  { value: "true", label: "Sensitive only" },
  { value: "false", label: "Non-sensitive only" },
];
const ROLE_OPTIONS = ["", "user", "moderator", "admin"];
const DISABLED_OPTIONS = [
  { value: "", label: "All" },
  { value: "true", label: "Disabled only" },
  { value: "false", label: "Active only" },
];

// Shared IntersectionObserver sentinel — same pattern as FeedPage.jsx / UsersListPage.jsx
function useInfiniteScrollSentinel(loadMore) {
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
  return sentinelRef;
}

function TweetsPanel() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isSensitive, setIsSensitive] = useState("");

  const filters = {
    ...(search && { search }),
    ...(status && { status }),
    ...(isSensitive && { isSensitive: isSensitive === "true" }),
  };

  const { tweets, isLoading, error, hasMore, loadMore } = useModerationTweets(filters);
  const { moderateTweet, isPaused } = useModerationActions();
  const sentinelRef = useInfiniteScrollSentinel(loadMore);

  return (
    <Box>
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
          sx={{ minWidth: 160 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>{s || "All"}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sensitivity"
          size="small"
          value={isSensitive}
          onChange={(e) => setIsSensitive(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {SENSITIVE_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </TextField>
      </Box>

      <ModerationTweetList
        tweets={tweets}
        isLoading={tweets.length === 0 && isLoading}
        error={error}
        onModerate={moderateTweet}
        isPaused={isPaused}
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
    </Box>
  );
}

function UsersPanel() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [isDisabled, setIsDisabled] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  const filters = {
    ...(username && { username }),
    ...(fullName && { fullName }),
    ...(role && { role }),
    ...(isDisabled && { isDisabled: isDisabled === "true" }),
  };

  const { users, isLoading, error, hasMore, loadMore } = useModerationUsers(filters);
  const { moderateUser, deleteUser, isPaused } = useModerationActions();
  const sentinelRef = useInfiniteScrollSentinel(loadMore);

  const handleToggleDisabled = (id, nextIsDisabled) => moderateUser(id, { isDisabled: nextIsDisabled });
  const handleRoleChange = (id, nextRole) => moderateUser(id, { role: nextRole });

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Username"
          size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ minWidth: 140 }}
        />
        <TextField
          label="Full name"
          size="small"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          sx={{ minWidth: 140 }}
        />
        <TextField
          select
          label="Role"
          size="small"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {ROLE_OPTIONS.map((r) => (
            <MenuItem key={r} value={r}>{r || "All"}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          size="small"
          value={isDisabled}
          onChange={(e) => setIsDisabled(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {DISABLED_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </TextField>
      </Box>

      <ModerationUserList
        users={users}
        isLoading={users.length === 0 && isLoading}
        error={error}
        onToggleDisabled={handleToggleDisabled}
        onRoleChange={handleRoleChange}
        onDeleteRequest={setUserToDelete}
        isPaused={isPaused}
      />

      <div ref={sentinelRef} style={{ height: 1 }} />

      {isLoading && users.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {!hasMore && users.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          You've reached the end.
        </Typography>
      )}

      <DeleteUserDialog
        user={userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={deleteUser}
      />
    </Box>
  );
}

export default function ModerationPage() {
  const [tab, setTab] = useState("tweets");

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Moderation</Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Tweets" value="tweets" />
        <Tab label="Users" value="users" />
      </Tabs>

      {tab === "tweets" ? <TweetsPanel /> : <UsersPanel />}
    </Box>
  );
}