# Rules.md

## 1. What to Use

### HTTP Requests

Use the shared `api` instance from `api/axios.js`. Never make raw `axios.get(...)`, `axios.post(...)`, or other Axios calls with hardcoded URLs.

### Forms

Use `react-hook-form` together with `zod` via `@hookform/resolvers` for every form in the application. No exceptions.

### UI Components

Use Material UI (MUI) components whenever possible. Only use plain HTML/CSS when MUI does not provide a suitable component.

### Routing

Use `react-router-dom` v7 with `<Routes>`, `<Route>`, `useNavigate`, and `useParams`.

### Token Storage

Use only the helper functions provided by `utils/tokenStorage.js`, such as `getAccessToken()`, `setTokens()`, and `clearTokens()`. Never access `localStorage` directly outside this utility.

### Route Paths

Use route constants from `constants/routes.js` (`ROUTES` and `buildPath()`). Never hardcode route strings inside components.

### Data Fetching

Each feature should have its own custom hook (for example, `useTweets` or `useAuth`). Components should never call service functions directly.

**Since the TanStack Query migration (retrofit before Phase 9):** feature hooks no longer manage `isLoading`/`error`/cached-data via `useState`/`useEffect`. They wrap `@tanstack/react-query`'s `useQuery`/`useMutation`/`useInfiniteQuery` instead, adapting the generic cache shape into whatever field names the consuming component already expects (e.g. `useTweetFeed` returns `{ tweets, isLoading, error, hasMore, loadMore }`, same names as before, backed by `useInfiniteQuery` internally). See `Architecture.md` for the updated data-flow diagram.

- **Query keys** live in `constants/queryKeys.js` as factory functions (`authKeys`, `tweetKeys`) — never write a query key as a bare inline array/string in a hook.
- **List/pagination hooks** that follow the infinite-scroll rule below should be built on the shared `hooks/useInfiniteListQuery.js` wrapper rather than calling `useInfiniteQuery` directly, so the pagination-flattening logic isn't duplicated per feature.
- **The `QueryClient` instance must never be created at module scope.** It's built inside `lib/QueryProvider.jsx` via `useMemo`, because its global error handler needs to call `useErrorToast()`, which only works inside a component. See `lib/queryClient.js` (the factory function) and `lib/QueryProvider.jsx` (the component that instantiates it).

### Lazy-Loaded Routes

Use `React.lazy()` together with `Suspense` for lazy-loaded pages, following the existing setup in `AppRouter.jsx`.

### File Uploads

Use `FormData` with the `multipart/form-data` content type for all file uploads (avatars, cover images, and tweet images), matching the Swagger API requirements. |

### Paginated Endpoints — Always Infinite Scroll

Every backend endpoint that returns a `pagination` object (`getAllTweets`, `getMyTweets`, `allUsers`, `/tweet/{id}/likes`, `/dislikes`, `/reposts`, `/tweet/moderate`, `/user/moderate`) must be consumed via **infinite scroll** on the frontend — accumulate results page-by-page as the user scrolls, using an `IntersectionObserver` sentinel (see `useTweetFeed.js` / `FeedPage.jsx` from Phase 7 as the reference pattern). **Never build page-number UI** (Prev/Next buttons, numbered page links) anywhere in this app, even though the backend's `page`/`limit` query params are used internally to drive it. This applies project-wide, not just to the public feed — decided explicitly in Session 6, confirmed to also apply to Phase 8's like/dislike/repost user lists and Phase 9's all-users listing.

### Global Error Notifications

