import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { useWidgetMeta } from '../../../hooks/useWidgetMeta';
import { nanoid } from 'nanoid';
import type { YoutubeWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: YoutubeWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

export default function YoutubePopup({ onCancel, onAdd, defaultEmoji = '🌷', position }: Props) {
  const [emoji, setEmoji] = useState(defaultEmoji);
  const [url, setUrl]     = useState('');
  const { meta, loading, error } = useWidgetMeta('youtube', url);

  function handleAdd() {
    if (!meta) return;
    onAdd({
      id: nanoid(),
      type: 'youtube',
      emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position,
      youtubeUrl:   url,
      videoTitle:   meta.videoTitle   as string,
      channelName:  meta.channelName  as string,
      thumbnailUrl: meta.thumbnailUrl as string,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a video ▶"
      emoji={emoji}
      onEmojiChange={setEmoji}
      onCancel={onCancel}
      onAdd={handleAdd}
      addDisabled={!meta || loading}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="youtube-url" className="text-xs font-body text-muted uppercase tracking-widest">YouTube link</label>
        <input
          id="youtube-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="youtube.com/watch?v=…"
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
      </div>
      {loading && <p className="text-xs text-muted italic font-body">Fetching…</p>}
      {error   && <p className="text-xs text-red-400 font-body">{error}</p>}
      {meta && (
        <div className="bg-white rounded-xl overflow-hidden border border-[var(--border)]">
          <div
            className="h-16 relative flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2a1a0a, #8a5030)' }}
          >
            <img
              src={meta.thumbnailUrl as string}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative w-7 h-7 bg-red-600/90 rounded-lg flex items-center justify-center">
              <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[9px] border-t-transparent border-b-transparent border-l-white ml-0.5" />
            </div>
          </div>
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-amber line-clamp-2">{meta.videoTitle as string}</p>
            <p className="text-[10px] text-muted mt-0.5">{meta.channelName as string}</p>
          </div>
        </div>
      )}
    </AddWidgetPopup>
  );
}
