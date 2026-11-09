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

const require = createRequire(import.meta.url);
const O = require('../herramientas/motor-original.cjs')();

const SEMILLAS = [1, 2, 3, 77, 4242];
const TICKS = 160;

/* Copia comparable de una celda: sin carteles (algunos corrigen números de nivel viejos). */
function celda(t) {
  if (!t) return null;
  const o = {};
  for (const [k, v] of Object.entries(t)) if (k !== 'label' && typeof v !== 'function') o[k] = v;
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

for (const M of MUNDOS) {
  describe(`${M.name}: igual al original`, () => {
    M.levels.forEach((L, idx) => {
      it(`${L.n}. ${L.title}`, () => {
        for (const seed of SEMILLAS) {
          O.setWorld(M.id); O.startLevel(idx, seed);
          const Go = O.getG();
          const Gn = crearPartida(MUNDO[M.id], idx, seed);
          expect(Gn.N, `N con semilla ${seed}`).toBe(Go.N);
          expect(Gn.dl, `horario con semilla ${seed}`).toBe(Go.dl);
          expect(tablero(Gn.grid), `tablero con semilla ${seed}`).toEqual(tablero(Go.grid));
          editarIgual(Go, Gn, M.id, L, mulberry32(seed * 31 + idx));
          O.carteles.length = 0;
          for (let t = 0; t < TICKS && !Go.done && !Go.lost; t++) {
            O.step();
            usarPartida(Gn); step();
            const cn = Gn.eventos.splice(0).map(e => e.msg), co = O.carteles.splice(0);
            expect(resumen(Gn), `semilla ${seed}, tick ${t + 1}`).toEqual(resumen(Go));
            expect(cn, `carteles: semilla ${seed}, tick ${t + 1}`).toEqual(co);
          }
        }
      });
    });
  });
}
