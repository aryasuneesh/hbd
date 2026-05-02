import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
(globalThis as unknown as Record<string, unknown>).fetch = mockFetch;

import { fetchSpotifyMeta, fetchYoutubeMeta } from '../../src/lib/oembed';

beforeEach(() => mockFetch.mockReset());

describe('fetchSpotifyMeta', () => {
  it('parses title and thumbnail from oEmbed response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'Blinding Lights - The Weeknd',
        thumbnail_url: 'https://img.spotify.com/art.jpg',
      }),
    });

    const result = await fetchSpotifyMeta('https://open.spotify.com/track/abc');
    expect(result.trackTitle).toBe('Blinding Lights');
    expect(result.artistName).toBe('The Weeknd');
    expect(result.albumArtUrl).toBe('https://img.spotify.com/art.jpg');
  });
});

describe('fetchYoutubeMeta', () => {
  it('parses title, channel, and thumbnail', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'lofi hip hop radio',
        author_name: 'ChilledCow',
        thumbnail_url: 'https://img.youtube.com/thumb.jpg',
      }),
    });

    const result = await fetchYoutubeMeta('https://youtube.com/watch?v=xyz');
    expect(result.videoTitle).toBe('lofi hip hop radio');
    expect(result.channelName).toBe('ChilledCow');
    expect(result.thumbnailUrl).toBe('https://img.youtube.com/thumb.jpg');
  });
});
