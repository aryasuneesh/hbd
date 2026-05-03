import { useState, useEffect, useRef } from 'react';
import { getBouquet } from '../../lib/firestore';
import { MusicProvider } from '../../contexts/MusicContext';
import LandingScreen from './LandingScreen';
import CardFold from './CardFold';
import CardEnvelope from './CardEnvelope';
import BouquetContainer from './BouquetContainer';
import BasketContainer from './BasketContainer';
import PlaylistPlayer, { type PlaylistPlayerHandle } from './PlaylistPlayer';
import type { Bouquet } from '../../types/bouquet';

type ReceiverState =
  | { phase: 'loading' }
  | { phase: 'notfound' }
  | { phase: 'landing';   bouquet: Bouquet }
  | { phase: 'card';      bouquet: Bouquet }
  | { phase: 'container'; bouquet: Bouquet };

function BouquetPageInner({ bouquetId }: { bouquetId: string }) {
  const [state, setState] = useState<ReceiverState>({ phase: 'loading' });
  const playerRef = useRef<PlaylistPlayerHandle>(null);

  useEffect(() => {
    getBouquet(bouquetId).then((b) => {
      if (!b) setState({ phase: 'notfound' });
      else setState({ phase: 'landing', bouquet: b });
    });
  }, [bouquetId]);

  const bouquet = 'bouquet' in state ? state.bouquet : null;
  const CardComponent   = bouquet?.cardStyle      === 'fold'    ? CardFold       : CardEnvelope;
  const ContainerComponent = bouquet?.containerType === 'bouquet' ? BouquetContainer : BasketContainer;

  return (
    <>
      {/* PlaylistPlayer is mounted as soon as bouquet data arrives (even during
          the landing screen) so that the iframe DOM node exists in time for
          trigger() to set its src synchronously inside the "Open it" click
          handler — keeping the navigation inside Chrome's user-gesture context
          and unlocking audio autoplay for the cross-origin embed. */}
      {bouquet?.playlistUrl && bouquet?.playlistType && (
        <PlaylistPlayer
          ref={playerRef}
          url={bouquet.playlistUrl}
          type={bouquet.playlistType}
          senderName={bouquet.senderName}
        />
      )}

      {state.phase === 'loading' && (
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <p className="font-display italic text-muted animate-pulse">Loading your gift… 🌸</p>
        </div>
      )}

      {state.phase === 'notfound' && (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6">
          <p className="font-display italic text-amber text-center text-lg">
            We couldn't find this bouquet 🥀<br />
            <span className="text-sm text-muted">The link may have expired or been mistyped.</span>
          </p>
        </div>
      )}

      {state.phase === 'landing' && (
        <LandingScreen
          senderName={bouquet!.senderName}
          recipientName={bouquet!.recipientName}
          containerType={bouquet!.containerType}
          occasion={bouquet!.occasion}
          onOpen={() => {
            // trigger() MUST fire before setState so it runs synchronously
            // inside the click event — Chrome only grants audio autoplay
            // permission while the user-gesture context is still active.
            playerRef.current?.trigger();
            setState({ phase: 'card', bouquet: bouquet! });
          }}
        />
      )}

      {state.phase === 'card' && (
        <CardComponent
          recipientName={bouquet!.recipientName}
          message={bouquet!.message}
          cardPhotoUrl={bouquet!.cardPhotoUrl}
          occasion={bouquet!.occasion}
          onOpen={() => {}}
          onSeeGifts={() => setState({ phase: 'container', bouquet: bouquet! })}
        />
      )}

      {state.phase === 'container' && (
        <ContainerComponent widgets={bouquet!.widgets} />
      )}
    </>
  );
}

export default function BouquetPage({ bouquetId }: { bouquetId: string }) {
  return (
    <MusicProvider>
      <BouquetPageInner bouquetId={bouquetId} />
    </MusicProvider>
  );
}
