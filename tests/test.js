// Tests de Cabecera — sin dependencias. Ejecutar:  node tests/test.js
// Valida: sintaxis del script inline, seguridad de mdToHtml (XSS) y
// saneamiento de packs no confiables en normalizePack.

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const src = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// --- sintaxis: new Function compila sin ejecutar ---
new Function(src);
console.log('OK sintaxis del script inline');

// --- extraer funciones puras para probarlas aisladas ---
const escLine = src.split('\n').find(l => l.startsWith('const esc = '));
eval(escLine.replace('const esc', 'globalThis.esc'));

const pickFn = (name, arg) => {
  const re = new RegExp('function ' + name + '\\(' + arg + '\\)\\{[\\s\\S]*?\\n\\}');
  const m = src.match(re);
  if (!m) throw new Error('no encontrada ' + name);
  return m[0].replace('function ' + name, 'function');
};
eval('globalThis.mdToHtml = ' + pickFn('mdToHtml', 'src'));

// --- mdToHtml: XSS ---
const evil = mdToHtml('<script>alert(1)</' + 'script>\n<img src=x onerror=alert(1)>\n[click](javascript:alert(1))\n[ok](https://pubmed.gov)');
if (evil.includes('<script')) throw new Error('XSS: script sin escapar');
if (evil.includes('<img')) throw new Error('XSS: img sin escapar');
if (evil.includes('href="javascript:')) throw new Error('XSS: javascript: URI en enlace');
if (!evil.includes('href="https://pubmed.gov"')) throw new Error('enlace legitimo perdido');

// --- mdToHtml: formato ---
const md = mdToHtml('# Titulo\n- uno\n- dos\n1. a\n**neg** y *cur* y `cod`\n> cita\n---\n```\nvar x=1\n```');
for (const tag of ['<h3>', '<ul>', '<li>', '<ol>', '<b>', '<i>', '<code>', '<blockquote>', '<hr>', '<pre>'])
  if (!md.includes(tag)) throw new Error('formato: falta ' + tag);
// fence sin cierre no debe dejar <pre> abierto
if (!mdToHtml('```\nabierto').endsWith('</pre>')) throw new Error('fence sin cierre no se cierra');
console.log('OK mdToHtml (XSS bloqueado, formato correcto)');

// --- normalizePack: pack malicioso ---
globalThis.WTYPES = { links:{w:300,h:340}, notes:{w:300,h:220}, todo:{w:300,h:260}, clips:{w:320,h:300}, qr:{w:260,h:330}, clock:{w:240,h:170}, md:{w:340,h:320}, img:{w:340,h:280}, timer:{w:290,h:210}, cal:{w:310,h:300}, search:{w:300,h:330}, intro:{w:350,h:280} };
globalThis.WP_PRESETS = [1, 2, 3, 4, 5, 6];
eval('globalThis.normalizePack = ' + pickFn('normalizePack', 'p'));

const evilPack = normalizePack({ cabeceraPack: 1, name: 'x'.repeat(500), settings: { wallpaper: { type: 'url', value: 'https://tracker.evil/p.png' } }, widgets: [
  { type: 'links', x: '40px;background:url(https://evil)', w: {}, data: { groups: [ { name: 'g', links: [
    { t: 'mal', u: 'javascript:alert(1)' }, { t: 'data', u: 'data:text/html,x' }, { t: 'ok', u: 'https://pubmed.ncbi.nlm.nih.gov/' }, { t: 'ftp', u: 'ftp://x' } ] } ] } },
  { type: 'intro' },
  { type: 'inventado' },
  { type: 'search', data: { engines: [ { n: 'mal', u: 'javascript:x?%s' }, { n: 'sin-s', u: 'https://x.com/' }, { n: 'ok', u: 'https://pubmed.ncbi.nlm.nih.gov/?term=%s' } ] } },
  { type: 'img', data: { img: 'javascript:alert(1)' } },
  { type: 'img', data: { img: 'data:image/png;base64,iVBOR' } },
  { type: 'clock', data: { analog: 'si' } },
  { type: 'timer', data: { min: 9999 } },
  { type: 'md', t: 'Guia', data: { text: '# hola' } },
  { type: 'cal' }
]});
// sobreviven: links, search, img legitima, clock, timer, md, cal = 7
// (fuera: intro, tipo inventado, img con javascript:)
if (evilPack.widgets.length !== 7) throw new Error('esperaba 7 widgets tras filtrar, hay ' + evilPack.widgets.length);
if (evilPack.name.length !== 80) throw new Error('nombre sin truncar');
if (evilPack.settings.wallpaper !== undefined) throw new Error('wallpaper url de pack no descartado');
const links = evilPack.widgets.find(w => w.type === 'links');
if (links.data.groups[0].links.length !== 1 || !links.data.groups[0].links[0].u.startsWith('https://pubmed')) throw new Error('URLs mal filtradas');
if (typeof links.x !== 'number' || links.x !== 40) throw new Error('inyeccion CSS en dimensiones no neutralizada');
const se = evilPack.widgets.find(w => w.type === 'search');
if (se.data.engines.length !== 1) throw new Error('engines mal filtrados');
if (evilPack.widgets.filter(w => w.type === 'img').length !== 1) throw new Error('img: filtrado incorrecto');
if (evilPack.widgets.find(w => w.type === 'timer').data.min !== 180) throw new Error('timer.min sin acotar');
if (evilPack.widgets.find(w => w.type === 'md').t !== 'Guia') throw new Error('titulo de ventana perdido');
if (evilPack.widgets.find(w => w.type === 'clock').data.analog !== true) throw new Error('clock.analog sin coercion');
if (normalizePack(null) !== null || normalizePack({ cabeceraPack: 2, widgets: [] }) !== null) throw new Error('no rechaza formato invalido');
console.log('OK normalizePack (pack malicioso saneado, packs invalidos rechazados)');

// --- packs incluidos: deben pasar el saneado sin perder nada ---
for (const p of ['sanitarios', 'basico']){
  const pack = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'packs', p + '.json'), 'utf8'));
  const np = normalizePack(pack);
  if (!np || np.widgets.length !== pack.widgets.length) throw new Error('pack ' + p + ' pierde widgets al normalizar');
}
console.log('OK packs incluidos (sanitarios, basico)');

console.log('\nTODO EN VERDE');
