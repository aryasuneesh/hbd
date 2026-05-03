import SpotifyWidget   from '../widgets/SpotifyWidget';
import YoutubeWidget   from '../widgets/YoutubeWidget';
import MovieWidget     from '../widgets/MovieWidget';
import PinterestWidget from '../widgets/PinterestWidget';
import PhotoWidget     from '../widgets/PhotoWidget';
import StickerWidget   from '../widgets/StickerWidget';
import LinkWidget      from '../widgets/LinkWidget';
import PlaylistWidget  from '../widgets/PlaylistWidget';
import type { Widget } from '../../types/bouquet';

export default function WidgetCard({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'spotify':   return <SpotifyWidget   widget={widget} />;
    case 'youtube':   return <YoutubeWidget   widget={widget} />;
    case 'movie':     return <MovieWidget     widget={widget} />;
    case 'pinterest': return <PinterestWidget widget={widget} />;
    case 'photo':     return <PhotoWidget     widget={widget} />;
    case 'sticker':   return <StickerWidget   widget={widget} />;
    case 'link':      return <LinkWidget      widget={widget} />;
    case 'playlist':  return <PlaylistWidget  widget={widget} />;
  }
}
