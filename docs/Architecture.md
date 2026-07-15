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
Back up through service → hook → component → rendered UI
```

**Rule enforced by this flow:** components never call Axios directly. They call hooks; hooks call services; services call the shared instance. This means Step 11 (state management) only touches the hook layer if we introduce Redux/Zustand — components and services stay untouched.

### Routing flow

```
App.jsx → AppRouter.jsx
             │
             ├─ MainLayout (Outlet wrapper — header/nav persist across pages)
             │     ├─ Home (public)
             │     ├─ /tweets/:id (public, lazy-loaded)
             │     └─ ProtectedRoute (checks token via tokenStorage)
             │           ├─ /tweets/mine
             │           └─ /profile
             │
             ├─ /login (public, outside MainLayout)
             ├─ /register (public, outside MainLayout)
             └─ * → NotFound
```

Role-based route gating (user/moderator/admin) is **not yet implemented** — current `ProtectedRoute` only checks token presence. Role checks are planned for Step 5 once `AuthContext` exists.

---

## 2. Final Folder Structure

```
src/
├── api/
│   └── axios.js              → shared instance, request/response interceptors, token refresh
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/authService.js
│   │   └── index.js            → barrel export
│   ├── tweets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/tweetService.js
│   │   └── index.js
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/userService.js
│   │   └── index.js
│   └── moderation/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/moderationService.js
│       └── index.js
│
├── components/                 → shared/reusable UI (MainLayout, buttons, etc.)
├── context/                    → AuthContext (planned, Step 5)
├── routes/                     → AppRouter.jsx, ProtectedRoute.jsx
├── utils/                      → tokenStorage.js
├── constants/                  → routes.js (more constants planned: roles, tweet statuses)
├── pages/                      → non-feature-specific pages (e.g. TweetDetailPreview)
├── assets/
└── App.jsx
```

---

## 3. Tech Stack

| Layer            | Choice                                                                    | Notes                                                                                      |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Build tool       | Vite                                                                      | React 19 template                                                                          |
| Framework        | React 19                                                                  | Functional components + hooks only                                                         |
| Routing          | React Router DOM v7                                                       | Nested routes, lazy loading, protected routes                                              |
| HTTP client      | Axios                                                                     | Interceptor-based auth + auto token refresh                                                |
| Forms            | React Hook Form                                                           | All form state                                                                             |
| Validation       | Zod + @hookform/resolvers                                                 | Schema-based validation bridged into RHF                                                   |
| UI library       | MUI (@mui/material, @emotion/react, @emotion/styled, @mui/icons-material) | Primary UI kit                                                                             |
| State management | Context API (current)                                                     | Redux Toolkit / Zustand only if Context proves insufficient — decision deferred to Step 11 |
| Token storage    | localStorage (via tokenStorage.js utility)                                | Centralized, not scattered `localStorage.getItem` calls                                    |
