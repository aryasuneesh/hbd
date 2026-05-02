import { describe, it, expect } from 'vitest';
import { isSpotifyWidget, isYoutubeWidget } from '../../src/types/bouquet';

describe('widget type guards', () => {
  it('identifies a Spotify widget', () => {
    const w = {
      id: 'abc', type: 'spotify' as const, emoji: '🌸',
      rotation: -5, position: { x: 20, y: 30 },
      spotifyUrl: 'https://open.spotify.com/track/123',
      trackTitle: 'Test', artistName: 'Artist', albumArtUrl: 'https://img',
    };
    expect(isSpotifyWidget(w)).toBe(true);
    expect(isYoutubeWidget(w)).toBe(false);
  });
});
