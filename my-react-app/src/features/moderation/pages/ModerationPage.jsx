// src/features/moderation/pages/ModerationPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, Tabs, Tab, TextField, MenuItem, CircularProgress } from "@mui/material";
import PageHeader, { TOPBAR_HEIGHT, TABS_HEIGHT } from "../../../components/PageHeader";
import { useModerationTweets } from "../hooks/useModerationTweets";
import { useModerationUsers } from "../hooks/useModerationUsers";
import { useModerationActions } from "../hooks/useModerationActions";
import ModerationTweetList from "../components/ModerationTweetList";
import ModerationUserList from "../components/ModerationUserList";
import DeleteUserDialog from "../components/DeleteUserDialog";
import EditUserDialog from "../components/EditUserDialog";

const STATUS_PILLS = [
  { value: "", label: "All" },
  { value: "awaiting_approval", label: "Awaiting" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];
const SENSITIVE_OPTIONS = [
  { value: "", label: "All" },
  { value: "true", label: "Sensitive only" },
  { value: "false", label: "Non-sensitive only" },
];
const ROLE_PILLS = [
  { value: "", label: "All" },
  { value: "user", label: "User" },
  { value: "moderator", label: "Moderator" },
  { value: "admin", label: "Admin" },
];
const DISABLED_PILLS = [
  { value: "", label: "All" },
  { value: "false", label: "Active only" },
  { value: "true", label: "Disabled only" },
];

const STICKY_TOP = TOPBAR_HEIGHT + TABS_HEIGHT;

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
      <PageHeader
        search={{ value: search, onChange: setSearch, placeholder: "Search tweets…" }}
        pillGroups={[{ options: STATUS_PILLS, value: status, onChange: setStatus }]}
        stickyTop={STICKY_TOP}
      />

      {/* Not yet part of PageHeader — kept as a plain dropdown alongside it, see note above */}
      <TextField
        select
        label="Sensitivity"
        size="small"
        value={isSensitive}
        onChange={(e) => setIsSensitive(e.target.value)}
        sx={{ minWidth: 180, mb: 3 }}
      >
        {SENSITIVE_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>

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
  const [userToEdit, setUserToEdit] = useState(null);

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
      <PageHeader
        searchFields={[
          { label: "Username", value: username, onChange: setUsername },
          { label: "Full name", value: fullName, onChange: setFullName },
        ]}
        pillGroups={[
          { options: ROLE_PILLS, value: role, onChange: setRole },
          { options: DISABLED_PILLS, value: isDisabled, onChange: setIsDisabled },
        ]}
        stackPills={true}
        stickyTop={STICKY_TOP}
      />

      <ModerationUserList
        users={users}
        isLoading={users.length === 0 && isLoading}
        error={error}
        onToggleDisabled={handleToggleDisabled}
        onRoleChange={handleRoleChange}
        onDeleteRequest={setUserToDelete}
        onEditRequest={setUserToEdit}
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

      <EditUserDialog
        user={userToEdit}
        onClose={() => setUserToEdit(null)}
        onConfirm={moderateUser}
      />
    </Box>
  );
}

export default function ModerationPage() {
  const [tab, setTab] = useState("tweets");

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Moderation</Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          position: "sticky",
          top: TOPBAR_HEIGHT,
          bgcolor: "background.default",
          zIndex: 2, // above the filter bar underneath it
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tab label="Tweets" value="tweets" />
        <Tab label="Users" value="users" />
      </Tabs>

      {tab === "tweets" ? <TweetsPanel /> : <UsersPanel />}
    </Box>
  );
}