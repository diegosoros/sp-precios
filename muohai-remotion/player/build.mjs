// Empaqueta la composición con @remotion/player en una sola página HTML.
// Uso: node player/build.mjs [ruta-del-fragmento-para-artifact]
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, '..');

const webFonts = {
  name: 'fuentes-web',
  setup(b) {
    b.onResolve({ filter: /^\.\/fonts$/ }, () => ({ path: path.join(dir, 'fonts-web.ts') }));
  },
};

const result = await build({
  entryPoints: [path.join(dir, 'entry.tsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [webFonts],
  write: false,
  legalComments: 'none',
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const b64 = (f) => fs.readFileSync(path.join(root, 'src', 'fonts', f)).toString('base64');
const page = fs
  .readFileSync(path.join(dir, 'page.html'), 'utf8')
  .replace('{{BRICOLAGE}}', b64('bricolage.woff2'))
  .replace('{{SERIF_ITALIC}}', b64('instr-italic.woff2'))
  .replace('{{MONO}}', b64('dmmono500.woff2'))
  .replace('{{SCRIPT}}', () => js);
if (/\{\{[A-Z_]+\}\}/.test(page)) throw new Error('Quedó un marcador sin reemplazar');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const full = `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${page.replace('<main', '</head>\n<body>\n<main')}\n</body>\n</html>\n`;
fs.writeFileSync(path.join(root, 'dist', 'index.html'), full);
if (process.argv[2]) fs.writeFileSync(process.argv[2], page);
console.log(`dist/index.html ${(full.length / 1024).toFixed(0)} KB (script ${(js.length / 1024).toFixed(0)} KB)`);
