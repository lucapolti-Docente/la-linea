/* Cada estación del catálogo: que esté bien armada, que cada "no funciona" y cada "sale peor" tenga
   su caso probado acá y su texto en textos.js. */
import { describe, it, expect } from 'vitest';
import { ESTACIONES } from '../src/datos/estaciones.js';
import { MATERIALES } from '../src/datos/materiales.js';
import { FALLAS, DEFECTOS } from '../src/datos/textos.js';
import { aplicar } from '../src/motor/index.js';

const M = MATERIALES;
const con = (base, extra) => Object.assign({ defectos: [] }, base, extra);

/* [estación, pieza antes, resultado esperado, motivo o defecto, propiedades que tiene que tener después] */
const CASOS = [
  ['serrucho', M.tabla, 'ok', null, { cortada: true }],
  ['serrucho', M.canos, 'falla', 'cortar_metal'],
  ['serrucho', M.granos, 'falla', 'cortar_plastico'],
  ['serrucho', con(M.tabla, { cortada: true }), 'peor', 'cortada_de_mas'],
  ['serrucho', con(M.tabla, { pintada: true }), 'peor', 'bordes_sin_pintar'],
  ['lija', M.tabla, 'ok', null, { lisa: true }],
  ['lija', M.granos, 'falla', 'lijar_plastico'],
  ['lija', con(M.tabla, { pintada: true }), 'peor', 'pintura_raspada', { pintada: true }],
  ['pincel', con(M.tabla, { lisa: true }), 'ok', null, { pintada: true }],
  ['pincel', M.tabla, 'peor', 'pintura_despareja', { pintada: true }],
  ['pincel', M.granos, 'falla', 'pintar_plastico'],
  ['taladro', M.tabla, 'ok', null, { agujero: true }],
  ['taladro', M.granos, 'falla', 'agujerear_plastico'],
  ['taladro', con(M.tabla, { pintada: true }), 'peor', 'pintura_saltada'],
  ['clavos', M.kit, 'ok', null, { unida: true, union: 'clavos' }],
  ['clavos', M.canos, 'falla', 'clavar_metal'],
  ['clavos', M.tabla, 'falla', 'unir_sin_partes'],
  ['clavos', con(M.kit, { pintada: true }), 'peor', 'pintura_marcada'],
  ['cola', M.kit, 'ok', null, { unida: true, union: 'cola' }],
  ['cola', M.canos, 'ok', null, { union: 'cola' }],
  ['cola', M.tabla, 'falla', 'unir_sin_partes'],
  ['cola', con(M.kit, { pintada: true }), 'peor', 'cola_sobre_pintura'],
  ['soldadora', M.canos, 'ok', null, { unida: true, union: 'soldadura', lisa: false }],
  ['soldadora', M.kit, 'falla', 'soldar_madera'],
  ['soldadora', M.granos, 'falla', 'soldar_plastico'],
  ['soldadora', con(M.canos, { patas: false }), 'falla', 'unir_sin_partes'],
  ['soldadora', con(M.canos, { pintada: true }), 'peor', 'pintura_quemada'],
  ['sensor', M.tabla, 'ok', null, { descartada: undefined }],
  ['sensor', con(M.tabla, { rajada: true }), 'desvia', null, { descartada: true }],
  ['sensor', con(M.tabla, { rajada: true, cortada: true }), 'desvia', 'trabajo_perdido', { descartada: true }],
  ['horno', M.granos, 'ok', null, { caliente: true }],
  ['horno', M.tabla, 'falla', 'horno_madera'],
  ['horno', M.canos, 'falla', 'horno_metal'],
  ['horno', con(M.granos, { moldeado: true }), 'falla', 'horno_moldeado'],
  ['molde', con(M.granos, { caliente: true }), 'ok', null, { moldeado: true }],
  ['molde', M.granos, 'falla', 'molde_frio'],
  ['molde', M.tabla, 'falla', 'molde_madera'],
  ['molde', M.canos, 'falla', 'molde_metal'],
  ['enfriador', con(M.granos, { caliente: true }), 'ok', null, { caliente: false }],
  ['desmoldar', con(M.granos, { moldeado: true }), 'ok', null, { envase: true }],
  ['desmoldar', M.granos, 'falla', 'desmoldar_vacio'],
  ['desmoldar', con(M.granos, { moldeado: true, caliente: true }), 'peor', 'envase_deformado', { envase: true }],
  ['llenar', M.envase, 'ok', null, { lleno: true }],
  ['llenar', M.tabla, 'falla', 'llenar_sin_envase'],
  ['llenar', con(M.envase, { tapado: true }), 'falla', 'llenar_tapado'],
  ['tapar', M.envase, 'ok', null, { tapado: true }],
  ['tapar', M.tabla, 'falla', 'tapar_sin_envase'],
  ['etiquetar', M.envase, 'ok', null, { etiquetada: true }],
  ['etiquetar', M.tabla, 'falla', 'etiquetar_sin_envase'],
  ['peso', con(M.kit, { unida: true, union: 'clavos' }), 'ok', null],
  ['peso', con(M.canos, { unida: true, union: 'soldadura' }), 'ok', null],
  ['peso', con(M.canos, { unida: true, union: 'cola' }), 'falla', 'cola_metal'],
  ['peso', M.kit, 'falla', 'patas_sueltas']
];

