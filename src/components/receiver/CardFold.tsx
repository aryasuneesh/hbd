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

export default function CardFold({ recipientName, message, cardPhotoUrl, onOpen, onSeeGifts }: Props) {
  const [flipped, setFlipped]       = useState(false);
  const [fullyOpen, setFullyOpen]   = useState(false);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div style={{ perspective: '1200px' }}>
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
          {/* Front face — the cover */}
          <div
            className="absolute inset-0 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col items-center justify-center gap-4 cursor-pointer select-none"
            style={{ backfaceVisibility: 'hidden' }}
            onClick={() => { if (!flipped) setFlipped(true); }}
          >
            <span className="text-6xl">🌸</span>
            <span className="font-display text-base italic text-amber">Tap to open</span>
          </div>

          {/* Back face — the message */}
          <div
            className="absolute inset-0 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] flex items-center justify-center overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {fullyOpen && (
              <CardContent
                recipientName={recipientName}
                message={message}
                cardPhotoUrl={cardPhotoUrl}
                onSeeGifts={onSeeGifts}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
