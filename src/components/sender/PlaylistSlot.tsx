import { useWidgetMeta } from '../../hooks/useWidgetMeta';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function PlaylistSlot({ value, onChange }: Props) {
  const type = value.includes('spotify') ? 'spotify' : 'youtube';
  const { meta, loading, error } = useWidgetMeta(
    value ? type : 'youtube',
    value,
  );

  return (
    <div className="flex flex-col gap-2 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎵</span>
        <div>
          <p className="text-xs font-body text-amber font-semibold">Background music</p>
          <p className="text-[10px] text-muted italic font-body">Plays when the card opens</p>
        </div>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste a Spotify track or a YouTube video / playlist URL…"
        className="bg-sand/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-body text-amber placeholder-muted/50 outline-none focus:border-terracotta transition-colors"
      />
      {loading && <p className="text-[10px] text-muted italic font-body">Fetching playlist…</p>}
      {error && <p className="text-[10px] text-red-400 font-body">{error}</p>}
      {meta && (
        <p className="text-[10px] text-stem italic font-body">
          ♪ {(meta.trackTitle || meta.videoTitle) as string} — ready ✓
        </p>
      )}
    </div>
  );
}
