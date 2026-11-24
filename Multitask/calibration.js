// What Gets Counted -- calibration check, run in Node against mechanism.js (inlined verbatim by build.py).
// The paper is pure theory and reports no numbers, so the mechanism is checked against the paper's own equations
// and propositions (known solutions), on random parameters as well as on the game's, with explicit tolerances.
// Exit code 1 if any gate fails. Output: calibration-result.txt.
const fs = require('fs');
const path = require('path');
const M = require('./mechanism.js');
const C = M.CONFIG;
const lines = []; let fails = 0;
function check(name, value, ok, target) { lines.push((ok ? 'PASS ' : 'FAIL ') + name + ': ' + value + (target ? '   [' + target + ']' : '')); if (!ok) fails++; }
const rnd = (() => { let s = 12345; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; })();
const U = (lo, hi) => lo + (hi - lo) * rnd();
const withFineDial = f => { const s = [C.dialMax, C.dialStep]; C.dialMax = 40; C.dialStep = 0.05; try { return f(); } finally { [C.dialMax, C.dialStep] = s; } };

// ---------- 1. the worker's best response (eq. 2) ----------
let worstBR = 0;
for (let n = 0; n < 300; n++) {
  const a = U(0.1, 1.5), k = U(-0.6, 0.95), nb = [U(0, 6), U(0, 6)], al = [U(0, 12), U(0, 4)];
  const t = M.respond(a, k, nb, al);
  let best = -Infinity;
  for (let x = 0; x <= 25; x += 0.05) for (let y = 0; y <= 25; y += 0.05) { const u = al[0] * x + al[1] * y - M.cost(a, k, nb, [x, y]); if (u > best) best = u; }
  worstBR = Math.max(worstBR, best - (al[0] * t[0] + al[1] * t[1] - M.cost(a, k, nb, t)));
}
check('Best response = brute-force maximum of bonus income minus effort cost (300 random workers, incl. corners)', 'worst shortfall ' + worstBR.toFixed(4), worstBR < 0.02, 'eq. 2; < 0.02');

// ---------- 2. eq. 7 = the numerical optimum of total certainty equivalent (eq. 1) ----------
let worst7 = 0, n7 = 0;
for (let n = 0; n < 400; n++) {
  const a = U(0.1, 1.2), k = U(-0.6, 0.9), b1 = U(2, 20), b2 = U(0, 30), r = U(0, 2), s2 = U(0, 3), nb = [U(3, 8), U(3, 8)];
  const formula = M.eq7(b1, b2, a, k, r, s2);
  let best = -Infinity, ba = 0;
  for (let al = 0; al <= 40; al += 0.01) {
    const t = M.respond(a, k, nb, [al, 0]); if (t[1] <= 0) continue;   // eq. 7 is the interior (t >> 0) solution
    const S = b1 * t[0] + b2 * t[1] - M.cost(a, k, nb, t) - 0.5 * r * s2 * al * al;
    if (S > best) { best = S; ba = al; }
  }
  if (best === -Infinity) continue;
  if (M.respond(a, k, nb, [formula, 0])[1] <= 0) continue;
  n7++; worst7 = Math.max(worst7, Math.abs(ba - formula));
}
check('Eq. 7: alpha1 = (B1 - B2 C12/C22) / [1 + r s1^2 (C11 - C12^2/C22)] matches the numerical optimum', 'worst gap $' + worst7.toFixed(3) + ' over ' + n7 + ' interior cases', worst7 < 0.02 && n7 > 150, 'grid $0.01; tolerance $0.02');
check('Eq. 5 benchmark (independent tasks, k = 0): alpha = B1 / (1 + r C11 s1^2)', M.eq7(10, 7, 0.5, 0, 1, 0.4).toFixed(4) + ' vs ' + (10 / (1 + 1 * 0.4 * 2)).toFixed(4), Math.abs(M.eq7(10, 7, 0.5, 0, 1, 0.4) - 10 / (1 + 0.8)) < 1e-9, 'c = 1/a = 2');
const kSeq = [-0.6, -0.4, -0.2, 0].map(k => M.eq7(10, 8, 0.5, k, 1, 0.5));
check('p. 32: complementary tasks (C12 < 0) raise the bonus; more complementary, higher', kSeq.map(x => x.toFixed(2)).join(' > '), kSeq[0] > kSeq[1] && kSeq[1] > kSeq[2] && kSeq[2] > kSeq[3], '');
const zeroCases = [[12, 30, 0.6], [10, 20, 0.5], [5, 30, 0.2]].map(([b1, b2, k]) => M.eq7(b1, b2, 0.5, k, 0, 0));
check('p. 33: zero bonus optimal even with a perfect measure (s1^2 = 0) when B1 <= B2 C12/C22', zeroCases.join(', '), zeroCases.every(x => x === 0), 'all zero');
const ps = M.respond(1 / (1 * (1 - 0.99 * 0.99)), 0.99, [4, 4], [0.5, 0]);
check('Section 3 limit (near-perfect substitutes, k = 0.99): a small bonus empties the unpaid task', 'at $0.50 the unpaid task gets ' + ps[1].toFixed(2) + ' h', ps[1] === 0, 'all-or-nothing, as with C(t1 + t2)');

