import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface MusicContextValue {
  backgroundPaused: boolean;
  pauseBackground: () => void;
  resumeBackground: () => void;
}

const MusicContext = createContext<MusicContextValue>({
  backgroundPaused: false,
  pauseBackground: () => {},
  resumeBackground: () => {},
});

export function MusicProvider({ children }: { children: ReactNode }) {
  const [backgroundPaused, setBackgroundPaused] = useState(false);
  const pauseBackground  = useCallback(() => setBackgroundPaused(true),  []);
  const resumeBackground = useCallback(() => setBackgroundPaused(false), []);
  return (
    <MusicContext.Provider value={{ backgroundPaused, pauseBackground, resumeBackground }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusicContext = () => useContext(MusicContext);
