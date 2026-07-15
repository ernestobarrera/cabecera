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

// --- panel ⚙: state.appSettings raíz enumerable, whitelist estricta, sin escritura de defaults ---
// ausencia = canónico: el saneo NUNCA lo crea
if ('appSettings' in sanitizeState(migrate({ version: 2, active: 0, spaces: [{ widgets: [] }] }))) throw new Error('appSettings: el saneo no debe CREARLO (ausencia = defaults en memoria)');
// whitelist: font solo humanist|classic (system = ausencia); defaultCols solo 2|3|4
let aps = sanitizeState(migrate({ version: 2, active: 0, spaces: [{ widgets: [] }], appSettings: { font: 'classic', defaultCols: 3 } })).appSettings;
if (!aps || aps.font !== 'classic' || aps.defaultCols !== 3) throw new Error('appSettings: valores válidos perdidos');
aps = sanitizeState(migrate({ version: 2, active: 0, spaces: [{ widgets: [] }], appSettings: { font: 'evil;url(x)', defaultCols: 9 } }));
if ('appSettings' in aps) throw new Error('appSettings: todo inválido debe eliminarse entero');
aps = sanitizeState(migrate({ version: 2, active: 0, spaces: [{ widgets: [] }], appSettings: { font: 'system', defaultCols: 4, extra: 1 } })).appSettings;
if (!aps || aps.font !== undefined || aps.defaultCols !== 4 || aps.extra !== undefined) throw new Error('appSettings: system debe caer a ausencia y los extras descartarse');
// raíz enumerable: sobrevive al round-trip y NO depende del espacio activo
const apsState = bindSpace(sanitizeState(migrate({ version: 2, active: 0, spaces: [{ widgets: [] }, { widgets: [] }], appSettings: { font: 'humanist' } })));
apsState.active = 1;
if (apsState.appSettings.font !== 'humanist') throw new Error('appSettings: cambiar de espacio no debe alterarlo (era el bug de esquema de la spec v1.0)');
if (JSON.parse(JSON.stringify(apsState)).appSettings.font !== 'humanist') throw new Error('appSettings: no sobrevive a la serialización');
// invariantes de fuente: tipografía solo por id de whitelist; defaultCols SOLO en addSpace; panel transaccional
if (!src.match(/FONT_STACKS = \{[\s\S]*?\}/)) throw new Error('regresión ⚙: falta la whitelist FONT_STACKS');
if (!src.match(/setProperty\("--font", FONT_STACKS\[id\]\)/g) || (src.match(/setProperty\("--font"/g) || []).length !== 2) throw new Error('regresión ⚙: --font debe fijarse SOLO vía FONT_STACKS (applyFont + preview)');
if (!src.match(/function addSpace[\s\S]{0,700}defaultCols/)) throw new Error('regresión ⚙: addSpace ya no consulta defaultCols');
if (src.match(/function blankSpace[\s\S]{0,300}defaultCols/)) throw new Error('regresión ⚙: blankSpace NO debe consultar defaultCols (solo el gesto de crear espacio)');
const cfgWiring = src.match(/panel ⚙ de configuración general[\s\S]*?\$\("#cfg-save"\)/);
if (!cfgWiring || cfgWiring[0].includes('markDirty')) throw new Error('regresión ⚙: abrir/preview/cancelar no deben escribir (markDirty solo en saveConfig)');
if (!src.match(/function saveConfig[\s\S]{0,700}markDirty/)) throw new Error('regresión ⚙: saveConfig debe ser el único commit');
console.log('OK panel ⚙ (appSettings raíz con whitelist, sin auto-creación, independiente del espacio, transaccional)');

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

// --- N1: dragTarget — destino de la sombra (spec-layout-guiado v1.1) ---
eval('globalThis.overlapsRect = ' + pickFn('overlapsRect', 'a, b, gap = 12'));
eval('globalThis.dragTarget = ' + pickFn('dragTarget', 'x, y, ww, hh, rects, vw, vh, thr = 8, gap = 14'));
{
  // dentro del umbral: destino = snap, marcado como snapped
  const t1 = dragTarget(105, 500, 200, 100, others, 1400, 900);
  if (t1.x !== 100 || !t1.snapped) throw new Error('dragTarget: no encaja dentro del umbral');
  // sin candidato: destino = posición libre (respuesta SIEMPRE), sin snapped
  const t2 = dragTarget(600, 500, 200, 100, others, 1400, 900);
  if (t2.x !== 600 || t2.y !== 500 || t2.snapped) throw new Error('dragTarget: sin candidato debe devolver la posición libre');
  // el destino nunca es negativo aunque el snap proponga adyacencia fuera del lienzo
  const t3 = dragTarget(2, 2, 200, 100, [{ x: 0, y: 0, w: 195, h: 100 }], 1400, 900);
  if (t3.x < 0 || t3.y < 0) throw new Error('dragTarget: destino negativo');
  // metadato overlap: encima de otra ventana lo dice; lejos, no
  if (!dragTarget(150, 150, 200, 100, others, 1400, 900).overlap) throw new Error('dragTarget: no detecta solape');
  if (dragTarget(800, 700, 200, 100, others, 1400, 900).overlap) throw new Error('dragTarget: solape fantasma');
}
console.log('OK dragTarget (snap anticipado, respuesta siempre, clamp y solape)');

// --- N0: planificadores puros (planAutoArrange / findSpotPlan) ---
eval('globalThis.planAutoArrange = ' + pickFn('planAutoArrange', 'sizes, vw, vh, opts'));
eval('globalThis.findSpotPlan = ' + pickFn('findSpotPlan', 'rects, ww, hh, vw, vh, opts'));
{
  // una fila que cabe: x avanza con gap, misma y
  const p1 = planAutoArrange([{ w: 300, h: 200 }, { w: 300, h: 200 }], 1400, 900);
  if (p1.rects[0].x !== 24 || p1.rects[0].y !== 24) throw new Error('plan: origen debe ser el margen 24');
  if (p1.rects[1].x !== 24 + 300 + 14 || p1.rects[1].y !== 24) throw new Error('plan: segunda ventana no adyacente en fila');
  if (p1.clipped) throw new Error('plan: clipped sin motivo');
  // salto de fila cuando no cabe
  const p2 = planAutoArrange([{ w: 700, h: 200 }, { w: 700, h: 300 }], 1000, 900);
  if (p2.rects[1].x !== 24 || p2.rects[1].y !== 24 + 200 + 14) throw new Error('plan: no salta de fila');
  // suelo VISUAL 140: un h persistido de 120 empaqueta como 140 (el CSS ya lo pintaba así — Codex C5)
  const p3 = planAutoArrange([{ w: 700, h: 120 }, { w: 700, h: 200 }], 1000, 900);
  if (p3.rects[1].y !== 24 + 140 + 14) throw new Error('plan: la fila debe medir con el alto visual (140), no el persistido (120)');
  // plegados miden 42
  const p4 = planAutoArrange([{ w: 700, h: 400, collapsed: true }, { w: 700, h: 200 }], 1000, 900);
  if (p4.rects[1].y !== 24 + 42 + 14) throw new Error('plan: plegado no mide 42');
  // muchos widgets: clipped avisa y ningún y deja el título inaccesible
  const p5 = planAutoArrange(Array.from({ length: 30 }, () => ({ w: 400, h: 300 })), 900, 600);
  if (!p5.clipped) throw new Error('plan: debería avisar de que no caben');
  if (p5.rects.some(r => r.y + 60 > 600 - 46 - 12 + 0.001)) throw new Error('plan: título bajo el borde');
  // hueco para widget nuevo: escritorio vacío → margen; primer hueco libre tras un ocupado
  const s1 = findSpotPlan([], 260, 180, 1400, 900);
  if (s1.x !== 24 || s1.y !== 24) throw new Error('spot: vacío debe dar el margen');
  const s2 = findSpotPlan([{ x: 24, y: 24, w: 300, h: 200 }], 260, 180, 1400, 900);
  if (s2.x <= 24 + 300 - 28 && s2.y === 24) throw new Error('spot: cae encima del ocupado');
  // lleno: fallback abajo-izquierda, nunca null
  const full = [{ x: 0, y: 0, w: 1400, h: 900 }];
  const s3 = findSpotPlan(full, 260, 180, 1400, 900);
  if (typeof s3.x !== 'number' || typeof s3.y !== 'number') throw new Error('spot: fallback roto');
}
console.log('OK planificadores N0 (filas con alto visual 140, plegados 42, clipped, huecos y fallback)');

// --- maxRect / clampRect: geometría maximizada robusta ante cambio de monitor (hotfix v0.21.1) ---
eval('globalThis.maxRect = ' + pickFn('maxRect', 'vw, vh, scrollTop = 0'));
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

// --- Fase 1 motor de encuadre puro (acta 2026-07-09, aún sin conectar a render) ---
// WTYPES real (el stub simplificado de la sección normalizePack no trae minW/minH)
eval('globalThis.WTYPES = ' + src.match(/const WTYPES = (\{[\s\S]*?\});/)[1]);
eval('globalThis.safeViewportRect = ' + pickFn('safeViewportRect', 'vw, vh'));
eval('globalThis.widgetLayoutSpec = ' + pickFn('widgetLayoutSpec', 'type'));
eval('globalThis.fitRectToViewport = ' + pickFn('fitRectToViewport', 'rect, spec, viewport'));
eval('globalThis.planViewportLayout = ' + pickFn('planViewportLayout', 'widgets, viewport'));

// safeViewportRect reutiliza maxRect (mismo área útil, sin duplicar el cálculo)
for (const [vw, vh] of [[1366, 768], [1920, 1200], [3840, 2160]])
  if (JSON.stringify(safeViewportRect(vw, vh)) !== JSON.stringify(maxRect(vw, vh)))
    throw new Error('safeViewportRect: diverge de maxRect en ' + vw + 'x' + vh);

// widgetLayoutSpec: deriva de WTYPES sin escribir en la tabla
const specYear = widgetLayoutSpec('year');
if (specYear.w !== 520 || specYear.h !== 520 || specYear.minW !== 300 || specYear.minH !== 340)
  throw new Error('widgetLayoutSpec: no deriva bien los valores existentes de "year"');
const specNotes = widgetLayoutSpec('notes');   // WTYPES.notes no trae minW/minH propios
if (specNotes.minW !== 220 || specNotes.minH !== 140) throw new Error('widgetLayoutSpec: mínimos por defecto incorrectos');
if (WTYPES.notes.minW !== undefined || WTYPES.notes.minH !== undefined)
  throw new Error('widgetLayoutSpec: mutó WTYPES en vivo (ronda 2 Codex: prohibido en Fase 1)');
if (widgetLayoutSpec('inventado').w !== 260) throw new Error('widgetLayoutSpec: tipo desconocido sin fallback sano');

// fitRectToViewport: un rect que ya cabe no se toca (paridad con clampRect)
const vp1366 = safeViewportRect(1366, 768);
const fitSame = fitRectToViewport({ x: 100, y: 100, w: 300, h: 200 }, widgetLayoutSpec('notes'), vp1366);
if (fitSame.x !== 100 || fitSame.y !== 100 || fitSame.w !== 300 || fitSame.h !== 200)
  throw new Error('fitRectToViewport: altera un rect que ya cabía');

// fitRectToViewport: guardado en 4K, proyectado en portátil — debe quedar ENTERO dentro del
// viewport (no solo el título asomando, la crítica exacta que Codex hizo a clampRect)
const fit4k = fitRectToViewport({ x: 3400, y: 1900, w: 520, h: 520 }, widgetLayoutSpec('year'), vp1366);
if (fit4k.x < vp1366.x || fit4k.y < vp1366.y) throw new Error('fitRectToViewport: rect fuera del borde superior/izquierdo');
if (fit4k.x + fit4k.w > vp1366.x + vp1366.w + 0.001) throw new Error('fitRectToViewport: cuerpo se sale por la derecha, no solo el título');
if (fit4k.y + fit4k.h > vp1366.y + vp1366.h + 0.001) throw new Error('fitRectToViewport: cuerpo se sale por abajo, no solo el título');

// fitRectToViewport: entrada basura (NaN/null/strings) — nunca produce valores no finitos
const fitBad = fitRectToViewport({ x: 'x', y: null, w: NaN, h: {} }, widgetLayoutSpec('notes'), vp1366);
for (const k of ['x', 'y', 'w', 'h']) if (!Number.isFinite(fitBad[k])) throw new Error('fitRectToViewport: valor no finito con entrada basura (' + k + ')');

// fitRectToViewport: widget mayor que el viewport útil (ventana muy estrecha, 320px) —
// se encoge a sus mínimos y no rompe, aunque no llegue a caber del todo
const vpTiny = safeViewportRect(320, 480);
const fitTiny = fitRectToViewport({ x: 0, y: 0, w: 520, h: 520 }, widgetLayoutSpec('year'), vpTiny);
if (!Number.isFinite(fitTiny.w) || !Number.isFinite(fitTiny.h) || fitTiny.w < 300 || fitTiny.h < 340)
  throw new Error('fitRectToViewport: no respeta mínimos en viewport diminuto');

console.log('OK fitRectToViewport (rect intacto si cabe, proyección 4K→portátil sin franja, basura saneada, mínimos respetados)');

// planViewportLayout: plegado siempre a 42px, con independencia del h guardado
const planCollapsed = planViewportLayout([{ id: 'a', type: 'notes', x: 50, y: 50, w: 300, h: 900, collapsed: true }], vp1366);
if (planCollapsed[0].h !== 42) throw new Error('planViewportLayout: widget plegado no queda en 42px');

// planViewportLayout: viewport justo por encima del corte a móvil (701-900px) — salida sana
const vp750 = safeViewportRect(750, 600);
const planNarrow = planViewportLayout([{ id: 'b', type: 'files', x: 3000, y: 10, w: 380, h: 360 }], vp750);
if (planNarrow[0].x + planNarrow[0].w > vp750.x + vp750.w + 0.001) throw new Error('planViewportLayout: se sale del viewport 701-900px');

// planViewportLayout: widget con w.max presente (maximizado) no debe romper la proyección
// (Fase 1 no gobierna ese caso — sigue en manos de maxRect/clampRect vía buildWindow/resize)
const planMax = planViewportLayout([{ id: 'c', type: 'notes', x: 10, y: 10, w: 300, h: 200, max: { x: 0, y: 0, w: 100, h: 100 } }], vp1366);
if (!Number.isFinite(planMax[0].x) || !Number.isFinite(planMax[0].w)) throw new Error('planViewportLayout: widget maximizado rompe la proyección');

// planViewportLayout: muchos widgets simultáneos — cada uno queda contenido en el viewport
// (Fase 1 proyecta de forma independiente; NO empaqueta ni evita solapes entre sí)
const manyWidgets = Array.from({ length: 15 }, (_, i) => ({ id: 'w' + i, type: 'notes', x: 100 + i * 5, y: 100 + i * 5, w: 300, h: 220 }));
const planMany = planViewportLayout(manyWidgets, vp1366);
for (const r of planMany){
  if (r.x < vp1366.x || r.y < vp1366.y) throw new Error('planViewportLayout: widget fuera del borde con muchos abiertos');
  if (r.x + r.w > vp1366.x + vp1366.w + 0.001 || r.y + r.h > vp1366.y + vp1366.h + 0.001)
    throw new Error('planViewportLayout: widget se sale del viewport con muchos abiertos');
}

// caso real reportado: sesión guardada en el monitor grande de casa (2560x1440), abierta en
// cada uno de los buckets representativos de dispositivo — siempre queda dentro del viewport
const savedInBigMonitor = [
  { id: 'links', type: 'links', x: 2200, y: 1100, w: 300, h: 340 },
  { id: 'year', type: 'year', x: 1800, y: 700, w: 520, h: 520 },
  { id: 'files', type: 'files', x: 2000, y: 900, w: 380, h: 360 },
];
const buckets = [[1280, 800], [1366, 768], [1920, 1080], [1920, 1200], [2560, 1440], [3840, 2160]];
for (const [vw, vh] of buckets){
  const vp = safeViewportRect(vw, vh);
  const plan = planViewportLayout(savedInBigMonitor, vp);
  for (const r of plan){
    if (r.x < vp.x - 0.001 || r.y < vp.y - 0.001) throw new Error('bucket ' + vw + 'x' + vh + ': widget fuera del borde superior/izquierdo');
    if (r.x + r.w > vp.x + vp.w + 0.001 || r.y + r.h > vp.y + vp.h + 0.001)
      throw new Error('bucket ' + vw + 'x' + vh + ': widget se sale por la derecha/abajo (el bug reportado por Ernesto)');
  }
}
console.log('OK planViewportLayout (plegados, 701-900px, maximizado no rompe, muchos widgets, 4K→todos los buckets sin salirse)');

// --- N2 hito 1: lienzo con scroll vertical (worldHeight pura + invariantes de contrato) ---
eval('globalThis.worldHeight = ' + pickFn('worldHeight', 'rects, viewH, margin, tope'));
// vacío o todo cabe en el viewport → alto = alto visible (no encoge por debajo)
if (worldHeight([], 700, 24, 12000) !== 700) throw new Error('worldHeight: sin widgets debe ser el alto visible');
if (worldHeight([{ y: 10, h: 200 }], 700, 24, 12000) !== 700) throw new Error('worldHeight: contenido corto no debe encoger bajo el visible');
// contenido más alto que el viewport → borde inferior del más bajo + margen
if (worldHeight([{ y: 500, h: 400 }, { y: 100, h: 200 }], 700, 24, 12000) !== 924) throw new Error('worldHeight: no toma el borde inferior del más bajo + margen');
// tope absoluto: un y disparatado (dentro del saneo y≤8000/h≤4000) no crea un lienzo infinito
if (worldHeight([{ y: 8000, h: 4000 }], 700, 24, 12000) !== 12000) throw new Error('worldHeight: no respeta el tope de 12000');
console.log('OK worldHeight (alto visible mínimo, borde inferior + margen, tope 12000)');

// invariantes de fuente del contrato cliente↔mundo y del overflow:
if (!src.includes('function clientToWorld(') || !src.includes('function worldToClient(')) throw new Error('regresión: faltan las conversiones cliente↔mundo (contrato N0 exigido por el autoscroll)');
if (!src.match(/worldMax:\s*12000/)) throw new Error('regresión: LAYOUT.worldMax dejó de ser 12000 (tope del lienzo, decisión P4 del gate)');
if (!src.match(/const world = clientToWorld\(m\.clientX, m\.clientY\)/)) throw new Error('regresión: el arrastre ya no calcula la posición en coords de mundo');
if (!src.includes('const edgeScroll =') || !src.match(/if \(d\.scrollTop !== before\) applyMove\(\)/)) throw new Error('regresión: el autoscroll no recalcula con la última posición del puntero (riesgo 2 del gate)');
if (!src.includes('maxRect(deskViewW(), innerHeight, deskEl().scrollTop)')) throw new Error('regresión: maximizar ya no cubre el viewport visible en coords de mundo');
if (!src.match(/scroll-lock/) || !src.includes('function updateScrollLock(')) throw new Error('regresión: una ventana maximizada ya no bloquea el scroll del escritorio (riesgo 3 del gate)');
console.log('OK contrato cliente↔mundo (conversiones, tope, arrastre en mundo, autoscroll con recálculo, maximizar bloquea scroll)');

// --- N2 hito 2: planificadores puros de columnas guiadas (spec v1.1, gate de Codex) ---
eval('globalThis.columnGuides = ' + pickFn('columnGuides', 'vw, opts'));
eval('globalThis.ownerLane = ' + pickFn('ownerLane', 'rect, guides'));   // N3: pertenencia ÚNICA (mayor solape)
eval('globalThis.laneClassify = ' + pickFn('laneClassify', 'rects, guides, laneIdx, tol'));   // fuente única de pertenencia, usada por planLaneInsert
eval('globalThis.planLaneInsert = ' + pickFn('planLaneInsert', 'rects, lane, pointerY, dragged, opts'));
// nº de carriles por ancho (fórmula con gutters descontados, P1): 2/3/4 según COL_MIN=320
const nCols = vw => columnGuides(vw).n;
if (nCols(800) !== 2) throw new Error('columnGuides: 800px debería dar 2 carriles, da ' + nCols(800));
if (nCols(1024) !== 3) throw new Error('columnGuides: 1024px debería dar 3 carriles, da ' + nCols(1024));
if (nCols(1366) !== 4) throw new Error('columnGuides: 1366px debería dar 4 carriles, da ' + nCols(1366));
if (nCols(640) !== 2) throw new Error('columnGuides: mínimo 2 carriles aunque sea estrecho');
if (nCols(6000) !== 4) throw new Error('columnGuides: máximo 4 carriles aunque sea muy ancho');
// los carriles no se solapan y caben en el ancho útil
for (const vw of [800, 1024, 1366, 1920, 2560, 3840]){
  const g = columnGuides(vw);
  for (let i = 1; i < g.cols.length; i++)
    if (g.cols[i].x < g.cols[i-1].x + g.cols[i-1].w) throw new Error('columnGuides: carriles solapados en ' + vw);
  if (g.cols[g.cols.length-1].x + g.cols[g.cols.length-1].w > vw) throw new Error('columnGuides: la cuadrícula se sale del ancho en ' + vw);
}
// COL_MAX: en 4K los carriles no superan 520 y la cuadrícula queda centrada
const g4k = columnGuides(3840);
if (g4k.cols.some(c => c.w > 520)) throw new Error('columnGuides: 4K supera COL_MAX=520');
const marginL = g4k.cols[0].x, marginR = 3840 - (g4k.cols[3].x + g4k.cols[3].w);
if (Math.abs(marginL - marginR) > 2) throw new Error('columnGuides: la cuadrícula 4K no está centrada (márgenes ' + marginL + ' vs ' + marginR + ')');
console.log('OK columnGuides (2/3/4 por ancho, sin solape, COL_MAX y centrado en 4K)');

// --- N3: pertenencia única (ownerLane) + clasificación con umbral de invasión snapGap ---
const gN3 = { cols: [{ x: 100, w: 320 }, { x: 434, w: 320 }], gutter: 14 };
if (ownerLane({ x: 110, w: 300 }, gN3) !== 0) throw new Error('ownerLane: mayoría clara en el carril 0');
if (ownerLane({ x: 400, w: 300 }, gN3) !== 1) throw new Error('ownerLane: el propietario es el de MAYOR solape, no el primero que toca');
if (ownerLane({ x: 0, w: 50 }, gN3) !== null) throw new Error('ownerLane: sin solape con ningún carril → null');
// invasión pequeña (≤ snapGap) se IGNORA en el carril vecino (caso real de Ernesto 2026-07-14)
const inv10 = { id: 'inv', x: 410, y: 0, w: 320, h: 100 };   // propietario carril 1; invade 10px el cuerpo del 0
let cls = laneClassify([inv10], gN3, 0, 14);
if (cls.members.length || cls.obstacles.length) throw new Error('laneClassify: una invasión de ≤14px debe ignorarse (ni miembro ni obstáculo)');
// invasión mayor → obstáculo del vecino (sigue sin ser miembro)
const inv30 = { id: 'inv', x: 390, y: 0, w: 320, h: 100 };
cls = laneClassify([inv30], gN3, 0, 14);
if (cls.members.length || !cls.obstacles.find(o => o.id === 'inv')) throw new Error('laneClassify: una invasión >14px debe contar como obstáculo');
// el propietario lo tiene como MIEMBRO aunque sobresalga
cls = laneClassify([inv30], gN3, 1, 14);
if (!cls.members.find(o => o.id === 'inv') || cls.obstacles.length) throw new Error('laneClassify: el carril propietario debe tenerlo como miembro');
console.log('OK ownerLane + laneClassify N3 (propietario único, 1–14px ignorados, invasión mayor = obstáculo)');

// planLaneInsert: carril vacío → la ventana entra en pointerY, nadie se mueve
const lane = gN3.cols[0];
const iOpts = { gutter: 14, pad: 12, guides: gN3, laneIdx: 0 };
let r = planLaneInsert([], lane, 300, { h: 200 }, iOpts);
if (r.moved.length || !r.placed || r.placed.x !== 100 || r.placed.w !== 320) throw new Error('planLaneInsert: carril vacío no coloca la ventana con el ancho del carril');
// insertar ARRIBA de un miembro: ese miembro baja por debajo (reflow en cascada)
const m1 = { id: 'm1', x: 110, y: 60, w: 300, h: 200 };   // miembro del carril (propietario)
r = planLaneInsert([m1], lane, 40, { h: 180 }, iOpts);
if (!r.moved.find(x => x.id === 'm1')) throw new Error('planLaneInsert: insertar arriba no desplaza al miembro de abajo');
if (r.moved[0].y < r.placed.y + r.placed.h) throw new Error('planLaneInsert: el desplazado no queda por debajo de la ventana insertada');
// insertar DEBAJO del miembro (hueco libre): el miembro NO se mueve (solo lo imprescindible)
r = planLaneInsert([m1], lane, 600, { h: 180 }, iOpts);
if (r.moved.length) throw new Error('planLaneInsert: mover innecesariamente un miembro que ya tenía hueco');
// obstáculo que cruza el carril (propietario = el vecino, invade este de sobra): NO se mueve; la ventana salta por debajo
const wide = { id: 'W', x: 300, y: 50, w: 800, h: 150 };   // propietario carril 1; invade 120px el 0 → obstáculo fijo
r = planLaneInsert([wide], lane, 60, { h: 180 }, iOpts);
if (r.moved.find(x => x.id === 'W')) throw new Error('planLaneInsert: un obstáculo fijo (widget de otro carril) no debe moverse');
if (r.placed.y < wide.y + wide.h) throw new Error('planLaneInsert: la ventana no saltó por debajo del obstáculo fijo');
// reflow en cascada respeta el hueco existente entre dos miembros holgados
const a = { id: 'a', x: 110, y: 40, w: 300, h: 150 }, b = { id: 'b', x: 110, y: 700, w: 300, h: 150 };
r = planLaneInsert([a, b], lane, 60, { h: 120 }, iOpts);
if (r.moved.find(x => x.id === 'b')) throw new Error('planLaneInsert: empuja un miembro lejano que no hacía falta mover');
console.log('OK planLaneInsert (carril vacío, reflow hacia abajo, hueco respetado, obstáculo fijo esquivado)');

// --- N3: planSpaceRepack (Reordenar este escritorio) ---
eval('globalThis.planSpaceRepack = ' + pickFn('planSpaceRepack', 'rects, guides, opts'));
const prIn = [
  { id: 'a', x: 110, y: 40, w: 300, h: 150 },    // carril 0
  { id: 'c', x: 120, y: 400, w: 200, h: 100 },   // carril 0, debajo
  { id: 'b', x: 440, y: 10, w: 200, h: 200 },    // carril 1
  { id: 'm', x: 1200, y: 50, w: 100, h: 100 }    // margen sin solape → carril más cercano (1)
];
const pr = planSpaceRepack(prIn, gN3, { gutter: 14, laneTop: 24 });
const prBy = id => pr.placed.find(p => p.id === id);
if (prBy('a').x !== 100 || prBy('a').w !== 320 || prBy('a').y !== 24) throw new Error('planSpaceRepack: el primero del carril no adopta x/ancho de carril desde laneTop');
if (prBy('c').y !== 24 + 150 + 14) throw new Error('planSpaceRepack: el segundo no se apila con gutter (esperado 188, ' + prBy('c').y + ')');
if (prBy('b').x !== 434 || prBy('b').y !== 24) throw new Error('planSpaceRepack: el carril 1 no se apila independientemente');
if (prBy('m').x !== 434 || prBy('m').y !== 24 + 200 + 14) throw new Error('planSpaceRepack: un widget sin solape no cae al carril más cercano');
if (pr.maxBottom !== Math.max(188 + 100, 238 + 100)) throw new Error('planSpaceRepack: maxBottom incorrecto (' + pr.maxBottom + ')');
// orden estable: a igual y, decide x; a igual y+x, el índice original
const prTie = planSpaceRepack([
  { id: 'p', x: 200, y: 40, w: 100, h: 50 }, { id: 'q', x: 110, y: 40, w: 100, h: 50 }
], gN3, { gutter: 14, laneTop: 24 });
if (prTie.placed.find(p => p.id === 'q').y !== 24) throw new Error('planSpaceRepack: a igual y debe ir primero el de menor x');
console.log('OK planSpaceRepack (apilado por carril, x/ancho adoptados, huérfanos al más cercano, orden estable)');

// --- N3: ancho completo sin COL_MAX cuando el nº de columnas es explícito; Auto lo conserva ---
const gFull = columnGuides(3840, { forceN: 3 });
if (gFull.cols[0].x !== 12) throw new Error('columnGuides explícito: el primer carril debe empezar en pad');
const gFullEnd = gFull.cols[2].x + gFull.cols[2].w;
if (Math.abs(gFullEnd - (3840 - 12)) > 2) throw new Error('columnGuides explícito: la cuadrícula debe llegar al borde útil (acaba en ' + gFullEnd + ')');
if (gFull.cols.some(cc => cc.w <= 520)) throw new Error('columnGuides explícito: en 4K los carriles deben superar COL_MAX (ancho completo)');
console.log('OK columnGuides N3 (explícito = ancho útil completo; Auto conserva COL_MAX — test previo)');

// invariantes de fuente N3: reordenado explícito con guardas, undo atómico, capa ambiental propia
if (!src.includes('function repackSpace(')) throw new Error('regresión N3: falta repackSpace');
if (!src.includes('Reordenar este escritorio')) throw new Error('regresión N3: falta el botón «Reordenar este escritorio» en el popover');
if ((src.match(/repackSpace\(\)/g) || []).length !== 2) throw new Error('regresión N3: repackSpace debe tener UN único punto de invocación (el popover) — jamás automático');
if (!src.match(/function repackSpace[\s\S]{0,600}tagFilter/) || !src.match(/function repackSpace[\s\S]{0,800}some\(x => x\.max\)/)) throw new Error('regresión N3: repackSpace perdió las guardas de filtro/maximizada');
if (!src.match(/function undoRepack[\s\S]{0,700}sort\(\)\.join/)) throw new Error('regresión N3: undoRepack ya no valida el conjunto exacto de IDs (todo-o-nada)');
if (!src.match(/items\.length > 20\) apply\(\); else flipLayout/)) throw new Error('regresión N3: falta el umbral anti-jank de la animación del reordenado');
if (!src.includes('function renderLaneAmbient(') || !html.includes('#lane-ambient')) throw new Error('regresión N3: falta la capa ambiental #lane-ambient (CSS o render)');
if (!src.match(/const amb = document\.getElementById\("lane-ambient"\)/)) throw new Error('regresión N3: setDeskHeight ya no mantiene el alto de #lane-ambient');
if (!src.match(/laneClassify\(others, guides, destLane, LAYOUT\.snapGap\)/) || !src.match(/laneClassify\(others, guides, laneB, LAYOUT\.snapGap\)/)) throw new Error('regresión N3: el motor N2 no usa la clasificación de pertenencia única en drop/resize');
console.log('OK invariantes N3 (reordenado solo humano con guardas, undo todo-o-nada, ambient propia, pertenencia única cableada)');

