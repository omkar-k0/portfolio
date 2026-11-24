import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Criterion 8 "First visual impression" (docs/SCORING.md), the case-study progress bar and the photo slot.
// Run against the production build: npm run build && npm test

const PALETTE = {
  light: { Product: '#1d5c7a', 'Open source': '#44702f', Research: '#a8481f', Tool: '#5c5c5c' },
  dark: { Product: '#7cc4e4', 'Open source': '#9ccc7f', Research: '#f0956a', Tool: '#9a9a96' },
} as const;
type Theme = keyof typeof PALETTE;
type Kind = keyof (typeof PALETTE)['light'];

const CASE_STUDIES: Record<string, Kind> = {
  'guidance-reconciliation-engine': 'Product',
  faultline: 'Open source',
  werkbank: 'Product',
  fuelcycle: 'Open source',
  portfolio: 'Open source',
};
const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

async function useTheme(page: Page, theme: Theme) {
  await page.addInitScript((t) => {
    try { localStorage.setItem('theme', t); } catch {}
  }, theme);
}

// Computed colour of each [data-kind] element's tone, grouped by kind.
async function kindTones(page: Page) {
  return page.$$eval('[data-kind]', (els) =>
    els.map((el) => ({ kind: el.getAttribute('data-kind')!, tone: getComputedStyle(el).getPropertyValue('--tone').trim() })),
  );
}

// Contrast of every text element coloured in a palette colour, against the background behind it.
async function lowContrast(page: Page, colours: string[]) {
  return page.evaluate((palette) => {
    const parse = (c: string) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { r, g, b, a };
    };
    const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const bgOf = (el: Element | null): { r: number; g: number; b: number } => {
      for (let e = el; e; e = e.parentElement) {
        const c = parse(getComputedStyle(e).backgroundColor);
        if (c && c.a > 0.5) return c;
      }
      return parse(getComputedStyle(document.body).backgroundColor)!;
    };
    const bad: string[] = [];
    for (const el of document.querySelectorAll('body *')) {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
      if (!own) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || !(el as HTMLElement).offsetParent && cs.position !== 'fixed') continue;
      if (!palette.includes(cs.color)) continue;
      const fg = parse(cs.color)!;
      const bg = bgOf(el);
      const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
      const ratio = (hi + 0.05) / (lo + 0.05);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
      if (ratio < (large ? 3 : 4.5)) bad.push(`${el.tagName}.${el.className} "${el.textContent!.trim().slice(0, 30)}" ${ratio.toFixed(2)}`);
    }
    return bad;
  }, colours);
}

for (const theme of ['light', 'dark'] as Theme[]) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => useTheme(page, theme));

    // 8.1 The first screen contains Imagery, at desktop and phone sizes.
    for (const [name, vp] of Object.entries({ desktop: DESKTOP, phone: PHONE })) {
      test(`8.1 hero illustration on the first screen (${name})`, async ({ page }) => {
        await page.setViewportSize(vp);
        await page.goto('/');
        const art = page.getByRole('img', { name: /confidence gate/i });
        await expect(art).toBeVisible();
        const box = (await art.boundingBox())!;
        const visible = Math.min(box.y + box.height, vp.height) - Math.max(box.y, 0);
        // Desktop: fully on screen. Phone: it sits under the hero text, so at least a third shows.
        expect(visible / box.height).toBeGreaterThanOrEqual(name === 'desktop' ? 1 : 0.33);
      });
    }

    // 8.2 Each Project kind has one colour on the home page, the work index and the case studies.
    test('8.2 one colour per Project kind across pages', async ({ page }) => {
      const pages = ['/', '/work/', ...Object.keys(CASE_STUDIES).map((s) => `/work/${s}/`)];
      const seen: { kind: string; tone: string; page: string }[] = [];
      for (const p of pages) {
        await page.goto(p);
        for (const t of await kindTones(page)) seen.push({ ...t, page: p });
      }
      expect(seen.length).toBeGreaterThan(10);
      for (const s of seen) {
        expect(PALETTE[theme][s.kind as Kind], `unknown kind "${s.kind}" on ${s.page}`).toBeTruthy();
        expect(s.tone.toLowerCase(), `${s.kind} on ${s.page}`).toBe(PALETTE[theme][s.kind as Kind]);
      }
      // Every case study's header carries its own kind.
      for (const [slug, kind] of Object.entries(CASE_STUDIES)) {
        await page.goto(`/work/${slug}/`);
        await expect(page.locator('header.cs-head')).toHaveAttribute('data-kind', kind);
      }
    });

    // 8.3 Coloured text passes WCAG AA contrast.
    test('8.3 coloured text passes WCAG AA', async ({ page }) => {
      const colours = Object.values(PALETTE[theme]).map(rgb);
      for (const p of ['/', '/work/', '/hiring/', '/about/', ...Object.keys(CASE_STUDIES).map((s) => `/work/${s}/`)]) {
        await page.goto(p);
        expect(await lowContrast(page, colours), p).toEqual([]);
      }
    });
  });
}

