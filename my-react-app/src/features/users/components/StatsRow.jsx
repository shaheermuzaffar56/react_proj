// src/features/users/components/StatsRow.jsx
import { Box } from "@mui/material";

// stats: [{ label, value }, ...]
export default function StatsRow({ stats }) {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        py: 2,
        mb: 3,
      }}
    >
      {stats.map((s, i) => (
        <Box
          key={s.label}
          sx={{
            flex: 1,
            textAlign: "center",
            borderLeft: i > 0 ? "1px solid" : "none",
            borderColor: "divider",
          }}
        >
          <Box sx={{ fontSize: 20, fontWeight: 800 }}>{s.value}</Box>
          <Box sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>{s.label}</Box>
        </Box>
      ))}
    </Box>
  );
}