// planMaxBottom + rechazo P4 (hallazgo Codex sobre v0.29.0): el drop se rechaza si el reflow sale del lienzo
eval('globalThis.planMaxBottom = ' + pickFn('planMaxBottom', 'placed, draggedH, movedRects'));
if (planMaxBottom({ x: 0, y: 100, w: 300 }, 200, []) !== 300) throw new Error('planMaxBottom: solo la ventana insertada');
if (planMaxBottom({ x: 0, y: 100, w: 300 }, 200, [{ y: 500, h: 400 }]) !== 900) throw new Error('planMaxBottom: debe tomar el miembro más bajo');
if (planMaxBottom({ x: 0, y: 11900, w: 300 }, 200, []) <= 12000) throw new Error('planMaxBottom: un plan que se sale debe superar worldMax');
if (!src.match(/if \(planMaxBottom\(placed, proj\.h, movedRects\) > LAYOUT\.worldMax\)/)) throw new Error('regresión P4: la transacción de carril ya no rechaza un reflow fuera del lienzo');
console.log('OK planMaxBottom + rechazo P4 (drop rechazado sin clamp si el reflow excede worldMax)');

// --- N2 hito 3: selección de carril con histéresis (pura) + invariantes de integración ---
eval('globalThis.pickLane = ' + pickFn('pickLane', 'guides, x, prev'));
const gg = columnGuides(1366);   // 4 carriles
// dentro del cuerpo de un carril entra a ese carril
if (pickLane(gg, gg.cols[2].x + 10, null) !== 2) throw new Error('pickLane: no entra al carril bajo el puntero');
// histéresis: estando en el carril 1, un puntero que apenas cruza al gutter NO cambia de carril
const midGutter = gg.cols[1].x + gg.cols[1].w + Math.floor(gg.gutter / 2);
if (pickLane(gg, midGutter, 1) !== 1) throw new Error('pickLane: pierde el carril actual dentro del gutter (histéresis rota)');
// pero al entrar de lleno en el cuerpo del vecino, sí cambia
if (pickLane(gg, gg.cols[2].x + 5, 1) !== 2) throw new Error('pickLane: no cambia al vecino al entrar en su cuerpo');
// fuera de la cuadrícula (margen izquierdo de 4K) → null (comportamiento N1)
const g4 = columnGuides(3840);
if (pickLane(g4, 20, null) !== null) throw new Error('pickLane: el margen exterior de 4K debería ser N1 (null)');
console.log('OK pickLane (entra al cuerpo, histéresis en el gutter, cambia al vecino, margen exterior = N1)');

