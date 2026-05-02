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
