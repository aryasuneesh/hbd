import type { YoutubeWidget as YoutubeWidgetType } from '../../types/bouquet';

export default function YoutubeWidget({ widget }: { widget: YoutubeWidgetType }) {
  return (
    <div className="w-44 bg-white rounded-xl overflow-hidden border border-[var(--border)]" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="h-24 relative flex items-center justify-center bg-[#2a1a0a]">
        <img src={widget.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        <div className="relative w-8 h-8 bg-red-600/90 rounded-lg flex items-center justify-center shadow-md">
          <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white ml-0.5" />
        </div>
      </div>
      <div className="px-3 py-2">
        <p className="text-[10px] font-semibold text-amber line-clamp-2 leading-snug">{widget.videoTitle}</p>
        <p className="text-[9px] text-muted mt-0.5">{widget.channelName}</p>
      </div>
    </div>
  );
}
