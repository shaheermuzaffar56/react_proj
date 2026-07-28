# Memory.md

> Living document. Update this at the end of every phase — don't let it drift from the real repo state. When in doubt, verify against the actual GitHub repo rather than trusting checkboxes in Notion or elsewhere.

---

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

### Phase 7 — Public Tweet Feed ✅ Complete

- `features/tweets/hooks/useTweetFeed.js` — infinite-scroll variant of the tweets hook; owns `tweets`, `page`, `totalPages`, `isLoading`, `error`; accepts `{ search, status, sortBy }` and refetches from page 1 (`replace: true`) whenever those change; `isFetchingRef` guards against duplicate concurrent fetches
- `features/tweets/pages/FeedPage.jsx` — search field, status filter, sort dropdown, and an `IntersectionObserver` sentinel that calls `loadMore()` when scrolled into view; reuses `TweetList`/`TweetCard` unchanged from Phase 6, per the original plan
- `constants/routes.js` — added `ROUTES.FEED` (`/feed`)
- `routes/AppRouter.jsx` — `ROUTES.HOME` and `ROUTES.FEED` both render `FeedPage` (Home placeholder from Phase 4 is gone); `FeedPage` import switched from an inline placeholder to a real `lazy()` import

### Phase 8 — Like / Dislike / Repost ⚠️ Core complete, not yet live-tested

- `features/tweets/services/tweetService.js` — added `likeTweet`, `dislikeTweet`, `repostTweet`, `getTweetLikes`, `getTweetDislikes`, `getTweetReposts`
- `features/tweets/hooks/useTweetInteractions.js` — optimistic toggle logic for like/dislike/repost; like and dislike are mutually exclusive (toggling one clears the other optimistically, then reconciles with the server response); rolls back local state on request failure
- `features/tweets/hooks/useReactorsList.js` — generic infinite-scroll hook for the three reactor-list endpoints, parameterized by `fetchFn`
- `features/tweets/components/TweetReactorsList.jsx` — dialog + `IntersectionObserver` sentinel, reused for likes/dislikes/reposts via a `listConfig` map
- `features/tweets/components/TweetCard.jsx` — wired to `useTweetInteractions`; like/dislike/repost buttons plus tappable counts that open `TweetReactorsList`

**Not yet verified live against the real backend** — Phase 6 and earlier phases in this doc were confirmed via live testing before being marked complete; Phase 7 and 8 have not had that same live-testing confirmation logged yet. Recommend a testing pass before treating this as fully closed, consistent with this doc's own stated practice.

### Undocumented addition — Global Error Toast System ✅ Complete, not part of any planned phase

Not called for by `Phases.md`, but built and already wired project-wide:

- `context/ErrorToastContextValue.js` / `context/ErrorToastContext.jsx` — `ErrorToastProvider` holds a `toasts` array; `showError(err, title)` extracts `err.response?.data?.message`, pushes a toast, auto-dismisses after 6s
- `hooks/useErrorToast.js` — throws if used outside `ErrorToastProvider`, same pattern as `useAuth`
- `components/ErrorToastStack.jsx` — renders stacked MUI `Alert`s, fixed top-center
- `main.jsx` — `ErrorToastProvider` now wraps `AuthProvider` (provider order at the time: Router → ErrorToast → Auth → App)

