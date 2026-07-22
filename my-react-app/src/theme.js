// src/theme.js
//
// MUI theme built from the Figma export's design spec
// (figma_design/src/muiTheme.ts + index.css — colors, type scale, radii, component overrides).
// Only the light palette is wired up for now, since the app has no dark-mode
// toggle yet. `darkPalette` is exported too, so wiring a toggle later is a
// one-line change in createTheme(), not a redesign.
import { createTheme } from "@mui/material/styles";

export const lightPalette = {
  mode: "light",
  primary: { main: "#7C3AED", dark: "#6D28D9", light: "#EDE9FE", contrastText: "#FFFFFF" },
  secondary: { main: "#0EA5E9", dark: "#0284C7", light: "#E0F2FE", contrastText: "#FFFFFF" },
  success: { main: "#059669", dark: "#047857", light: "#D1FAE5", contrastText: "#FFFFFF" },
  warning: { main: "#D97706", dark: "#B45309", light: "#FEF3C7", contrastText: "#FFFFFF" },
  error: { main: "#DC2626", dark: "#B91C1C", light: "#FEE2E2", contrastText: "#FFFFFF" },
  background: { default: "#F7F7FC", paper: "#FFFFFF" },
  text: { primary: "#0E0E1A", secondary: "#5B5B7A", disabled: "#9595B0" },
  divider: "#E3E3EE",
};

export const darkPalette = {
  mode: "dark",
  primary: { main: "#8B5CF6", dark: "#7C3AED", light: "#1A1535", contrastText: "#FFFFFF" },
  secondary: { main: "#38BDF8", dark: "#0EA5E9", light: "#0B1F2E", contrastText: "#FFFFFF" },
  success: { main: "#10B981", dark: "#059669", light: "#052E1C", contrastText: "#FFFFFF" },
  warning: { main: "#F59E0B", dark: "#D97706", light: "#2D1B02", contrastText: "#FFFFFF" },
  error: { main: "#EF4444", dark: "#DC2626", light: "#2D0808", contrastText: "#FFFFFF" },
  background: { default: "#0A0A12", paper: "#131320" },
  text: { primary: "#EEECF8", secondary: "#8888AA", disabled: "#555570" },
  divider: "#252536",
};

const typography = {
  fontFamily: '"Inter", system-ui, sans-serif',
  h5: {
    fontFamily: '"Manrope", system-ui, sans-serif',
    fontSize: "1.25rem", // 20px — page titles ("Feed", "My Tweets")
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  h6: {
    fontFamily: '"Manrope", system-ui, sans-serif',
    fontSize: "1.125rem", // 18px — card/dialog section headers
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  subtitle1: {
    fontFamily: '"Manrope", system-ui, sans-serif',
    fontSize: "0.9375rem", // 15px — tweet card headline
    fontWeight: 700,
    lineHeight: 1.4,
  },
  subtitle2: {
    fontSize: "0.8125rem", // 13px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: "0.875rem", // 14px — tweet body, form fields
    fontWeight: 400,
    lineHeight: 1.65,
  },
  body2: {
    fontSize: "0.75rem", // 12px — @username, timestamps
    fontWeight: 400,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: "0.6875rem", // 11px — tag chips, badge labels
    fontWeight: 500,
    lineHeight: 1,
    letterSpacing: "0.01em",
  },
  button: {
    fontSize: "0.875rem", // 14px
    fontWeight: 600,
    textTransform: "none",
    letterSpacing: "0.01em",
  },
  overline: {
    fontSize: "0.625rem", // 10px
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
};

const shape = {
  borderRadius: 8, // base radius (--r-sm); cards/dialogs override to 12/16 below
};

const components = {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: "1px solid",
        boxShadow: "none",
        "&:hover": { boxShadow: "0 4px 16px rgba(14,14,26,.10)" },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: "10px 18px",
        boxShadow: "none",
        "&:hover": { boxShadow: "none" },
      },
      sizeSmall: { padding: "7px 14px", fontSize: 13 },
      sizeLarge: { padding: "13px 24px", fontSize: 15 },
    },
  },
  MuiTextField: {
    defaultProps: { variant: "outlined", size: "small" },
    styleOverrides: {
      root: { "& .MuiOutlinedInput-root": { borderRadius: 8 } },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 9999, fontWeight: 600, fontSize: 11 },
      sizeSmall: { height: 22 },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: { fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 700 },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 16, backgroundImage: "none" },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontFamily: '"Manrope", system-ui, sans-serif',
        fontWeight: 700,
        fontSize: 18,
        padding: "20px 24px 0",
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: { root: { padding: "16px 24px" } },
  },
  MuiDialogActions: {
    styleOverrides: { root: { padding: "0 24px 20px", gap: 8 } },
  },
  MuiAppBar: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        borderBottom: "1px solid",
        height: 64,
        justifyContent: "center",
        backgroundImage: "none",
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: { width: 260, borderRight: "1px solid" },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        margin: "2px 8px",
        width: "calc(100% - 16px)",
        "&.Mui-selected": { fontWeight: 600 },
      },
    },
  },
  MuiDivider: {
    styleOverrides: { root: { opacity: 1 } },
  },
};

const theme = createTheme({
  palette: lightPalette,
  typography,
  shape,
  components,
});

export default theme;