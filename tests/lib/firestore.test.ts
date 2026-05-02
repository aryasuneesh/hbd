import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/lib/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-id-123' }),
  getDoc: vi.fn(),
  doc: vi.fn(),
  serverTimestamp: vi.fn(() => 'TIMESTAMP'),
}));

import { saveBouquet } from '../../src/lib/firestore';
import type { Bouquet } from '../../src/types/bouquet';

const mockBouquet: Bouquet = {
  cardStyle: 'fold',
  containerType: 'bouquet',
  recipientName: 'Priya',
  message: 'Happy Birthday!',
  cardPhotoUrl: null,
  playlistUrl: null,
  playlistType: null,
  widgets: [],
};

describe('saveBouquet', () => {
  it('returns a non-empty bouquet ID', async () => {
    const id = await saveBouquet(mockBouquet);
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });
});
