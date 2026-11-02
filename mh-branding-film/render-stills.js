// Renderiza las imágenes fijas de stills.html (1440x1440) en ./stills
// Uso: node render-stills.js
const { chromium } = require('playwright');
const path = require('path');

const STILLS = { open: '1-apertura', glass: '2-vidrio', stage: '3-escenario', wall: '4-pared' };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1440 } });
  for (const [s, name] of Object.entries(STILLS)) {
    await page.goto(`file://${path.join(__dirname, 'stills.html')}?s=${s}`);
    await page.evaluate(() => window.READY);
    await page.screenshot({ path: path.join(__dirname, 'stills', `${name}.png`) });
  }
  await browser.close();
})();
