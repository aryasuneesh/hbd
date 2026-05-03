import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { OccasionType } from '../../types/bouquet';
import { OCCASIONS, DEFAULT_OCCASION } from '../../lib/occasions';

interface Props {
  bouquetId: string;
  recipientName: string;
  senderName: string;
  occasion?: OccasionType;
  onCreateAnother: () => void;
}

type CopyMode = 'message' | 'link';

export default function SharePage({ bouquetId, recipientName, senderName, occasion, onCreateAnother }: Props) {
  const link = `${window.location.origin}/b/${bouquetId}`;
  const occ  = OCCASIONS[occasion ?? DEFAULT_OCCASION];

  const [copied, setCopied]   = useState<CopyMode | null>(null);
  const [burst,  setBurst]    = useState(false);

  const shareMessage = occ.shareMessage(recipientName, senderName, link);

  async function copyText(text: string, mode: CopyMode) {
    await navigator.clipboard.writeText(text);
    setCopied(mode);
    setBurst(true);
    setTimeout(() => { setCopied(null); setBurst(false); }, 2500);
  }

  async function handleNativeShare() {
    if (!('share' in navigator)) return;
    await navigator.share({
      title: `${occ.label} ${recipientName}!`,
      text: shareMessage,
    });
  }

  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col items-center gap-6">

        {/* Celebration burst */}
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {burst && (
              <>
                {['🌸', '✨', '🎀', occ.emoji, '🌷', '💫'].map((em, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-xl pointer-events-none"
                    initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1.4,
                      x: Math.cos((i / 6) * 2 * Math.PI) * 60,
                      y: Math.sin((i / 6) * 2 * Math.PI) * 60,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    {em}
                  </motion.span>
                ))}
              </>
            )}
          </AnimatePresence>
          <motion.div
            className="text-6xl"
            animate={burst ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {occ.emoji}
          </motion.div>
        </div>

        {/* Header */}
        <div className="text-center flex flex-col gap-1">
          <h1 className="font-display text-2xl italic text-amber">
            Your gift is ready!
          </h1>
          <p className="font-body text-sm text-muted">
            Send it to <span className="text-amber font-semibold">{recipientName}</span>
          </p>
        </div>

        {/* Preview card — shows what the share message looks like */}
        <div className="w-full bg-sand/30 rounded-2xl border border-[var(--border)] p-4 flex flex-col gap-2">
          <p className="text-[10px] font-body text-muted uppercase tracking-widest">Preview message</p>
          <p className="font-body text-sm text-amber leading-relaxed whitespace-pre-line">
            {shareMessage}
          </p>
        </div>

        {/* Share actions */}
        <div className="w-full flex flex-col gap-3">
          {/* Primary: copy message + link */}
          <motion.button
            onClick={() => copyText(shareMessage, 'message')}
            className="w-full bg-terracotta text-white font-body italic rounded-full py-3.5 px-6 flex items-center justify-center gap-2 text-sm transition-opacity hover:opacity-90 shadow-[0_4px_14px_rgba(196,132,92,0.3)]"
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-base">{copied === 'message' ? '✓' : '📋'}</span>
            {copied === 'message' ? 'Copied! Send it now 🎉' : 'Copy message + link'}
          </motion.button>

          {/* Native share (mobile) */}
          {canNativeShare && (
            <motion.button
              onClick={handleNativeShare}
              className="w-full bg-amber text-white font-body italic rounded-full py-3 px-6 flex items-center justify-center gap-2 text-sm transition-opacity hover:opacity-80"
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-base">↗️</span>
              Share via…
            </motion.button>
          )}

          {/* Secondary: link only */}
          <div className="w-full bg-[var(--card-bg)] rounded-xl p-3 flex items-center gap-3 border border-[var(--border)]">
            <span className="flex-1 text-xs text-amber font-mono truncate">{link}</span>
            <button
              onClick={() => copyText(link, 'link')}
              className="bg-sand/60 border border-[var(--border)] text-amber text-xs font-body rounded-full px-3 py-1.5 shrink-0 transition-colors hover:border-terracotta whitespace-nowrap"
            >
              {copied === 'link' ? 'Copied ✓' : 'Link only'}
            </button>
          </div>
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
