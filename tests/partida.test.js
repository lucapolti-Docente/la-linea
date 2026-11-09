/* Acciones sobre la partida que usa la interfaz. */
import { describe, it, expect } from 'vitest';
import { MUNDOS } from '../src/mundos/index.js';
import { G, usarPartida } from '../src/motor/estado.js';
import { crearPartida, volverAlInicio, resetProduction } from '../src/motor/partida.js';
import { step } from '../src/motor/paso.js';
import { SOLUCIONES } from './soluciones/correr.js';
import { crearApi } from './soluciones/api.js';

const foto = g => JSON.stringify(g);

describe('Volver a la línea rota (niveles para depurar)', () => {
  for (const M of MUNDOS) M.levels.forEach((L, idx) => {
    if (L.kind !== 'Depurar') return;
    it(`${M.name} ${L.n}. ${L.title}`, () => {
      const p = crearPartida(M, idx, 5); resetProduction(); // el reinicio agrega contadores en cero
      const inicial = foto(p.grid);
      SOLUCIONES[M.id][L.id].buena(crearApi());
      for (let i = 0; i < 20; i++) step();
      expect(foto(G.grid)).not.toBe(inicial);
      volverAlInicio(M);
      expect(G).toBe(p);
      expect(G.tick).toBe(0);
      expect(G.items.length).toBe(0);
      expect(foto(G.grid)).toBe(inicial);
      // los camiones de la lista son los del tablero nuevo
      const enTablero = G.grid.flat().filter(t => t && t.t === 'truck' && !t.ambient);
      expect(G.trucks).toEqual(enTablero);
      G.trucks.forEach((t, i) => expect(t).toBe(enTablero[i]));
      // y la solución vuelve a ganar desde ahí
      SOLUCIONES[M.id][L.id].buena(crearApi());
      usarPartida(G);
      while (!G.done && !G.lost && G.tick < 3000) step();
      expect(G.done && !G.lost).toBe(true);
    });
  });
});
