"""Static checks for index.html. Run before every push: python3 tools/check.py

- full HTML document (doctype, charset, viewport)
- every inline <script> passes `node --check`
- none of the words that belong to other sites (AP Labs, analytics, LinkedIn, the old credit)
"""
import os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANNED = ['AP C', 'AP Physics', 'AP®', 'Advanced Placement', 'College Board', 'goatcounter', 'ap-labs', "'kin-",
          'ap-count', 'LinkedIn', 'li-link', 'Created by', 'theme-btn']


def main():
    html = open(os.path.join(HERE, 'index.html'), encoding='utf-8').read()
    errors = []
    if not html.startswith('<!doctype html>'):
        errors.append('index.html must start with <!doctype html>')
    for tag in ('<meta charset="utf-8">', '<meta name="viewport"'):
        if tag not in html:
            errors.append(f'missing {tag}')
    for i, js in enumerate(re.findall(r'<script>(.*?)</script>', html, flags=re.S)):
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
            f.write(js)
        r = subprocess.run(['node', '--check', f.name], capture_output=True, text=True)
        os.unlink(f.name)
        if r.returncode:
            errors.append(f'script {i}: {r.stderr.strip()}')
    found = [(w, html.count(w)) for w in BANNED if w in html]
    if found:
        errors.append(f'words from other sites: {found}')
    for e in errors:
        print('FAIL', e)
    print('all static checks passed' if not errors else f'{len(errors)} problems')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
