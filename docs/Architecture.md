# Architecture.md

## 1. App Flow (Data Flow)

```
Page component (e.g. FeedPage)
      │
      ▼
Feature component (e.g. TweetList, TweetCard)
      │
      ▼
Custom hook (e.g. useTweets) — thin wrapper around TanStack Query;
      │                        adapts the generic cache shape into the
      │                        field names the component already expects
      ▼
TanStack Query cache (QueryClient, from lib/QueryProvider.jsx)
      │  — useQuery / useMutation / useInfiniteQuery
      │  — query keys from constants/queryKeys.js (authKeys, tweetKeys)
      │  — on cache miss / mutation call, runs queryFn / mutationFn below
      ▼
Feature service (e.g. tweetService.js) — pure API call functions, unchanged
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
Back up through service → QueryClient cache → hook
      │
      ├─ success → QueryClient updates cache → hook's useQuery/useMutation
      │             re-renders with new data → component re-renders
      │
      └─ error → QueryCache/MutationCache's centralized `onError`
                  (wired in lib/queryClient.js) calls
                  useErrorToast().showError(err, meta.errorTitle)
                  → ErrorToastStack (mounted in App.jsx) shows a
                    global toast, automatically, for any failed
                    query/mutation — hooks no longer call showError()
                    themselves. Hooks that also need an inline error
                    message (e.g. useTweetInteractions) still set their
                    own local `error` state separately in onError.
```

**Rule enforced by this flow:** components never call Axios directly, and — since the TanStack Query migration (retrofit before Phase 9) — hooks never call Axios/services directly for reads either; they go through `useQuery`/`useInfiniteQuery`/`useMutation`, which call services under the hood. Components → hooks → TanStack Query → services → shared Axios instance. This means Step 11 (state management) only touches the hook layer if we introduce Redux/Zustand for _client_ state — TanStack Query already owns _server_ state, so components and services stay untouched. Every query/mutation gets its error-toast side effect for free via the centralized `QueryCache`/`MutationCache`; see `Rules.md`'s "Global Error Notifications" section for the `meta.errorTitle` / `meta.skipGlobalErrorToast` controls.

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
├── lib/                         → TanStack Query infrastructure (added in the pre-Phase-9 retrofit)
│   ├── queryClient.js           → createQueryClient(showError) factory — QueryCache/MutationCache
│   │                               with centralized onError, default retry: 1 (Axios interceptor
│   │                               already retries 401s once, so this avoids stacking retries)
│   └── QueryProvider.jsx        → builds the QueryClient via useMemo (must be inside a component,
│                                   not module scope, so it can call useErrorToast()); also mounts
│                                   ReactQueryDevtools
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
│   │   │           useReactorsList.js   → all rebuilt on TanStack Query;
│   │   │           useTweetFeed.js/useReactorsList.js are thin wrappers around
│   │   │           the shared hooks/useInfiniteListQuery.js
│   │   ├── pages/MyTweetsPage.jsx, FeedPage.jsx
│   │   ├── services/tweetService.js   → unchanged by the migration, pure Axios calls
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
├── context/                    → AuthContext (Phase 5, rebuilt on useQuery/useMutation in the
│                                   TanStack retrofit), ErrorToastContext (undocumented
│                                   addition — see Memory.md)
├── hooks/                      → cross-feature hooks: useErrorToast.js, and
│                                   useInfiniteListQuery.js (generic useInfiniteQuery wrapper —
│                                   flattens paginated responses, shared by useTweetFeed.js and
│                                   useReactorsList.js so the pagination logic isn't duplicated)
├── routes/                     → AppRouter.jsx, ProtectedRoute.jsx
├── utils/                      → tokenStorage.js
├── constants/                  → routes.js (ROUTES + buildPath()), queryKeys.js (authKeys,
│                                   tweetKeys factory functions — see Rules.md's "Query keys" rule)
├── pages/                      → non-feature-specific pages (e.g. TweetDetailPreview)
├── assets/
└── App.jsx
```

---

## 3. Tech Stack

| Layer                  | Choice                                                                      | Notes                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build tool             | Vite                                                                        | React 19 template                                                                                                                                                                                                                                                                                                     |
| Framework              | React 19                                                                    | Functional components + hooks only                                                                                                                                                                                                                                                                                    |
| Routing                | React Router DOM v7                                                         | Nested routes, lazy loading, protected routes                                                                                                                                                                                                                                                                         |
| HTTP client            | Axios                                                                       | Interceptor-based auth + auto token refresh                                                                                                                                                                                                                                                                           |
| Server state / caching | `@tanstack/react-query` v5 (adopted ahead of schedule, originally Phase 12) | `useQuery`/`useMutation`/`useInfiniteQuery` own all server-derived data; QueryClient built via `lib/QueryProvider.jsx`, not module scope — see Rules.md                                                                                                                                                               |
| Forms                  | React Hook Form                                                             | All form state                                                                                                                                                                                                                                                                                                        |
| Validation             | Zod + @hookform/resolvers                                                   | Schema-based validation bridged into RHF                                                                                                                                                                                                                                                                              |
| UI library             | MUI (@mui/material, @emotion/react, @emotion/styled, @mui/icons-material)   | Primary UI kit                                                                                                                                                                                                                                                                                                        |
| State management       | Context API (current)                                                       | Covers client/UI state (auth session shape, error toasts). Redux Toolkit / Zustand only if Context proves insufficient for _client_ state — decision deferred to Step 11. Not a fallback for server state — that's TanStack Query's job now.                                                                          |
| Token storage          | localStorage (via tokenStorage.js utility)                                  | Centralized, not scattered `localStorage.getItem` calls                                                                                                                                                                                                                                                               |
| Error notifications    | Context API (`ErrorToastContext`) + `useErrorToast()` hook                  | Global toast layer. Since the TanStack Query migration, the toast fires automatically via a centralized `QueryCache`/`MutationCache` `onError` (see `lib/queryClient.js`) — individual hooks no longer call `showError()` themselves. Local per-hook `error` state (for inline UI) is still hook-owned — see Rules.md |
