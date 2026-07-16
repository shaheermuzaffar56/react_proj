// src/features/tweets/components/TweetCard.jsx
import { Card, CardContent, CardMedia, Typography, Chip, Stack, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// onEdit/onDelete are optional — only passed in when the card is used on "My Tweets" (Step 4)
export default function TweetCard({ tweet, onEdit, onDelete }) {
  const { title, description, image, status, tags = [] } = tweet;

  return (
    <Card sx={{ mb: 2 }}>
      {image && <CardMedia component="img" height="180" image={image} alt={title} />}
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6">{title}</Typography>
          <Chip label={status} size="small" />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
          {description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>

        {(onEdit || onDelete) && (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(tweet)} aria-label="edit tweet">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" onClick={() => onDelete(tweet._id)} aria-label="delete tweet">
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}