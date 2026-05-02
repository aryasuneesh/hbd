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