// --- N2 pulido: alignedLane (activación por x+w) + planColumnCompact (compactación de origen) ---
eval('globalThis.alignedLane = ' + pickFn('alignedLane', 'rect, guides, tol'));
const gAl = columnGuides(1366);
const c1 = gAl.cols[1];
if (alignedLane({ x: c1.x, y: 40, w: c1.w }, gAl) !== 1) throw new Error('alignedLane: no reconoce un rect alineado al carril');
if (alignedLane({ x: c1.x + 1, y: 40, w: c1.w - 1 }, gAl) !== 1) throw new Error('alignedLane: la tolerancia de redondeo (2px) debería aceptar');
// un widget colocado a mano que solo SOLAPA mayoritariamente el carril pero no coincide en x/w → null
if (alignedLane({ x: c1.x + 40, y: 40, w: c1.w }, gAl) !== null) throw new Error('alignedLane: un widget desalineado (solo solapa) no debe contar como columna');
if (alignedLane({ x: c1.x, y: 40, w: c1.w + 60 }, gAl) !== null) throw new Error('alignedLane: distinto ancho no debe contar como columna');
console.log('OK alignedLane (activa solo con x+w coincidentes, tolerancia de redondeo, ignora los solo-solapan)');

eval('globalThis.planColumnCompact = ' + pickFn('planColumnCompact', 'members, obstacles, holeTop, above, opts'));
// hueco en medio: los de debajo suben a cerrarlo; los de encima no se tocan
const cm = planColumnCompact(
  [{ id: 'top', y: 12, h: 150 }, { id: 'mid', y: 500, h: 150 }, { id: 'low', y: 700, h: 150 }],
  [], 400, 162, { gutter: 14, laneTop: 12 });
