// Renderiza film.html (1440x1440) desde un servidor local (el clip de la pared se carga como blob URL).
//   node render-film.js draft [salida.mp4]        → 30 fps, sin subcuadros (revisión rápida)
//   node render-film.js final [salida.mp4]        → 60 fps, 4 subcuadros mezclados con tmix + audio
//   node render-film.js stills <carpeta> t1 t2 …  → PNGs en tiempos concretos
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const mode = process.argv[2] || 'draft';
const AUDIO = path.join(__dirname, 'assets', 'audio', 'viste-mix.wav');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4' };

function serve() {
  const server = http.createServer((req, res) => {
    const file = path.join(__dirname, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(__dirname) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}

(async () => {
  const server = await serve();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1440 } });
  page.on('pageerror', e => console.error('ERR', e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/film.html?render=1`);
  await page.evaluate(() => window.READY);
  const dur = await page.evaluate(() => window.DURATION);

  if (mode === 'stills') {
    const dir = process.argv[3]; fs.mkdirSync(dir, { recursive: true });
    for (const t of process.argv.slice(4).map(Number)) {
      await page.evaluate(t => window.seek(t), t);
      await page.screenshot({ path: path.join(dir, `t${t.toFixed(2)}.png`) });
    }
  } else {
    const fps = mode === 'final' ? 60 : 30, sub = mode === 'final' ? 4 : 1;
    const out = process.argv[3] || path.join(__dirname, `viste-${mode}.mp4`);
    const withAudio = fs.existsSync(AUDIO);
    const vf = sub > 1 ? ['-vf', `tmix=frames=${sub}:weights='1 1 1 1',select='not(mod(n\\,${sub}))',setpts=N/(${fps}*TB)`] : [];
    const aud = withAudio ? ['-i', AUDIO, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '256k', '-shortest'] : [];
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps * sub), '-i', '-', ...aud, ...vf,
      '-r', String(fps), '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const total = Math.round(dur * fps * sub);
    for (let f = 0; f < total; f++) {
      await page.evaluate(t => window.seek(t), f / (fps * sub));
      const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % (fps * sub) === 0) process.stdout.write(`${(f / (fps * sub)).toFixed(0)}s `);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('\nlisto:', out, withAudio ? '(con audio)' : '(sin audio)');
  }
  await browser.close(); server.close();
})();
