// src/features/moderation/services/moderationService.js
import api from "../../../api/axios";

// GET /tweet/moderate — Admin/Moderator only
// params: { page, limit, status, search, sortBy } (see Rules.md — consumed via infinite scroll, no page-number UI)
export const getModerationTweets = (params = {}) => {
  return api.get("/tweet/moderate", { params });
};

// PATCH /tweet/updateTweetStatus/:id — Admin/Moderator only
// body: { status } e.g. "approved" | "rejected" | "published"
export const updateTweetStatus = (id, status) => {
  return api.patch(`/tweet/updateTweetStatus/${id}`, { status });
};

// GET /user/moderate — Admin/Moderator only
// params: { page, limit, role, isDisabled, search } (infinite scroll, same convention as above)
export const getModerationUsers = (params = {}) => {
  return api.get("/user/moderate", { params });
};

// PATCH /user/updateUser/:id — Admin/Moderator only
// Distinct from userService.js's no-id `updateUser` (self-update). This one targets
// another user's role and/or isDisabled flag. body shape TBD against live Swagger
// when Step 4's hook is built — likely { role } and/or { isDisabled }.
export const updateUserModeration = (id, data) => {
  return api.patch(`/user/updateUser/${id}`, data);
};

// DELETE /user/deleteUser/:id — Admin only
// Distinct from userService.js's no-id `deleteUser` (self-delete).
export const deleteUserByAdmin = (id) => {
  return api.delete(`/user/deleteUser/${id}`);
};