if (cm.moved.find(m => m.id === 'top')) throw new Error('planColumnCompact: no debe mover un miembro por ENCIMA del hueco');
const midMv = cm.moved.find(m => m.id === 'mid');
if (!midMv || midMv.y !== 176) throw new Error('planColumnCompact: el primer miembro bajo el hueco no sube a cerrar el gap (esperado 176, ' + (midMv && midMv.y) + ')');
// sin hueco real (ya compactado) → nadie se mueve
const cm2 = planColumnCompact([{ id: 'a', y: 12, h: 150 }, { id: 'b', y: 176, h: 150 }], [], 176, 162, { gutter: 14, laneTop: 12 });
if (cm2.moved.length) throw new Error('planColumnCompact: no debe mover si ya está compactado');
// nunca baja un miembro (solo hacia arriba)
const cm3 = planColumnCompact([{ id: 'x', y: 300, h: 100 }], [], 250, 500, { gutter: 14, laneTop: 12 });
if (cm3.moved.length) throw new Error('planColumnCompact: no debe BAJAR un miembro (solo compacta hacia arriba)');
console.log('OK planColumnCompact (sube los de debajo del hueco, respeta los de encima, no baja, no toca lo ya compacto)');

// planLaneRepack (mismo carril) + planResizeReflow (§B)
eval('globalThis.planLaneRepack = ' + pickFn('planLaneRepack', 'members, obstacles, insert, opts'));
const rp = planLaneRepack([{ id: 'a', y: 12, h: 150 }, { id: 'b', y: 800, h: 150 }], [], { y: 200, h: 120 }, { gutter: 14, laneTop: 12, laneX: 100, laneW: 320 });
if (!rp.placed || rp.placed.x !== 100 || rp.placed.w !== 320) throw new Error('planLaneRepack: no coloca el insertado con el ancho del carril');
if (rp.placed.y !== 176) throw new Error('planLaneRepack: el insertado no se empaqueta tras el primero (esperado 176, ' + rp.placed.y + ')');
if (!rp.moved.find(m => m.id === 'b')) throw new Error('planLaneRepack: no compacta el miembro lejano hacia arriba');
eval('globalThis.planResizeReflow = ' + pickFn('planResizeReflow', 'members, obstacles, anchor, opts'));
// el ancla crece y empuja al de debajo que colisiona
const rr = planResizeReflow([{ id: 'lo', y: 300, h: 150 }], [], { y: 40, h: 320 }, { gutter: 14 });
if (!rr.moved.find(m => m.id === 'lo') || rr.moved[0].y !== 374) throw new Error('planResizeReflow: el de abajo no baja al crecer el ancla (esperado 374, ' + (rr.moved[0] && rr.moved[0].y) + ')');
// si hay hueco de sobra, no se mueve nadie
const rr2 = planResizeReflow([{ id: 'lo', y: 800, h: 150 }], [], { y: 40, h: 200 }, { gutter: 14 });
if (rr2.moved.length) throw new Error('planResizeReflow: mueve un miembro que no colisionaba');
console.log('OK planLaneRepack + planResizeReflow (reempaquetado de columna, empuje al crecer, respeta huecos)');

