/* Crear y reiniciar una partida. Lógica pura: no toca la pantalla. */
import { G, W, H, usarPartida, fijarTamano } from './estado.js';
import { mulberry32 } from './azar.js';
import { TAGC } from '../datos/colores.js';

export const DX = [1, 0, -1, 0], DY = [0, 1, 0, -1], PROC = 3;
export const key = (x, y) => x + ',' + y;

export function tileAt(x, y) { if (x < 0 || y < 0 || x >= W || y >= H) return null; return G.grid[y][x]; }
export function eachTile(fn) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const t = G.grid[y][x]; if (t) fn(t, x, y); } }
export function isNight() { return !!(G && G.L.daynight && (G.tick % 40) >= 20); }

/* Horario del camión: último tick en que todavía se puede completar el pedido (0 = sin horario). */
export const horario = (L, N) => (L.dl ? L.dl[0] * N + L.dl[1] : 0);

/* "{nivel:aserradero}" → número de ese nivel en el mundo. */
export function resolverEtiqueta(txt, mundo) {
  if (!txt || txt.indexOf('{nivel:') < 0) return txt;
  return txt.replace(/\{nivel:(\w+)\}/g, (m, id) => String(mundo.levels.findIndex(l => l.id === id) + 1));
}

/* Arma el tablero del nivel idx con la semilla dada (o una nueva) y la deja como partida en juego. */
export function crearPartida(mundo, idx, seed, speed) {
  const L = mundo.levels[idx]; seed = seed ?? (Math.random() * 1e9 | 0);
  fijarTamano(L.size[0], L.size[1]);
  const gen = L.gen(mulberry32(seed));
  const p = {
    mundo: mundo.id, W: L.size[0], H: L.size[1],
    idx, L, seed, grid: gen.g, inv: {}, N: gen.N, items: [], running: false, speed: speed || 1, tick: 0, delivered: 0, errors: 0, wasted: 0, done: false, lost: false,
    lastTickAt: 0, phase: 0, nextId: 1, bump: 0, doneAt: 0, winShown: false, toldDead: false, drng: mulberry32(seed ^ 0x9e3779b9), cs: 48, trucks: [], zones: gen.zones || [], modules: gen.modules || [],
    dl: horario(L, gen.N), recipe: gen.recipe || L.recipe, productName: gen.productName || L.productName, pasillo: gen.pasillo ?? -1, techX: -99, techHit: {},
    eventos: [], marks: [], lose: null
  };
  usarPartida(p);
  for (const z of p.zones) z.label = resolverEtiqueta(z.label, mundo);
  eachTile(t => {
    if (t.label) t.label = resolverEtiqueta(t.label, mundo);
    if (t.t === 'truck' && !t.ambient) { if (!t.n) t.n = G.N; G.trucks.push(t); }
  });
  makeTagSeq();
  return p;
}

/* Vuelve la producción a cero. La línea armada queda como está. */
export function resetProduction() {
  G.items = []; G.tick = 0; G.delivered = 0; G.errors = 0; G.wasted = 0; G.done = false; G.lost = false; G.running = false; G.winShown = false; G.doneAt = 0; G.toldDead = false; G.toldTronco = false; G.waste = 0; G.dryT = 0;
  G.drng = mulberry32(G.seed ^ 0x9e3779b9); G.marks = []; G.mk = null; G.kwh = 0; G.lose = null; G.eventos = [];
  eachTile(t => {
    if (t.t === 'station') { t.proc = null; t.buf = {}; t.bufItems = []; t.broken = false; t.made = 0; t.charge = 0; t.uses = 0; t.maint = 0; }
    if (t.t === 'source') { t.cnt = 0; t.made = 0; t.tagIdx = 0; }
    if (t.t === 'truck') { t.got = 0; t.doneAt = 0; t.bump = 0; if (t.thermo) t.temp = t.temp0; }
  });
  makeTagSeq();
}

/* Orden de los stickers cuando el pedido pide una cantidad exacta de cada color. */
export function makeTagSeq() {
  const seq = []; G.trucks.forEach(t => { if (TAGC[t.want]) for (let i = 0; i < t.n; i++) seq.push(t.want); });
  const r = mulberry32(G.seed ^ 0x51ed); for (let i = seq.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [seq[i], seq[j]] = [seq[j], seq[i]]; }
  G.tagSeq = seq.length ? seq : ['azul', 'amarillo'];
}

/* Cuántas cintas y estaciones puso el chico. */
export function usage() {
  let belts = 0, st = 0;
  eachTile(t => { if (t.t === 'belt') belts++; else if (t.t === 'station' && !t.fixed && !t.locked) st++; });
  return { belts, st };
}
