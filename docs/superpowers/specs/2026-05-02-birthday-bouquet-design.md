# Birthday Bouquet — Design Spec

**Date:** 2026-05-02  
**Status:** Approved  

---

## 1. What We Are Building

A shareable birthday gift website where a sender assembles a digital "bouquet" of personalised media widgets (songs, videos, movies, images, stickers, Pinterest pins) and writes a card. The receiver opens the link, watches the card open with a cinematic animation, hears background music begin, then interactively reveals each widget by tapping emoji covers inside a bouquet or basket.

---

## 2. Who It Is For

- **Senders:** Anyone who wants to give a personalised digital gift. No account required.
- **Receivers:** The birthday person, who gets a shareable link. No account required.
- **Commercial intent:** The product is intended to eventually be commercial. All third-party data sources must be commercially viable from the start.

---

## 3. Non-Goals

- No social feed, discovery, or public gallery of bouquets
- No real-time collaboration between senders
- No receiver interaction beyond revealing widgets (no rearranging, no editing)
- No mobile-native app (web only — but the web experience must be fully first-class on mobile, not an afterthought)
- No in-app payments in v1

---

## 4. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + Vite | Best ecosystem for Framer Motion, React Three Fiber if needed later |
| Styling | Tailwind CSS + custom CSS variables | Utility-first with cottagecore token overrides |
| Animation | Framer Motion | Spring physics, layout animations, shared element transitions |
| Backend | Firebase (Firestore + Storage + Functions) | Serverless, no-ops, free tier covers early usage |
| Metadata fetching | Firebase Cloud Function (Node) | CORS-safe og:image scraping + oEmbed proxy |
| Hosting | Vercel | Zero-config deploys, edge functions available |
| Auth | None (v1) | Bouquets identified by Firestore document ID in URL |

---

## 5. Visual Design System

### Palette
| Token | Hex | Use |
|---|---|---|
| `--cream` | `#fdf6ec` | Page background |
| `--warm-sand` | `#e8c9a0` | Cards, inputs, hover states |
| `--terracotta` | `#c4845c` | Primary CTA buttons, accents |
| `--deep-amber` | `#6b4c2a` | Headings, strong text |
| `--blush` | `#f2c4b0` | Subtle highlights, sticker bg |
| `--muted` | `#a08060` | Labels, secondary text |
| `--green-stem` | `#7a9a5a` | Bouquet stems only |

### Typography
- **Headings / card text:** Playfair Display (italic where decorative)
- **Body / UI labels:** Lato
- **Emoji use:** Restrained — flowers (🌸🌷🌼🌺🌻), sparkles (✨), ribbon (🎀), moon (🌙) only in UI chrome. Never decorative bullet points.

### Animation principles
- **GPU-only properties:** `transform` and `opacity` exclusively. Never animate `width`, `height`, `top`, `left`, `margin`.
- **Spring physics via Framer Motion** for all reveals — natural deceleration, no linear easing.
- **`will-change: transform`** pre-promoted on any element that will animate.
- **Target:** 60 fps on mid-range mobile (see §13 Mobile Performance).

---

## 13. Mobile Performance

The receiver experience is the primary mobile surface — most people will open a birthday link on their phone. The target devices are iPhones (iOS 16+) and Android phones with 8 GB+ RAM running Chrome or Samsung Internet. The experience must be indistinguishable in quality from desktop.

### Layout
- **Mobile-first CSS** — base styles target 390px viewport (iPhone 14 width), scale up to desktop with `min-width` breakpoints
- Touch targets minimum 44×44px (Apple HIG / WCAG)
- No horizontal scroll on any screen
- Sender canvas on mobile: widget sidebar collapses to a bottom sheet; drag-and-drop replaced by tap-to-place (widgets snap to the nearest open position)

### Animation budget
- All animations use **only `transform` and `opacity`** — these are composited by the GPU and never trigger layout or paint
- **No simultaneous animations on more than 3 elements** — stagger reveals with a small delay (e.g. 80 ms) if multiple elements enter at once
- Card-open, bouquet-unfurl, basket-zoom, and emoji-flip are each **a single Framer Motion `motion` element** — no nested animated wrappers
- `will-change: transform` applied only during the animation, removed after completion (staying on too many elements wastes GPU memory)
- Background playlist iframe loaded **after** the opening animation sequence is fully complete — never during

