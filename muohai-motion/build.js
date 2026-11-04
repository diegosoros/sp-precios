// Inserta las fuentes como base64 y genera index.html (página completa) y, opcionalmente, un fragmento sin <html>/<head>.
// Uso: node build.js [ruta-fragmento]
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const b64 = f => fs.readFileSync(path.join(dir, 'fonts', f)).toString('base64');
let src = fs.readFileSync(path.join(dir, 'reel.src.html'), 'utf8')
  .replace('{{BRICOLAGE}}', b64('bricolage.woff2'))
  .replace('{{SERIF_ITALIC}}', b64('instr-italic.woff2'))
  .replace('{{SERIF_REGULAR}}', b64('instr-regular.woff2'))
  .replace('{{MONO}}', b64('dmmono500.woff2'));
if (/\{\{[A-Z_]+\}\}/.test(src)) throw new Error('Quedó un marcador sin reemplazar');
const full = '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  + src.replace('<main', '</head>\n<body>\n<main') + '\n</body>\n</html>\n';
fs.writeFileSync(path.join(dir, 'index.html'), full);
if (process.argv[2]) fs.writeFileSync(process.argv[2], src);
console.log('index.html', (full.length / 1024).toFixed(0) + ' KB');
