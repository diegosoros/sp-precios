// Renderiza film.html (1440x1440).
//   node render-film.js draft [salida.mp4]        → 30 fps, sin subcuadros (revisión rápida)
//   node render-film.js final [salida.mp4]        → 60 fps, 4 subcuadros mezclados con tmix
//   node render-film.js stills <carpeta> t1 t2 …  → PNGs en tiempos concretos
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const mode = process.argv[2] || 'draft';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1440 } });
  page.on('pageerror', e => console.error('ERR', e.message));
  await page.goto('file://' + path.join(__dirname, 'film.html') + '?render=1');
  await page.evaluate(() => window.READY);
  const dur = await page.evaluate(() => window.DURATION);

  if (mode === 'stills') {
    const dir = process.argv[3]; fs.mkdirSync(dir, { recursive: true });
    for (const t of process.argv.slice(4).map(Number)) {
      await page.evaluate(t => window.seek(t), t);
      await page.screenshot({ path: path.join(dir, `t${t.toFixed(2)}.png`) });
    }
    await browser.close(); return;
  }

  const fps = mode === 'final' ? 60 : 30, sub = mode === 'final' ? 4 : 1;
  const out = process.argv[3] || path.join(__dirname, `viste-${mode}.mp4`);
  const vf = sub > 1 ? ['-vf', `tmix=frames=${sub}:weights='1 1 1 1',select='not(mod(n\\,${sub}))',setpts=N/(${fps}*TB)`] : [];
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps * sub), '-i', '-', ...vf,
    '-r', String(fps), '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = Math.round(dur * fps * sub);
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.seek(t), f / (fps * sub));
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % (fps * sub) === 0) process.stdout.write(`${(f / (fps * sub)).toFixed(0)}s `);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('\nlisto:', out);
})();
