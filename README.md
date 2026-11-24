# Paper games

Browser games built from research papers, for teaching. Each game is a single self-contained HTML file that runs on a phone or a projector, with no install and no internet connection needed.

| Game | Paper | Play |
|---|---|---|
| **What Gets Counted** | Holmström & Milgrom (1991), "Multitask Principal–Agent Analyses: Incentive Contracts, Asset Ownership, and Job Design," *Journal of Law, Economics, & Organization* 7: 24–52. You set a bonus per counted point and watch a worker's day shift toward what is paid. A bonus works for a sales rep but backfires for a teacher; splitting the jobs lets strong pay go where it does no harm. Ends with Goodhart's law, Wells Fargo and AI reward hacking. | [play](https://christianzihlmann.github.io/paper-games/Multitask/what-gets-counted.html) · [design memo](Multitask/memo.md) |

**In class:** project the game. Before each PAY, ask the room "none, a little, or a lot?" The arrow keys turn the dial, and Enter pays and moves on.

**How each game is built.**
- `mechanism.js` holds every rule and number, each tagged with its source.
- `calibration.js` checks it against the paper's equations.
- `build.py` produces the HTML, and only if the checks pass.
- `memo.md` records the design and its limits.

The papers themselves are not included.

Built with Claude Code, using the [paper-to-game](https://github.com/steffenhuck/paper-to-game) skill. Fonts: Patrick Hand and Cabin Sketch (SIL Open Font License, licence texts in each `fonts/` folder).
