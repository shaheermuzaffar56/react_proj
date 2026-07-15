# Phases

## Phase 1 – File & Folder Structure

Build the feature-based project structure. Create folders such as `api/`, `features/` (auth, tweets, users, moderation), `components/`, `context/`, `routes/`, `utils/`, and `constants/`.

---

## Phase 2 – Core Dependencies

Install all required packages including Axios, React Router DOM, React Hook Form, Zod, @hookform/resolvers, Material UI, Emotion, and Material UI Icons.

---

## Phase 3 – API Layer

Create a shared Axios instance with the project's base URL. Configure request interceptors to automatically attach the access token, response interceptors to refresh expired tokens on 401 responses and retry failed requests, and build a centralized token storage utility.

---

## Phase 4 – Routing

Set up React Router with AppRouter, MainLayout, ProtectedRoute for authentication, route constants, lazy-loaded routes (such as Tweet Details), and placeholder pages for Home, Login, Register, My Tweets, and Profile.

---

## Phase 5 – Authentication

Implement AuthContext to manage global authentication state, user information, roles, and sessions. Connect Login, Register, and Logout pages to the authentication API and upgrade ProtectedRoute to perform real session and role validation.

---

## Phase 6 – Tweet CRUD (My Tweets)

Build complete Create, Read, Update, and Delete functionality for the user's own tweets. Use React Hook Form with Zod validation, support image uploads, create reusable TweetCard and TweetList components, and display tweets using the getMyTweets API.

---

## Phase 7 – Public Tweet Feed

Reuse the TweetCard and TweetList components from Phase 6 for the public feed using the getAllTweets API. Add pagination, searching, filtering by status or author, and sorting.

---

## Phase 8 – Like / Dislike / Repost

Implement Like, Dislike, and Repost functionality with optimistic UI updates. Also display lists of users who liked, disliked, or reposted each tweet.

---

## Phase 9 – User Profile

Allow users to view and edit their own profiles, upload profile and cover images, view other users by ID, browse all users, and delete their own accounts.

---

## Phase 10 – Moderation

Build an admin/moderator dashboard with role-based access. Include tweet moderation (approve, reject, publish), user management (change roles and enable/disable accounts), and admin-only user deletion.

---

## Phase 11 – State Management

Evaluate whether React Context is sufficient for global state management. Introduce Redux Toolkit or Zustand only if genuine cross-page synchronization issues arise.

---

## Phase 12 – Performance Optimization

Optimize the application using React.memo, useMemo, and useCallback where appropriate. Implement code splitting with React.lazy and Suspense, and consider TanStack Query for API caching and server state management.

---

## Phase 13 – Final Polish

Complete the project by adding Error Boundaries, consistent loading, empty, and error states across the application, cleaning up ESLint warnings, and reviewing the architecture to ensure it follows the rules defined in Rules.md.
