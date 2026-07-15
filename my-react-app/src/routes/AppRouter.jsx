// src/routes/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ROUTES } from "../constants/routes";
import MainLayout from "../components/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// Lazy-loaded — only fetched when their route is visited
const TweetDetailPreview = lazy(() => import("../pages/TweetDetailPreview"));

// Temporary placeholders — replaced in later steps
const Home = () => <div>Home / Feed placeholder</div>;
const Login = () => <div>Login placeholder</div>;
const Register = () => <div>Register placeholder</div>;
const MyTweets = () => <div>My Tweets placeholder (protected)</div>;
const Profile = () => <div>Profile placeholder (protected)</div>;
const NotFound = () => <div>404 — Page not found</div>;

function AppRouter() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />

          {/* Route param example — reads :id via useParams() */}
          <Route path={ROUTES.TWEET_DETAIL} element={<TweetDetailPreview />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.MY_TWEETS} element={<MyTweets />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
          </Route>
        </Route>

        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;