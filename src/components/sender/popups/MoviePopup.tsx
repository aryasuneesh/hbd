import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { useWidgetMeta } from '../../../hooks/useWidgetMeta';
import { nanoid } from 'nanoid';
import type { MovieWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: MovieWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

export default function MoviePopup({ onCancel, onAdd, defaultEmoji = '🌼', position }: Props) {
  const [emoji, setEmoji] = useState(defaultEmoji);
  const [url, setUrl]     = useState('');
  const { meta, loading, error } = useWidgetMeta('movie', url);

  function handleAdd() {
    if (!meta) return;
    onAdd({
      id: nanoid(),
      type: 'movie',
      emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position,
      pageUrl:    url,
      movieTitle: meta.title       as string,
      year:       '',
      posterUrl:  meta.imageUrl    as string,
      director:   meta.description as string,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a movie 🎬"
      emoji={emoji}
      onEmojiChange={setEmoji}
      onCancel={onCancel}
      onAdd={handleAdd}
      addDisabled={!meta || loading}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="movie-url" className="text-xs font-body text-muted uppercase tracking-widest">
          Paste any movie page URL
        </label>
        <input
          id="movie-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="imdb.com · letterboxd.com · any…"
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
        <p className="text-[10px] text-muted italic font-body">Poster & title fetched automatically.</p>
      </div>
      {loading && <p className="text-xs text-muted italic font-body">Fetching…</p>}
      {error   && <p className="text-xs text-red-400 font-body">{error}</p>}
      {meta && (
        <div className="flex gap-3 bg-sand/30 rounded-xl p-3 border border-[var(--border)]">
          <img src={meta.imageUrl as string} alt="" className="w-10 h-14 object-cover rounded-md shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber">{meta.title as string}</p>
            <p className="text-[10px] text-muted mt-0.5 line-clamp-2">{meta.description as string}</p>
            <p className="text-[9px] text-stem mt-1 italic font-body">poster fetched ✓</p>
          </div>
        </div>
      )}
    </AddWidgetPopup>
  );
}
