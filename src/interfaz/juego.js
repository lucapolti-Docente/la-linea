/* Pantalla de juego: arrancar un nivel, paleta, pedido, columna derecha, carteles y el bucle de animación. */
import { $, ui, fmtHora } from './dom.js';
import { G, W, H } from '../motor/estado.js';
import { crearPartida, resetProduction, volverAlInicio, eachTile } from '../motor/partida.js';
import { step } from '../motor/paso.js';
import { par } from '../motor/estrellas.js';
import { MUNDO } from '../mundos/index.js';
import { STATIONS } from '../datos/estaciones.js';
import { PARTS } from '../datos/piezas.js';
import { TRUCKC } from '../datos/colores.js';
import { TRUCKN, STEP_SHORT, TX } from '../datos/textos.js';
import { fmt } from '../datos/mensajes.js';
import { paintIcon } from '../dibujo/util.js';
import { drawBelt } from '../dibujo/cinta.js';
import { drawItem } from '../dibujo/piezas.js';
import { drawStation } from '../dibujo/estaciones.js';
import { diagrama } from '../dibujo/diagramas.js';
import { dibujar, PROPIOS } from '../dibujo/iconos.js';
import { drawBoard } from '../dibujo/tablero.js';
import { drawStrip } from '../dibujo/portada.js';
import { show } from './pantallas.js';
import { closePick, conectarEdicion } from './edicion.js';
import { showIntro, showWin, showLose, showParts, openModal, diag } from './ventanas.js';
import { Sonido } from '../sonido.js';

const J = TX.juego;
let canvas, bctx, strip, sctx;

export const WL = () => MUNDO[ui.mundo].levels;

export function startLevel(idx, seed) {
  crearPartida(MUNDO[ui.mundo], idx, seed, G ? G.speed : 1);
  ui.tool = 'cinta'; $('#toast').className = 'toast'; closePick(); G.tab = null;
  // En los niveles para depurar el tablero es fijo: en lugar de otra línea, se puede volver a la línea rota
  $('#newBtn').textContent = G.L.kind === 'Depurar' ? J.volverRota : J.otraLinea;
  buildPalette(); buildOrder(); updateSide(); show('game');
  $('#boardHint').textContent = J.ayudaTablero;
  setTimeout(showIntro, 30);
}

function unlocked() { return Object.keys(STATIONS).filter(k => STATIONS[k].un[ui.mundo] <= G.L.n); }

function buildPalette() {
  const un = unlocked(), acts = [1, 2, 3].filter(a => un.some(k => STATIONS[k].act === a));
  if (!G.tab || !acts.includes(G.tab)) G.tab = acts.includes(G.L.act) ? G.L.act : acts[acts.length - 1];
  const M = MUNDO[ui.mundo];
  $('#ptabs').innerHTML = acts.map(a => `<button class="ptab" data-act="${a}" aria-pressed="${G.tab === a}">${M.acts[a].tab}</button>`).join('');
  $('#ptabs').hidden = !acts.length;
  $('#ptabs').querySelectorAll('.ptab').forEach(b => { b.onclick = () => { G.tab = +b.dataset.act; buildPalette(); }; });
  const tools = [['cinta', J.cinta[0], J.cinta[1], c => drawBelt(c, 0, 0.12, false)], ['borrar', J.borrar[0], J.borrar[1], PROPIOS.borrar]];
  un.filter(k => STATIONS[k].act === G.tab).forEach(k => tools.push(['st:' + k, STATIONS[k].label, STATIONS[k].name, c => drawStation(c, k, 0, {})]));
  const p = $('#palette');
  p.innerHTML = tools.map(t => `<button class="tool" data-tool="${t[0]}" title="${t[2]}" aria-pressed="${ui.tool === t[0]}"><canvas width="44" height="44"></canvas><span>${t[1]}</span>${t[0].startsWith('st:') && STATIONS[t[0].slice(3)].un[ui.mundo] === G.L.n ? `<b class="count">${J.nuevo}</b>` : ''}</button>`).join('');
  p.querySelectorAll('.tool').forEach((b, i) => { paintIcon(b.querySelector('canvas'), c => { c.scale(.92, .92); tools[i][3](c); }, 44); b.onclick = () => { ui.tool = b.dataset.tool; syncPalette(); }; });
  syncPalette();
}
function syncPalette() {
  document.querySelectorAll('.tool').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === ui.tool)));
}