### Asset loading
- Fonts (Playfair Display, Lato) loaded via `<link rel="preload">` — no flash of unstyled text
- Widget thumbnail images use `loading="lazy"` and explicit `width`/`height` to prevent layout shift
- Sticker PNGs are SVG where possible; raster stickers capped at 100 KB
- og:image URLs displayed via `<img>` with `decoding="async"` — never block the main thread

### Testing targets
| Device class | Browser | Expected result |
|---|---|---|
| iPhone 14 (iOS 17) | Safari | 60 fps, no jank on card flip and bouquet unfurl |
| iPhone SE (iOS 16, 4 GB RAM) | Safari | Acceptable — animations may run at 30 fps but must not stutter or drop frames visibly |
| Samsung Galaxy S23 (Android 14) | Chrome | 60 fps |
| Mid-range Android (e.g. Pixel 6a) | Chrome | 60 fps on all GPU-composited animations |

---

## 6. Sender Flow (Step-by-Step)

### Step 1 — Write the Card
Fields:
- Recipient name (text input)
- Message (textarea, max 500 chars)
- Photo upload (optional) — JPG/PNG/WEBP, max 5 MB, stored in Firebase Storage, privacy disclaimer shown inline before upload

Card style is chosen here:
- **Option A — Book Fold:** right panel swings open like a book (CSS `rotateY` with perspective)
- **Option B — Envelope Lift:** envelope flap opens, card rises up from inside

### Step 2 — Build the Bouquet Canvas

Container type is chosen at the top of this step:
- **Bouquet** — widgets revealed inside an unfurling wrapping-paper cone
- **Basket** — widgets revealed inside a wicker basket viewed top-down after zoom-in

The canvas is freeform drag-and-drop. Each widget placed at a random rotation (generated once at drop time, stored in widget data, never recalculated). **Maximum 12 widgets per bouquet** to keep the canvas legible and prevent Firestore document size issues.

**Adding a widget:** sender clicks a widget type from the left sidebar. A pop-up modal appears immediately with:
- **Emoji picker** — large tap target (48×48px), click to open native emoji picker. This is the cover the receiver sees before revealing.
- **Type-specific fields** (see §7)
- **Auto-preview** — fetched immediately after URL is pasted, shown inside the pop-up
- **Buttons:** "Cancel" (plain text, left) and "Add ✦" (terracotta pill, right)

**Background playlist** — a dedicated slot at the top of the canvas (not a widget on the canvas itself). Sender pastes a Spotify or YouTube playlist URL. Music begins playing the moment the receiver's card fully opens.

### Step 3 — Share
- Bouquet is saved to Firestore, a unique ID generated
- Shareable link: `[domain]/b/[bouquetId]`
- Copy-link button shown prominently
- No preview in v1 — sender sees a confirmation screen with the link only

---

## 7. Widget Types

All widgets share: `id`, `type`, `emoji` (cover), `rotation` (degrees, fixed at creation), `position` (x/y on canvas).

| Widget | Extra fields | Metadata source |
|---|---|---|
| **Spotify** | `spotifyUrl`, `trackTitle`, `artistName`, `albumArtUrl` | Spotify oEmbed API (no auth, commercially OK) |
| **YouTube** | `youtubeUrl`, `videoTitle`, `channelName`, `thumbnailUrl` | YouTube oEmbed API (no auth, commercially OK) |
| **Movie** | `pageUrl`, `movieTitle`, `year`, `posterUrl`, `director` | og:image + og:title scraped via Firebase Function |
| **Pinterest** | `pageUrl`, `imageUrl`, `caption` | og:image scraped via Firebase Function |
| **My Photo** | `storageUrl`, `caption` (optional) | Firebase Storage (client-side upload) |
| **Sticker** | `stickerKey` (pre-made) or `storageUrl` (custom upload) | Static assets or Firebase Storage |

### oEmbed / og:image approach
- Spotify: `GET https://open.spotify.com/oembed?url=<url>` — returns `title`, `thumbnail_url`
- YouTube: `GET https://www.youtube.com/oembed?url=<url>&format=json` — returns `title`, `thumbnail_url`, `author_name`
- Movie / Pinterest / any link: Firebase Cloud Function `GET /api/og?url=<url>` — fetches the target page server-side, parses `og:image`, `og:title`, `og:description`, returns JSON. No image is stored — only the URL is saved in Firestore.