/* Las máquinas tienen las mismas reglas que su herramienta de mano: se prueban con los mismos casos. */
const MAQUINAS = { serrucho: 'sierra', lija: 'lijadora', pincel: 'pistola', etiquetar: 'etiquetadora' };
CASOS.filter(c => MAQUINAS[c[0]]).forEach(c => CASOS.push([MAQUINAS[c[0]]].concat(c.slice(1))));

describe('Cada caso de cada estación', () => {
  for (const [id, antes, resultado, motivo, despues] of CASOS) {
    it(id + ' → ' + resultado + (motivo ? ' (' + motivo + ')' : ''), () => {
      const r = aplicar(con(antes), ESTACIONES[id]);
      expect(r.resultado).toBe(resultado);
      expect(r.motivo || null).toBe(motivo);
      if (motivo && resultado !== 'falla') expect(r.pieza.defectos).toContain(motivo);
      for (const k in despues || {}) expect(r.pieza[k]).toBe(despues[k]);
    });
  }
});

describe('Catálogo', () => {
  const probados = new Set(CASOS.map(c => c[0] + ':' + c[3]));
  const ids = Object.keys(ESTACIONES);

  it('cada estación tiene grupo, sonido, nombre corto, tipo y minutos', () => {
    for (const id of ids) {
      const e = ESTACIONES[id];
      expect(e.grupo, id).toBeTruthy();
      expect(e.sonido, id).toBeTruthy();
      expect(e.nombre.length, id).toBeLessThanOrEqual(14);
      expect(['mano', 'maquina'], id).toContain(e.tipo);
      expect(e.minutos, id).toBeGreaterThanOrEqual(e.prueba ? 0 : 1);
      expect(e.hace, id).toBeTruthy();
    }
  });

  it('cada estación tiene al menos un caso que funciona', () => {
    for (const id of ids) expect(probados.has(id + ':null'), id).toBe(true);
  });

  it('cada "no funciona" y cada "sale peor" tiene su caso y su texto', () => {
    for (const id of ids) {
      for (const r of ESTACIONES[id].fallaSi || []) {
        expect(probados.has(id + ':' + r.motivo), id + ' ' + r.motivo).toBe(true);
        expect(FALLAS[r.motivo], r.motivo).toHaveLength(2);
      }
      for (const r of ESTACIONES[id].peorSi || []) {
        expect(probados.has(id + ':' + r.defecto), id + ' ' + r.defecto).toBe(true);
        expect(DEFECTOS[r.defecto], r.defecto).toHaveLength(2);
      }
    }
  });

  it('las herramientas de mano tardan más que su máquina', () => {
    for (const [mano, maq] of Object.entries(MAQUINAS)) {
      expect(ESTACIONES[mano].minutos).toBeGreaterThan(ESTACIONES[maq].minutos);
      expect(ESTACIONES[mano].hace).toEqual(ESTACIONES[maq].hace);
    }
  });

  it('aplicar no cambia la pieza de entrada', () => {
    const antes = con(M.tabla, { pintada: true });
    aplicar(antes, ESTACIONES.lija);
    expect(antes).toEqual(con(M.tabla, { pintada: true }));
  });
});