// 8.4 Every Flagship card shows a product screenshot.
test('8.4 every Flagship card shows a screenshot', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#work article.flag:not(.extra)');
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) {
    const img = card.locator('img[src*="/shots/"]');
    await expect(img).toHaveCount(1);
    expect((await img.getAttribute('alt'))?.trim().length).toBeGreaterThan(10);
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  }
});

// 8.5 Home page height budget, and no third-party requests anywhere.
test('8.5 home page is under 5,500 px at desktop', async ({ page }) => {
  await page.goto('/');
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(h).toBeLessThan(5500);
});

test('8.5 no page requests another host', async ({ page, baseURL }) => {
  const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(paths.length).toBeGreaterThan(5);
  const own = new URL(baseURL!).host;
  const foreign: string[] = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (!['data:', 'blob:'].includes(u.protocol) && u.host !== own) foreign.push(`${u.host}${u.pathname}`);
  });
  for (const p of paths) await page.goto(p, { waitUntil: 'networkidle' });
  expect(foreign).toEqual([]);
});

// Reading-progress bar on case studies.
test.describe('progress bar', () => {
  const fraction = (page: Page) =>
    page.locator('[data-progress]').evaluate((el) => el.getBoundingClientRect().width / document.documentElement.clientWidth);

  for (const [slug, kind] of Object.entries(CASE_STUDIES)) {
    test(`fills from 0 to 1 by the contact block on ${slug}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`/work/${slug}/`);
      const bar = page.locator('[data-progress]');
      // Shown (by its script), even while it is still 0 px wide at the top of the page.
      expect(await bar.evaluate((el) => getComputedStyle(el).display)).not.toBe('none');
      expect(await bar.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(rgb(PALETTE.light[kind]));
      expect(await bar.getAttribute('aria-hidden')).toBe('true');
      const box = (await bar.boundingBox())!;
      expect(box.y).toBe(0);
      expect(box.height).toBe(3);
      expect(await fraction(page)).toBeLessThan(0.02);

      let last = 0;
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (const y of [0.2, 0.4, 0.6].map((f) => f * height)) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(50);
        const f = await fraction(page);
        expect(f).toBeGreaterThanOrEqual(last);
        last = f;
      }
      expect(last).toBeGreaterThan(0.1);
      // Contact block fully in view: the bar is full.
      // Late-loading images can push it down, so scroll again until it stays put.
      await expect.poll(async () => {
        await page.locator('.cs-contact').evaluate((el) => el.scrollIntoView({ block: 'end' }));
        await page.waitForTimeout(100);
        return fraction(page);
      }).toBeGreaterThan(0.99);
      // Still pinned to the top after scrolling, above the navbar.
      expect((await bar.boundingBox())!.y).toBe(0);
    });
  }

  test('only on case studies', async ({ page }) => {
    for (const p of ['/', '/work/', '/hiring/', '/about/', '/notes/']) {
      await page.goto(p);
      await expect(page.locator('[data-progress]'), p).toHaveCount(0);
    }
  });

  test('not shown without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4322/work/faultline/');
    const bar = page.locator('[data-progress]');
    await expect(bar).toHaveCount(1);
    expect(await bar.evaluate((el) => getComputedStyle(el).display)).toBe('none');
    await ctx.close();
  });
});

// Photo slot: renders nothing until SITE.photo is set.
test('no photo or empty frame while no photo is configured', async ({ page }) => {
  for (const p of ['/', '/hiring/', '/about/']) {
    await page.goto(p);
    await expect(page.locator('[data-photo]'), p).toHaveCount(0);
  }
});

// Hover polish respects reduced motion.
test('cards do not move under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const card = page.locator('#work .cover').first();
  await card.hover();
  expect(await card.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
});

test('cards lift on hover', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const card = page.locator('#work .cover').first();
  await card.hover();
  await page.waitForTimeout(300);
  expect(await card.evaluate((el) => getComputedStyle(el).transform)).not.toBe('none');
});
