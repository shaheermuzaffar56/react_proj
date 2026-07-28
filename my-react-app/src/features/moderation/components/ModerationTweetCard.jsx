// src/features/moderation/components/ModerationTweetCard.jsx
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Avatar,
  Button,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PublishIcon from "@mui/icons-material/Publish";
import { getStatusChipProps } from "../../../constants/tweetStatus";

// Same "Xm/Xh/Xd, else Mon D" convention as TweetCard.jsx's formatDate
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diffH = (Date.now() - d.getTime()) / 1000 / 3600;
  if (diffH < 1) return `${Math.max(1, Math.floor((Date.now() - d.getTime()) / 60000))}m`;
  if (diffH < 24) return `${Math.floor(diffH)}h`;
  if (diffH < 168) return `${Math.floor(diffH / 24)}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ModerationTweetCard({ tweet, onModerate, isPaused }) {
  const { _id, title, description, image, status, isSensitive, tags = [], author, createdAt } = tweet;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", mb: 1 }}>
          <Avatar src={author?.avatar} alt={author?.fullName} sx={{ width: 38, height: 38 }} />
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {author?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{author?.userName}
              </Typography>
              <Chip label={author?.role} size="small" variant="outlined" sx={{ height: 20 }} />
              <Typography variant="body2" color="text.secondary">·</Typography>
              <Typography variant="body2" color="text.secondary">{formatDate(createdAt)}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              <Chip size="small" {...getStatusChipProps(status)} />
              {isSensitive && <Chip size="small" label="Sensitive" color="error" variant="outlined" />}
            </Stack>
          </Box>
        </Stack>

        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>

        {image && (
          <Box sx={{ mt: 1.5, borderRadius: 2, overflow: "hidden" }}>
            <CardMedia component="img" image={image} alt={title} sx={{ maxHeight: 320, objectFit: "cover" }} />
          </Box>
        )}

        {tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1.5 }}>
            {tags.map((tag) => (
              <Chip key={tag} label={`#${tag}`} size="small" />
            ))}
          </Stack>
        )}

        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 2, pt: 1.5, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Button
            size="small"
            variant="outlined"
            color="success"
            startIcon={<CheckCircleIcon />}
            disabled={status === "approved" || isPaused}
            onClick={() => onModerate(_id, "approved")}
          >
            Approve
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            disabled={status === "rejected" || isPaused}
            onClick={() => onModerate(_id, "rejected")}
          >
            Reject
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<PublishIcon />}
            disabled={status === "published" || isPaused}
            onClick={() => onModerate(_id, "published")}
          >
            Publish
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}