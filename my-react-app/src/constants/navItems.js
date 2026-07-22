// src/constants/navItems.js
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from "@mui/icons-material/Shield";
import { ROUTES } from "./routes";

// Shared between Sidebar (nav list) and TopBar (current page title lookup).
// `roles`, when present, restricts visibility to those user roles (see Sidebar.jsx).
export const NAV_ITEMS = [
  { label: "Feed", to: ROUTES.FEED, icon: HomeIcon },
  { label: "My Tweets", to: ROUTES.MY_TWEETS, icon: ArticleIcon },
  { label: "Profile", to: ROUTES.PROFILE, icon: PersonIcon },
  { label: "Moderation", to: ROUTES.MODERATION, icon: ShieldIcon, roles: ["moderator", "admin"] },
];