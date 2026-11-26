// Source for the GradeLens Case study: where the old linear estimate asked for a stricter grade than needed.
// Runs GradeLens's own model on its synthetic test study book, for every target from 1.0 to 3.5.
//   git clone https://github.com/omkar-k0/gradelens
//   node scripts/gradelens-linear-vs-exact.cjs path/to/gradelens > public/sources/gradelens-linear-vs-exact.json
const path = require('node:path');
const { execSync } = require('node:child_process');
const repo = path.resolve(process.argv[2]);
const M = require(path.join(repo, 'src/model.js'));
const sb = require(path.join(repo, 'test/fixture.studybook.json'));
const { modules } = M.parseStudybook(sb, { today: '2026-11-09' });

const rows = [];
for (let t10 = 10; t10 <= 35; t10++) {
  const target = t10 / 10;
  const r = M.requiredForTarget(modules, target);
  if (r.status !== 'reachable') { rows.push({ target, status: r.status }); continue; }
  const linear = M.stepAtLeast(r.x);
  rows.push({ target, status: r.status, exact: r.step, linear, stricter: linear < r.step });
}
const reachable = rows.filter((r) => r.status === 'reachable');
console.log(JSON.stringify({
  source: 'https://github.com/omkar-k0/gradelens',
  commit: execSync('git rev-parse HEAD', { cwd: repo }).toString().trim(),
  data: 'test/fixture.studybook.json (synthetic), today = 2026-11-09',
  question: 'Grade needed in every open exam to reach the target: exact solve (v1.0) vs the old linear estimate',
  reachable: reachable.length,
  stricter: reachable.filter((r) => r.stricter).length,
  rows,
}, null, 2));
