interface OgMeta {
  title: string;
  description: string;
  imageUrl: string;
}

export async function fetchOgMeta(pageUrl: string): Promise<OgMeta> {
  const fnUrl = import.meta.env.VITE_OG_FUNCTION_URL as string;
  const res = await fetch(`${fnUrl}?url=${encodeURIComponent(pageUrl)}`);
  if (!res.ok) throw new Error('og fetch failed');
  return res.json() as Promise<OgMeta>;
}
