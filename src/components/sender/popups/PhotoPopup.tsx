import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { nanoid } from 'nanoid';
import type { PhotoWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: PhotoWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

const UPLOADS_ENABLED = import.meta.env.VITE_ENABLE_UPLOADS === 'true';

export default function PhotoPopup({ onCancel, onAdd, defaultEmoji = '🌻', position }: Props) {
  const [emoji, setEmoji]     = useState(defaultEmoji);
  const [caption, setCaption] = useState('');

  function handleAdd() {
    onAdd({
      id: nanoid(), type: 'photo', emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position, storageUrl: '', caption,
    });
  }

  return (
    <AddWidgetPopup
      title="Add a photo 📸"
      emoji={emoji} onEmojiChange={setEmoji}
      onCancel={onCancel} onAdd={handleAdd}
      addDisabled={false}
    >
      {!UPLOADS_ENABLED ? (
        <div className="bg-sand/30 rounded-xl p-4 text-xs text-muted italic font-body text-center border border-[var(--border)]">
          Photo uploads are coming soon 🌸
        </div>
      ) : (
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 flex flex-col items-center gap-2 bg-cream cursor-pointer">
          <span className="text-2xl">📎</span>
          <p className="text-xs text-amber italic font-body">tap to upload image</p>
          <p className="text-[10px] text-muted font-body">JPG, PNG, WEBP · max 5 MB</p>
        </div>
      )}

      <div className="bg-[#fef4e8] border border-sand rounded-xl px-3 py-2.5 flex gap-2 items-start">
        <span className="text-sm shrink-0">🔒</span>
        <p className="text-[10px] text-amber/70 font-body leading-relaxed">
          Your photo is stored privately and only visible to someone with your bouquet link. It is never indexed, shared, or used beyond this bouquet.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="photo-caption" className="text-xs font-body text-muted uppercase tracking-widest">Caption (optional)</label>
        <input
          id="photo-caption"
          value={caption} onChange={(e) => setCaption(e.target.value)}
          placeholder="A little caption…"
          maxLength={80}
          className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
        />
      </div>
    </AddWidgetPopup>
  );
}
