// Every number on the site comes from this file.
// Each one carries its evidence level and where it came from in the repo or paper.
// Rule: no number without a source. Unmeasured = 'pending'.

export type Evidence = 'measured' | 'backtested' | 'synthetic' | 'pending';

export interface Metric {
  value: string;
  label: string;
  evidence: Evidence;
  source: string; // file or document the number comes from
}

export interface Stage {
  label: string;
  detail: string;
  escalation?: boolean; // the step that handles the ambiguous rest
}

export interface Flagship {
  slug: string;
  ready: boolean; // true once /work/<slug>/ exists
  name: string;
  kind: 'Product' | 'Research' | 'Open source';
  status: string;
  question: string;
  outcome: string; // one line for the home page; **bold** marks the key number
  tags: string[];
  stages: Stage[];
  facts: string[]; // short real facts under the pipeline card
  links: { label: string; href: string }[];
  // Home page copy for a reader with no technical background. Technical detail lives in the case study.
  plain?: { problem: string; count: string; countLabel: string; compare: string; detail: string; stages: Stage[]; dots: { total: number; hit: number; cols: number }; slots: Slots };
}

export const proof: (Metric & { project: string; slug: string })[] = [
  // FinBERT fusion (0.878) comes back here once its repo and result file are public.
  {
    value: '584 of 586',
    label: 'planted data errors caught, 2 false alarms in 118,795 clean records',
    evidence: 'measured',
    source: 'fuelcycle results/dq_eval.json, 586 injected faults on 14 real days',
    project: 'fuelcycle',
    slug: 'fuelcycle',
  },
  {
    value: '95.8%',
    label: 'accuracy on the 40% of orders it routes on its own',
    evidence: 'measured',
    source: 'werkbank reports/eval.md, hand-written set n = 60',
    project: 'Werkbank',
    slug: 'werkbank',
  },
  {
    value: '89.6%',
    label: 'pipeline root causes named exactly, 0 of 48 wrong (dev split)',
    evidence: 'measured',
    source: 'faultline eval/results/dev/triage.md',
    project: 'faultline',
    slug: 'faultline',
  },
  {
    value: '97.9%',
    label: 'of 188 guidance items right against blind hand labels; 4% needed the LLM',
    evidence: 'measured',
    source: 'gre eval on 188 hand labels, 20 Nov 2026 (always-MET baseline 91.5%)',
    project: 'Guidance Reconciliation Engine',
    slug: 'guidance-reconciliation-engine',
  },
];

