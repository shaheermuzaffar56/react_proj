// src/components/UploadBox.jsx
// Dashed-border file upload box with image preview, matching the Figma
// FileUploadField pattern (figma_design/src/screens/Auth.tsx). Shared by
// RegisterPage (avatar/cover) and TweetForm (tweet image).
import { Box, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

export default function UploadBox({ label, required, height = 100, accept = "image/webp", preview, error, inputProps }) {
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.75 }}>
        {label}
        {!required && (
          <Typography component="span" variant="caption" color="text.disabled">
            {" "}(optional)
          </Typography>
        )}
      </Typography>
      <Box
        component="label"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height,
          borderRadius: 1,
          border: "2px dashed",
          borderColor: error ? "error.main" : preview ? "primary.main" : "divider",
          bgcolor: preview ? "transparent" : "action.hover",
          cursor: "pointer",
          overflow: "hidden",
          "&:hover": { borderColor: "primary.main", bgcolor: "primary.light" },
        }}
      >
        <input type="file" accept={accept} hidden {...inputProps} />
        {preview ? (
          <Box
            component="img"
            src={preview}
            alt={`${label} preview`}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box sx={{ textAlign: "center", color: "text.disabled" }}>
            <ImageIcon fontSize="small" />
            <Typography variant="caption" display="block">
              Click to upload{accept === "image/webp" ? " (.webp)" : ""}
            </Typography>
          </Box>
        )}
      </Box>
      {error && (
        <Typography variant="caption" color="error.main">
          {error}
        </Typography>
      )}
    </Box>
  );
}