// src/components/PageHeader.jsx
import { Box, Typography, TextField, Chip, Stack, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// TopBar is 64px (theme.js). Exported so pages compose stickyTop without
// hardcoding numbers — e.g. stickyTop={TOPBAR_HEIGHT} or
// stickyTop={TOPBAR_HEIGHT + TABS_HEIGHT} on Moderation's panels.
export const TOPBAR_HEIGHT = 64;
export const TABS_HEIGHT = 48;

function PillGroup({ options, value, onChange }) {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
      {options.map((opt) => (
        <Chip
          key={opt.value}
          label={opt.label}
          onClick={() => onChange(opt.value)}
          color={value === opt.value ? "primary" : "default"}
          variant={value === opt.value ? "filled" : "outlined"}
          sx={{ fontWeight: value === opt.value ? 600 : 500 }}
        />
      ))}
    </Stack>
  );
}

/**
 * Shared page header: title/subtitle/action + optional search + optional
 * pill group(s), with the search+pills region sticky under the TopBar
 * (and Tabs, where applicable).
 *
 * `search` and `searchFields` are mutually exclusive — pass one or the other,
 * never both. `search` is a single controlled input (Feed, My Tweets, Users,
 * Moderation Tweets). `searchFields` is an array of controlled inputs shown
 * side-by-side (Moderation Users' username + fullName — two real, separate
 * server-side params, not a unified search).
 */
export default function PageHeader({
  title,
  subtitle,
  action,
  search, // { value, onChange, placeholder }
  searchFields, // [{ label, value, onChange }]
  pillGroups = [], // [{ options, value, onChange }]
  stackPills = false,
  stickyTop = TOPBAR_HEIGHT,
}) {
  const hasHeaderRow = title || subtitle || action;
  const hasStickyRegion = search || searchFields || pillGroups.length > 0;

  return (
    <Box>
      {hasHeaderRow && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            {title && <Typography variant="h5">{title}</Typography>}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
      )}

      {hasStickyRegion && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mb: 3,
            position: "sticky",
            top: stickyTop,
            bgcolor: "background.default",
            zIndex: 1,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {search && (
            <TextField
              size="small"
              fullWidth
              placeholder={search.placeholder ?? "Search…"}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="disabled" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {searchFields && (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {searchFields.map((field) => (
                <TextField
                  key={field.label}
                  label={field.label}
                  size="small"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  sx={{ flex: 1, minWidth: 160 }}
                />
              ))}
            </Box>
          )}

          {pillGroups.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: stackPills ? "column" : "row",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              {pillGroups.map((group, i) => (
                <PillGroup key={i} {...group} />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}