// src/components/MainLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROUTES } from "../constants/routes";

function MainLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between" }}>
        <nav>CloudLearner — Nav placeholder</nav>
        {isAuthenticated && <Button onClick={handleLogout}>Logout</Button>}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;