export const flagships: Flagship[] = [
  {
    slug: 'guidance-reconciliation-engine',
    ready: true,
    name: 'Guidance Reconciliation Engine',
    kind: 'Product',
    status: 'Live · 97.9% on hand labels',
    question: 'Did the company hit the guidance it gave last quarter?',
    outcome: 'Gets **184 of 188** forecasts right against blind hand labels. Rules decide 181; the LLM sees only the unclear 7, and must quote the filing.',
    tags: ['Python', 'SEC EDGAR', 'Claude Haiku'],
    stages: [
      { label: 'Fetch', detail: '8-K releases and XBRL facts' },
      { label: 'Extract', detail: 'Guidance items' },
      { label: 'Rules', detail: 'Clean numeric matches' },
      { label: 'LLM', detail: 'Ambiguous rest, quote-checked', escalation: true },
    ],
    facts: ['185 releases, 11 companies', '7 of 188 sent to the LLM', '97.9% vs 91.5% baseline'],
    plain: {
      problem: 'Every quarter, big companies tell investors how much money they expect to make. This tool reads the official filings and checks whether they kept that promise.',
      count: '184 of 188',
      slots: { how: { href: '/work/guidance-reconciliation-engine/' }, try: { href: 'https://guidance-reconciliation-engine.vercel.app' }, code: { href: 'https://github.com/omkar-k0/guidance-reconciliation-engine' } },
      dots: { total: 188, hit: 184, cols: 24 },
      countLabel: 'promises checked correctly, compared with my own check by hand',
      compare: 'Always guessing "kept" gets 172.',
      detail: 'Simple rules settle almost all of them. AI looks only at the 7 unclear cases and has to quote the filing. When it cannot be sure, it says so.',
      stages: [
        { label: 'Read the filings', detail: 'Official company reports to the US regulator' },
        { label: 'Find the promise', detail: 'The revenue range they gave investors' },
        { label: 'Rules check', detail: 'Clear cases settled by simple matching' },
        { label: 'AI for unclear ones', detail: "Must quote the filing, or says it can't tell", escalation: true },
      ],
    },
    links: [
      { label: 'Live', href: 'https://guidance-reconciliation-engine.vercel.app' },
      { label: 'Repo', href: 'https://github.com/omkar-k0/guidance-reconciliation-engine' },
    ],
  },
  {
    slug: 'faultline',
    ready: true,
    name: 'faultline',
    kind: 'Open source',
    status: 'Benchmark v1 released · triage built · held-out pending',
    question: 'Why did the dbt pipeline break, and where is the evidence?',
    outcome: 'Names the exact root cause for **89.6%** of 48 dev incidents, with **0** confidently wrong. Held-out score pending.',
    tags: ['dbt Core', 'sqlglot', 'DuckDB'],
    stages: [
      { label: 'Gather', detail: 'Monitor anomalies, failed tests' },
      { label: 'Group', detail: 'Symptoms joined by lineage' },
      { label: 'Propose', detail: 'Data and code causes' },
      { label: 'Test', detail: 'Each cause against the data' },
      { label: 'Rank', detail: "Survivors, or 'not confirmed'", escalation: true },
    ],
    facts: ['89.6% right at top-1 (dev)', '0 of 48 confidently wrong', 'Held-out score pending'],
    plain: {
      problem: 'Companies move their data through long chains of steps every night. When one step breaks, an engineer can spend hours finding out why. This tool finds the cause and shows the evidence.',
      count: '43 of 48',
      slots: { how: { href: '/work/faultline/' }, try: { href: 'https://github.com/omkar-k0/faultline#develop', note: 'runs on your machine' }, code: { href: 'https://github.com/omkar-k0/faultline' } },
      dots: { total: 48, hit: 43, cols: 16 },
      countLabel: 'test breakdowns traced to the exact cause',
      compare: 'Pasting the logs into a local AI found 1.',
      detail: 'It missed 5 and never blamed the wrong thing. A final test on cases it has never seen is still to come.',
      stages: [
        { label: 'Spot the problem', detail: 'Checks that watch the data on every run' },
        { label: 'Group the signs', detail: 'Related alerts traced back to one place' },
        { label: 'List suspects', detail: 'Possible causes in the data or the code' },
        { label: 'Test each one', detail: 'Against the actual data' },
        { label: 'Name the cause', detail: "With evidence, or 'not confirmed'", escalation: true },
      ],
    },
    links: [
      { label: 'Repo', href: 'https://github.com/omkar-k0/faultline' },
      { label: 'Benchmark', href: 'https://github.com/omkar-k0/faultline/releases/tag/benchmark-v1' },
    ],
  },
  {
    slug: 'werkbank',
    ready: true,
    name: 'Werkbank',
    kind: 'Product',
    status: 'Live demo · payments not connected',
    question: 'Which workshop should take this furniture order?',
    outcome: 'Right on **95.8%** of the orders it routes on its own. Unsure orders wait for a person.',
    tags: ['Classifier', 'Postgres', 'PWA · EN/DE'],
    stages: [
      { label: 'Request', detail: 'Free text, English or German' },
      { label: 'Classify', detail: 'Workshop, job type, urgency' },
      { label: 'Gate', detail: 'Confidence score' },
      { label: 'Review', detail: 'Unsure orders go to a person', escalation: true },
    ],
    facts: ['Top-1 88.3% (n = 60)', '40% auto-routed', '23.3% to review'],
    plain: {
      problem: 'A furniture shop gets orders as messages and has to send each one to the right workshop: carpentry, upholstery, paint or metal. This tool reads the order and sends it on.',
      count: '23 of 24',
      slots: { how: { href: '/work/werkbank/' }, try: { href: 'https://werkbank-gamma.vercel.app' }, code: { href: 'https://github.com/omkar-k0/werkbank' } },
      dots: { total: 24, hit: 23, cols: 12 },
      countLabel: 'orders it handled alone went to the right workshop',
      compare: 'Without the confidence check: 53 of 60.',
      detail: 'Of 60 orders I wrote by hand, it decided 24 alone, flagged 22 for a check and sent 14 to a person. Not yet tried on a real shop.',
      stages: [
        { label: 'Order arrives', detail: 'A message, in English or German' },
        { label: 'Read it', detail: 'Which workshop, what job, how urgent' },
        { label: 'How sure?', detail: 'A confidence score for every order' },
        { label: 'Unsure? A person decides', detail: 'Instead of a guess', escalation: true },
      ],
    },
    links: [
      { label: 'Live', href: 'https://werkbank-gamma.vercel.app' },
      { label: 'Repo', href: 'https://github.com/omkar-k0/werkbank' },
    ],
  },
  {
    slug: 'finbert-fusion',
    ready: false,
    name: 'FinBERT fusion',
    kind: 'Research',
    status: 'Research · code being published',
    question: 'When should a small model hand a sentence to an LLM?',
    outcome: 'Reaches **0.878** accuracy by sending only the unsure 12% to an LLM. The gain is 5 sentences, reported as such.',
    tags: ['FinBERT', 'Confidence gating', 'SEC filings'],
    stages: [
      { label: 'Filings', detail: 'Risk Factors and MD&A, 6 firms' },
      { label: 'FinBERT', detail: 'Fine-tuned, 3 classes' },
      { label: 'Gate', detail: 'Confidence below 0.75' },
      { label: 'LLM', detail: 'Claude Sonnet fallback', escalation: true },
    ],
    facts: ['12.2% escalated', 'LLM right on 83.3% of those', 'Gain is 5 sentences; CIs overlap'],
    links: [],
  },
];