---

## 8. Receiver Flow

### 8.1 Landing Page
- Centred card with sender's name
- Tagline is **container-aware**:
  - Bouquet → *"Someone sent you a little bouquet 🌸"*
  - Basket → *"Someone sent you a cute gift basket 🧺"*
- Single CTA: "Open it ✨" button

### 8.2 Card Opening
Triggered by tapping "Open it":
- **Book Fold (A):** right panel rotates open via `rotateY 0° → -180°` with perspective. Card content (message + photo) revealed on the inner face.
- **Envelope Lift (B):** flap rotates up (`rotateX`), card translates upward out of envelope.
- **On completion of open animation:** background playlist iframe unmuted, music begins.

### 8.3 Container Transition
After the card is fully open and the message is visible, a subtle "See your gifts 🌷" CTA appears at the bottom of the card. Tapping it closes the card with a reverse animation and transitions to the container view. There is no auto-advance — the receiver controls the pacing.

- Container appears: bouquet wrapping paper or basket

**Bouquet unwrap:**
1. Wrapping paper cone — two paper flaps peel back left and right (`rotate` + `translateX` spring)
2. Stems and scattered emoji covers appear as the paper opens
3. Emojis are large (48–64px), transparent background, `filter: drop-shadow()`, random rotation

**Basket zoom-in:**
1. Basket shown from outside in a slight perspective view
2. Tap basket → CSS `scale` transition makes the basket rim expand to fill the viewport
3. Interior revealed: top-down oval view, basket-weave texture, food emojis scattered inside
4. Same large transparent emojis, random rotations

### 8.4 Emoji Reveal
- Each emoji is an independently tappable element
- Tap → `rotateY 0° → 180°` card flip (Framer Motion `AnimatePresence`)
  - Front face: emoji (large, transparent bg)
  - Back face: widget card
- Widget card keeps the same `position` and `rotation` as its emoji cover
- State is **permanent** — once revealed, the widget stays as a widget. No revert to emoji.
- Widgets are **not rearrangeable** by the receiver.

### 8.5 Widget Expanded State
Tapping an already-revealed widget expands it:
- **Spotify:** opens Spotify Web Player embed (or deep-links to Spotify app on mobile)
- **YouTube:** expands to show the embedded YouTube iframe player (thumbnail + title in resting state, plays on tap)
- **Movie:** expands to show poster, title, year, director
- **Pinterest:** expands to show full image
- **My Photo:** expands to show full image
- **Sticker:** no expand, just decorative

---

## 9. Data Model (Firestore)

```
/bouquets/{bouquetId}
  createdAt: timestamp
  cardStyle: "fold" | "envelope"
  containerType: "bouquet" | "basket"
  recipientName: string
  message: string
  cardPhotoUrl: string | null          // Firebase Storage URL
  playlistUrl: string | null           // Spotify or YouTube playlist URL
  playlistType: "spotify" | "youtube" | null
  widgets: Widget[]

Widget {
  id: string                           // nanoid
  type: "spotify" | "youtube" | "movie" | "pinterest" | "photo" | "sticker"
  emoji: string                        // single emoji character
  rotation: number                     // degrees, -25 to +25
  position: { x: number, y: number }  // percentage of canvas, 0–100
  // type-specific fields per §7
  // NOTE: `revealed` state is NOT stored in Firestore — it is ephemeral React state only.
}
```

`revealed` is **client-side state only** — it is not written back to Firestore. Each visit starts with all widgets hidden. This is intentional: the receiver can re-experience the reveal by sharing the link again.

---

## 10. Image & Privacy Policy

- **Card photo:** stored in `Firebase Storage` at `cards/{bouquetId}/card-photo.{ext}`. Access rule: public read (anyone with the link can view it). No server processing.
- **Custom widget photo:** stored at `widgets/{bouquetId}/{widgetId}.{ext}`. Same access rule.
- **Custom sticker upload:** stored at `stickers/{bouquetId}/{widgetId}.{ext}`.
- **Pinterest / movie images:** stored as URLs only — never re-hosted.
- **Disclaimer shown inline** in the photo upload pop-up: *"Your photo is stored privately and only visible to someone with your bouquet link. It is never indexed, shared, or used beyond this bouquet."*
- **No image processing** during development — upload UI present but behind a `VITE_ENABLE_UPLOADS=true` feature flag. Default off.
- **No PII collected.** No accounts, no email addresses, no tracking.

