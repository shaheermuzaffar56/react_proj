# Memory.md

> Living document. Update this at the end of every phase — don't let it drift from the real repo state. When in doubt, verify against the actual GitHub repo rather than trusting checkboxes in Notion or elsewhere.

---

## Last Verified Against Repo

`shaheermuzaffar56/react_proj` — `my-react-app/` — verified by reading actual files, not just Notion status.

---

## 1. What Has Been Completed

### Phase 1 — File & Folder Structure ✅

Full feature-based skeleton created and confirmed via `tree` output: `api/`, `features/{auth,tweets,users,moderation}` (each with `components/`, `hooks/`, `pages/`, `services/`, `index.js`), `components/`, `context/`, `routes/`, `utils/`, `constants/`.

### Phase 2 — Core Dependencies ✅

Confirmed in `package.json`: `axios@1.18.1`, `react-router-dom@7.18.1`, `react-hook-form@7.81.0`, `zod@4.4.3`, `@hookform/resolvers@5.4.0`, `@mui/material@9.2.0`, `@emotion/react@11.14.0`, `@emotion/styled@11.14.1`, `@mui/icons-material@9.2.0`.

### Phase 3 — API Layer ✅ Complete

Phase 3 scope (per `Phases.md`) is the shared HTTP infrastructure only — not feature-specific service functions. Fully done and verified:

- `api/axios.js` — shared instance (default export `api`), `baseURL` set to `https://cloudlearner.duckdns.org:1124/api/v1`, request interceptor attaches Bearer token, response interceptor handles 401 → single refresh attempt via `/user/refreshToken` → retries original request → clears tokens and rejects if refresh fails. Includes pending-request queue to avoid duplicate refresh calls during concurrent 401s.
- `utils/tokenStorage.js` — `getAccessToken`, `getRefreshToken`, `setTokens`, `clearTokens`, all via `localStorage` with prefixed keys (`cloudlearner_access_token`, `cloudlearner_refresh_token`).

**Correctly out of scope for Phase 3 (not a gap):** `features/tweets/services/tweetService.js`, `features/users/services/userService.js`, `features/moderation/services/moderationService.js`, and their `index.js` barrels are still empty — expected, deferred to Phase 6–8 (tweets), Phase 9 (users), and Phase 10 (moderation) respectively. `features/auth/services/authService.js` was filled in Phase 5 — see below.

### Phase 4 — Routing ✅ Complete

Phase 4 scope is routing _mechanics_, not page content — page content belongs to Phase 5+ per `Phases.md`. All routing infrastructure is in place and working:

- `routes/AppRouter.jsx` — real routing tree using `Routes`/`Route`, wrapped in `Suspense`
- `routes/ProtectedRoute.jsx` — originally a token-presence check; **upgraded in Phase 5** to real auth-state checks (see below)
- `constants/routes.js` — `ROUTES` object + `buildPath()` helper for dynamic segments
- `components/MainLayout.jsx` — layout wrapper with `<Outlet />`; Logout button added in Phase 5
- `pages/TweetDetailPreview.jsx` — lazy-loaded, demonstrates `useParams()` reading `:id`
- Nested routes, layout routes, protected routes, and lazy routes are all demonstrated and functional

**Remaining placeholders (not a gap):** `Home`, `MyTweets`, `Profile` still render placeholder `<div>`s inline in `AppRouter.jsx`. `Login` and `Register` are now real pages (Phase 5). The rest become real in Phase 6/7/9.

### Phase 5 — Authentication ✅ Complete

