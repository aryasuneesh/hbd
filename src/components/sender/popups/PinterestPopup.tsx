import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { useWidgetMeta } from '../../../hooks/useWidgetMeta';
import { nanoid } from 'nanoid';
import type { PinterestWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: PinterestWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

export default function PinterestPopup({ onCancel, onAdd, defaultEmoji = '🌺', position }: Props) {
  const [emoji, setEmoji] = useState(defaultEmoji);
  const [url, setUrl]     = useState('');
  const { meta, loading, error } = useWidgetMeta('pinterest', url);

  function handleAdd() {
    if (!meta) return;
    onAdd({
      id: nanoid(), type: 'pinterest', emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position, pageUrl: url,
      imageUrl: meta.imageUrl as string,
      caption:  meta.title   as string,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a Pinterest image 📌"
      emoji={emoji} onEmojiChange={setEmoji}
      onCancel={onCancel} onAdd={handleAdd}
      addDisabled={!meta || loading}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="pinterest-url" className="text-xs font-body text-muted uppercase tracking-widest">Pinterest pin URL</label>
        <input
          id="pinterest-url"
          value={url} onChange={(e) => setUrl(e.target.value)}
          placeholder="pinterest.com/pin/…"
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
      </div>
      {loading && <p className="text-xs text-muted italic font-body">Fetching…</p>}
      {error   && <p className="text-xs text-red-400 font-body">{error}</p>}
      {meta && (
        <img src={meta.imageUrl as string} alt="" className="w-full h-36 object-cover rounded-xl" />
      )}
    </AddWidgetPopup>
  );
}
