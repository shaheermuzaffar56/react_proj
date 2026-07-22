// src/features/tweets/components/TweetCard.jsx
import { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Chip, Stack, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import RepeatIcon from "@mui/icons-material/Repeat";
import { useTweetInteractions } from "../hooks/useTweetInteractions";
import TweetReactorsList from "./TweetReactorsList";
import { getTweetLikes, getTweetDislikes, getTweetReposts } from "../services/tweetService";

export default function TweetCard({ tweet, onEdit, onDelete }) {
  const { title, description, image, status, tags = [] } = tweet;
  const {
    isLiked, isDisliked, isReposted,
    likesCount, dislikesCount, repostsCount,
    error, toggleLike, toggleDislike, toggleRepost,
  } = useTweetInteractions(tweet);

  // Which reactors dialog (if any) is currently open — null, "likes", "dislikes", or "reposts"
  const [openList, setOpenList] = useState(null);

  const listConfig = {
    likes: { title: "Liked by", fetchFn: getTweetLikes },
    dislikes: { title: "Disliked by", fetchFn: getTweetDislikes },
    reposts: { title: "Reposted by", fetchFn: getTweetReposts },
  };

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

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>

        {error && <Typography color="error" variant="caption">{error}</Typography>}

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Stack direction="row" alignItems="center">
            <IconButton size="small" onClick={toggleLike} aria-label="like tweet">
              {isLiked ? <ThumbUpIcon fontSize="small" color="primary" /> : <ThumbUpOffAltIcon fontSize="small" />}
            </IconButton>
            <Button size="small" onClick={() => setOpenList("likes")} sx={{ minWidth: "auto" }}>
              {likesCount}
            </Button>
          </Stack>

          <Stack direction="row" alignItems="center">
            <IconButton size="small" onClick={toggleDislike} aria-label="dislike tweet">
              {isDisliked ? <ThumbDownIcon fontSize="small" color="error" /> : <ThumbDownOffAltIcon fontSize="small" />}
            </IconButton>
            <Button size="small" onClick={() => setOpenList("dislikes")} sx={{ minWidth: "auto" }}>
              {dislikesCount}
            </Button>
          </Stack>

          <Stack direction="row" alignItems="center">
            <IconButton size="small" onClick={toggleRepost} aria-label="repost tweet">
              <RepeatIcon fontSize="small" color={isReposted ? "success" : "inherit"} />
            </IconButton>
            <Button size="small" onClick={() => setOpenList("reposts")} sx={{ minWidth: "auto" }}>
              {repostsCount}
            </Button>
          </Stack>
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