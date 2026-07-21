// src/components/TopBar.jsx
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack, Avatar, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROUTES } from "../constants/routes";

function TopBar({ onMenuClick }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {isMobile && (
            <IconButton edge="start" onClick={onMenuClick} aria-label="open navigation">
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div">
            CloudLearner
          </Typography>
        </Stack>

        {isAuthenticated ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user?.avatar} alt={user?.fullName} sx={{ width: 32, height: 32 }} />
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
              {user?.email}
            </Typography>
            <Button onClick={handleLogout} size="small">Logout</Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button onClick={() => navigate(ROUTES.LOGIN)} size="small">Login</Button>
            <Button onClick={() => navigate(ROUTES.REGISTER)} variant="contained" size="small">
              Register
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;