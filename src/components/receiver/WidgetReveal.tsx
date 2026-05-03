import SpotifyExpanded   from './expanded/SpotifyExpanded';
import YoutubeExpanded   from './expanded/YoutubeExpanded';
import MovieExpanded     from './expanded/MovieExpanded';
import PinterestExpanded from './expanded/PinterestExpanded';
import PhotoExpanded     from './expanded/PhotoExpanded';
import StickerWidget     from '../widgets/StickerWidget';
import LinkExpanded      from './expanded/LinkExpanded';
import PlaylistExpanded  from './expanded/PlaylistExpanded';
import type { Widget }   from '../../types/bouquet';

export default function WidgetReveal({ widget, onClose }: { widget: Widget; onClose: () => void }) {
  switch (widget.type) {
    case 'spotify':   return <SpotifyExpanded   widget={widget} onClose={onClose} />;
    case 'youtube':   return <YoutubeExpanded   widget={widget} onClose={onClose} />;
    case 'movie':     return <MovieExpanded     widget={widget} onClose={onClose} />;
    case 'pinterest': return <PinterestExpanded widget={widget} onClose={onClose} />;
    case 'photo':     return <PhotoExpanded     widget={widget} onClose={onClose} />;
    case 'sticker':   return <StickerWidget     widget={widget} />;
    case 'link':      return <LinkExpanded      widget={widget} onClose={onClose} />;
    case 'playlist':  return <PlaylistExpanded  widget={widget} onClose={onClose} />;
  }
}
