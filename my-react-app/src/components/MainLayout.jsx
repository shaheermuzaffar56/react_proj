// src/components/MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <Box component="main" sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;