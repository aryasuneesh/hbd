import { useState } from 'react';
import StepIndicator from './StepIndicator';
import CardStep from './CardStep';
import CanvasStep from './CanvasStep';
import { saveBouquet } from '../../lib/firestore';
import type { Bouquet, CardStyle, ContainerType, Widget } from '../../types/bouquet';

interface Props { onComplete: (bouquetId: string) => void; }

export interface CardData {
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
      onComplete(id);
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
