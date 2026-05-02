import type { MovieWidget } from '../../../types/bouquet';

function decodeHtml(s: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
}

export default function MovieExpanded({ widget, onClose: _onClose }: { widget: MovieWidget; onClose: () => void }) {
  const description = widget.director ? decodeHtml(widget.director) : null;
  const trailerSearch = encodeURIComponent(
    `${widget.movieTitle}${widget.year ? ' ' + widget.year : ''} official trailer`
  );

  return (
    <div className="flex flex-col gap-4">
      <img
        src={widget.posterUrl}
        alt={widget.movieTitle}
        className="w-full rounded-2xl object-cover"
        style={{ maxHeight: 260 }}
        decoding="async"
      />

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl italic text-amber leading-snug">
          {widget.movieTitle}{widget.year ? ` (${widget.year})` : ''}
        </h3>
        {description && (
          <p className="text-sm text-muted font-body leading-relaxed">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-1 border-t border-[var(--border)]">
        <a
          href={widget.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-body italic text-terracotta hover:opacity-70 transition-opacity"
        >
          View on site →
        </a>
        <a
          href={`https://www.youtube.com/results?search_query=${trailerSearch}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-body italic text-muted hover:text-amber transition-colors"
        >
          Search trailer on YouTube ▷
        </a>
      </div>
    </div>
  );
}
