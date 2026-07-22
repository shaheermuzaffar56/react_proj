// src/features/tweets/components/TweetCard.jsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import RepeatIcon from "@mui/icons-material/Repeat";
import { useTweetInteractions } from "../hooks/useTweetInteractions";
import TweetReactorsList from "./TweetReactorsList";
import { getTweetLikes, getTweetDislikes, getTweetReposts } from "../services/tweetService";
import { getStatusChipProps } from "../../../constants/tweetStatus";

// "Jan 15" fallback, "Xm / Xh / Xd" for anything under a week old
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const diffH = diffMs / 1000 / 3600;
  if (diffH < 1) return `${Math.max(1, Math.floor(diffMs / 60000))}m`;
  if (diffH < 24) return `${Math.floor(diffH)}h`;
  if (diffH < 168) return `${Math.floor(diffH / 24)}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// 1200 -> "1.2k"
function fmtNum(n = 0) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const DESCRIPTION_CLAMP_THRESHOLD = 180;

export default function TweetCard({ tweet, onEdit, onDelete }) {
  const { title, description, image, status, tags = [], author, createdAt } = tweet;
  const {
    isLiked, isDisliked, isReposted,
    likesCount, dislikesCount, repostsCount,
    error, toggleLike, toggleDislike, toggleRepost,
  } = useTweetInteractions(tweet);

  const [openList, setOpenList] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const listConfig = {
    likes: { title: "Liked by", fetchFn: getTweetLikes },
    dislikes: { title: "Disliked by", fetchFn: getTweetDislikes },
    reposts: { title: "Reposted by", fetchFn: getTweetReposts },
  };

  const isLongDescription = (description?.length ?? 0) > DESCRIPTION_CLAMP_THRESHOLD;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Header: avatar, name / username / date, status badge, menu */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Avatar src={author?.avatar} alt={author?.fullName} sx={{ width: 38, height: 38 }} />
            <Box>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {author?.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  @{author?.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary">·</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(createdAt)}
                </Typography>
              </Stack>
              <Chip size="small" {...getStatusChipProps(status)} sx={{ mt: 0.5 }} />
            </Box>
          </Stack>

          {(onEdit || onDelete) && (
            <>
              <IconButton
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                aria-label="tweet options"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
                {onEdit && (
                  <MenuItem onClick={() => { setMenuAnchor(null); onEdit(tweet); }}>
                    <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                )}
                {onDelete && (
                  <MenuItem
                    onClick={() => { setMenuAnchor(null); onDelete(tweet._id); }}
                    sx={{ color: "error.main" }}
                  >
                    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Stack>

        {/* Title + description */}
        <Typography variant="subtitle1" sx={{ mt: 1.5 }}>
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 0.5,
            ...(expanded
              ? {}
              : {
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }),
          }}
        >
          {description}
        </Typography>
        {isLongDescription && (
          <Button
            size="small"
            onClick={() => setExpanded((e) => !e)}
            sx={{ px: 0, minWidth: "auto", mt: 0.5 }}
          >
            {expanded ? "Show less" : "Show more"}
          </Button>
        )}

        {/* Image */}
        {image && (
          <Box sx={{ mt: 1.5, borderRadius: 2, overflow: "hidden" }}>
            <CardMedia
              component="img"
              image={image}
              alt={title}
              sx={{ maxHeight: 320, objectFit: "cover" }}
            />
          </Box>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1.5 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                sx={{ bgcolor: "primary.light", color: "primary.dark", fontWeight: 600 }}
              />
            ))}
          </Stack>
        )}

        {error && (
          <Typography color="error" variant="caption" sx={{ display: "block", mt: 1 }}>
            {error}
          </Typography>
        )}

        {/* Interactions */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", mt: 1.5, pt: 1, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={toggleLike}
              aria-label="like tweet"
              color={isLiked ? "error" : "default"}
            >
              {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>
            <Button size="small" onClick={() => setOpenList("likes")} sx={{ minWidth: "auto" }}>
              {fmtNum(likesCount)}
            </Button>
          </Stack>

          <Stack direction="row" sx={{ alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={toggleDislike}
              aria-label="dislike tweet"
              color={isDisliked ? "warning" : "default"}
            >
              {isDisliked ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOffAltIcon fontSize="small" />}
            </IconButton>
            <Button size="small" onClick={() => setOpenList("dislikes")} sx={{ minWidth: "auto" }}>
              {fmtNum(dislikesCount)}
            </Button>
          </Stack>

          <Stack direction="row" sx={{ alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={toggleRepost}
              aria-label="repost tweet"
              color={isReposted ? "success" : "default"}
            >
              <RepeatIcon fontSize="small" />
            </IconButton>
            <Button size="small" onClick={() => setOpenList("reposts")} sx={{ minWidth: "auto" }}>
              {fmtNum(repostsCount)}
            </Button>
          </Stack>
        </Stack>
      </CardContent>

      {openList && (
        <TweetReactorsList
          open={!!openList}
          onClose={() => setOpenList(null)}
          title={listConfig[openList].title}
          tweetId={tweet._id}
          fetchFn={listConfig[openList].fetchFn}
          type={openList}
        />
      )}
    </Card>
  );
}