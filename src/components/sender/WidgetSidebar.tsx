import type { WidgetType } from '../../types/bouquet';

const WIDGET_TYPES: { type: WidgetType; label: string; emoji: string }[] = [
  { type: 'spotify',   label: 'Song',    emoji: '🎵' },
  { type: 'youtube',   label: 'Video',   emoji: '🎬' },
  { type: 'movie',     label: 'Movie',   emoji: '🎞️' },
  { type: 'pinterest', label: 'Pin',     emoji: '📌' },
  { type: 'photo',     label: 'Photo',   emoji: '📸' },
  { type: 'sticker',   label: 'Sticker', emoji: '✨' },
];

interface Props {
  onSelect: (type: WidgetType) => void;
  disabled: boolean;
}

export default function WidgetSidebar({ onSelect, disabled }: Props) {
  return (
    <aside className="flex flex-col gap-2 w-24 shrink-0">
      <p className="text-[10px] font-body text-muted uppercase tracking-widest text-center mb-1">
        Add
      </p>
      {WIDGET_TYPES.map(({ type, label, emoji }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          disabled={disabled}
          aria-label={`Add ${label}`}
          className="flex flex-col items-center gap-1 py-2 px-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl text-center hover:border-terracotta hover:bg-sand/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="text-xl leading-none">{emoji}</span>
          <span className="text-[10px] font-body text-muted leading-none">{label}</span>
        </button>
      ))}
    </aside>
  );
}
