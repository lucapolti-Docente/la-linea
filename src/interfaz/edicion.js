/* Armar la línea con el puntero: dibujar cinta arrastrando, girarla tocándola, ubicar estaciones,
   borrar, y el selector de lados que aparece al tocar una estación. */
import { $, ui } from './dom.js';
import { G, W, H } from '../motor/estado.js';
import { tileAt, eachTile } from '../motor/partida.js';
import { STATIONS } from '../datos/estaciones.js';
import { TX } from '../datos/textos.js';
import { fmt } from '../datos/mensajes.js';
import { station } from '../generadores/comun.js';
import { paintIcon } from '../dibujo/util.js';
import { drawStation } from '../dibujo/estaciones.js';
import { toast } from './juego.js';

const J = TX.juego, P = TX.lados;
let canvas;

function cellFrom(e) {
  const r = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - r.left) / (r.width / W)), y = Math.floor((e.clientY - r.top) / (r.height / H));
  return x >= 0 && y >= 0 && x < W && y < H ? { x, y } : null;
}
function dirFrom(a, b) { return b.x > a.x ? 0 : b.x < a.x ? 2 : b.y > a.y ? 1 : 3; }
function removeItemsAt(x, y) { G.items = G.items.filter(i => !(i.x === x && i.y === y)); }
function erase(c) {
  const t = tileAt(c.x, c.y); if (!t) return;
  if (t.t === 'belt' && !t.locked) { G.grid[c.y][c.x] = null; removeItemsAt(c.x, c.y); }
  else if (t.t === 'station' && !t.fixed) { G.grid[c.y][c.x] = null; if (ui.pick && ui.pick.x === c.x && ui.pick.y === c.y) closePick(); }
  else if (ui.drag && !ui.drag.moved) toast(J.fija, 'warn');
}
function paintStep(a, b) {
  const d = dirFrom(a, b), ta = tileAt(a.x, a.y);
  if (ta && ta.t === 'belt' && !ta.locked) ta.dir = d;
  const tb = tileAt(b.x, b.y);
  if (!tb) G.grid[b.y][b.x] = { t: 'belt', dir: d };
}

function pointerDown(e) {
  if (!G || G.done) return; const c = cellFrom(e); if (!c) return;
  if (ui.pick && (ui.pick.x !== c.x || ui.pick.y !== c.y)) closePick();
  canvas.setPointerCapture(e.pointerId);
  const t = tileAt(c.x, c.y), tool = ui.tool;
  ui.drag = { last: c, start: c, moved: false, startTile: t };
  if (tool === 'borrar') { erase(c); return; }
  if (tool.startsWith('st:')) {
    const k = tool.slice(3);
    if (!t && c.y === G.pasillo) { toast(J.pasillo, 'warn'); return; }
    if (!t && G.L.maxSt) { let n = 0; eachTile(q => { if (q.t === 'station' && !q.fixed) n++; }); if (n >= G.L.maxSt) { toast(fmt(J.maxEstaciones, { n: G.L.maxSt }), 'warn'); return; } }
    if (!t) { G.grid[c.y][c.x] = station(k, 0, false); ui.drag.placed = true; openPick(c.x, c.y); }
    else if (t.t === 'station' && !t.fixed) { ui.drag.placed = true; openPick(c.x, c.y); }
    return;
  }
  if (tool === 'cinta' && !t) { G.grid[c.y][c.x] = { t: 'belt', dir: 0 }; ui.drag.placed = true; }
}
function pointerMove(e) {
  if (!G) return; const c = cellFrom(e); ui.hover = c;
  const drag = ui.drag;
  if (!drag || !c || G.done) return;
  if (c.x === drag.last.x && c.y === drag.last.y) return;
  if (ui.tool === 'borrar') { drag.moved = true; drag.last = c; erase(c); return; }
  if (ui.tool !== 'cinta') return;
  let last = drag.last;
  while (last.x !== c.x || last.y !== c.y) {
    const nx = last.x !== c.x ? last.x + Math.sign(c.x - last.x) : last.x, ny = last.x !== c.x ? last.y : last.y + Math.sign(c.y - last.y);
    const nxt = { x: nx, y: ny }; paintStep(last, nxt); last = nxt;
  }
  drag.last = c; drag.moved = true;
}
function endDrag() {
  const drag = ui.drag;
  if (!drag || !G) return;
  const t = drag.startTile;
  if (!drag.moved && !drag.placed && t && ui.tool !== 'borrar') {
    if (t.t === 'belt' && !t.locked) { t.dir = (t.dir + 1) % 4; }
    else if (t.t === 'station' && !t.fixed) { openPick(drag.start.x, drag.start.y); }
    else if (t.t === 'belt' && t.locked) toast(J.cintaArmada, 'warn');
    else if (t.t === 'station' && t.fixed && (STATIONS[t.type].thr || STATIONS[t.type].timer)) openPick(drag.start.x, drag.start.y);
    else if (t.t === 'station' && t.fixed) toast(J.estacionFija, 'warn');
  }
  ui.drag = null;
}

