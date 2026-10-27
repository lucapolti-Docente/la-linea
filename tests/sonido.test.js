import { it, expect } from 'vitest';
import { ESTACIONES } from '../src/datos/estaciones.js';
import { crearSonido } from '../src/sonido.js';

it('cada estación usa un sonido que existe', () => {
  const s = crearSonido();
  for (const id of Object.keys(ESTACIONES)) expect(s.hay(ESTACIONES[id].sonido), id).toBe(true);
});

it('sin Web Audio (en Node) no explota', () => {
  expect(() => crearSonido().efecto('gana')).not.toThrow();
});
