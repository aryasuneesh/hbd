import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

const OG_TAG_RE = /<meta\s+(?:property|name)=["']og:(\w+)["']\s+content=["']([^"']+)["']/gi;
const RATE_LIMIT_PER_MIN = 10;
const callCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = callCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    callCounts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= RATE_LIMIT_PER_MIN) return true;
  entry.count++;
  return false;
}

export const og = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

  const ip = req.ip ?? 'unknown';
  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'Rate limit exceeded' });
    return;
  }

  const rawUrl = req.query.url as string | undefined;
  if (!rawUrl) { res.status(400).json({ error: 'Missing url param' }); return; }

  let targetUrl: string;
  try { targetUrl = decodeURIComponent(rawUrl); new URL(targetUrl); }
  catch { res.status(400).json({ error: 'Invalid URL' }); return; }

  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BouquetBot/1.0)' },
      redirect: 'follow',
    });
    const html = await response.text();

    const tags: Record<string, string> = {};
    let match: RegExpExecArray | null;
    while ((match = OG_TAG_RE.exec(html)) !== null) {
      tags[match[1]] = match[2];
    }

    res.json({
      title:       tags['title']       ?? '',
      description: tags['description'] ?? '',
      imageUrl:    tags['image']       ?? '',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
});
