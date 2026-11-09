/* Estrellas y horario de los camiones. */
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import { MUNDOS } from '../src/mundos/index.js';
import { par, estrellas } from '../src/motor/estrellas.js';
import { horario } from '../src/motor/partida.js';
import { jugar } from './soluciones/correr.js';

const require = createRequire(import.meta.url);
const O = require('../herramientas/motor-original.cjs')();

describe('Estrellas: par = L.par + N × L.per', () => {
  const L = { par: 20, per: 5 };
  it('calcula el par', () => {
    expect(par(L, 4)).toBe(40);
    expect(par({ par: 14 }, 3)).toBe(26); // sin per, cuenta 4 por pieza (como el original)
  });
  it('3 estrellas hasta el par, 2 hasta 1,5 veces el par, 1 después', () => {
    expect(estrellas(L, 4, 40)).toBe(3);
    expect(estrellas(L, 4, 41)).toBe(2);
    expect(estrellas(L, 4, 60)).toBe(2);
    expect(estrellas(L, 4, 61)).toBe(1);
    expect(estrellas(L, 4, 500)).toBe(1);
  });
  it('todos los niveles tienen par y per', () => {
    for (const M of MUNDOS) for (const lv of M.levels) {
      expect(typeof lv.par, lv.id).toBe('number');
      expect(typeof lv.per, lv.id).toBe('number');
    }
  });
});

describe('Horario de los camiones', () => {
  it('es el mismo que en el original para cualquier pedido', () => {
    const W = { muebles: O.WORLDS.muebles, reci: O.WORLDS.reci, ene: O.WORLDS.ene };
    for (const M of MUNDOS) M.levels.forEach((lv, i) => {
      const orig = W[M.id].levels[i];
      expect(orig.id).toBe(lv.id);
      for (let N = 1; N <= 20; N++) expect(horario(lv, N), `${lv.id} con N=${N}`).toBe(orig.dl ? orig.dl(N) : 0);
    });
  });

  it('se puede terminar justo en el tick del horario; un tick después, el camión ya salió', () => {
    // Juego la solución sin horario para saber en qué tick termina...
    const r = jugar('muebles', 'aserradero', 1);
    const T = r.tick;
    // ...y la repito con el horario justo y uno menos
    const conHorario = dl => {
      const res = jugar('muebles', 'aserradero', 1, 'buena', 3000, G => { G.dl = dl; });
      return res;
    };
    expect(conHorario(T).gano).toBe(true);
    const tarde = conHorario(T - 1);
    expect(tarde.perdio).toBe(true);
    expect(tarde.tick).toBe(T);
    expect(tarde.partida.lose.late).toBe(true);
  });

  it('los niveles sin horario no pierden por tiempo', () => {
    const r = jugar('muebles', 'tramo', 1, 'mala', 2000);
    expect(r.perdio).toBe(false);
    expect(r.tick).toBe(2000);
  });
});
