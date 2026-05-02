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
