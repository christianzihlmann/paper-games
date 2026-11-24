// Projector check: plays the game at 1280 x 720 by keyboard (as a presenter would) and screenshots rounds 1 and 3 (round 4 is in session-test.js). Usage: NODE_PATH=<playwright-core dir> node projector-test.js "$PWD"
const { chromium } = require('playwright-core'); const path = require('path');
(async () => {
  const dir = process.argv[2];
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(dir, 'what-gets-counted.html')); await p.waitForTimeout(300);
  await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  for (let i = 0; i < 5; i++) await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(300); await p.screenshot({ path: path.join(dir, 'screenshot-projector.png') });
  await p.keyboard.press('Enter'); await p.waitForTimeout(2800); await p.screenshot({ path: path.join(dir, 'screenshot-projector-paid.png') });
  await p.keyboard.press('Enter'); await p.waitForTimeout(200); await p.keyboard.press('Enter'); await p.waitForTimeout(2600); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  await p.click('.card[data-i="1"]'); await p.click('.card[data-i="2"]'); for (let i = 0; i < 12; i++) await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(300); await p.screenshot({ path: path.join(dir, 'screenshot-projector-r3.png') });
  const fit = await p.evaluate(() => ({ pay: Math.round(document.querySelector('#b-pay').getBoundingClientRect().bottom), days: Math.round(document.querySelector('#days').getBoundingClientRect().bottom), scrollH: document.documentElement.scrollHeight, font: getComputedStyle(document.documentElement).fontSize }));
  console.log('projector round 3:', JSON.stringify(fit), 'errors:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