**⚠️ Superseded by the Session 8 TanStack Query migration below.** The last bullet point that used to be here (every hook calling `showError()` itself in its `catch` block) is no longer accurate — that responsibility moved to a centralized `QueryCache`/`MutationCache` `onError` in `lib/queryClient.js`. Left the rest of this entry as-is for historical accuracy (it's what shipped at the time); see Session 8 for the current pattern and `Rules.md`'s "Global Error Notifications" section for what's authoritative now.

### Phase 9 — User Profile ✅ Complete

- `features/users/services/userService.js` — `updateUser`, `updateAvatar`, `updateCover`, `getUserById`, `getAllUsers`, `deleteUser`, all via the shared `api` instance; `getUserById` documented as returning `data` directly (not nested under `userData`, unlike the rest of the User APIs — verified against Swagger in the original handoff prompt, not re-verified live in this session)
- `constants/queryKeys.js` — added `userKeys` (`detail(id)`, `list()`); no `me()` key — own-profile data intentionally continues to live in `authKeys.me()`
- `features/users/hooks/useProfile.js` — `updateProfile`/`updateAvatar`/`updateCover`/`deleteAccount` mutations; success writes fresh `userData` directly into `authKeys.me()` via `setQueryData` (no invalidate-refetch) so Sidebar/TopBar update instantly; `deleteAccount` clears tokens and nulls `authKeys.me()`, letting `ProtectedRoute` redirect naturally; exposes aggregated `isPaused` across all four mutations, same pattern as `useTweets.js`
- `features/users/hooks/useUser.js` — `useQuery` wrapper around `getUserById`
- `features/users/hooks/useAllUsers.js` — built on `hooks/useInfiniteListQuery.js`, same structural pattern as `useReactorsList.js`
- `features/users/components/ProfileEditForm.jsx` — RHF + Zod, email + fullName only, mirrors `TweetForm.jsx`'s structure (serverError Alert, isPaused banner)
- `features/users/components/ProfileImageUploadForm.jsx` — one component reused for both avatar and cover (via `kind`/`fieldName`/`currentImage` props) rather than two near-duplicates; reuses `UploadBox`/`useFilePreview` unchanged
- `features/users/components/UserListItem.jsx` — minimal avatar/name/username row, links to `USER_DETAIL` via `buildPath()` (first use of `buildPath()` in the codebase)
- `features/users/components/DeleteAccountDialog.jsx` — mirrors `DeleteTweetDialog.jsx`; does **not** call `onClose()` on success, since a successful delete clears auth state and `ProtectedRoute` redirects the whole page away
- `features/users/pages/ProfilePage.jsx` — view info always visible; **decision (confirmed with user, not assumed): edit mode is a modal `Dialog`**, matching `MyTweetsPage.jsx`'s create/edit pattern rather than an inline toggle, to keep one consistent edit-UX convention app-wide; avatar/cover upload forms are always-visible inline sections (not modals), matching `RegisterPage.jsx`'s style
- `features/users/pages/UserDetailPage.jsx` — read-only, `useParams()` pattern from `TweetDetailPreview.jsx`, no edit actions per PRD scope
- `features/users/pages/UsersListPage.jsx` — infinite scroll, `IntersectionObserver` sentinel copied from `FeedPage.jsx`; no search box (confirmed `/user/allUsers` has no `search` param, unlike the tweet feed)
- `constants/routes.js` — added `ROUTES.USERS` (`/users`); `USER_DETAIL` (`/users/:id`) already existed
- `routes/AppRouter.jsx` — `Profile` placeholder replaced with real `lazy()` `ProfilePage`; added `USER_DETAIL` and `USERS` routes
- **Decision (confirmed with user, not assumed): `USER_DETAIL` and `USERS` are both behind `ProtectedRoute`** (login required), not public — unlike `FEED`/`TWEET_DETAIL`
- `constants/navItems.js` — added a "Users" nav entry between "My Tweets" and "Profile", no role restriction (any logged-in user can browse); drives both `Sidebar.jsx`'s nav list and `TopBar.jsx`'s page-title lookup from the same array, so no direct edits needed to either component
- **Verified against `docs/API.md`, not live testing:** `GET /user/allUsers` has no `(Admin)`/`(Admin/Moderator)` tag in the endpoint list (unlike `DELETE /user/deleteUser/{id}` and `PATCH /user/updateUser/{id}`, which do), and is grouped under PRD §2.5 (ordinary user-facing Phase 9 features) rather than §2.6 (role-gated Moderation) — confirms the "any logged-in user" access model the `ProtectedRoute`-only gating assumes

**Verified via live end-to-end testing, not just code review.** A full test checklist (profile view/edit, avatar/cover upload validation and success, delete-account flow, view-other-user, browse-all-users infinite scroll, nav, offline/`isPaused` handling, and a Phase 1–8 regression pass) was handed off and confirmed passing against the real backend. Consistent with this doc's own practice (Phase 6's completion standard) — Phase 9 is now fully closed.

