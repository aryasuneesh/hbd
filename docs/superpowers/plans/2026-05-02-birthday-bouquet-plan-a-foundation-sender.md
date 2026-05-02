# Birthday Bouquet — Plan A: Foundation + Sender

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete sender experience — project scaffold, design system, Firebase integration, all six widget pop-ups, the drag-and-drop canvas, and the save+share flow.

**Architecture:** React + Vite SPA with a left-sidebar + freeform canvas builder (desktop) and a tap-to-place canvas (mobile). Bouquet data saved to Firestore on "Share"; a Firebase Cloud Function handles og:image scraping for movies and Pinterest. Image uploads feature-flagged off by default.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Firebase (Firestore + Storage + Functions), Vitest + @testing-library/react, nanoid.

---

## File Map

```
happy-birthday/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles/
│   │   ├── tokens.css          # CSS custom properties (palette, type scale)
│   │   └── globals.css         # font imports, base resets, body styles
│   ├── types/
│   │   └── bouquet.ts          # All TS types: Bouquet, Widget union, CardStyle, etc.
│   ├── lib/
│   │   ├── firebase.ts         # Firebase app init (reads env vars)
│   │   ├── firestore.ts        # saveBouquet(), getBouquet()
│   │   ├── storage.ts          # uploadFile() — gated by VITE_ENABLE_UPLOADS
│   │   ├── oembed.ts           # fetchSpotifyMeta(), fetchYoutubeMeta()
│   │   └── og.ts               # fetchOgMeta() — calls Cloud Function
│   ├── hooks/
│   │   └── useWidgetMeta.ts    # Debounced metadata fetch on URL paste
│   ├── components/
│   │   ├── sender/
│   │   │   ├── CreatePage.tsx          # Step wizard container (1→2→3)
│   │   │   ├── StepIndicator.tsx       # Step 1/2/3 progress bar
│   │   │   ├── CardStep.tsx            # Step 1: name, message, photo, card style
│   │   │   ├── CanvasStep.tsx          # Step 2: container picker + canvas + sidebar
│   │   │   ├── WidgetSidebar.tsx       # Left sidebar with widget type buttons
│   │   │   ├── BouquetCanvas.tsx       # Freeform canvas (drag desktop / tap mobile)
│   │   │   ├── PlaylistSlot.tsx        # Background playlist URL input
│   │   │   ├── SharePage.tsx           # Step 3: confirmation + copy link
│   │   │   └── popups/
│   │   │       ├── AddWidgetPopup.tsx  # Modal shell: header, emoji picker, Cancel/Add
│   │   │       ├── SpotifyPopup.tsx
│   │   │       ├── YoutubePopup.tsx
│   │   │       ├── MoviePopup.tsx
│   │   │       ├── PinterestPopup.tsx
│   │   │       ├── PhotoPopup.tsx
│   │   │       └── StickerPopup.tsx
│   │   └── widgets/                   # Widget preview cards shown on canvas
│   │       ├── SpotifyWidget.tsx
│   │       ├── YoutubeWidget.tsx
│   │       ├── MovieWidget.tsx
│   │       ├── PinterestWidget.tsx
│   │       ├── PhotoWidget.tsx
│   │       └── StickerWidget.tsx
├── functions/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts                   # Cloud Function: GET /api/og?url=
└── tests/
    ├── types/bouquet.test.ts
    ├── lib/oembed.test.ts
    ├── lib/og.test.ts
    ├── hooks/useWidgetMeta.test.ts
    └── components/
        ├── AddWidgetPopup.test.tsx
        ├── BouquetCanvas.test.tsx
        └── CreatePage.test.tsx
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `.env.example`

- [ ] **Step 1: Initialise Vite project**

```bash
cd C:/Users/aryas/dev/personal/happy-birthday
npm create vite@latest . -- --template react-ts
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 2: Install all dependencies**

```bash
npm install framer-motion firebase nanoid
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Vite**

Replace `vite.config.ts` with:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

- [ ] **Step 4: Configure Tailwind**

Replace `tailwind.config.ts` with:

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fdf6ec',
        sand: '#e8c9a0',
        terracotta: '#c4845c',
        amber: '#6b4c2a',
        blush: '#f2c4b0',
        muted: '#a08060',
        stem: '#7a9a5a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Lato', '"Helvetica Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 5: Create test setup file**

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 6: Create `.env.example`**

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_OG_FUNCTION_URL=http://localhost:5001/YOUR_PROJECT/us-central1/og
VITE_ENABLE_UPLOADS=false
```

Copy to `.env.local` and fill in your Firebase values.

- [ ] **Step 7: Smoke test**

```bash
npm run dev
```

Expected: Vite dev server starts at `http://localhost:5173`, no console errors.

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Vite + React + Tailwind + Framer Motion + Vitest"
```

---

## Task 2: Design System — CSS Tokens & Fonts

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/globals.css`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create `src/styles/tokens.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Lato:wght@300;400;700&display=swap');

:root {
  --cream:      #fdf6ec;
  --sand:       #e8c9a0;
  --terracotta: #c4845c;
  --amber:      #6b4c2a;
  --blush:      #f2c4b0;
  --muted:      #a08060;
  --stem:       #7a9a5a;
  --card-bg:    #fffaf4;
  --border:     #e0ccb4;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    Lato, 'Helvetica Neue', sans-serif;

  --radius-sm:  6px;
  --radius-md:  12px;
  --radius-lg:  16px;
  --radius-pill: 999px;

  --shadow-card: 0 4px 20px rgba(107, 76, 42, 0.12), 0 1px 4px rgba(107, 76, 42, 0.08);
  --shadow-popup: 0 8px 32px rgba(107, 76, 42, 0.16), 0 2px 8px rgba(107, 76, 42, 0.08);
}
```

- [ ] **Step 2: Create `src/styles/globals.css`**

```css
@import './tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after { box-sizing: border-box; }

html, body, #root {
  height: 100%;
  margin: 0;
  background-color: var(--cream);
  color: var(--amber);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-display);
}

/* Prevent layout shifts from lazy images */
img { display: block; max-width: 100%; height: auto; }
```

- [ ] **Step 3: Import globals in `src/main.tsx`**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 4: Verify fonts load**

```bash
npm run dev
```

Open browser → DevTools → Network → filter "font". Expected: Playfair Display and Lato loaded from Google Fonts.

- [ ] **Step 5: Commit**

```bash
git add src/styles/ src/main.tsx
git commit -m "feat: add design system tokens, fonts, and global styles"
```

---

## Task 3: Type Definitions

**Files:**
- Create: `src/types/bouquet.ts`
- Create: `tests/types/bouquet.test.ts`

- [ ] **Step 1: Write the failing type-guard test**

Create `tests/types/bouquet.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { isSpotifyWidget, isYoutubeWidget } from '../../src/types/bouquet';

describe('widget type guards', () => {
  it('identifies a Spotify widget', () => {
    const w = {
      id: 'abc', type: 'spotify' as const, emoji: '🌸',
      rotation: -5, position: { x: 20, y: 30 },
      spotifyUrl: 'https://open.spotify.com/track/123',
      trackTitle: 'Test', artistName: 'Artist', albumArtUrl: 'https://img',
    };
    expect(isSpotifyWidget(w)).toBe(true);
    expect(isYoutubeWidget(w)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/types/bouquet.test.ts
```

Expected: `Cannot find module '../../src/types/bouquet'`

- [ ] **Step 3: Create `src/types/bouquet.ts`**

