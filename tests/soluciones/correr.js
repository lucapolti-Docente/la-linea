/* Arma un nivel con una semilla, le aplica una solución y corre la línea hasta que gana o pierde. */
import { MUNDO } from '../../src/mundos/index.js';
import { usarPartida } from '../../src/motor/estado.js';
import { crearPartida } from '../../src/motor/partida.js';
import { step } from '../../src/motor/paso.js';
import { estrellas } from '../../src/motor/estrellas.js';
import { crearApi } from './api.js';
import muebles from './muebles.js';
import reci from './reci.js';
import usina from './usina.js';

export const SOLUCIONES = { muebles, reci, ene: usina };
export const SEMILLAS = Array.from({ length: 30 }, (_, i) => 1 + i * 7919);

/* Devuelve {gano, perdio, tick, estrellas, errores, motivo, carteles}. antes(G): para cambiar algo de la partida antes de encender. */
export function jugar(mundo, idLevel, seed, cual = 'buena', maxTicks = 3000, antes) {
  const M = MUNDO[mundo], idx = M.levels.findIndex(l => l.id === idLevel);
  const G = crearPartida(M, idx, seed);
  const sol = SOLUCIONES[mundo][idLevel];
  if (!sol) throw new Error(`Falta la solución de ${mundo}/${idLevel}`);
  sol[cual](crearApi());
  if (antes) antes(G);
  const carteles = [];
  usarPartida(G);
  while (!G.done && !G.lost && G.tick < maxTicks) {
    step();
    for (const e of G.eventos.splice(0)) carteles.push(e.msg);
  }
  return {
    gano: G.done && !G.lost, perdio: G.lost, tick: G.tick, N: G.N, dl: G.dl,
    estrellas: G.done ? estrellas(G.L, G.N, G.tick) : 0, errores: G.errors,
    motivo: G.lose ? G.lose.r : null, carteles, partida: G
  };
}
