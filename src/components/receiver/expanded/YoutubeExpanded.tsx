import type { YoutubeWidget } from '../../../types/bouquet';

function getEmbedUrl(url: string): string {
  // youtu.be/ID
  let m = url.match(/youtu\.be\/([^?&\s/]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  // youtube.com/shorts/ID
  m = url.match(/\/shorts\/([^?&\s/]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  // youtube.com/watch?v=ID
  m = url.match(/[?&]v=([^&\s]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return '';
}

export default function YoutubeExpanded({ widget, onClose: _onClose }: { widget: YoutubeWidget; onClose: () => void }) {
  const embedUrl = getEmbedUrl(widget.youtubeUrl);
  return (
    <div className="flex flex-col gap-3">
      {embedUrl ? (
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`${embedUrl}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={widget.videoTitle}
            loading="lazy"
          />
        </div>
      ) : (
        <img src={widget.thumbnailUrl} alt={widget.videoTitle} className="w-full rounded-2xl object-cover" />
      )}
      <p className="font-display text-base italic text-amber leading-snug">{widget.videoTitle}</p>
      <p className="text-xs text-muted font-body">{widget.channelName}</p>
      <a
        href={widget.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-body italic text-terracotta hover:opacity-70 transition-opacity"
      >
        Open on YouTube →
      </a>
    </div>
  );
}
