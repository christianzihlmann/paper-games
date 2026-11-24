// Loop on placeholder graphics (build.md 4.2): play headlessly and print what each screen would say after each
// action. Usage: node loop.js [plan], plan = "b1,b2,deal3,b3,deal4,b4", e.g. "8,6,mixed,6,mixed,8"
// (default: a stranger's first try). Output: loop-log.txt.
const Mech = require('./mechanism.js');
const Game = require('./game.js');
const fs = require('fs');
const plan = (process.argv[2] || '8,6,mixed,6,mixed,8').split(',');
const out = []; const p = s => out.push(s);
const g = Game.newGame();
const bonusFor = n => Number(n === 1 ? plan[0] : n === 2 ? plan[1] : n === 3 ? plan[3] : plan[5]);
const dealFor = n => (n === 3 ? plan[2] : plan[4]);
p('PLAN ' + plan.join(','));
for (let n = 1; n <= Game.N_ROUNDS; n++) {
  Game.startRound(g, n);
  const R = Game.ROUNDS[n];
  p('\n[' + Game.header(g) + ']');
  p('  question: ' + Game.question(g));
  p('  do now:   ' + Game.doNow(g));
  if (R.kind === 'design') {
    const D = Mech.CONFIG.designs[R.key];
    p('  deal:     ' + g.deal.map((d, i) => D.tasks[i].key + '->' + D.workers[d]).join(', '));
    if (dealFor(n) === 'split') { Game.tapCard(g, 1); Game.tapCard(g, 2); p('  swapped cards 1 and 2 -> ' + g.deal.join('')); }
  } else Mech.CONFIG.jobs[R.key].tasks.forEach(tk => p('  task:     ' + Game.taskLine(tk, R.employer)));
  const target = bonusFor(n);
  for (const b of [0, Math.round(target / 2), target]) {
    Game.setBonus(g, b);
    const ws = Game.workersOf(g, Game.outcome(g));
    p('  dial ' + Game.bonusLabel(g).padEnd(24) + ' day: ' + ws.map(x => (ws.length > 1 ? x.name + ': ' : '') + Game.dayLine(x.w, x.tasks)).join(' | '));
  }
  Game.pay(g);
  p('  -- PAID --');
  Game.ledger(g).forEach(l => p('  ' + l.k.padEnd(8) + l.t));
}
Game.next(g);
const v = Game.verdict(g);
p('\n==== VERDICT ====');
for (const k of ['fate', 'score', 'paper', 'found', 'part', 'then']) p(k.toUpperCase() + ': ' + v[k]);
p('TODAY:'); v.today.forEach(t => p('  - ' + t));
p('ASK: ' + v.ask);
const txt = out.join('\n'); console.log(txt); fs.writeFileSync(__dirname + '/loop-log.txt', txt + '\n');