// Home page cards 04 to 09, revealed three at a time under the flagships.
// chart: dots = a real success count; bar = a measured share; none = a finding or nothing measured yet.
// The same three actions on every home card. A slot without href shows its note instead of a link.
export interface Slot { href?: string; note?: string }
export interface Slots { how: Slot; try: Slot; code: Slot }

export type Chart =
  | { type: 'dots'; total: number; hit: number; cols: number }
  | { type: 'bar'; pct: number }
  | { type: 'none' };
export interface ExtraCard {
  slug: string; name: string; kind: string; batch: 2 | 3;
  problem: string; count: string; countLabel: string; detail: string; chart: Chart;
  slots: Slots;
  stages: Stage[]; keyLabel: string; // "How it works" strip, same as the flagship cards
}
export const extras: ExtraCard[] = [
  {
    slug: 'fuelcycle', name: 'fuelcycle', kind: 'Open source', batch: 2,
    problem: 'Fuel prices change thousands of times a day across France. Most data pipelines quietly drop bad records, so nobody knows how clean the result is. This one checks every price change and says why it kept or rejected it.',
    count: '584 of 586', countLabel: 'planted errors caught, with 2 false alarms in almost 119,000 clean records',
    detail: 'I hid 586 mistakes in 14 real days of data on purpose to test the checks. How well it handles the real oddities it finds still needs a check by hand.',
    chart: { type: 'dots', total: 586, hit: 584, cols: 40 },
    keyLabel: 'nothing is dropped without a reason',
    stages: [
      { label: 'Read the files', detail: 'Every French price change, a year of it' },
      { label: 'Check each one', detail: 'Rules flag bad prices, with a reason', escalation: true },
      { label: 'Daily prices', detail: 'France, regions and cities' },
      { label: 'Fill or wait?', detail: 'Answers only when it is sure' },
    ],
    slots: { how: { href: '/work/fuelcycle/' }, try: { href: 'https://fuelcycle-seven.vercel.app' }, code: { href: 'https://github.com/omkar-k0/fuelcycle' } },
  },
  {
    slug: 'sustainability', name: 'Sustainability commitment classifier', kind: 'Tool', batch: 2,
    problem: 'Company sustainability reports are full of climate promises. This tool reads them and sorts each promise: does it come with a number and a target year, or is it vague?',
    count: '120 of 1,562', countLabel: 'climate promises from five German companies come with a number and a target year',
    detail: 'So about 92 in 100 promises cannot be checked later. A first version counted the year itself as a number and said 12.3%; I found and fixed that.',
    chart: { type: 'bar', pct: 7.7 },
    keyLabel: 'fixed rules, no AI, decide this',
    stages: [
      { label: 'Read reports', detail: 'Sustainability PDFs from five companies' },
      { label: 'Find promises', detail: 'Sentences that commit to a climate goal' },
      { label: 'Number and year?', detail: 'Does the promise say how much and by when', escalation: true },
      { label: 'Count', detail: 'Checkable or vague, per company' },
    ],
    slots: { how: { href: 'https://github.com/omkar-k0/sustainability-commitment-classifier#readme', note: 'README' }, try: { note: 'no live demo yet' }, code: { href: 'https://github.com/omkar-k0/sustainability-commitment-classifier' } },
  },
  {
    slug: 'dax', name: 'DAX 40 capital structure', kind: 'Research', batch: 2,
    problem: 'Why do some big German companies borrow more than others? A study of the non-financial firms in the DAX 40 index, written for my M.Sc. with a team of four.',
    count: '127', countLabel: 'company-years from 32 firms, analysed in Python',
    detail: 'Main finding: more profitable firms tend to borrow less. Graded 1.3.',
    chart: { type: 'none' },
    keyLabel: 'the test that gives the answer',
    stages: [
      { label: 'Collect', detail: 'Annual reports, 32 firms, 2022 to 2025' },
      { label: 'Measure', detail: 'Share of debt, profitability, size' },
      { label: 'Compare', detail: 'Regression across firms and years', escalation: true },
      { label: 'Check', detail: 'Same test with other debt measures' },
    ],
    slots: { how: { note: 'FOM paper, not public' }, try: { note: 'research, nothing to run' }, code: { note: 'being published' } },
  },
  {
    slug: 'esg', name: 'ESG and bond spreads', kind: 'Research', batch: 3,
    problem: 'When a company gets a better green rating, does it get to borrow money more cheaply? I tested this on the bonds of large German companies.',
    count: 'No', countLabel: 'measurable effect in 56 observations',
    detail: 'The honest answer was no: none of the tests came close to a real effect. Reporting a result that found nothing is part of the work.',
    chart: { type: 'none' },
    keyLabel: 'the test that gives the answer',
    stages: [
      { label: 'Collect', detail: 'Green ratings and bond prices, 10 firms' },
      { label: 'Line up', detail: 'Rating changes next to borrowing costs' },
      { label: 'Test', detail: 'Regression, each firm over time', escalation: true },
      { label: 'Report', detail: 'No effect found, said plainly' },
    ],
    slots: { how: { note: 'write-up in progress' }, try: { note: 'research, nothing to run' }, code: { href: 'https://github.com/krakmo1/esg-bond-spreads' } },
  },
  {
    slug: 'gradelens', name: 'GradeLens', kind: 'Tool', batch: 3,
    problem: 'FOM students can see their grades, but not what they still need. This browser extension shows the grade each remaining exam needs to reach a target average.',
    count: 'v1.0', countLabel: 'Chrome extension in English and German, 25 automated tests',
    detail: 'Not measured with real students yet.',
    chart: { type: 'none' },
    keyLabel: 'the step that does the maths',
    stages: [
      { label: 'Read', detail: 'Grades the FOM portal already shows' },
      { label: 'Weight', detail: 'Average by credit points' },
      { label: 'Try each grade', detail: 'Which exam grade reaches the target', escalation: true },
      { label: 'Show', detail: 'The grade each open exam needs' },
    ],
    slots: { how: { href: 'https://github.com/omkar-k0/gradelens#how-it-works', note: 'README' }, try: { href: 'https://github.com/omkar-k0/gradelens#install', note: 'install from GitHub' }, code: { href: 'https://github.com/omkar-k0/gradelens' } },
  },
  {
    slug: 'demfragen', name: 'Dem Fragen', kind: 'Product', batch: 3,
    problem: 'People in India often do not know what the law says about their problem, or when they need a lawyer. This app answers in plain words and shows the legal source.',
    count: 'Not tested yet', countLabel: 'on real legal questions',
    detail: 'So far only a practice run with made-up questions. No accuracy number until real cases are checked.',
    chart: { type: 'none' },
    keyLabel: 'a person takes over here',
    stages: [
      { label: 'Ask', detail: 'A legal problem in plain words' },
      { label: 'Sort', detail: 'Which area of law it belongs to' },
      { label: 'Find the law', detail: 'Sources from India Code, cited in the answer' },
      { label: 'Lawyer if needed', detail: 'Says when to see an advocate', escalation: true },
    ],
    slots: { how: { href: 'https://github.com/omkar-k0/cuddly-octo-palm-tree#readme', note: 'README' }, try: { note: 'no public demo yet' }, code: { href: 'https://github.com/omkar-k0/cuddly-octo-palm-tree' } },
  },
];

