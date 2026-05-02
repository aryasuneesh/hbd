import type { StickerWidget as StickerWidgetType } from '../../types/bouquet';

export default function StickerWidget({ widget }: { widget: StickerWidgetType }) {
  return (
    <div className="text-5xl select-none" style={{ filter: 'drop-shadow(0 2px 6px rgba(107,76,42,0.2))' }}>
      {widget.stickerKey || widget.emoji}
    </div>
  );
}
