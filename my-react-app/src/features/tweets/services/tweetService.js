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

// GET /tweet/getAllTweets — public, paginated, filterable
// params: { page, limit, status, author, search, sortBy }
export const getAllTweets = (params = {}) => {
  return api.get("/tweet/getAllTweets", { params });
};

// POST /tweet/likeTweet/:id — toggles like; also clears dislike if present
export const likeTweet = (id) => api.post(`/tweet/likeTweet/${id}`);

// POST /tweet/dislikeTweet/:id — toggles dislike; also clears like if present
export const dislikeTweet = (id) => api.post(`/tweet/dislikeTweet/${id}`);

// POST /tweet/repostTweet/:id — toggles repost
export const repostTweet = (id) => api.post(`/tweet/repostTweet/${id}`);

// GET /tweet/:id/likes — public, paginated (consumed via infinite scroll per Rules.md)
export const getTweetLikes = (id, params = {}) => api.get(`/tweet/${id}/likes`, { params });

// GET /tweet/:id/dislikes — public, paginated (infinite scroll)
export const getTweetDislikes = (id, params = {}) => api.get(`/tweet/${id}/dislikes`, { params });

// GET /tweet/:id/reposts — public, paginated (infinite scroll)
export const getTweetReposts = (id, params = {}) => api.get(`/tweet/${id}/reposts`, { params });