# Design.md

> **Note:** No color/theme preference has been discussed yet in this project. Everything below is a **proposed default** based on the app type (Twitter-style social app, MUI-based) — not a locked decision. Treat this as a starting point to approve, tweak, or replace before Step 6+ builds real UI.

## 1. Color Palette & Theme

Proposed as an MUI `createTheme()` config — dark-mode-first, since social/feed apps are commonly used that way, with light mode as a toggle.

| Role                         | Color                            | Hex (proposed) |
| ---------------------------- | -------------------------------- | -------------- |
| Primary                      | Blue (action/brand)              | `#1D9BF0`      |
| Secondary                    | Neutral gray (secondary actions) | `#71767B`      |
| Success (published/approved) | Green                            | `#00BA7C`      |
| Warning (awaiting_approval)  | Amber                            | `#FFD400`      |
| Error (rejected/destructive) | Red                              | `#F4212E`      |
| Background (dark by default) | Near-black                       | `#000000`      |
| Background (light mode)      | White / off-white                | `#FFFFFF`      |
| Text primary (dark)          | `#E7E9EA`                        |                |
| Text secondary (dark)        | `#71767B`                        |                |

**Status-to-color mapping** (used for tweet status chips in Moderation, Phase 10):

- `draft` → gray
- `awaiting_approval` → amber
- `approved` → light blue
- `published` → green
- `rejected` → red
- `archived` → dark gray

## 2. Fonts

Proposed: MUI default font stack, since it's already optimized for readability and requires no extra font-loading setup.

```
Primary font: "Roboto", "Helvetica", "Arial", sans-serif
```

If you want something more distinct later (e.g. Inter, which many modern social apps use), that's a one-line change in the theme's `typography.fontFamily` — flag it if you want that swapped in now instead of Roboto.

## 3. Typography Scale

Proposed MUI typography variants and their usage in this app:

| Variant     | Used for                                                     |
| ----------- | ------------------------------------------------------------ |
| `h1` / `h2` | Not heavily used — this is an app, not a marketing site      |
| `h5`        | Page titles (e.g. "My Tweets", "Moderation Queue")           |
| `h6`        | Card/section headers                                         |
| `subtitle1` | Tweet author name                                            |
| `subtitle2` | Timestamps, secondary metadata                               |
| `body1`     | Tweet description/content                                    |
| `body2`     | Comments-equivalent areas (N/A — excluded), form helper text |
| `caption`   | Like/dislike/repost counts, tag chips                        |
| `button`    | All button labels (MUI default — uppercase, medium weight)   |

---

**Action needed from you:** Confirm, adjust, or replace this palette/font/typography before we start building real UI in Phase 6 — right now everything in the app is still placeholder text with no styling applied.
