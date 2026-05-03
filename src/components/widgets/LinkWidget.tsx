import type { LinkWidget as LinkWidgetType } from '../../types/bouquet';

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
}

export default function LinkWidget({ widget }: { widget: LinkWidgetType }) {
  return (
    <div className="w-40 rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card-bg)]">
      {widget.imageUrl ? (
        <img src={widget.imageUrl} alt="" className="w-full h-20 object-cover" />
      ) : (
        <div className="w-full h-20 bg-sand/40 flex items-center justify-center text-3xl">
          🔗
        </div>
      )}
      <div className="px-3 py-2">
        <p className="text-[11px] font-semibold text-amber truncate leading-tight">{widget.title}</p>
        <p className="text-[9px] text-muted mt-0.5 truncate font-mono">{getDomain(widget.url)}</p>
      </div>
    </div>
  );
}