// ---------- 3. identity used on screen: extra pay = 1/2 x bonus x extra counted hours ----------
let worstId = 0, corner = false;
for (const j of ['sales', 'teacher']) for (const b of M.dialValues()) { const o = M.single(j, b), J = C.jobs[j]; worstId = Math.max(worstId, Math.abs(0.5 * b * (o.hours[0] - J.tasks[0].normal) - o.extraPay)); if (o.hours.some(h => h <= 0)) corner = true; }
for (const key of ['school', 'firm']) for (const d of M.DEALS) for (const b of M.dialValues()) { const o = M.design(key, d, b); o.workers.forEach(w => { const id = 0.5 * b * w.tasks.reduce((s, tk, i) => s + (tk.counted ? w.hours[i] - tk.normal : 0), 0); worstId = Math.max(worstId, Math.abs(id - w.extraPay)); if (w.hours.some(h => h <= 0)) corner = true; }); }
check('Extra pay = 1/2 x bonus x extra counted hours, for every dial position and deal in the game', 'worst gap $' + worstId.toExponential(1), worstId < 1e-9, 'C = 1/2 alpha\'(t - tbar) at an interior best response');
check('No task is emptied anywhere on the game\'s dial (so the on-screen rules are exact)', corner ? 'a corner occurs' : 'all interior', !corner, '');

// ---------- 4. job design (Section 5): grouping by measurability, in the toy ----------
// In the toy, with equal normal hours, the best split beats the best mixed deal exactly when
//   bM^2 (1 - k) > max(0, bM - k bU)^2     (split gain a(1-k)bM^2 vs mixed gain a(bM - k bU)^2, derived from eq. 7).
// The paper's own argument for grouping (Props. 6-7) runs through risk premia, which the toy leaves out; so in the toy
// grouping wins only when the uncounted work is valuable enough. Check the condition, then the game's rounds.
let agree = 0, trials = 0, prop7 = 0, splitTrials = 0, skipped = 0;
for (let n = 0; n < 300; n++) {
  const D = C.designs.school, save = JSON.parse(JSON.stringify(D));
  D.a = U(0.2, 1); D.kappa = U(0.05, 0.9);
  const bM = U(5, 20), bU = U(2, 40);
  D.tasks.forEach(t => { t.value = t.counted ? bM : bU; t.normal = 4; });
  const res = withFineDial(() => ({ split: M.bestDesignGiven('school', [0, 0, 1, 1]), mixed: M.bestDesignGiven('school', [0, 1, 0, 1]) }));
  const predictSplit = bM * bM * (1 - D.kappa) > Math.pow(Math.max(0, bM - D.kappa * bU), 2);
  // the condition is derived for interior solutions: skip draws where the best mixed deal empties a task
  if (M.design('school', [0, 1, 0, 1], res.mixed.bonus).workers.some(w => w.hours.some(h => h <= 1e-9))) { skipped++; Object.assign(D, save); continue; }
  trials++; if ((res.split.net > res.mixed.net + 1e-6) === predictSplit || Math.abs(res.split.net - res.mixed.net) < 0.05) agree++;
  if (predictSplit) { splitTrials++; const o = M.design('school', [0, 0, 1, 1], res.split.bonus); const wM = o.workers[0], wU = o.workers[1]; if (wU.overtime === 0 && wM.total >= wU.total) prop7++; }
  Object.assign(D, save);
}
check('Toy: splitting beats mixing exactly when bM^2 (1 - k) > (bM - k bU)^2 (300 random schools, fine dial)', agree + ' of ' + trials + ' agree (' + skipped + ' draws with an emptied task skipped)', agree === trials && trials > 200, 'all');
check('Prop. 7 shape (toy): after a split, the uncounted-task worker works no overtime and no more hours', prop7 + ' of ' + splitTrials, prop7 === splitTrials, 'all');

