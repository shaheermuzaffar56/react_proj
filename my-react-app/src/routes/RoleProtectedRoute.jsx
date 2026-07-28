// src/routes/RoleProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROUTES } from "../constants/routes";

// Same auth-check pattern as ProtectedRoute.jsx, plus a role check.
// `allowedRoles` mirrors NAV_ITEMS' `roles` array convention (Sidebar.jsx line 29).
function RoleProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Logged in, but wrong role — send to a route they *can* access rather than a dead end.
    return <Navigate to={ROUTES.FEED} replace />;
  }

  return <Outlet />;
}

export default RoleProtectedRoute;