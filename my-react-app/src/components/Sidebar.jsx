// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from "@mui/icons-material/Shield";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROUTES } from "../constants/routes";

const SIDEBAR_WIDTH = 220;

function Sidebar({ mobileOpen, onMobileClose }) {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isModOrAdmin = user?.role === "moderator" || user?.role === "admin";

  const navItems = [
    { label: "Feed", to: ROUTES.FEED, icon: <HomeIcon /> },
    { label: "My Tweets", to: ROUTES.MY_TWEETS, icon: <ArticleIcon /> },
    { label: "Profile", to: ROUTES.PROFILE, icon: <PersonIcon /> },
    ...(isModOrAdmin ? [{ label: "Moderation", to: ROUTES.MODERATION, icon: <ShieldIcon /> }] : []),
  ];

  const navList = (
    <List sx={{ width: SIDEBAR_WIDTH }}>
      {navItems.map((item) => (
        <ListItemButton
          key={item.to}
          component={NavLink}
          to={item.to}
          onClick={isMobile ? onMobileClose : undefined}
          sx={{ "&.active": { backgroundColor: "action.selected", fontWeight: 600 } }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );

  if (isMobile) {
    return (
      <Drawer variant="temporary" open={mobileOpen} onClose={onMobileClose} ModalProps={{ keepMounted: true }}>
        {navList}
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
        overflowY: "auto",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      {navList}
    </Box>
  );
}

export default Sidebar;
export { SIDEBAR_WIDTH };