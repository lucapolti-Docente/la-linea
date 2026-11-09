/* El motor nuevo se comporta igual que el del juego original:
   mismo tablero para cada nivel y semilla, y misma simulación tick a tick
   con cintas y estaciones puestas al azar (iguales en los dos). */
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import { MUNDOS, MUNDO } from '../src/mundos/index.js';
import { STATIONS } from '../src/datos/estaciones.js';
import { G, usarPartida } from '../src/motor/estado.js';
import { crearPartida } from '../src/motor/partida.js';
import { step } from '../src/motor/paso.js';
import { station } from '../src/generadores/comun.js';
import { mulberry32 } from '../src/motor/azar.js';
import { SOLUCIONES } from './soluciones/correr.js';
import { crearApi } from './soluciones/api.js';
import { GENERADOR_NUEVO, HORARIO_NUEVO, cambio } from './cambios.js';

const require = createRequire(import.meta.url);
const O = require('../herramientas/motor-original.cjs')();

const SEMILLAS = [1, 2, 3, 77, 4242];

const TICKS = 160;

/* Copia comparable de una celda: sin carteles (algunos corrigen números de nivel viejos). */
function celda(t) {
  if (!t) return null;
  const o = {};
  for (const [k, v] of Object.entries(t)) if (!['label', 'seq', 'defectSeq'].includes(k) && typeof v !== 'function') o[k] = v;
  return o;
}
const tablero = g => JSON.parse(JSON.stringify(g.map(f => f.map(celda))));
const piezas = p => JSON.parse(JSON.stringify(p.items.map(({ px, py, ...it }) => it)));
const resumen = p => ({
  tick: p.tick, errors: p.errors, delivered: p.delivered, done: p.done, lost: p.lost, wasted: p.wasted, kwh: p.kwh || 0, waste: p.waste || 0,
  trucks: p.trucks.map(t => [t.got, t.temp]), items: piezas(p)
});

/* Pone las mismas cintas y estaciones al azar en los dos tableros. */
function editarIgual(Go, Gn, mundo, L, r) {
  const W = L.size[0], H = L.size[1];
  const tipos = Object.keys(STATIONS).filter(k => STATIONS[k].un[mundo] <= L.n);
  for (let k = 0; k < 14; k++) {
    const x = Math.floor(r() * W), y = Math.floor(r() * H);
    if (Gn.grid[y][x]) continue;
    const dir = Math.floor(r() * 4);
    if (r() < 0.6 || !tipos.length) {
      Gn.grid[y][x] = { t: 'belt', dir }; Go.grid[y][x] = { t: 'belt', dir };
    } else {
      const tipo = tipos[Math.floor(r() * tipos.length)], alt = (dir + 1 + Math.floor(r() * 3)) % 4;
      const sn = station(tipo, dir, false), so = O.station(tipo, dir, false);
      sn.alt = alt; so.alt = alt; Gn.grid[y][x] = sn; Go.grid[y][x] = so;
    }
  }
}

/* Copia al tablero original lo que la solución puso en el nuevo (cintas y estaciones). */
function copiarArmado(Go, Gn, antes) {
  Gn.grid.forEach((fila, y) => fila.forEach((t, x) => {
    if (t === antes[y][x]) return;
    if (!t) { Go.grid[y][x] = null; return; }
    if (t.t === 'belt') { Go.grid[y][x] = { ...t }; return; }
    const s = O.station(t.type, t.dir, t.fixed); s.alt = t.alt;
    if (t.thr !== undefined) s.thr = t.thr; if (t.time !== undefined) s.time = t.time;
    Go.grid[y][x] = s;
  }));
  // Lo que se ajustó sobre estaciones fijas (minutos, grados) o se giró
  Gn.grid.forEach((fila, y) => fila.forEach((t, x) => {
    const o = Go.grid[y][x];
    if (t && o && t.t === o.t && t === antes[y][x]) for (const k of ['dir', 'alt', 'thr', 'time']) if (t[k] !== undefined) o[k] = t[k];
  }));
}

/* Corre los dos motores a la par y compara cada tick. */
function simularIgual(Go, Gn, que, ticks) {
  O.carteles.length = 0;
  for (let t = 0; t < ticks && !Go.done && !Go.lost; t++) {
    O.step();
    usarPartida(Gn); step();
    const cn = Gn.eventos.splice(0).map(e => e.msg), co = O.carteles.splice(0);
    expect(resumen(Gn), que + ', tick ' + (t + 1)).toEqual(resumen(Go));
    expect(cn, que + ', carteles del tick ' + (t + 1)).toEqual(co);
  }
}

/* Arma el mismo nivel y semilla en los dos motores y verifica que el tablero sea igual. */
function armarIgual(M, idx, seed) {
  O.setWorld(M.id); O.startLevel(idx, seed);
  const Go = O.getG();
  const Gn = crearPartida(MUNDO[M.id], idx, seed);
  expect(Gn.N, 'N con semilla ' + seed).toBe(Go.N);
  if (cambio(HORARIO_NUEVO, M.id, MUNDO[M.id].levels[idx].id)) Go.dl = Gn.dl;
  expect(Gn.dl, 'horario con semilla ' + seed).toBe(Go.dl);
  expect(tablero(Gn.grid), 'tablero con semilla ' + seed).toEqual(tablero(Go.grid));
  return { Go, Gn };
}

for (const M of MUNDOS) {
  describe(M.name + ': igual al original', () => {
    M.levels.forEach((L, idx) => {
      const cambiado = cambio(GENERADOR_NUEVO, M.id, L.id);
      it(L.n + '. ' + L.title + (cambiado ? ' (solo el tablero: generador corregido)' : ''), () => {
        for (const seed of SEMILLAS) {
          // Con cintas y estaciones al azar
          const { Go, Gn } = armarIgual(M, idx, seed);
          if (cambiado) continue;
          editarIgual(Go, Gn, M.id, L, mulberry32(seed * 31 + idx));
          simularIgual(Go, Gn, 'al azar, semilla ' + seed, TICKS);
          // Con la solución guardada, hasta que gana
          const s = armarIgual(M, idx, seed), antes = s.Gn.grid.map(f => f.slice());
          SOLUCIONES[M.id][L.id].buena(crearApi());
          copiarArmado(s.Go, s.Gn, antes);
          simularIgual(s.Go, s.Gn, 'solución, semilla ' + seed, 3000);
          expect(s.Go.done, 'la solución gana en el original, semilla ' + seed).toBe(true);
        }
      });
    });
  });
}
