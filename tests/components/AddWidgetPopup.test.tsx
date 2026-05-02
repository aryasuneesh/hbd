import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddWidgetPopup from '../../src/components/sender/popups/AddWidgetPopup';

describe('AddWidgetPopup', () => {
  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    render(
      <AddWidgetPopup
        title="Add a song 🎵"
        emoji="🌸"
        onEmojiChange={vi.fn()}
        onCancel={onCancel}
        onAdd={vi.fn()}
        addDisabled={false}
      >
        <div>fields</div>
      </AddWidgetPopup>
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls onAdd when Add is clicked and not disabled', () => {
    const onAdd = vi.fn();
    render(
      <AddWidgetPopup
        title="Add a song 🎵"
        emoji="🌸"
        onEmojiChange={vi.fn()}
        onCancel={vi.fn()}
        onAdd={onAdd}
        addDisabled={false}
      >
        <div>fields</div>
      </AddWidgetPopup>
    );
    fireEvent.click(screen.getByText('Add ✦'));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it('does not call onAdd when addDisabled is true', () => {
    const onAdd = vi.fn();
    render(
      <AddWidgetPopup
        title="Add"
        emoji="🌸"
        onEmojiChange={vi.fn()}
        onCancel={vi.fn()}
        onAdd={onAdd}
        addDisabled={true}
      >
        <div />
      </AddWidgetPopup>
    );
    fireEvent.click(screen.getByText('Add ✦'));
    expect(onAdd).not.toHaveBeenCalled();
  });
});
