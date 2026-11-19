import { XMLParser } from 'fast-xml-parser';
import { SUBSTACK } from '../config';

export interface Post { title: string; link: string; date: Date; summary: string }

let cache: Post[] | null = null;

// Fetch the Substack RSS feed once per build. Never fails the build.
export async function getPosts(): Promise<Post[]> {
  if (cache) return cache;
  cache = [];
  if (!SUBSTACK.feed) return cache;
  try {
    const res = await fetch(SUBSTACK.feed, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = new XMLParser({ ignoreAttributes: true }).parse(await res.text());
    const items = [xml?.rss?.channel?.item ?? []].flat();
    cache = items
      .map((i: any) => ({
        title: String(i.title ?? '').trim(),
        link: String(i.link ?? ''),
        date: new Date(i.pubDate),
        summary: String(i.description ?? '').replace(/<[^>]+>/g, '').trim().slice(0, 220),
      }))
      .filter((p) => p.title && p.link.startsWith('https://'));
  } catch (e) {
    console.warn(`[substack] feed not loaded: ${(e as Error).message}`);
  }
  return cache;
}
