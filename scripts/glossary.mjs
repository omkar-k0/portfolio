// Runs after `astro build`. On every built page, the first use of each glossary word in body text
// gets a plain-language tooltip: <abbr title="...">. Works without JavaScript (native title tooltip),
// and the meaning is also read out by screen readers.
// Skipped: <head>, scripts, styles, links, headings, code, and text that is already inside <abbr>.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TERMS = [
  { re: /\bLLMs?\b/, title: 'Large language model: the kind of AI behind ChatGPT and Claude' },
  { re: /\b(?:data )?pipelines?\b/i, title: 'Pipeline: the chain of automated steps that collects, cleans and moves data' },
  { re: /\bheld-out\b/i, title: 'Held-out test: cases kept sealed until the end, so the method could not be tuned to them' },
  { re: /\bbacktest(?:ed|s)?\b/i, title: 'Backtest: a test on past data, as if the method had been used back then' },
  { re: /\bclassifiers?\b/i, title: 'Classifier: a program that sorts each item into one of a few groups' },
  { re: /\bhand[- ]label(?:s|led|ed)?\b/i, title: 'Hand labels: answers I checked by hand, used to grade the system' },
];
const SKIP = new Set(['script', 'style', 'a', 'h1', 'h2', 'h3', 'h4', 'code', 'pre', 'abbr', 'title', 'head', 'button', 'svg', 'summary']);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

function annotate(html) {
  const used = new Set();
  const stack = [];
  // Split into tags and text, keep both.
  return html.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => {
    if (tag) {
      const t = /^<\/?([a-zA-Z0-9]+)/.exec(tag);
      if (t && !tag.endsWith('/>') && !/^<(meta|link|br|img|input|hr|source|area|wbr)\b/i.test(tag) && !tag.startsWith('<!')) {
        const name = t[1].toLowerCase();
        if (tag.startsWith('</')) { const i = stack.lastIndexOf(name); if (i >= 0) stack.length = i; }
        else stack.push(name);
      }
      return tag;
    }
    if (stack.some((n) => SKIP.has(n)) || !text.trim()) return text;
    let out = text;
    for (const term of TERMS) {
      if (used.has(term.title)) continue;
      const hit = term.re.exec(out);
      if (!hit) continue;
      used.add(term.title);
      out = out.slice(0, hit.index) + `<abbr class="gloss" title="${esc(term.title)}">${hit[0]}</abbr>` + out.slice(hit.index + hit[0].length);
    }
    return out;
  });
}

const files = walk(process.argv[2] ?? 'dist');
let n = 0;
for (const f of files) {
  const before = readFileSync(f, 'utf8');
  const after = annotate(before);
  if (after !== before) { writeFileSync(f, after); n += 1; }
}
console.log(`glossary: ${n} pages annotated`);