/* ---------- elegir lados ---------- */
const SIDE_POS = [[2, 1], [1, 2], [0, 1], [1, 0]]; // dir -> [col,row] en grilla 3x3
function openPick(x, y) {
  const t = tileAt(x, y); if (!t || t.t !== 'station') return; if (t.fixed && !(STATIONS[t.type].thr || STATIONS[t.type].timer)) return;
  ui.pick = { x, y, mode: 'yes' };
  const el = $('#pick'); el.hidden = false;
  renderPick();
  const cs = G.cs, wrap = $('#boardWrap').getBoundingClientRect(), cv = canvas.getBoundingClientRect();
  const left = cv.left - wrap.left + (x + 1) * cs + 8, top = cv.top - wrap.top + y * cs - 10;
  const w = el.offsetWidth, h = el.offsetHeight;
  el.style.left = Math.max(4, Math.min(left + w > wrap.width ? cv.left - wrap.left + x * cs - w - 8 : left, wrap.width - w - 4)) + 'px';
  el.style.top = Math.max(4, Math.min(top, cv.height - h - 4)) + 'px';
}
function renderPick() {
  const pick = ui.pick;
  const t = tileAt(pick.x, pick.y); if (!t) { closePick(); return; }
  const def = STATIONS[t.type], sensor = def.sensor, split = def.split, two = sensor || split, fixedOnly = t.fixed, passive = def.passive;
  const si = def.yes || TX.tablero.si, no = def.no || TX.tablero.no;
  const lblA = sensor ? fmt(P.salidaSi, { si }) : split ? P.salida1 : P.salida, lblB = sensor ? fmt(P.salidaNo, { no }) : P.salida2;
  let html = `<div class="pick-h">${def.name}</div>`;
  if (two && !fixedOnly) html += `<div class="pick-modes"><button class="pm ${sensor ? 'yes' : 'one'}" data-m="yes" aria-pressed="${pick.mode === 'yes'}">${lblA}</button><button class="pm ${sensor ? 'no' : 'two'}" data-m="no" aria-pressed="${pick.mode === 'no'}">${lblB}</button></div>`;
  if (def.thr) html += `<div class="pick-param"><span>${P.menosDe}</span><button class="pp" data-v="-20" aria-label="${P.bajar}">−</button><b>${t.thr}°</b><button class="pp" data-v="20" aria-label="${P.subir}">+</button><span>?</span></div>`;
  if (def.timer) html += `<div class="pick-param"><span>${P.tiempo}</span><button class="pp" data-v="-1" aria-label="${P.menos}">−</button><b>${t.time} ${def.unit || P.min}</b><button class="pp" data-v="1" aria-label="${P.mas}">+</button></div>`;
  if (!fixedOnly && !passive) {
    html += '<div class="pick-grid">';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const d = SIDE_POS.findIndex(p => p[0] === c && p[1] === r);
      if (r === 1 && c === 1) { html += '<div class="pick-mid"><canvas id="pickIcon" width="48" height="48"></canvas></div>'; continue; }
      if (d < 0) { html += '<div></div>'; continue; }
      const isA = t.dir === d, isB = two && t.alt === d, arrow = ['→', '↓', '←', '↑'][d];
      const cls = isA ? (sensor ? 's-yes' : split ? 's-one' : 's-yes') : isB ? (sensor ? 's-no' : 's-two') : '';
      const txt = isA ? (sensor ? si : split ? '1' : P.sale) : isB ? (sensor ? no : '2') : arrow;
      html += `<button class="pick-side ${cls}" data-d="${d}" aria-label="${fmt(P.salirPor, { lado: P.lados[d] })}">${txt}</button>`;
    }
    html += '</div>';
  }
  html += `<div class="pick-help">${passive ? P.pasiva : fixedOnly ? P.soloNumero : two ? fmt(P.tocaLado2, { salida: pick.mode === 'yes' ? lblA : lblB }) : P.tocaLado}</div>`;
  html += fixedOnly ? `<div class="pick-actions"><span></span><button class="btn primary" id="pickOk">${P.listo}</button></div>` : `<div class="pick-actions"><button class="btn" id="pickDel">${P.quitar}</button><button class="btn primary" id="pickOk">${P.listo}</button></div>`;
  const el = $('#pick'); el.innerHTML = html;
  if ($('#pickIcon')) paintIcon($('#pickIcon'), c => { c.scale(.9, .9); drawStation(c, t.type, t.dir, { alt: t.alt, thr: t.thr, time: t.time }); }, 48);
  el.querySelectorAll('.pp').forEach(b => { b.onclick = () => { const v = +b.dataset.v; if (def.thr) t.thr = Math.max(20, Math.min(200, t.thr + v)); if (def.timer) t.time = Math.max(1, Math.min(4, t.time + v)); renderPick(); }; });
  el.querySelectorAll('.pm').forEach(b => { b.onclick = () => { pick.mode = b.dataset.m; renderPick(); }; });
  el.querySelectorAll('.pick-side').forEach(b => {
    b.onclick = () => {
      const d = +b.dataset.d;
      if (!two) { t.dir = d; t.alt = (d + 1) % 4; }
      else if (pick.mode === 'yes') { if (d === t.alt) t.alt = t.dir; t.dir = d; pick.mode = 'no'; }
      else { if (d === t.dir) t.dir = t.alt; t.alt = d; }
      renderPick();
    };
  });
  if ($('#pickDel')) $('#pickDel').onclick = () => { G.grid[pick.y][pick.x] = null; closePick(); };
  $('#pickOk').onclick = closePick;
}
export function closePick() { ui.pick = null; const el = $('#pick'); if (el) el.hidden = true; }

export function conectarEdicion(cv) {
  canvas = cv;
  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { ui.hover = null; });
}
