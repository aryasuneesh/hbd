import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WidgetReveal from './WidgetReveal';
import EmojiCover from './EmojiCover';
import WidgetCard from './WidgetCard';
import type { Widget } from '../../types/bouquet';

interface Props {
  widgets: Widget[];
}

export default function BasketContainer({ widgets }: Props) {
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

  const expandedWidget = widgets.find(w => w.id === expandedId) ?? null;

  return (
    <div className="min-h-screen overflow-hidden relative bg-cream">

      {/* ── Woven basket interior — unfurls from a circle at centre ─────── */}
      <AnimatePresence>
        {unwrapped && (
          <motion.div
            key="weave"
            className="absolute inset-0"
            style={{
              background: [
                // warm wicker base gradient
                'radial-gradient(ellipse at 50% 50%, #e8d4b0 0%, #c4a070 100%)',
              ].join(', '),
              zIndex: 2,
            }}
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            transition={{ type: 'spring', stiffness: 55, damping: 22 }}
          />
        )}
      </AnimatePresence>

      {/* Wicker weave texture — fades in after the unfurl */}
      <AnimatePresence>
        {unwrapped && (
          <motion.div
            key="weave-texture"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                // diagonal weave strands
                'repeating-linear-gradient(45deg, transparent 0px, transparent 11px, rgba(122,80,40,0.10) 11px, rgba(122,80,40,0.10) 13px)',
                // counter-diagonal weave strands
                'repeating-linear-gradient(-45deg, transparent 0px, transparent 11px, rgba(80,50,20,0.07) 11px, rgba(80,50,20,0.07) 13px)',
                // horizontal warp shadows
                'repeating-linear-gradient(0deg, transparent 0px, transparent 22px, rgba(0,0,0,0.04) 22px, rgba(0,0,0,0.04) 24px)',
              ].join(', '),
              zIndex: 3,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Inset rim shadow — sells the "looking down into the basket" feel */}
      <AnimatePresence>
        {unwrapped && (
          <motion.div
            key="rim-shadow"
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 80px 24px rgba(80,50,20,0.35)',
              zIndex: 4,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* ── Emoji widgets — scatter in after weave unfurls.
              Two-step reveal: emoji → small card → expanded modal.        */}
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

        {unwrapped && (
          <motion.p
            className="absolute bottom-6 left-0 right-0 text-center text-[11px] font-body italic text-[#7a4f30]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            tap any treat to unwrap it ✦
          </motion.p>
        )}
      </div>

      {/* ── Expanded widget modal ───────────────────────────────────────── */}
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

      {/* ── Closed basket — slides away on tap ──────────────────────────── */}
      <AnimatePresence>
        {!unwrapped && (
          <motion.div
            key="basket"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
            style={{ zIndex: 20 }}
            exit={{ opacity: 0, y: 50, scale: 0.85 }}
            transition={{ duration: 0.3, ease: 'easeIn' }}
            onClick={() => setUnwrapped(true)}
          >
            <div className="flex flex-col items-center">
              {/* Handle */}
              <div className="w-20 h-8 border-4 border-[#a08050] rounded-full border-b-0 -mb-1" />
              {/* Rim */}
              <div
                className="w-40 h-3 rounded-t-md"
                style={{ background: '#c4a870', border: '2px solid #a08050' }}
              />
              {/* Body */}
              <div
                className="w-40 h-24 rounded-b-2xl overflow-hidden border-2 border-t-0 relative"
                style={{
                  borderColor: '#a08050',
                  background:
                    'repeating-linear-gradient(90deg, #c4a870 0px, #c4a870 8px, #b89860 8px, #b89860 16px)',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, transparent 0px, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 12px)',
                  }}
                />
              </div>
            </div>

            <p className="text-xs font-body italic text-muted mt-3">
              Tap to peek inside ✦
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
