import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  emoji: string;
  revealed: boolean;
  rotation: number;
  children: ReactNode;  // the widget card shown on the back face
}

// Pure presentation: a flip card whose front shows an emoji and back shows
// the widget. Tap/click handling lives on the parent so it can coexist with
// drag without competing for the pointer gesture.
export default function EmojiCover({ emoji, revealed, rotation, children }: Props) {
  return (
    <div className="absolute" style={{ willChange: 'transform' }}>
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
          <div
            className="min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden', lineHeight: 1 }}
          >
            <span
              className="text-6xl select-none"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(107,76,42,0.2))' }}
            >
              {emoji}
            </span>
          </div>
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