---

## 11. Background Playlist

- Sender pastes a Spotify playlist URL or YouTube playlist URL into the dedicated playlist slot.
- Metadata (playlist name, cover art) fetched via oEmbed on paste.
- On the receiver side, playlist is rendered as a hidden `<iframe>` embed (Spotify embed player or YouTube playlist embed).
- iframe is created with `allow="autoplay"` but **muted** until the card-open animation completes, at which point JS calls `contentWindow.postMessage` to unmute (Spotify) or sets `mute=0` via YouTube IFrame API.
- Autoplay unlock: the "Open it ✨" button tap is the user gesture that satisfies browser autoplay policy — the iframe is created at that point (not on page load).

---

## 12. Metadata Fetch Function

Firebase Cloud Function: `GET /api/og?url=<encoded-url>`

- Fetches the target URL server-side (bypasses browser CORS)
- Parses `og:image`, `og:title`, `og:description` from HTML `<head>`
- Returns `{ title, description, imageUrl }` JSON
- **Rate limit:** 10 req/min per IP (Cloud Functions built-in throttle)
- **Allowlist check:** warns but does not block unknown domains (flexibility for any movie site)
- Response cached in Firestore for 24 h by URL hash to avoid re-fetching

---

## 14. Decision Log

| Decision | Alternatives considered | Reason chosen |
|---|---|---|
| Firebase over Supabase | Supabase (PostgreSQL + S3-compatible storage) | Firebase Storage client SDK simpler for direct browser uploads without a backend; Firestore real-time not needed but free tier is generous |
| oEmbed + og:image over TMDB | TMDB API, OMDb API, web scraping | TMDB and OMDb have non-commercial clauses. oEmbed is commercially unrestricted. og:image works for any movie site the sender chooses to paste. |
| No login | Email auth, magic links | Reduces friction for senders; bouquets are ephemeral gifts, not long-lived accounts. Access control via unguessable Firestore document ID. |
| `revealed` client-side only | Persisting reveal state to Firestore | Allows receiver to re-experience the reveal; avoids a write-on-every-tap; keeps the data model immutable after creation. |
| Framer Motion over GSAP / CSS-only | GSAP (powerful but large), CSS-only (no spring physics) | Framer Motion integrates natively with React state, provides spring physics out of the box, and `layoutId` shared transitions handle the emoji→widget flip elegantly. |
| Basket as top-down zoom | Basket with 3D lift-out of items | CSS scale zoom is GPU-composited and near-zero performance cost. 3D lift-out with physics would require a WebGL scene and is disproportionate to the effect. |
| Emoji covers with card-flip reveal | Scratch-card effect, fade reveal | Card flip (`rotateY`) is the most legible "turn over" metaphor — it reads as unwrapping. Scratch and fade lack the satisfying physicality. |
| Inline pop-up per widget add | Separate customise panel at end | Inline pop-up ties the emoji choice to the widget at the moment of creation — sender is thinking about that specific gift. A deferred panel breaks the mental connection. |
| Background music starts on card open | Starts on page load, starts on container open | Card open is the natural "moment of reveal" — it's the first emotional beat. Browser autoplay policy also requires a user gesture first, and "Open it" is that gesture. |

---

## 15. Open Questions (resolved)

All design questions resolved as of 2026-05-02. No open questions remain before implementation.

---

## 16. Success Criteria

- A sender can build and share a bouquet in under 5 minutes
- The receiver's full experience (landing → card → bouquet → all widgets revealed) works on iPhone Safari and Android Chrome at 60 fps without layout shift or dropped frames
- All widget metadata auto-fetches without the sender manually entering titles or images
- No images are stored server-side during development (feature-flagged)
- The site passes a basic WCAG 2.1 AA colour contrast check on all body text
- Sender canvas on mobile (tap-to-place) works without requiring drag-and-drop
- Landing page tagline matches the container type chosen by the sender
