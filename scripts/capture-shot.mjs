// Capture an element of the built site as a WebP screenshot for a home card.
// Usage (with `npx astro preview --port 4322` running):
//   node scripts/capture-shot.mjs /work/faultline/ ".term" public/shots/faultline-heldout.webp
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const [path, selector, out] = process.argv.slice(2);
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
await page.goto(`http://localhost:4322${path}`);
const el = page.locator(selector).first();
await el.evaluate((e) => { e.style.maxWidth = '600px'; e.querySelector('.caption')?.remove(); });
const png = await el.screenshot();
const webp = await page.evaluate(async (b64) => {
  const img = new Image();
  img.src = `data:image/png;base64,${b64}`;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  c.getContext('2d').drawImage(img, 0, 0);
  return c.toDataURL('image/webp', 0.85).split(',')[1];
}, png.toString('base64'));
writeFileSync(out, Buffer.from(webp, 'base64'));
console.log(out);
await browser.close();
