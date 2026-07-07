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
globalThis.WTYPES = { links:{w:300,h:340}, notes:{w:300,h:220}, todo:{w:300,h:260}, clips:{w:320,h:300}, qr:{w:260,h:330}, clock:{w:240,h:170}, md:{w:340,h:320}, img:{w:340,h:280}, timer:{w:290,h:210}, cal:{w:310,h:300}, year:{w:520,h:520}, leave:{w:390,h:430}, search:{w:300,h:330}, calc:{w:260,h:340}, files:{w:380,h:360}, dictado:{w:330,h:300}, intro:{w:350,h:280} };
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

// --- esquema v2: migración, accesores no-enumerables, serialización y saneo ---
globalThis.uid = () => 'u' + Math.random().toString(36).slice(2, 8);
globalThis.numOr = function(v, d, min, max){ v = Number(v); return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d; };
globalThis.blankSpace = function(){ return { id: 's_' + uid(), name: 'Escritorio', settings: { wallpaper: { type: 'preset', value: 0 } }, widgets: [] }; };
globalThis.defaultState = function(){ return { version: 1, updatedAt: Date.now(), settings: { wallpaper: { type: 'preset', value: 0 } }, widgets: [] }; };
eval('globalThis.migrate = ' + pickFn('migrate', 's'));
eval('globalThis.sanitizeWidgetShape = ' + pickFn('sanitizeWidgetShape', 'w'));
eval('globalThis.sanitizeState = ' + pickFn('sanitizeState', 's'));
eval('globalThis.bindSpace = ' + pickFn('bindSpace', 's'));

// migración v1 -> v2
const v1 = { version: 1, updatedAt: 123, settings: { wallpaper: { type: 'preset', value: 2 } },
  widgets: [ { id: 'a', type: 'notes', x: 10, y: 20, w: 300, h: 200, data: { text: 'hola' } }, { type: 'todo', data: { items: [] } } ] };
const m = sanitizeState(migrate(v1));
if (m.version !== 2) throw new Error('migrate: version no es 2');
if (!Array.isArray(m.spaces) || m.spaces.length !== 1) throw new Error('migrate: spaces mal formados');
if (m.spaces[0].widgets.length !== 2) throw new Error('migrate: widgets perdidos');
if (m.spaces[0].widgets[0].source !== 'user') throw new Error('migrate: source no asignado');
if (!m.spaces[0].widgets[1].id) throw new Error('migrate: id no generado');
if (m.spaces[0].settings.wallpaper.value !== 2) throw new Error('migrate: settings del espacio perdidos');

// accesores no-enumerables + serialización v2 (sin duplicar widgets/settings en raíz)
bindSpace(m);
if (m.widgets !== m.spaces[0].widgets) throw new Error('bindSpace: widgets no apunta al espacio activo');
m.widgets = m.widgets.filter(() => true);           // reasignación vía setter
if (m.spaces[0].widgets !== m.widgets) throw new Error('bindSpace: el setter no escribe en el espacio');
const json = JSON.parse(JSON.stringify(m));
if (json.widgets !== undefined) throw new Error('serializacion: widgets NO debe estar en la raíz');
if (json.settings !== undefined) throw new Error('serializacion: settings NO debe estar en la raíz');
if (!json.spaces || !json.spaces[0].widgets) throw new Error('serializacion: spaces debe llevar los widgets');

// ciclo real guardar -> recargar: el JSON serializado se re-adopta sin perder ni duplicar
const reloaded = bindSpace(sanitizeState(migrate(json)));
if (reloaded.widgets.length !== m.spaces[0].widgets.length) throw new Error('reload: widgets no preservados tras guardar+recargar');
if (JSON.parse(JSON.stringify(reloaded)).widgets !== undefined) throw new Error('reload: widgets reaparecen en la raíz');

// idempotencia sobre v2
if (migrate(m) !== m) throw new Error('migrate no es idempotente sobre v2');

