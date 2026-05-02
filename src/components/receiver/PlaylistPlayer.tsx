import { useEffect, useRef } from 'react';

interface Props {
  url: string;
  type: 'spotify' | 'youtube';
  playing: boolean;
}

function buildEmbedUrl(url: string, type: 'spotify' | 'youtube'): string {
  if (type === 'spotify') {
    // Convert open.spotify.com/playlist/ID → embed URL
    const match = url.match(/spotify\.com\/(?:playlist|album|track)\/([a-zA-Z0-9]+)/);
    if (!match) return '';
    return `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator&autoplay=1`;
  }
  // YouTube: extract list ID
  const match = url.match(/[?&]list=([^&]+)/);
  if (!match) return '';
  return `https://www.youtube.com/embed/videoseries?list=${match[1]}&autoplay=1&enablejsapi=1`;
}

export default function PlaylistPlayer({ url, type, playing }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const embedUrl  = buildEmbedUrl(url, type);

  useEffect(() => {
    if (!playing || !iframeRef.current || type !== 'youtube') return;
    // Unmute YouTube via postMessage after card-open gesture
    iframeRef.current.contentWindow?.postMessage(
      '{"event":"command","func":"unMute","args":""}',
      '*',
    );
  }, [playing, type]);

  if (!embedUrl) return null;

  return (
    <iframe
      ref={iframeRef}
      src={embedUrl}
      allow="autoplay; encrypted-media"
      className="hidden"
      title="background playlist"
      width="0"
      height="0"
    />
  );
}
