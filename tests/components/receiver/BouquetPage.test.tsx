import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../../src/lib/firestore', () => ({
  getBouquet: vi.fn().mockResolvedValue({
    cardStyle: 'fold',
    containerType: 'bouquet',
    recipientName: 'Priya',
    message: 'Happy Birthday!',
    cardPhotoUrl: null,
    playlistUrl: null,
    playlistType: null,
    widgets: [],
  }),
}));

import BouquetPage from '../../../src/components/receiver/BouquetPage';

describe('BouquetPage', () => {
  it('shows landing screen on load', async () => {
    render(<BouquetPage bouquetId="abc123" />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /open it/i })).toBeInTheDocument()
    );
  });

  it('shows not found message for missing bouquet', async () => {
    const { getBouquet } = await import('../../../src/lib/firestore');
    vi.mocked(getBouquet).mockResolvedValueOnce(null);
    render(<BouquetPage bouquetId="missing" />);
    await waitFor(() =>
      expect(screen.getByText(/couldn't find/i)).toBeInTheDocument()
    );
  });
});
