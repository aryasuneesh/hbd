import { useState } from 'react';
import type { CardData } from './CreatePage';
import type { CardStyle } from '../../types/bouquet';

interface Props { onNext: (data: CardData) => void; }

const CARD_STYLES: { value: CardStyle; label: string; desc: string; emoji: string }[] = [
  { value: 'fold',     label: 'Greeting Card', desc: 'Opens like a book', emoji: '📖' },
  { value: 'envelope', label: 'Envelope',       desc: 'Rises from an envelope', emoji: '✉️' },
];

export default function CardStep({ onNext }: Props) {
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage]             = useState('');
  const [cardStyle, setCardStyle]         = useState<CardStyle>('fold');

  const canProceed = recipientName.trim().length > 0 && message.trim().length > 0;

  function handleNext() {
    if (!canProceed) return;
    onNext({ recipientName: recipientName.trim(), message: message.trim(), cardPhotoUrl: null, cardStyle });
  }

  return (
    <div className="flex flex-col items-center px-4 pb-12">
      <div className="w-full max-w-lg bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] p-8 flex flex-col gap-6">

        <h2 className="font-display text-2xl italic text-amber text-center">
          Write the card 🌸
        </h2>

        {/* Recipient name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-body text-muted uppercase tracking-widest">To</label>
          <input
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Friend's name…"
            maxLength={60}
            className="bg-sand/30 border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-body text-amber placeholder-muted/60 outline-none focus:border-terracotta transition-colors"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-body text-muted uppercase tracking-widest">
            Your message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something warm…"
            maxLength={500}
            rows={5}
            className="bg-sand/30 border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-body text-amber placeholder-muted/60 outline-none focus:border-terracotta transition-colors resize-none leading-relaxed"
          />
          <span className="text-xs text-muted/60 text-right font-body">{message.length}/500</span>
        </div>

        {/* Card style picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-body text-muted uppercase tracking-widest">Card style</label>
          <div className="grid grid-cols-2 gap-3">
            {CARD_STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => setCardStyle(s.value)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-left
                  ${cardStyle === s.value
                    ? 'border-terracotta bg-blush/20'
                    : 'border-[var(--border)] bg-sand/20 hover:border-sand'}
                `}
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="font-display italic text-sm text-amber">{s.label}</span>
                <span className="font-body text-xs text-muted">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-terracotta text-white font-body italic rounded-full py-3 px-8 self-end transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          Next — build the bouquet ✦
        </button>
      </div>
    </div>
  );
}
