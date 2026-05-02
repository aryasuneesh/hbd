import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmojiCover from '../../../src/components/receiver/EmojiCover';

describe('EmojiCover', () => {
  it('shows emoji when not revealed', () => {
    render(
      <EmojiCover emoji="🌸" revealed={false} onReveal={vi.fn()} rotation={5}>
        <div>widget content</div>
      </EmojiCover>
    );
    expect(screen.getByText('🌸')).toBeInTheDocument();
  });

  it('calls onReveal when tapped while hidden', () => {
    const onReveal = vi.fn();
    render(
      <EmojiCover emoji="🌸" revealed={false} onReveal={onReveal} rotation={5}>
        <div>widget</div>
      </EmojiCover>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onReveal).toHaveBeenCalledOnce();
  });

  it('does not call onReveal when already revealed', () => {
    const onReveal = vi.fn();
    render(
      <EmojiCover emoji="🌸" revealed={true} onReveal={onReveal} rotation={5}>
        <div>widget</div>
      </EmojiCover>
    );
    // No button when revealed
    expect(screen.queryByRole('button')).toBeNull();
  });
});
