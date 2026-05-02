import type { SpotifyWidget } from '../../../types/bouquet';

export default function SpotifyExpanded({ widget, onClose: _onClose }: { widget: SpotifyWidget; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#1a0a00] rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #c4845c, #1a0a00)' }}>
        <div className="flex items-center gap-4 p-5">
          <img src={widget.albumArtUrl} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-lg" />
          <div className="min-w-0">
            <p className="text-base font-semibold text-white truncate">{widget.trackTitle}</p>
            <p className="text-sm text-white/60">{widget.artistName}</p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="h-1 bg-white/10 rounded-full">
            <div className="w-2/5 h-full rounded-full" style={{ background: '#1DB954' }} />
          </div>
        </div>
      </div>
      <a
        href={widget.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-sm font-body italic text-terracotta hover:opacity-70 transition-opacity"
      >
        Open in Spotify →
      </a>
    </div>
  );
}
