import { useState, useEffect } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { fetchPlaylistMeta, type PlaylistMeta } from '../../../lib/oembed';
import { nanoid } from 'nanoid';
import type { PlaylistWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: PlaylistWidget) => void;
  position: { x: number; y: number };
}

const DEBOUNCE_MS = 600;

export default function PlaylistPopup({ onCancel, onAdd, position }: Props) {
  const [emoji, setEmoji]   = useState('🎧');
  const [url, setUrl]       = useState('');
  const [meta, setMeta]     = useState<PlaylistMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!url.trim()) { setMeta(null); setError(null); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPlaylistMeta(url);
        setMeta(result);
      } catch {
        setError('Could not fetch playlist. Check the URL and try again.');
        setMeta(null);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [url]);

  const canAdd = !!meta && !loading;

  function handleAdd() {
    if (!meta) return;
    onAdd({
      id: nanoid(),
      type: 'playlist',
      emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position,
      url,
      playlistTitle: meta.playlistTitle,
      creatorName:   meta.creatorName,
      thumbnailUrl:  meta.thumbnailUrl,
      source:        meta.source,
    });
  }

  const isSpotify = url.includes('spotify');
  const sourceColor = isSpotify
    ? 'linear-gradient(135deg, #1DB954, #0a2a14)'
    : 'linear-gradient(135deg, #FF0000, #1a0000)';

  return (
    <AddWidgetPopup
      title="Add a playlist 🎧"
      emoji={emoji}
      onEmojiChange={setEmoji}
      onCancel={onCancel}
      onAdd={handleAdd}
      addDisabled={!canAdd}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="playlist-url" className="text-xs font-body text-muted uppercase tracking-widest">
          Spotify or YouTube playlist link
        </label>
        <input
          id="playlist-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="open.spotify.com/playlist/… or youtube.com/playlist…"
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
      </div>

      {loading && <p className="text-xs text-muted italic font-body">Fetching playlist…</p>}
      {error   && <p className="text-xs text-red-400 font-body">{error}</p>}

      {meta && (
        <div className="rounded-xl overflow-hidden" style={{ background: '#1a0a00' }}>
          <div className="h-14 flex items-center px-3 gap-3" style={{ background: sourceColor }}>
            {meta.thumbnailUrl && (
              <img
                src={meta.thumbnailUrl}
                alt=""
                className="w-10 h-10 rounded-lg object-cover shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{meta.playlistTitle}</p>
              <p className="text-[10px] text-white/60 truncate">
                {meta.source === 'spotify' ? '🎵 Spotify' : '📺 YouTube'} · {meta.creatorName}
              </p>
            </div>
          </div>
        </div>
      )}
    </AddWidgetPopup>
  );
}
