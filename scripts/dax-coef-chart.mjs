// Redraws the DAX 40 coefficient table (slide 14 of the team deck, not public; same values as Table 4 of
// the term paper) as a chart: coefficient and 95% interval from the reported HC1 standard errors.
// Writes public/shots/dax-coefficients.webp.   node scripts/dax-coef-chart.mjs
import sharp from 'sharp';

const models = ['M1 pooled', 'M2 + size', 'M3 + year FE', 'M4 + firm FE'];
const panels = [
  { name: 'Profitability (ROA)', coef: [-0.590, -0.481, -0.477, -0.325], se: [0.291, 0.278, 0.283, 0.114] },
  { name: 'Asset tangibility', coef: [0.195, 0.185, 0.180, 0.167], se: [0.102, 0.096, 0.097, 0.122] },
];
const W = 1040, H = 440, top = 70, rowH = 72, left = 170, pw = 400, gap = 50;
const lo = -1.2, hi = 0.6;
const x = (p, v) => left + p * (pw + gap) + ((v - lo) / (hi - lo)) * pw;
const ink = '#1a1a1a', muted = '#6b6b6b', tone = '#a8481f', rule = '#d9d6cf';
let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="Helvetica, Arial, sans-serif">
<rect width="100%" height="100%" fill="#fbfaf7"/>`;
panels.forEach((pn, p) => {
  const x0 = left + p * (pw + gap);
  s += `<text x="${x0}" y="34" font-size="20" font-weight="600" fill="${ink}">${pn.name}</text>`;
  s += `<line x1="${x(p, 0)}" y1="${top - 10}" x2="${x(p, 0)}" y2="${top + rowH * 4}" stroke="${muted}" stroke-dasharray="4 4"/>`;
  for (const t of [-1, -0.5, 0, 0.5]) {
    s += `<line x1="${x(p, t)}" y1="${top + rowH * 4}" x2="${x(p, t)}" y2="${top + rowH * 4 + 6}" stroke="${muted}"/>`;
    s += `<text x="${x(p, t)}" y="${top + rowH * 4 + 26}" font-size="15" fill="${muted}" text-anchor="middle">${t}</text>`;
  }
  pn.coef.forEach((c, i) => {
    const y = top + rowH * i + rowH / 2, e = 1.96 * pn.se[i];
    s += `<line x1="${x0}" y1="${y + rowH / 2}" x2="${x0 + pw}" y2="${y + rowH / 2}" stroke="${rule}"/>`;
    s += `<line x1="${x(p, c - e)}" y1="${y}" x2="${x(p, c + e)}" y2="${y}" stroke="${tone}" stroke-width="3"/>`;
    s += `<circle cx="${x(p, c)}" cy="${y}" r="7" fill="${tone}"/>`;
    s += `<text x="${x(p, c)}" y="${y - 14}" font-size="15" fill="${ink}" text-anchor="middle">${c.toFixed(3)}</text>`;
  });
});
models.forEach((m, i) => { s += `<text x="20" y="${top + rowH * i + rowH / 2 + 5}" font-size="16" fill="${ink}">${m}</text>`; });
s += `<text x="20" y="${H - 18}" font-size="14" fill="${muted}">Coefficient on leverage (debt / assets), 95% interval from HC1 standard errors · n = 127 firm-years, 32 firms, FY2022–2025</text></svg>`;
const info = await sharp(Buffer.from(s)).webp({ quality: 90 }).toFile('public/shots/dax-coefficients.webp');
console.log(info.width, info.height, info.size);
