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
globalThis.WTYPES = { links:{w:300,h:340}, notes:{w:300,h:220}, todo:{w:300,h:260}, clips:{w:320,h:300}, qr:{w:260,h:330}, clock:{w:240,h:170}, md:{w:340,h:320}, img:{w:340,h:280}, timer:{w:290,h:210}, cal:{w:310,h:360}, year:{w:520,h:520}, leave:{w:390,h:430}, search:{w:300,h:330}, calc:{w:260,h:340}, files:{w:380,h:360}, dictado:{w:330,h:300}, intro:{w:350,h:280} };
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

// --- snapPosition: imán de arrastre (bordes del escritorio y de otras ventanas) ---
eval('globalThis.snapPosition = ' + pickFn('snapPosition', 'x, y, ww, hh, rects, vw, vh, thr = 8, gap = 14'));
const others = [ { x: 100, y: 100, w: 300, h: 200 } ];
// alineación con el borde izquierdo de otra ventana (dentro del umbral)
if (snapPosition(105, 500, 200, 100, others, 1400, 900).x !== 100) throw new Error('snap: no alinea con borde izquierdo cercano');
// adyacencia a la derecha de otra ventana: x = 100+300+14
if (snapPosition(410, 500, 200, 100, others, 1400, 900).x !== 414) throw new Error('snap: no pega a la derecha con hueco');
// fuera del umbral: no toca la posición
if (snapPosition(150, 500, 200, 100, others, 1400, 900).x !== 150) throw new Error('snap: mueve fuera del umbral');
// borde del escritorio (margen 12)
if (snapPosition(9, 9, 200, 100, [], 1400, 900).x !== 12) throw new Error('snap: no imanta al margen izquierdo');
if (snapPosition(9, 9, 200, 100, [], 1400, 900).y !== 12) throw new Error('snap: no imanta al margen superior');
// borde inferior útil: vh - 46 (barra) - hh - 12
if (snapPosition(500, 900 - 46 - 100 - 15, 200, 100, [], 1400, 900).y !== 900 - 46 - 100 - 12) throw new Error('snap: no imanta al borde inferior útil');
console.log('OK snapPosition (imán a bordes y ventanas, umbral respetado)');

// --- maxRect / clampRect: geometría maximizada robusta ante cambio de monitor (hotfix v0.21.1) ---
eval('globalThis.maxRect = ' + pickFn('maxRect', 'vw, vh'));
eval('globalThis.clampRect = ' + pickFn('clampRect', 'x, y, ww, hh, vw, vh'));
// maximizado en portátil 1366x768: llena el viewport útil (padding 12, barra 46)
const mr = maxRect(1366, 768);
if (mr.x !== 12 || mr.y !== 12 || mr.w !== 1342 || mr.h !== 698) throw new Error('maxRect: geometría incorrecta en 1366x768');
// rect guardado en 4K (3840x2160) restaurado en portátil: cabe y queda visible
const r4k = clampRect(3000, 1800, 3800, 2000, 1366, 768);
if (r4k.x > 1366 - 80 || r4k.y > 768 - 46 - 60) throw new Error('clampRect: posición de otro monitor no re-encajada');
if (r4k.w > 1366 - 24 || r4k.h > 768 - 46 - 24) throw new Error('clampRect: tamaño de otro monitor no acotado');
// w.max manipulado (basura): cae a valores por defecto sanos, nunca NaN
const rBad = clampRect('x', null, NaN, {}, 1366, 768);
for (const k of ['x','y','w','h']) if (!Number.isFinite(rBad[k])) throw new Error('clampRect: valor no finito con entrada basura (' + k + ')');
if (rBad.w < 220 || rBad.h < 140) throw new Error('clampRect: mínimos de ventana no respetados');
// rect normal en su mismo monitor: no se toca
const rSame = clampRect(100, 100, 300, 200, 1366, 768);
if (rSame.x !== 100 || rSame.y !== 100 || rSame.w !== 300 || rSame.h !== 200) throw new Error('clampRect: altera un rect que ya cabía');
console.log('OK maxRect/clampRect (maximizado sigue al viewport, restauración entre monitores, basura saneada)');

