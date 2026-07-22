// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROUTES } from "../constants/routes";
import { NAV_ITEMS } from "../constants/navItems";

const SIDEBAR_WIDTH = 260; // matches Figma's --sidebar-w token

function Sidebar({ mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.role));

  const closeIfMobile = () => {
    if (isMobile) onMobileClose();
  };

  const handleLogout = async () => {
    await logout();
    closeIfMobile();
    navigate(ROUTES.LOGIN);
  };

  const content = (
    <Box sx={{ width: SIDEBAR_WIDTH, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2.5,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "10px",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <BoltIcon sx={{ color: "primary.contrastText", fontSize: 18 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>
            CloudLearner
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Social Platform
          </Typography>
        </Box>
      </Box>

      {/* User info — clicking goes to own profile */}
      <Box
        onClick={() => {
          navigate(ROUTES.PROFILE);
          closeIfMobile();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2,
          py: 1.75,
          borderBottom: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Avatar src={user?.avatar} alt={user?.fullName} sx={{ width: 40, height: 40 }} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.fullName}
          </Typography>
          <Typography variant="caption" color="text.disabled" noWrap>
            {user?.email}
          </Typography>
        </Box>
      </Box>

      {/* Nav */}
      <Box sx={{ px: 1.25, pt: 1, pb: 1, flex: 1, overflowY: "auto" }}>
        <Typography
          variant="overline"
          sx={{ display: "block", px: 1.25, pb: 1, color: "text.disabled" }}
        >
          Navigation
        </Typography>
        <List disablePadding>
          {visibleItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              onClick={closeIfMobile}
              sx={{
                "&.active": {
                  bgcolor: "primary.light",
                  color: "primary.main",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <item.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Sign out — lives here per the Figma layout, not in TopBar */}
      <Box sx={{ p: 1.25, borderTop: "1px solid", borderColor: "divider" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "error.main", bgcolor: "error.light" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItemButton>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer variant="temporary" open={mobileOpen} onClose={onMobileClose} ModalProps={{ keepMounted: true }}>
        {content}
      </Drawer>
    );
  }

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      {content}
    </Box>
  );
}

export default Sidebar;
export { SIDEBAR_WIDTH };