import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WidgetReveal from './WidgetReveal';
import EmojiCover from './EmojiCover';
import WidgetCard from './WidgetCard';
import type { Widget } from '../../types/bouquet';

interface Props {
  widgets: Widget[];
}

const FALLBACK_FLOWERS = ['🌸', '🌺', '🌼', '🌻', '🌷'];
const PEEK_ROTS   = [-20, -9, 0, 9, 20];
const PEEK_BUMPS  = [4, 16, 22, 12, 2];

// SVG ribbon bow — two ellipse loops + center knot + tails, all in terracotta
function RibbonBow() {
  const shadow    = '#7a3520';
  const base      = '#b54e30';
  const mid       = '#c86840';
  const highlight = '#e08860';
  return (
    <svg viewBox="0 0 76 42" width="66" height="36" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M35 26 Q29 34 25 41" stroke={mid}    strokeWidth="5"   strokeLinecap="round" fill="none" />
      <path d="M41 26 Q47 34 51 41" stroke={mid}    strokeWidth="5"   strokeLinecap="round" fill="none" />
      <path d="M35 26 Q29 34 25 41" stroke={shadow} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.45" />
      <path d="M41 26 Q47 34 51 41" stroke={shadow} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.45" />
      <ellipse cx="19" cy="18" rx="19" ry="10" fill={shadow}    transform="rotate(-28 19 18)" />
      <ellipse cx="19" cy="17" rx="15" ry="7.5" fill={base}    transform="rotate(-28 19 17)" />
      <ellipse cx="15" cy="13" rx="7"  ry="3.5" fill={highlight} opacity="0.4" transform="rotate(-28 15 13)" />
      <ellipse cx="57" cy="18" rx="19" ry="10" fill={shadow}    transform="rotate(28 57 18)" />
      <ellipse cx="57" cy="17" rx="15" ry="7.5" fill={base}    transform="rotate(28 57 17)" />
      <ellipse cx="61" cy="13" rx="7"  ry="3.5" fill={highlight} opacity="0.4" transform="rotate(28 61 13)" />
      <ellipse cx="38" cy="20" rx="9" ry="6.5" fill={shadow} />
      <ellipse cx="38" cy="19" rx="6" ry="4.5" fill={base} />
      <ellipse cx="36" cy="17" rx="3" ry="2"   fill={highlight} opacity="0.5" />
    </svg>
  );
}