// columnGuides override configurable (§columnas-configurables): effectiveN = auto ? autoFit : min(requestedN, autoFit)
if (columnGuides(1366, { forceN: 2 }).n !== 2) throw new Error('columnGuides: forceN=2 debería dar 2 carriles');
if (columnGuides(1366, { forceN: 3 }).n !== 3) throw new Error('columnGuides: forceN=3 debería dar 3 carriles');
if (columnGuides(800, { forceN: 4 }).n !== 2) throw new Error('columnGuides: forceN=4 en 800px se recorta a lo que cabe (2)');
if (columnGuides(1366, { forceN: 9 }).n !== 4) throw new Error('columnGuides: forceN inválido → auto (4 en 1366)');
console.log('OK columnGuides override (forceN respeta el clamp por viewport, inválido → auto)');

// invariantes de fuente de la integración:
if (!src.includes('const useLanes = !m.altKey && !overTab && !tagFilter')) throw new Error('regresión: los carriles ya no se desactivan con Alt/pestaña/filtro de etiqueta');
if (!src.match(/laneRes = planLaneInsert\(others, lane/)) throw new Error('regresión: el arrastre ya no calcula el reflow del carril');
if (!src.includes('function undoLayout(')) throw new Error('regresión: falta el Deshacer de la transacción de carril');
if (!src.includes('if (sameRect(rectSnap(wg), it.after))')) throw new Error('regresión: el Deshacer ya no verifica el rect completo antes de restaurar (pisaría una sync remota)');
if (!src.match(/wg\.x = it\.before\.x; wg\.y = it\.before\.y; wg\.w = it\.before\.w; wg\.h = it\.before\.h/)) throw new Error('regresión: el Deshacer no restaura la geometría completa x/y/w/h');
if (!src.match(/w\.x = placed\.x; w\.y = placed\.y; w\.w = placed\.w; w\.z = \+\+zTop/)) throw new Error('regresión: la transacción de carril ya no incluye ancho de carril + z-order (riesgo 1 del gate)');
if (!src.includes('!x.max &&')) throw new Error('regresión: los maximizados ya no se excluyen del reflow de carril');
if (!html.includes('.lane-band') || !html.includes('reflow-hint')) throw new Error('regresión: falta el CSS de bandas de carril o de la pista de reflow');
console.log('OK integración de carriles (useLanes, reflow en drag, Deshacer que verifica, transacción con ancho+z-order, maximizados fuera, CSS)');

// --- N2 pulido v0.31.0: integración (compactación, resize-reflow, FLIP, columnas configurables) ---
if (!src.includes('const originLane = alignedLane(startRect, guides)')) throw new Error('regresión: el drop ya no detecta la columna de origen para compactar');
if (!src.match(/originLane !== null && originLane === destLane/)) throw new Error('regresión: falta el plan único para el mismo carril (planLaneRepack)');
if (!src.includes('planColumnCompact(oc.members, oc.obstacles, startRect.y, above, copt)')) throw new Error('regresión: el drop cruzando columnas ya no compacta el origen');
if (!src.includes('flipLayout(items,')) throw new Error('regresión: el drop ya no usa la animación FLIP');
if (!src.includes('function flipLayout(') || !src.includes('prefers-reduced-motion: reduce')) throw new Error('regresión: FLIP sin respetar reduced-motion');
if (!src.includes('planResizeReflow(cls.members, cls.obstacles')) throw new Error('regresión: el resize ya no dispara reflow de su columna');
if (!src.match(/w\.h > beforeSnap\.h && laneA !== null && laneA === laneB/)) throw new Error('regresión: el resize-reflow ya no exige crecer en alto y misma alineación antes/después');
if (!src.includes('function colsOpt(') || !src.match(/sp\.settings\.cols !== 2 && sp\.settings\.cols !== 3 && sp\.settings\.cols !== 4/)) throw new Error('regresión: columnas configurables sin saneo estricto');
if (!src.includes('if (isMobile()){ b.style.display = "none"')) throw new Error('regresión: el control de columnas no se oculta en móvil');
console.log('OK pulido v0.31.0 (compactación origen/mismo-carril, resize-reflow con guardas, FLIP reduced-motion, columnas configurables saneadas + móvil)');

// --- v0.30.0: sistema de modales propio + 3 fixes (invariantes de fuente) ---
// ningún diálogo NATIVO debe quedar (confirm/prompt feos e incoherentes)
if (/[^a-zA-Z.]confirm\s*\(/.test(src)) throw new Error('regresión: vuelve un confirm() nativo (usar dlgConfirm)');
if (/[^a-zA-Z.]prompt\s*\(/.test(src)) throw new Error('regresión: vuelve un prompt() nativo (usar dlgPrompt)');
if (!src.includes('function siteDialog(') || !src.includes('function dlgConfirm(') || !src.includes('function dlgPrompt(')) throw new Error('regresión: falta el sistema de modales propio');
if (!html.includes('.dlg-panel') || !html.includes('.dlg-inp')) throw new Error('regresión: falta el CSS del diálogo propio');
// bug maximizada+arrastre: arrastrar una maximizada la restaura
if (!src.includes('const p = w.max; delete w.max;') || !src.match(/dragging = true;[\s\S]{0,120}if \(w\.max\)/)) throw new Error('regresión: arrastrar una maximizada ya no la restaura al iniciar el arrastre');
// bug edición larga: el editor de tarea es un textarea que crece, no un input de una línea
if (!src.includes('createElement("textarea")') || !src.match(/input\.style\.height = input\.scrollHeight/)) throw new Error('regresión: el editor de tarea vuelve a ser de una sola línea');
console.log('OK v0.30.0 (modales propios sin confirm/prompt nativos, maximizada se restaura al arrastrar, edición de tarea multilínea)');

// --- gradientAvgHex: acento de pestaña calculado del degradado de fondo (sin canvas, barato) ---
eval('globalThis.gradientAvgHex = ' + pickFn('gradientAvgHex', 'css'));
if (gradientAvgHex('linear-gradient(135deg,#1b2735 0%,#090a0f 100%)') !== '#121922') throw new Error('gradientAvgHex: promedio de dos tonos incorrecto');
if (gradientAvgHex('linear-gradient(135deg,#000000 0%,#ffffff 50%,#000000 100%)') !== '#555555') throw new Error('gradientAvgHex: promedio de tres tonos incorrecto');
if (gradientAvgHex('url("foo.jpg") center/cover no-repeat, #10131a') !== '#10131a') throw new Error('gradientAvgHex: un único tono debe devolverse tal cual');
if (gradientAvgHex('') !== null) throw new Error('gradientAvgHex: cadena vacía debe ser null');
if (gradientAvgHex(null) !== null) throw new Error('gradientAvgHex: entrada no-string debe ser null');
console.log('OK gradientAvgHex (acento de pestaña = promedio de los tonos del degradado)');

// --- wpScrim: velo adaptativo del fondo según luminancia media (v0.32.0) ---
eval('globalThis.wpScrim = ' + pickFn('wpScrim', 'css'));
if (wpScrim('linear-gradient(135deg,#1b2735 0%,#090a0f 100%)') !== 0.18) throw new Error('wpScrim: fondo oscuro debe llevar el velo base .18');
if (wpScrim('linear-gradient(135deg,#3e5151 0%,#decba4 100%)') !== 0.26) throw new Error('wpScrim: fondo medio debe llevar velo .26');
if (wpScrim('#ffffff') !== 0.34) throw new Error('wpScrim: fondo claro debe llevar el velo máximo .34');
if (wpScrim('url("foo.jpg") center/cover') !== 0.18) throw new Error('wpScrim: sin tono calculable debe caer al velo por defecto');
// los presets ampliados: solo se añade al final (índices guardados en datos.json) y el picker los pinta todos
const wpArr = src.match(/const WP_PRESETS = \[([\s\S]*?)\];/)[1].match(/"(linear-gradient[^"]*|#[0-9a-fA-F]{6})"/g);
if (!wpArr || wpArr.length < 14) throw new Error('WP_PRESETS: la colección ampliada debe tener al menos 14 fondos');
if (!wpArr[0].includes('#1b2735') || !wpArr[5].includes('#134e5e')) throw new Error('WP_PRESETS: los 6 fondos originales deben conservar su índice (datos.json guarda el índice)');
if (!src.includes('--wp-scrim')) throw new Error('regresión: el velo del fondo ya no es adaptativo (falta --wp-scrim)');
console.log('OK wpScrim (velo adaptativo por luminancia; presets ampliados sin romper índices)');

// --- cabecera ⓘ también en Tareas (v0.32.0): misma mecánica que en Nota ---
if (!src.match(/w\.type === "notes" \|\| w\.type === "todo"\) \? `<button class="win-btn descbtn"/)) throw new Error('regresión: el botón ⓘ debe ofrecerse en Nota y en Tareas');
if (!src.match(/function bodyTodo[\s\S]{0,400}notes-desc/)) throw new Error('regresión: bodyTodo debe pintar la cabecera opcional (notes-desc)');
console.log('OK cabecera ⓘ en Tareas (botón + render en bodyTodo)');

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
eval('globalThis.parseCapture = ' + pickFn('parseCapture', 'line, now, customIds'));
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
// dominio pelado sin esquema → enlace https:// (fix del bug «enlaces desde Ctrl+K no aparecen»)
eq(parseCapture('ejemplo.com', NOW), { kind: 'link', url: 'https://ejemplo.com', title: '' }, 'dominio pelado → https://');
eq(parseCapture('www.hospital.org/citas', NOW), { kind: 'link', url: 'https://www.hospital.org/citas', title: '' }, 'dominio con subdominio y ruta');
if (parseCapture('a.b', NOW) !== null) throw new Error('TLD de 1 letra no debe ser enlace');
if (parseCapture('hola mundo.com', NOW) !== null) throw new Error('con espacios no es dominio pelado');
if (parseCapture('correo@dominio.com', NOW) !== null) throw new Error('un email (@) no debe ser enlace');

// marcas de calendario (estricto: fecha inválida o concepto no canónico → null)
eq(parseCapture('v 12-16/8', NOW), { kind: 'mark', start: '2026-08-12', end: '2026-08-16', type: 'vacaciones' }, 'rango vacaciones por defecto');
eq(parseCapture('v 12/8 guardia', NOW), { kind: 'mark', start: '2026-08-12', end: '2026-08-12', type: 'guardia' }, 'un día con concepto');
eq(parseCapture('v 12-16/8/2027', NOW), { kind: 'mark', start: '2027-08-12', end: '2027-08-16', type: 'vacaciones' }, 'rango con año explícito');
eq(parseCapture('v 16-12/8', NOW), { kind: 'mark', start: '2026-08-12', end: '2026-08-16', type: 'vacaciones' }, 'rango invertido se normaliza');
eq(parseCapture('v 1-2/9 formación', NOW), { kind: 'mark', start: '2026-09-01', end: '2026-09-02', type: 'formacion' }, 'concepto con tilde → clave canónica');
if (parseCapture('v 12-16/8 inventado', NOW) !== null) throw new Error('concepto no canónico debe ser null');
// conceptos propios: valen si el usuario los tiene creados (comparación por slug), estricto si no
eq(parseCapture('v 12/8 avisos', NOW, ['avisos']), { kind: 'mark', start: '2026-08-12', end: '2026-08-12', type: 'avisos' }, 'concepto propio existente');
eq(parseCapture('v 12/8 Avisos', NOW, ['avisos']), { kind: 'mark', start: '2026-08-12', end: '2026-08-12', type: 'avisos' }, 'concepto propio con mayúscula → slug');
eq(parseCapture('v 12/8 día-libre', NOW, ['dia_libre']), { kind: 'mark', start: '2026-08-12', end: '2026-08-12', type: 'dia_libre' }, 'concepto propio con tilde y guion → slug');
if (parseCapture('v 12/8 avisos', NOW) !== null) throw new Error('concepto propio sin lista debe ser null');
if (parseCapture('v 12/8 avisos', NOW, ['otro_concepto']) !== null) throw new Error('concepto propio ajeno a la lista debe ser null');
eq(parseCapture('v 12/8 guardia', NOW, ['avisos']), { kind: 'mark', start: '2026-08-12', end: '2026-08-12', type: 'guardia' }, 'canónico sigue ganando con lista presente');
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

// --- escrituras fantasma: los cambios automáticos no programan guardado FS ---
// (spec escrituras-fantasma, veredicto Codex 2026-07-09: abrir Cabecera jamás escribe)
eval('globalThis.markAuto = ' + pickFn('markAuto', ''));
let dirtyCalls = 0;
globalThis.markDirty = () => dirtyCalls++;
globalThis.renderTaskChip = () => {};
globalThis.backend = 'fs';
markAuto();
if (dirtyCalls !== 0) throw new Error('markAuto en modo sincronizado NO debe programar guardado');
globalThis.backend = 'local';
markAuto();
if (dirtyCalls !== 1) throw new Error('markAuto en modo local debe delegar en markDirty');
// invariantes de fuente contra regresiones de los callsites auditados
if (src.includes('if (touched) markDirty')) throw new Error('regresión: el resize automático vuelve a persistir');
if (!/if \(changed\) markAuto\(\);/.test(src)) throw new Error('regresión: checkTaskAlerts ya no usa markAuto');
if (!src.includes('freshPending')) throw new Error('falta el guardián de frescura tras segundo plano');
console.log('OK escrituras fantasma (markAuto por backend, resize sin persistir, alertas a caballito, guardián de frescura presente)');

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

// --- linkifyEsc: URLs clicables en tareas, sin abrir la puerta a HTML ---
eval('globalThis.linkifyEsc = ' + pickFn('linkifyEsc', 't'));
const lk = linkifyEsc('descargar https://www.who.int/x?a=1&b=2 ya');
if (!lk.includes('<a href="https://www.who.int/x?a=1&amp;b=2"')) throw new Error('linkify: URL no enlazada o & sin escapar');
if (!lk.includes('target="_blank"') || !lk.includes('rel="noopener"')) throw new Error('linkify: faltan atributos de seguridad');
if (linkifyEsc('<b>x</b> y https://a.io').includes('<b>')) throw new Error('linkify: HTML del texto sin escapar');
const lk2 = linkifyEsc('mira (https://a.io/p).');
if (!lk2.includes('href="https://a.io/p"') || !lk2.includes('</a>).')) throw new Error('linkify: puntuación colgante dentro del enlace');
const lk3 = linkifyEsc('ver <https://a.io>');
if (!lk3.includes('</a>&gt;')) throw new Error('linkify: entidad &gt; final partida o dentro del enlace');
if (linkifyEsc('sin urls aqui') !== 'sin urls aqui') throw new Error('linkify: texto sin URL alterado');
if (linkifyEsc('javascript:alert(1)').includes('<a')) throw new Error('linkify: esquema no-http enlazado');
console.log('OK linkifyEsc (URLs http/https, escape previo, puntuación fuera)');

// --- invariantes de fuente: sonido de avisos y conceptos propios ---
// El aviso que salta sin gesto del usuario se ENCOLA (autoplay) y suena al primer clic/tecla.
if (!src.includes('pendingAlertSound = kind')) throw new Error('regresión: aviso sin gesto ya no se encola');
if (!src.includes('addEventListener("pointerdown", unlockAlertSound')) throw new Error('regresión: falta el desbloqueo de audio por gesto');
// Conceptos de calendario propios: saneo, validTypes dinámico y color por variable CSS.
if (!src.includes('s.customMarkTypes = (Array.isArray(s.customMarkTypes)')) throw new Error('regresión: customMarkTypes sin sanear');
if (!src.includes('.concat((s.customMarkTypes || []).map(c => c.id))')) throw new Error('regresión: validTypes ya no acepta conceptos propios');
if (!src.includes('mark-custom')) throw new Error('regresión: falta la clase mark-custom para el color propio');
// Edición de tarea ya no trunca a 300; Archivos persiste dirección de orden.
if (src.includes('it.t = v.slice(0, 300)')) throw new Error('regresión: la edición de tarea vuelve a truncar a 300');
if (!src.includes('w.data.sortDir')) throw new Error('regresión: Archivos perdió la dirección de orden');
// Listas nombradas en paleta: el destino viaja por IDs y se resuelve al hacer clic,
// nunca como objeto capturado (quedaría huérfano si entra un sync remoto — hallazgo Codex)
if (!src.includes('extras.push({ wId:')) throw new Error('regresión: la paleta vuelve a capturar el objeto widget como destino');
if (!src.includes('s.id === x.spId')) throw new Error('regresión: el destino de lista nombrada ya no se resuelve en el clic');
// Clic de tarea completada: suena solo al marcar (nunca al desmarcar) y la paleta/bandeja
// pasan los conceptos propios a la gramática v.
if (!src.includes('if (it.done) playDoneClick();')) throw new Error('regresión: falta el clic al completar tarea');
if (!src.includes('function playDoneClick()')) throw new Error('regresión: falta playDoneClick');
// Todos los sonidos usan UN AudioContext compartido que nunca se cierra: crear/cerrar uno por
// sonido dejaba mudos los tonos cortos cuando el dispositivo de audio tardaba en abrirse.
if (!src.includes('function audioCtx()')) throw new Error('regresión: falta el AudioContext compartido (audioCtx)');
if (src.includes('setTimeout(() => ac.close()')) throw new Error('regresión: un sonido vuelve a cerrar su AudioContext');
if ((src.match(/new (?:AC|\(window\.AudioContext)/g) || []).length > 1) throw new Error('regresión: se crea más de un AudioContext fuera de audioCtx');
if ((src.match(/parseCapture\((?:q|line), new Date\(\), customMarkIds\(\)\)/g) || []).length < 3) throw new Error('regresión: algún caller de parseCapture no pasa los conceptos propios');
console.log('OK invariantes (audio encolado, conceptos propios saneados, sin tope de 300, sortDir presente, destino por IDs, clic de hecho, conceptos propios en gramática)');

// --- Invariantes de layout guiado v1 (spec v1.1, veredicto Codex) ---
if (!src.includes('const LAYOUT = {')) throw new Error('regresión: falta el inventario LAYOUT (N0)');
// el drag es transacción local: durante el move NO se muta estado persistible (Codex H1)
if (src.includes('w.x = proj.x; w.y = proj.y;   // solo posición')) throw new Error('regresión: el drag vuelve a mutar estado al arrancar');
if (!src.includes('el estado no se toca hasta soltar')) throw new Error('regresión: el drag perdió la transacción local');
if (!html.includes('.drop-ghost{position:absolute; pointer-events:none')) throw new Error('regresión: la sombra intercepta eventos (rompería el drop en pestañas)');
if (!src.includes('addEventListener("pointercancel", cancel); addEventListener("blur", cancel)')) throw new Error('regresión: falta la limpieza en cancelación/pérdida de foco');
if (!html.includes('prefers-reduced-motion: no-preference')) throw new Error('regresión: el asentamiento ignora reduced-motion');
// el imán solo apunta a destinos visibles (filtro de etiqueta — Codex H6)
if (!src.match(/dragRects = planViewportLayout\(state\.widgets\.filter\(x =>\s*x\.id !== w\.id && !\(tagFilter/)) throw new Error('regresión: el imán vuelve a encajar contra ventanas ocultas');
// el saneo NO cambia con N0 (Codex H5): el suelo 140 es solo visual/planificación
if (!src.includes('h: w.collapsed ? LAYOUT.collapsedH : Math.max(+w.h || t.h || 180, LAYOUT.minH)')) throw new Error('regresión: widgetRect perdió el suelo visual');
console.log('OK invariantes layout guiado (LAYOUT, transacción de drag, sombra inerte, limpieza, destinos visibles, saneo intacto)');

// --- privacidad escénica (spec 0b): priv boolean estricto + fugas cubiertas ---
if (sanitizeWidgetShape({ type: 'notes', priv: true }).priv !== true) throw new Error('priv=true no se preserva');
for (const bad of ['yes', 1, 'true', {}, [], 0, null])
  if (sanitizeWidgetShape({ type: 'notes', priv: bad }).priv !== undefined) throw new Error('priv no-boolean debe descartarse: ' + JSON.stringify(bad));
if (sanitizeWidgetShape({ type: 'notes' }).priv !== undefined) throw new Error('priv ausente debe seguir ausente');
// el modo vive por dispositivo, nunca en el estado sincronizado
if (!src.includes('localStorage.getItem("cabecera-privacy")')) throw new Error('regresión: el modo privacidad ya no es por dispositivo');
if (src.includes('state.privacyOn') || src.includes('privacyOn: ')) throw new Error('regresión: privacyOn no debe viajar en datos.json');
// fugas cubiertas: paleta (widgets enteros), etiquetas, toast de aviso, desmarcado en directo
if (!src.includes('if (privacyOn && w.priv) continue;')) throw new Error('regresión: la paleta vuelve a listar widgets privados');
if (!src.match(/allTags\(\)\{[\s\S]{0,200}privacyOn && w\.priv/)) throw new Error('regresión: allTags expone etiquetas de widgets privados');
if (!src.includes('Aviso en un widget privado')) throw new Error('regresión: el toast de aviso revela texto de tarea privada');
if (!src.includes('Desactiva el modo privacidad para cambiar marcas')) throw new Error('regresión: se puede desmarcar en directo');
// las 4 fugas P1 del veredicto Codex (2026-07-10) no deben reabrirse:
if (!src.includes('? "Nota privada"')) throw new Error('regresión P1: el Dictado vuelve a revelar el título de la nota destino');
if (!src.includes('&& !(privacyOn && x.priv))')) throw new Error('regresión P1: la paleta vuelve a ofrecer listas privadas como destino de tarea');
if (!src.match(/function setPrivacy\(on\)\{[\s\S]{0,900}tagFilter = null/)) throw new Error('regresión P1: activar privacidad ya no limpia el filtro de etiqueta');
if (!src.match(/function setPrivacy\(on\)\{[\s\S]{0,900}renderResults\(/)) throw new Error('regresión P1: activar privacidad ya no recalcula la paleta abierta');
console.log('OK privacidad escénica (priv estricto en saneo, modo por dispositivo, paleta/etiquetas/toasts cubiertos, desmarcado bloqueado, 4 fugas P1 cerradas)');

// --- Aviso de versión nueva (spec-aviso-version v1.1, tests exigidos por el gate de Codex) ---
eval('globalThis.semverGt = ' + pickFn('semverGt', 'a, b'));
// comparación semver ESTRICTA: tabla entrada → salida (malformadas = false, silencio)
const SEMVER_CASES = [
  ['0.28.1', '0.28.0', true],  ['0.29.0', '0.28.9', true],  ['1.0.0', '0.99.99', true],
  ['0.28.0', '0.28.0', false], ['0.27.9', '0.28.0', false], ['0.28.0', '0.28.1', false],
  ['0.28', '0.28.0', false],   ['v0.29.0', '0.28.0', false], ['abc', '0.28.0', false],
  ['0.29.0', 'abc', false],    ['', '0.28.0', false],        [null, '0.28.0', false],
  [' 0.29.0 ', '0.28.0', true] // espacios alrededor se toleran (trim), el formato no se relaja
];
for (const [a, b, want] of SEMVER_CASES)
  if (semverGt(a, b) !== want) throw new Error(`semverGt(${JSON.stringify(a)}, ${JSON.stringify(b)}) debería ser ${want}`);
// antideriva TRIPLE: APP_VERSION === version.txt === primera versión del CHANGELOG.
// (La suite local y la CI DETECTAN la deriva; el gate real es correr esto antes del push.)
const appVer = (src.match(/const APP_VERSION = "([^"]+)"/) || [])[1];
const txtVer = fs.readFileSync(path.join(__dirname, '..', 'version.txt'), 'utf8').trim();
const chVer = (fs.readFileSync(path.join(__dirname, '..', 'CHANGELOG.md'), 'utf8').match(/^## \[(\d+\.\d+\.\d+)\]/m) || [])[1];
if (!appVer || appVer !== txtVer || appVer !== chVer)
  throw new Error(`deriva de versión: APP_VERSION=${appVer} version.txt=${txtVer} CHANGELOG=${chVer}`);
// invariantes de fuente del aviso:
if (!src.match(/if \(location\.protocol === "file:" \|\| newVersionDetected \|\| verCheckInflight\) return/))
  throw new Error('regresión: checkVersion permite consultas concurrentes, en file: o tras detectar');
if (!src.includes('fetch("version.txt", { cache: "no-store" })')) throw new Error('regresión: el chequeo ya no usa no-store (y no debe llevar query de cache-bust)');
if (src.includes('version.txt?')) throw new Error('regresión: cache-bust por query (descartado por el gate: la CDN lo ignora)');
if (!src.match(/vn-go"\)\.addEventListener\("click", \(\) => \{\s*\n[^\n]*\n\s*[^\n]*\n\s*if \(dirty \|\| saving \|\| conflictPending\)/))
  throw new Error('regresión: Recargar perdió el re-chequeo atómico previo a location.reload()');
if (!src.match(/const show = newVersionDetected && !verDismissed && !conflictPending/))
  throw new Error('regresión: el aviso ya no se oculta con la barra de conflicto');
if (!src.match(/renderVersionNotice\(\);\s*\/\/ choke-point/)) throw new Error('regresión: syncUI ya no repinta el aviso (conflicto/guardado no lo actualizarían)');
// carrera real cazada en el smoke: el syncUI de saveNow corre con saving=true; el repintado
// del aviso debe llegar cuando saving termina de verdad (finally), o Recargar queda bloqueado
if (!src.match(/saving = false;\s*\n\s*renderVersionNotice\(\)/)) throw new Error('regresión: el aviso no se repinta al terminar el guardado (Recargar quedaría bloqueado)');
// el bloque completo del aviso (de APP_VERSION al final de startVersionChecks) no debe tocar
// almacenamiento persistente: descarte y detección viven SOLO en memoria de la sesión
const verBlock = (src.match(/const APP_VERSION[\s\S]*?function startVersionChecks\(\)\{[\s\S]*?\n\}/) || [''])[0];
if (!verBlock) throw new Error('regresión: no encuentro el bloque del aviso de versión');
if (/localStorage|idbSet|sessionStorage/.test(verBlock)) throw new Error('regresión: el aviso de versión persiste estado (debe ser solo memoria de sesión)');
if (src.match(/#ver-notice[^\n]*setTimeout|id = "ver-notice";[\s\S]{0,600}setTimeout\(\(\) => el\.remove/)) throw new Error('regresión: el aviso de versión se auto-retira (debe ser persistente)');
console.log('OK aviso de versión (semver estricta, antideriva triple, sin concurrencia, bloqueo atómico de Recargar, estado con conflicto, descarte solo en memoria)');

// --- Conceptos propios: «Tus conceptos» primero y chip clicable (v0.28.0) ---
const mtoBody = pickFn('markTypeOptions', 'selected = "vacaciones"');
if (!/return \(customs\.length \? `<optgroup label="Tus conceptos">/.test(mtoBody))
  throw new Error('regresión: «Tus conceptos» ya no va primero en el desplegable de Tipo');
if (!src.includes('querySelectorAll(".mc-pick")')) throw new Error('regresión: los chips de concepto ya no son clicables');
if (!src.match(/mc-pick[\s\S]{0,200}closest\(".rmc"\)\) return/)) throw new Error('regresión: el clic del chip ya no respeta la ✕ de borrado');
console.log('OK conceptos propios (grupo primero en el desplegable, chip clicable con ✕ intacta)');

console.log('\nTODO EN VERDE');
