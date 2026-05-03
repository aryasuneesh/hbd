import { useEffect } from 'react';
import { useMusicContext } from '../../../contexts/MusicContext';
import type { PlaylistWidget } from '../../../types/bouquet';

function getSpotifyEmbedUrl(url: string): string {
  const m = url.match(/spotify\.com\/(playlist|album)\/([a-zA-Z0-9]+)/);
  if (!m) return '';
  return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0`;
}

function getYoutubePlaylistEmbedUrl(url: string): string {
  const m = url.match(/[?&]list=([^&]+)/);
  if (!m) return '';
  return `https://www.youtube-nocookie.com/embed/videoseries?list=${m[1]}&autoplay=0`;
}

export default function PlaylistExpanded({ widget, onClose: _onClose }: { widget: PlaylistWidget; onClose: () => void }) {
  const { pauseBackground, resumeBackground } = useMusicContext();

  useEffect(() => {
    pauseBackground();
    return () => { resumeBackground(); };
  }, [pauseBackground, resumeBackground]);

  const embedUrl = widget.source === 'spotify'
    ? getSpotifyEmbedUrl(widget.url)
    : getYoutubePlaylistEmbedUrl(widget.url);

  const isSpotify = widget.source === 'spotify';

  return (
    <div className="flex flex-col gap-4">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height={isSpotify ? '352' : '280'}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          style={{ display: 'block', border: 0, borderRadius: 12 }}
          title={widget.playlistTitle}
          loading="lazy"
        />
      ) : (
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: isSpotify
              ? 'linear-gradient(135deg, #1DB954, #0a2a14)'
              : 'linear-gradient(135deg, #FF4444, #1a0000)',
          }}
        >
          {widget.thumbnailUrl && (
            <img src={widget.thumbnailUrl} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-lg" />
          )}
          <div className="min-w-0">
            <p className="text-base font-semibold text-white truncate">{widget.playlistTitle}</p>
            <p className="text-sm text-white/60">{widget.creatorName}</p>
          </div>
        </div>
      )}

      <a
        href={widget.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-sm font-body italic text-terracotta hover:opacity-70 transition-opacity"
      >
        Open in {isSpotify ? 'Spotify' : 'YouTube'} →
      </a>
    </div>
  );
}
