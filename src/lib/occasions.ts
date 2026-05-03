import type { OccasionType, ContainerType } from '../types/bouquet';

export interface OccasionConfig {
  label: string;
  emoji: string;
  cardEmoji: string;
  decorEmojis: string;
  cardGreeting: string;
  landingTagline: (senderName: string) => string;
  containerTagline: Record<ContainerType, (senderName: string) => string>;
  shareMessage: (recipientName: string, senderName: string, link: string) => string;
  seeGiftsLabel: string;
}

export const OCCASIONS: Record<OccasionType, OccasionConfig> = {
  birthday: {
    label: 'Happy Birthday',
    emoji: '🎂',
    cardEmoji: '🎂',
    decorEmojis: '🎂 ✨ 🎈',
    cardGreeting: 'Happy Birthday,',
    landingTagline: (name) => `${name} sent you a birthday gift 🎂`,
    containerTagline: {
      bouquet: (name) => `${name} sent you a little bouquet 🌸`,
      basket:  (name) => `${name} sent you a cute gift basket 🧺`,
    },
    shareMessage: (recipient, sender, link) =>
      `🎂 Hey ${recipient}! ${sender} made you a little birthday gift — open it here ✨\n${link}`,
    seeGiftsLabel: 'See your gifts 🌷',
  },
  congratulations: {
    label: 'Congratulations',
    emoji: '🎉',
    cardEmoji: '🎉',
    decorEmojis: '🎉 🌟 🎊',
    cardGreeting: 'Congratulations,',
    landingTagline: (name) => `${name} made something to celebrate you 🎉`,
    containerTagline: {
      bouquet: (name) => `${name} sent you a bouquet of congratulations 🌸`,
      basket:  (name) => `${name} put together a celebration basket 🎊`,
    },
    shareMessage: (recipient, sender, link) =>
      `🎉 Congratulations ${recipient}! ${sender} made something just for you 🌟\n${link}`,
    seeGiftsLabel: 'See your celebration 🌟',
  },
  'get-well-soon': {
    label: 'Get Well Soon',
    emoji: '🌼',
    cardEmoji: '🌼',
    decorEmojis: '🌼 💛 🌿',
    cardGreeting: 'Get Well Soon,',
    landingTagline: (name) => `${name} sent you some healing vibes 🌼`,
    containerTagline: {
      bouquet: (name) => `${name} picked you a bouquet of good vibes 🌸`,
      basket:  (name) => `${name} put together a feel-good basket 🌿`,
    },
    shareMessage: (recipient, sender, link) =>
      `🌼 Thinking of you, ${recipient} 💛 ${sender} made you something — hope it brightens your day!\n${link}`,
    seeGiftsLabel: "See what's inside 🌸",
  },
  'just-because': {
    label: 'Just Because',
    emoji: '💌',
    cardEmoji: '💌',
    decorEmojis: '💌 🌸 ✨',
    cardGreeting: 'Hey,',
    landingTagline: (name) => `${name} is thinking of you 💌`,
    containerTagline: {
      bouquet: (name) => `${name} sent you a little bouquet, just because 🌸`,
      basket:  (name) => `${name} put together something for you 💌`,
    },
    shareMessage: (recipient, sender, link) =>
      `💌 Hey ${recipient}! ${sender} just wanted to make you smile ✨\n${link}`,
    seeGiftsLabel: 'Open your surprises ✨',
  },
};

export const DEFAULT_OCCASION: OccasionType = 'birthday';