function buildOrder() {
  const L = G.L;
  const sample = L.sample || { kind: L.product, steps: G.recipe, defect: false };
  paintIcon($('#orderIcon'), c => { c.scale(.95, .95); drawItem(c, sample); }, 60);
  $('#orderQty').textContent = G.N; $('#orderWhat').textContent = G.productName;
  let s = L.materials ? `<span class="chip plain">${L.materials}</span><span class="arrow">→</span>` : '';
  if (L.flow) s = L.flow.map(r => `<span class="chip">${r}</span>`).join('<span class="arrow">→</span>');
  else if (G.recipe) s += G.recipe.map(r => `<span class="chip">${STEP_SHORT[r]}</span>`).join('<span class="arrow">→</span>');
  $('#orderSteps').innerHTML = L.diagram ? diagrama(diag(L)) : s;
  $('#goalTxt').textContent = L.goal(G.N, G);
  $('#newsList').innerHTML = L.news.length ? '' : `<p class="goal-txt" style="color:var(--muted)">${L.kind === 'Depurar' ? J.nadaDepurar : L.kind === 'Optimizá' ? J.nadaOptimiza : J.nadaDesafio}</p>`;
  if (L.news.length) $('#newsList').innerHTML = L.news.map(k => `<div class="new-item"><canvas width="40" height="40" data-p="${k}"></canvas><div><b>${PARTS[k].name}</b>${PARTS[k].short}</div></div>`).join('');
  $('#newsList').querySelectorAll('canvas').forEach(cv => paintIcon(cv, c => { c.scale(.92, .92); dibujar(c, PARTS[cv.dataset.p].dibujo); }, 40));
  $('#slots').innerHTML = G.trucks.map(t => `<div class="slot-row">${t.want ? `<span class="tagdot" style="background:${TRUCKC[t.want]}"></span><span class="slot-lbl">${t.label || fmt(J.camion, { que: TRUCKN[t.want] })}</span>` : ''}<div class="slot-set">${Array.from({ length: t.n }, () => '<span class="slot"></span>').join('')}</div></div>`).join('');
}

export function updateSide() {
  if (!G) return;
  document.querySelectorAll('#slots .slot-row').forEach((row, k) => row.querySelectorAll('.slot').forEach((s, i) => s.classList.toggle('on', i < G.trucks[k].got)));
  $('#clock').textContent = fmtHora(G.tick);
  const dle = $('#deadline'); dle.hidden = !G.dl;
  if (G.dl) {
    const left = G.dl - G.tick;
    dle.textContent = fmt(G.trucks.length > 1 ? J.camionesSalen : J.camionSale, { hora: fmtHora(G.dl) }) + (G.done ? '' : left > 0 ? fmt(J.faltan, { n: left }) : '');
    dle.classList.toggle('late', !G.done && left <= 8);
  }
  $('#errDots').innerHTML = [0, 1, 2].map(i => `<span class="dot${i < G.errors ? ' on' : ''}"></span>`).join('');
  const lap = Math.min(G.N, G.delivered + 1);
  $('#loopTxt').innerHTML = G.done ? J.completo
    : fmt(J.repetir, { N: G.N, vuelta: lap }) + `<span class="sg">${fmt(J.tresEstrellas, { hora: fmtHora(par(G.L, G.N)) })}</span>`
      + (G.L.energy ? `<span class="sg" style="color:${(G.kwh || 0) > G.L.energy - 2 ? '#e8665a' : '#f2c84b'}">${fmt(J.energia, { kwh: G.kwh || 0, max: G.L.energy })}</span>` : '');
  $('#runBtn').textContent = G.running ? J.pausar : (G.tick > 0 && !G.done ? J.seguir : J.encender);
  $('#runBtn').disabled = G.done || G.lost;
  $('#stepBtn').disabled = G.done || G.lost;
  document.querySelectorAll('.speed button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.speed === G.speed)));
}

/* Cartel sobre el tablero. No repite el mismo cartel antes de 2,5 s. */
let toastT = 0, lastMsg = '', lastMsgAt = 0;
export function toast(msg, kind = '') {
  const now = performance.now();
  if (msg === lastMsg && now - lastMsgAt < 2500) return;
  lastMsg = msg; lastMsgAt = now;
  const el = $('#toast'); el.textContent = msg; el.className = 'toast show ' + kind;
  clearTimeout(toastT); toastT = setTimeout(() => { el.className = 'toast ' + kind; }, 2800);
}
/* Muestra los carteles que dejó el motor. */
/* Un tick de la línea, con sus sonidos y carteles. */
function avanzar() {
  const llegaron = () => G.trucks.reduce((s, t) => s + t.got, 0);
  const antes = llegaron(), errores = G.errors;
  step();
  if (G.errors > errores) Sonido.efecto('error');
  else if (llegaron() > antes) Sonido.efecto('entrega', llegaron());
  mostrarEventos(); updateSide();
}

function mostrarEventos() {
  while (G.eventos.length) { const e = G.eventos.shift(); toast(e.msg, e.kind); }
}

let lastFrame = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(100, now - lastFrame); lastFrame = now;
  if (ui.current === 'home') drawStrip(strip, sctx, now);
  if (!G || ui.current !== 'game') return;
  const tickMs = 420 / G.speed;
  if (G.running) { G.phase += dt / tickMs; if (now - G.lastTickAt >= tickMs) { G.lastTickAt = now; avanzar(); } }
  else if (G.pasoAnim) G.phase += dt / tickMs;
  const frac = G.running || G.pasoAnim ? Math.min(1, (now - G.lastTickAt) / tickMs) : 1;
  if (G.pasoAnim && frac >= 1) G.pasoAnim = false;
  drawBoard(bctx, ui.dpr, now, frac, ui.hover, ui.tool);
  if (G.lose && !G.lose.shown && now >= G.lose.at) { G.lose.shown = true; Sonido.efecto('pierde'); showLose(G.lose.r, G.lose.late); }
  if (G.done && !G.winShown && now - G.doneAt > 1700) { G.winShown = true; Sonido.efecto('gana'); showWin(); }
}