```typescript
export type CardStyle = 'fold' | 'envelope';
export type ContainerType = 'bouquet' | 'basket';
export type WidgetType = 'spotify' | 'youtube' | 'movie' | 'pinterest' | 'photo' | 'sticker';
export type PlaylistType = 'spotify' | 'youtube';

export interface Position { x: number; y: number; }

interface BaseWidget {
  id: string;
  type: WidgetType;
  emoji: string;
  rotation: number;   // degrees, -25 to +25
  position: Position; // percentage of canvas 0–100
}

export interface SpotifyWidget extends BaseWidget {
  type: 'spotify';
  spotifyUrl: string;
  trackTitle: string;
  artistName: string;
  albumArtUrl: string;
}

export interface YoutubeWidget extends BaseWidget {
  type: 'youtube';
  youtubeUrl: string;
  videoTitle: string;
  channelName: string;
  thumbnailUrl: string;
}

export interface MovieWidget extends BaseWidget {
  type: 'movie';
  pageUrl: string;
  movieTitle: string;
  year: string;
  posterUrl: string;
  director: string;
}

export interface PinterestWidget extends BaseWidget {
  type: 'pinterest';
  pageUrl: string;
  imageUrl: string;
  caption: string;
}

export interface PhotoWidget extends BaseWidget {
  type: 'photo';
  storageUrl: string;
  caption: string;
}

export interface StickerWidget extends BaseWidget {
  type: 'sticker';
  stickerKey: string;  // pre-made sticker ID or empty string if custom
  storageUrl: string;  // empty string if pre-made
}

export type Widget =
  | SpotifyWidget
  | YoutubeWidget
  | MovieWidget
  | PinterestWidget
  | PhotoWidget
  | StickerWidget;

export interface Bouquet {
  id?: string;
  createdAt?: Date;
  cardStyle: CardStyle;
  containerType: ContainerType;
  recipientName: string;
  message: string;
  cardPhotoUrl: string | null;
  playlistUrl: string | null;
  playlistType: PlaylistType | null;
  widgets: Widget[];
}

// Type guards
export const isSpotifyWidget = (w: Widget): w is SpotifyWidget => w.type === 'spotify';
export const isYoutubeWidget = (w: Widget): w is YoutubeWidget => w.type === 'youtube';
export const isMovieWidget   = (w: Widget): w is MovieWidget   => w.type === 'movie';
export const isPinterestWidget = (w: Widget): w is PinterestWidget => w.type === 'pinterest';
export const isPhotoWidget   = (w: Widget): w is PhotoWidget   => w.type === 'photo';
export const isStickerWidget = (w: Widget): w is StickerWidget => w.type === 'sticker';
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/types/bouquet.test.ts
```

Expected: `1 passed`

- [ ] **Step 5: Commit**

```bash
git add src/types/ tests/types/
git commit -m "feat: add Bouquet and Widget type definitions with type guards"
```

---

## Task 4: Firebase Setup

**Files:**
- Create: `src/lib/firebase.ts`, `src/lib/firestore.ts`, `src/lib/storage.ts`
- Create: `tests/lib/firestore.test.ts`

- [ ] **Step 1: Write failing Firestore test**

Create `tests/lib/firestore.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/lib/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-id-123' }),
  getDoc: vi.fn(),
  doc: vi.fn(),
  serverTimestamp: vi.fn(() => 'TIMESTAMP'),
}));

import { saveBouquet } from '../../src/lib/firestore';
import type { Bouquet } from '../../src/types/bouquet';

const mockBouquet: Bouquet = {
  cardStyle: 'fold',
  containerType: 'bouquet',
  recipientName: 'Priya',
  message: 'Happy Birthday!',
  cardPhotoUrl: null,
  playlistUrl: null,
  playlistType: null,
  widgets: [],
};

describe('saveBouquet', () => {
  it('returns a non-empty bouquet ID', async () => {
    const id = await saveBouquet(mockBouquet);
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/lib/firestore.test.ts
```

Expected: `Cannot find module '../../src/lib/firestore'`

- [ ] **Step 3: Create `src/lib/firebase.ts`**

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const storage = getStorage(app);
```

- [ ] **Step 4: Create `src/lib/firestore.ts`**

```typescript
import {
  collection, addDoc, getDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Bouquet } from '../types/bouquet';

export async function saveBouquet(bouquet: Bouquet): Promise<string> {
  const ref = await addDoc(collection(db, 'bouquets'), {
    ...bouquet,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getBouquet(id: string): Promise<Bouquet | null> {
  const snap = await getDoc(doc(db, 'bouquets', id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return { ...data, id: snap.id } as Bouquet;
}
```

- [ ] **Step 5: Create `src/lib/storage.ts`**

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const uploadsEnabled = import.meta.env.VITE_ENABLE_UPLOADS === 'true';

export async function uploadFile(
  path: string,
  file: File,
): Promise<string> {
  if (!uploadsEnabled) {
    throw new Error('Uploads are disabled. Set VITE_ENABLE_UPLOADS=true to enable.');
  }
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
```

- [ ] **Step 6: Run test — expect pass**

```bash
npx vitest run tests/lib/firestore.test.ts
```

Expected: `1 passed`

- [ ] **Step 7: Commit**

```bash
git add src/lib/ tests/lib/
git commit -m "feat: Firebase init, saveBouquet, getBouquet, feature-flagged uploadFile"
```

---

## Task 5: og:image Cloud Function

**Files:**
- Create: `functions/package.json`, `functions/tsconfig.json`, `functions/src/index.ts`

- [ ] **Step 1: Initialise functions directory**

```bash
cd functions
npm init -y
npm install firebase-functions firebase-admin node-fetch@2
npm install -D typescript @types/node
cd ..
```

- [ ] **Step 2: Create `functions/tsconfig.json`**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017"
  },
  "compileOnSave": true,
  "include": ["src"]
}
```

- [ ] **Step 3: Create `functions/src/index.ts`**

```typescript
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

const OG_TAG_RE = /<meta\s+(?:property|name)=["']og:(\w+)["']\s+content=["']([^"']+)["']/gi;
const RATE_LIMIT_PER_MIN = 10;
const callCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = callCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    callCounts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= RATE_LIMIT_PER_MIN) return true;
  entry.count++;
  return false;
}

export const og = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

  const ip = req.ip ?? 'unknown';
  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'Rate limit exceeded' });
    return;
  }

  const rawUrl = req.query.url as string | undefined;
  if (!rawUrl) { res.status(400).json({ error: 'Missing url param' }); return; }

  let targetUrl: string;
  try { targetUrl = decodeURIComponent(rawUrl); new URL(targetUrl); }
  catch { res.status(400).json({ error: 'Invalid URL' }); return; }

  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BouquetBot/1.0)' },
      redirect: 'follow',
    });
    const html = await response.text();

    const tags: Record<string, string> = {};
    let match: RegExpExecArray | null;
    while ((match = OG_TAG_RE.exec(html)) !== null) {
      tags[match[1]] = match[2];
    }

    res.json({
      title:       tags['title']       ?? '',
      description: tags['description'] ?? '',
      imageUrl:    tags['image']       ?? '',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
});
```

- [ ] **Step 4: Build and test locally**

```bash
cd functions && npx tsc && cd ..
firebase emulators:start --only functions
```

In a new terminal:
```bash
curl "http://localhost:5001/YOUR_PROJECT/us-central1/og?url=https%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt0211915%2F"
```

Expected: JSON with `title`, `imageUrl` fields populated.

- [ ] **Step 5: Commit**

```bash
git add functions/
git commit -m "feat: og:image Cloud Function with rate limiting and CORS"
```

---

## Task 6: oEmbed & og Client Helpers

**Files:**
- Create: `src/lib/oembed.ts`, `src/lib/og.ts`
- Create: `tests/lib/oembed.test.ts`

- [ ] **Step 1: Write failing oEmbed test**

Create `tests/lib/oembed.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

import { fetchSpotifyMeta, fetchYoutubeMeta } from '../../src/lib/oembed';

beforeEach(() => mockFetch.mockReset());

describe('fetchSpotifyMeta', () => {
  it('parses title and thumbnail from oEmbed response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'Blinding Lights - The Weeknd',
        thumbnail_url: 'https://img.spotify.com/art.jpg',
      }),
    });

    const result = await fetchSpotifyMeta('https://open.spotify.com/track/abc');
    expect(result.trackTitle).toBe('Blinding Lights');
    expect(result.artistName).toBe('The Weeknd');
    expect(result.albumArtUrl).toBe('https://img.spotify.com/art.jpg');
  });
});

