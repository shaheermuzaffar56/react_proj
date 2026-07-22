// src/components/TopBar.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack, Avatar, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROUTES } from "../constants/routes";
import { NAV_ITEMS } from "../constants/navItems";

function TopBar({ onMenuClick }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const currentLabel = NAV_ITEMS.find((item) => item.to === location.pathname)?.label ?? "CloudLearner";

  return (
    <AppBar position="sticky" color="default">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {isMobile && (
            <IconButton edge="start" onClick={onMenuClick} aria-label="open navigation">
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div">
            {isAuthenticated ? currentLabel : "CloudLearner"}
          </Typography>
        </Stack>

        {isAuthenticated ? (
          <Avatar
            src={user?.avatar}
            alt={user?.fullName}
            sx={{ width: 32, height: 32, cursor: "pointer" }}
            onClick={() => navigate(ROUTES.PROFILE)}
          />
        ) : (
          <Stack direction="row" spacing={1}>
            <Button onClick={() => navigate(ROUTES.LOGIN)} size="small">
              Login
            </Button>
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