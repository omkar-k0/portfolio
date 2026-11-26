# Portfolio scoring sheet

Nine criteria, each scored 0 to 10 by checking the live site, not by impression. Each criterion has five checks worth 2 points each. A check passes only if it is true on the live site at the stated viewport.

Target: every criterion at 9 or above, none below 8.

Viewports: desktop 1440 × 900, phone 390 × 844. "First screen" means without scrolling.

## 1. 6-second rule (home, first screen, desktop and phone)

1. The person's name is visible.
2. The role sought or the job title is visible.
3. Availability (hours, start, location) is visible.
4. At least one measured result (a number with its context) is visible.
5. A primary call to action (button) is visible.

## 2. Recruiter fit (home + hiring)

1. The CV can be downloaded within one click from the home page.
2. Hours per week, start date, location and work mode are stated on one page.
3. Skills are listed as scannable keywords (languages, tools), visible on the home page.
4. Proof of credentials beyond projects (degree, grades, certificates or events) is reachable within one click.
5. Languages are stated with levels.

## 3. Product confidence (home + case studies)

1. At least three projects link to a working live demo or a public release.
2. Every flagship shows at least one measured outcome on the home page.
3. Every Case study shows the real product (screenshots or embedded output), not only diagrams. (Widened on 26 Nov 2026 from "case studies": a project on the work index without a Case study fails.)
4. A count of shipped or tested work is visible (for example live demos, repositories with tests).
5. The strongest flagship's headline metric is measured on held-out or hand-labelled data, not pending.

## 4. Scannability (home, work index, one case study)

1. Every flagship on the home page has a one-line outcome with the key number emphasised.
2. Every case study opens with a summary box of three lines or fewer (problem, result, role).
3. Every case study has a table of contents or jump links to results.
4. No paragraph in a case study runs longer than about 90 words.
5. Project type tags (Product, Research, Open source, Tool) appear on the home page and the work index.

## 5. Conversion (all pages)

1. An "Email me" button is visible in the header on every page.
2. The hero has a primary and a secondary call to action as buttons.
3. Every case study ends with a contact block (not only the footer).
4. Every page ends with a contact block above the footer links.
5. Email links open with a pre-filled subject line.

## 6. 30-second skim (home → one case study)

1. In 30 seconds of scrolling the home page, all flagships, their outcomes and the contact are seen.
2. The work index states the number of projects and offers filters.
3. A case study's summary box and metric tiles answer "what, how well, my role" without reading prose.
4. Home page height is under about 5,500 px on desktop (raised from 5,000 on 21 Nov 2026 by Omkar: the extra height is visuals, not text).
5. Each case study links to the next and previous one.

## 7. Technical reviewer (case studies)

Widened on 26 Nov 2026 from flagship case studies to every Case study (see GLOSSARY.md): all 12 projects on the work index. A project without a Case study fails every check below.

1. Every Case study explains why the obvious approach fails.
2. Every Case study records at least two decisions with the road not taken.
3. Every Case study reports what broke and what is unproven.
4. Every number links to, or names, the file it came from.
5. Every Case study has a "Reproduce it" section with exact commands and files.

## Scores

Self-scored against the checks above on a local production build (the blind reviewer run was rate-limited). Re-score blind before treating these as final.

| Criterion | Baseline (bb6d3f8) | After step 0–4 | Failing check |
|---|---|---|---|
| 1. 6-second rule | 8 | 10 | — |
| 2. Recruiter fit | 6 | 10 | — (certificates still to add) |
| 3. Product confidence | 4 | 8 → 10 (20 Nov, after GRE labels) | — |
| 4. Scannability | 8 | 10 | — |
| 5. Conversion | 6 | 10 | — |
| 6. 30-second skim | 8 | 10 | — |
| 7. Technical reviewer | 8 | 10 | — |

3.5 now passes: the GRE headline is 97.9% on 188 blind hand labels (baseline 91.5%). faultline's held-out run is still pending.

Measured on 20 Nov 2026: home height 4,516 px at 1440 wide; name, role, availability, four proof numbers and both buttons above the fold at 1440×900 and 390×844; no case-study paragraph over 90 words; Lighthouse home and Werkbank 100/100/96/100 (the 96 is the analytics script, which only exists on Vercel).

