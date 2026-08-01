// src/features/tweets/components/MyTweetCard.jsx
//
// Dedicated card for the My Tweets page only — matches the Figma design
// (thumbnail, status badge, edit/delete, tags, date). Deliberately separate
// from TweetCard.jsx, which is shared with the public Feed and shows
// like/dislike/repost + author info that don't apply to your own tweets list.
import { Paper, Box, Typography, Chip, IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { getStatusChipProps } from "../../../constants/tweetStatus";

export default function MyTweetCard({ tweet, onEdit, onDelete }) {
  const { title, description, image, status, tags = [], createdAt } = tweet;

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        gap: 1.75,
        p: 2,
        alignItems: "flex-start",
        "&:hover": { borderColor: "primary.main" },
      }}
    >
      {image ? (
        <Box
          component="img"
          src={image}
          alt=""
          sx={{ width: 72, height: 56, borderRadius: 1, objectFit: "cover", flexShrink: 0 }}
        />
      ) : (
        <Box
          sx={{
            width: 72, height: 56, borderRadius: 1, flexShrink: 0,
            bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <ImageIcon fontSize="small" color="disabled" />
        </Box>
      )}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
          <Chip size="small" {...getStatusChipProps(status)} />
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={() => onEdit(tweet)} aria-label="edit tweet">
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(tweet._id)} aria-label="delete tweet" color="error">
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Stack>

        <Typography
          variant="subtitle1"
          sx={{ mt: 0.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" sx={{ mt: 1 }}>
          {tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              size="small"
              sx={{ bgcolor: "primary.light", color: "primary.dark", fontWeight: 600 }}
            />
          ))}
          {tags.length > 3 && (
            <Typography variant="caption" color="text.secondary">
              +{tags.length - 3} more
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
            {new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}