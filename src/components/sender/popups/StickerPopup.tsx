import { useState } from 'react';
import AddWidgetPopup from './AddWidgetPopup';
import { nanoid } from 'nanoid';
import type { StickerWidget } from '../../../types/bouquet';

const BUILT_IN_STICKERS = ['🎀', '✨', '🌙', '⭐', '💌', '🍃', '🫧', '🌿'];

interface Props {
  onCancel: () => void;
  onAdd: (w: StickerWidget) => void;
  position: { x: number; y: number };
}

export default function StickerPopup({ onCancel, onAdd, position }: Props) {
  const [selected, setSelected] = useState(BUILT_IN_STICKERS[0]);

  function handleAdd() {
    onAdd({
      id: nanoid(), type: 'sticker', emoji: selected,
      rotation: Math.round((Math.random() - 0.5) * 30),
      position, stickerKey: selected, storageUrl: '',
    });
  }

  return (
    <AddWidgetPopup
      title="Add a sticker 🎀"
      emoji={selected} onEmojiChange={setSelected}
      onCancel={onCancel} onAdd={handleAdd}
      addDisabled={false}
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-body text-muted uppercase tracking-widest">Pick a sticker</label>
        <div className="grid grid-cols-4 gap-2">
          {BUILT_IN_STICKERS.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={`h-12 rounded-xl text-2xl flex items-center justify-center border transition-all ${
                selected === s
                  ? 'border-terracotta bg-blush/20'
                  : 'border-[var(--border)] bg-sand/20 hover:border-sand'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </AddWidgetPopup>
  );
}
