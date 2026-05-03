import type { PlaylistWidget as PlaylistWidgetType } from '../../types/bouquet';

export default function PlaylistWidget({ widget }: { widget: PlaylistWidgetType }) {
  const isSpotify = widget.source === 'spotify';
  const gradientBg = isSpotify
    ? 'linear-gradient(135deg, #1DB954, #0a2a14)'
    : 'linear-gradient(135deg, #FF4444, #1a0000)';

  return (
    <div className="w-40 rounded-2xl overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="h-14 flex items-center px-3 gap-2.5" style={{ background: gradientBg }}>
        {widget.thumbnailUrl ? (
          <img src={widget.thumbnailUrl} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-lg shrink-0">
            {isSpotify ? '🎵' : '📺'}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-white truncate">{widget.playlistTitle}</p>
          <p className="text-[9px] text-white/60 truncate">
            {isSpotify ? '🎵 Spotify' : '📺 YouTube'}
          </p>
        </div>
      </div>
      <div className="px-3 py-2 flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {[3, 5, 4, 6, 3, 5].map((h, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full opacity-60"
              style={{ height: h * 2, background: isSpotify ? '#1DB954' : '#FF4444' }}
            />
          ))}
        </div>
        <span className="text-[9px] text-white/40 ml-1">playlist</span>
      </div>
    </div>
  );
}