// --- gradientAvgHex: acento de pestaña calculado del degradado de fondo (sin canvas, barato) ---
eval('globalThis.gradientAvgHex = ' + pickFn('gradientAvgHex', 'css'));
if (gradientAvgHex('linear-gradient(135deg,#1b2735 0%,#090a0f 100%)') !== '#121922') throw new Error('gradientAvgHex: promedio de dos tonos incorrecto');
if (gradientAvgHex('linear-gradient(135deg,#000000 0%,#ffffff 50%,#000000 100%)') !== '#555555') throw new Error('gradientAvgHex: promedio de tres tonos incorrecto');
if (gradientAvgHex('url("foo.jpg") center/cover no-repeat, #10131a') !== '#10131a') throw new Error('gradientAvgHex: un único tono debe devolverse tal cual');
if (gradientAvgHex('') !== null) throw new Error('gradientAvgHex: cadena vacía debe ser null');
if (gradientAvgHex(null) !== null) throw new Error('gradientAvgHex: entrada no-string debe ser null');
console.log('OK gradientAvgHex (acento de pestaña = promedio de los tonos del degradado)');

// espacios: índice activo tras borrar
eval('globalThis.nextActiveAfterDelete = ' + pickFn('nextActiveAfterDelete', 'active, removed, len'));
if (nextActiveAfterDelete(2, 0, 3) !== 1) throw new Error('borrar espacio anterior al activo: active debe bajar');
if (nextActiveAfterDelete(1, 2, 3) !== 1) throw new Error('borrar espacio posterior al activo: active no cambia');
if (nextActiveAfterDelete(2, 2, 2) !== 1) throw new Error('borrar el activo (último): active se acota');
if (nextActiveAfterDelete(0, 1, 2) !== 0) throw new Error('borrar posterior con active 0: sigue 0');
console.log('OK espacios (índice activo tras borrar)');

// --- parseCapture: gramática de captura v1 (spec: _privado/spec-gramatica-captura.md) ---
// Reglas fijas: prefijo minúscula+espacio; año SIEMPRE el de `now` salvo explícito (sin
// salto automático); si no hay confianza total, null (nunca adivina).
eval('globalThis.CAL_MARK_TYPES = ' + src.match(/const CAL_MARK_TYPES = (\{[\s\S]*?\});/)[1]);
eval('globalThis.parseCapture = ' + pickFn('parseCapture', 'line, now'));
const NOW = new Date(2026, 6, 7);   // 7 jul 2026 (miércoles)
const eq = (got, want, msg) => { if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(msg + '\n  got:  ' + JSON.stringify(got) + '\n  want: ' + JSON.stringify(want)); };

// tareas
eq(parseCapture('t comprar pan', NOW), { kind: 'task', text: 'comprar pan' }, 'tarea simple');
eq(parseCapture('t llamar a Juan @hoy', NOW), { kind: 'task', text: 'llamar a Juan', due: '2026-07-07' }, 'tarea @hoy');
eq(parseCapture('t llamar @mañana', NOW), { kind: 'task', text: 'llamar', due: '2026-07-08' }, 'tarea @mañana');
eq(parseCapture('t llamar @manana', NOW), { kind: 'task', text: 'llamar', due: '2026-07-08' }, 'tarea @manana sin tilde');
eq(parseCapture('t revisar informe @12/8', NOW), { kind: 'task', text: 'revisar informe', due: '2026-08-12' }, 'tarea @DD/MM');
eq(parseCapture('t revisar @12-8', NOW), { kind: 'task', text: 'revisar', due: '2026-08-12' }, 'tarea @DD-MM');
eq(parseCapture('t felicitar @12/1', NOW), { kind: 'task', text: 'felicitar', due: '2026-01-12' }, 'año actual aunque la fecha ya pasó (sin salto automático)');
eq(parseCapture('t congreso @12/8/2027', NOW), { kind: 'task', text: 'congreso', due: '2027-08-12' }, 'año explícito');
eq(parseCapture('t bisiesto @29/2/2028', NOW), { kind: 'task', text: 'bisiesto', due: '2028-02-29' }, '29/2 en bisiesto válido');
eq(parseCapture('t pagar @31/2', NOW), { kind: 'task', text: 'pagar @31/2' }, 'fecha imposible: sin due, el token no se pierde');
eq(parseCapture('t fin de año @mañana', new Date(2026, 11, 31)), { kind: 'task', text: 'fin de año', due: '2027-01-01' }, '@mañana en Nochevieja cruza el año');

// notas y clips
eq(parseCapture('n idea para la sesión', NOW), { kind: 'note', text: 'idea para la sesión' }, 'nota');
eq(parseCapture('c fragmento reutilizable', NOW), { kind: 'clip', text: 'fragmento reutilizable' }, 'clip');

// enlaces
eq(parseCapture('https://pubmed.ncbi.nlm.nih.gov/', NOW), { kind: 'link', url: 'https://pubmed.ncbi.nlm.nih.gov/', title: '' }, 'URL suelta');
eq(parseCapture('e https://x.com Mi sitio', NOW), { kind: 'link', url: 'https://x.com', title: 'Mi sitio' }, 'enlace con título');
if (parseCapture('e sin-url', NOW) !== null) throw new Error('e sin URL debe ser null');
if (parseCapture('javascript:alert(1)', NOW) !== null) throw new Error('URI no http(s) debe ser null');

