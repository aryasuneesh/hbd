import { useState } from 'react';
import { motion } from 'framer-motion';
import CardContent from './CardContent';
import type { OccasionType } from '../../types/bouquet';
import { OCCASIONS, DEFAULT_OCCASION } from '../../lib/occasions';

interface Props {
  recipientName: string;
  message: string;
  cardPhotoUrl: string | null;
  occasion?: OccasionType;
  onOpen: () => void;
  onSeeGifts: () => void;
}

export default function CardFold({ recipientName, message, cardPhotoUrl, occasion, onOpen, onSeeGifts }: Props) {
  const [flipped, setFlipped]       = useState(false);
  const [fullyOpen, setFullyOpen]   = useState(false);
  const occ = OCCASIONS[occasion ?? DEFAULT_OCCASION];

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6" style={{ perspective: '1200px' }}>
        <motion.div
          style={{
            width: 340,
            minHeight: 480,
            position: 'relative',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
          animate={{ rotateY: flipped ? -180 : 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          onAnimationComplete={() => { if (flipped) { setFullyOpen(true); onOpen(); } }}
        >
          {/* Back face — in normal flow so it drives the parent's height
              with the message content. Rotated 180° so it faces away by default. */}
          <div
            className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] min-h-[480px] flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {fullyOpen && (
              <CardContent
                recipientName={recipientName}
                message={message}
                cardPhotoUrl={cardPhotoUrl}
                occasion={occasion}
              />
            )}
          </div>

          {/* Front face — absolute overlay above the back face. inset:0 makes
              it match the back face's intrinsic height, so longer messages
              expand both faces together without clipping the back face. */}
          {!fullyOpen && (
            <div
              className="absolute inset-0 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col items-center justify-center gap-4 cursor-pointer select-none"
              style={{ backfaceVisibility: 'hidden' }}
              onClick={() => { if (!flipped) setFlipped(true); }}
            >
              <span className="text-6xl">{occ.cardEmoji}</span>
              <span className="font-display text-base italic text-amber">Tap to open</span>
            </div>
          )}
        </motion.div>

        {fullyOpen && (
          <motion.button
            onClick={onSeeGifts}
            className="font-display italic text-terracotta text-base px-6 py-2 rounded-full border border-terracotta/30 bg-cream/60 hover:bg-cream transition-colors"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileTap={{ scale: 0.97 }}
          >
            {occ.seeGiftsLabel}
          </motion.button>
        )}
      </div>
    </div>
  );
}