export const ledger = [
  { slug: 'fuelcycle', name: 'fuelcycle', kind: 'Open source', note: 'Checks every French fuel price change in a year and says why it kept or rejected it', href: '/work/fuelcycle/' },
  { slug: 'sustainability', name: 'Sustainability commitment classifier', kind: 'Tool', note: 'Only 7.7% of 1,562 climate promises come with a number and a target year', href: 'https://github.com/omkar-k0/sustainability-commitment-classifier' },
  { slug: 'dax', name: 'DAX 40 capital structure', kind: 'Research', note: 'More profitable big German firms borrow less · grade 1.3', href: '' },
  { slug: 'esg', name: 'ESG and bond spreads', kind: 'Research', note: 'Better green ratings did not make company borrowing cheaper', href: '' },
  { slug: 'gradelens', name: 'GradeLens', kind: 'Tool', note: 'Shows FOM students what each exam needs for a target grade', href: 'https://github.com/omkar-k0/gradelens' },
  { slug: 'demfragen', name: 'Dem Fragen', kind: 'Product', note: 'Plain answers to legal questions in India, with sources · not yet tested on real cases', href: 'https://github.com/omkar-k0/cuddly-octo-palm-tree' },
  { slug: 'profile-hud', name: 'profile-hud', kind: 'Tool', note: 'Profile cards built from real project data · 156+ tests', href: 'https://github.com/omkar-k0/profile-hud' },
];

