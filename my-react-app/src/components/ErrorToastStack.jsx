// src/components/ErrorToastStack.jsx
import { Box, Alert, AlertTitle, Slide } from "@mui/material";
import { useErrorToast } from "../hooks/useErrorToast";

export default function ErrorToastStack() {
  const { toasts, dismiss } = useErrorToast();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: (theme) => theme.zIndex.snackbar,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        maxWidth: 420,
        px: 2,
      }}
    >
      {toasts.map((toast) => (
        <Slide key={toast.id} direction="down" in mountOnEnter unmountOnExit>
          <Alert severity="error" onClose={() => dismiss(toast.id)} variant="filled">
            <AlertTitle>{toast.title}</AlertTitle>
            {toast.status && `Status ${toast.status} — `}
            {toast.message}
          </Alert>
        </Slide>
      ))}
    </Box>
  );
}