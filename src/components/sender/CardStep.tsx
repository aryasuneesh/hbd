import type { CardData } from './CreatePage';
export default function CardStep({ onNext }: { onNext: (d: CardData) => void }) {
  return <div onClick={() => onNext({ recipientName: '', message: '', cardPhotoUrl: null, cardStyle: 'fold' })} />;
}
