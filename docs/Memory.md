# Memory.md

> Living document. Update this at the end of every phase — don't let it drift from the real repo state. When in doubt, verify against the actual GitHub repo rather than trusting checkboxes in Notion or elsewhere.

---

## Last Verified Against Repo

`shaheermuzaffar56/react_proj` — `my-react-app/` — verified by reading actual files, not just Notion status.

---

## 1. What Has Been Completed

### Phase 1 — File & Folder Structure ✅

Full feature-based skeleton created and confirmed via `tree` output: `api/`, `features/{auth,tweets,users,moderation}` (each with `components/`, `hooks/`, `pages/`, `services/`, `index.js`), `components/`, `context/` (empty), `routes/`, `utils/`, `constants/`.

### Phase 2 — Core Dependencies ✅

Confirmed in `package.json`: `axios@1.18.1`, `react-router-dom@7.18.1`, `react-hook-form@7.81.0`, `zod@4.4.3`, `@hookform/resolvers@5.4.0`, `@mui/material@9.2.0`, `@emotion/react@11.14.0`, `@emotion/styled@11.14.1`, `@mui/icons-material@9.2.0`.

### Phase 3 — API Layer ⚠️ Partially Complete

**Done and working:**

- `api/axios.js` — shared instance, `baseURL` set to `https://cloudlearner.duckdns.org:1124/api/v1`, request interceptor attaches Bearer token, response interceptor handles 401 → single refresh attempt via `/user/refreshToken` → retries original request → clears tokens and rejects if refresh fails. Includes pending-request queue to avoid duplicate refresh calls during concurrent 401s.
- `utils/tokenStorage.js` — `getAccessToken`, `getRefreshToken`, `setTokens`, `clearTokens`, all via `localStorage` with prefixed keys (`cloudlearner_access_token`, `cloudlearner_refresh_token`).

**NOT done yet (empty files, despite Notion marking this phase complete):**

- `features/auth/services/authService.js` — empty
- `features/tweets/services/tweetService.js` — empty
- `features/users/services/userService.js` — empty
- `features/moderation/services/moderationService.js` — empty
- All four `features/*/index.js` barrel files — empty

### Phase 4 — Routing ⚠️ Already Started (Notion incorrectly shows "Pending")

- `routes/AppRouter.jsx` — real routing tree using `Routes`/`Route`, wrapped in `Suspense`
- `routes/ProtectedRoute.jsx` — token-presence check only (no role check yet — correctly deferred to Phase 5)
- `constants/routes.js` — `ROUTES` object + `buildPath()` helper for dynamic segments
- `components/MainLayout.jsx` — layout wrapper with `<Outlet />`, placeholder nav
- `pages/TweetDetailPreview.jsx` — lazy-loaded, demonstrates `useParams()` reading `:id`
- Placeholder-only pages inline in `AppRouter.jsx`: Home, Login, Register, MyTweets, Profile, NotFound — none have real content yet

---

## 2. What File Is Currently Being Worked On

**None actively in progress.** Last confirmed real work: `api/axios.js` and `utils/tokenStorage.js` (Phase 3 core). Routing scaffolding (Phase 4) exists but uses placeholder components — no real Login/Register/Home/MyTweets/Profile pages built yet.

**Next real work needed:**

1. Fill in the four empty `services/*.js` files (finish Phase 3 properly)
2. Then formally move to Phase 5 (AuthContext + real Login/Register pages), which will also let `ProtectedRoute` get real role-based checks

---

## 3. Update Log

| Date/Session              | What changed                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Initial                   | Repo scaffolded — Phases 1–2 completed and verified                                                                                                                                        |
| Session 2                 | `api/axios.js` + `tokenStorage.js` written and verified working; routing scaffold (`AppRouter`, `ProtectedRoute`, `MainLayout`, `routes.js`, `TweetDetailPreview`) added ahead of schedule |
| _(next update goes here)_ |                                                                                                                                                                                            |

---

**Reminder for future sessions:** Before trusting any progress checklist (Notion or otherwise), pull the actual repo and check file contents — this file exists specifically because Notion checkboxes have already been found out of sync with real code once (Phase 3 marked done while services were still empty; Phase 4 marked pending while already half-built).
