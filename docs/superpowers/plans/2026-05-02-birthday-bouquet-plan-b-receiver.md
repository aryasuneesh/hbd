# Birthday Bouquet — Plan B: Receiver Experience

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full receiver experience — landing page, card-open animation (fold + envelope), container reveal (bouquet unfurl + basket zoom), emoji-flip widget reveal, widget expanded states, and background playlist player.

**Architecture:** All animation via Framer Motion using only `transform` and `opacity`. The receiver flow is a state machine (`landing → opening → card → transitioning → container → exploring`). The `revealed` state of each widget is ephemeral React state — never written to Firestore. BouquetPage loads the Firestore document by ID from the URL.

**Tech Stack:** React 18, TypeScript, Framer Motion, Firebase Firestore (read-only on receiver side).

**Prerequisite:** Plan A must be complete. The `src/types/bouquet.ts`, `src/lib/firestore.ts`, and `src/components/receiver/BouquetPage.tsx` (currently a placeholder) are all in place.

---

## File Map

```
src/components/receiver/
├── BouquetPage.tsx           # Replace placeholder — orchestrates full receiver state machine
├── LandingScreen.tsx         # "Open it ✨" screen
├── PlaylistPlayer.tsx        # Hidden iframe — Spotify or YouTube embed
├── CardFold.tsx              # Book-fold card animation
├── CardEnvelope.tsx          # Envelope-lift card animation
├── CardContent.tsx           # Card interior: message, photo, "See your gifts" CTA
├── ContainerTransition.tsx   # Routes to BouquetContainer or BasketContainer
├── BouquetContainer.tsx      # Wrapping paper unfurl + emoji scatter
├── BasketContainer.tsx       # Basket zoom-in + interior top-down view
├── EmojiCover.tsx            # Tappable emoji with rotateY flip to widget
├── WidgetReveal.tsx          # Widget card shown post-flip
└── expanded/
    ├── SpotifyExpanded.tsx
    ├── YoutubeExpanded.tsx
    ├── MovieExpanded.tsx
    ├── PinterestExpanded.tsx
    └── PhotoExpanded.tsx

tests/components/receiver/
├── LandingScreen.test.tsx
├── EmojiCover.test.tsx
└── BouquetPage.test.tsx
```

---

## Task 1: LandingScreen

**Files:**
- Create: `src/components/receiver/LandingScreen.tsx`
- Create: `tests/components/receiver/LandingScreen.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/receiver/LandingScreen.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingScreen from '../../../src/components/receiver/LandingScreen';

describe('LandingScreen', () => {
  it('shows bouquet tagline when containerType is bouquet', () => {
    render(
      <LandingScreen
        senderName="Arya"
        containerType="bouquet"
        recipientName="Priya"
        onOpen={vi.fn()}
      />
    );
    expect(screen.getByText(/little bouquet/i)).toBeInTheDocument();
  });

  it('shows basket tagline when containerType is basket', () => {
    render(
      <LandingScreen
        senderName="Arya"
        containerType="basket"
        recipientName="Priya"
        onOpen={vi.fn()}
      />
    );
    expect(screen.getByText(/cute gift basket/i)).toBeInTheDocument();
  });

  it('calls onOpen when the button is clicked', () => {
    const onOpen = vi.fn();
    render(
      <LandingScreen
        senderName="Arya"
        containerType="bouquet"
        recipientName="Priya"
        onOpen={onOpen}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /open it/i }));
    expect(onOpen).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/components/receiver/LandingScreen.test.tsx
```

Expected: `Cannot find module`

- [ ] **Step 3: Create `src/components/receiver/LandingScreen.tsx`**

```typescript
import { motion } from 'framer-motion';
import type { ContainerType } from '../../types/bouquet';

interface Props {
  senderName: string;
  recipientName: string;
  containerType: ContainerType;
  onOpen: () => void;
}

const TAGLINES: Record<ContainerType, string> = {
  bouquet: 'Someone sent you a little bouquet 🌸',
  basket:  'Someone sent you a cute gift basket 🧺',
};

export default function LandingScreen({ senderName, recipientName, containerType, onOpen }: Props) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <motion.div
        className="bg-[var(--card-bg)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-popup)] p-10 max-w-sm w-full flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <motion.div
          className="text-5xl"
          animate={{ rotate: [0, -8, 8, -4, 0] }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {containerType === 'bouquet' ? '✉️' : '🧺'}
        </motion.div>

        <div className="flex flex-col gap-1">
          <p className="font-body text-sm text-muted">For {recipientName},</p>
          <h1 className="font-display text-xl italic text-amber leading-snug">
            {TAGLINES[containerType]}
          </h1>
        </div>

        <div className="w-10 h-px bg-sand" />

        <p className="font-body text-xs text-muted italic">from {senderName}</p>

        <motion.button
          onClick={onOpen}
          className="bg-terracotta text-white font-body italic rounded-full py-3 px-10 text-sm shadow-[0_4px_14px_rgba(196,132,92,0.35)] hover:opacity-90 transition-opacity"
          whileTap={{ scale: 0.97 }}
          aria-label="Open it"
        >
          Open it ✨
        </motion.button>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/components/receiver/LandingScreen.test.tsx
```

