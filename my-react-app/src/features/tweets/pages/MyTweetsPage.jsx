// src/features/tweets/pages/MyTweetsPage.jsx
import { useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTweets } from "../hooks/useTweets";
import TweetList from "../components/TweetList";
import TweetForm from "../components/TweetForm";
import DeleteTweetDialog from "../components/DeleteTweetDialog";

export default function MyTweetsPage() {
  const { tweets, isLoading, error, create, update, remove } = useTweets();

  // Create/Edit dialog state — null editingTweet = create mode, tweet object = edit mode
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);

  // Delete dialog state
  const [deletingTweet, setDeletingTweet] = useState(null);

  const openCreateForm = () => {
    setEditingTweet(null);
    setIsFormOpen(true);
  };

  const openEditForm = (tweet) => {
    setEditingTweet(tweet);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTweet(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">My Tweets</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateForm}>
          New Tweet
        </Button>
      </Box>

      <TweetList
        tweets={tweets}
        isLoading={isLoading}
        error={error}
        onEdit={openEditForm}
        onDelete={(id) => setDeletingTweet(tweets.find((t) => t._id === id))}
      />

      <Dialog open={isFormOpen} onClose={closeForm} fullWidth maxWidth="sm">
        <DialogTitle>{editingTweet ? "Edit Tweet" : "New Tweet"}</DialogTitle>
        <DialogContent>
          <TweetForm
            tweet={editingTweet}
            onSubmit={editingTweet ? update : create}
            onDone={closeForm}
          />
        </DialogContent>
      </Dialog>

      <DeleteTweetDialog
        open={!!deletingTweet}
        tweet={deletingTweet}
        onClose={() => setDeletingTweet(null)}
        onConfirm={remove}
      />
    </Box>
  );
}   