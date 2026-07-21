# Architecture.md

## 1. App Flow (Data Flow)

```
Page component (e.g. FeedPage)
      │
      ▼
Feature component (e.g. TweetList, TweetCard)
      │
      ▼
Custom hook (e.g. useTweets) — owns loading/error/data state
      │
      ▼
Feature service (e.g. tweetService.js) — pure API call functions
      │
      ▼
Shared Axios instance (api/axios.js)
      │
      ├─ Request interceptor → attaches Bearer access token from tokenStorage
      │
      ▼
Backend: https://cloudlearner.duckdns.org:1124/api/v1
      │
      ▼
Response interceptor → on 401: calls /user/refreshToken once,
                        stores new tokens, retries original request.
                        If refresh also fails → clears tokens, request rejected.
      │
      ▼
Back up through service → hook
      │
      ├─ success → hook updates local state → component re-renders
      │
      └─ error → hook sets local `error` state AND calls
                  useErrorToast().showError(err, title)
                  → ErrorToastStack (mounted in App.jsx) shows a
                    global toast, independent of which component
                    triggered the request
```

**Rule enforced by this flow:** components never call Axios directly. They call hooks; hooks call services; services call the shared instance. This means Step 11 (state management) only touches the hook layer if we introduce Redux/Zustand — components and services stay untouched. As of Phase 7/8, every hook also has a required error-toast side effect on failure — see `Rules.md`.

### Routing flow

```
App.jsx → AppRouter.jsx
             │
             ├─ MainLayout (Outlet wrapper — header/nav persist across pages)
             │     ├─ / and /feed → FeedPage (public tweet feed, infinite scroll)
             │     ├─ /tweets/:id (public, lazy-loaded)
             │     └─ ProtectedRoute (checks token via tokenStorage)
             │           ├─ /tweets/mine
             │           └─ /profile
             │
             ├─ /login (public, outside MainLayout)
             ├─ /register (public, outside MainLayout)
             └─ * → NotFound
```

Role-based route _gating_ (user/moderator/admin) is **still not implemented at the route level** — `ProtectedRoute` only checks token presence. However, `Sidebar.jsx` now does role-aware **UI hiding**: the "Moderation" nav link only renders when `user.role` is `moderator` or `admin`. This is cosmetic only — it hides the link, it doesn't protect the route — so a user who knows the URL isn't blocked yet. Full route-level role checks are still planned for whichever phase first needs them (Moderation, Phase 10).

---

## 2. Final Folder Structure

```
src/
├── api/
│   └── axios.js              → shared instance, request/response interceptors, token refresh
│
├── features/
│   ├── auth/
│   │   ├── hooks/useAuth.js
│   │   ├── pages/LoginPage.jsx, RegisterPage.jsx
│   │   ├── services/authService.js
│   │   └── index.js            → barrel export
│   ├── tweets/
│   │   ├── components/TweetCard.jsx, TweetList.jsx, TweetForm.jsx,
│   │   │                DeleteTweetDialog.jsx, TweetReactorsList.jsx
│   │   ├── hooks/useTweets.js, useTweetFeed.js, useTweetInteractions.js,
│   │   │           useReactorsList.js
│   │   ├── pages/MyTweetsPage.jsx, FeedPage.jsx
│   │   ├── services/tweetService.js
│   │   └── index.js
│   ├── users/
│   │   ├── services/userService.js   → still empty, deferred to Phase 9
│   │   └── index.js
│   └── moderation/
│       ├── services/moderationService.js   → still empty, deferred to Phase 10
│       └── index.js
│
├── components/                 → shared/reusable UI: MainLayout, Sidebar (role-aware nav),
│                                   TopBar, ErrorToastStack
├── context/                    → AuthContext (Phase 5), ErrorToastContext (undocumented
│                                   addition — see Memory.md)
├── hooks/                      → cross-feature hooks, e.g. useErrorToast.js
├── routes/                     → AppRouter.jsx, ProtectedRoute.jsx
├── utils/                      → tokenStorage.js
├── constants/                  → routes.js (ROUTES + buildPath(); more constants planned: roles, tweet statuses)
├── pages/                      → non-feature-specific pages (e.g. TweetDetailPreview)
├── assets/
└── App.jsx
```

---

## 3. Tech Stack

| Layer               | Choice                                                                    | Notes                                                                                      |
| ------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Build tool          | Vite                                                                      | React 19 template                                                                          |
| Framework           | React 19                                                                  | Functional components + hooks only                                                         |
| Routing             | React Router DOM v7                                                       | Nested routes, lazy loading, protected routes                                              |
| HTTP client         | Axios                                                                     | Interceptor-based auth + auto token refresh                                                |
| Forms               | React Hook Form                                                           | All form state                                                                             |
| Validation          | Zod + @hookform/resolvers                                                 | Schema-based validation bridged into RHF                                                   |
| UI library          | MUI (@mui/material, @emotion/react, @emotion/styled, @mui/icons-material) | Primary UI kit                                                                             |
| State management    | Context API (current)                                                     | Redux Toolkit / Zustand only if Context proves insufficient — decision deferred to Step 11 |
| Token storage       | localStorage (via tokenStorage.js utility)                                | Centralized, not scattered `localStorage.getItem` calls                                    |
| Error notifications | Context API (`ErrorToastContext`) + `useErrorToast()` hook                | Global toast layer, separate from per-hook local `error` state — see Rules.md              |
