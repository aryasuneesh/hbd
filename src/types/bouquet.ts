export type CardStyle = 'fold' | 'envelope';
export type ContainerType = 'bouquet' | 'basket';
export type WidgetType = 'spotify' | 'youtube' | 'movie' | 'pinterest' | 'photo' | 'sticker';
export type PlaylistType = 'spotify' | 'youtube';

export interface Position { x: number; y: number; }

interface BaseWidget {
  id: string;
  type: WidgetType;
  emoji: string;
  rotation: number;   // degrees, -25 to +25
  position: Position; // percentage of canvas 0–100
}

export interface SpotifyWidget extends BaseWidget {
  type: 'spotify';
  spotifyUrl: string;
  trackTitle: string;
  artistName: string;
  albumArtUrl: string;
}

export interface YoutubeWidget extends BaseWidget {
  type: 'youtube';
  youtubeUrl: string;
  videoTitle: string;
  channelName: string;
  thumbnailUrl: string;
}

export interface MovieWidget extends BaseWidget {
  type: 'movie';
  pageUrl: string;
  movieTitle: string;
  year: string;
  posterUrl: string;
  director: string;
}

export interface PinterestWidget extends BaseWidget {
  type: 'pinterest';
  pageUrl: string;
  imageUrl: string;
  caption: string;
}

export interface PhotoWidget extends BaseWidget {
  type: 'photo';
  storageUrl: string;
  caption: string;
}

export interface StickerWidget extends BaseWidget {
  type: 'sticker';
  stickerKey: string;  // pre-made sticker ID or empty string if custom
  storageUrl: string;  // empty string if pre-made
}

export type Widget =
  | SpotifyWidget
  | YoutubeWidget
  | MovieWidget
  | PinterestWidget
  | PhotoWidget
  | StickerWidget;

export interface Bouquet {
  id?: string;
  createdAt?: Date;
  cardStyle: CardStyle;
  containerType: ContainerType;
  recipientName: string;
  message: string;
  cardPhotoUrl: string | null;
  playlistUrl: string | null;
  playlistType: PlaylistType | null;
  widgets: Widget[];
}

// Type guards
export const isSpotifyWidget   = (w: Widget): w is SpotifyWidget   => w.type === 'spotify';
export const isYoutubeWidget   = (w: Widget): w is YoutubeWidget   => w.type === 'youtube';
export const isMovieWidget     = (w: Widget): w is MovieWidget     => w.type === 'movie';
export const isPinterestWidget = (w: Widget): w is PinterestWidget => w.type === 'pinterest';
export const isPhotoWidget     = (w: Widget): w is PhotoWidget     => w.type === 'photo';
export const isStickerWidget   = (w: Widget): w is StickerWidget   => w.type === 'sticker';
