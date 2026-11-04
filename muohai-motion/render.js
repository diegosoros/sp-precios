// Renderiza el reel cuadro por cuadro a MP4 (1080x1920, 30 fps) con Playwright + ffmpeg.
// Uso: node render.js [salida.mp4] [--stills t1,t2,...  carpeta]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const args = process.argv.slice(2);
  const page_ = 'file://' + path.join(__dirname, 'index.html');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => { window.__CAPTURE = true; });
  await page.goto(page_);
  await page.evaluate(() => window.__reel.ready);
  const grab = async t => {
    const url = await page.evaluate(t => { window.__reel.render(t); return document.getElementById('reel').toDataURL('image/png'); }, t);
    return Buffer.from(url.split(',')[1], 'base64');
  };

  if (args[0] === '--stills') {
    const times = args[1].split(',').map(Number);
    const out = args[2];
    fs.mkdirSync(out, { recursive: true });
    for (const [i, t] of times.entries()) fs.writeFileSync(path.join(out, `still-${String(i).padStart(2, '0')}.png`), await grab(t));
    await browser.close();
    return;
  }

  const out = args[0] || path.join(__dirname, 'muohai-reel.mp4');
  const { DUR, FPS } = await page.evaluate(() => ({ DUR: window.__reel.DUR, FPS: window.__reel.FPS }));
  const frames = Math.round(DUR * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < frames; f++) {
    const buf = await grab(f / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 60 === 0) process.stdout.write(`cuadro ${f}/${frames}\n`);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
  await browser.close();
  console.log('listo:', out);
})();
