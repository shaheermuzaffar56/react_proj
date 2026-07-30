// src/features/users/components/UserListItem.jsx
import { Link } from "react-router-dom";
import { Box, Avatar, Typography, Paper, Chip, Stack } from "@mui/material";
import { ROUTES, buildPath } from "../../../constants/routes";
import { useAuth } from "../../auth/hooks/useAuth";

const ROLE_COLOR = {
  admin: "error",
  moderator: "warning",
  user: "secondary",
};

export default function UserListItem({ user }) {
  const { user: currentUser } = useAuth();
  const isSelf = currentUser?._id === user._id;

  return (
    <Paper
      component={Link}
      to={buildPath(ROUTES.USER_DETAIL, { id: user._id })}
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.75,
        p: 1.75,
        borderRadius: 3, // ~12px, closer to the Figma card radius
        textDecoration: "none",
        color: "inherit",
        "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
      }}
    >
      <Avatar src={user.avatar} alt={user.fullName} sx={{ width: 48, height: 48 }} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
          <Typography variant="subtitle1" noWrap>
            {user.fullName}
          </Typography>
          {isSelf && (
            <Chip
              label="YOU"
              size="small"
              color="primary"
              sx={{ height: 18, fontSize: 10, fontWeight: 700 }}
            />
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" noWrap>
          @{user.userName}
        </Typography>
      </Box>

      <Chip
        label={user.role}
        size="small"
        color={ROLE_COLOR[user.role] ?? "default"}
        sx={{ textTransform: "uppercase", fontWeight: 700, fontSize: 10 }}
      />
    </Paper>
  );
}