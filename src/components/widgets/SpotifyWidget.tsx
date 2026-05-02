import type { SpotifyWidget as SpotifyWidgetType } from '../../types/bouquet';

export default function SpotifyWidget({ widget }: { widget: SpotifyWidgetType }) {
  return (
    <div className="w-40 rounded-2xl overflow-hidden" style={{ background: '#1a0a00' }}>
      <div
        className="h-14 flex items-center px-3 gap-2.5"
        style={{ background: 'linear-gradient(135deg, #c4845c, #3a1500)' }}
      >
        <img src={widget.albumArtUrl} alt="" className="w-9 h-9 rounded-md object-cover shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-white truncate">{widget.trackTitle}</p>
          <p className="text-[9px] text-white/60 truncate">{widget.artistName}</p>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="h-0.5 bg-white/10 rounded-full">
          <div className="w-2/5 h-full rounded-full" style={{ background: '#1DB954' }} />
        </div>
      </div>
    </div>
  );
}
