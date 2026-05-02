import type { MovieWidget } from '../../../types/bouquet';

export default function MovieExpanded({ widget, onClose: _onClose }: { widget: MovieWidget; onClose: () => void }) {
  return (
    <div className="flex gap-4">
      <img src={widget.posterUrl} alt={widget.movieTitle} className="w-28 rounded-xl object-cover shrink-0" decoding="async" />
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="font-display text-lg italic text-amber">{widget.movieTitle}</h3>
        {widget.year     && <p className="text-xs text-muted font-body">{widget.year}</p>}
        {widget.director && <p className="text-xs text-muted font-body italic line-clamp-3">{widget.director}</p>}
        <a href={widget.pageUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs font-body italic text-terracotta hover:opacity-70 transition-opacity mt-1">
          View on site →
        </a>
      </div>
    </div>
  );
}