**Since the TanStack Query migration, this is centralized — do not call `useErrorToast()` from inside a query/mutation hook to fire the global toast.** `lib/queryClient.js` wires a `QueryCache`/`MutationCache` `onError` callback (built with `useErrorToast()`'s `showError`, via the `lib/QueryProvider.jsx` wrapper) that fires automatically for every failed `useQuery`/`useMutation`/`useInfiniteQuery` in the app. To control the toast:

- Pass `meta: { errorTitle: "Couldn't do the thing" }` on the query/mutation to set the toast's title (falls back to `showError`'s default title if omitted).
- Pass `meta: { skipGlobalErrorToast: true }` to suppress the global toast entirely — used when a component already shows its own dedicated error UI for that action (e.g. `AuthContext`'s login mutation, since `LoginPage.jsx` already renders its own inline `Alert` + calls `showError` itself; doubling up would show two toasts for one failure).

`ErrorToastProvider` must still wrap the app above `QueryProvider` (already done in `main.jsx` — see `Architecture.md`'s provider order) for this to work; components render `<ErrorToastStack />` once, at the top level (already done in `App.jsx`), not per-feature.

**Local inline `error` state is still hook-owned, not automatic.** A hook that needs to render an inline error message (e.g. `useTweetInteractions`'s rollback message on a `TweetCard`) still sets its own `error` state in the mutation's `onError` callback — TanStack Query doesn't do this for you. The global toast and the local inline message are two separate things that both still need to be wired, same as before; only the _toast-firing_ part is now automatic.

## 2. What to Avoid

- ❌ **Fetch API** — project standardized on Axios from Step 3 onward; don't mix the two.
- ❌ **Direct `localStorage` calls outside `tokenStorage.js`** — breaks the single source of truth for auth state.
- ❌ **Class components** — functional components + hooks only, per the learning roadmap.
- ❌ **Inline hardcoded API URLs** — always go through `api/axios.js`'s `baseURL`.
- ❌ **Building UI for excluded endpoints** — no comments, no subscribe/unsubscribe, no watch history, no channel page (see PRD.md §3).
- ❌ **Skipping Zod validation** on any form — even "simple" ones like login.
- ❌ **Prop drilling past 2 levels** — use Context (or feature-local state) instead once it gets awkward.
- ❌ **New _client-state_ management libraries before Step 11** — Context remains the default for auth/UI state until that step's evaluation. `@tanstack/react-query` is not an exception to watch out for going forward — it was deliberately adopted ahead of schedule (originally slated for Phase 12) specifically because it's _server_-state (caching/syncing API data), a different concern from client state like Redux/Zustand would address. Don't read its early adoption as license to also pull in Redux/Zustand early.
- ❌ **CSS-in-JS other than MUI's `sx`/`styled`** — don't introduce Tailwind, styled-components, etc. Stack is locked.
- ❌ **Calling `useErrorToast().showError()` directly from inside a `useQuery`/`useMutation`/`useInfiniteQuery` hook** — this is now handled automatically by the global `QueryCache`/`MutationCache` `onError` (see "Global Error Notifications" above). Manually calling `showError()` on top of that would double-fire the toast. Local inline `error` state is still hook-owned and still required per "Loading & empty states" below — only the _global toast_ part moved out of the hook.

## 3. Error Handling

### API errors

- All 401 responses are already handled globally by the response interceptor (auto-refresh + retry, one attempt only). Components should **not** manually catch 401 refresh logic.
- All other errors (400, 403, 404, 500) must be caught at the **hook level**, not swallowed silently in the service function. Hooks expose an `error` state that components render (e.g. a MUI `Alert`).
- Never show raw backend error objects to the user — extract `error.response?.data?.message` and display that, with a generic fallback string if it's missing.
- **Global error toasts:** for anything built on `useQuery`/`useMutation`/`useInfiniteQuery`, the toast fires automatically via the centralized `QueryCache`/`MutationCache` `onError` — see "Global Error Notifications" above. Set `meta: { errorTitle: "..." }` for a custom title, or `meta: { skipGlobalErrorToast: true }` if the calling component already shows its own error UI. Local `error` state (for inline `Alert`s where the request happened) is still hook-owned and still required — the hook sets it in the relevant `onError` callback, same responsibility as before, just without also calling `showError()` itself.

### Known gaps (flagged, not yet resolved)

- **`useTweets.js`'s list fetch (`getMyTweets`) does not use infinite scroll**, despite the rule above listing `getMyTweets` as one of the endpoints that must. This predates the TanStack Query migration and was carried over as-is (the migration preserved existing behavior rather than expanding scope) — flagged here so it isn't lost, pending a decision on whether to bring it in line with the rule.
- **`useTweetInteractions.js`'s like/dislike/repost state is local to each `TweetCard` instance**, not synced through the query cache. The same tweet appearing in both the public feed and "My Tweets" can show independently-stale reaction counts until each is individually refetched. This was true before the migration too; the migration preserved the existing local-state behavior rather than introducing cross-list cache synchronization, which would be a larger, deliberate change.

### Form validation errors

- Zod schema errors surface through RHF's `formState.errors` — display inline under each field using MUI's `error`/`helperText` props, not alert popups.

### Loading & empty states

- Every list-fetching hook must expose `isLoading`, `error`, and `data` (or equivalent) — components must handle all three states explicitly: loading spinner, error message, and empty-state message (e.g. "No tweets yet") separately from a true error.

### Protected route failures

- If `ProtectedRoute` finds no token, redirect to `/login` — never render a blank page or a raw error.
- Role-based access failures (once implemented in Step 5+) should redirect to a "Not authorized" state, not silently hide the page.
