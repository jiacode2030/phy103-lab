# PHY 103 Lab

An interactive study site for PHY 103 (calculus-based mechanics and waves), part of [Princeton Labs](https://jiacode2030.github.io/princeton-labs/). The modules follow the course week by week. Each has a live simulation, a worked example, common mistakes and a quiz, plus practice problems, "Which principle?", exam review for midterms and finals, a mistakes queue and a Key formulas page.

> **Unofficial study aid.** Not affiliated with, reviewed by, or endorsed by Princeton University or its Physics Department. **Use it to study, not on graded work**, and follow the course's collaboration rules.

## Editing

`index.html` is the whole site (one file, no build step). Edit it directly, then run the checks:

```
python3 tools/check.py
NODE_PATH=$(npm root -g) node tests/check.js
```

See `CLAUDE.md` for the rules.

## Privacy

Progress is saved only in your browser (keys start with `phy-`). Nothing is counted or tracked. See the [Privacy policy](https://jiacode2030.github.io/princeton-labs/privacy.html) and [Terms of use](https://jiacode2030.github.io/princeton-labs/terms.html).

## Reporting a problem

The **Report an issue** link opens a pre-filled issue in this repo. Issues are public, so don't include personal information.

© 2026 Jiarui Li. All rights reserved.
