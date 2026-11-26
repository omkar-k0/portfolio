import { test, expect } from '@playwright/test';
import { caseStudies } from '../src/data/projects';

// Case studies and the links that reach them (spec #7). Run against the production build.

const slug = (href: string) => href.split('/')[2];
// The five Case studies written before #7 keep their own section names; the checks below are for the new ones.
const EARLIER = new Set(['guidance-reconciliation-engine', 'faultline', 'werkbank', 'fuelcycle', 'portfolio']);
const NEW = caseStudies.filter((c) => !EARLIER.has(slug(c.href)));

test('every on-site link to a project opens a real page', async ({ page, request }) => {
  const hrefs = new Set<string>();
  // Home: all cards are in the page (Show more only hides them), so read every How it works and name link.
  await page.goto('/');
  for (const h of await page.$$eval('#work .slots a, #work h3 a', (as) =>
    as.filter((a) => a.closest('li')?.textContent?.includes('How it works') || a.closest('h3')).map((a) => a.getAttribute('href')!),
  )) hrefs.add(h);
  await page.goto('/work/');
  for (const h of await page.$$eval('a.row', (as) => as.map((a) => a.getAttribute('href')!))) hrefs.add(h);

  const own = [...hrefs].filter((h) => h.startsWith('/'));
  expect(own.length).toBeGreaterThanOrEqual(caseStudies.length);
  for (const h of own) {
    const r = await request.get(h);
    expect(r.status(), h).toBe(200);
    expect(await r.text(), h).not.toContain('<p class="label">404</p>');
  }
});

test('Next visits every Case study in work-index order, then wraps round', async ({ page }) => {
  const order = caseStudies.map((c) => c.href);
  await page.goto(order[0]);
  for (let i = 1; i <= order.length; i++) {
    await page.locator('.cs a.right').filter({ hasText: 'Next' }).click();
    await expect(page).toHaveURL(new RegExp(`${order[i % order.length]}$`));
  }
});

test('Previous is the reverse of Next', async ({ page }) => {
  const order = caseStudies.map((c) => c.href);
  for (let i = 0; i < order.length; i++) {
    await page.goto(order[i]);
    const prev = order[(i - 1 + order.length) % order.length];
    await expect(page.locator('.cs a').filter({ hasText: 'Previous' })).toHaveAttribute('href', prev);
  }
});

for (const c of NEW) {
  test.describe(`Case study ${c.name}`, () => {
    test('has the required sections', async ({ page }) => {
      await page.goto(c.href);
      const h2 = (await page.locator('.cs h2').allInnerTexts()).join('\n');
      expect(h2).toMatch(/why the obvious/i);
      expect(h2).toMatch(/decisions/i);
      expect(h2).toMatch(/what broke/i);
      expect(h2).toMatch(/reproduce it/i);
      expect(await page.locator('#decisions .decision').count()).toBeGreaterThanOrEqual(2);
    });

    test('shows a captioned screenshot', async ({ page }) => {
      await page.goto(c.href);
      const fig = page.locator('figure:has(img[src*="/shots/"])').first();
      await expect(fig).toHaveCount(1);
      expect((await fig.locator('img').getAttribute('alt'))?.trim().length).toBeGreaterThan(10);
      expect((await fig.locator('figcaption').innerText()).trim().length).toBeGreaterThan(10);
    });
  });
}

// Shipping gates (#19): no unconfirmed claim reaches a built page, and project links stay on the site.
test('no built page contains a [CONFIRM] marker', async ({ request }) => {
  const { readFileSync } = await import('node:fs');
  const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(paths.length).toBeGreaterThan(10);
  for (const p of paths) expect(await (await request.get(p)).text(), p).not.toContain('[CONFIRM]');
});

test('every How it works link and work-index row stays on the site', async ({ page }) => {
  await page.goto('/');
  const how = await page.$$eval('#work .slots li', (lis) =>
    lis.filter((li) => li.textContent?.includes('How it works')).map((li) => li.querySelector('a')?.getAttribute('href') ?? '(no link)'),
  );
  expect(how.length).toBeGreaterThanOrEqual(9);
  for (const h of how) expect(h, `How it works → ${h}`).toMatch(/^\/work\/[a-z0-9-]+\/$/);
  await page.goto('/work/');
  const links = await page.$$eval('a.row', (as) => as.map((a) => a.getAttribute('href')!));
  expect(links.length, 'work-index rows that link somewhere').toBe(caseStudies.length);
  for (const h of links) expect(h).toMatch(/^\/work\/[a-z0-9-]+\/$/);
  expect(caseStudies.length).toBe(12);
});
