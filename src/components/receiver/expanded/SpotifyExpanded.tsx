import { useEffect } from 'react';
import { useMusicContext } from '../../../contexts/MusicContext';
import type { SpotifyWidget } from '../../../types/bouquet';

function getSpotifyEmbedUrl(url: string): string {
  const m = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (!m) return '';
  return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&autoplay=1&theme=0`;
}

export default function SpotifyExpanded({ widget, onClose: _onClose }: { widget: SpotifyWidget; onClose: () => void }) {
  const { pauseBackground, resumeBackground } = useMusicContext();

  useEffect(() => {
    pauseBackground();
    return () => { resumeBackground(); };
  }, [pauseBackground, resumeBackground]);

  const embedUrl = getSpotifyEmbedUrl(widget.spotifyUrl);

  return (
    <div className="flex flex-col gap-4">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          style={{ display: 'block', border: 0, borderRadius: 12 }}
          title={widget.trackTitle}
          loading="lazy"
        />
      ) : (
        <div className="rounded-2xl overflow-hidden p-5 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #c4845c, #1a0a00)' }}>
          <img src={widget.albumArtUrl} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-lg" />
          <div className="min-w-0">
            <p className="text-base font-semibold text-white truncate">{widget.trackTitle}</p>
            <p className="text-sm text-white/60">{widget.artistName}</p>
          </div>
        </div>
      )}
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