describe('fetchYoutubeMeta', () => {
  it('parses title, channel, and thumbnail', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'lofi hip hop radio',
        author_name: 'ChilledCow',
        thumbnail_url: 'https://img.youtube.com/thumb.jpg',
      }),
    });

    const result = await fetchYoutubeMeta('https://youtube.com/watch?v=xyz');
    expect(result.videoTitle).toBe('lofi hip hop radio');
    expect(result.channelName).toBe('ChilledCow');
    expect(result.thumbnailUrl).toBe('https://img.youtube.com/thumb.jpg');
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/lib/oembed.test.ts
```

Expected: `Cannot find module '../../src/lib/oembed'`

- [ ] **Step 3: Create `src/lib/oembed.ts`**

```typescript
interface SpotifyMeta {
  trackTitle: string;
  artistName: string;
  albumArtUrl: string;
}

interface YoutubeMeta {
  videoTitle: string;
  channelName: string;
  thumbnailUrl: string;
}

export async function fetchSpotifyMeta(url: string): Promise<SpotifyMeta> {
  const endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('Spotify oEmbed failed');
  const data = await res.json();
  // title format: "Song Name - Artist Name"
  const [trackTitle, ...artistParts] = (data.title as string).split(' - ');
  return {
    trackTitle: trackTitle.trim(),
    artistName: artistParts.join(' - ').trim(),
    albumArtUrl: data.thumbnail_url as string,
  };
}

export async function fetchYoutubeMeta(url: string): Promise<YoutubeMeta> {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('YouTube oEmbed failed');
  const data = await res.json();
  return {
    videoTitle:  data.title       as string,
    channelName: data.author_name as string,
    thumbnailUrl: data.thumbnail_url as string,
  };
}
```

- [ ] **Step 4: Create `src/lib/og.ts`**

```typescript
interface OgMeta {
  title: string;
  description: string;
  imageUrl: string;
}