## 8. Plain-language home page (added 20 Nov 2026)

Reader: someone with no technical background (recruiter, investor). The case studies keep the technical detail.

1. No banned jargon on the home page outside the tools list: top-1, baseline, split, dev, held-out, LLM, pipeline, eval, confidence band, ablation.
2. Every number on the home page reads as a count ("184 of 188"), not a metric name.
3. Home page prose scores 60 or higher on Flesch reading ease.
4. The "How I build" flow is visible on the home page.
5. Three non-technical people look at the home page for 30 seconds and can answer: What does Omkar build? Does it work? How do I contact him? Passes if all three answer all three.

## 9. First visual impression (added 25 Nov 2026)

Reader: a Screener (see GLOSSARY.md), who judges the site in seconds by Colour, Imagery and clarity. Checks 1–5 are automated in `tests/visuals.spec.ts` (`npm run build && npm test`).

1. The first screen contains Imagery (a picture, not only text) at 1440 × 900 and 390 × 844.
2. Each Project kind has one consistent colour on the home page, the work index and the case studies (Product petrol, Open source moss, Research clay, Tool grey).
3. Every coloured text passes WCAG AA contrast (4.5:1, or 3:1 for large text) in the light and dark themes.
4. Every flagship card on the home page shows a screenshot of the real product.
5. The home page stays under 5,500 px at 1440 wide, and no page requests a host other than the site's own.

| Check | Baseline (main, e8749df) | After (feat/visuals) |
|---|---|---|
| 9.1 Imagery on the first screen | fail: text only | pass: confidence-gate illustration (GRE run, 188 → 181 rules, 7 AI) |
| 9.2 One colour per Project kind | fail: kind colours on cover panels only | pass: proof band, cards, work index, case-study headers, progress bar |
| 9.3 WCAG AA for coloured text | pass | pass |
| 9.4 Screenshot on every flagship card | fail: abstract glyphs | pass: GRE, faultline (sealed-test output), Werkbank |
| 9.5 Height and third-party requests | pass: 4,140 px, none | pass: 4,238 px, none |
| **Score** | **4** | **10** |

Measured on 25 Nov 2026 on local production builds, light and dark, in Chrome. The professional photo is not counted: the slot stays empty until `SITE.photo` is set.

## Widened criterion 7 and check 3.3 (26 Nov 2026)

Scored on a local production build of `main` (f04af86), from the built pages' headings, images and the source audit of 25 Nov 2026. 12 projects on the work index; 5 have a Case study (GRE, faultline, Werkbank, fuelcycle, This website).

| Check | Baseline (main, f04af86) | After (feat/case-studies) |
|---|---|---|
| 3.3 Every Case study shows the real product | fail: 7 projects have no Case study (the 5 that do pass: screenshots, or faultline's and this site's embedded output) | pass: all 12; the 7 new ones each have a captioned screenshot or redrawn chart |
| 7.1 Why the obvious approach fails | fail: 7 missing; This website has no such section | fail: 11 of 12; This website still has no such section |
| 7.2 At least two decisions with the road not taken | fail: 7 missing | pass: all 12 (3 to 5 each) |
| 7.3 What broke and what is unproven | fail: 7 missing | pass: all 12 (profile-hud states there is no record of what broke) |
| 7.4 Every number names its file | fail: 5 live claims their Sources do not support (ESG, FinBERT, DAX, Dem Fragen, profile-hud) | pass: claims corrected; every number names its Source, non-public ones marked "not public" |
| 7.5 "Reproduce it" with exact commands and files | fail: 7 missing | fail: 10 of 12; FinBERT fusion and DAX 40 say plainly they cannot be rerun (code not published) |
| **Criterion 3** | **8** | **10** |
| **Criterion 7** | **0** | **6** |

After-row scored on 26 Nov 2026 on a local production build of feat/case-studies (17e5ffa); all 47 Playwright tests pass, home page 4,238 px at 1440 wide. Expected on the branch, recorded before the work so the after-row is not tuned to it: 7.5 still fails for FinBERT fusion and DAX 40 (no published code), and 7.1 still fails for This website unless its Case study gains that section (out of scope for #7). Both expectations held: those are the two failing checks.
