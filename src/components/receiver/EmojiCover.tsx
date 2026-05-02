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
            className="block min-w-[44px] min-h-[44px] flex items-center justify-center"
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