// ---------- 5. the game's four rounds ----------
const r1 = M.bestSingle('sales'), r2 = M.bestSingle('teacher'), r3 = M.bestDesign('school'), r4 = M.bestDesign('firm');
check('Round 1 (sales rep): best bonus on the dial = eq. 7, positive but below the value of a sales hour', '$' + r1.bonus + ' vs eq. 7 $' + M.paperBest('sales'), r1.bonus === Math.round(M.paperBest('sales')) && r1.bonus > 0 && r1.bonus < C.jobs.sales.tasks[0].value, 'interior');
check('Round 2 (teacher): best bonus on the dial = eq. 7', '$' + r2.bonus + ' vs eq. 7 $' + M.paperBest('teacher'), r2.bonus === 0 && M.paperBest('teacher') === 0, '$0: fixed wage (Prop. 1 logic)');
check('Round 4 (two teachers): best = split jobs, full-value bonus for the counted job', (r3.split ? 'split' : 'mixed') + ', $' + r3.bonus, r3.split && r3.bonus === C.designs.school.tasks[0].value, 'split, $' + C.designs.school.tasks[0].value);
check('Round 3 (two sales reps, subscriptions): best = split jobs, full-value bonus for the counted job', (r4.split ? 'split' : 'mixed') + ', $' + r4.bonus, r4.split && r4.bonus === C.designs.firm.tasks[0].value, 'split, $' + C.designs.firm.tasks[0].value);
const m3 = M.bestDesignGiven('school', [0, 1, 0, 1]), m4 = M.bestDesignGiven('firm', [0, 1, 0, 1]);
check('Rounds 3-4: with mixed jobs only a weak bonus is worth paying', 'teachers $' + m3.bonus + ', sales reps $' + m4.bonus, m3.bonus === 0 && m4.bonus <= 3, '$0 and at most $3');
const r4at8 = M.design('firm', [0, 1, 0, 1], r1.bonus).net, r4at0 = M.design('firm', [0, 1, 0, 1], 0).net;
check('Round 3: round 1\'s answer, kept with mixed jobs, now loses money', '$' + r4at8.toFixed(0) + ' vs $' + r4at0.toFixed(0) + ' with no bonus', r4at8 < r4at0, 'care now worth more than selling');

// ---------- 6. does the discovery survive the designer's choices? (each designer number +-20%) ----------
const knobs = [['teacher a', () => C.jobs.teacher, 'a'], ['teacher kappa', () => C.jobs.teacher, 'kappa'], ['sales a', () => C.jobs.sales, 'a'], ['sales kappa', () => C.jobs.sales, 'kappa'],
  ['firm a', () => C.designs.firm, 'a'], ['firm kappa', () => C.designs.firm, 'kappa'], ['school kappa', () => C.designs.school, 'kappa']];
const res = [], r1s = [], r2s = [], splits = [];
for (const [nm, obj, key] of knobs) for (const f of [0.8, 1.2]) {
  const o = obj(), v = o[key]; o[key] = v * f;
  const a = M.bestSingle('sales').bonus, b = M.bestSingle('teacher').bonus, s3 = M.bestDesign('school').split, s4 = M.bestDesign('firm').split;
  res.push(nm + ' x' + f + ': R1 $' + a + ', R2 $' + b + ', R3 ' + (s3 ? 'split' : 'mixed') + ', R4 ' + (s4 ? 'split' : 'mixed')); r1s.push(a); r2s.push(b); splits.push(s3 && s4); o[key] = v;
}
for (const [ti, f] of [[0, 0.8], [0, 1.2], [1, 0.8], [1, 1.2]]) { const t = C.jobs.teacher.tasks[ti], v = t.value; t.value = v * f; const b = M.bestSingle('teacher').bonus; r2s.push(b); res.push('teacher value ' + t.key + ' x' + f + ': R2 $' + b); t.value = v; }
for (const f of [0.8, 1.2]) { const T = C.designs.firm.tasks, v = T[2].value; T[2].value = T[3].value = v * f; const s4 = M.bestDesign('firm').split; splits.push(s4); res.push('firm care value x' + f + ': R4 ' + (s4 ? 'split' : 'mixed')); T[2].value = T[3].value = v; }
check('Robustness: round 1 best stays positive and below a sales hour\'s value under every 20% change', 'R1 best in {' + Array.from(new Set(r1s)).sort((x, y) => x - y).join(', ') + '}', Math.min(...r1s) > 0 && Math.max(...r1s) < 10, '$1-$9');
check('Robustness: round 2 best stays $0 under every 20% change', 'R2 best in {' + Array.from(new Set(r2s)).join(', ') + '}', Math.max(...r2s) === 0, '$0');
check('Robustness: rounds 3 and 4 stay "split" under every 20% change', splits.filter(x => x).length + ' of ' + splits.length, splits.every(x => x), 'all');
lines.push('INFO robustness detail: ' + res.join(' | '));
lines.push('INFO Round 2 best is $0 because B1 = 12 < k B2 = 0.6 x 30 = 18 (the paper\'s condition, p. 33); round 1 shows the other side (10 > 0.4 x 5).');
lines.push('INFO Round 3 needs valuable customer care: with care at round 1\'s $5 an hour, the toy prefers mixed jobs with an $8 bonus ($139.2 vs $138 split). The paper\'s own case for grouping (risk premia) is not in the toy.');

const head = 'calibration.js run ' + new Date().toISOString() + '  -- ' + (fails ? fails + ' FAILED' : 'all gates passed');
const txt = head + '\n' + lines.join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, 'calibration-result.txt'), txt); console.log(txt);
process.exit(fails ? 1 : 0);
