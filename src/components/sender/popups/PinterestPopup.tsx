import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { nanoid } from 'nanoid';
import type { PinterestWidget } from '../../../types/bouquet';

interface Props {
  onCancel: () => void;
  onAdd: (w: PinterestWidget) => void;
  defaultEmoji?: string;
  position: { x: number; y: number };
}

export default function PinterestPopup({ onCancel, onAdd, defaultEmoji = '🌺', position }: Props) {
  const [emoji, setEmoji]     = useState(defaultEmoji);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption]   = useState('');

  const isValid = imageUrl.trim().startsWith('http');

  function handleAdd() {
    if (!isValid) return;
    onAdd({
      id: nanoid(), type: 'pinterest', emoji,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position, pageUrl: imageUrl,
      imageUrl: imageUrl.trim(),
      caption:  caption.trim(),
    });
  }

  return (
    <AddWidgetPopup
      title="Add a Pinterest image 📌"
      emoji={emoji} onEmojiChange={setEmoji}
      onCancel={onCancel} onAdd={handleAdd}
      addDisabled={!isValid}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="pinterest-img" className="text-xs font-body text-muted uppercase tracking-widest">
            Direct image URL
          </label>
          <input
            id="pinterest-img"
            value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://i.pinimg.com/…"
            className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
          />
          <p className="text-[10px] text-muted font-body italic">
            Right-click the pin image → "Copy image address"
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="pinterest-caption" className="text-xs font-body text-muted uppercase tracking-widest">
            Caption (optional)
          </label>
          <input
            id="pinterest-caption"
            value={caption} onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. dream bedroom inspo"
            className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
          />
        </div>
        {isValid && (
          <img src={imageUrl.trim()} alt="" className="w-full h-36 object-cover rounded-xl" />
        )}
      </div>
    </AddWidgetPopup>
  );
}