**Correction, caught while updating this doc:** initially flagged "Change password" as a missing/unconfirmed endpoint — wrong. `features/auth/services/authService.js` already has `updatePassword` (`POST /user/updatePassword`, `{ password, newPassword }`), built and live-verified in Phase 5 (see line 43 above). `docs/API.md` just never documented it — another instance of lesson #4 (code outrunning docs). **The actual gap: no hook or UI ever consumes it** — no `useChangePassword` hook, no change-password form anywhere in the codebase. Correctly out of Phase 9 scope (`PRD.md` §2.1 Authentication, not §2.5 User Profile) — this is unfinished Phase 5 work, not a Phase 9 omission. `docs/API.md` should be updated to include it, and a small follow-up (hook + form, likely living in `ProfilePage.jsx` or a dedicated settings area) is still outstanding.

### Follow-up — Change Password ✅ Complete

Closed the gap flagged above:

- `features/auth/hooks/useChangePassword.js` (new) — wraps the existing `updatePassword` service function in a `useMutation`; exposes `changePassword`/`isPaused`. Lives in `features/auth/hooks/` (not `features/users/hooks/`) since it sits next to its own service, matching every other hook/service pairing in the app; `ProfilePage.jsx` imports it cross-feature, same as it already does with `useAuth`.
- `features/users/components/ChangePasswordForm.jsx` (new) — RHF + Zod, current password + new password (min 8 chars) + client-side-only confirm-password check via `.refine()`. Lives in `features/users/` since that's where it's displayed, even though its hook lives in `features/auth/`.
- `features/users/pages/ProfilePage.jsx` (updated) — `ChangePasswordForm` added as a second section inside the existing "Edit Profile" `Dialog`, below `ProfileEditForm`, separated by a `Divider`. Deliberately **not** combined into one submit with email/fullName — different mutation, different endpoint. Deliberately does **not** auto-close the dialog on success (unlike `ProfileEditForm`) — shows an inline success `Alert` instead, since the user may still want to edit email/fullName in the same dialog session. Tracks its own `isPasswordPaused` separately from `useProfile()`'s `isPaused` — two independent mutations, shouldn't share paused state.

**Verified via live end-to-end testing:** wrong current password → server error surfaces correctly, no crash; new/confirm password mismatch → client-side Zod error, no request sent; successful change → success alert shows, fields clear, dialog stays open.

**Bug caught during setup (not an implementation error):** `ChangePasswordForm.jsx` initially failed to load with a Vite 500 (`Failed to resolve import "../components/ChangePasswordForm"`) — the file had never actually been saved to disk after being pasted. Re-saved and confirmed working. Worth a quick sanity check after any multi-file step: confirm every new file referenced by an import actually exists before assuming a paste succeeded.

## 2. What File Is Currently Being Worked On

**None actively in progress.** Phases 1–7 confirmed complete against the actual repo. Phase 8's core interaction/reactor-list logic is in place and live-tested. Phase 9 (User Profile) and its Change Password follow-up are both confirmed complete via live testing. The TanStack Query retrofit (Session 8) is complete and merged (`8eaf78d`).

**Next real work:** Phase 10 (Moderation) — tweet moderation queue and user moderation (role assignment, disable/enable, admin-only user deletion), role-gated to moderator/admin.

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

### Session 7

Completed Phase 7 (Public Tweet Feed) and the core of Phase 8 (Like/Dislike/Repost), plus an unplanned global error-toast system (`ErrorToastContext`, `useErrorToast`, `ErrorToastStack`) now wired into every existing data-fetching hook. This work was found by reading the repo directly — it had not yet been reflected in this file. Flagged two follow-ups, now resolved: (1) `Rules.md`'s Error Handling section only documented local hook-level `error` state — updated to cover the new toast pattern.

### Session 8

Migrated server-state management to `@tanstack/react-query` v5, project-wide, ahead of schedule (originally Phase 12, pulled forward to before Phase 9 — see `Phases.md`). Deliberate architectural pivot, logged per this doc's own practice.

**What changed:**

