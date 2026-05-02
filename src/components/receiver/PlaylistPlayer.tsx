import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useMusicContext } from '../../contexts/MusicContext';

interface Props {
  url: string;
  type: 'spotify' | 'youtube';
  senderName?: string;
}

export interface PlaylistPlayerHandle {
  trigger: () => void;
}

function buildEmbedUrl(url: string, type: 'spotify' | 'youtube'): string {
  if (type === 'spotify') {
    const m = url.match(/spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
    if (!m) return '';
    return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&autoplay=1&theme=0`;
  }
  const m = url.match(/[?&]list=([^&]+)/);
  if (!m) return '';
  const origin = encodeURIComponent(window.location.origin);
  return `https://www.youtube.com/embed/videoseries?list=${m[1]}&autoplay=1&mute=1&enablejsapi=1&origin=${origin}`;
}

const PlaylistPlayer = forwardRef<PlaylistPlayerHandle, Props>(
  function PlaylistPlayer({ url, type, senderName }, ref) {
    const [triggered, setTriggered] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [iframeSrc, setIframeSrc] = useState('');
    const [teaserDismissed, setTeaserDismissed] = useState(false);
    const { backgroundPaused } = useMusicContext();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const embedUrl = buildEmbedUrl(url, type);
    const iframeH = type === 'spotify' ? 80 : 72;

    // Spotify can't autoplay without login — show a teaser overlay until the
    // user clicks it, at which point they interact directly with the embed.
    const showTeaser = triggered && type === 'spotify' && !teaserDismissed;

    // YouTube: listen for IFrame API events to unmute after muted autoplay starts.
    useEffect(() => {
      if (type !== 'youtube') return;
      const sendCmd = (func: string, args: unknown[] = []) => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func, args }), '*'
        );
      };
      const unmute = () => { sendCmd('unMute'); sendCmd('setVolume', [100]); };

      const handleMessage = (event: MessageEvent) => {
        if (!event.origin.includes('youtube.com')) return;
        try {
          const data = JSON.parse(event.data as string);
          if (data.event === 'onReady' || (data.event === 'onStateChange' && data.info === 1)) {
            unmute();
          }
        } catch { /* ignore non-JSON messages */ }
      };

      window.addEventListener('message', handleMessage);
      const fallback = setTimeout(unmute, 3000);
      return () => {
        window.removeEventListener('message', handleMessage);
        clearTimeout(fallback);
      };
    }, [type]);

    // YouTube: pause/resume via IFrame API when backgroundPaused changes.
    useEffect(() => {
      if (type !== 'youtube' || !triggered) return;
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: backgroundPaused ? 'pauseVideo' : 'playVideo',
          args: [],
        }), '*'
      );
    }, [backgroundPaused, type, triggered]);

    useImperativeHandle(ref, () => ({
      trigger() {
        if (!embedUrl || !iframeRef.current) return;
        // Imperative src assignment — inside the click handler, before any React
        // state update — keeps this inside Chrome's user-gesture window so the
        // cross-origin iframe is granted audio autoplay permission.
        iframeRef.current.src = embedUrl;
        setIframeSrc(embedUrl);
        setTriggered(true);
      },
    }), [embedUrl]);

    if (!embedUrl) return null;

    return (
      <>
        <div
          className="fixed top-0 left-0 right-0 z-40 shadow-md"
          style={{ display: triggered && !minimized ? 'block' : 'none' }}
          aria-hidden={!triggered || minimized}
        >
          <div className="flex items-center bg-[var(--card-bg)] border-b border-[var(--border)] px-3 py-1">
            <span className="text-[10px] font-body italic text-muted flex-1">
              ♪ background music{backgroundPaused ? ' — paused' : ''}
            </span>
            <button
              onClick={() => setMinimized(true)}
              className="text-[10px] font-body italic text-muted hover:text-amber transition-colors"
              aria-label="Minimize"
            >
              minimize ↑
            </button>
          </div>

          {backgroundPaused && (
            <div
              className="flex items-center justify-center bg-[var(--card-bg)]"
              style={{ height: iframeH }}
            >
              <p className="text-xs font-body italic text-muted">paused while you listen to a track…</p>
            </div>
          )}

          {/* iframe wrapper — position:relative so the teaser overlay can sit on top */}
          <div style={{ position: 'relative', display: backgroundPaused ? 'none' : 'block' }}>
            <iframe
              ref={iframeRef}
              src={iframeSrc || undefined}
              width="100%"
              height={iframeH}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              style={{ display: 'block', border: 0 }}
              title="background playlist"
            />

            {/* Teaser overlay for Spotify — sits over the embed, dismissed on click.
                Clicking the overlay counts as a user gesture, so Spotify can
                start playback from the native play button that's now unblocked. */}
            {showTeaser && (
              <div
                role="button"
                tabIndex={0}
                aria-label="Start music"
                onClick={() => setTeaserDismissed(true)}
                onKeyDown={(e) => e.key === 'Enter' && setTeaserDismissed(true)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className="bg-[var(--card-bg)]/90 hover:bg-[var(--card-bg)]/70 transition-colors"
              >
                <p className="text-xs font-body italic text-amber text-center px-6">
                  ♪ Click here for an auditory experience, curated by {senderName ?? 'your friend'}
                </p>
              </div>
            )}
          </div>
        </div>

        {triggered && minimized && (
          <button
            className="fixed top-3 right-3 z-40 bg-[var(--card-bg)] border border-[var(--border)] rounded-full px-3 py-1.5 shadow-sm flex items-center gap-1.5 text-xs font-body text-muted hover:text-amber transition-colors"
            onClick={() => setMinimized(false)}
            aria-label="Expand music player"
          >
            ♪ <span className="italic">music</span>
          </button>
        )}
      </>
    );
  }
);

export default PlaylistPlayer;
