import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { useWidgetMeta } from '../../../hooks/useWidgetMeta';
import { nanoid } from 'nanoid';
import type { LinkWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: LinkWidget) => void;
  position: { x: number; y: number };
}

export default function LinkPopup({ onCancel, onAdd, position }: Props) {
  const [emoji, setEmoji] = useState('🔗');
  const [url, setUrl]     = useState('');
  const { meta, loading, error } = useWidgetMeta('link', url);

  const canAdd = !!meta && !loading;

  function handleAdd() {
    if (!meta) return;
    onAdd({
      id: nanoid(),
      type: 'link',
      emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position,
      url,
      title:       meta.title       as string,
      description: meta.description as string,
      imageUrl:    meta.imageUrl    as string,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a link 🔗"
      emoji={emoji}
      onEmojiChange={setEmoji}
      onCancel={onCancel}
      onAdd={handleAdd}
      addDisabled={!canAdd}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="link-url" className="text-xs font-body text-muted uppercase tracking-widest">URL</label>
        <input
          id="link-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
      </div>

      {loading && <p className="text-xs text-muted italic font-body">Fetching…</p>}
      {error   && <p className="text-xs text-red-400 font-body">{error}</p>}

      {meta && (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-sand/20">
          {meta.imageUrl && (
            <img
              src={meta.imageUrl as string}
              alt=""
              className="w-full h-24 object-cover"
            />
          )}
          <div className="p-3">
            <p className="text-xs font-semibold text-amber truncate">{meta.title as string}</p>
            {meta.description && (
              <p className="text-[10px] text-muted mt-0.5 line-clamp-2 leading-relaxed">
                {meta.description as string}
              </p>
            )}
            <p className="text-[9px] text-muted/60 mt-1 truncate font-mono">{url}</p>
          </div>
        </div>
      )}
    </AddWidgetPopup>
  );
}
