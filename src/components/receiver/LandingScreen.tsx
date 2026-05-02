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
