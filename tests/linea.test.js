/* La línea, el reloj, la semilla y las estrellas. */
import { describe, it, expect } from 'vitest';
import { ESTACIONES as E } from '../src/datos/estaciones.js';
import { MATERIALES as M } from '../src/datos/materiales.js';
import { puestos, producir, reloj, rajadas, azar, evaluar } from '../src/motor/index.js';

const MESA = { modelo: { cortada: true, lisa: true, pintada: true } };
const hacer = (cintas, extra) => producir(Object.assign({ entra: M.tabla, cintas, lote: 1 }, extra), E);

describe('Puestos', () => {
  it('los casilleros vacíos no cuentan', () => {
    expect(puestos([['serrucho', null, 'lija']]).map(p => p.id)).toEqual(['serrucho', 'lija']);
  });
  it('dos iguales seguidas son un puesto con 2 trabajadores', () => {
    const ps = puestos([['etiquetar', 'etiquetar', 'tapar']]);
    expect(ps.map(p => [p.id, p.k])).toEqual([['etiquetar', 2], ['tapar', 1]]);
    expect(ps[0].casilleros).toEqual([0, 1]);
  });
  it('iguales separadas o en cintas distintas no se juntan', () => {
    expect(puestos([['lija', 'pincel', 'lija']]).length).toBe(3);
    expect(puestos([['tapar'], ['tapar']]).length).toBe(2);
  });
});

describe('Reloj', () => {
  const ps = ids => puestos([ids]);
  it('una pieza tarda la suma de las estaciones', () => {
    expect(reloj(ps(['serrucho', 'lija', 'pincel']), E, 1).total).toBe(50);
  });
  it('N piezas: primera + (N − 1) × la más lenta', () => {
    const r = reloj(ps(['serrucho', 'lija', 'pincel']), E, 30);
    expect(r.primera).toBe(50);
    expect(r.ritmo).toBe(20);
    expect(r.lenta).toBe(0);
    expect(r.total).toBe(50 + 29 * 20);
  });
  it('a mano vs con máquinas, 30 mesas', () => {
    expect(reloj(ps(['sierra', 'lijadora', 'pistola']), E, 30).total).toBe(10 + 29 * 4);
  });
  it('duplicar una estación no acelera la primera pieza, pero sí el ritmo', () => {
    const una = reloj(ps(['llenar', 'tapar', 'etiquetar']), E, 100);
    const dos = reloj(ps(['llenar', 'tapar', 'etiquetar', 'etiquetar']), E, 100);
    expect(una.total).toBe(10 + 99 * 6);
    expect(dos.primera).toBe(10);
    expect(dos.ritmo).toBe(3);
    expect(dos.total).toBe(10 + 99 * 3);
  });
  it('sin estaciones, cero', () => {
    expect(reloj([], E, 5).total).toBe(0);
  });
});

describe('Semilla', () => {
  it('la misma semilla da siempre lo mismo', () => {
    expect(rajadas(7, 12, 3)).toEqual(rajadas(7, 12, 3));
    const a = azar(1), b = azar(1);
    for (let i = 0; i < 5; i++) expect(a()).toBe(b());
  });
  it('da la cantidad pedida, sin repetir y dentro del lote', () => {
    const r = rajadas(42, 12, 3);
    expect(r.length).toBe(3);
    expect(new Set(r).size).toBe(3);
    r.forEach(i => { expect(i).toBeGreaterThanOrEqual(0); expect(i).toBeLessThan(12); });
  });
  it('nunca más que el lote', () => {
    expect(rajadas(3, 2, 5).length).toBe(2);
  });
});

