import { useState } from 'react';
import BouquetCanvas from './BouquetCanvas';
import PlaylistSlot from './PlaylistSlot';
import SpotifyPopup   from './popups/SpotifyPopup';
import YoutubePopup   from './popups/YoutubePopup';
import MoviePopup     from './popups/MoviePopup';
import PinterestPopup from './popups/PinterestPopup';
import PhotoPopup     from './popups/PhotoPopup';
import StickerPopup   from './popups/StickerPopup';
import LinkPopup      from './popups/LinkPopup';
import PlaylistPopup  from './popups/PlaylistPopup';
import type { ContainerType, Widget, WidgetType } from '../../types/bouquet';

interface Props {
  onBack: () => void;
  onFinish: (
    containerType: ContainerType,
    widgets: Widget[],
    playlistUrl: string | null,
    playlistType: 'spotify' | 'youtube' | null,
  ) => void;
  saving: boolean;
}

const CONTAINERS: { value: ContainerType; label: string; emoji: string; desc: string }[] = [
  { value: 'bouquet', label: 'Bouquet', emoji: '🌷', desc: 'Wrapping paper unfurls' },
  { value: 'basket',  label: 'Basket',  emoji: '🧺', desc: 'Peek inside a basket' },
];

export default function CanvasStep({ onBack, onFinish, saving }: Props) {
  const [containerType, setContainerType] = useState<ContainerType>('bouquet');
  const [widgets, setWidgets]             = useState<Widget[]>([]);
  const [playlistUrl, setPlaylistUrl]     = useState('');
  const [activePopup, setActivePopup]     = useState<WidgetType | null>(null);
  const [pendingPosition, setPendingPosition] = useState({ x: 30, y: 40 });

  function handleAddWidget(type: WidgetType, position: { x: number; y: number }) {
    setActivePopup(type);
    setPendingPosition(position);
  }

  function handleWidgetAdded(widget: Widget) {
    setWidgets((prev) => [...prev, widget]);
    setActivePopup(null);
  }

  function getPlaylistType(): 'spotify' | 'youtube' | null {
    if (!playlistUrl) return null;
    return playlistUrl.includes('spotify') ? 'spotify' : 'youtube';
  }

  function handleFinish() {
    onFinish(
      containerType,
      widgets,
      playlistUrl || null,
      getPlaylistType(),
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-12 max-w-4xl mx-auto w-full">
      <h2 className="font-display text-2xl italic text-amber text-center pt-2">
        Build the bouquet ✨
      </h2>

      {/* Container picker */}
      <div className="flex gap-3">
        {CONTAINERS.map((c) => (
          <button
            key={c.value}
            onClick={() => setContainerType(c.value)}
            className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border transition-all ${
              containerType === c.value
                ? 'border-terracotta bg-blush/20'
                : 'border-[var(--border)] bg-[var(--card-bg)] hover:border-sand'
            }`}
          >
            <span className="text-2xl">{c.emoji}</span>
            <div className="text-left">
              <p className="font-display italic text-sm text-amber">{c.label}</p>
              <p className="text-[10px] text-muted font-body">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Canvas */}
      <BouquetCanvas
        widgets={widgets}
        onAddWidget={handleAddWidget}
        onRemoveWidget={(id) => setWidgets((prev) => prev.filter((w) => w.id !== id))}
        activePopup={activePopup}
        onClosePopup={() => setActivePopup(null)}
      />

      {/* Playlist */}
      <PlaylistSlot value={playlistUrl} onChange={setPlaylistUrl} />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-sm font-body italic text-muted hover:text-amber transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleFinish}
          disabled={saving}
          className="bg-terracotta text-white font-body italic rounded-full py-3 px-8 transition-opacity disabled:opacity-50 hover:opacity-90"
        >
          {saving ? 'Saving…' : 'Share this bouquet ✦'}
        </button>
      </div>

      {/* Widget popups */}
      {activePopup === 'spotify'   && <SpotifyPopup   onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'youtube'   && <YoutubePopup   onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'movie'     && <MoviePopup     onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'pinterest' && <PinterestPopup onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'photo'     && <PhotoPopup     onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'sticker'   && <StickerPopup   onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'link'      && <LinkPopup      onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
      {activePopup === 'playlist'  && <PlaylistPopup  onCancel={() => setActivePopup(null)} onAdd={handleWidgetAdded} position={pendingPosition} />}
    </div>
  );
}
