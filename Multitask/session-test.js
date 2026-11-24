// Full session in headless Chrome at phone size (380 x 700): start, How to play opened and closed; round 1 (sales rep)
// with the + button and How to play mid-round; round 2 (teacher) by keyboard only (arrow keys and Enter, as with a
// presenter's clicker); round 3 (two sales reps) with a card swap and a dragged dial; round 4 (two teachers) with a
// card swap and the keyboard; the verdict, About and a replay. Then rounds 1 and 4 at projector size (1280 x 720).
// Errors, horizontal scroll and "control and day on one screen" go to session-log.txt.
// Run: NODE_PATH=<dir with playwright-core> node session-test.js
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage({ viewport: { width: 380, height: 700 }, deviceScaleFactor: 2 });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, 'what-gets-counted.html')); await page.waitForTimeout(500);
  const shot = async (n, full) => page.screenshot({ path: path.join(__dirname, 'screenshot-' + n + '.png'), fullPage: !!full });
  const log = []; const L = s => log.push(s);
  const txt = async sel => page.evaluate(s => (document.querySelector(s) || { innerText: '' }).innerText.replace(/\n+/g, ' / '), sel);
  const hscroll = async w => { if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) errors.push('horizontal scroll: ' + w); };
  const fits = async (h) => page.evaluate(h => { const pay = document.querySelector('#b-pay').getBoundingClientRect(); const days = document.querySelector('#days').getBoundingClientRect(); return { payBottom: Math.round(pay.bottom), daysTop: Math.round(days.top), daysBottom: Math.round(days.bottom), ok: pay.bottom <= h && days.top >= 0 && days.bottom <= h }; }, h || 700);
  const st = async () => page.evaluate(() => { const g = window.__game.state; return { round: g.round, bonus: g.bonus, deal: g.deal ? g.deal.join('') : null, paid: g.paid }; });
  const checkFit = async (tag, h) => { const f = await fits(h); L(tag + ': ' + JSON.stringify(await st()) + ' fits ' + JSON.stringify(f)); if (!f.ok) errors.push(tag + ' does not fit'); };

  await shot('start', true); await hscroll('start');
  await page.click('#b-help0'); await page.waitForTimeout(150); await shot('help', false); await page.click('#b-helpback');
  await page.click('#b-start'); await page.waitForTimeout(300);
  // round 1: sales rep, + button
  await shot('r1-zero', false); await checkFit('R1 at $0');
  for (let i = 0; i < 8; i++) { await page.click('#b-plus'); await page.waitForTimeout(50); }
  await page.waitForTimeout(250); await shot('r1-eight', false); await checkFit('R1 at $8'); L('   ' + await txt('.dayline'));
  await page.click('#s-round [data-help]'); await page.waitForTimeout(120); await page.click('#b-helpx'); L('help opened and closed mid-round: ' + JSON.stringify(await st()));
  await page.click('#b-pay'); await page.waitForTimeout(2600); await shot('r1-paid', true); await hscroll('r1 paid'); L('R1 ledger: ' + await txt('#ledger'));
  await page.click('#b-next'); await page.waitForTimeout(300);
  // round 2: teacher, keyboard only
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250); await shot('r2-six', false); await checkFit('R2 at $6 by keyboard'); L('   ' + await txt('.dayline'));
  await page.keyboard.press('Enter'); await page.waitForTimeout(2600); await shot('r2-paid', true); L('R2 ledger: ' + await txt('#ledger'));
  await page.keyboard.press('Enter'); await page.waitForTimeout(300);
  // round 3: two sales reps, swap and drag
  await shot('r3-start', false); await checkFit('R3 start');
  await page.click('.card[data-i="1"]'); await page.waitForTimeout(80); await page.click('.card[data-i="2"]'); await page.waitForTimeout(150);
  const box = await page.locator('#dial').boundingBox();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.4); await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.97, box.y + box.height * 0.4, { steps: 8 }); await page.mouse.up();
  await page.waitForTimeout(300); await shot('r3-split', false); await checkFit('R3 after swap and drag');
  await page.click('#b-pay'); await page.waitForTimeout(2900); await shot('r3-paid', true); await hscroll('r3 paid'); L('R3 ledger: ' + await txt('#ledger'));
  await page.click('#b-next'); await page.waitForTimeout(300);
  // round 4: two teachers, swap and keyboard
  await shot('r4-start', false); await checkFit('R4 start');
  await page.click('.card[data-i="1"]'); await page.waitForTimeout(80); await page.click('.card[data-i="2"]'); await page.waitForTimeout(150);
  for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300); await shot('r4-split', false); await checkFit('R4 after swap, $10');
  await page.keyboard.press('Enter'); await page.waitForTimeout(2900); await shot('r4-paid', true); await hscroll('r4 paid'); L('R4 ledger: ' + await txt('#ledger'));
  await page.keyboard.press('Enter'); await page.waitForTimeout(300); await shot('verdict', true); await hscroll('verdict');
  L('VERDICT: ' + await txt('#s-verdict'));
  await page.click('#b-about1'); await page.waitForTimeout(150); await page.evaluate(() => window.scrollTo(0, 0)); await shot('about', false); await page.click('#b-aboutback');
  await page.click('#b-again'); await page.waitForTimeout(200); L('replay: on ' + await page.evaluate(() => document.querySelector('.screen:not([hidden])').id));
  // projector: rounds 1 and 4
  await page.setViewportSize({ width: 1280, height: 720 }); await page.keyboard.press('Enter'); await page.waitForTimeout(250);
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250); await shot('projector', false); await checkFit('projector R1', 720);
  for (let n = 0; n < 3; n++) { await page.keyboard.press('Enter'); await page.waitForTimeout(2900); await page.keyboard.press('Enter'); await page.waitForTimeout(300); }
  await page.click('.card[data-i="1"]'); await page.click('.card[data-i="2"]'); for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300); await shot('projector-r4', false); await checkFit('projector R4', 720);
  await page.keyboard.press('Enter'); await page.waitForTimeout(3000); await shot('projector-r4-paid', false);
  L('root font at 1280x720: ' + await page.evaluate(() => getComputedStyle(document.documentElement).fontSize));
  L('\nERRORS: ' + (errors.length ? errors.join(' | ') : 'none'));
  const out = log.join('\n'); console.log(out); fs.writeFileSync(path.join(__dirname, 'session-log.txt'), out + '\n');
  await browser.close();
})();
