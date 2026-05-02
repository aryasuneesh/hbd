import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../../src/lib/oembed', () => ({
  fetchSpotifyMeta: vi.fn().mockResolvedValue({
    trackTitle: 'Test Song',
    artistName: 'Test Artist',
    albumArtUrl: 'https://img',
  }),
  fetchYoutubeMeta: vi.fn(),
}));

vi.mock('../../src/lib/og', () => ({
  fetchOgMeta: vi.fn(),
}));

import { useWidgetMeta } from '../../src/hooks/useWidgetMeta';

describe('useWidgetMeta', () => {
  it('fetches Spotify metadata when a spotify URL is provided', async () => {
    const { result } = renderHook(() =>
      useWidgetMeta('spotify', 'https://open.spotify.com/track/abc')
    );

    await waitFor(() => expect(result.current.meta).not.toBeNull(), { timeout: 2000 });
    expect(result.current.meta).toMatchObject({
      trackTitle: 'Test Song',
      artistName: 'Test Artist',
    });
    expect(result.current.error).toBeNull();
  });
});
