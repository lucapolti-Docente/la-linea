/* Cada nivel, con 30 semillas distintas: la solución guardada gana y la mala pierde. */
import { describe, it, expect } from 'vitest';
import { MUNDOS } from '../src/mundos/index.js';
import { SOLUCIONES, SEMILLAS, jugar } from './soluciones/correr.js';

for (const M of MUNDOS) {
  describe(M.name, () => {
    for (const L of M.levels) {
      const sol = SOLUCIONES[M.id][L.id];
      it(`${L.n}. ${L.title}: la solución gana con 30 semillas`, () => {
        expect(sol, 'falta la solución').toBeTruthy();
        for (const seed of SEMILLAS) {
          const r = jugar(M.id, L.id, seed, 'buena');
          expect(r.gano, `semilla ${seed}: ${r.motivo || 'no terminó en ' + r.tick + ' ticks'} · ${r.carteles.slice(-3).join(' | ')}`).toBe(true);
        }
      });
      it(`${L.n}. ${L.title}: la solución mala ${sol && sol.noPierde ? 'no gana' : 'pierde'}`, () => {
        for (const seed of SEMILLAS.slice(0, 10)) {
          const r = jugar(M.id, L.id, seed, 'mala', 1500);
          if (sol.noPierde) expect(r.gano, `semilla ${seed}`).toBe(false);
          else expect(r.perdio, `semilla ${seed}: ${r.gano ? 'ganó' : 'no perdió en ' + r.tick + ' ticks'}`).toBe(true);
        }
      });
    }
  });
}
