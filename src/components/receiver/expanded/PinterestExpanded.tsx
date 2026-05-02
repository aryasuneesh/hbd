import type { PinterestWidget } from '../../../types/bouquet';

export default function PinterestExpanded({ widget, onClose: _onClose }: { widget: PinterestWidget; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <img src={widget.imageUrl} alt={widget.caption} className="w-full rounded-2xl object-cover max-h-80" decoding="async" />
      {widget.caption && <p className="text-sm font-display italic text-amber text-center">{widget.caption}</p>}
    </div>
  );
}