export default function BouquetContainer({ widgets }: Props) {
  const [unwrapped, setUnwrapped]   = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef<Set<string>>(new Set());
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const reveal = (id: string) =>
    setRevealedIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  const peekFlowers = [
    ...widgets.slice(0, 5).map(w => w.emoji),
    ...FALLBACK_FLOWERS,
  ].slice(0, 5);

  const expandedWidget = widgets.find(w => w.id === expandedId) ?? null;

  return (
    <div className="min-h-screen overflow-hidden relative bg-cream">

      {/* Kraft paper background — expands from a circle at centre */}
      <AnimatePresence>
        {unwrapped && (
          <motion.div
            key="paper"
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, #f0d8b0 0%, #e4c48a 50%, #c8a060 100%)',
              zIndex: 2,
            }}
            initial={{ clipPath: 'circle(0% at 50% 58%)' }}
            animate={{ clipPath: 'circle(150% at 50% 58%)' }}
            transition={{ type: 'spring', stiffness: 55, damping: 22 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {unwrapped && (
          <motion.div
            key="texture"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent 0px, transparent 39px, rgba(0,0,0,0.025) 39px, rgba(0,0,0,0.025) 40px)',
              zIndex: 3,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Emoji widgets — scatter in after paper unfurls.
          Two-step reveal:
            1) tap emoji → flips to small widget card (in place)
            2) tap small card → opens expanded modal
          Stickers only do step 1.                                          */}
      <div ref={canvasRef} className="absolute inset-0" style={{ zIndex: 10 }}>
        {unwrapped && widgets.map((widget, i) => {
          const isRevealed = revealedIds.has(widget.id);
          const canExpand  = isRevealed && widget.type !== 'sticker';

          const activate = () => {
            if (draggedRef.current.has(widget.id)) return;
            if (!isRevealed) reveal(widget.id);
            else if (widget.type !== 'sticker') setExpandedId(widget.id);
          };

          return (
            <motion.div
              key={widget.id}
              style={{
                position: 'absolute',
                left: `${widget.position.x}%`,
                top:  `${widget.position.y}%`,
                cursor: 'grab',
                touchAction: 'none',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.45 + i * 0.07 }}
              drag
              dragMomentum={false}
              dragElastic={0}
              dragConstraints={canvasRef}
              whileDrag={{ scale: 1.08, zIndex: 50, cursor: 'grabbing' }}
              onDragStart={() => draggedRef.current.add(widget.id)}
              onDragEnd={() => {
                if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
                dragTimeoutRef.current = setTimeout(() => {
                  draggedRef.current.delete(widget.id);
                }, 0);
              }}
              onTap={activate}
              role="button"
              tabIndex={0}
              aria-label={
                !isRevealed   ? `Reveal ${widget.emoji}` :
                canExpand     ? `Expand ${widget.emoji}` :
                                widget.emoji
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  activate();
                }
              }}
            >
              <EmojiCover
                emoji={widget.emoji}
                revealed={isRevealed}
                rotation={widget.rotation}
              >
                <WidgetCard widget={widget} />
              </EmojiCover>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded widget modal — backdrop is flex so child is always centred */}
      <AnimatePresence>
        {expandedWidget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(60,30,10,0.4)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedId(null)}
          >
            <motion.div
              className={`w-full bg-[var(--card-bg)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-popup)] p-5 relative max-h-[85vh] overflow-y-auto ${expandedWidget.type === 'youtube' ? 'max-w-2xl' : 'max-w-sm'}`}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpandedId(null)}
                className="absolute top-3 right-4 text-muted hover:text-amber transition-colors text-xl leading-none z-10"
                aria-label="Close"
              >
                ×
              </button>
              <WidgetReveal widget={expandedWidget} onClose={() => setExpandedId(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Closed bouquet — slides away on unwrap */}
      <AnimatePresence>
        {!unwrapped && (
          <motion.div
            key="bouquet"
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ zIndex: 20 }}
            exit={{ opacity: 0, y: 50, scale: 0.85, rotate: -10 }}
            transition={{ duration: 0.3, ease: 'easeIn' }}
          >
            <div className="flex flex-col items-center" style={{ marginTop: -50 }}>
              <div
                className="flex items-end justify-center"
                style={{ marginBottom: -14, position: 'relative', zIndex: 2 }}
              >
                {peekFlowers.map((emoji, i) => (
                  <span
                    key={i}
                    className="text-[2.6rem] select-none"
                    style={{
                      display: 'inline-block',
                      transform: `rotate(${PEEK_ROTS[i]}deg) translateY(${-PEEK_BUMPS[i]}px)`,
                      marginLeft: i === 0 ? 0 : -8,
                    }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>

              <div
                style={{
                  width: 220,
                  height: 260,
                  background: [
                    'linear-gradient(175deg, #f0ddb8 0%, #dbb87a 28%, #c09050 62%, #a07238 100%)',
                    'linear-gradient(120deg, transparent 38%, rgba(0,0,0,0.07) 39%, transparent 54%)',
                    'linear-gradient(60deg,  transparent 44%, rgba(255,255,255,0.09) 45%, transparent 58%)',
                  ].join(', '),
                  clipPath: 'polygon(14% 0%, 86% 0%, 58% 100%, 42% 100%)',
                  position: 'relative',
                  zIndex: 1,
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  position: 'relative',
                  zIndex: 3,
                  marginTop: -76,
                  filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.22))',
                }}
              >
                <RibbonBow />
              </div>
            </div>

            <motion.button
              className="mt-10 bg-terracotta text-cream font-body italic text-sm rounded-full py-2.5 px-8 shadow-[0_4px_14px_rgba(196,132,92,0.4)]"
              onClick={() => setUnwrapped(true)}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Unwrap 🌷
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
