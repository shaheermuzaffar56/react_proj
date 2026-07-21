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

### Lazy-Loaded Routes

Use `React.lazy()` together with `Suspense` for lazy-loaded pages, following the existing setup in `AppRouter.jsx`.

### File Uploads

Use `FormData` with the `multipart/form-data` content type for all file uploads (avatars, cover images, and tweet images), matching the Swagger API requirements. |

### Paginated Endpoints — Always Infinite Scroll

Every backend endpoint that returns a `pagination` object (`getAllTweets`, `getMyTweets`, `allUsers`, `/tweet/{id}/likes`, `/dislikes`, `/reposts`, `/tweet/moderate`, `/user/moderate`) must be consumed via **infinite scroll** on the frontend — accumulate results page-by-page as the user scrolls, using an `IntersectionObserver` sentinel (see `useTweetFeed.js` / `FeedPage.jsx` from Phase 7 as the reference pattern). **Never build page-number UI** (Prev/Next buttons, numbered page links) anywhere in this app, even though the backend's `page`/`limit` query params are used internally to drive it. This applies project-wide, not just to the public feed — decided explicitly in Session 6, confirmed to also apply to Phase 8's like/dislike/repost user lists and Phase 9's all-users listing.

### Global Error Notifications

Use `useErrorToast()` (from `hooks/useErrorToast.js`) for a global, top-of-screen toast whenever a request fails. Call `showError(err, title)` inside the hook's `catch` block, alongside setting local `error` state — see `useTweets.js`, `useTweetFeed.js`, `useTweetInteractions.js`, and `useReactorsList.js` for the reference pattern. `ErrorToastProvider` must wrap the app (already done in `main.jsx`) for this to work; components render `<ErrorToastStack />` once, at the top level (already done in `App.jsx`), not per-feature.

## 2. What to Avoid

- ❌ **Fetch API** — project standardized on Axios from Step 3 onward; don't mix the two.
- ❌ **Direct `localStorage` calls outside `tokenStorage.js`** — breaks the single source of truth for auth state.
- ❌ **Class components** — functional components + hooks only, per the learning roadmap.
- ❌ **Inline hardcoded API URLs** — always go through `api/axios.js`'s `baseURL`.
- ❌ **Building UI for excluded endpoints** — no comments, no subscribe/unsubscribe, no watch history, no channel page (see PRD.md §3).
- ❌ **Skipping Zod validation** on any form — even "simple" ones like login.
- ❌ **Prop drilling past 2 levels** — use Context (or feature-local state) instead once it gets awkward.
- ❌ **New state management libraries before Step 11** — Context is the default until that step's evaluation.
- ❌ **CSS-in-JS other than MUI's `sx`/`styled`** — don't introduce Tailwind, styled-components, etc. Stack is locked.
- ❌ **Setting local `error` state without also calling `showError()`** (or vice versa) in a data-fetching hook — the two are meant to work together (inline message + global toast), not as alternatives to each other.

## 3. Error Handling

### API errors

- All 401 responses are already handled globally by the response interceptor (auto-refresh + retry, one attempt only). Components should **not** manually catch 401 refresh logic.
- All other errors (400, 403, 404, 500) must be caught at the **hook level**, not swallowed silently in the service function. Hooks expose an `error` state that components render (e.g. a MUI `Alert`).
- Never show raw backend error objects to the user — extract `error.response?.data?.message` and display that, with a generic fallback string if it's missing.
- **Global error toasts:** every data-fetching/mutating hook must also call `useErrorToast().showError(err, title)` in its `catch` block, in addition to setting local `error` state. Local `error` state drives inline UI (e.g. an `Alert` where the request happened); `showError` drives the global toast stack (`ErrorToastStack`, mounted in `App.jsx`) for a visible top-of-screen notification regardless of which component triggered the request. Both are required, not either/or — see `useTweets.js`, `useTweetFeed.js`, `useTweetInteractions.js`, and `useReactorsList.js` for the reference pattern.

### Form validation errors

- Zod schema errors surface through RHF's `formState.errors` — display inline under each field using MUI's `error`/`helperText` props, not alert popups.

### Loading & empty states

- Every list-fetching hook must expose `isLoading`, `error`, and `data` (or equivalent) — components must handle all three states explicitly: loading spinner, error message, and empty-state message (e.g. "No tweets yet") separately from a true error.

### Protected route failures

- If `ProtectedRoute` finds no token, redirect to `/login` — never render a blank page or a raw error.
- Role-based access failures (once implemented in Step 5+) should redirect to a "Not authorized" state, not silently hide the page.