Expected: `3 passed`

- [ ] **Step 5: Commit**

```bash
git add src/components/receiver/LandingScreen.tsx tests/components/receiver/
git commit -m "feat: LandingScreen with container-aware tagline"
```

---

## Task 2: PlaylistPlayer

**Files:**
- Create: `src/components/receiver/PlaylistPlayer.tsx`

- [ ] **Step 1: Create `src/components/receiver/PlaylistPlayer.tsx`**

```typescript
import { useEffect, useRef } from 'react';

interface Props {
  url: string;
  type: 'spotify' | 'youtube';
  playing: boolean;
}

function buildEmbedUrl(url: string, type: 'spotify' | 'youtube'): string {
  if (type === 'spotify') {
    // Convert open.spotify.com/playlist/ID → embed URL
    const match = url.match(/spotify\.com\/(?:playlist|album|track)\/([a-zA-Z0-9]+)/);
    if (!match) return '';
    return `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator&autoplay=1`;
  }
  // YouTube: extract list ID
  const match = url.match(/[?&]list=([^&]+)/);
  if (!match) return '';
  return `https://www.youtube.com/embed/videoseries?list=${match[1]}&autoplay=1&enablejsapi=1`;
}

export default function PlaylistPlayer({ url, type, playing }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const embedUrl  = buildEmbedUrl(url, type);

  useEffect(() => {
    if (!playing || !iframeRef.current || type !== 'youtube') return;
    // Unmute YouTube via postMessage after card-open gesture
    iframeRef.current.contentWindow?.postMessage(
      '{"event":"command","func":"unMute","args":""}',
      '*',
    );
  }, [playing, type]);

  if (!embedUrl) return null;

  return (
    <iframe
      ref={iframeRef}
      src={embedUrl}
      allow="autoplay; encrypted-media"
      className="hidden"
      title="background playlist"
      width="0"
      height="0"
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/receiver/PlaylistPlayer.tsx
git commit -m "feat: PlaylistPlayer hidden iframe for Spotify and YouTube background music"
```

---

## Task 3: CardContent

**Files:**
- Create: `src/components/receiver/CardContent.tsx`

- [ ] **Step 1: Create `src/components/receiver/CardContent.tsx`**

```typescript
import { motion } from 'framer-motion';

interface Props {
  recipientName: string;
  message: string;
  cardPhotoUrl: string | null;
  onSeeGifts: () => void;
}

export default function CardContent({ recipientName, message, cardPhotoUrl, onSeeGifts }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 p-8 max-w-xs w-full">
      <div className="text-2xl tracking-widest">🌸 ✨ 🌼</div>

      <h2 className="font-display text-2xl italic text-amber text-center leading-snug">
        Happy Birthday,<br />{recipientName}
      </h2>

      <div className="w-8 h-px bg-sand" />

      {cardPhotoUrl && (
        <motion.img
          src={cardPhotoUrl}
          alt=""
          className="w-full rounded-2xl object-cover max-h-48"
          decoding="async"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}

      <p className="font-body text-sm text-amber/80 text-center leading-relaxed italic">
        "{message}"
      </p>

      <div className="w-8 h-px bg-sand" />

      <motion.button
        onClick={onSeeGifts}
        className="text-sm font-display italic text-terracotta hover:opacity-70 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.97 }}
      >
        See your gifts 🌷
      </motion.button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/receiver/CardContent.tsx
git commit -m "feat: CardContent with message, photo, and See your gifts CTA"
```

---

## Task 4: CardFold Animation

**Files:**
- Create: `src/components/receiver/CardFold.tsx`

- [ ] **Step 1: Create `src/components/receiver/CardFold.tsx`**

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import CardContent from './CardContent';

interface Props {
  recipientName: string;
  message: string;
  cardPhotoUrl: string | null;
  onOpen: () => void;       // called when animation completes → music starts
  onSeeGifts: () => void;   // called when receiver taps "See your gifts"
}

export default function CardFold({ recipientName, message, cardPhotoUrl, onOpen, onSeeGifts }: Props) {
  const [opened, setOpened] = useState(false);

  function handleOpen() {
    setOpened(true);
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="relative" style={{ perspective: '1000px' }}>

        {/* Static left panel */}
        <motion.div
          className="inline-flex"
          style={{ transformOrigin: 'right center' }}
        >
          <div
            className="w-64 min-h-80 bg-[var(--card-bg)] rounded-l-2xl border border-[var(--border)] shadow-[var(--shadow-card)] flex items-center justify-center"
            style={{ borderRight: 'none' }}
          >
            <div className="text-4xl opacity-30">🌸</div>
          </div>

          {/* Right panel — hinges open */}
          <motion.div
            className="w-64 min-h-80 bg-[var(--card-bg)] rounded-r-2xl border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden flex items-center justify-center"
            style={{ transformOrigin: 'left center', willChange: 'transform' }}
            animate={opened ? { rotateY: -175 } : { rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            onAnimationComplete={() => { if (opened) onOpen(); }}
          >
            {!opened ? (
              <button
                onClick={handleOpen}
                className="flex flex-col items-center gap-3 text-center p-6"
              >
                <span className="text-3xl">🌷</span>
                <span className="font-display text-sm italic text-amber">Tap to open</span>
              </button>
            ) : (
              <CardContent
                recipientName={recipientName}
                message={message}
                cardPhotoUrl={cardPhotoUrl}
                onSeeGifts={onSeeGifts}
              />
            )}
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/receiver/CardFold.tsx
git commit -m "feat: CardFold book-fold animation with spring physics"
```

---

## Task 5: CardEnvelope Animation

**Files:**
- Create: `src/components/receiver/CardEnvelope.tsx`

- [ ] **Step 1: Create `src/components/receiver/CardEnvelope.tsx`**

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import CardContent from './CardContent';

interface Props {
  recipientName: string;
  message: string;
  cardPhotoUrl: string | null;
  onOpen: () => void;
  onSeeGifts: () => void;
}

type Phase = 'closed' | 'flap-open' | 'card-rising' | 'reading';

export default function CardEnvelope({ recipientName, message, cardPhotoUrl, onOpen, onSeeGifts }: Props) {
  const [phase, setPhase] = useState<Phase>('closed');

  function handleTap() {
    if (phase === 'closed') {
      setPhase('flap-open');
      setTimeout(() => setPhase('card-rising'), 600);
      setTimeout(() => { setPhase('reading'); onOpen(); }, 1400);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div
        className="relative cursor-pointer select-none"
        onClick={phase === 'closed' || phase === 'flap-open' ? handleTap : undefined}
        style={{ width: 280 }}
      >
        {/* Envelope body */}
        <div
          className="relative bg-sand/60 rounded-b-xl border border-[var(--border)]"
          style={{ height: 180, overflow: 'hidden' }}
        >
          {/* V-fold lines inside */}
          <div className="absolute bottom-0 left-0 w-0 h-0"
            style={{ borderBottom: '90px solid rgba(196,168,112,0.4)', borderRight: '140px solid transparent' }} />
          <div className="absolute bottom-0 right-0 w-0 h-0"
            style={{ borderBottom: '90px solid rgba(180,152,96,0.4)', borderLeft: '140px solid transparent' }} />

          {/* Card rising from inside */}
          <motion.div
            className="absolute bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-[var(--shadow-card)] flex items-center justify-center overflow-hidden"
            style={{ width: 220, left: 30, willChange: 'transform' }}
            initial={{ bottom: -160, height: 200 }}
            animate={
              phase === 'card-rising' || phase === 'reading'
                ? { bottom: phase === 'reading' ? 200 : 40 }
                : { bottom: -160 }
            }
            transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          >
            {phase === 'reading' ? (
              <CardContent
                recipientName={recipientName}
                message={message}
                cardPhotoUrl={cardPhotoUrl}
                onSeeGifts={onSeeGifts}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 p-6">
                <span className="text-2xl">🌷</span>
                <span className="font-display text-xs italic text-amber">for you…</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Envelope flap */}
        <motion.div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 0,
            borderLeft: '140px solid transparent',
            borderRight: '140px solid transparent',
            borderBottom: '90px solid #e8c9a0',
            transformOrigin: 'top center',
            willChange: 'transform',
          }}
          animate={phase !== 'closed' ? { rotateX: -160 } : { rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
        />

        {phase === 'closed' && (
          <p className="text-center text-xs font-body italic text-muted mt-3">Tap to open ✨</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/receiver/CardEnvelope.tsx
git commit -m "feat: CardEnvelope animation — flap opens, card rises"
```

---

## Task 6: EmojiCover with Card-Flip Reveal

**Files:**
- Create: `src/components/receiver/EmojiCover.tsx`
- Create: `tests/components/receiver/EmojiCover.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/receiver/EmojiCover.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmojiCover from '../../../src/components/receiver/EmojiCover';

describe('EmojiCover', () => {
  it('shows emoji when not revealed', () => {
    render(
      <EmojiCover emoji="🌸" revealed={false} onReveal={vi.fn()} rotation={5}>
        <div>widget content</div>
      </EmojiCover>
    );
    expect(screen.getByText('🌸')).toBeInTheDocument();
  });

  it('calls onReveal when tapped while hidden', () => {
    const onReveal = vi.fn();
    render(
      <EmojiCover emoji="🌸" revealed={false} onReveal={onReveal} rotation={5}>
        <div>widget</div>
      </EmojiCover>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onReveal).toHaveBeenCalledOnce();
  });

  it('does not call onReveal when already revealed', () => {
    const onReveal = vi.fn();
    render(
      <EmojiCover emoji="🌸" revealed={true} onReveal={onReveal} rotation={5}>
        <div>widget</div>
      </EmojiCover>
    );
    // No button when revealed
    expect(screen.queryByRole('button')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/components/receiver/EmojiCover.test.tsx
```

Expected: `Cannot find module`

- [ ] **Step 3: Create `src/components/receiver/EmojiCover.tsx`**

```typescript
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  emoji: string;
  revealed: boolean;
  onReveal: () => void;
  rotation: number;
  children: ReactNode;  // the widget card shown on the back face
}

export default function EmojiCover({ emoji, revealed, onReveal, rotation, children }: Props) {
  return (
    <div
      className="absolute"
      style={{
        // position is set by the parent container
        willChange: 'transform',
      }}
    >
      <motion.div
        style={{
          rotate: rotation,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      >
        {/* Front face — emoji */}
        {!revealed && (
          <button
            onClick={onReveal}
            className="block"
            style={{
              backfaceVisibility: 'hidden',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              lineHeight: 1,
            }}
            aria-label={`Reveal ${emoji}`}
          >
            <span
              className="text-6xl select-none"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(107,76,42,0.2))' }}
            >
              {emoji}
            </span>
          </button>
        )}

        {/* Back face — widget card */}
        {revealed && (
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {children}
          </div>
        )}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/components/receiver/EmojiCover.test.tsx
```

Expected: `3 passed`

- [ ] **Step 5: Commit**

```bash
git add src/components/receiver/EmojiCover.tsx tests/components/receiver/
git commit -m "feat: EmojiCover with rotateY card-flip reveal — permanent state"
```

---

## Task 7: WidgetReveal (Expanded States)

**Files:**
- Create: `src/components/receiver/WidgetReveal.tsx`
- Create: `src/components/receiver/expanded/SpotifyExpanded.tsx`
- Create: `src/components/receiver/expanded/YoutubeExpanded.tsx`
- Create: `src/components/receiver/expanded/MovieExpanded.tsx`
- Create: `src/components/receiver/expanded/PinterestExpanded.tsx`
- Create: `src/components/receiver/expanded/PhotoExpanded.tsx`

- [ ] **Step 1: Create expanded views**

Create `src/components/receiver/expanded/SpotifyExpanded.tsx`:

```typescript
import type { SpotifyWidget } from '../../../types/bouquet';

export default function SpotifyExpanded({ widget, onClose }: { widget: SpotifyWidget; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#1a0a00] rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #c4845c, #1a0a00)' }}>
        <div className="flex items-center gap-4 p-5">
          <img src={widget.albumArtUrl} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-lg" />
          <div className="min-w-0">
            <p className="text-base font-semibold text-white truncate">{widget.trackTitle}</p>
            <p className="text-sm text-white/60">{widget.artistName}</p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="h-1 bg-white/10 rounded-full">
            <div className="w-2/5 h-full rounded-full" style={{ background: '#1DB954' }} />
          </div>
        </div>
      </div>
      <a
        href={widget.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-sm font-body italic text-terracotta hover:opacity-70 transition-opacity"
      >
        Open in Spotify →
      </a>
    </div>
  );
}
```

Create `src/components/receiver/expanded/YoutubeExpanded.tsx`:

```typescript
import type { YoutubeWidget } from '../../../types/bouquet';

function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0` : '';
}

export default function YoutubeExpanded({ widget, onClose }: { widget: YoutubeWidget; onClose: () => void }) {
  const embedUrl = getYoutubeEmbedUrl(widget.youtubeUrl);
  return (
    <div className="flex flex-col gap-3">
      {embedUrl ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-xl"
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
            title={widget.videoTitle}
          />
        </div>
      ) : (
        <img src={widget.thumbnailUrl} alt={widget.videoTitle} className="w-full rounded-xl object-cover" />
      )}
      <p className="text-sm font-semibold text-amber">{widget.videoTitle}</p>
      <p className="text-xs text-muted">{widget.channelName}</p>
    </div>
  );
}
```

Create `src/components/receiver/expanded/MovieExpanded.tsx`:

```typescript
import type { MovieWidget } from '../../../types/bouquet';

export default function MovieExpanded({ widget }: { widget: MovieWidget; onClose: () => void }) {
  return (
    <div className="flex gap-4">
      <img src={widget.posterUrl} alt={widget.movieTitle} className="w-28 rounded-xl object-cover shrink-0" decoding="async" />
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="font-display text-lg italic text-amber">{widget.movieTitle}</h3>
        {widget.year     && <p className="text-xs text-muted font-body">{widget.year}</p>}
        {widget.director && <p className="text-xs text-muted font-body italic line-clamp-3">{widget.director}</p>}
        <a href={widget.pageUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs font-body italic text-terracotta hover:opacity-70 transition-opacity mt-1">
          View on site →
        </a>
      </div>
    </div>
  );
}
```

Create `src/components/receiver/expanded/PinterestExpanded.tsx`:

```typescript
import type { PinterestWidget } from '../../../types/bouquet';

export default function PinterestExpanded({ widget }: { widget: PinterestWidget; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <img src={widget.imageUrl} alt={widget.caption} className="w-full rounded-2xl object-cover max-h-80" decoding="async" />
      {widget.caption && <p className="text-sm font-display italic text-amber text-center">{widget.caption}</p>}
    </div>
  );
}
```

Create `src/components/receiver/expanded/PhotoExpanded.tsx`:

```typescript
import type { PhotoWidget } from '../../../types/bouquet';

export default function PhotoExpanded({ widget }: { widget: PhotoWidget; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      {widget.storageUrl
        ? <img src={widget.storageUrl} alt={widget.caption} className="w-full rounded-2xl object-cover max-h-80" decoding="async" />
        : <div className="w-full h-48 bg-sand/40 rounded-2xl flex items-center justify-center text-4xl">📸</div>
      }
      {widget.caption && <p className="text-sm font-display italic text-amber text-center">{widget.caption}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/receiver/WidgetReveal.tsx`**

```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpotifyWidget   from '../widgets/SpotifyWidget';
import YoutubeWidget   from '../widgets/YoutubeWidget';
import MovieWidget     from '../widgets/MovieWidget';
import PinterestWidget from '../widgets/PinterestWidget';
import PhotoWidget     from '../widgets/PhotoWidget';
import StickerWidget   from '../widgets/StickerWidget';
import SpotifyExpanded   from './expanded/SpotifyExpanded';
import YoutubeExpanded   from './expanded/YoutubeExpanded';
import MovieExpanded     from './expanded/MovieExpanded';
import PinterestExpanded from './expanded/PinterestExpanded';
import PhotoExpanded     from './expanded/PhotoExpanded';
import type { Widget } from '../../types/bouquet';

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

function ExpandedView({ widget, onClose }: { widget: Widget; onClose: () => void }) {
  switch (widget.type) {
    case 'spotify':   return <SpotifyExpanded   widget={widget} onClose={onClose} />;
    case 'youtube':   return <YoutubeExpanded   widget={widget} onClose={onClose} />;
    case 'movie':     return <MovieExpanded     widget={widget} onClose={onClose} />;
    case 'pinterest': return <PinterestExpanded widget={widget} onClose={onClose} />;
    case 'photo':     return <PhotoExpanded     widget={widget} onClose={onClose} />;
    case 'sticker':   return null;
  }
}

export default function WidgetReveal({ widget }: { widget: Widget }) {
  const [expanded, setExpanded] = useState(false);

  if (widget.type === 'sticker') {
    return <StickerWidget widget={widget} />;
  }

  return (
    <>
      <button onClick={() => setExpanded(true)} className="block hover:scale-105 transition-transform">
        <WidgetCard widget={widget} />
      </button>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              className="fixed inset-0 bg-amber/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
            />
            <motion.div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-[var(--card-bg)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-popup)] p-6 max-w-sm mx-auto"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            >
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4 text-muted hover:text-amber transition-colors text-xl leading-none"
              >
                ×
              </button>
              <ExpandedView widget={widget} onClose={() => setExpanded(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/receiver/
git commit -m "feat: WidgetReveal with tap-to-expand modal and all expanded views"
```

---

## Task 8: BouquetContainer (Wrapping Paper Unfurl)

**Files:**
- Create: `src/components/receiver/BouquetContainer.tsx`

- [ ] **Step 1: Create `src/components/receiver/BouquetContainer.tsx`**

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import EmojiCover from './EmojiCover';
import WidgetReveal from './WidgetReveal';
import type { Widget } from '../../types/bouquet';

interface Props {
  widgets: Widget[];
}

export default function BouquetContainer({ widgets }: Props) {
  const [unwrapped, setUnwrapped] = useState(false);
  const [revealed, setReveal]     = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-end pb-0 overflow-hidden">

      {/* Wrapping paper + bouquet */}
      <div className="relative flex flex-col items-center" style={{ minHeight: '70vh', width: '100%' }}>

        {/* Stems */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 1 }}>
          {['-8deg', '0deg', '6deg', '-4deg', '10deg'].map((r, i) => (
            <div
              key={i}
              className="w-0.5 bg-stem rounded-full"
              style={{ height: 80 + i * 12, transform: `rotate(${r})`, transformOrigin: 'bottom center' }}
            />
          ))}
        </div>

        {/* Left paper flap */}
        <motion.div
          className="absolute bottom-16 rounded-tl-3xl rounded-bl-3xl"
          style={{
            width: 160, height: 260,
            background: 'linear-gradient(135deg, #e8c9a0, #d4a870)',
            transformOrigin: 'bottom right',
            willChange: 'transform',
            left: 'calc(50% - 160px)',
            zIndex: 2,
          }}
          animate={unwrapped ? { rotate: -80, x: -40 } : { rotate: 0, x: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        />

        {/* Right paper flap */}
        <motion.div
          className="absolute bottom-16 rounded-tr-3xl rounded-br-3xl"
          style={{
            width: 160, height: 260,
            background: 'linear-gradient(225deg, #e8c9a0, #c4a060)',
            transformOrigin: 'bottom left',
            willChange: 'transform',
            left: '50%',
            zIndex: 2,
          }}
          animate={unwrapped ? { rotate: 80, x: 40 } : { rotate: 0, x: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        />

        {/* Ribbon bow */}
        <motion.div
          className="absolute bottom-64 left-1/2 -translate-x-1/2 text-3xl z-10"
          animate={unwrapped ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          🎀
        </motion.div>

        {/* Emoji covers / widgets */}
        <motion.div
          className="absolute inset-0"
          style={{ zIndex: 3 }}
          animate={unwrapped ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: unwrapped ? 0.4 : 0, type: 'spring', stiffness: 120, damping: 20 }}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              style={{
                position: 'absolute',
                left: `${widget.position.x}%`,
                top:  `${widget.position.y}%`,
              }}
            >
              <EmojiCover
                emoji={widget.emoji}
                revealed={!!revealed[widget.id]}
                onReveal={() => setReveal((r) => ({ ...r, [widget.id]: true }))}
                rotation={widget.rotation}
              >
                <WidgetReveal widget={widget} />
              </EmojiCover>
            </div>
          ))}
        </motion.div>

        {/* Tap to unwrap prompt */}
        {!unwrapped && (
          <motion.button
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 bg-terracotta text-white font-body italic text-sm rounded-full py-2.5 px-8 shadow-[0_4px_14px_rgba(196,132,92,0.35)]"
            onClick={() => setUnwrapped(true)}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Unwrap 🌷
          </motion.button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/receiver/BouquetContainer.tsx
git commit -m "feat: BouquetContainer — wrapping paper unfurl with spring physics"
```

---

## Task 9: BasketContainer (Top-Down Zoom)

**Files:**
- Create: `src/components/receiver/BasketContainer.tsx`

- [ ] **Step 1: Create `src/components/receiver/BasketContainer.tsx`**

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import EmojiCover from './EmojiCover';
import WidgetReveal from './WidgetReveal';
import type { Widget } from '../../types/bouquet';

interface Props {
  widgets: Widget[];
}

export default function BasketContainer({ widgets }: Props) {
  const [zoomedIn, setZoomedIn] = useState(false);
  const [revealed, setReveal]   = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center overflow-hidden">

      {/* Outer basket (zooms out of frame when entering) */}
      <motion.div
        className="relative flex flex-col items-center cursor-pointer"
        animate={zoomedIn ? { scale: 8, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
        style={{ willChange: 'transform' }}
        onClick={!zoomedIn ? () => setZoomedIn(true) : undefined}
      >
        {/* Handle */}
        <div className="w-20 h-8 border-4 border-[#a08050] rounded-full border-b-0 -mb-1" />
        {/* Rim */}
        <div className="w-40 h-3 rounded-t-md" style={{ background: '#c4a870', border: '2px solid #a08050' }} />
        {/* Body */}
        <div
          className="w-40 h-24 rounded-b-2xl overflow-hidden border-2 border-t-0 relative"
          style={{
            borderColor: '#a08050',
            background: 'repeating-linear-gradient(90deg, #c4a870 0px, #c4a870 8px, #b89860 8px, #b89860 16px)',
          }}
        >
          <div className="absolute inset-0" style={{
            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 12px)',
          }} />
        </div>
        {!zoomedIn && (
          <p className="text-xs font-body italic text-muted mt-3">Tap to peek inside ✦</p>
        )}
      </motion.div>

      {/* Interior top-down view — fades in after zoom */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={zoomedIn ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: zoomedIn ? 0.5 : 0, duration: 0.4 }}
        style={{ pointerEvents: zoomedIn ? 'auto' : 'none' }}
      >
        {/* Basket interior — oval frame */}
        <div
          className="relative"
          style={{
            width: 'min(90vw, 420px)',
            height: 'min(90vw, 420px)',
            borderRadius: '50%',
            border: '32px solid #c4a870',
            boxShadow: 'inset 0 0 0 4px #a08050, 0 0 0 4px #a08050',
            background: 'radial-gradient(ellipse at 50% 50%, #e8d4b0 0%, #c4a070 100%)',
            overflow: 'hidden',
          }}
        >
          {/* Weave texture overlay */}
          <div className="absolute inset-0" style={{
            background: 'repeating-linear-gradient(45deg, transparent 0px, transparent 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 12px)',
          }} />

          {/* Scattered emoji widgets */}
          {widgets.map((widget) => (
            <div
              key={widget.id}
              style={{
                position: 'absolute',
                left: `${widget.position.x}%`,
                top:  `${widget.position.y}%`,
              }}
            >
              <EmojiCover
                emoji={widget.emoji}
                revealed={!!revealed[widget.id]}
                onReveal={() => setReveal((r) => ({ ...r, [widget.id]: true }))}
                rotation={widget.rotation}
              >
                <WidgetReveal widget={widget} />
              </EmojiCover>
            </div>
          ))}

          <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-body italic text-[#8a6040]">
            tap any treat to unwrap it ✦
          </p>
        </div>
      </motion.div>

    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/receiver/BasketContainer.tsx
git commit -m "feat: BasketContainer — top-down zoom with oval interior and emoji scatter"
```

---

## Task 10: BouquetPage — Full Receiver State Machine

**Files:**
- Replace: `src/components/receiver/BouquetPage.tsx`
- Create: `tests/components/receiver/BouquetPage.test.tsx`

- [ ] **Step 1: Write failing smoke test**

Create `tests/components/receiver/BouquetPage.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../../src/lib/firestore', () => ({
  getBouquet: vi.fn().mockResolvedValue({
    cardStyle: 'fold',
    containerType: 'bouquet',
    recipientName: 'Priya',
    message: 'Happy Birthday!',
    cardPhotoUrl: null,
    playlistUrl: null,
    playlistType: null,
    widgets: [],
  }),
}));

import BouquetPage from '../../../src/components/receiver/BouquetPage';

describe('BouquetPage', () => {
  it('shows landing screen on load', async () => {
    render(<BouquetPage bouquetId="abc123" />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /open it/i })).toBeInTheDocument()
    );
  });

  it('shows not found message for missing bouquet', async () => {
    const { getBouquet } = await import('../../../src/lib/firestore');
    vi.mocked(getBouquet).mockResolvedValueOnce(null);
    render(<BouquetPage bouquetId="missing" />);
    await waitFor(() =>
      expect(screen.getByText(/couldn't find/i)).toBeInTheDocument()
    );
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/components/receiver/BouquetPage.test.tsx
```

Expected: failing (placeholder component doesn't implement state machine)

- [ ] **Step 3: Replace `src/components/receiver/BouquetPage.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { getBouquet } from '../../lib/firestore';
import LandingScreen from './LandingScreen';
import CardFold from './CardFold';
import CardEnvelope from './CardEnvelope';
import BouquetContainer from './BouquetContainer';
import BasketContainer from './BasketContainer';
import PlaylistPlayer from './PlaylistPlayer';
import type { Bouquet } from '../../types/bouquet';

type ReceiverState =
  | { phase: 'loading' }
  | { phase: 'notfound' }
  | { phase: 'landing';     bouquet: Bouquet }
  | { phase: 'card';        bouquet: Bouquet; musicPlaying: boolean }
  | { phase: 'container';   bouquet: Bouquet };

export default function BouquetPage({ bouquetId }: { bouquetId: string }) {
  const [state, setState] = useState<ReceiverState>({ phase: 'loading' });

  useEffect(() => {
    getBouquet(bouquetId).then((b) => {
      if (!b) setState({ phase: 'notfound' });
      else setState({ phase: 'landing', bouquet: b });
    });
  }, [bouquetId]);

  if (state.phase === 'loading') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-display italic text-muted animate-pulse">Loading your gift… 🌸</p>
      </div>
    );
  }

  if (state.phase === 'notfound') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <p className="font-display italic text-amber text-center text-lg">
          We couldn't find this bouquet 🥀<br />
          <span className="text-sm text-muted">The link may have expired or been mistyped.</span>
        </p>
      </div>
    );
  }

  const { bouquet } = state;

  if (state.phase === 'landing') {
    return (
      <LandingScreen
        senderName="your friend"
        recipientName={bouquet.recipientName}
        containerType={bouquet.containerType}
        onOpen={() => setState({ phase: 'card', bouquet, musicPlaying: false })}
      />
    );
  }

  if (state.phase === 'card') {
    const CardComponent = bouquet.cardStyle === 'fold' ? CardFold : CardEnvelope;
    return (
      <>
        {bouquet.playlistUrl && bouquet.playlistType && (
          <PlaylistPlayer
            url={bouquet.playlistUrl}
            type={bouquet.playlistType}
            playing={state.musicPlaying}
          />
        )}
        <CardComponent
          recipientName={bouquet.recipientName}
          message={bouquet.message}
          cardPhotoUrl={bouquet.cardPhotoUrl}
          onOpen={() => setState({ phase: 'card', bouquet, musicPlaying: true })}
          onSeeGifts={() => setState({ phase: 'container', bouquet })}
        />
      </>
    );
  }

  if (state.phase === 'container') {
    const ContainerComponent =
      bouquet.containerType === 'bouquet' ? BouquetContainer : BasketContainer;
    return (
      <>
        {bouquet.playlistUrl && bouquet.playlistType && (
          <PlaylistPlayer
            url={bouquet.playlistUrl}
            type={bouquet.playlistType}
            playing={true}
          />
        )}
        <ContainerComponent widgets={bouquet.widgets} />
      </>
    );
  }

  return null;
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/components/receiver/BouquetPage.test.tsx
```

Expected: `2 passed`

- [ ] **Step 5: Commit**

```bash
git add src/components/receiver/BouquetPage.tsx tests/components/receiver/BouquetPage.test.tsx
git commit -m "feat: BouquetPage state machine — full receiver flow assembled"
```

---

## Task 11: Mobile Polish Pass

**Files:**
- Modify: `src/components/receiver/BouquetContainer.tsx`
- Modify: `src/components/receiver/BasketContainer.tsx`
- Modify: `src/components/receiver/EmojiCover.tsx`
- Modify: `src/components/sender/BouquetCanvas.tsx`

- [ ] **Step 1: Ensure touch targets are 44px minimum in EmojiCover**

In `src/components/receiver/EmojiCover.tsx`, update the button:

```typescript
// Replace the button's className with:
className="block min-w-[44px] min-h-[44px] flex items-center justify-center"
```

- [ ] **Step 2: Add `touch-action: none` to draggable widgets on canvas**

In `src/components/sender/BouquetCanvas.tsx`, update the `motion.div` for each widget:

```typescript
// Add to the style prop of the motion.div:
style={{
  left: `${widget.position.x}%`,
  top:  `${widget.position.y}%`,
  rotate: widget.rotation,
  willChange: 'transform',
  touchAction: 'none',   // ← add this
}}
```

- [ ] **Step 3: Add `preload` link for fonts in `index.html`**

In `index.html`, add inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Lato:wght@300;400;700&display=swap">
```

- [ ] **Step 4: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 5: Smoke test on mobile viewport**

```bash
npm run dev
```

Open DevTools → Toggle device toolbar → iPhone 14 (390 × 844). Walk through the full receiver flow: landing → open card → see gifts → unwrap/zoom basket → reveal emojis. Expected: no horizontal scroll, no layout shift, all tap targets reachable.

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "feat: mobile polish — touch targets, touch-action, font preload — Plan B complete"
```

---

## Plan B Complete

The receiver can now:
1. Open a bouquet link and see a container-aware landing screen
2. Watch the card open (book fold or envelope lift) with spring physics
3. Hear background music start the moment the card opens
4. Tap "See your gifts" to transition to the container
5. Unwrap the bouquet (paper flaps peel back) or zoom into the basket (top-down oval)
6. Tap each emoji to card-flip reveal the widget beneath it — permanently
7. Tap any revealed widget to expand it in a modal (Spotify, YouTube embed, movie, image)

**The full birthday bouquet experience is now shippable.**