// Full work index (/work/). Numbered straight through, flagships first.
export interface WorkItem {
  name: string;
  kind: 'Product' | 'Research' | 'Open source' | 'Tool';
  answers: string;
  metric: Metric;
  status: string;
  href: string;      // case study if it exists, else repository, else empty
  external: boolean;
}

const caseStudy = (slug: string) => `/work/${slug}/`;

export const work: WorkItem[] = [
  {
    name: 'Guidance Reconciliation Engine', kind: 'Product',
    answers: 'Did the company hit the revenue guidance it gave last quarter?',
    metric: { value: '7 of 188', label: 'sent to the LLM', evidence: 'measured', source: 'results.json' },
    status: 'Live · 97.9% on hand labels', href: caseStudy('guidance-reconciliation-engine'), external: false,
  },
  {
    name: 'faultline', kind: 'Open source',
    answers: 'Why did the dbt pipeline break, and where is the evidence?',
    metric: { value: '89.6%', label: 'top-1, 0 wrong (dev)', evidence: 'measured', source: 'eval/results/dev/triage.md' },
    status: 'In progress · held-out pending', href: caseStudy('faultline'), external: false,
  },
  {
    name: 'Werkbank', kind: 'Product',
    answers: 'Which workshop should take this furniture order?',
    metric: { value: '95.8%', label: 'on auto-routed orders', evidence: 'measured', source: 'reports/eval.md, n = 60' },
    status: 'Live demo · payments not connected', href: caseStudy('werkbank'), external: false,
  },
  {
    name: 'fuelcycle', kind: 'Open source',
    answers: 'Can you trust a year of fuel prices, and prove the checks work?',
    metric: { value: '99.7%', label: 'of 586 planted errors caught', evidence: 'measured', source: 'fuelcycle results/dq_eval.json' },
    status: 'Done for France · 3.3M events', href: caseStudy('fuelcycle'), external: false,
  },
  {
    name: 'FinBERT fusion', kind: 'Research',
    answers: 'When should a small model hand a sentence to an LLM?',
    metric: { value: '0.878', label: 'accuracy (FinBERT alone 0.844)', evidence: 'pending', source: 'test n = 147; result file not public yet' },
    status: 'Pending · code and result file being published', href: '', external: false,
  },
  {
    name: 'Sustainability commitment classifier', kind: 'Tool',
    answers: 'Which climate commitments in a sustainability report come with a number?',
    metric: { value: '7.7%', label: 'of 1,562 commitments quantified', evidence: 'measured', source: 'repo README, corrected 21 Nov 2026 (was 12.3%: the year itself counted as a figure)' },
    status: 'Done · rule-based', href: 'https://github.com/omkar-k0/sustainability-commitment-classifier', external: true,
  },
  {
    name: 'DAX 40 capital structure', kind: 'Research',
    answers: 'What drives leverage in large German companies?',
    metric: { value: '127', label: 'firm-years, 32 firms · graded 1.3', evidence: 'measured', source: 'FOM paper, verified 16 Oct 2026' },
    status: 'Paper · code being published', href: '', external: false,
  },
  {
    name: 'ESG and bond spreads', kind: 'Research',
    answers: 'Do ESG rating changes move corporate bond spreads?',
    metric: { value: 'No', label: 'significant effect (p 0.53–0.97)', evidence: 'measured', source: 'panel regression, 56 obs' },
    status: 'Done · honest null result', href: '', external: false,
  },
  {
    name: 'Dem Fragen', kind: 'Product',
    answers: 'What does Indian law say about my problem, and when do I need a lawyer?',
    metric: { value: '—', label: 'real eval not run yet', evidence: 'pending', source: 'mock baseline only' },
    status: 'Live · in progress', href: 'https://github.com/omkar-k0/cuddly-octo-palm-tree', external: true,
  },
  {
    name: 'GradeLens', kind: 'Tool',
    answers: 'What does each remaining FOM exam need for my target grade?',
    metric: { value: 'v1.0', label: 'English and German · 25 unit tests + browser tests', evidence: 'measured', source: 'repo, npm test, 21 Nov 2026' },
    status: 'Chrome extension', href: 'https://github.com/omkar-k0/gradelens', external: true,
  },
  {
    name: 'profile-hud', kind: 'Tool',
    answers: 'Can a GitHub profile show real project data instead of badges?',
    metric: { value: '156+', label: 'tests, CI green', evidence: 'measured', source: 'repo, v1.0.0' },
    status: 'GitHub Action · MIT', href: 'https://github.com/omkar-k0/profile-hud', external: true,
  },
  {
    name: 'This website', kind: 'Open source',
    answers: 'Can a portfolio prove its claims instead of asking you to trust them?',
    metric: { value: '100', label: 'Lighthouse accessibility, home page', evidence: 'measured', source: 'Lighthouse 12, 19 Nov 2026' },
    status: 'Live · case study', href: caseStudy('portfolio'), external: false,
  },
];
