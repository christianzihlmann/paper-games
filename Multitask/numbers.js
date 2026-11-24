// Play it in numbers (build.md section 3): the obvious ways of playing, run against mechanism.js before any screen
// exists. Each strategy picks a bonus for rounds 1 (sales rep) and 2 (teacher), and a deal plus bonus for rounds 3
// (two sales reps) and 4 (two teachers). Columns below keep the order R1 sales, R2 teacher, then teachers' and reps' job design.
const M = require('./mechanism.js');
const fs = require('fs');
const C = M.CONFIG;
const MIXED = [0, 1, 0, 1], SPLIT = [0, 0, 1, 1];
const bS = M.bestSingle('sales'), bT = M.bestSingle('teacher'), b3 = M.bestDesign('school'), b4 = M.bestDesign('firm');
const strategies = {
  'paper (best on the dial)': [bS.bonus, bT.bonus, b3.deal, b3.bonus, b4.deal, b4.bonus],
  'never pay a bonus': [0, 0, MIXED, 0, MIXED, 0],
  'never pay, but split the jobs': [0, 0, SPLIT, 0, SPLIT, 0],
  'pay the most ($12) everywhere': [12, 12, MIXED, 12, MIXED, 12],
  'pay the most, split the jobs': [12, 12, SPLIT, 12, SPLIT, 12],
  'one-task theory: pay what a counted hour is worth': [10, 12, MIXED, 12, MIXED, 10],
  'a little ($3) everywhere': [3, 3, MIXED, 3, MIXED, 3],
  'round 1\'s answer ($8) everywhere': [8, 8, MIXED, 8, MIXED, 8],
  'learns the trap: $8, $0, mixed $0, mixed $0': [8, 0, MIXED, 0, MIXED, 0],
  'learns the way out: $8, $0, split $12, split $10': [8, 0, SPLIT, 12, SPLIT, 10],
};
const out = [];
out.push('best possible net per day: R1 sales $' + bS.net.toFixed(0) + ', R2 teacher $' + bT.net.toFixed(0) + ', R4 two teachers $' + b3.net.toFixed(0) + ', R3 two reps $' + b4.net.toFixed(0));
out.push('strategy'.padEnd(52) + '  R1    R2  R4tch R3rep  mean share of best');
for (const [name, s] of Object.entries(strategies)) {
  const n = [M.single('sales', s[0]).net, M.single('teacher', s[1]).net, M.design('school', s[2], s[3]).net, M.design('firm', s[4], s[5]).net];
  const bests = [bS.net, bT.net, b3.net, b4.net], share = n.reduce((t, x, i) => t + x / bests[i], 0) / 4;
  out.push(name.padEnd(52) + n.map(x => ('$' + x.toFixed(0)).padStart(6)).join('') + (100 * share).toFixed(1).padStart(10) + '%');
}
out.push('\nR1 sales by bonus:   ' + M.dialValues().map(b => '$' + b + ':' + M.single('sales', b).net.toFixed(0)).join(' '));
out.push('R2 teacher by bonus: ' + M.dialValues().map(b => '$' + b + ':' + M.single('teacher', b).net.toFixed(0)).join(' '));
for (const k of ['school', 'firm']) for (const [nm, d] of [['mixed', MIXED], ['split', SPLIT]]) out.push((k === 'school' ? 'R4 teachers' : 'R3 sales reps') + ' ' + nm + ' by bonus: ' + M.dialValues().map(b => '$' + b + ':' + M.design(k, d, b).net.toFixed(0)).join(' '));
const txt = out.join('\n'); console.log(txt); fs.writeFileSync(__dirname + '/numbers-log.txt', txt + '\n');