export async function fetchOgMeta(pageUrl: string): Promise<OgMeta> {
  const fnUrl = import.meta.env.VITE_OG_FUNCTION_URL as string;
  const res = await fetch(`${fnUrl}?url=${encodeURIComponent(pageUrl)}`);
  if (!res.ok) throw new Error('og fetch failed');
  return res.json() as Promise<OgMeta>;
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npx vitest run tests/lib/oembed.test.ts
```

Expected: `2 passed`

- [ ] **Step 6: Commit**

```bash
git add src/lib/oembed.ts src/lib/og.ts tests/lib/
git commit -m "feat: oEmbed helpers for Spotify/YouTube and og:image client"
```

---

## Task 7: useWidgetMeta Hook

**Files:**
- Create: `src/hooks/useWidgetMeta.ts`
- Create: `tests/hooks/useWidgetMeta.test.ts`

- [ ] **Step 1: Write failing hook test**

Create `tests/hooks/useWidgetMeta.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('../../src/lib/oembed', () => ({
  fetchSpotifyMeta: vi.fn().mockResolvedValue({
    trackTitle: 'Test Song',
    artistName: 'Test Artist',
    albumArtUrl: 'https://img',
  }),
  fetchYoutubeMeta: vi.fn(),
}));

vi.mock('../../src/lib/og', () => ({
  fetchOgMeta: vi.fn(),
}));

import { useWidgetMeta } from '../../src/hooks/useWidgetMeta';

describe('useWidgetMeta', () => {
  it('fetches Spotify metadata when a spotify URL is provided', async () => {
    const { result } = renderHook(() =>
      useWidgetMeta('spotify', 'https://open.spotify.com/track/abc')
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.meta).toMatchObject({
      trackTitle: 'Test Song',
      artistName: 'Test Artist',
    });
    expect(result.current.error).toBeNull();
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/hooks/useWidgetMeta.test.ts
```

Expected: `Cannot find module '../../src/hooks/useWidgetMeta'`

- [ ] **Step 3: Create `src/hooks/useWidgetMeta.ts`**

```typescript
import { useState, useEffect } from 'react';
import { fetchSpotifyMeta } from '../lib/oembed';
import { fetchYoutubeMeta } from '../lib/oembed';
import { fetchOgMeta } from '../lib/og';
import type { WidgetType } from '../types/bouquet';

type Meta = Record<string, string>;

interface WidgetMetaResult {
  meta: Meta | null;
  loading: boolean;
  error: string | null;
}

const DEBOUNCE_MS = 600;

export function useWidgetMeta(type: WidgetType, url: string): WidgetMetaResult {
  const [meta, setMeta]       = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!url.trim()) { setMeta(null); return; }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        let result: Meta;
        if (type === 'spotify')   result = await fetchSpotifyMeta(url) as Meta;
        else if (type === 'youtube') result = await fetchYoutubeMeta(url) as Meta;
        else result = await fetchOgMeta(url) as Meta;
        setMeta(result);
      } catch {
        setError('Could not fetch metadata. Check the URL and try again.');
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [type, url]);

  return { meta, loading, error };
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/hooks/useWidgetMeta.test.ts
```

Expected: `1 passed`

- [ ] **Step 5: Commit**

```bash
git add src/hooks/ tests/hooks/
git commit -m "feat: useWidgetMeta hook with debounced auto-fetch"
```

---

## Task 8: App Router & Page Shell

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/sender/CreatePage.tsx`, `src/components/sender/SharePage.tsx`

- [ ] **Step 1: Update `src/App.tsx`**

```typescript
import { useState } from 'react';
import CreatePage from './components/sender/CreatePage';
import SharePage from './components/sender/SharePage';
import BouquetPage from './components/receiver/BouquetPage';

type Route =
  | { name: 'create' }
  | { name: 'share'; bouquetId: string }
  | { name: 'bouquet'; bouquetId: string };

function getInitialRoute(): Route {
  const path = window.location.pathname;
  const match = path.match(/^\/b\/([^/]+)/);
  if (match) return { name: 'bouquet', bouquetId: match[1] };
  return { name: 'create' };
}

export default function App() {
  const [route, setRoute] = useState<Route>(getInitialRoute);

  if (route.name === 'bouquet') {
    return <BouquetPage bouquetId={route.bouquetId} />;
  }
  if (route.name === 'share') {
    return <SharePage bouquetId={route.bouquetId} onCreateAnother={() => setRoute({ name: 'create' })} />;
  }
  return (
    <CreatePage
      onComplete={(id) => {
        window.history.pushState({}, '', `/b/${id}`);
        setRoute({ name: 'share', bouquetId: id });
      }}
    />
  );
}
```

Note: `BouquetPage` will be created in Plan B. Create a placeholder for now:

- [ ] **Step 2: Create placeholder `src/components/receiver/BouquetPage.tsx`**

```typescript
export default function BouquetPage({ bouquetId }: { bouquetId: string }) {
  return (
    <div style={{ padding: 40, fontFamily: 'Georgia', color: '#6b4c2a' }}>
      Receiver view coming soon — bouquet: {bouquetId}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/sender/SharePage.tsx`**

```typescript
interface Props {
  bouquetId: string;
  onCreateAnother: () => void;
}

export default function SharePage({ bouquetId, onCreateAnother }: Props) {
  const link = `${window.location.origin}/b/${bouquetId}`;
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="bg-[var(--card-bg)] rounded-2xl shadow-[var(--shadow-popup)] p-10 max-w-md w-full flex flex-col items-center gap-6 border border-[var(--border)]">
        <div className="text-5xl">🌸</div>
        <h1 className="font-display text-2xl italic text-amber text-center">
          Your bouquet is ready!
        </h1>
        <p className="font-body text-sm text-muted text-center leading-relaxed">
          Copy the link below and send it to {bouquetId ? 'your friend' : 'them'} 🎀
        </p>

        <div className="w-full bg-sand/40 rounded-xl p-3 flex items-center gap-3 border border-[var(--border)]">
          <span className="flex-1 text-xs text-amber font-mono truncate">{link}</span>
          <button
            onClick={handleCopy}
            className="bg-terracotta text-white text-xs font-body rounded-full px-4 py-2 shrink-0 transition-opacity hover:opacity-80"
          >
            {copied ? 'Copied ✓' : 'Copy link'}
          </button>
        </div>

        <button
          onClick={onCreateAnother}
          className="text-sm text-muted font-body italic hover:text-amber transition-colors"
        >
          Make another bouquet →
        </button>
      </div>
    </div>
  );
}
```

Add the missing import at the top of SharePage:
```typescript
import { useState } from 'react';
```

- [ ] **Step 4: Create `src/components/sender/CreatePage.tsx` (step wizard shell)**

```typescript
import { useState } from 'react';
import StepIndicator from './StepIndicator';
import CardStep from './CardStep';
import CanvasStep from './CanvasStep';
import { saveBouquet } from '../../lib/firestore';
import type { Bouquet, CardStyle, ContainerType, Widget } from '../../types/bouquet';

interface Props { onComplete: (bouquetId: string) => void; }

export interface CardData {
  recipientName: string;
  message: string;
  cardPhotoUrl: string | null;
  cardStyle: CardStyle;
}

export default function CreatePage({ onComplete }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleFinish(
    containerType: ContainerType,
    widgets: Widget[],
    playlistUrl: string | null,
    playlistType: 'spotify' | 'youtube' | null,
  ) {
    if (!cardData) return;
    setSaving(true);
    try {
      const bouquet: Bouquet = {
        ...cardData,
        containerType,
        widgets,
        playlistUrl,
        playlistType,
      };
      const id = await saveBouquet(bouquet);
      onComplete(id);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <StepIndicator current={step} total={2} />
      {step === 1 && (
        <CardStep
          onNext={(data) => { setCardData(data); setStep(2); }}
        />
      )}
      {step === 2 && cardData && (
        <CanvasStep
          onBack={() => setStep(1)}
          onFinish={handleFinish}
          saving={saving}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/
git commit -m "feat: app router, CreatePage wizard shell, SharePage"
```

---

## Task 9: StepIndicator + CardStep (Step 1)

**Files:**
- Create: `src/components/sender/StepIndicator.tsx`
- Create: `src/components/sender/CardStep.tsx`

- [ ] **Step 1: Create `src/components/sender/StepIndicator.tsx`**

```typescript
interface Props { current: number; total: number; }

export default function StepIndicator({ current, total }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 pt-8 pb-4">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <div key={n} className="flex items-center gap-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-body transition-colors
            ${n === current
              ? 'bg-terracotta text-white'
              : n < current
                ? 'bg-sand text-amber'
                : 'bg-sand/50 text-muted'}
          `}>
            {n < current ? '✓' : n}
          </div>
          {n < total && <div className="w-8 h-px bg-sand" />}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/sender/CardStep.tsx`**

```typescript
import { useState } from 'react';
import type { CardData } from './CreatePage';
import type { CardStyle } from '../../types/bouquet';

interface Props { onNext: (data: CardData) => void; }

const CARD_STYLES: { value: CardStyle; label: string; desc: string; emoji: string }[] = [
  { value: 'fold',     label: 'Greeting Card', desc: 'Opens like a book', emoji: '📖' },
  { value: 'envelope', label: 'Envelope',       desc: 'Rises from an envelope', emoji: '✉️' },
];

export default function CardStep({ onNext }: Props) {
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage]             = useState('');
  const [cardStyle, setCardStyle]         = useState<CardStyle>('fold');

  const canProceed = recipientName.trim().length > 0 && message.trim().length > 0;

  function handleNext() {
    if (!canProceed) return;
    onNext({ recipientName: recipientName.trim(), message: message.trim(), cardPhotoUrl: null, cardStyle });
  }

  return (
    <div className="flex flex-col items-center px-4 pb-12">
      <div className="w-full max-w-lg bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] p-8 flex flex-col gap-6">

        <h2 className="font-display text-2xl italic text-amber text-center">
          Write the card 🌸
        </h2>

        {/* Recipient name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-body text-muted uppercase tracking-widest">To</label>
          <input
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Friend's name…"
            maxLength={60}
            className="bg-sand/30 border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-body text-amber placeholder-muted/60 outline-none focus:border-terracotta transition-colors"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-body text-muted uppercase tracking-widest">
            Your message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something warm…"
            maxLength={500}
            rows={5}
            className="bg-sand/30 border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-body text-amber placeholder-muted/60 outline-none focus:border-terracotta transition-colors resize-none leading-relaxed"
          />
          <span className="text-xs text-muted/60 text-right font-body">{message.length}/500</span>
        </div>

        {/* Card style picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-body text-muted uppercase tracking-widest">Card style</label>
          <div className="grid grid-cols-2 gap-3">
            {CARD_STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => setCardStyle(s.value)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-left
                  ${cardStyle === s.value
                    ? 'border-terracotta bg-blush/20'
                    : 'border-[var(--border)] bg-sand/20 hover:border-sand'}
                `}
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="font-display italic text-sm text-amber">{s.label}</span>
                <span className="font-body text-xs text-muted">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-terracotta text-white font-body italic rounded-full py-3 px-8 self-end transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          Next — build the bouquet ✦
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Smoke test in browser**

```bash
npm run dev
```

Navigate to `http://localhost:5173`. Expected: Step 1 form visible with name input, textarea, and two card style options.

- [ ] **Step 4: Commit**

```bash
git add src/components/sender/StepIndicator.tsx src/components/sender/CardStep.tsx
git commit -m "feat: StepIndicator and CardStep (step 1 of sender flow)"
```

---

## Task 10: AddWidgetPopup Shell

**Files:**
- Create: `src/components/sender/popups/AddWidgetPopup.tsx`
- Create: `tests/components/AddWidgetPopup.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/AddWidgetPopup.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddWidgetPopup from '../../src/components/sender/popups/AddWidgetPopup';

describe('AddWidgetPopup', () => {
  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    render(
      <AddWidgetPopup
        title="Add a song 🎵"
        emoji="🌸"
        onEmojiChange={vi.fn()}
        onCancel={onCancel}
        onAdd={vi.fn()}
        addDisabled={false}
      >
        <div>fields</div>
      </AddWidgetPopup>
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls onAdd when Add is clicked and not disabled', () => {
    const onAdd = vi.fn();
    render(
      <AddWidgetPopup
        title="Add a song 🎵"
        emoji="🌸"
        onEmojiChange={vi.fn()}
        onCancel={vi.fn()}
        onAdd={onAdd}
        addDisabled={false}
      >
        <div>fields</div>
      </AddWidgetPopup>
    );
    fireEvent.click(screen.getByText(/Add/));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it('does not call onAdd when addDisabled is true', () => {
    const onAdd = vi.fn();
    render(
      <AddWidgetPopup
        title="Add"
        emoji="🌸"
        onEmojiChange={vi.fn()}
        onCancel={vi.fn()}
        onAdd={onAdd}
        addDisabled={true}
      >
        <div />
      </AddWidgetPopup>
    );
    fireEvent.click(screen.getByText(/Add/));
    expect(onAdd).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/components/AddWidgetPopup.test.tsx
```

Expected: `Cannot find module`

- [ ] **Step 3: Create `src/components/sender/popups/AddWidgetPopup.tsx`**

```typescript
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  title: string;
  emoji: string;
  onEmojiChange: (emoji: string) => void;
  onCancel: () => void;
  onAdd: () => void;
  addDisabled: boolean;
  children: ReactNode;
}

export default function AddWidgetPopup({
  title, emoji, onEmojiChange, onCancel, onAdd, addDisabled, children,
}: Props) {
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-amber/20 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div
          className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-popup)] w-full max-w-sm overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-sand/40 border-b border-[var(--border)] px-5 py-4">
            <h3 className="font-display text-base italic text-amber">{title}</h3>
          </div>

          {/* Body */}
          <div className="px-5 py-5 flex flex-col gap-4">
            {/* Emoji picker */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-body text-muted uppercase tracking-widest">
                Cover emoji
              </label>
              <div className="flex items-center gap-3">
                <button
                  className="w-12 h-12 bg-sand/40 rounded-xl border border-[var(--border)] text-3xl flex items-center justify-center hover:border-terracotta transition-colors"
                  onClick={() => {
                    const input = window.prompt('Enter an emoji:', emoji);
                    if (input?.trim()) onEmojiChange(input.trim());
                  }}
                >
                  {emoji}
                </button>
                <p className="text-xs text-muted font-body italic leading-relaxed">
                  Tap to change. This is what<br />the receiver sees first.
                </p>
              </div>
            </div>

            {/* Type-specific fields injected here */}
            {children}
          </div>

          {/* Footer */}
          <div className="border-t border-[var(--border)] px-5 py-4 flex justify-end items-center gap-3">
            <button
              onClick={onCancel}
              className="text-sm font-body italic text-muted hover:text-amber transition-colors px-2"
            >
              Cancel
            </button>
            <button
              onClick={addDisabled ? undefined : onAdd}
              disabled={addDisabled}
              className="bg-terracotta text-white text-sm font-body italic rounded-full px-5 py-2 transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              Add ✦
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/components/AddWidgetPopup.test.tsx
```

Expected: `3 passed`

- [ ] **Step 5: Commit**

```bash
git add src/components/sender/popups/AddWidgetPopup.tsx tests/components/
git commit -m "feat: AddWidgetPopup modal shell with emoji picker and Cancel/Add buttons"
```

---

## Task 11: Spotify & YouTube Popups + Widget Cards

**Files:**
- Create: `src/components/sender/popups/SpotifyPopup.tsx`
- Create: `src/components/sender/popups/YoutubePopup.tsx`
- Create: `src/components/widgets/SpotifyWidget.tsx`
- Create: `src/components/widgets/YoutubeWidget.tsx`

- [ ] **Step 1: Create `src/components/sender/popups/SpotifyPopup.tsx`**

```typescript
import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { useWidgetMeta } from '../../../hooks/useWidgetMeta';
import { nanoid } from 'nanoid';
import type { SpotifyWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: SpotifyWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

export default function SpotifyPopup({ onCancel, onAdd, defaultEmoji = '🌸', position }: Props) {
  const [emoji, setEmoji]   = useState(defaultEmoji);
  const [url, setUrl]       = useState('');
  const { meta, loading, error } = useWidgetMeta('spotify', url);

  const canAdd = !!meta && !loading;

  function handleAdd() {
    if (!meta) return;
    onAdd({
      id: nanoid(),
      type: 'spotify',
      emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position,
      spotifyUrl: url,
      trackTitle:  meta.trackTitle  as string,
      artistName:  meta.artistName  as string,
      albumArtUrl: meta.albumArtUrl as string,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a song 🎵"
      emoji={emoji}
      onEmojiChange={setEmoji}
      onCancel={onCancel}
      onAdd={handleAdd}
      addDisabled={!canAdd}
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-body text-muted uppercase tracking-widest">Spotify link</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="open.spotify.com/track/…"
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
      </div>

      {loading && <p className="text-xs text-muted italic font-body">Fetching…</p>}
      {error   && <p className="text-xs text-red-400 font-body">{error}</p>}

      {meta && (
        <div className="bg-[#1a0a00] rounded-xl overflow-hidden">
          <div
            className="h-12 flex items-center px-3 gap-3"
            style={{ background: 'linear-gradient(135deg, #c4845c, #3a1500)' }}
          >
            <img
              src={meta.albumArtUrl as string}
              alt=""
              className="w-8 h-8 rounded-md object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{meta.trackTitle as string}</p>
              <p className="text-[10px] text-white/60 truncate">{meta.artistName as string}</p>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="h-0.5 bg-white/10 rounded-full">
              <div className="w-2/5 h-full bg-[#1DB954] rounded-full" />
            </div>
          </div>
        </div>
      )}
    </AddWidgetPopup>
  );
}
```

- [ ] **Step 2: Create `src/components/sender/popups/YoutubePopup.tsx`**

```typescript
import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { useWidgetMeta } from '../../../hooks/useWidgetMeta';
import { nanoid } from 'nanoid';
import type { YoutubeWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: YoutubeWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

export default function YoutubePopup({ onCancel, onAdd, defaultEmoji = '🌷', position }: Props) {
  const [emoji, setEmoji] = useState(defaultEmoji);
  const [url, setUrl]     = useState('');
  const { meta, loading, error } = useWidgetMeta('youtube', url);

  function handleAdd() {
    if (!meta) return;
    onAdd({
      id: nanoid(),
      type: 'youtube',
      emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position,
      youtubeUrl:   url,
      videoTitle:   meta.videoTitle   as string,
      channelName:  meta.channelName  as string,
      thumbnailUrl: meta.thumbnailUrl as string,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a video ▶"
      emoji={emoji}
      onEmojiChange={setEmoji}
      onCancel={onCancel}
      onAdd={handleAdd}
      addDisabled={!meta || loading}
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-body text-muted uppercase tracking-widest">YouTube link</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="youtube.com/watch?v=…"
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
      </div>
      {loading && <p className="text-xs text-muted italic font-body">Fetching…</p>}
      {error   && <p className="text-xs text-red-400 font-body">{error}</p>}
      {meta && (
        <div className="bg-white rounded-xl overflow-hidden border border-[var(--border)]">
          <div
            className="h-16 relative flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2a1a0a, #8a5030)' }}
          >
            <img
              src={meta.thumbnailUrl as string}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative w-7 h-7 bg-red-600/90 rounded-lg flex items-center justify-center">
              <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[9px] border-t-transparent border-b-transparent border-l-white ml-0.5" />
            </div>
          </div>
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-amber line-clamp-2">{meta.videoTitle as string}</p>
            <p className="text-[10px] text-muted mt-0.5">{meta.channelName as string}</p>
          </div>
        </div>
      )}
    </AddWidgetPopup>
  );
}
```

- [ ] **Step 3: Create `src/components/widgets/SpotifyWidget.tsx`** (canvas preview card)

```typescript
import type { SpotifyWidget as SpotifyWidgetType } from '../../types/bouquet';

export default function SpotifyWidget({ widget }: { widget: SpotifyWidgetType }) {
  return (
    <div className="w-40 rounded-2xl overflow-hidden" style={{ background: '#1a0a00' }}>
      <div
        className="h-14 flex items-center px-3 gap-2.5"
        style={{ background: 'linear-gradient(135deg, #c4845c, #3a1500)' }}
      >
        <img src={widget.albumArtUrl} alt="" className="w-9 h-9 rounded-md object-cover shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-white truncate">{widget.trackTitle}</p>
          <p className="text-[9px] text-white/60 truncate">{widget.artistName}</p>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="h-0.5 bg-white/10 rounded-full">
          <div className="w-2/5 h-full rounded-full" style={{ background: '#1DB954' }} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/widgets/YoutubeWidget.tsx`**

```typescript
import type { YoutubeWidget as YoutubeWidgetType } from '../../types/bouquet';

export default function YoutubeWidget({ widget }: { widget: YoutubeWidgetType }) {
  return (
    <div className="w-44 bg-white rounded-xl overflow-hidden border border-[var(--border)]" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="h-24 relative flex items-center justify-center bg-[#2a1a0a]">
        <img src={widget.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        <div className="relative w-8 h-8 bg-red-600/90 rounded-lg flex items-center justify-center shadow-md">
          <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white ml-0.5" />
        </div>
      </div>
      <div className="px-3 py-2">
        <p className="text-[10px] font-semibold text-amber line-clamp-2 leading-snug">{widget.videoTitle}</p>
        <p className="text-[9px] text-muted mt-0.5">{widget.channelName}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sender/popups/ src/components/widgets/
git commit -m "feat: Spotify and YouTube popups with auto-fetch previews and widget cards"
```

---

## Task 12: Movie, Pinterest, Photo & Sticker Popups + Widget Cards

**Files:**
- Create: `src/components/sender/popups/MoviePopup.tsx`
- Create: `src/components/sender/popups/PinterestPopup.tsx`
- Create: `src/components/sender/popups/PhotoPopup.tsx`
- Create: `src/components/sender/popups/StickerPopup.tsx`
- Create: `src/components/widgets/MovieWidget.tsx`
- Create: `src/components/widgets/PinterestWidget.tsx`
- Create: `src/components/widgets/PhotoWidget.tsx`
- Create: `src/components/widgets/StickerWidget.tsx`

- [ ] **Step 1: Create `src/components/sender/popups/MoviePopup.tsx`**

```typescript
import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { useWidgetMeta } from '../../../hooks/useWidgetMeta';
import { nanoid } from 'nanoid';
import type { MovieWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: MovieWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

export default function MoviePopup({ onCancel, onAdd, defaultEmoji = '🌼', position }: Props) {
  const [emoji, setEmoji] = useState(defaultEmoji);
  const [url, setUrl]     = useState('');
  const { meta, loading, error } = useWidgetMeta('movie', url);

  function handleAdd() {
    if (!meta) return;
    onAdd({
      id: nanoid(),
      type: 'movie',
      emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position,
      pageUrl:    url,
      movieTitle: meta.title       as string,
      year:       '',
      posterUrl:  meta.imageUrl    as string,
      director:   meta.description as string,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a movie 🎬"
      emoji={emoji}
      onEmojiChange={setEmoji}
      onCancel={onCancel}
      onAdd={handleAdd}
      addDisabled={!meta || loading}
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-body text-muted uppercase tracking-widest">
          Paste any movie page URL
        </label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="imdb.com · letterboxd.com · any…"
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
        <p className="text-[10px] text-muted italic font-body">Poster & title fetched automatically.</p>
      </div>
      {loading && <p className="text-xs text-muted italic font-body">Fetching…</p>}
      {error   && <p className="text-xs text-red-400 font-body">{error}</p>}
      {meta && (
        <div className="flex gap-3 bg-sand/30 rounded-xl p-3 border border-[var(--border)]">
          <img src={meta.imageUrl as string} alt="" className="w-10 h-14 object-cover rounded-md shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber">{meta.title as string}</p>
            <p className="text-[10px] text-muted mt-0.5 line-clamp-2">{meta.description as string}</p>
            <p className="text-[9px] text-stem mt-1 italic font-body">poster fetched ✓</p>
          </div>
        </div>
      )}
    </AddWidgetPopup>
  );
}
```

- [ ] **Step 2: Create `src/components/sender/popups/PinterestPopup.tsx`**

```typescript
import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { useWidgetMeta } from '../../../hooks/useWidgetMeta';
import { nanoid } from 'nanoid';
import type { PinterestWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: PinterestWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

export default function PinterestPopup({ onCancel, onAdd, defaultEmoji = '🌺', position }: Props) {
  const [emoji, setEmoji] = useState(defaultEmoji);
  const [url, setUrl]     = useState('');
  const { meta, loading, error } = useWidgetMeta('pinterest', url);

  function handleAdd() {
    if (!meta) return;
    onAdd({
      id: nanoid(), type: 'pinterest', emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position, pageUrl: url,
      imageUrl: meta.imageUrl as string,
      caption:  meta.title   as string,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a Pinterest image 📌"
      emoji={emoji} onEmojiChange={setEmoji}
      onCancel={onCancel} onAdd={handleAdd}
      addDisabled={!meta || loading}
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-body text-muted uppercase tracking-widest">Pinterest pin URL</label>
        <input
          value={url} onChange={(e) => setUrl(e.target.value)}
          placeholder="pinterest.com/pin/…"
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
      </div>
      {loading && <p className="text-xs text-muted italic font-body">Fetching…</p>}
      {error   && <p className="text-xs text-red-400 font-body">{error}</p>}
      {meta && (
        <img src={meta.imageUrl as string} alt="" className="w-full h-36 object-cover rounded-xl" />
      )}
    </AddWidgetPopup>
  );
}
```

- [ ] **Step 3: Create `src/components/sender/popups/PhotoPopup.tsx`**

```typescript
import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { nanoid } from 'nanoid';
import type { PhotoWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: PhotoWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

const UPLOADS_ENABLED = import.meta.env.VITE_ENABLE_UPLOADS === 'true';

export default function PhotoPopup({ onCancel, onAdd, defaultEmoji = '🌻', position }: Props) {
  const [emoji, setEmoji]     = useState(defaultEmoji);
  const [caption, setCaption] = useState('');

  function handleAdd() {
    // Upload gated — in dev we just pass a placeholder URL
    onAdd({
      id: nanoid(), type: 'photo', emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position, storageUrl: '', caption,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a photo 📸"
      emoji={emoji} onEmojiChange={setEmoji}
      onCancel={onCancel} onAdd={handleAdd}
      addDisabled={false}
    >
      {!UPLOADS_ENABLED ? (
        <div className="bg-sand/30 rounded-xl p-4 text-xs text-muted italic font-body text-center border border-[var(--border)]">
          Photo uploads are coming soon 🌸
        </div>
      ) : (
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 flex flex-col items-center gap-2 bg-cream cursor-pointer">
          <span className="text-2xl">📎</span>
          <p className="text-xs text-amber italic font-body">tap to upload image</p>
          <p className="text-[10px] text-muted font-body">JPG, PNG, WEBP · max 5 MB</p>
        </div>
      )}

      <div className="bg-[#fef4e8] border border-sand rounded-xl px-3 py-2.5 flex gap-2 items-start">
        <span className="text-sm shrink-0">🔒</span>
        <p className="text-[10px] text-amber/70 font-body leading-relaxed">
          Your photo is stored privately and only visible to someone with your bouquet link. It is never indexed, shared, or used beyond this bouquet.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-body text-muted uppercase tracking-widest">Caption (optional)</label>
        <input
          value={caption} onChange={(e) => setCaption(e.target.value)}
          placeholder="A little caption…"
          maxLength={80}
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
      </div>
    </AddWidgetPopup>
  );
}
```

- [ ] **Step 4: Create `src/components/sender/popups/StickerPopup.tsx`**

```typescript
import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { nanoid } from 'nanoid';
import type { StickerWidget } from '../../../types/bouquet';

const BUILT_IN_STICKERS = ['🎀', '✨', '🌙', '⭐', '💌', '🍃', '🫧', '🌿'];

interface Props {
  onCancel: () => void;
  onAdd: (w: StickerWidget) => void;
  position: { x: number; y: number };
}

export default function StickerPopup({ onCancel, onAdd, position }: Props) {
  const [selected, setSelected] = useState(BUILT_IN_STICKERS[0]);

  function handleAdd() {
    onAdd({
      id: nanoid(), type: 'sticker', emoji: selected,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position, stickerKey: selected, storageUrl: '',
    });
  }

  return (
    <AddWidgetPopup
      title="Add a sticker 🎀"
      emoji={selected} onEmojiChange={setSelected}
      onCancel={onCancel} onAdd={handleAdd}
      addDisabled={false}
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-body text-muted uppercase tracking-widest">Pick a sticker</label>
        <div className="grid grid-cols-4 gap-2">
          {BUILT_IN_STICKERS.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={`h-12 rounded-xl text-2xl flex items-center justify-center border transition-all ${
                selected === s
                  ? 'border-terracotta bg-blush/20'
                  : 'border-[var(--border)] bg-sand/20 hover:border-sand'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </AddWidgetPopup>
  );
}
```

- [ ] **Step 5: Create remaining widget cards**

Create `src/components/widgets/MovieWidget.tsx`:

```typescript
import type { MovieWidget as MovieWidgetType } from '../../types/bouquet';

export default function MovieWidget({ widget }: { widget: MovieWidgetType }) {
  return (
    <div className="w-28 bg-white rounded-xl overflow-hidden border border-[var(--border)]" style={{ boxShadow: 'var(--shadow-card)' }}>
      <img src={widget.posterUrl} alt={widget.movieTitle} className="w-full h-36 object-cover" decoding="async" />
      <div className="px-2 py-2">
        <p className="text-[10px] font-semibold text-amber leading-snug line-clamp-2">{widget.movieTitle}</p>
        {widget.year && <p className="text-[9px] text-muted mt-0.5">{widget.year}</p>}
      </div>
    </div>
  );
}
```

Create `src/components/widgets/PinterestWidget.tsx`:

```typescript
import type { PinterestWidget as PinterestWidgetType } from '../../types/bouquet';

export default function PinterestWidget({ widget }: { widget: PinterestWidgetType }) {
  return (
    <div className="w-28 rounded-2xl overflow-hidden bg-white border border-[var(--border)]" style={{ boxShadow: 'var(--shadow-card)' }}>
      <img src={widget.imageUrl} alt={widget.caption} className="w-full h-36 object-cover" decoding="async" />
      {widget.caption && (
        <p className="px-2 py-1.5 text-[9px] text-amber italic font-display line-clamp-2">{widget.caption}</p>
      )}
    </div>
  );
}
```

Create `src/components/widgets/PhotoWidget.tsx`:

```typescript
import type { PhotoWidget as PhotoWidgetType } from '../../types/bouquet';

export default function PhotoWidget({ widget }: { widget: PhotoWidgetType }) {
  return (
    <div className="w-32 rounded-2xl overflow-hidden bg-white border-2 border-sand" style={{ boxShadow: 'var(--shadow-card)' }}>
      {widget.storageUrl
        ? <img src={widget.storageUrl} alt={widget.caption} className="w-full h-32 object-cover" decoding="async" />
        : <div className="w-full h-32 bg-sand/40 flex items-center justify-center text-3xl">📸</div>
      }
      <div className="bg-sand/30 px-2 py-1.5 flex items-center gap-1.5">
        <span className="text-xs">🎀</span>
        <p className="text-[9px] text-amber italic font-display truncate">
          {widget.caption || 'from the sender'}
        </p>
      </div>
    </div>
  );
}
```

Create `src/components/widgets/StickerWidget.tsx`:

```typescript
import type { StickerWidget as StickerWidgetType } from '../../types/bouquet';

export default function StickerWidget({ widget }: { widget: StickerWidgetType }) {
  return (
    <div className="text-5xl select-none" style={{ filter: 'drop-shadow(0 2px 6px rgba(107,76,42,0.2))' }}>
      {widget.stickerKey || widget.emoji}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/sender/popups/ src/components/widgets/
git commit -m "feat: Movie, Pinterest, Photo, Sticker popups and all widget canvas cards"
```

---

## Task 13: WidgetSidebar & BouquetCanvas

**Files:**
- Create: `src/components/sender/WidgetSidebar.tsx`
- Create: `src/components/sender/BouquetCanvas.tsx`
- Create: `tests/components/BouquetCanvas.test.tsx`

- [ ] **Step 1: Write failing canvas test**

Create `tests/components/BouquetCanvas.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BouquetCanvas from '../../src/components/sender/BouquetCanvas';
import type { Widget } from '../../src/types/bouquet';

const mockWidget: Widget = {
  id: '1', type: 'sticker', emoji: '🌸',
  rotation: 0, position: { x: 30, y: 40 },
  stickerKey: '🌸', storageUrl: '',
};

describe('BouquetCanvas', () => {
  it('renders placed widgets', () => {
    render(
      <BouquetCanvas
        widgets={[mockWidget]}
        onAddWidget={vi.fn()}
        onRemoveWidget={vi.fn()}
        activePopup={null}
        onClosePopup={vi.fn()}
      />
    );
    // Widget emoji visible on canvas
    const emojis = screen.getAllByText('🌸');
    expect(emojis.length).toBeGreaterThan(0);
  });

  it('enforces 12-widget maximum', () => {
    const twelveWidgets = Array.from({ length: 12 }, (_, i) => ({
      ...mockWidget, id: String(i),
    }));
    const onAddWidget = vi.fn();
    render(
      <BouquetCanvas
        widgets={twelveWidgets}
        onAddWidget={onAddWidget}
        onRemoveWidget={vi.fn()}
        activePopup={null}
        onClosePopup={vi.fn()}
      />
    );
    // Sidebar add buttons should be disabled
    const addBtns = screen.getAllByRole('button', { name: /add/i });
    addBtns.forEach((btn) => expect(btn).toBeDisabled());
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/components/BouquetCanvas.test.tsx
```

Expected: `Cannot find module`

- [ ] **Step 3: Create `src/components/sender/WidgetSidebar.tsx`**

```typescript
import type { WidgetType } from '../../types/bouquet';

const WIDGET_TYPES: { type: WidgetType; label: string; emoji: string }[] = [
  { type: 'spotify',   label: 'Song',    emoji: '🎵' },
  { type: 'youtube',   label: 'Video',   emoji: '▶' },
  { type: 'movie',     label: 'Movie',   emoji: '🎬' },
  { type: 'pinterest', label: 'Pin',     emoji: '📌' },
  { type: 'photo',     label: 'Photo',   emoji: '📸' },
  { type: 'sticker',   label: 'Sticker', emoji: '🎀' },
];

interface Props {
  onSelect: (type: WidgetType) => void;
  disabled: boolean;
}

export default function WidgetSidebar({ onSelect, disabled }: Props) {
  return (
    <aside className="flex flex-col gap-2 w-24 shrink-0">
      <p className="text-[10px] font-body text-muted uppercase tracking-widest text-center mb-1">
        Add
      </p>
      {WIDGET_TYPES.map(({ type, label, emoji }) => (
        <button
          key={type}
          name={`add ${label}`}
          onClick={() => onSelect(type)}
          disabled={disabled}
          className="flex flex-col items-center gap-1 bg-sand/40 hover:bg-sand/70 disabled:opacity-40 disabled:cursor-not-allowed border border-[var(--border)] rounded-xl py-3 transition-colors"
        >
          <span className="text-xl">{emoji}</span>
          <span className="text-[10px] font-body text-amber">{label}</span>
        </button>
      ))}
    </aside>
  );
}
```

- [ ] **Step 4: Create `src/components/sender/BouquetCanvas.tsx`**

```typescript
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import WidgetSidebar from './WidgetSidebar';
import SpotifyWidget   from '../widgets/SpotifyWidget';
import YoutubeWidget   from '../widgets/YoutubeWidget';
import MovieWidget     from '../widgets/MovieWidget';
import PinterestWidget from '../widgets/PinterestWidget';
import PhotoWidget     from '../widgets/PhotoWidget';
import StickerWidget   from '../widgets/StickerWidget';
import type { Widget, WidgetType } from '../../types/bouquet';

const MAX_WIDGETS = 12;

interface Props {
  widgets: Widget[];
  onAddWidget: (type: WidgetType, position: { x: number; y: number }) => void;
  onRemoveWidget: (id: string) => void;
  activePopup: WidgetType | null;
  onClosePopup: () => void;
}

function WidgetCard({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'spotify':   return <SpotifyWidget widget={widget} />;
    case 'youtube':   return <YoutubeWidget widget={widget} />;
    case 'movie':     return <MovieWidget widget={widget} />;
    case 'pinterest': return <PinterestWidget widget={widget} />;
    case 'photo':     return <PhotoWidget widget={widget} />;
    case 'sticker':   return <StickerWidget widget={widget} />;
  }
}

export default function BouquetCanvas({ widgets, onAddWidget, onRemoveWidget }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const atLimit = widgets.length >= MAX_WIDGETS;

  function handleSidebarSelect(type: WidgetType) {
    if (atLimit) return;
    // Place at a pseudo-random centre position
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 60;
    onAddWidget(type, { x, y });
  }

  function handleCanvasTap(e: React.MouseEvent<HTMLDivElement>) {
    // Mobile tap-to-place: used when drag is not active
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    return { x, y };
  }

  return (
    <div className="flex gap-4 h-full">
      <WidgetSidebar onSelect={handleSidebarSelect} disabled={atLimit} />

      <div
        ref={canvasRef}
        className="flex-1 relative bg-[var(--card-bg)] rounded-2xl border-2 border-dashed border-[var(--border)] overflow-hidden min-h-[400px]"
      >
        {widgets.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-muted italic font-body pointer-events-none">
            Add items from the sidebar ✦
          </p>
        )}

        {widgets.map((widget) => (
          <motion.div
            key={widget.id}
            className="absolute cursor-pointer group"
            style={{
              left: `${widget.position.x}%`,
              top:  `${widget.position.y}%`,
              rotate: widget.rotation,
              willChange: 'transform',
            }}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.05, zIndex: 50 }}
          >
            <WidgetCard widget={widget} />
            <button
              onClick={() => onRemoveWidget(widget.id)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-terracotta text-white rounded-full text-xs hidden group-hover:flex items-center justify-center leading-none"
            >
              ×
            </button>
          </motion.div>
        ))}

        {atLimit && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <span className="text-xs font-body text-muted italic bg-cream/80 px-3 py-1 rounded-full border border-[var(--border)]">
              12 widget maximum reached
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run test — expect pass**

```bash
npx vitest run tests/components/BouquetCanvas.test.tsx
```

Expected: `2 passed`

- [ ] **Step 6: Commit**

```bash
git add src/components/sender/WidgetSidebar.tsx src/components/sender/BouquetCanvas.tsx tests/components/BouquetCanvas.test.tsx
git commit -m "feat: WidgetSidebar and BouquetCanvas with drag-drop and 12-widget limit"
```

---

## Task 14: PlaylistSlot & CanvasStep (Step 2 Assembly)

**Files:**
- Create: `src/components/sender/PlaylistSlot.tsx`
- Create: `src/components/sender/CanvasStep.tsx` (previously a stub)
- Modify: `src/components/sender/CreatePage.tsx` (connect popup state)

- [ ] **Step 1: Create `src/components/sender/PlaylistSlot.tsx`**

```typescript
import { useState } from 'react';
import { useWidgetMeta } from '../../hooks/useWidgetMeta';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function PlaylistSlot({ value, onChange }: Props) {
  const type = value.includes('spotify') ? 'spotify' : 'youtube';
  const { meta, loading } = useWidgetMeta(
    value ? type : 'youtube',
    value,
  );

  return (
    <div className="flex flex-col gap-2 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎵</span>
        <div>
          <p className="text-xs font-body text-amber font-semibold">Background music</p>
          <p className="text-[10px] text-muted italic font-body">Plays when the card opens</p>
        </div>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste a Spotify or YouTube playlist URL…"
        className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
      />
      {loading && <p className="text-[10px] text-muted italic font-body">Fetching playlist…</p>}
      {meta && (
        <p className="text-[10px] text-stem italic font-body">
          ♪ {(meta.trackTitle || meta.videoTitle) as string} — ready ✓
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/sender/CanvasStep.tsx`**

```typescript
import { useState } from 'react';
import BouquetCanvas from './BouquetCanvas';
import PlaylistSlot from './PlaylistSlot';
import SpotifyPopup   from './popups/SpotifyPopup';
import YoutubePopup   from './popups/YoutubePopup';
import MoviePopup     from './popups/MoviePopup';
import PinterestPopup from './popups/PinterestPopup';
import PhotoPopup     from './popups/PhotoPopup';
import StickerPopup   from './popups/StickerPopup';
import type { ContainerType, Widget, WidgetType } from '../../types/bouquet';

interface Props {
  onBack: () => void;
  onFinish: (
    containerType: ContainerType,
    widgets: Widget[],
    playlistUrl: string | null,
    playlistType: 'spotify' | 'youtube' | null,
  ) => void;
  saving: boolean;
}

const CONTAINERS: { value: ContainerType; label: string; emoji: string; desc: string }[] = [
  { value: 'bouquet', label: 'Bouquet', emoji: '🌷', desc: 'Wrapping paper unfurls' },
  { value: 'basket',  label: 'Basket',  emoji: '🧺', desc: 'Peek inside a basket' },
];

export default function CanvasStep({ onBack, onFinish, saving }: Props) {
  const [containerType, setContainerType] = useState<ContainerType>('bouquet');
  const [widgets, setWidgets]             = useState<Widget[]>([]);
  const [playlistUrl, setPlaylistUrl]     = useState('');
  const [activePopup, setActivePopup]     = useState<WidgetType | null>(null);
  const [pendingPosition, setPendingPosition] = useState({ x: 30, y: 40 });

  function handleAddWidget(type: WidgetType, position: { x: number; y: number }) {
    setActivePopup(type);
    setPendingPosition(position);
  }

  function handleWidgetAdded(widget: Widget) {
    setWidgets((prev) => [...prev, widget]);
    setActivePopup(null);
  }

  function getPlaylistType(): 'spotify' | 'youtube' | null {
    if (!playlistUrl) return null;
    return playlistUrl.includes('spotify') ? 'spotify' : 'youtube';
  }

  function handleFinish() {
    onFinish(
      containerType,
      widgets,
      playlistUrl || null,
      getPlaylistType(),
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-12 max-w-4xl mx-auto w-full">
      <h2 className="font-display text-2xl italic text-amber text-center pt-2">
        Build the bouquet ✨
      </h2>

      {/* Container picker */}
      <div className="flex gap-3">
        {CONTAINERS.map((c) => (
          <button
            key={c.value}
            onClick={() => setContainerType(c.value)}
            className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border transition-all ${
              containerType === c.value
                ? 'border-terracotta bg-blush/20'
                : 'border-[var(--border)] bg-[var(--card-bg)] hover:border-sand'
            }`}
          >
            <span className="text-2xl">{c.emoji}</span>
            <div className="text-left">
              <p className="font-display italic text-sm text-amber">{c.label}</p>
              <p className="text-[10px] text-muted font-body">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Canvas */}
      <BouquetCanvas
        widgets={widgets}
        onAddWidget={handleAddWidget}
        onRemoveWidget={(id) => setWidgets((prev) => prev.filter((w) => w.id !== id))}
        activePopup={activePopup}
        onClosePopup={() => setActivePopup(null)}
      />

      {/* Playlist */}
      <PlaylistSlot value={playlistUrl} onChange={setPlaylistUrl} />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-sm font-body italic text-muted hover:text-amber transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleFinish}
          disabled={saving}
          className="bg-terracotta text-white font-body italic rounded-full py-3 px-8 transition-opacity disabled:opacity-50 hover:opacity-90"
        >
          {saving ? 'Saving…' : 'Share this bouquet ✦'}
        </button>
      </div>

      {/* Widget popups */}
      {activePopup === 'spotify'   && <SpotifyPopup   onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'youtube'   && <YoutubePopup   onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'movie'     && <MoviePopup     onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'pinterest' && <PinterestPopup onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'photo'     && <PhotoPopup     onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'sticker'   && <StickerPopup   onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
    </div>
  );
}
```

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Smoke test in browser — full sender flow**

```bash
npm run dev
```

Walk through: fill in name + message → pick card style → Next → pick container → add a Sticker widget → paste a playlist URL → Share. Expected: no crashes, SharePage appears with a link.

- [ ] **Step 5: Commit**

```bash
git add src/components/sender/
git commit -m "feat: PlaylistSlot and CanvasStep — complete sender flow assembled"
```

---

## Task 15: Firebase Firestore Rules + Final Wiring

**Files:**
- Create: `firestore.rules`
- Modify: `src/App.tsx` (no changes needed — BouquetPage placeholder is sufficient for Plan A)

- [ ] **Step 1: Create `firestore.rules`**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bouquets/{bouquetId} {
      allow read: if true;
      allow create: if request.resource.data.widgets.size() <= 12
        && request.resource.data.message.size() <= 500
        && request.resource.data.recipientName.size() <= 60;
      allow update, delete: if false;
    }
  }
}
```

- [ ] **Step 2: Create `storage.rules`**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cards/{bouquetId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
    match /widgets/{bouquetId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
    match /stickers/{bouquetId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

- [ ] **Step 3: Deploy rules**

```bash
firebase deploy --only firestore:rules,storage
```

Expected: `Deploy complete!`

- [ ] **Step 4: Run full test suite one final time**

```bash
npx vitest run
```

Expected: all tests pass, 0 failures.

- [ ] **Step 5: Final commit**

```bash
git add firestore.rules storage.rules
git commit -m "feat: Firestore and Storage security rules — Plan A complete"
```

---

## Plan A Complete

The sender can now:
1. Write a card with recipient name, message, and card style choice
2. Build a bouquet canvas with up to 12 widgets (Spotify, YouTube, Movie, Pinterest, Photo, Sticker)
3. Each widget is added via a pop-up with auto-fetched metadata and an emoji cover picker
4. Choose bouquet or basket as the container
5. Add a background playlist (Spotify or YouTube)
6. Save to Firestore and receive a shareable link

**Next:** Plan B implements the receiver experience — landing page, card animations, container reveals, and emoji flips.
