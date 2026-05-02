import { useState, useEffect } from 'react';
import { getBouquet } from '../../lib/firestore';
import LandingScreen from './LandingScreen';
import CardFold from './CardFold';
import CardEnvelope from './CardEnvelope';
import BouquetContainer from './BouquetContainer';
import BasketContainer from './BasketContainer';
import PlaylistPlayer from './PlaylistPlayer';
import type { Bouquet } from '../../types/bouquet';

type ReceiverState =
  | { phase: 'loading' }
  | { phase: 'notfound' }
  | { phase: 'landing';     bouquet: Bouquet }
  | { phase: 'card';        bouquet: Bouquet; musicPlaying: boolean }
  | { phase: 'container';   bouquet: Bouquet };

export default function BouquetPage({ bouquetId }: { bouquetId: string }) {
  const [state, setState] = useState<ReceiverState>({ phase: 'loading' });

  useEffect(() => {
    getBouquet(bouquetId).then((b) => {
      if (!b) setState({ phase: 'notfound' });
      else setState({ phase: 'landing', bouquet: b });
    });
  }, [bouquetId]);

  if (state.phase === 'loading') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-display italic text-muted animate-pulse">Loading your gift… 🌸</p>
      </div>
    );
  }

  if (state.phase === 'notfound') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <p className="font-display italic text-amber text-center text-lg">
          We couldn't find this bouquet 🥀<br />
          <span className="text-sm text-muted">The link may have expired or been mistyped.</span>
        </p>
      </div>
    );
  }

  const { bouquet } = state;

  if (state.phase === 'landing') {
    return (
      <LandingScreen
        senderName="your friend"
        recipientName={bouquet.recipientName}
        containerType={bouquet.containerType}
        onOpen={() => setState({ phase: 'card', bouquet, musicPlaying: false })}
      />
    );
  }

  if (state.phase === 'card') {
    const CardComponent = bouquet.cardStyle === 'fold' ? CardFold : CardEnvelope;
    return (
      <>
        {bouquet.playlistUrl && bouquet.playlistType && (
          <PlaylistPlayer
            url={bouquet.playlistUrl}
            type={bouquet.playlistType}
            playing={state.musicPlaying}
          />
        )}
        <CardComponent
          recipientName={bouquet.recipientName}
          message={bouquet.message}
          cardPhotoUrl={bouquet.cardPhotoUrl}
          onOpen={() => setState({ phase: 'card', bouquet, musicPlaying: true })}
          onSeeGifts={() => setState({ phase: 'container', bouquet })}
        />
      </>
    );
  }

  if (state.phase === 'container') {
    const ContainerComponent =
      bouquet.containerType === 'bouquet' ? BouquetContainer : BasketContainer;
    return (
      <>
        {bouquet.playlistUrl && bouquet.playlistType && (
          <PlaylistPlayer
            url={bouquet.playlistUrl}
            type={bouquet.playlistType}
            playing={true}
          />
        )}
        <ContainerComponent widgets={bouquet.widgets} />
      </>
    );
  }

  return null;
}
