/* Los niveles: bien armados, y la solución guardada de cada uno saca ⭐⭐⭐. */
import { describe, it, expect } from 'vitest';
import { NIVELES } from '../src/datos/niveles/index.js';
import { DATOS } from '../src/datos/index.js';
import { PERSONAJES } from '../src/datos/personajes.js';
import { ITEMS } from '../src/datos/textos.js';
import { jugar, cintasDe, programas } from '../src/motor/index.js';

const todos = Object.values(NIVELES).flat();
const conPedido = todos.filter(n => !n.libre);
const E = DATOS.estaciones;

it('los ids de los niveles no se repiten y son fijos', () => {
  const ids = todos.map(n => n.id);
  expect(new Set(ids).size).toBe(ids.length);
  ids.forEach(id => expect(id).toMatch(/^[a-z0-9-]+$/));
});

it('hay 10 niveles con pedido: 4 de taller, 2 de fábrica y 4 de planta', () => {
  expect([NIVELES.taller.length, NIVELES.fabrica.length, NIVELES.planta.length]).toEqual([4, 2, 4]);
});

for (const n of todos) {
  describe(n.id, () => {
    it('datos completos y textos cortos', () => {
      expect(PERSONAJES[n.cliente]).toBeTruthy();
      expect(DATOS.materiales[n.entra]).toBeTruthy();
      for (const t of [n.nombre, n.pide, n.consigna]) expect(t.length).toBeLessThanOrEqual(80);
      if (n.aprende) expect(n.aprende.length).toBeLessThanOrEqual(80);
    });

    it('de 1 a 7 casilleros en total, con estaciones que existen y no son pruebas', () => {
      const total = cintasDe(n).reduce((a, c) => a + c.casilleros, 0);
      expect(total).toBeGreaterThanOrEqual(1);
      expect(total).toBeLessThanOrEqual(7);
      n.estaciones.forEach(id => { expect(E[id], id).toBeTruthy(); expect(E[id].prueba).toBeFalsy(); });
      cintasDe(n).forEach(c => (c.fija || []).forEach(id => expect(E[id], id).toBeTruthy()));
      if (n.prueba) expect(E[n.prueba].prueba).toBe(true);
    });
  });
}

for (const n of conPedido) {
  describe(n.id + ' (pedido)', () => {
    it('cada cosa del modelo tiene su tilde con nombre', () => {
      Object.keys(n.modelo).forEach(k => expect(ITEMS[k], k).toBeTruthy());
    });

    it('la solución usa estaciones del panel y entra en los casilleros', () => {
      cintasDe(n).forEach((c, i) => {
        const s = n.solucion.cintas[i];
        if (c.fija) { expect(s).toBe(null); return; }
        expect(s.length).toBeLessThanOrEqual(c.casilleros);
        s.forEach(id => expect(n.estaciones).toContain(id));
      });
    });

    it('la solución guardada saca ⭐⭐⭐', () => {
      const r = jugar(n, n.solucion, DATOS);
      expect(r.prod.falla && r.prod.falla.motivo).toBeFalsy();
      expect(r.defectos).toEqual([]);
      expect(r.prod.tiempo.total).toBeLessThanOrEqual(n.meta);
      expect(r.estrellas).toBe(3);
    });

    it('la meta no sobra demasiado: el nivel no se gana con cualquier cosa', () => {
      const tres = programas(n).filter(p => jugar(n, p, DATOS).estrellas === 3).length;
      expect(tres).toBeGreaterThanOrEqual(1);
      expect(tres).toBeLessThan(programas(n).length / 10);
    });
  });
}

