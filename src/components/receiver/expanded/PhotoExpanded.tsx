import type { PhotoWidget } from '../../../types/bouquet';

export default function PhotoExpanded({ widget, onClose: _onClose }: { widget: PhotoWidget; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      {widget.storageUrl
        ? <img src={widget.storageUrl} alt={widget.caption} className="w-full rounded-2xl object-cover max-h-80" decoding="async" />
        : <div className="w-full h-48 bg-sand/40 rounded-2xl flex items-center justify-center text-4xl">📸</div>
      }
      {widget.caption && <p className="text-sm font-display italic text-amber text-center">{widget.caption}</p>}
    </div>
  );
}
