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
  styles/global.css    tokens (colour, type, grid), light and dark
  layouts/Base.astro   head, theme script, nav, footer
  components/          Nav, Footer, EvidenceTag, Pipeline
  pages/index.astro    home
```

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Status

- [x] Home
- [ ] Case study template (first: Guidance Reconciliation Engine)
- [ ] Work index, Hiring, About, Notes

Design references and the reasoning behind them are documented separately.
