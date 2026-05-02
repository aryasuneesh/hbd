import { useState, useEffect } from 'react';
import { fetchSpotifyMeta } from '../lib/oembed';
import { fetchYoutubeMeta } from '../lib/oembed';
import { fetchOgMeta } from '../lib/og';
import type { WidgetType } from '../types/bouquet';

type Meta = Record<string, string>;

interface WidgetMetaResult {
  meta: Meta | null;
  loading: boolean;
  error: string | null;
}

const DEBOUNCE_MS = 600;

export function useWidgetMeta(type: WidgetType, url: string): WidgetMetaResult {
  const [meta, setMeta]       = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!url.trim()) { setMeta(null); return; }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        let result: Meta;
        if (type === 'spotify')        result = await fetchSpotifyMeta(url) as unknown as Meta;
        else if (type === 'youtube')   result = await fetchYoutubeMeta(url) as unknown as Meta;
        else                           result = await fetchOgMeta(url) as unknown as Meta;
        setMeta(result);
      } catch {
        setError('Could not fetch metadata. Check the URL and try again.');
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [type, url]);

  return { meta, loading, error };
}