- `features/auth/services/authService.js` — `registerUser`, `loginUser`, `logoutUser`, `updatePassword`, `getCurrentUser`, all via the shared `api` instance (no raw Axios, per `Rules.md`)
- `context/AuthContext.jsx` — `AuthProvider` holding `user`, `isAuthenticated`, `isLoading`; restores session on page load via `getCurrentUser()`; exposes `login()` / `logout()`
- `features/auth/hooks/useAuth.js` — the only sanctioned way for components to read auth state (throws clearly if used outside `AuthProvider`), per `Rules.md`'s "components never call Context/services directly" rule
- `features/auth/pages/LoginPage.jsx` — real RHF + Zod form, accepts email or username in one field, wired to `useAuth().login()`
- `features/auth/pages/RegisterPage.jsx` — real RHF + Zod form, multipart `FormData` upload for required `.webp` avatar + optional `.webp` cover image
- `routes/ProtectedRoute.jsx` — upgraded from token-presence-only check to real `isAuthenticated` / `isLoading` from `AuthContext`; handles the refresh-flash-redirect edge case (won't bounce a logged-in user to `/login` while session restore is still running)
- `components/MainLayout.jsx` — Logout button wired to `AuthContext.logout()`, shown only when `isAuthenticated`

**Known follow-up, not yet done:** role-based route gating (user/moderator/admin) — `ProtectedRoute` currently checks authentication only, not role. Deferred to whichever phase first needs it (Moderation, Phase 10).

**Styling note (verified, not a bug):** `App.css` / `index.css` ARE correctly imported. The "unstyled" look through Phases 4–5 is expected — `App.css` only targets leftover Vite-scaffold class names that nothing in this app uses. Real MUI theming is pending on `Design.md`'s palette confirmation, expected around Phase 6.

---

### Phase 6 — Tweet CRUD (My Tweets) ✅ Complete

- `features/tweets/services/tweetService.js` — `createTweet`, `getMyTweets`, `updateTweet`, `deleteTweet`, all via the shared `api` instance (no raw Axios, per `Rules.md`)
- `features/tweets/hooks/useTweets.js` — owns `tweets`, `isLoading`, `error` state; exposes `refetch`, `create`, `update`, `remove`; errors extracted via `error.response?.data?.message` with generic fallback, per `Rules.md`'s error-handling rule
- `features/tweets/components/TweetCard.jsx` / `TweetList.jsx` — reusable display components (built generic on purpose — reused as-is in Phase 7's public feed); `TweetList` handles all three required states explicitly (loading spinner, error `Alert`, empty-state message)
- `features/tweets/components/TweetForm.jsx` — single shared RHF + Zod form for both create and edit mode (switches on presence of `tweet` prop); `tags` submitted as one comma-separated string per confirmed Swagger spec (not `tags[]` — corrected after checking real API docs); `isSensitive` deliberately **not** added — out of Phase 6's documented scope (PRD §2.2 lists only title/description/image/tags), revisit at Phase 10 (Moderation) when it becomes functionally meaningful
- `features/tweets/components/DeleteTweetDialog.jsx` — confirmation dialog, cancel/confirm both tested
- `features/tweets/pages/MyTweetsPage.jsx` — wires everything together; create/edit use a MUI `Dialog` (modal), not a separate route — no `/tweets/new` or `/tweets/:id/edit` route was added, consistent with `Architecture.md`'s documented routing tree
- `routes/AppRouter.jsx` — `MyTweets` placeholder replaced with real `lazy()` import of `MyTweetsPage`

**Verified via live end-to-end testing, not just code review:** login → session tokens confirmed in localStorage → page load (loading → empty state) → create (201, list updates without refresh) → edit (200, pre-filled form, card updates without refresh) → delete (cancel leaves tweet untouched; confirm removes it without refresh). All working against the real backend, not mocked.

## 2. What File Is Currently Being Worked On

**None actively in progress.** Phases 1–6 confirmed complete against the actual repo, including live testing.

**Next real work — Phase 7 (Public Tweet Feed):**

Reuse `TweetCard`/`TweetList` from Phase 6 for the public feed using `getAllTweets`. Add infinite scroll (no page-number pagination), search, filter by status/author, and sort. (Scope updated after Session 6 — infinite scroll replaces pagination per explicit decision, not the original plan.)

---

## 3. Update Log

### Initial

The repository was successfully scaffolded. Phase 1 (File & Folder Structure) and Phase 2 (Core Dependencies) were completed and verified.

### Session 2

Implemented and verified the shared `api/axios.js` instance and `utils/tokenStorage.js`. Also added the routing foundation, including `AppRouter`, `ProtectedRoute`, `MainLayout`, `constants/routes.js`, and the lazy-loaded `TweetDetailPreview` page ahead of schedule.

### Session 3

Confirmed that Phase 4 (Routing) is fully complete. Clarified that Phase 4 only covers the routing infrastructure. Placeholder pages and the empty `services/*.js` files are intentionally deferred to later phases and are not considered missing work for Phase 4.

### Session 4

Updated the status of Phase 3 (API Layer) from **Partially Complete** to **Complete**. Confirmed that the empty `services/*.js` files were never part of Phase 3's scope; they are intended to be implemented in later feature phases.

### Session 5

Completed Phase 5 (Authentication) in full: `authService.js`, `AuthContext`, `useAuth`, real `LoginPage`/`RegisterPage`, Logout wiring, and `ProtectedRoute` upgraded from token-presence to real `isAuthenticated`/`isLoading` state. Verified via direct file inspection that `App.css`/`index.css` were already correctly imported — the unstyled appearance during Phases 4–5 is expected, not a missing-import bug; real theming is pending Phase 6.

---

### Session 6

Completed Phase 6 (Tweet CRUD — My Tweets) in full: `tweetService.js`, `useTweets` hook, `TweetCard`/`TweetList`, `TweetForm` (create + edit, one shared component), `DeleteTweetDialog`, and `MyTweetsPage` wiring it all together via a modal (not a separate route). Corrected the `tags` field format after checking the real Swagger spec — it's a single comma-separated string, not `tags[]` as first assumed; caught before it caused a silent backend mismatch. Deliberately left `isSensitive` out — checked against `Phases.md`/`PRD.md` first and confirmed it's out of Phase 6's documented scope. All 6 CRUD flows (boot, auth, list render, create, edit, delete) tested live against the real backend, not just written and assumed working.

### Next Update

_Add the next development milestone here._

**Reminder for future sessions:** Before trusting any progress checklist (Notion or otherwise), pull the actual repo and check file contents. Lessons learned so far:

1. Phase 3 was marked done in Notion while its `services/*.js` files were still empty — those files are actually out of scope for Phase 3 (they belong to Phase 5+), so "empty" there isn't a bug, just early scaffolding.
2. Phase 4 was initially assumed incomplete because pages were placeholders — but placeholder page _content_ is expected at this stage; Phase 4's real scope (routing mechanics) was fully done. Don't confuse "placeholder UI" with "incomplete phase" — check each phase's actual scope in `Phases.md` before judging completion.
3. An "unstyled" look isn't automatically a missing-CSS-import bug — check the actual CSS file contents (are the class names even used anywhere?) before assuming imports are the problem.
