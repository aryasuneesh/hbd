import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingScreen from '../../../src/components/receiver/LandingScreen';

describe('LandingScreen', () => {
  it('shows bouquet tagline when containerType is bouquet', () => {
    render(
      <LandingScreen
        senderName="Arya"
        containerType="bouquet"
        recipientName="Priya"
        onOpen={vi.fn()}
      />
    );
    expect(screen.getByText(/little bouquet/i)).toBeInTheDocument();
  });

  it('shows basket tagline when containerType is basket', () => {
    render(
      <LandingScreen
        senderName="Arya"
        containerType="basket"
        recipientName="Priya"
        onOpen={vi.fn()}
      />
    );
    expect(screen.getByText(/cute gift basket/i)).toBeInTheDocument();
  });

  it('calls onOpen when the button is clicked', () => {
    const onOpen = vi.fn();
    render(
      <LandingScreen
        senderName="Arya"
        containerType="bouquet"
        recipientName="Priya"
        onOpen={onOpen}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /open it/i }));
    expect(onOpen).toHaveBeenCalledOnce();
  });
});
