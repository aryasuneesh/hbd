import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpotifyWidget   from '../widgets/SpotifyWidget';
import YoutubeWidget   from '../widgets/YoutubeWidget';
import MovieWidget     from '../widgets/MovieWidget';
import PinterestWidget from '../widgets/PinterestWidget';
import PhotoWidget     from '../widgets/PhotoWidget';
import StickerWidget   from '../widgets/StickerWidget';
import SpotifyExpanded   from './expanded/SpotifyExpanded';
import YoutubeExpanded   from './expanded/YoutubeExpanded';
import MovieExpanded     from './expanded/MovieExpanded';
import PinterestExpanded from './expanded/PinterestExpanded';
import PhotoExpanded     from './expanded/PhotoExpanded';
import type { Widget } from '../../types/bouquet';

function WidgetCard({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'spotify':   return <SpotifyWidget widget={widget} />;
    case 'youtube':   return <YoutubeWidget widget={widget} />;
    case 'movie':     return <MovieWidget widget={widget} />;
    case 'pinterest': return <PinterestWidget widget={widget} />;
    case 'photo':     return <PhotoWidget widget={widget} />;
    case 'sticker':   return <StickerWidget widget={widget} />;
  }
}

function ExpandedView({ widget, onClose }: { widget: Widget; onClose: () => void }) {
  switch (widget.type) {
    case 'spotify':   return <SpotifyExpanded   widget={widget} onClose={onClose} />;
    case 'youtube':   return <YoutubeExpanded   widget={widget} onClose={onClose} />;
    case 'movie':     return <MovieExpanded     widget={widget} onClose={onClose} />;
    case 'pinterest': return <PinterestExpanded widget={widget} onClose={onClose} />;
    case 'photo':     return <PhotoExpanded     widget={widget} onClose={onClose} />;
    case 'sticker':   return null;
  }
}

export default function WidgetReveal({ widget }: { widget: Widget }) {
  const [expanded, setExpanded] = useState(false);

  if (widget.type === 'sticker') {
    return <StickerWidget widget={widget} />;
  }

  return (
    <>
      <button onClick={() => setExpanded(true)} className="block hover:scale-105 transition-transform">
        <WidgetCard widget={widget} />
      </button>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              className="fixed inset-0 bg-amber/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
            />
            <motion.div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-[var(--card-bg)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-popup)] p-6 max-w-sm mx-auto"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            >
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4 text-muted hover:text-amber transition-colors text-xl leading-none"
              >
                ×
              </button>
              <ExpandedView widget={widget} onClose={() => setExpanded(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
