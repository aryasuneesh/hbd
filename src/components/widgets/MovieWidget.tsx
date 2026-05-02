import type { MovieWidget as MovieWidgetType } from '../../types/bouquet';

export default function MovieWidget({ widget }: { widget: MovieWidgetType }) {
  return (
    <div className="w-28 bg-white rounded-xl overflow-hidden border border-[var(--border)]" style={{ boxShadow: 'var(--shadow-card)' }}>
      <img src={widget.posterUrl} alt={widget.movieTitle} className="w-full h-36 object-cover" decoding="async" />
      <div className="px-2 py-2">
        <p className="text-[10px] font-semibold text-amber leading-snug line-clamp-2">{widget.movieTitle}</p>
        {widget.year && <p className="text-[9px] text-muted mt-0.5">{widget.year}</p>}
      </div>
    </div>
  );
}
