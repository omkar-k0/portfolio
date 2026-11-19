import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config';
import { flagships } from '../data/projects';
import { getPosts } from '../lib/substack';

// Case studies have fixed publication dates; notes come from Substack.
const published: Record<string, string> = {
  'guidance-reconciliation-engine': '2026-11-19',
  faultline: '2026-11-19',
  werkbank: '2026-11-19',
};
const extra = [{ title: 'Case study: This website', link: '/work/portfolio/', description: 'Can a portfolio prove its claims instead of asking you to trust them?', pubDate: new Date('2026-11-19') }];

export async function GET(context: APIContext) {
  const studies = flagships
    .filter((f) => f.ready && published[f.slug])
    .map((f) => ({
      title: `Case study: ${f.name}`,
      link: `/work/${f.slug}/`,
      description: f.question,
      pubDate: new Date(published[f.slug]),
    }));
  const notes = (await getPosts()).map((p) => ({
    title: p.title,
    link: p.link,
    description: p.summary,
    pubDate: p.date,
  }));
  return rss({
    title: `${SITE.name} · case studies and notes`,
    description: SITE.pitch,
    site: context.site!,
    items: [...studies, ...extra, ...notes].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
  });
}
