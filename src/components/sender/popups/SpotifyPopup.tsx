import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { useWidgetMeta } from '../../../hooks/useWidgetMeta';
import { nanoid } from 'nanoid';
import type { SpotifyWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: SpotifyWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

export default function SpotifyPopup({ onCancel, onAdd, defaultEmoji = '🌸', position }: Props) {
  const [emoji, setEmoji]   = useState(defaultEmoji);
  const [url, setUrl]       = useState('');
  const { meta, loading, error } = useWidgetMeta('spotify', url);

  const canAdd = !!meta && !loading;

  function handleAdd() {
    if (!meta) return;
    onAdd({
      id: nanoid(),
      type: 'spotify',
      emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position,
      spotifyUrl:  url,
      trackTitle:  meta.trackTitle  as string,
      artistName:  meta.artistName  as string,
      albumArtUrl: meta.albumArtUrl as string,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a song 🎵"
      emoji={emoji}
      onEmojiChange={setEmoji}
      onCancel={onCancel}
      onAdd={handleAdd}
      addDisabled={!canAdd}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="spotify-url" className="text-xs font-body text-muted uppercase tracking-widest">Spotify link</label>
        <input
          id="spotify-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="open.spotify.com/track/…"
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
      </div>

      {loading && <p className="text-xs text-muted italic font-body">Fetching…</p>}
      {error   && <p className="text-xs text-red-400 font-body">{error}</p>}

      {meta && (
        <div className="rounded-xl overflow-hidden" style={{ background: '#1a0a00' }}>
          <div
            className="h-12 flex items-center px-3 gap-3"
            style={{ background: 'linear-gradient(135deg, #c4845c, #3a1500)' }}
          >
            <img
              src={meta.albumArtUrl as string}
              alt=""
              className="w-8 h-8 rounded-md object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{meta.trackTitle as string}</p>
              <p className="text-[10px] text-white/60 truncate">{meta.artistName as string}</p>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="h-0.5 bg-white/10 rounded-full">
              <div className="w-2/5 h-full bg-[#1DB954] rounded-full" />
            </div>
          </div>
        </div>
      )}
    </AddWidgetPopup>
  );
}
