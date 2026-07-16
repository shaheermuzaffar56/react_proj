// src/features/tweets/services/tweetService.js
import api from "../../../api/axios";

// POST /tweet/createTweet — multipart/form-data (title, description, status, tags, image, isSensitive)
export const createTweet = (formData) => {
  return api.post("/tweet/createTweet", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// GET /tweet/getMyTweets — authenticated user's own tweets, paginated
// params: { page, limit, status, sortBy }
export const getMyTweets = (params = {}) => {
  return api.get("/tweet/getMyTweets", { params });
};

// PATCH /tweet/updateTweet/:id
// Pass a FormData instance if the image is changing, otherwise a plain object is fine —
// Axios will set the correct Content-Type automatically based on what you pass in.
export const updateTweet = (id, data) => {
  return api.patch(`/tweet/updateTweet/${id}`, data);
};

// DELETE /tweet/deleteTweet/:id
export const deleteTweet = (id) => {
  return api.delete(`/tweet/deleteTweet/${id}`);
};