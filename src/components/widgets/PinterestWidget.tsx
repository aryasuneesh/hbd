import type { PinterestWidget as PinterestWidgetType } from '../../types/bouquet';

export default function PinterestWidget({ widget }: { widget: PinterestWidgetType }) {
  return (
    <div className="w-28 rounded-2xl overflow-hidden bg-white border border-[var(--border)]" style={{ boxShadow: 'var(--shadow-card)' }}>
      <img src={widget.imageUrl} alt={widget.caption} className="w-full h-36 object-cover" decoding="async" />
      {widget.caption && (
        <p className="px-2 py-1.5 text-[9px] text-amber italic font-display line-clamp-2">{widget.caption}</p>
      )}
    </div>
  );
}