- Added `lib/queryClient.js` (QueryClient factory with centralized `QueryCache`/`MutationCache` `onError`) and `lib/QueryProvider.jsx` (builds the client via `useMemo` inside a component, since the error handler needs `useErrorToast()`); wired into `main.jsx` between `ErrorToastProvider` and `AuthProvider`.
- Added `constants/queryKeys.js` (`authKeys`, `tweetKeys` factories) and `hooks/useInfiniteListQuery.js` (generic `useInfiniteQuery` wrapper).
- Rebuilt on `useQuery`/`useMutation`/`useInfiniteQuery`: `AuthContext.jsx`, `useTweets.js`, `useTweetFeed.js`, `useReactorsList.js`, `useTweetInteractions.js`.
- `tweetService.js` and `authService.js` — untouched, as planned; TanStack Query sits above the service layer, not instead of it.
- `Rules.md` updated in the same commit (Data Fetching, Global Error Notifications, and a new "Known gaps" subsection under Error Handling).

**Verified outcomes vs. the original plan — including where the plan was wrong:**

- `useTweets.js`, `useTweetFeed.js`, `useReactorsList.js`, `AuthContext.jsx` all shrank roughly as predicted — manual `isLoading`/`error`/pagination state replaced by the query/infinite-query hooks.
- `useTweetInteractions.js` did **not** shrink as predicted. The original estimate was "roughly a third" of its prior size; it actually grew from 79 to 127 lines. Reason: like/dislike/repost state is local to each `TweetCard` instance (not read from the query cache), so the optimistic-update/rollback logic still needs manual `useState` plus `onMutate`/`onError` context-passing per mutation — TanStack restructured this hook, it didn't eliminate the complexity. Flagged in `Rules.md`'s new "Known gaps" section as a deliberate scope decision (cross-list cache sync was judged a larger, separate change) rather than a bug.
- `useTweets.js`'s list fetch still isn't on infinite scroll, despite `Rules.md`'s pagination rule listing `getMyTweets` as in-scope for it — this predates the migration and was preserved as-is rather than silently expanding scope during a refactor. Also flagged in `Rules.md`.

### Session 9

Found three commits on the repo that had shipped after Session 8 but were never logged here — caught by diffing `git log` against this file directly, per this doc's own lesson #4 below.

**`c13c55b` — Design system and UI improvements:**

- `theme.js` (new) — MUI theme: palette, typography, component style overrides.
- `Sidebar.jsx` / `TopBar.jsx` — refactored for brand, user section, navigation, new styling.
- `features/auth/components/AuthLayout.jsx` (new) — shared layout wrapper for Login/Register.
- `components/UploadBox.jsx` (new) — reusable file-upload UI.
- `hooks/useFilePreview.js` — moved from a feature-local location to shared `hooks/`, now used by both auth and tweets features.
- `constants/navItems.js`, `constants/tweetStatus.js` (new) — centralized nav items and status-chip config.
- Google Fonts (Manrope, Inter) wired into `index.html`; `main.jsx` updated to apply the theme.
- `LoginPage.jsx` / `RegisterPage.jsx` / `TweetForm.jsx` — adjusted to use the new `AuthLayout`/`UploadBox`/theme.

**`4c2ad91` — TweetCard.jsx rewrite (44 → 228 lines):**

- Added author header: avatar, name, relative timestamp (`formatDate` helper: "Xm/Xh/Xd" under a week, else "Mon D").
- Replaced inline edit/delete buttons with a `MoreVert` overflow `Menu`.
- Swapped the like icon from thumbs-up to heart (`FavoriteIcon`/`FavoriteBorderIcon`).
- Added `fmtNum` helper for compact counts (e.g. `1.2k`).
- Added a "read more" clamp for descriptions over 180 characters.

**`a6228ea` — Offline handling + cleanup (this session):**

- `api/axios.js` — added `timeout: 5000` to both the main `api` instance and the separate `refreshClient` instance. Added a request-interceptor check: if `navigator.onLine` is `false`, the request short-circuits with a synthetic error shaped like a normal Axios error response, so it flows through existing error handling without special-casing. Documented via code comment that DevTools' simulated "Offline" throttle won't reliably trigger the `navigator.onLine` check — the `timeout` is what guarantees those requests still resolve.
- `features/tweets/components/TweetForm.jsx` — a leftover debug `console.log("catcherror", err)` was added in the submit catch block, then found and removed in this same session (verified: `setServerError` fallback logic untouched).

