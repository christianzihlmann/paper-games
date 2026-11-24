// What Gets Counted -- the game's flow and its words. No DOM, no rules of the world: every outcome comes from
// mechanism.js (Mech). Runs in Node (loop.js) and in the browser (inlined by build.py after mechanism.js).
(function (root) {
'use strict';
const Mech = (typeof module !== 'undefined' && module.exports) ? require('./mechanism.js') : root.Mech;
const C = Mech.CONFIG;

const N_ROUNDS = 4;
const ROUNDS = {
  1: { kind: 'single', key: 'sales', title: 'THE SALES REP', unit: 'sales point', employer: 'firm' },
  2: { kind: 'single', key: 'teacher', title: 'THE TEACHER', unit: 'test point', employer: 'school' },
  3: { kind: 'design', key: 'firm', title: 'TWO SALES REPS', unit: 'sales point', employer: 'firm', role: 'rep' },
  4: { kind: 'design', key: 'school', title: 'TWO TEACHERS', unit: 'test point', employer: 'school', role: 'teacher' },
};
const isDesign = g => ROUNDS[g.round].kind === 'design';
const usd = x => '$' + Math.round(x).toLocaleString('en-US');
// hours without decimals: "6 h 30 min", "45 min", "4 h"
function hrs(x) {
  const totalMin = Math.round(x * 60 / 5) * 5, h = Math.floor(totalMin / 60), m = totalMin - 60 * h;
  if (h === 0) return m + ' min';
  return h + ' h' + (m ? ' ' + m + ' min' : '');
}

function newGame() { return { screen: 'start', round: 1, bonus: 0, deal: null, sel: null, paid: false, results: {} }; }
function startRound(g, n) {
  g.screen = 'round'; g.round = n; g.bonus = 0; g.paid = false; g.sel = null;
  g.deal = ROUNDS[n].kind === 'design' ? C.designs[ROUNDS[n].key].startDeal.slice() : null;
}
function setBonus(g, b) { if (g.paid) return g.bonus; g.bonus = Math.max(C.dialMin, Math.min(C.dialMax, Math.round(b / C.dialStep) * C.dialStep)); return g.bonus; }
// Rounds 3-4: tap a card to pick it, tap a card of the other worker to swap the two.
function tapCard(g, i) {
  if (g.paid || !isDesign(g)) return;
  if (g.sel === null) { g.sel = i; return; }
  if (g.sel === i) { g.sel = null; return; }
  if (g.deal[g.sel] !== g.deal[i]) { const t = g.deal[g.sel]; g.deal[g.sel] = g.deal[i]; g.deal[i] = t; }
  g.sel = null;
}
function outcome(g, bonus) { const b = bonus === undefined ? g.bonus : bonus, R = ROUNDS[g.round]; return R.kind === 'design' ? Mech.design(R.key, g.deal, b) : Mech.single(R.key, b); }
function noBonus(g) { return outcome(g, 0); }
function best(g) { const R = ROUNDS[g.round]; return R.kind === 'design' ? Mech.bestDesign(R.key) : Mech.bestSingle(R.key); }
// the workers on screen: [{ key, name, w (outcome), tasks }]
function workersOf(g, o) {
  const R = ROUNDS[g.round];
  if (R.kind === 'design') return o.workers.map((w, i) => ({ key: 'w' + i, name: C.designs[R.key].workers[i], w, tasks: w.tasks }));
  return [{ key: 'w0', name: C.jobs[R.key].worker, w: o, tasks: C.jobs[R.key].tasks }];
}
function pay(g) {
  if (g.paid) return g.results[g.round];
  g.paid = true;
  const R = ROUNDS[g.round], o = outcome(g), base = noBonus(g), b = best(g);
  const r = { round: g.round, bonus: g.bonus, deal: g.deal ? g.deal.slice() : null, split: R.kind === 'design' ? Mech.isSplit(R.key, g.deal) : null,
    net: o.net, base: base.net, best: b.net, bestBonus: b.bonus, counted: o.counted, countedBase: base.counted, o };
  if (R.kind === 'single') r.paperBonus = Mech.paperBest(R.key);
  else r.mixedBest = Mech.bestDesignGiven(R.key, C.designs[R.key].startDeal);
  g.results[g.round] = r;
  return r;
}
function next(g) { if (g.round < N_ROUNDS) startRound(g, g.round + 1); else g.screen = 'verdict'; }

// ---------------- words on the round screen ----------------
function header(g) { return 'ROUND ' + g.round + ' OF ' + N_ROUNDS + ' · ' + ROUNDS[g.round].title; }
function question(g) {
  switch (g.round) {
    case 1: return 'Sam sells, and builds goodwill with customers. Only sales can be counted. Pay Sam a bonus per sales point: none, a little, or a lot?';
    case 2: return 'Ms. Ortiz drills her class for the test and makes them curious. Only test scores can be counted. Pay her a bonus per test point: none, a little, or a lot?';
    case 3: return 'Two years on, Sam’s firm sells subscriptions: customers who are looked after renew. Who does what? Then one bonus per sales point.';
    default: return 'Back at the school: two teachers, four tasks. Who does what? Then one bonus per test point for both.';
  }
}
function doNow(g) {
  if (g.paid) return g.round < N_ROUNDS ? 'Read the board, then go on.' : 'Read the board, then see the verdict.';
  if (isDesign(g)) return 'Tap two cards to swap them between the ' + ROUNDS[g.round].role + 's. Turn the dial. Then press PAY.';
  return 'Turn the dial: watch the day change. Then press PAY.';
}
function bonusLabel(g) { return g.bonus === 0 ? 'NO BONUS' : '$' + g.bonus + ' PER ' + ROUNDS[g.round].unit.toUpperCase(); }
function taskLine(tk, employer) { return tk.name.toUpperCase() + ' · ' + (tk.counted ? 'counted ✓' : 'not counted ✗') + ' · each hour is worth $' + tk.value + ' to the ' + (employer || 'employer'); }
// What the dial does to one worker's day, in words (shown live).
function dayLine(w, tasks) {
  const d = tasks.map((tk, i) => w.hours[i] - tk.normal);
  if (d.every(x => Math.abs(x) < 1e-9)) return 'Normal day: ' + tasks.map((tk, i) => hrs(w.hours[i]) + ' ' + short(tk)).join(', ') + '.';
  const parts = tasks.map((tk, i) => (d[i] > 0 ? '+' : '−') + hrs(Math.abs(d[i])) + ' ' + short(tk)).filter((_, i) => Math.abs(d[i]) > 1e-9);
  return parts.join(', ') + (w.overtime > 1e-9 ? '; ' + hrs(w.overtime) + ' overtime.' : '.');
}
function short(tk) { return { drill: 'drilling', curious: 'curiosity', sell: 'selling', goodwill: 'goodwill', read: 'reading drills', math: 'math drills', talk: 'discussion', proj: 'projects',
  win: 'new customers', upsell: 'upgrades', onboard: 'set-ups', help: 'customer problems' }[tk.key] || tk.name; }
function payLabel(g) { return g.bonus === 0 ? 'PAY: NO BONUS' : 'PAY $' + g.bonus + ' A POINT'; }

// ---------------- the ledger after PAY (sums the player can check) ----------------
function ledger(g) {
  const r = g.results[g.round], o = r.o, R = ROUNDS[g.round];
  const value = Math.round(o.value), extra = Math.round(o.extraPay), net = value - extra;
  const lines = [];
  lines.push({ k: 'counted', t: cap(R.unit) + 's: ' + fmtPts(r.countedBase) + ' → ' + fmtPts(r.counted) + ' (' + Mech.changeWords(r.countedBase, r.counted) + ').' });
  if (R.kind === 'design') {
    workersOf(g, o).forEach(x => lines.push({ k: 'day', t: x.name + ': ' + x.tasks.map((tk, i) => hrs(x.w.hours[i]) + ' ' + short(tk)).join(', ') + (x.w.overtime > 1e-9 ? ' (' + hrs(x.w.overtime) + ' overtime)' : '') + '.' }));
  } else {
    const J = C.jobs[R.key];
    lines.push({ k: 'day', t: 'Uncounted ' + short(J.tasks[1]) + ': ' + hrs(J.tasks[1].normal) + ' → ' + hrs(o.hours[1]) + '.' });
  }
  lines.push({ k: 'sum', t: 'Value of the work ' + usd(value) + ' − extra pay for the extra effort ' + usd(extra) + ' = ' + usd(net) + ' a day.' });
  lines.push({ k: 'base', t: 'With no bonus' + (R.kind === 'design' ? ' (same jobs)' : '') + ': ' + usd(Math.round(noBonus(g).net)) + ' a day.' });
  let bestTxt;
  if (R.kind === 'design') {
    const T = C.designs[R.key].tasks, cn = T.filter(t => t.counted).map(short), un = T.filter(t => !t.counted).map(short);
    bestTxt = 'Best by the paper: ' + cn.join(' and ') + ' to one ' + R.role + ', ' + un.join(' and ') + ' to the other, and pay $' + r.bestBonus + ' a point: ' + usd(r.best) + ' a day. With mixed jobs the best is ' + (r.mixedBest.bonus ? '$' + r.mixedBest.bonus + ' a point' : 'no bonus') + ': ' + usd(r.mixedBest.net) + '.';
  } else bestTxt = 'Best bonus by the paper’s formula: ' + (r.bestBonus === 0 ? 'none' : '$' + r.bestBonus + ' a point') + ': ' + usd(r.best) + ' a day.';
  lines.push({ k: 'best', t: bestTxt });
  lines.push({ k: 'say', t: roundSay(g, r) });
  return lines;
}
function fmtPts(x) { const h = Math.round(x * 2) / 2; return h % 1 ? Math.floor(h) + '½' : String(h); }
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
function roundSay(g, r) {
  const lost = Math.round(r.best - r.net), R = ROUNDS[g.round];
  if (g.round === 1) {
    if (r.bonus === 0) return 'No bonus left ' + usd(r.best - r.net) + ' a day on the table. Goodwill is worth little here and competes only mildly for Sam’s hours, so a bonus does more good than harm.';
    if (lost <= 1) return 'Close to the best: a bonus pays here, because goodwill is worth little and competes only mildly for Sam’s hours. But not the full $10 a sales hour is worth: some goodwill is still lost.';
    if (r.bonus > r.bestBonus) return 'Too strong: each extra dollar pulled more hours from goodwill and cost more in extra pay than the extra sales were worth. ' + usd(lost) + ' a day short of the best.';
    return 'Too weak: Sam would have sold more for a little more, at small cost to goodwill. ' + usd(lost) + ' a day short of the best.';
  }
  if (g.round === 2) {
    if (r.bonus === 0) return 'No bonus: her day stays balanced, and that is the best this job allows. Unlike Sam’s goodwill, curiosity is worth more than the counted work and competes hard for her hours.';
    return 'Test points ' + Mech.changeWords(r.countedBase, r.counted) + ', and the school lost ' + usd(r.base - r.net) + ' a day: the bonus moved her hours from curiosity, which nobody counts, to drilling, which is worth less. What worked for Sam backfires here.';
  }
  const D = C.designs[R.key], careIdx = D.tasks.findIndex(t => !t.counted), carer = D.workers[r.deal[careIdx]];
  const careWords = R.key === 'school' ? 'the discussion and projects' : 'setting up customers and solving their problems';
  if (r.split && lost <= 1) return 'With the counted work in one job, the bonus pulls nothing from the rest: ' + carer + ' keeps ' + careWords + ' whatever you pay. Strong pay where it does no harm.' + (R.key === 'firm' ? ' Many software firms are organised this way: account executives on commission win deals, customer-success managers on mostly fixed pay keep customers renewing.' : '');
  if (r.split && r.bonus < r.bestBonus) return 'The right jobs, but a timid bonus: with the counted work on its own, a strong bonus harms nothing. ' + usd(lost) + ' a day short of the best.';
  if (r.split) return 'The right jobs. ' + usd(lost) + ' a day short of the best.';
  if (r.bonus <= r.mixedBest.bonus + 1) return 'Mixed jobs and a ' + (r.bonus ? 'small' : 'zero') + ' bonus: the most mixed jobs allow. Splitting the jobs would have let you pay for the counted work without costing the rest.';
  return 'Mixed jobs: the bonus pulled both ' + R.role + 's away from ' + careWords + (R.key === 'firm' ? ', now worth twice a selling hour. Round 1’s bonus loses money in this business' : '') + '. ' + cap(R.unit) + 's ' + Mech.changeWords(r.countedBase, r.counted) + '; the ' + R.employer + ' lost ' + usd(r.base - r.net) + ' a day.';
}

// ---------------- the verdict ----------------
function verdict(g) {
  const R = g.results, rs = [1, 2, 3, 4].map(n => R[n]), [r1, r2, r3, r4] = rs;
  const total = rs.reduce((s, r) => s + r.net, 0), bestTotal = rs.reduce((s, r) => s + r.best, 0);
  const share = rs.reduce((s, r) => s + r.net / r.best, 0) / 4;
  const near = r => Math.abs(r.net - r.best) <= 1;
  let fate;
  if (rs.every(near)) fate = 'You paid like the paper: a bonus where it helps, none where it hurts, and full pay once the job was split.';
  else if (r2.bonus > 0 && !r3.split && !r4.split) fate = 'You paid for what gets counted, and got less of what doesn’t.';
  else if (r2.bonus > 0) fate = 'You paid Ms. Ortiz for test points and lost curiosity — then found the way out: split the job.';
  else if (r1.bonus === 0) fate = 'Careful with bonuses from the start — sometimes too careful.';
  else if (!r3.split && !r4.split) fate = 'You never split a job, so you could never pay strongly without harm.';
  else fate = 'You saw the trap and the way out.';
  const score = 'Net over the four rounds: ' + usd(total) + ' a day, where the best possible is ' + usd(bestTotal) + ' — ' + Mech.shareWords(share) + ' the best.';
  const paper = 'When a job has work that can be counted and work that can’t, paying for the counted work pulls effort from the rest. So the right bonus for one task depends on every other task in the job: worth paying for Sam’s sales, not for Ms. Ortiz’s test points, even though the test measures perfectly and she responds to pay. The way out is job design: put the countable work in one job with strong pay, and the rest in another on a salary.';
  const b = x => x ? '$' + x + ' a point' : 'no bonus';
  const found = 'Sam: ' + b(r1.bonus) + ' (' + usd(r1.net) + ' of a possible ' + usd(r1.best) + '). Ms. Ortiz: ' + b(r2.bonus) + ' (' + usd(r2.net) + ' of ' + usd(r2.best) + '). Two sales reps: ' + (r3.split ? 'split' : 'mixed') + ' jobs, ' + b(r3.bonus) + ' (' + usd(r3.net) + ' of ' + usd(r3.best) + '). Two teachers: ' + (r4.split ? 'split' : 'mixed') + ' jobs, ' + b(r4.bonus) + ' (' + usd(r4.net) + ' of ' + usd(r4.best) + ').';
  const parts = [];
  if (r1.bonus === 0) parts.push('For Sam the paper’s formula says about $' + Math.round(r1.paperBonus) + ' a point; you paid none.');
  else if (!near(r1)) parts.push('For Sam the formula says about $' + Math.round(r1.paperBonus) + ' a point; you paid $' + r1.bonus + '.');
  if (r2.bonus > 0) parts.push('The formula pays Ms. Ortiz nothing per test point; you paid $' + r2.bonus + '.');
  if (!r3.split || !r4.split) parts.push('The paper splits the jobs: counted work to one person on strong pay, the rest to another. You kept ' + (!r3.split && !r4.split ? 'both' : !r3.split ? 'the sales reps’' : 'the teachers’') + ' jobs mixed.');
  if ((r3.split && r3.bonus < r3.bestBonus - 2) || (r4.split && r4.bonus < r4.bestBonus - 2)) parts.push('Once a job is split, a strong bonus harms nothing; you paid less than the counted work is worth.');
  if (!parts.length) parts.push('Nowhere: you found all four answers the paper’s model gives.');
  const then = 'The paper read real organisations this way in 1991: franchisees keep at least 90 cents of every extra dollar of sales, while managers of identical company-owned stores get no incentive pay; firms keep their own sales force where sales are hard to measure; and in 1989 a South Carolina teacher was caught giving her class the answers to the state test to raise her rating.';
  const today = [
    'Goodhart’s law, in the anthropologist Marilyn Strathern’s words (1997): “When a measure becomes a target, it ceases to be a good measure.” This game shows one reason: the target pulls effort from everything it leaves out.',
    'Wells Fargo, 2016: chasing cross-selling targets, staff opened about 1.5 million bank accounts and applied for about 565,000 credit cards that customers had not asked for. Regulators fined the bank $185 million.',
    'Round 4 is how much of software sales works today: account executives on heavy commission win the deals, customer-success managers on mostly fixed pay keep customers renewing.',
    'AI games measures too. In 2016 an OpenAI agent rewarded for points in a boat race learned to circle a lagoon hitting the same targets instead of finishing the race. Language models tuned to please an automatic rater can keep raising its score while getting worse by a stricter judge (Gao, Schulman and Hilton, 2023). AI researchers call it reward hacking.',
    'AI also makes more work countable: calls, code and written answers can now be scored automatically. The paper’s warning still holds: paying on a new number helps only if what it leaves out does not suffer. And where AI takes over the countable tasks, the human job keeps the hard-to-count ones — where, by this paper, strong pay for numbers works worst.',
    'Holmström’s informativeness principle says to base pay on every signal that tells you about effort. This paper adds the catch: a precise signal can still be the wrong thing to pay on, if it pulls attention from what it leaves out.',
  ];
  const ask = 'Before you pay on a number, ask: what does it leave out, and does that compete for the same hours?';
  return { fate, score, paper, found, part: parts.join(' '), then, today, ask };
}

const API = { N_ROUNDS, ROUNDS, newGame, startRound, setBonus, tapCard, outcome, noBonus, best, workersOf, pay, next, header, question, doNow, bonusLabel,
  taskLine, dayLine, short, payLabel, ledger, verdict, hrs, usd };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Game = API;
})(typeof window !== 'undefined' ? window : globalThis);
