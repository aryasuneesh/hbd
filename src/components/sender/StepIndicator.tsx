interface Props { current: number; total: number; }

export default function StepIndicator({ current, total }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 pt-8 pb-4">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <div key={n} className="flex items-center gap-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-body transition-colors
            ${n === current
              ? 'bg-terracotta text-white'
              : n < current
                ? 'bg-sand text-amber'
                : 'bg-sand/50 text-muted'}
          `}>
            {n < current ? '✓' : n}
          </div>
          {n < total && <div className="w-8 h-px bg-sand" />}
        </div>
      ))}
    </div>
  );
}
