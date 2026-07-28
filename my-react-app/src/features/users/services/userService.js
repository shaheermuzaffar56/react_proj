// src/features/users/services/userService.js
import api from "../../../api/axios";

// PATCH /user/updateUser — JSON { email, fullName }
// Response: { data: { userData: <User> } }
// Note: some accounts return 403 "This account is protected and cannot be modified" —
// no special-case handling needed, flows through normal error extraction.
export const updateUser = (data) => {
  return api.patch("/user/updateUser", data);
};

// PATCH /user/updateAvatar — multipart/form-data, field name "avatar" (webp only)
// Response: { data: { userData: <User> } }
export const updateAvatar = (formData) => {
  return api.patch("/user/updateAvatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// PATCH /user/updateCover — multipart/form-data, field name "coverImage" (webp only)
// Response: { data: { userData: <User> } }
export const updateCover = (formData) => {
  return api.patch("/user/updateCover", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// GET /user/{id}
// Response: { data: <User> } — data IS the user object directly, NOT nested under userData
export const getUserById = (id) => {
  return api.get(`/user/${id}`);
};

// GET /user/allUsers — params: { page, limit, sort, role, isDisabled }. No "search" param.
// Response: { data: { users: [...], pagination: { page, limit, totalPages, totalResults, hasNextPage, hasPrevPage } } }
export const getAllUsers = (params = {}) => {
  return api.get("/user/allUsers", { params });
};

// DELETE /user/deleteUser — no body
// Response: { data: {}, message: "User deleted successfully", success: true }
export const deleteUser = () => {
  return api.delete("/user/deleteUser");
};