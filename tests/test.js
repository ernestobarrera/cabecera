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
