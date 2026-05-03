import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmojiPicker from '../EmojiPicker';

interface Props {
  title: string;
  emoji: string;
  onEmojiChange: (emoji: string) => void;
  onCancel: () => void;
  onAdd: () => void;
  addDisabled: boolean;
  children: ReactNode;
}

export default function AddWidgetPopup({
  title, emoji, onEmojiChange, onCancel, onAdd, addDisabled, children,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-amber/20 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div
          className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-popup)] w-full max-w-sm overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-sand/40 border-b border-[var(--border)] px-5 py-4">
            <h3 className="font-display text-base italic text-amber">{title}</h3>
          </div>

          {/* Body */}
          <div className="px-5 py-5 flex flex-col gap-4">
            {/* Emoji picker */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-body text-muted uppercase tracking-widest">
                Cover emoji
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    className="w-12 h-12 bg-sand/40 rounded-xl border border-[var(--border)] text-3xl flex items-center justify-center hover:border-terracotta transition-colors"
                    onClick={() => setPickerOpen((o) => !o)}
                  >
                    {emoji}
                  </button>
                  {pickerOpen && (
                    <EmojiPicker
                      onSelect={onEmojiChange}
                      onClose={() => setPickerOpen(false)}
                    />
                  )}
                </div>
                <p className="text-xs text-muted font-body italic leading-relaxed">
                  Tap to change. This is what<br />the receiver sees first.
                </p>
              </div>
            </div>

            {/* Type-specific fields */}
            {children}
          </div>

          {/* Footer */}
          <div className="border-t border-[var(--border)] px-5 py-4 flex justify-end items-center gap-3">
            <button
              onClick={onCancel}
              className="text-sm font-body italic text-muted hover:text-amber transition-colors px-2"
            >
              Cancel
            </button>
            <button
              onClick={addDisabled ? undefined : onAdd}
              disabled={addDisabled}
              className="bg-terracotta text-white text-sm font-body italic rounded-full px-5 py-2 transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              Add ✦
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
