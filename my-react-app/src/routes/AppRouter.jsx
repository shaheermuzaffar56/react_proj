// src/routes/AppRouter.jsx
import { Routes, Route,} from "react-router-dom";
import { Suspense, lazy } from "react";
import { ROUTES } from "../constants/routes";
import MainLayout from "../components/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// Lazy-loaded — only fetched when their route is visited
const TweetDetailPreview = lazy(() => import("../pages/TweetDetailPreview"));

// Temporary placeholders — replaced in later steps
const Home = () => <div>Home / Feed placeholder</div>;
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const MyTweets = lazy(() => import("../features/tweets/pages/MyTweetsPage"));
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

        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;