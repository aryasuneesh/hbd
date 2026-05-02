import { useState } from 'react';

interface Props {
  bouquetId: string;
  onCreateAnother: () => void;
}

export default function SharePage({ bouquetId, onCreateAnother }: Props) {
  const link = `${window.location.origin}/b/${bouquetId}`;
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="bg-[var(--card-bg)] rounded-2xl shadow-[var(--shadow-popup)] p-10 max-w-md w-full flex flex-col items-center gap-6 border border-[var(--border)]">
        <div className="text-5xl">🌸</div>
        <h1 className="font-display text-2xl italic text-amber text-center">
          Your bouquet is ready!
        </h1>
        <p className="font-body text-sm text-muted text-center leading-relaxed">
          Copy the link below and send it to your friend 🎀
        </p>

        <div className="w-full bg-sand/40 rounded-xl p-3 flex items-center gap-3 border border-[var(--border)]">
          <span className="flex-1 text-xs text-amber font-mono truncate">{link}</span>
          <button
            onClick={handleCopy}
            className="bg-terracotta text-white text-xs font-body rounded-full px-4 py-2 shrink-0 transition-opacity hover:opacity-80"
          >
            {copied ? 'Copied ✓' : 'Copy link'}
          </button>
        </div>

        <button
          onClick={onCreateAnother}
          className="text-sm text-muted font-body italic hover:text-amber transition-colors"
        >
          Make another bouquet →
        </button>
      </div>
    </div>
  );
}
