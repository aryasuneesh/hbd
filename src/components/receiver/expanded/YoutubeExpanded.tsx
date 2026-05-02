import type { YoutubeWidget } from '../../../types/bouquet';

function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0` : '';
}

export default function YoutubeExpanded({ widget, onClose: _onClose }: { widget: YoutubeWidget; onClose: () => void }) {
  const embedUrl = getYoutubeEmbedUrl(widget.youtubeUrl);
  return (
    <div className="flex flex-col gap-3">
      {embedUrl ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-xl"
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
            title={widget.videoTitle}
          />
        </div>
      ) : (
        <img src={widget.thumbnailUrl} alt={widget.videoTitle} className="w-full rounded-xl object-cover" />
      )}
      <p className="text-sm font-semibold text-amber">{widget.videoTitle}</p>
      <p className="text-xs text-muted">{widget.channelName}</p>
    </div>
  );
}
