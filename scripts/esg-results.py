"""Rerun the ESG repository's own regression script and save its models as a results file.

The Source for the ESG and bond spreads Case study. Nothing here re-specifies a model:
the script below runs scripts/regression.py from the ESG repository unchanged and reads
its fitted models.

  git clone https://github.com/krakmo1/esg-bond-spreads
  pip install pandas numpy statsmodels linearmodels
  python scripts/esg-results.py path/to/esg-bond-spreads
"""
import contextlib
import io
import json
import os
import platform
import runpy
import subprocess
import sys
from datetime import date
from importlib.metadata import version
from pathlib import Path

repo = Path(sys.argv[1]).resolve()
out = Path(__file__).resolve().parent.parent / 'public' / 'sources'
out.mkdir(parents=True, exist_ok=True)

os.chdir(repo)  # the script reads data/panel_final.csv relative to the repo root
text = io.StringIO()
with contextlib.redirect_stdout(text):
    ns = runpy.run_path('scripts/regression.py', run_name='__main__')


def model(name, m, note):
    """One fitted model: statsmodels OLS or linearmodels PanelOLS."""
    panel = hasattr(m, 'pvalues') and hasattr(m, 'rsquared_within')
    params = m.params
    p = m.pvalues
    se = m.std_errors if panel else m.bse
    return {
        'model': name,
        'note': note,
        'n': int(m.nobs),
        'r2': round(float(m.rsquared), 4),
        'terms': {
            k: {'coef': round(float(params[k]), 4), 'se': round(float(se[k]), 4), 'p': round(float(p[k]), 4)}
            for k in params.index
        },
    }


commit = subprocess.run(['git', 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
results = {
    'source': 'https://github.com/krakmo1/esg-bond-spreads/blob/%s/scripts/regression.py' % commit,
    'data': 'data/panel_final.csv at commit %s' % commit,
    'run': str(date.today()),
    'python': platform.python_version(),
    'packages': {k: version(k) for k in ['pandas', 'numpy', 'statsmodels', 'linearmodels']},
    'outcome': 'zspread (bond Z-spread, bps)',
    'terms': {
        'esg_score': 'ESG level',
        'delta_esg': 'ESG momentum (year-on-year change in ESG score)',
        'rating_num': 'credit rating, numeric',
        'regime_tight': 'ECB tightening regime (dummy)',
        'dxt': 'ESG momentum x tightening regime',
    },
    'models': [
        model('M1', ns['m1'], 'Pooled OLS, ESG only, SE clustered by firm'),
        model('M2', ns['m2'], 'Firm fixed effects, SE clustered by firm'),
        model('M3', ns['m3'], 'Pooled OLS with rating and ECB regime interaction, SE clustered by firm'),
    ],
}
(out / 'esg-regression.json').write_text(json.dumps(results, indent=2) + '\n')
(out / 'esg-regression.txt').write_text(text.getvalue())
print(json.dumps({m['model']: {k: v for k, v in m['terms'].items() if k in ('esg_score', 'delta_esg')} for m in results['models']}, indent=1))