export function resize() {
  if (!G || ui.current !== 'game') return;
  ui.dpr = window.devicePixelRatio || 1;
  const w = $('#boardWrap').clientWidth; if (!w) return;
  const wide = innerWidth > 980;
  const maxH = wide ? Math.max(300, innerHeight - $('#boardWrap').getBoundingClientRect().top - scrollY - 56) : 9999;
  const cs = Math.max(26, Math.floor(Math.min((w - 2) / W, maxH / H, 120)));
  const d = ui.dpr;
  G.cs = cs; canvas.style.width = W * cs + 'px'; canvas.style.height = H * cs + 'px'; canvas.width = W * cs * d; canvas.height = H * cs * d;
}

export function conectarJuego() {
  canvas = $('#board'); bctx = canvas.getContext('2d');
  strip = $('#strip'); sctx = strip.getContext('2d');
  addEventListener('resize', resize);
  conectarEdicion(canvas);
  $('#runBtn').onclick = () => { if (!G || G.done || G.lost) return; G.running = !G.running; G.pasoAnim = false; G.lastTickAt = performance.now(); Sonido.efecto(G.running ? 'encender' : 'pausar'); updateSide(); };
  // Paso: un tick y se detiene (con la animación de ese tick). Encender sigue desde ahí.
  $('#stepBtn').onclick = () => {
    if (!G || G.done || G.lost) return;
    G.running = false; G.pasoAnim = true; G.lastTickAt = performance.now();
    Sonido.efecto('paso'); avanzar();
  };
  document.querySelectorAll('.speed button').forEach(b => { b.onclick = () => { G.speed = +b.dataset.speed; updateSide(); }; });
  $('#resetBtn').onclick = () => { resetProduction(); updateSide(); toast(J.reinicio); };
  $('#clearBtn').onclick = () => {
    resetProduction(); updateSide(); closePick();
    eachTile((t, x, y) => { if (t.t === 'belt' && !t.locked) G.grid[y][x] = null; if (t.t === 'station' && !t.fixed) G.grid[y][x] = null; });
  };
  $('#newBtn').onclick = () => {
    if (G.L.kind !== 'Depurar') return startLevel(G.idx);
    volverAlInicio(MUNDO[ui.mundo]); closePick(); buildOrder(); updateSide(); toast(J.lineaRota);
  };
  $('#qBtn').onclick = showParts; $('#qBtn2').onclick = showParts;
  $('#hintBtn').onclick = () => openModal(`<span class="eyebrow">${TX.ventanas.pista}</span><h2>${G.L.title}</h2><p>${G.L.hint}</p><div class="modal-actions"><button class="btn primary" data-close>${TX.ventanas.entendido}</button></div>`);
  addEventListener('keydown', e => {
    if (ui.current !== 'game' || !$('#modal').hidden) return;
    if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); $('#runBtn').click(); }
  });
  requestAnimationFrame(frame);
}
