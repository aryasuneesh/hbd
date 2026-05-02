import { useState } from 'react';
import { motion } from 'framer-motion';
import EmojiCover from './EmojiCover';
import WidgetReveal from './WidgetReveal';
import type { Widget } from '../../types/bouquet';

interface Props {
  widgets: Widget[];
}

export default function BouquetContainer({ widgets }: Props) {
  const [unwrapped, setUnwrapped] = useState(false);
  const [revealed, setReveal]     = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-end pb-0 overflow-hidden">

      {/* Wrapping paper + bouquet */}
      <div className="relative flex flex-col items-center" style={{ minHeight: '70vh', width: '100%' }}>

        {/* Stems */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 1 }}>
          {['-8deg', '0deg', '6deg', '-4deg', '10deg'].map((r, i) => (
            <div
              key={i}
              className="w-0.5 bg-stem rounded-full"
              style={{ height: 80 + i * 12, transform: `rotate(${r})`, transformOrigin: 'bottom center' }}
            />
          ))}
        </div>

        {/* Left paper flap */}
        <motion.div
          className="absolute bottom-16 rounded-tl-3xl rounded-bl-3xl"
          style={{
            width: 160, height: 260,
            background: 'linear-gradient(135deg, #e8c9a0, #d4a870)',
            transformOrigin: 'bottom right',
            willChange: 'transform',
            left: 'calc(50% - 160px)',
            zIndex: 2,
          }}
          animate={unwrapped ? { rotate: -80, x: -40 } : { rotate: 0, x: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        />

        {/* Right paper flap */}
        <motion.div
          className="absolute bottom-16 rounded-tr-3xl rounded-br-3xl"
          style={{
            width: 160, height: 260,
            background: 'linear-gradient(225deg, #e8c9a0, #c4a060)',
            transformOrigin: 'bottom left',
            willChange: 'transform',
            left: '50%',
            zIndex: 2,
          }}
          animate={unwrapped ? { rotate: 80, x: 40 } : { rotate: 0, x: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        />

        {/* Ribbon bow */}
        <motion.div
          className="absolute bottom-64 left-1/2 -translate-x-1/2 text-3xl z-10"
          animate={unwrapped ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          🎀
        </motion.div>

        {/* Emoji covers / widgets */}
        <motion.div
          className="absolute inset-0"
          style={{ zIndex: 3 }}
          animate={unwrapped ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: unwrapped ? 0.4 : 0, type: 'spring', stiffness: 120, damping: 20 }}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              style={{
                position: 'absolute',
                left: `${widget.position.x}%`,
                top:  `${widget.position.y}%`,
              }}
            >
              <EmojiCover
                emoji={widget.emoji}
                revealed={!!revealed[widget.id]}
                onReveal={() => setReveal((r) => ({ ...r, [widget.id]: true }))}
                rotation={widget.rotation}
              >
                <WidgetReveal widget={widget} />
              </EmojiCover>
            </div>
          ))}
        </motion.div>

        {/* Tap to unwrap prompt */}
        {!unwrapped && (
          <motion.button
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 bg-terracotta text-white font-body italic text-sm rounded-full py-2.5 px-8 shadow-[0_4px_14px_rgba(196,132,92,0.35)]"
            onClick={() => setUnwrapped(true)}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Unwrap 🌷
          </motion.button>
        )}
      </div>
    </div>
  );
}
