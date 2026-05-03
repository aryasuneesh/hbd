import type { LinkWidget } from '../../../types/bouquet';

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
}

export default function LinkExpanded({ widget, onClose: _onClose }: { widget: LinkWidget; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
        {widget.imageUrl ? (
          <img src={widget.imageUrl} alt="" className="w-full h-40 object-cover" />
        ) : (
          <div className="w-full h-32 bg-sand/40 flex items-center justify-center text-5xl">
            🔗
          </div>
        )}
        <div className="p-4">
          <p className="text-sm font-semibold text-amber leading-snug">{widget.title}</p>
          {widget.description && (
            <p className="text-xs text-muted mt-1.5 leading-relaxed line-clamp-3">
              {widget.description}
            </p>
          )}
          <p className="text-[10px] text-muted/60 mt-2 font-mono truncate">{getDomain(widget.url)}</p>
        </div>
      </div>

      <a
        href={widget.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center bg-terracotta text-white text-sm font-body italic rounded-full py-2.5 px-6 hover:opacity-80 transition-opacity"
      >
        Open link →
      </a>
    </div>
  );
}
