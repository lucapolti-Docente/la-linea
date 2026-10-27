import { it, expect } from 'vitest';
import { crearGuardado, sumarEstrellas, CLAVE } from '../src/guardado.js';

const falso = () => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); } }; };

it('guarda y lee por id de nivel', () => {
  const s = falso(), g = crearGuardado(() => s);
  g.escribir(sumarEstrellas({}, 'taller-mesa', 2));
  expect(g.leer().estrellas).toEqual({ 'taller-mesa': 2 });
  expect(JSON.parse(s.getItem(CLAVE)).version).toBe(1);
});

it('se queda con la mejor marca', () => {
  let d = sumarEstrellas({}, 'a', 3);
  d = sumarEstrellas(d, 'a', 1);
  d = sumarEstrellas(d, 'b', 1);
  expect(d.estrellas).toEqual({ a: 3, b: 1 });
});

it('sin localStorage o con datos rotos, sigue andando', () => {
  const roto = crearGuardado(() => { throw new Error('bloqueado'); });
  expect(roto.leer()).toEqual({});
  expect(() => roto.escribir({ a: 1 })).not.toThrow();
  const s = falso(); s.setItem(CLAVE, '{no es json');
  expect(crearGuardado(() => s).leer()).toEqual({});
});
