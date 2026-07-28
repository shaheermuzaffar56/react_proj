// src/features/users/components/UserListItem.jsx
import { Link } from "react-router-dom";
import { Box, Avatar, Typography, Paper } from "@mui/material";
import { ROUTES, buildPath } from "../../../constants/routes";

export default function UserListItem({ user }) {
  return (
    <Paper
      component={Link}
      to={buildPath(ROUTES.USER_DETAIL, { id: user._id })}
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        textDecoration: "none",
        color: "inherit",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Avatar src={user.avatar} alt={user.fullName} />
      <Box>
        <Typography variant="body1" fontWeight={600}>{user.fullName}</Typography>
        <Typography variant="body2" color="text.secondary">@{user.userName}</Typography>
      </Box>
    </Paper>
  );
}