None of this affects Phase 9 scope or status — `userService.js` is still confirmed empty; Phase 9 (User Profile) is still the next real work.

### Session 10

Built Phase 9 (User Profile) in full, following the 6-step plan from the original handoff prompt: `userService.js`, `userKeys`, hooks (`useProfile`/`useUser`/`useAllUsers`), components (edit form, avatar/cover upload, user list item, delete-account dialog), pages (`ProfilePage`/`UserDetailPage`/`UsersListPage`), and routing/nav. Verified the repo's actual state against the handoff prompt's claims before starting (userService.js empty, queryKeys/routes/AppRouter as described) — no discrepancies found. Two scope decisions were explicitly flagged by the prompt and confirmed with the user rather than assumed: (1) profile edit uses a modal `Dialog`, matching `MyTweetsPage.jsx`'s existing pattern; (2) `USER_DETAIL`/`USERS` routes are behind `ProtectedRoute`, not public. Also confirmed via `docs/API.md`'s endpoint-tagging convention that `GET /user/allUsers` is available to any authenticated user, not admin-only. **Live-tested and confirmed fully working** against the real backend (full checklist: profile view/edit, avatar/cover upload, delete-account, view-other-user, browse-all-users infinite scroll, nav, offline handling, Phase 1–8 regression). Initially misflagged "Change password" as a missing endpoint — corrected after checking the actual code: `authService.js`'s `updatePassword` already exists from Phase 5, it just has no hook/UI consuming it yet. `docs/API.md` doesn't document it (drift, not a real gap). Logged as outstanding Phase 5 follow-up work, not Phase 9 scope.

### Session 11

Closed the Change Password gap flagged at the end of Session 10: added `useChangePassword.js` (`features/auth/hooks/`, next to its `authService.js` mutation, per established hook/service pairing convention) and `ChangePasswordForm.jsx` (`features/users/components/`, where it's actually displayed), wired into `ProfilePage.jsx`'s existing "Edit Profile" dialog as a separate section with its own submit — not merged into the email/fullName save, since it's a different mutation. Hit one setup snag: `ChangePasswordForm.jsx` hadn't actually been saved to disk after pasting, causing a Vite 500 "Failed to resolve import" error on `/profile` — re-saved and confirmed working, not a code bug. **Live-tested and confirmed fully working**: wrong current password, mismatched confirmation, and successful change all verified against the real backend.

### Next Update

_Add the next development milestone here._

**Reminder for future sessions:** Before trusting any progress checklist (Notion or otherwise), pull the actual repo and check file contents. Lessons learned so far:

1. Phase 3 was marked done in Notion while its `services/*.js` files were still empty — those files are actually out of scope for Phase 3 (they belong to Phase 5+), so "empty" there isn't a bug, just early scaffolding.
2. Phase 4 was initially assumed incomplete because pages were placeholders — but placeholder page _content_ is expected at this stage; Phase 4's real scope (routing mechanics) was fully done. Don't confuse "placeholder UI" with "incomplete phase" — check each phase's actual scope in `Phases.md` before judging completion.
3. An "unstyled" look isn't automatically a missing-CSS-import bug — check the actual CSS file contents (are the class names even used anywhere?) before assuming imports are the problem.
4. Code can outrun documentation entirely — Phases 7 and 8 plus a whole undocumented error-toast system existed in the repo before this file was updated to reflect them. Periodically diff `src/` against `docs/` directly rather than only updating docs when told a phase is starting.
5. A pre-migration analysis's size/complexity predictions aren't guaranteed to hold — Session 8's TanStack Query retrofit shrank three hooks as predicted but grew `useTweetInteractions.js` instead of shrinking it, because its optimistic-update state doesn't live in the query cache. Log actual outcomes after a migration, not just the plan before it.
6. `docs/API.md` missing an endpoint doesn't mean the endpoint doesn't exist — Session 10 initially concluded "Change password" had no backend support because `API.md` didn't list it, when `authService.js`'s `updatePassword` had actually existed and worked since Phase 5. When a claim about "does X exist" matters, check the real source files (`services/*.js`, live Swagger), not just the generated reference doc, which can drift out of date just like this file can.