// estado manipulado no debe romper
const bad = sanitizeState(migrate({ version: 2, spaces: [], active: 99 }));
if (!bad.spaces.length || bad.active !== 0) throw new Error('saneo: estado sin espacios / active fuera de rango no corregido');
const bad2 = sanitizeState(migrate({ version: 2, active: 0, spaces: [ { widgets: [ { type: 'inventado' }, { type: 'notes', x: 'NaN', data: null } ] } ] }));
if (bad2.spaces[0].widgets.length !== 1) throw new Error('saneo: tipo desconocido no filtrado');
if (typeof bad2.spaces[0].widgets[0].x !== 'number') throw new Error('saneo: dimensión no coercionada a número');
if (typeof bad2.spaces[0].widgets[0].data !== 'object') throw new Error('saneo: data no normalizada a objeto');
const marks = sanitizeState(migrate({ version: 2, active: 0, spaces: [ { widgets: [] } ], calendarMarks: [
  { start: '2026-08-15', end: '2026-08-01', type: 'vacaciones', label: 'Verano' },
  { start: '2026-09-01', end: '2026-09-01', type: 'consulta', label: 'Consulta', unit: 'hours', hours: 2.5 },
  { start: 'bad', end: '2026-08-02', type: 'script', label: '<x>' }
] })).calendarMarks;
if (marks.length !== 2) throw new Error('calendarMarks: no filtra fechas inválidas');
if (marks[0].start !== '2026-08-01' || marks[0].end !== '2026-08-15') throw new Error('calendarMarks: no normaliza rango invertido');
if (marks[0].type !== 'vacaciones') throw new Error('calendarMarks: tipo válido perdido');
if (marks[1].type !== 'consulta' || marks[1].unit !== 'hours' || marks[1].hours !== 2.5) throw new Error('calendarMarks: horas/concepto nuevo perdidos');
// source e id estrictos (endurecimiento para el futuro merge no destructivo)
const src2 = t => sanitizeWidgetShape({ type: 'notes', source: t }).source;
if (src2('user') !== 'user') throw new Error('source: "user" no preservado');
if (src2('pack') !== 'pack') throw new Error('source: "pack" no preservado');
if (src2('pack:centro-salud') !== 'pack:centro-salud') throw new Error('source: "pack:<slug>" no preservado');
for (const bad of ['package', 'userland', 'pack:' + 'x'.repeat(50), 'evil', ''])
  if (src2(bad) !== 'user') throw new Error('source laxo: "' + bad + '" debería caer a "user"');
if (typeof sanitizeWidgetShape({ type: 'notes', id: { x: 1 } }).id !== 'string') throw new Error('id no coercionado a string');
if (sanitizeWidgetShape({ type: 'notes', id: 'a'.repeat(200) }).id.length !== 64) throw new Error('id no acotado a 64');
const wt = sanitizeWidgetShape({ type: 'notes', tags: ['Clínica', ' clinica ', '', 'x'.repeat(40), 'Clínica'] }).tags;
if (!wt || wt.length !== 3 || wt[0] !== 'clínica' || wt[2].length !== 24) throw new Error('tags: normalización/dedupe/acotado incorrectos');
if (sanitizeWidgetShape({ type: 'notes' }).tags !== undefined) throw new Error('tags vacío debe ser undefined');
console.log('OK esquema v2 (migración, accesores no-enumerables, serialización, saneo estructural, source/id/tags estrictos)');

// espacios: índice activo tras borrar
eval('globalThis.nextActiveAfterDelete = ' + pickFn('nextActiveAfterDelete', 'active, removed, len'));
if (nextActiveAfterDelete(2, 0, 3) !== 1) throw new Error('borrar espacio anterior al activo: active debe bajar');
if (nextActiveAfterDelete(1, 2, 3) !== 1) throw new Error('borrar espacio posterior al activo: active no cambia');
if (nextActiveAfterDelete(2, 2, 2) !== 1) throw new Error('borrar el activo (último): active se acota');
if (nextActiveAfterDelete(0, 1, 2) !== 0) throw new Error('borrar posterior con active 0: sigue 0');
console.log('OK espacios (índice activo tras borrar)');

console.log('\nTODO EN VERDE');
