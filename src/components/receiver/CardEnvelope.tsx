import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardContent from './CardContent';

interface Props {
  recipientName: string;
  message: string;
  cardPhotoUrl: string | null;
  onOpen: () => void;
  onSeeGifts: () => void;
}

type Phase = 'closed' | 'flap-open' | 'card-rising' | 'reading';

// ── Geometry ──────────────────────────────────────────────────────────────────
const ENV_W  = 280;
const ENV_H  = 160;   // body rectangle height
const FLAP_H = 90;    // flap triangle height
const CARD_W = 220;
const CARD_H = 240;

// Scene wrapper height: space above envelope for the card to rise into + body
const SCENE_H = CARD_H + ENV_H; // 400 px

// The envelope outer wrapper spans flap + body together (FLAP_H + ENV_H = 250 px).
// We position it so that the BODY section (starting at FLAP_H inside the wrapper)
// aligns with CARD_H in scene coords — keeping the card hidden inside the body.
const WRAP_TOP = CARD_H - FLAP_H; // 150 px from scene top

// Card y-positions within the scene (top edge of the card div)
const CARD_Y_HIDDEN = CARD_H + ENV_H - 30;  // 370 – card tucked deep inside
const CARD_Y_RISEN  = 50;                    // card fully above envelope

export default function CardEnvelope({
  recipientName,
  message,
  cardPhotoUrl,
  onOpen: _onOpen,
  onSeeGifts,
}: Props) {
  const [phase, setPhase] = useState<Phase>('closed');

  function handleTap() {
    if (phase !== 'closed') return;
    setPhase('flap-open');
    setTimeout(() => setPhase('card-rising'), 700);
    setTimeout(() => setPhase('reading'), 2300);
  }

  const cardRisen = phase === 'card-rising' || phase === 'reading';

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <AnimatePresence>

        {/* ── ENVELOPE SCENE ─────────────────────────────────────────────── */}
        {phase !== 'reading' && (
          <motion.div
            key="envelope-scene"
            className="relative cursor-pointer select-none"
            style={{ width: ENV_W, height: SCENE_H }}
            onClick={handleTap}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
          >

            {/* ── Layering plan (scene stacking context) ──────────────────────
                 z:10  body back wall (rectangle, light sand)
                 z:12  card (rises from inside)
                 z:13  front pocket (pentagon w/ V-notch top — the OPENING)
                 z:14  flap when CLOSED  (covers everything up top)
                 z: 9  flap when OPEN   (drops behind card so card emerges in front)
                 z:25  cream bleed (hides any card tail below the envelope)

                 Result: card rises BEHIND the front pocket but IN FRONT of
                 the back wall, so it appears to slide up through the V-notch
                 opening — exactly like pulling a card out of an envelope.   */}

            {/* ① CARD ─ slides up through the pocket opening ─────────────── */}
            <motion.div
              className="absolute bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden flex items-center justify-center"
              style={{
                width: CARD_W,
                height: CARD_H,
                left: (ENV_W - CARD_W) / 2,
                zIndex: 12,
              }}
              initial={{ top: CARD_Y_HIDDEN }}
              animate={{ top: cardRisen ? CARD_Y_RISEN : CARD_Y_HIDDEN }}
              transition={{ type: 'spring', stiffness: 80, damping: 16 }}
            >
              <div className="flex flex-col items-center gap-2 p-6">
                <span className="text-3xl">🌷</span>
                <span className="font-display text-sm italic text-amber">for you…</span>
              </div>
            </motion.div>

            {/* ② ENVELOPE ────────────────────────────────────────────────────
                 Wrapper has NO z-index, so it does NOT create its own
                 stacking context — its children layer in the scene context
                 alongside the card via their explicit z-indices.            */}
            <div
              style={{
                position: 'absolute',
                top: WRAP_TOP,               // 150
                left: 0,
                width: ENV_W,
                height: FLAP_H + ENV_H,      // 250
              }}
            >
              {/* ─ BODY BACK WALL (z:10) ─────────────────────────────────── */}
              <div
                className="absolute bg-sand/60 rounded-b-xl border border-[var(--border)]"
                style={{
                  top: FLAP_H,
                  left: 0,
                  right: 0,
                  height: ENV_H,
                  overflow: 'hidden',
                  zIndex: 10,
                }}
              />

              {/* ─ FRONT POCKET (z:13) ───────────────────────────────────────
                   Lives in the BOTTOM HALF of the body. Its top edge is a
                   downward V-notch (sides high, centre dipped) — that notch
                   is the envelope's "lip", through which the card emerges.
                   Above the pocket, the body's back wall is visible — that's
                   the interior of the envelope showing through the open flap.

                   Polygon vertices (0% top → 100% bottom of this div):
                     (0,100)  bottom-left
                     (0,  0)  ←─ left lip TOP (= flap hinge point)
                     (50, 50) ←─ V-notch bottom centre (= body centre)
                     (100, 0) ←─ right lip TOP (= flap hinge point)
                     (100,100) bottom-right                                   */}
              <div
                style={{
                  position: 'absolute',
                  top: FLAP_H,
                  left: 0,
                  width: ENV_W,
                  height: ENV_H,
                  backgroundColor: 'rgba(180, 150, 92, 0.55)',
                  clipPath:
                    'polygon(0 100%, 0 0, 50% 50%, 100% 0, 100% 100%)',
                  borderBottomLeftRadius: '0.75rem',
                  borderBottomRightRadius: '0.75rem',
                  zIndex: 13,
                  pointerEvents: 'none',
                  boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.04)',
                }}
              />

              {/* ─ FLAP — z:14 closed, z:9 open ──────────────────────────────
                   z swaps when phase changes so the open flap drops BEHIND
                   the card. The triangle still rotates -180° around its
                   top-edge hinge (which sits on the body's top edge).        */}
              <div
                style={{
                  position: 'absolute',
                  top: FLAP_H,
                  left: 0,
                  width: ENV_W,
                  height: FLAP_H,
                  perspective: 800,
                  perspectiveOrigin: '50% 0%',
                  zIndex: phase === 'closed' ? 14 : 9,
                  pointerEvents: 'none',
                }}
              >
                <motion.div
                  style={{
                    width: ENV_W,
                    height: FLAP_H,
                    backgroundColor: '#cba96e',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    transformOrigin: '50% 0%',
                    willChange: 'transform',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                  }}
                  animate={phase !== 'closed' ? { rotateX: -180 } : { rotateX: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            {/* ③ CREAM BLEED  (z = 25) ─ hides card's lower tail ──────────── */}
            <div
              className="bg-cream pointer-events-none"
              style={{
                position: 'absolute',
                top: CARD_H + ENV_H,
                left: -120,
                right: -120,
                height: CARD_H + 60,
                zIndex: 25,
              }}
            />

            {/* Tap prompt */}
            {phase === 'closed' && (
              <p
                className="absolute text-center text-xs font-body italic text-muted"
                style={{ top: CARD_H + ENV_H + 14, left: 0, right: 0, zIndex: 30 }}
              >
                Tap to open ✨
              </p>
            )}
          </motion.div>
        )}

        {/* ── READING STATE ──────────────────────────────────────────────── */}
        {phase === 'reading' && (
          <motion.div
            key="card-reading"
            className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-popup)] w-full max-w-sm overflow-hidden flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <CardContent
              recipientName={recipientName}
              message={message}
              cardPhotoUrl={cardPhotoUrl}
              onSeeGifts={onSeeGifts}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
