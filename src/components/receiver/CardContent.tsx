import { motion } from 'framer-motion';
import type { OccasionType } from '../../types/bouquet';
import { OCCASIONS, DEFAULT_OCCASION } from '../../lib/occasions';

interface Props {
  recipientName: string;
  message: string;
  cardPhotoUrl: string | null;
  occasion?: OccasionType;
  onSeeGifts: () => void;
}

export default function CardContent({ recipientName, message, cardPhotoUrl, occasion, onSeeGifts }: Props) {
  const occ = OCCASIONS[occasion ?? DEFAULT_OCCASION];

  return (
    <div className="flex flex-col items-center gap-5 p-8 max-w-xs w-full">
      <div className="text-2xl tracking-widest">{occ.decorEmojis}</div>

      <h2 className="font-display text-2xl italic text-amber text-center leading-snug">
        {occ.cardGreeting}<br />{recipientName}
      </h2>

      <div className="w-8 h-px bg-sand" />

      {cardPhotoUrl && (
        <motion.img
          src={cardPhotoUrl}
          alt=""
          className="w-full rounded-2xl object-cover max-h-48"
          decoding="async"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}

      <p className="font-body text-sm text-amber/80 text-center leading-relaxed italic">
        "{message}"
      </p>

      <div className="w-8 h-px bg-sand" />

      <motion.button
        onClick={onSeeGifts}
        className="text-sm font-display italic text-terracotta hover:opacity-70 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.97 }}
      >
        {occ.seeGiftsLabel}
      </motion.button>
    </div>
  );
}
