/* Opens every view of PHY 103 Lab at 1280 px and at 400 px (phone), clicks every "show" control, and checks:
   no page errors, no horizontal scroll, no blank canvases, no NaN/undefined text, no duplicate ids.
   Run: NODE_PATH=$(npm root -g) node tests/check.js   (exits 1 on any problem; screenshots go to tests/shots/) */
const path = require('path'), fs = require('fs');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const FILE = path.resolve(process.argv[2] || path.join(__dirname, '..', 'index.html')), OUT = path.join(__dirname, 'shots');
let fails = 0; const bad = (...a) => { fails++; console.log('FAIL', ...a); };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [w, dark] of [[1280, false], [400, true]]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, colorScheme: dark ? 'dark' : 'light' });
    p.on('pageerror', e => bad('page error', w, e.message));
    p.on('console', m => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)|ERR_(TUNNEL|NAME|CONNECTION|PROXY|INTERNET)/.test(m.text())) bad('console error', w, m.text()); });
    await p.goto('file://' + FILE);
    if (!(await p.evaluate(() => document.compatMode === 'CSS1Compat'))) bad('not in standards mode (missing doctype?)');
    if (!(await p.evaluate(() => !!document.querySelector('meta[name="viewport"]') && document.characterSet === 'UTF-8'))) bad('missing viewport or charset');
    if (w === 1280) {
      const d = await p.evaluate(() => { const ids = {}; document.querySelectorAll('[id]').forEach(e => ids[e.id] = (ids[e.id] || 0) + 1); return Object.entries(ids).filter(([, v]) => v > 1); });
      if (d.length) bad('duplicate ids', JSON.stringify(d));
      console.log('groups', await p.evaluate(() => Array.from(document.querySelectorAll('#nav .grp')).map(g => { let n = 0, e = g.nextElementSibling; while (e && e.tagName === 'A') { n++; e = e.nextElementSibling; } return g.textContent + ':' + n; }).join(' | ')));
    }
    const views = await p.evaluate(() => ['overview', ...Array.from(document.querySelectorAll('#nav a')).map(a => a.dataset.view)].filter((v, i, a) => v && a.indexOf(v) === i));
    for (const v of views) {
      await p.evaluate(v => location.hash = v, v); await p.waitForTimeout(300);
      if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)) bad('horizontal scroll', w, v);
      const blank = await p.evaluate(() => Array.from(document.querySelectorAll('.view:not([hidden]) canvas')).filter(c => { if (!c.width || !c.clientWidth) return true; const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < x.length; i += 4) if (x[i]) return false; return true; }).map(c => c.id));
      if (blank.length) bad('blank canvas', w, v, blank);
      if (await p.evaluate(() => /NaN|undefined|Infinity/.test(document.querySelector('.view:not([hidden])').innerText))) bad('NaN/undefined text', w, v);
      if (w === 1280) {
        const n = await p.evaluate(() => document.querySelectorAll('.view:not([hidden]) [data-show]').length);
        for (let i = 0; i < n; i++) {
          await p.evaluate(i => document.querySelectorAll('.view:not([hidden]) [data-show]')[i].click(), i); await p.waitForTimeout(120);
          if (await p.evaluate(() => /NaN|undefined/.test(document.querySelector('.view:not([hidden])').innerText))) bad('NaN/undefined after show', v, i);
        }
      }
    }
    console.log(w + 'px:', views.length, 'views');
    await p.evaluate(() => location.hash = 'overview'); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, `overview-${w}.png`) });
    await p.close();
  }
  await b.close();
  console.log(fails ? `\n${fails} problems` : '\nall checks passed'); process.exit(fails ? 1 : 0);
})();