describe('Producir', () => {
  it('la pieza se transforma en orden', () => {
    const p = hacer([['serrucho', 'lija', 'pincel']]);
    expect(p.falla).toBe(null);
    expect(p.sana.pasos.map(s => s.resultado)).toEqual(['ok', 'ok', 'ok']);
    expect(p.sana.pieza).toMatchObject({ cortada: true, lisa: true, pintada: true, defectos: [] });
  });
  it('no funciona: la línea para en esa estación', () => {
    const p = producir({ entra: M.envase, cintas: [['tapar', 'llenar', 'etiquetar']], lote: 100 }, E);
    expect(p.falla.motivo).toBe('llenar_tapado');
    expect(p.falla.puesto.casilleros).toEqual([1]);
    expect(p.sana.pasos.length).toBe(2);
    expect(p.entregadas).toBe(0);
  });
  it('dos cintas en serie: lo que sale de una entra en la otra', () => {
    const p = producir({ entra: M.granos, cintas: [['horno', 'molde', 'enfriador', 'desmoldar'], ['llenar', 'tapar', 'etiquetar']], lote: 1 }, E);
    expect(p.falla).toBe(null);
    expect(p.sana.pieza).toMatchObject({ envase: true, lleno: true, tapado: true, etiquetada: true });
    expect(p.tiempo.total).toBe(15 + 10);
  });
  it('la prueba del final se hace sola', () => {
    const p = producir({ entra: M.canos, cintas: [['cola', 'lija', 'pincel']], lote: 1, prueba: 'peso' }, E);
    expect(p.falla.motivo).toBe('cola_metal');
    expect(p.falla.puesto.prueba).toBe(true);
  });
  it('el sensor manda las rajadas a reciclar', () => {
    const p = hacer([['sensor', 'sierra', 'lijadora', 'pistola']], { lote: 12, rajadas: [1, 5, 9] });
    expect(p.descartadas).toBe(3);
    expect(p.entregadas).toBe(9);
    expect(p.rajada.pasos.length).toBe(1);
  });
  it('sin sensor, las rajadas salen igual', () => {
    const p = hacer([['sierra', 'lijadora', 'pistola']], { lote: 12, rajadas: [1, 5, 9] });
    expect(p.entregadas).toBe(12);
    expect(p.descartadas).toBe(0);
  });
});

describe('Estrellas', () => {
  const ev = (cintas, pedido, extra) => evaluar(Object.assign({}, MESA, pedido), hacer(cintas, extra));
  it('⭐⭐⭐ igual, sin defectos y a tiempo', () => {
    const r = ev([['serrucho', 'lija', 'pincel']], { meta: 50 });
    expect(r.estrellas).toBe(3);
    expect(r.fin).toBe('gana');
    expect(r.items.every(i => i.ok)).toBe(true);
  });
  it('⭐⭐ igual y sin defectos, pero tarde', () => {
    expect(ev([['serrucho', 'lija', 'pincel']], { meta: 40 }).estrellas).toBe(2);
  });
  it('⭐ sale peor: igual pero con defecto (aunque esté a tiempo)', () => {
    const r = ev([['serrucho', 'pincel', 'lija']], { meta: 50 });
    expect(r.estrellas).toBe(1);
    expect(r.defectos).toEqual(['pintura_despareja', 'pintura_raspada']);
  });
  it('sin estrellas si falta algo del modelo, con tildes por ítem', () => {
    const r = ev([['serrucho', 'lija']], {});
    expect(r.estrellas).toBe(0);
    expect(r.fin).toBe('distinta');
    expect(r.items).toEqual([{ id: 'cortada', ok: true }, { id: 'lisa', ok: true }, { id: 'pintada', ok: false }]);
  });
  it('sin estrellas si no funciona', () => {
    const r = evaluar({ modelo: { envase: true } }, producir({ entra: M.tabla, cintas: [['horno']], lote: 1 }, E));
    expect(r.fin).toBe('falla');
    expect(r.estrellas).toBe(0);
  });
  it('con pedido, la cantidad tiene que ser justa', () => {
    const hechos = n => evaluar(Object.assign({ pedido: 100 }, MESA), hacer([['sierra', 'lijadora', 'pistola']], { lote: n }));
    expect(hechos(100).estrellas).toBe(3);
    expect(hechos(1).faltan).toBe(99);
    expect(hechos(1).estrellas).toBe(0);
    expect(hechos(101).estrellas).toBe(0);
  });
  it('rajadas que llegan al final o trabajo perdido: sale peor', () => {
    const sin = ev([['sierra', 'lijadora', 'pistola']], {}, { lote: 12, rajadas: [2] });
    expect(sin.defectos).toEqual(['rajada']);
    expect(sin.estrellas).toBe(1);
    const tarde = ev([['sierra', 'sensor', 'lijadora', 'pistola']], {}, { lote: 12, rajadas: [2] });
    expect(tarde.defectos).toEqual(['trabajo_perdido']);
    const bien = ev([['sensor', 'sierra', 'lijadora', 'pistola']], {}, { lote: 12, rajadas: [2] });
    expect(bien.estrellas).toBe(3);
  });
});
