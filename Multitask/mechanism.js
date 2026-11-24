// What Gets Counted -- mechanism. The single source of truth: every rule that affects an outcome lives here
// (how a worker re-divides the day when a bonus is offered, what the work is worth, what the extra effort costs,
// the best bonus, the best job design, the scoring). No DOM. Runs unchanged in Node and in the browser.
//
// Paper: Holmstrom, B. and P. Milgrom (1991), "Multitask Principal-Agent Analyses: Incentive Contracts, Asset
// Ownership, and Job Design", Journal of Law, Economics, & Organization 7 (Special Issue): 24-52.
// doi:10.1093/jleo/7.special_issue.24
// Model: Section 2 (eqs. 1-7) with mu(t) = t, a quadratic private cost around the worker's normal day (the paper's
// "free" effort up to t-bar, Section 3.1 and fn. 9), linear benefits B(t) = sum b_i t_i, and r = 0 (no risk premium;
// the paper notes risk aversion is not essential, p. 30, and Prop. 1 holds for a risk-neutral agent).
// Rounds 3 and 4 are a four-task, two-worker toy of Section 5 (job design).

(function (root) {
'use strict';

const CONFIG = {
  // ---- the dial (our choices) ----
  dialMin: 0,            // no negative bonuses: a worker can always lower a measured score for free (p. 33)
  dialMax: 12,           // $ per counted point (our choice of scale)
  dialStep: 1,
  normalDay: 8,          // hours in the worker's normal day (our choice); given without a bonus (Section 3.1, fn. 9)
  // ---- the worker type: private cost C(t) = (c/2) (t - tbar)' K (t - tbar), K = [[1, k], [k, 1]] ----
  // Parametrised by a = 1 / (c (1 - k^2)): hours a $1 bonus moves into the paid task (dt/d-alpha, eq. 4).
  // k = C12 / C22: how strongly the two tasks compete for the same hours (substitutes when k > 0, eq. 7).
  jobs: {
    sales: {             // Round 1. Sales vs customer goodwill (p. 37, Anderson and Schmittlein).
      worker: 'Sam', a: 0.3, kappa: 0.4,             // our choice: every $10 of bonus -> +3 h selling, -1.2 h goodwill
      tasks: [
        { key: 'sell', name: 'sell', counted: true, value: 10, normal: 4 },                  // $ of value per hour: our choice
        { key: 'goodwill', name: 'build customer goodwill', counted: false, value: 5, normal: 4 },
      ],
    },
    teacher: {           // Round 2. The paper's lead example (pp. 25, 32-33): basic skills (tested) vs higher-order thinking.
      worker: 'Ms. Ortiz', a: 0.4, kappa: 0.6,       // our choice: every $10 of bonus -> +4 h drilling, -2.4 h curiosity
      tasks: [
        { key: 'drill', name: 'drill for the test', counted: true, value: 12, normal: 4 },
        { key: 'curious', name: 'make them curious', counted: false, value: 30, normal: 4 },  // worth more than drilling (our choice)
      ],
    },
  },
  // Rounds 3 and 4: two workers of the round-2 / round-1 type, four tasks, two each (Section 5, our toy).
  // One bonus per counted point applies to every counted task of both workers.
  designs: {
    school: {            // Round 3: the teaching example (p. 25: basic skills and higher-level thinking taught by different teachers)
      workers: ['Ms. Ortiz', 'Mr. Ade'], a: 0.4, kappa: 0.6,
      tasks: [
        { key: 'read', name: 'reading-test drills', counted: true, value: 12, normal: 4 },
        { key: 'math', name: 'math-test drills', counted: true, value: 12, normal: 4 },
        { key: 'talk', name: 'class discussion', counted: false, value: 30, normal: 4 },
        { key: 'proj', name: 'science projects', counted: false, value: 30, normal: 4 },
      ],
      startDeal: [0, 1, 0, 1],   // our choice: dealt mixed (each worker one counted, one uncounted task)
    },
    firm: {              // Round 4: the sales example, now a subscription business where looking after customers decides renewals
      workers: ['Sam', 'Kim'], a: 0.3, kappa: 0.4,
      tasks: [
        { key: 'win', name: 'win new customers', counted: true, value: 10, normal: 4 },
        { key: 'upsell', name: 'sell upgrades', counted: true, value: 10, normal: 4 },
        { key: 'onboard', name: 'set up new customers', counted: false, value: 20, normal: 4 },   // our choice: care now worth 2x selling
        { key: 'help', name: 'solve customer problems', counted: false, value: 20, normal: 4 },
      ],
      startDeal: [0, 1, 0, 1],
    },
  },
};

// ---------------- one worker ----------------
// The worker's best response (eq. 2/3): maximise alpha't - C(t) over t >= 0.
// Interior: t = tbar + K^-1 alpha / c = tbar + a (alpha_i - k alpha_j) per task. If a task would go below zero hours,
// it is set to zero and the other task solves its own first-order condition (corner).
function respond(a, kappa, normals, alphas) {
  const c = 1 / (a * (1 - kappa * kappa));
  let t = [normals[0] + a * (alphas[0] - kappa * alphas[1]), normals[1] + a * (alphas[1] - kappa * alphas[0])];
  for (let i = 0; i < 2; i++) if (t[i] < 0) { const j = 1 - i; t[i] = 0; t[j] = Math.max(0, normals[j] + kappa * normals[i] + alphas[j] / c); }
  return t;
}
function cost(a, kappa, normals, t) {        // C(t) = (c/2) (t - tbar)' K (t - tbar)
  const c = 1 / (a * (1 - kappa * kappa)), d0 = t[0] - normals[0], d1 = t[1] - normals[1];
  return (c / 2) * (d0 * d0 + 2 * kappa * d0 * d1 + d1 * d1);
}
// One worker with two tasks under a bonus per counted point. Returns the day and the employer's account.
// Employer's net = value of the work - the extra pay the extra effort costs (the bonus itself is a transfer that comes
// back through the base salary; total certainty equivalent B - C is what matters, pp. 29-30).
function worker(a, kappa, tasks, bonus) {
  const normals = tasks.map(t => t.normal), alphas = tasks.map(t => t.counted ? bonus : 0);
  const t = respond(a, kappa, normals, alphas);
  const value = tasks.reduce((s, tk, i) => s + tk.value * t[i], 0);
  const valueNormal = tasks.reduce((s, tk) => s + tk.value * tk.normal, 0);
  const extraPay = cost(a, kappa, normals, t);
  const counted = tasks.reduce((s, tk, i) => s + (tk.counted ? t[i] : 0), 0);
  const countedNormal = tasks.reduce((s, tk) => s + (tk.counted ? tk.normal : 0), 0);
  const total = t[0] + t[1];
  return { hours: t, value, valueNormal, extraPay, net: value - extraPay, counted, countedNormal,
    total, overtime: Math.max(0, total - CONFIG.normalDay) };
}

// ---------------- rounds ----------------
function dialValues() { const v = []; for (let x = CONFIG.dialMin; x <= CONFIG.dialMax + 1e-9; x += CONFIG.dialStep) v.push(Math.round(x * 100) / 100); return v; }
// Rounds 1 and 2: one worker.
function single(jobKey, bonus) { const J = CONFIG.jobs[jobKey]; return worker(J.a, J.kappa, J.tasks, bonus); }
// Rounds 3 and 4: deal[i] = which worker (0 or 1) does task i; each worker must have exactly two tasks.
function validDeal(deal) { return deal.length === 4 && deal.filter(x => x === 0).length === 2 && deal.filter(x => x === 1).length === 2; }
function design(key, deal, bonus) {
  if (!validDeal(deal)) throw new Error('each worker needs exactly two tasks');
  const D = CONFIG.designs[key];
  const workers = [0, 1].map(w => {
    const idx = deal.map((d, i) => d === w ? i : -1).filter(i => i >= 0);
    const tasks = idx.map(i => D.tasks[i]);
    return Object.assign({ taskIdx: idx, tasks }, worker(D.a, D.kappa, tasks, bonus));
  });
  const sum = k => workers[0][k] + workers[1][k];
  return { workers, value: sum('value'), valueNormal: sum('valueNormal'), extraPay: sum('extraPay'), net: sum('net'),
    counted: sum('counted'), countedNormal: sum('countedNormal'), split: isSplit(key, deal) };
}
// "Split": both counted tasks sit with the same worker (and so both uncounted tasks with the other).
function isSplit(key, deal) { const T = CONFIG.designs[key].tasks, c = T.map((t, i) => t.counted ? i : -1).filter(i => i >= 0); return deal[c[0]] === deal[c[1]]; }
const DEALS = [[0, 0, 1, 1], [0, 1, 0, 1], [0, 1, 1, 0]];   // the three ways to split four tasks into two pairs (up to naming)

// ---------------- the best possible (what the player could have chosen) ----------------
function bestSingle(jobKey) { let best = null; for (const b of dialValues()) { const o = single(jobKey, b); if (!best || o.net > best.net + 1e-9) best = { bonus: b, net: o.net }; } return best; }
function bestDesign(key) { let best = null; for (const d of DEALS) for (const b of dialValues()) { const o = design(key, d, b); if (!best || o.net > best.net + 1e-9) best = { deal: d, bonus: b, net: o.net, split: isSplit(key, d) }; } return best; }
function bestDesignGiven(key, deal) { let best = null; for (const b of dialValues()) { const o = design(key, deal, b); if (!best || o.net > best.net + 1e-9) best = { bonus: b, net: o.net }; } return best; }
// The paper's formula for one counted task and one uncounted (eq. 7), general r and sigma^2; the game uses r = 0.
// alpha1 = (B1 - B2 C12/C22) / [1 + r sigma1^2 (C11 - C12^2/C22)], floored at 0 (no negative bonuses).
function eq7(b1, b2, a, kappa, r, sigma2) {
  const c = 1 / (a * (1 - kappa * kappa));
  return Math.max(0, (b1 - b2 * kappa) / (1 + (r || 0) * (sigma2 || 0) * c * (1 - kappa * kappa)));
}
function paperBest(jobKey) { const J = CONFIG.jobs[jobKey]; return eq7(J.tasks[0].value, J.tasks[1].value, J.a, J.kappa, 0, 0); }

// ---------------- words for sizes ----------------
function shareWords(f) {
  if (f >= 0.995) return 'all of';
  if (f >= 0.95) return 'nearly all of';
  if (f >= 0.85) return 'most of';
  if (f >= 0.7) return 'about three quarters of';
  if (f >= 0.5) return 'a little over half of';
  return 'less than half of';
}
function changeWords(before, after) {
  const r = after / before;
  if (r >= 2.4) return 'more than doubled';
  if (r >= 1.9) return 'about doubled';
  if (r >= 1.4) return 'rose by about half';
  if (r >= 1.15) return 'rose';
  if (r > 1.02) return 'rose a little';
  if (r >= 0.98) return 'stayed the same';
  if (r >= 0.85) return 'fell a little';
  if (r >= 0.6) return 'fell';
  if (r >= 0.35) return 'fell by about half or more';
  return 'nearly vanished';
}

const API = { CONFIG, respond, cost, worker, dialValues, single, design, validDeal, isSplit, DEALS, bestSingle, bestDesign, bestDesignGiven,
  eq7, paperBest, shareWords, changeWords };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Mech = API;
})(typeof window !== 'undefined' ? window : globalThis);
