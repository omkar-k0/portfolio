// Site-wide facts. Change them here, nowhere else.
export const SITE = {
  name: 'Omkar Khadilkar',
  wordmark: 'omkar khadilkar',
  pitch: "I build AI systems that know when they're unsure.",
  role: 'M.Sc. student, data and applied AI',
  tagline: 'M.Sc. student, data and applied AI, seeking a working student role',
  aiUse: 'I design, test and review all code. I use Claude Code as a pair programmer.',
  location: 'Essen, Germany',
  study: 'M.Sc. Big Data & Business Analytics, FOM',
  availability: 'Available now · 20 h/week',
  seeking: 'Seeking a 20-hour/week Werkstudent role in applied AI and data · Essen, NRW or remote · available now',
  email: 'omkarkhadilkar8@gmail.com',
};

// Substack: set feed to the publication's RSS address (e.g. https://NAME.substack.com/feed).
// Posts are fetched when the site builds; if the feed is empty or unreachable, the Notes page links to Substack instead.
export const SUBSTACK = {
  profile: 'https://krakmo.substack.com',
  feed: 'https://krakmo.substack.com/feed',
};

export const LINKS = {
  github: 'https://github.com/omkar-k0',
  linkedin: 'https://www.linkedin.com/in/omkar-khadilkar/',
  substack: 'https://substack.com/@krakmo',
};

// Privacy page and (later) Impressum.
// The Impressum needs a postal address (§ 5 DDG); it stays offline until street and postcode are set.
export const LEGAL = {
  name: 'Omkar Khadilkar',
  street: '', // TODO(Omkar)
  postcode: '', // TODO(Omkar)
  city: 'Essen',
  country: 'Deutschland',
  phone: '+49 155 65924087',
  updated: '2026-11-19',
};

// Email links open with a subject line already filled in.
export const mailto = (subject = 'Werkstudent role – hello from your website') =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

export const CV = { href: '/cv/Omkar_Khadilkar_CV.pdf', label: 'CV (PDF)' };

// Keywords for recruiters, taken from the CV skills section.
// Each tool with what I used it for and where. Only tools a project actually uses.
export const TOOLS: { tool: string; use: string; href: string }[] = [
  { tool: 'Python', use: 'the pipelines and evaluations in faultline, fuelcycle and the Guidance Reconciliation Engine', href: '/work/faultline/' },
  { tool: 'dbt and SQL', use: "fuelcycle's data models; faultline's benchmark is four dbt projects", href: '/work/fuelcycle/' },
  { tool: 'DuckDB', use: "fuelcycle's storage and faultline's incident store", href: '/work/fuelcycle/' },
  { tool: 'pandas', use: 'fuelcycle and the DAX 40 study', href: '/work/fuelcycle/' },
  { tool: 'LightGBM', use: "fuelcycle's next-day price forecast", href: '/work/fuelcycle/' },
  { tool: 'statsmodels, linearmodels', use: 'the regressions in the DAX 40 and ESG studies', href: '/work/' },
  { tool: 'Claude API', use: 'the step that reads the hard cases in the Guidance Reconciliation Engine', href: '/work/guidance-reconciliation-engine/' },
  { tool: 'Local LLMs (Ollama, MLX)', use: "testing faultline's optional re-ranker on my own laptop", href: '/work/faultline/' },
  { tool: 'TypeScript, Next.js, PostgreSQL', use: 'the Werkbank app', href: '/work/werkbank/' },
  { tool: 'GitHub Actions', use: 'automatic tests in faultline and fuelcycle', href: '/work/faultline/' },
  { tool: 'Vercel', use: 'hosting Werkbank, the reconciliation engine demo and this site', href: '/work/portfolio/' },
];
export const LANGUAGES = 'English C1 (IELTS 7.5) · German A1, learning · Marathi native';
