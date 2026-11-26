# Portfolio

Source of [omkarkhadilkar.dev](https://omkarkhadilkar.dev): an Applied AI Engineer portfolio built around one idea, confidence gating. Cheap rules handle routine cases, a language model judges only the ambiguous rest, and every answer carries a confidence score, a citation, or the word *unverifiable*.

## Principles

- **No number without a source.** Every figure on the site lives in `src/data/projects.ts` with its evidence level (`measured`, `backtested`, `synthetic`, `pending`) and the file it came from. Unmeasured results show as pending, never estimated.
- **Readable first.** Static HTML, content visible without JavaScript, `prefers-reduced-motion` respected, no WebGL.
- **No third-party requests.** Fonts (IBM Plex Sans and Mono) are self-hosted via Fontsource, so visitors' IP addresses are not sent to Google.
- **Light by default**, dark on request (stored per browser).

## Stack

[Astro](https://astro.build) 5, plain CSS with design tokens in `src/styles/global.css`, deployed on Vercel.

## Structure

```
src/
  config.ts            name, pitch, email, social links
  data/projects.ts     every project, metric and pipeline stage
  styles/global.css    tokens (colour, type, grid), light and dark; Project kind → colour
  layouts/Base.astro   head, theme script, nav, footer
  components/          Nav, Footer, EvidenceTag, Pipeline
  lib/substack.ts      fetches Substack posts at build time (never fails the build)
  pages/               home, work index, case studies, hiring, about, notes, rss.xml, privacy
```

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm test         # Playwright checks on the built site (uses your installed Chrome)
```

`tests/visuals.spec.ts` checks scoring criterion 9 (first visual impression), the case-study reading-progress bar and the photo slot against the production build. `tests/case-studies.spec.ts` checks that every on-site project link opens a real page, that Previous / Next runs through every Case study in work-index order, and that each new Case study has the required sections and a captioned screenshot. Both suites take the list of Case studies from `src/data/projects.ts`. `scripts/capture-shot.mjs` turns part of a built page into a WebP screenshot for a home card.

`public/sources/esg-regression.json` (and the raw `.txt`) is the Source for the ESG and bond spreads Case study. `scripts/esg-results.py` makes it by running the ESG repository's own `scripts/regression.py`, unchanged, on its committed panel data. See the script for the commands.

## Photo

Put a square photo (at least 480 px) in `public/` and set `SITE.photo` in `src/config.ts`. It then appears in the hero, on `/hiring/` and on `/about/`. Left empty, nothing is shown.

## Milestones

1. **Live** — home page on omkarkhadilkar.dev via Vercel; no dead links; 404, sitemap, social preview image; legal pages.
2. **Case studies** — Guidance Reconciliation Engine (template), then faultline, Werkbank, FinBERT fusion; `/work/` index.
3. **Recruiter layer** — `/hiring/` (EN + DE, CV and Lebenslauf), `/about/`, German summaries on flagships.
4. **Polish** — `/notes/` linked to Substack with RSS, accessibility and performance pass, cookie-free analytics, the site's own colophon case study.

Design references and the reasoning behind them are documented separately.
