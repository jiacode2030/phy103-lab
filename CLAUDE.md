# PHY 103 Lab — notes for Claude Code

Interactive study site for Princeton PHY 103 (calculus-based mechanics and waves). Part of Princeton Labs (`jiacode2030/princeton-labs`). Served by GitHub Pages from `main` / root.

`index.html` is the source: one self-contained file, edited directly. There is no build step and no shared source with any other site. It must stay a full HTML document (doctype, charset, viewport).

## Rules
- Princeton Labs only. No AP content or wording (no AP exam, FRQs, College Board, AP® text) and no links to AP Labs.
- Keep: the rail logo and More labs link (`/princeton-labs/`), the credit "JL · Princeton Class of 2030" as plain text (no LinkedIn link or button), © 2026 JL, Last updated, Privacy/Terms links (`/princeton-labs/privacy.html`, `/princeton-labs/terms.html`), and the legal text: "Unofficial study aid. Not affiliated with Princeton University.", "Use it to study, not on graded work", and the collaboration rules. Update Last updated when content changes.
- No analytics of any kind. The privacy policy says "Nothing is counted or tracked."
- Look: the same as Multivariable Calculus Lab. Light theme only (no theme switch), IBM Plex Sans / STIX Two Text / IBM Plex Mono, one blue accent `#2457A6`, white cards on `#F4F6F8`. No decorative motion (`CALM` turns off sparks, bubbles, count-ups, card flips and scroll reveals); simulations still animate. The "PHY 103: the Multivariable Calculus Lab look" CSS block at the end of the `<style>` sets this.
- Menu is grouped by PHY 103 weeks (Week 1A … Week 13). Exam review is worded for midterms and finals. The Key formulas page is `#formulas`.
- localStorage keys start with `phy-` (progress in `phy-done`, read by the Princeton Labs landing page). Never use another site's prefix.
- Report links open issues in this repo.
- Show the owner a screenshot before pushing, and push only when they say "push".

## Checks (run both before every push)
- `python3 tools/check.py`: full document, every inline script passes `node --check`, and no words from other sites (AP, analytics, LinkedIn).
- `NODE_PATH=$(npm root -g) node tests/check.js`: opens every view at 1280 px and 400 px, clicks every "show" control, and fails on page errors, horizontal scroll, blank canvases, NaN/undefined text or duplicate ids. Uses the globally installed Playwright and Chromium.
