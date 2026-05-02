import type { PhotoWidget as PhotoWidgetType } from '../../types/bouquet';

export default function PhotoWidget({ widget }: { widget: PhotoWidgetType }) {
  return (
    <div className="w-32 rounded-2xl overflow-hidden bg-white border-2 border-sand" style={{ boxShadow: 'var(--shadow-card)' }}>
      {widget.storageUrl
        ? <img src={widget.storageUrl} alt={widget.caption} className="w-full h-32 object-cover" decoding="async" />
        : <div className="w-full h-32 bg-sand/40 flex items-center justify-center text-3xl">📸</div>
      }
      <div className="bg-sand/30 px-2 py-1.5 flex items-center gap-1.5">
        <span className="text-xs">🎀</span>
        <p className="text-[9px] text-amber italic font-display truncate">
          {widget.caption || 'from the sender'}
        </p>
      </div>
    </div>
  );
}
