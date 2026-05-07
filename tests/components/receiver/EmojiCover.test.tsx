import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmojiCover from '../../../src/components/receiver/EmojiCover';

// EmojiCover is now pure presentation: it renders the emoji on the front face
// and the widget card on the back face. Tap/drag handling lives on the parent
// container so the two gestures don't compete on overlapping elements.

describe('EmojiCover', () => {
  it('shows emoji on the front face when not revealed', () => {
    render(
      <EmojiCover emoji="🌸" revealed={false} rotation={5}>
        <div>widget content</div>
      </EmojiCover>
    );
    expect(screen.getByText('🌸')).toBeInTheDocument();
  });

  it('renders the widget child when revealed', () => {
    render(
      <EmojiCover emoji="🌸" revealed={true} rotation={5}>
        <div data-testid="card">widget content</div>
      </EmojiCover>
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('does not expose any interactive button — interaction is on the parent', () => {
    render(
      <EmojiCover emoji="🌸" revealed={false} rotation={5}>
        <div>widget</div>
      </EmojiCover>
    );
    expect(screen.queryByRole('button')).toBeNull();
  });
});
