// src/features/auth/services/authService.js
import api from "../../../api/axios";

// POST /user/register — multipart/form-data (avatar required, coverImage optional)
export const registerUser = (formData) => {
  return api.post("/user/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// POST /user/login — plain JSON, accepts email or userName
export const loginUser = ({ email, userName, password }) => {
  return api.post("/user/login", { email, userName, password });
};

// GET /user/logout — no body, relies on Authorization header
export const logoutUser = () => {
  return api.get("/user/logout");
};

// POST /user/updatePassword — plain JSON
export const updatePassword = ({ password, newPassword }) => {
  return api.post("/user/updatePassword", { password, newPassword });
};

// GET /user/me — fetches current user's profile
export const getCurrentUser = () => {
  return api.get("/user/me");
};