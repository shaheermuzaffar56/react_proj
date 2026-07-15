// src/components/MainLayout.jsx
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <nav>CloudLearner — Nav placeholder</nav>
      </header>

      <main>
        {/* Whichever child route matches the current URL renders here */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;