describe('Lo que tiene que enseñar cada nivel', () => {
  const nivel = id => todos.find(n => n.id === id);
  const prog = (id, cintas, repetir) => jugar(nivel(id), { cintas, repetir }, DATOS);

  it('1: cualquier orden de las tres herramientas da al menos una estrella', () => {
    const tres = ['serrucho', 'lija', 'pincel'];
    const ordenes = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    ordenes.forEach(o => expect(prog('taller-mesa', [o.map(i => tres[i])]).estrellas).toBeGreaterThanOrEqual(1));
  });
  it('2: pintar antes de agujerear sale peor', () => {
    const r = prog('taller-sombrilla', [['serrucho', 'lija', 'pincel', 'taladro']]);
    expect(r.estrellas).toBe(1);
    expect(r.defectos).toContain('pintura_saltada');
  });
  it('3: con cola también anda; sin unir, la prueba de peso falla', () => {
    expect(prog('taller-patas', [['serrucho', 'lija', 'cola', 'pincel']]).estrellas).toBe(3);
    expect(prog('taller-patas', [['serrucho', 'lija', 'pincel']]).prod.falla.motivo).toBe('patas_sueltas');
  });
  it('4: el pegamento en metal se suelta en la prueba; el clavo no entra', () => {
    expect(prog('taller-banco', [['cola', 'lija', 'pincel']]).prod.falla.motivo).toBe('cola_metal');
    expect(prog('taller-banco', [['clavos', 'lija', 'pincel']]).prod.falla.motivo).toBe('clavar_metal');
  });
  it('5: a mano sale bien, pero no llega a la meta', () => {
    const r = prog('fabrica-30-mesas', [['serrucho', 'lija', 'pincel']]);
    expect(r.estrellas).toBe(2);
    expect(r.prod.tiempo.total).toBe(630);
  });
  it('6: sin Repetir sale 1 de 100; con una vuelta de más o de menos no alcanza', () => {
    const una = prog('fabrica-100-mesas', [['sierra', 'lijadora', 'pistola']]);
    expect(una.faltan).toBe(99);
    expect(una.estrellas).toBe(0);
    for (const v of [99, 101]) expect(prog('fabrica-100-mesas', [['sierra', 'lijadora', 'pistola']], v).estrellas).toBe(0);
  });
  it('7: las tablas rajadas son siempre las mismas y el sensor las separa', () => {
    const a = prog('planta-sensor', [['sensor', 'sierra', 'lijadora', 'pistola']]);
    const b = prog('planta-sensor', [['sensor', 'sierra', 'lijadora', 'pistola']]);
    expect(a.prod.rajadas).toEqual(b.prod.rajadas);
    expect(a.prod.rajadas.length).toBe(3);
    expect(a.prod.descartadas).toBe(3);
    expect(prog('planta-sensor', [['sierra', 'lijadora', 'pistola', 'sensor']]).defectos).toEqual(['trabajo_perdido']);
  });
  it('8: el plástico frío no se moldea; desmoldar caliente deforma', () => {
    expect(prog('planta-envases', [['molde', 'horno', 'enfriador', 'desmoldar']]).prod.falla.motivo).toBe('molde_frio');
    expect(prog('planta-envases', [['horno', 'molde', 'desmoldar', 'enfriador']]).defectos).toEqual(['envase_deformado']);
  });
  it('9: tapar antes de llenar derrama el shampoo', () => {
    expect(prog('planta-shampoo', [null, ['tapar', 'llenar', 'etiquetar']]).prod.falla.motivo).toBe('llenar_tapado');
  });
  it('10: el tiempo de línea es exacto, y duplicar la lenta o cambiarla por máquina llega a la meta', () => {
    const lenta = prog('planta-cuello', [['llenar', 'tapar', 'etiquetar']], 100);
    expect(lenta.prod.tiempo.total).toBe(604);
    expect(lenta.prod.tiempo.lenta).toBe(2);
    expect(lenta.estrellas).toBe(2);
    const doble = prog('planta-cuello', [['llenar', 'tapar', 'etiquetar', 'etiquetar']], 100);
    expect(doble.prod.tiempo.total).toBe(307);
    expect(doble.estrellas).toBe(3);
    expect(prog('planta-cuello', [['llenar', 'tapar', 'etiquetadora']], 100).prod.tiempo.total).toBe(304);
  });
});
