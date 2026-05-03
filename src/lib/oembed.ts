interface SpotifyMeta {
  trackTitle: string;
  artistName: string;
  albumArtUrl: string;
}

interface YoutubeMeta {
  videoTitle: string;
  channelName: string;
  thumbnailUrl: string;
}

export interface PlaylistMeta {
  playlistTitle: string;
  creatorName: string;
  thumbnailUrl: string;
  source: 'spotify' | 'youtube';
}

export async function fetchSpotifyMeta(url: string): Promise<SpotifyMeta> {
  const endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('Spotify oEmbed failed');
  const data = await res.json();
  // title format: "Song Name - Artist Name"
  const [trackTitle, ...artistParts] = (data.title as string).split(' - ');
  return {
    trackTitle: trackTitle.trim(),
    artistName: artistParts.join(' - ').trim(),
    albumArtUrl: data.thumbnail_url as string,
  };
}

export async function fetchYoutubeMeta(url: string): Promise<YoutubeMeta> {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('YouTube oEmbed failed');
  const data = await res.json();
  return {
    videoTitle:   data.title        as string,
    channelName:  data.author_name  as string,
    thumbnailUrl: data.thumbnail_url as string,
  };
}

export async function fetchPlaylistMeta(url: string): Promise<PlaylistMeta> {
  if (url.includes('spotify')) {
    const endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Spotify oEmbed failed');
    const data = await res.json();
    return {
      playlistTitle: data.title as string,
      creatorName:   (data.provider_name as string) ?? 'Spotify',
      thumbnailUrl:  data.thumbnail_url as string,
      source:        'spotify',
    };
  } else {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('YouTube oEmbed failed');
    const data = await res.json();
    return {
      playlistTitle: data.title        as string,
      creatorName:   data.author_name  as string,
      thumbnailUrl:  data.thumbnail_url as string,
      source:        'youtube',
    };
  }
}
