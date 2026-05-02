import { useState } from 'react';
import { motion } from 'framer-motion';
import EmojiCover from './EmojiCover';
import WidgetReveal from './WidgetReveal';
import type { Widget } from '../../types/bouquet';

interface Props {
  widgets: Widget[];
}

export default function BasketContainer({ widgets }: Props) {
  const [zoomedIn, setZoomedIn] = useState(false);
  const [revealed, setReveal]   = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center overflow-hidden">

      {/* Outer basket (zooms out of frame when entering) */}
      <motion.div
        className="relative flex flex-col items-center cursor-pointer"
        animate={zoomedIn ? { scale: 8, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
        style={{ willChange: 'transform' }}
        onClick={!zoomedIn ? () => setZoomedIn(true) : undefined}
      >
        {/* Handle */}
        <div className="w-20 h-8 border-4 border-[#a08050] rounded-full border-b-0 -mb-1" />
        {/* Rim */}
        <div className="w-40 h-3 rounded-t-md" style={{ background: '#c4a870', border: '2px solid #a08050' }} />
        {/* Body */}
        <div
          className="w-40 h-24 rounded-b-2xl overflow-hidden border-2 border-t-0 relative"
          style={{
            borderColor: '#a08050',
            background: 'repeating-linear-gradient(90deg, #c4a870 0px, #c4a870 8px, #b89860 8px, #b89860 16px)',
          }}
        >
          <div className="absolute inset-0" style={{
            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 12px)',
          }} />
        </div>
        {!zoomedIn && (
          <p className="text-xs font-body italic text-muted mt-3">Tap to peek inside ✦</p>
        )}
      </motion.div>

      {/* Interior top-down view — fades in after zoom */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={zoomedIn ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: zoomedIn ? 0.5 : 0, duration: 0.4 }}
        style={{ pointerEvents: zoomedIn ? 'auto' : 'none' }}
      >
        {/* Basket interior — oval frame */}
        <div
          className="relative"
          style={{
            width: 'min(90vw, 420px)',
            height: 'min(90vw, 420px)',
            borderRadius: '50%',
            border: '32px solid #c4a870',
            boxShadow: 'inset 0 0 0 4px #a08050, 0 0 0 4px #a08050',
            background: 'radial-gradient(ellipse at 50% 50%, #e8d4b0 0%, #c4a070 100%)',
            overflow: 'hidden',
          }}
        >
          {/* Weave texture overlay */}
          <div className="absolute inset-0" style={{
            background: 'repeating-linear-gradient(45deg, transparent 0px, transparent 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 12px)',
          }} />

          {/* Scattered emoji widgets */}
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

          <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-body italic text-[#8a6040]">
            tap any treat to unwrap it ✦
          </p>
        </div>
      </motion.div>

    </div>
  );
}
