/* La guía docente tiene que cubrir todos los mundos y todos sus actos (npm run guia arma public/docentes/ con esto). */
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { MUNDOS } from '../src/mundos/index.js';
import { GUIAS, URL_DC } from '../src/datos/docentes.js';

describe('guía docente', () => {
  for (const M of MUNDOS) {
    it(`${M.id}: tiene guía, grado sugerido por acto y su PDF generado`, () => {
      const G = GUIAS[M.id];
      expect(G).toBeTruthy();
      expect(Object.keys(G.grados).sort()).toEqual(Object.keys(M.acts).sort());
      for (const k of ['queHacen', 'articulaciones']) expect(G[k]).toBeTruthy();
      expect(G.dc.length).toBeGreaterThan(0);
      expect(G.antes.pasos.length).toBeGreaterThan(0);
      expect(G.cierre.length).toBeGreaterThan(0);
      expect(existsSync(`public/docentes/${G.archivo}.pdf`)).toBe(true);
    });
    it(`${M.id}: cada acto termina con una reflexión`, () => {
      for (const a of Object.keys(M.acts)) expect(M.levels.some(L => String(L.act) === a && L.reflect)).toBe(true);
    });
  }
  it('el link al Diseño Curricular es del sitio oficial', () => {
    expect(URL_DC).toMatch(/^https:\/\/buenosaires\.gob\.ar\//);
  });
});
