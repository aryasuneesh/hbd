import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fdf6ec',
        sand: '#e8c9a0',
        terracotta: '#c4845c',
        amber: '#6b4c2a',
        blush: '#f2c4b0',
        muted: '#a08060',
        stem: '#7a9a5a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Lato', '"Helvetica Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
