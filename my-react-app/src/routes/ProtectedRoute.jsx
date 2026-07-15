// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/tokenStorage";
import { ROUTES } from "../constants/routes";

function ProtectedRoute() {
  const token = getAccessToken();

  // Token presence only — real validity is enforced by the axios 401
  // interceptor from Step 3. Role checks come in Step 5 once AuthContext exists.
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;