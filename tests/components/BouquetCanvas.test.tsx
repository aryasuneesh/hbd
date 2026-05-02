import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BouquetCanvas from '../../src/components/sender/BouquetCanvas';
import type { Widget } from '../../src/types/bouquet';

const mockWidget: Widget = {
  id: '1', type: 'sticker', emoji: '🌸',
  rotation: 0, position: { x: 30, y: 40 },
  stickerKey: '🌸', storageUrl: '',
};

describe('BouquetCanvas', () => {
  it('renders placed widgets', () => {
    render(
      <BouquetCanvas
        widgets={[mockWidget]}
        onAddWidget={vi.fn()}
        onRemoveWidget={vi.fn()}
        activePopup={null}
        onClosePopup={vi.fn()}
      />
    );
    expect(screen.getByText('🌸')).toBeInTheDocument();
  });

  it('enforces 12-widget maximum', () => {
    const twelveWidgets = Array.from({ length: 12 }, (_, i) => ({
      ...mockWidget, id: String(i),
    }));
    const onAddWidget = vi.fn();
    render(
      <BouquetCanvas
        widgets={twelveWidgets}
        onAddWidget={onAddWidget}
        onRemoveWidget={vi.fn()}
        activePopup={null}
        onClosePopup={vi.fn()}
      />
    );
    // all add buttons should be disabled at limit
    const addBtns = screen.getAllByRole('button', { name: /add/i });
    addBtns.forEach((btn) => expect(btn).toBeDisabled());
  });
});
