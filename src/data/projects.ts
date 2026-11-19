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
  name: string;
  kind: 'Product' | 'Research' | 'Open source';
  status: string;
  question: string;
  tags: string[];
  stages: Stage[];
  facts: string[]; // short real facts under the pipeline card
  links: { label: string; href: string }[];
}

export const proof: (Metric & { project: string; slug: string })[] = [
  {
    value: '0.878',
    label: 'accuracy with confidence-gated fusion (FinBERT alone: 0.844)',
    evidence: 'measured',
    source: 'FinBERT fusion results, test n = 147',
    project: 'FinBERT fusion',
    slug: 'finbert-fusion',
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
    value: '192',
    label: 'faulted dbt incidents in an open benchmark, plus 70 clean runs',
    evidence: 'measured',
    source: 'faultline release benchmark-v1, benchmark/manifest.json',
    project: 'faultline',
    slug: 'faultline',
  },
  {
    value: '188',
    label: 'guidance items reconciled, 4% escalated to the LLM',
    evidence: 'measured',
    source: 'guidance-reconciliation-engine final run, 24 Oct 2026',
    project: 'Guidance Reconciliation Engine',
    slug: 'guidance-reconciliation-engine',
  },
];

export const flagships: Flagship[] = [
  {
    slug: 'guidance-reconciliation-engine',
    name: 'Guidance Reconciliation Engine',
    kind: 'Product',
    status: 'Live · accuracy pending',
    question: 'Did the company hit the guidance it gave last quarter?',
    tags: ['Python', 'SEC EDGAR', 'Claude Haiku'],
    stages: [
      { label: 'Fetch', detail: '8-K earnings releases' },
      { label: 'Extract', detail: 'Guidance items' },
      { label: 'Rules', detail: 'Clean numeric matches' },
      { label: 'LLM', detail: 'Ambiguous rest, quote-checked', escalation: true },
    ],
    facts: ['11 companies', '173 met · 3 missed · 12 unverifiable', '7 of 188 escalated'],
    links: [
      { label: 'Live', href: 'https://guidance-reconciliation-engine.vercel.app' },
      { label: 'Repo', href: 'https://github.com/omkar-k0/guidance-reconciliation-engine' },
    ],
  },
  {
    slug: 'faultline',
    name: 'faultline',
    kind: 'Open source',
    status: 'Benchmark v1 released · LLM baseline pending',
    question: 'Why did the dbt pipeline break, and where is the evidence?',
    tags: ['dbt Core', 'sqlglot', 'Ollama'],
    stages: [
      { label: 'Run', detail: 'dbt artifacts and logs' },
      { label: 'Lineage', detail: 'Table and column, from SQL' },
      { label: 'Detect', detail: 'Tests and monitors' },
      { label: 'Diagnose', detail: 'Root cause with evidence', escalation: true },
      { label: 'Fix', detail: 'Draft for human approval' },
    ],
    facts: ['8 fault types', '4 dbt projects, 1 held out', 'dbt tests catch 11 of 48 (dev)'],
    links: [
      { label: 'Repo', href: 'https://github.com/omkar-k0/faultline' },
      { label: 'Benchmark', href: 'https://github.com/omkar-k0/faultline/releases/tag/benchmark-v1' },
    ],
  },
  {
    slug: 'werkbank',
    name: 'Werkbank',
    kind: 'Product',
    status: 'Live',
    question: 'Which workshop should take this furniture order?',
    tags: ['Classifier', 'Postgres', 'PWA · EN/DE'],
    stages: [
      { label: 'Request', detail: 'Free text, English or German' },
      { label: 'Classify', detail: 'Workshop, job type, urgency' },
      { label: 'Gate', detail: 'Confidence score' },
      { label: 'Review', detail: 'Unsure orders go to a person', escalation: true },
    ],
    facts: ['Top-1 88.3% (n = 60)', '40% auto-routed', '23.3% to review'],
    links: [
      { label: 'Live', href: 'https://werkbank-gamma.vercel.app' },
      { label: 'Repo', href: 'https://github.com/omkar-k0/werkbank' },
    ],
  },
  {
    slug: 'finbert-fusion',
    name: 'FinBERT fusion',
    kind: 'Research',
    status: 'Research · code being published',
    question: 'When should a small model hand a sentence to an LLM?',
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

export const ledger = [
  { name: 'Sustainability commitment classifier', kind: 'Tool', note: '1,562 commitment sentences, 12.3% quantified', href: 'https://github.com/omkar-k0/sustainability-commitment-classifier' },
  { name: 'DAX 40 capital structure', kind: 'Research', note: 'Panel of 32 firms, 127 observations · graded 1.3', href: '' },
  { name: 'ESG and bond spreads', kind: 'Research', note: 'Null result: ESG changes do not move spreads', href: '' },
  { name: 'Dem Fragen', kind: 'Product', note: 'Legal first information for India · live, real eval pending', href: 'https://github.com/omkar-k0/cuddly-octo-palm-tree' },
  { name: 'GradeLens', kind: 'Tool', note: 'Grade trajectory extension for FOM students · v0.4', href: 'https://github.com/omkar-k0/gradelens' },
  { name: 'profile-hud', kind: 'Tool', note: 'GitHub Action for profile cards · 156+ tests', href: 'https://github.com/omkar-k0/profile-hud' },
];
