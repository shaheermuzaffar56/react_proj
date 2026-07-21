# PRD.md — Project Requirement Document

## 1. What We're Building

A React frontend for **CloudLearner Tweet App** — a Twitter-style social platform with role-based access (user / moderator / admin), consuming an existing live backend at:

```
https://cloudlearner.duckdns.org:1124/api/v1
```

This is a learning project: every feature maps to a specific React concept from the personal learning roadmap, applied to a real product instead of isolated demos. Scope is intentionally limited to **29 confirmed backend endpoints** — no speculative features beyond what the API actually supports.

---

## 2. Features

### 2.1 Authentication

- Register (with required avatar upload, optional cover image)
- Login (email or username + password)
- Logout
- Auto token refresh (silent, via Axios interceptor)
- Change password
- Persisted session (reload-safe via stored tokens)

### 2.2 Tweets — Personal (My Tweets)

- Create tweet (title, description, optional image, tags)
- View own tweets (all statuses: draft, awaiting_approval, published, rejected, etc.)
- Edit own tweet
- Delete own tweet (with confirmation)

### 2.3 Tweets — Public Feed

- Browse published tweets (infinite scroll — no page-number pagination)
- Search tweets (title/description/tags)
- Filter by status, author
- Sort (newest, oldest, title, likes)
- View single tweet detail page

### 2.4 Tweet Interactions

- Like / unlike (toggle)
- Dislike / undislike (toggle)
- Repost / un-repost (toggle)
- View who liked / disliked / reposted a tweet (infinite scroll — no page-number pagination)

### 2.5 User Profile

- View own profile
- Edit profile (email, full name)
- Update avatar
- Update cover image
- Delete own account
- View another user's profile by ID
- Browse all users (infinite scroll — no page-number pagination) — general listing

### 2.6 Moderation (role-gated: moderator/admin only)

- Tweet moderation queue (approve/reject/publish workflow, infinite scroll — no page-number pagination)
- User moderation queue (role assignment, disable/enable accounts, infinite scroll — no page-number pagination)
- Admin-only actions: delete any user, assign roles
- Moderator-limited actions: cannot see admin accounts/tweets, cannot assign roles

---

## 3. Explicitly Out of Scope

These exist as leftover data/fields in the API but have **no working endpoints behind them** — confirmed with the user, not built:

- Watch history (leftover from a different template)
- Channel/subscriber profile page (no subscribe/unsubscribe endpoint exists)
- Comments on tweets (data shape exists, no CRUD endpoints exist)
- Subscribe/unsubscribe actions

---

## 4. Target User Roles

| Role          | Can do                                                                 |
| ------------- | ---------------------------------------------------------------------- |
| **User**      | Create/edit/delete own tweets, like/dislike/repost, manage own profile |
| **Moderator** | All user actions + moderate tweets/users (except admin-level accounts) |
| **Admin**     | Full access — moderate everything, assign roles, delete any user/tweet |