// marcas de calendario (estricto: fecha inválida o concepto no canónico → null)
eq(parseCapture('v 12-16/8', NOW), { kind: 'mark', start: '2026-08-12', end: '2026-08-16', type: 'vacaciones' }, 'rango vacaciones por defecto');
eq(parseCapture('v 12/8 guardia', NOW), { kind: 'mark', start: '2026-08-12', end: '2026-08-12', type: 'guardia' }, 'un día con concepto');
eq(parseCapture('v 12-16/8/2027', NOW), { kind: 'mark', start: '2027-08-12', end: '2027-08-16', type: 'vacaciones' }, 'rango con año explícito');
eq(parseCapture('v 16-12/8', NOW), { kind: 'mark', start: '2026-08-12', end: '2026-08-16', type: 'vacaciones' }, 'rango invertido se normaliza');
eq(parseCapture('v 1-2/9 formación', NOW), { kind: 'mark', start: '2026-09-01', end: '2026-09-02', type: 'formacion' }, 'concepto con tilde → clave canónica');
if (parseCapture('v 12-16/8 inventado', NOW) !== null) throw new Error('concepto no canónico debe ser null');
if (parseCapture('v 29/2', NOW) !== null) throw new Error('29/2 en año no bisiesto debe ser null');
if (parseCapture('v 12-16/13', NOW) !== null) throw new Error('mes 13 debe ser null');

// no-parseos explícitos de la spec §3
for (const bad of ['T llamar', 'x foo', 'mañana comprar', 'vacaciones del 12 al 16 de agosto', 't', 't   ', 'n', '', '   ', 'e'])
  if (parseCapture(bad, NOW) !== null) throw new Error('debería NO parsear: "' + bad + '"');
if (parseCapture(null, NOW) !== null || parseCapture(42, NOW) !== null) throw new Error('entrada no-string debe ser null');
console.log('OK parseCapture (gramática determinista, año sin magia, no-parseos respetados)');

// --- captureHint: ayuda de última milla en la paleta ---
eval('globalThis.captureHint = ' + pickFn('captureHint', 'q'));
if (!/^t texto/.test(captureHint('t') || '')) throw new Error('hint: "t" solo debe enseñar la sintaxis de tarea');
if (!/^v 12-16\/8/.test(captureHint('v 31/2') || '')) throw new Error('hint: "v" con fecha imposible debe enseñar la sintaxis de marca');
if (!/enlace/.test(captureHint('e ') || '')) throw new Error('hint: "e " debe enseñar la sintaxis de enlace');
for (const noHint of ['temporizador', 'nota de ayer', 'x foo', '', '   ', 'T '])
  if (captureHint(noHint) !== null) throw new Error('hint: no debería haber pista para "' + noHint + '"');
if (captureHint(42) !== null) throw new Error('hint: entrada no-string debe ser null');
console.log('OK captureHint (pista solo ante prefijo real, búsquedas normales sin ruido)');

// --- widget Archivos: buscador (matchesTerm) y orden (extOf, humanSize) ---
eval('globalThis.matchesTerm = ' + pickFn('matchesTerm', 'name, term'));
eval('globalThis.extOf = ' + pickFn('extOf', 'name'));
eval('globalThis.humanSize = ' + pickFn('humanSize', 'bytes'));
if (!matchesTerm('Informe.pdf', 'inf')) throw new Error('matchesTerm: no encuentra substring case-insensitive');
if (matchesTerm('Informe.pdf', '')) throw new Error('matchesTerm: término vacío no debe casar con nada');
if (matchesTerm('foto.jpg', 'zzz')) throw new Error('matchesTerm: falso positivo');
if (extOf('archivo.tar.gz') !== 'gz') throw new Error('extOf: extensión final incorrecta');
if (extOf('sinextension') !== '') throw new Error('extOf: sin punto debe ser cadena vacía');
if (extOf('.gitignore') !== '') throw new Error('extOf: punto inicial no cuenta como extensión');
if (humanSize(500) !== '500 B') throw new Error('humanSize: bytes sin convertir');
if (humanSize(2048) !== '2.0 KB') throw new Error('humanSize: conversión a KB incorrecta');
if (humanSize(5 * 1024 * 1024) !== '5.0 MB') throw new Error('humanSize: conversión a MB incorrecta');
console.log('OK widget Archivos (matchesTerm, extOf, humanSize)');

console.log('\nTODO EN VERDE');
