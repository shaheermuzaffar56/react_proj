// src/features/auth/components/AuthLayout.jsx
// Shared shell for Login/Register — centered card, brand logo, title/subtitle.
// Mirrors figma_design/src/screens/Auth.tsx's AuthShell.
import { Box, Paper, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";

function AuthLayout({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2.5,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "fixed",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "fixed",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, justifyContent: "center", mb: 4 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
            }}
          >
            <BoltIcon sx={{ color: "primary.contrastText", fontSize: 20 }} />
          </Box>
          <Typography variant="h5" sx={{ fontSize: "1.375rem" }}>
            CloudLearner
          </Typography>
        </Box>

        {/* Card */}
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          {children}
        </Paper>
      </Box>
    </Box>
  );
}

export default AuthLayout;