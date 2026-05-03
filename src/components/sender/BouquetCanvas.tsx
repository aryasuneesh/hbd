import { useRef } from 'react';
import { motion } from 'framer-motion';
import WidgetSidebar from './WidgetSidebar';
import SpotifyWidget   from '../widgets/SpotifyWidget';
import YoutubeWidget   from '../widgets/YoutubeWidget';
import MovieWidget     from '../widgets/MovieWidget';
import PinterestWidget from '../widgets/PinterestWidget';
import PhotoWidget     from '../widgets/PhotoWidget';
import StickerWidget   from '../widgets/StickerWidget';
import LinkWidget      from '../widgets/LinkWidget';
import PlaylistWidget  from '../widgets/PlaylistWidget';
import type { Widget, WidgetType } from '../../types/bouquet';

const MAX_WIDGETS = 12;

interface Props {
  widgets: Widget[];
  onAddWidget: (type: WidgetType, position: { x: number; y: number }) => void;
  onRemoveWidget: (id: string) => void;
  activePopup: WidgetType | null;
  onClosePopup: () => void;
}

function CanvasWidgetCard({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'spotify':   return <SpotifyWidget   widget={widget} />;
    case 'youtube':   return <YoutubeWidget   widget={widget} />;
    case 'movie':     return <MovieWidget     widget={widget} />;
    case 'pinterest': return <PinterestWidget widget={widget} />;
    case 'photo':     return <PhotoWidget     widget={widget} />;
    case 'sticker':   return <StickerWidget   widget={widget} />;
    case 'link':      return <LinkWidget      widget={widget} />;
    case 'playlist':  return <PlaylistWidget  widget={widget} />;
  }
}

export default function BouquetCanvas({ widgets, onAddWidget, onRemoveWidget, activePopup: _activePopup, onClosePopup: _onClosePopup }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const atLimit = widgets.length >= MAX_WIDGETS;

  function handleSidebarSelect(type: WidgetType) {
    if (atLimit) return;
    const x = 20 + Math.random() * 55;
    const y = 10 + Math.random() * 65;
    onAddWidget(type, { x, y });
  }

  return (
    <div className="flex gap-4 h-full">
      <WidgetSidebar onSelect={handleSidebarSelect} disabled={atLimit} />

      <div
        ref={canvasRef}
        className="flex-1 relative bg-[var(--card-bg)] rounded-2xl border-2 border-dashed border-[var(--border)] overflow-hidden min-h-[400px]"
      >
        {widgets.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-muted italic font-body pointer-events-none">
            Add items from the sidebar ✦
          </p>
        )}

        {widgets.map((widget) => (
          <motion.div
            key={widget.id}
            className="absolute cursor-grab active:cursor-grabbing group"
            style={{
              left: `${widget.position.x}%`,
              top: `${widget.position.y}%`,
              rotate: widget.rotation,
              willChange: 'transform',
              touchAction: 'none',
            }}
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={canvasRef}
            whileDrag={{ scale: 1.05, zIndex: 50 }}
          >
            <CanvasWidgetCard widget={widget} />
            <button
              onClick={() => onRemoveWidget(widget.id)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-terracotta text-white rounded-full text-xs hidden group-hover:flex items-center justify-center leading-none"
            >
              ×
            </button>
          </motion.div>
        ))}

        {atLimit && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <span className="text-xs font-body text-muted italic bg-cream/80 px-3 py-1 rounded-full border border-[var(--border)]">
              12 widget maximum reached
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
