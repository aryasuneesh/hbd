import { useState } from 'react';
import StepIndicator from './StepIndicator';
import CardStep from './CardStep';
import CanvasStep from './CanvasStep';
import { saveBouquet } from '../../lib/firestore';
import type { Bouquet, CardStyle, ContainerType, OccasionType, Widget } from '../../types/bouquet';

interface CompletePayload {
  bouquetId: string;
  recipientName: string;
  senderName: string;
  occasion: OccasionType;
}

interface Props { onComplete: (payload: CompletePayload) => void; }

export interface CardData {
  occasion: OccasionType;
  senderName: string;
  recipientName: string;
  message: string;
  cardPhotoUrl: string | null;
  cardStyle: CardStyle;
}

export default function CreatePage({ onComplete }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleFinish(
    containerType: ContainerType,
    widgets: Widget[],
    playlistUrl: string | null,
    playlistType: 'spotify' | 'youtube' | null,
  ) {
    if (!cardData) return;
    setSaving(true);
    try {
      const bouquet: Bouquet = {
        ...cardData,
        containerType,
        widgets,
        playlistUrl,
        playlistType,
      };
      const id = await saveBouquet(bouquet);
      onComplete({
        bouquetId: id,
        recipientName: cardData.recipientName,
        senderName: cardData.senderName,
        occasion: cardData.occasion,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <StepIndicator current={step} total={2} />
      {step === 1 && (
        <CardStep
          onNext={(data) => { setCardData(data); setStep(2); }}
        />
      )}
      {step === 2 && cardData && (
        <CanvasStep
          onBack={() => setStep(1)}
          onFinish={handleFinish}
          saving={saving}
        />
      )}
    </div>
  );
}
