import { useEffect, useRef } from 'react';

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: 'Flowers',
    emojis: [
      '🌸', '🌼', '🌺', '🌹', '🌷', '💐', '🌻', '🪷', '🪻', '🌾',
      '🌿', '🍀', '🌱', '🌲', '🌳', '🌴', '🎋', '🎍', '🍃', '🍂',
      '🍁', '🍄', '🌵', '🎄', '🪴', '🫚',
    ],
  },
  {
    label: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🩷', '🤍', '🖤', '🩶', '🤎', '💕', '💞', '💓', '💗', '💖', '💝', '💘', '💟', '🫀', '🫶', '❣️'],
  },
  {
    label: 'Celebration',
    emojis: ['🎉', '🎊', '✨', '🎈', '🎁', '🎀', '🥳', '🎂', '🍰', '🥂', '🌟', '💫', '⭐', '🌠', '🎆', '🎇', '🪅', '🎠', '🪄', '🏆', '🥇', '🎖️'],
  },
  {
    label: 'Faces',
    emojis: ['😊', '🥰', '😍', '🤗', '🥹', '😘', '☺️', '😄', '😁', '🤭', '😌', '🥺', '🫠', '😇', '🤩', '😋', '🥲', '😂', '🤣', '🫶'],
  },
  {
    label: 'Food',
    emojis: [
      '🍎', '🍊', '🍋', '🍋‍🟩', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑',
      '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🫛', '🥦', '🥬',
      '🌽', '🌶️', '🫑', '🥕', '🧅', '🧄', '🥔', '🍠', '🫘', '🥜',
      '🍞', '🥐', '🥖', '🫓', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞',
      '🧇', '🥓', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🫔', '🌮',
      '🌯', '🥙', '🧆', '🥗', '🍜', '🍝', '🍛', '🍲', '🍣', '🍱',
      '🍤', '🍙', '🍚', '🍘', '🍥', '🥮', '🍡', '🧁', '🍰', '🎂',
      '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🫙',
      '🍦', '🍧', '🍨', '🧃', '🥤', '🧋', '☕', '🍵', '🫖', '🍺',
      '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🫗', '🍾', '🧉', '🥛',
    ],
  },
  {
    label: 'Misc',
    emojis: ['🌈', '🎵', '🎶', '🎸', '🎹', '🎺', '🎻', '🥁', '🪘', '🫧', '🕊️', '🌊', '🌙', '☀️', '⛅', '🌦️', '❄️', '🔮', '💎', '🦋'],
  },
];

interface Props {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute left-0 top-14 z-50 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-popup)] p-3 w-64"
      style={{ maxHeight: 360, overflowY: 'auto' }}
    >
      {EMOJI_GROUPS.map((group) => (
        <div key={group.label} className="mb-3 last:mb-0">
          <p className="text-[9px] font-body text-muted uppercase tracking-widest mb-1.5 px-0.5">
            {group.label}
          </p>
          <div className="grid grid-cols-6 gap-0.5">
            {group.emojis.map((em) => (
              <button
                key={em}
                onClick={() => { onSelect(em); onClose(); }}
                className="w-9 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-sand/50 transition-colors"
                type="button"
              >
                {em}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
