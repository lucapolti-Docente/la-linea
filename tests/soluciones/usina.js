/* Soluciones de La usina. Ver muebles.js. */

const ini = (a, kind) => a.salida(a.entrada(kind));
const destino = (a, label) => a.una(t => t.t === 'truck' && t.label === label, 'destino ' + label);
const linea = (a, kind, dest, tipos, opts) => a.linea(ini(a, kind), dest, tipos, opts);
const directo = (a, kind, dest) => a.tender(a.camino(ini(a, kind), dest), dest);

/* Electricidad lejos: sube con el transformador elevador y baja con el reductor pegado al destino. */
const lejos = (a, desde, dest, antes = []) => a.linea(desde, dest, [...antes, 'elevador'], { alFinal: ['reductor'] });

/* Crecida: la compuerta manda la crecida al vertedero y el agua normal a la rueda. */
const compuerta = (a, dest) => a.arbol(ini(a, 'agua'), { s: 'compuerta', si: a.tacho(), no: { a: dest, tipos: ['rueda'] } });

export default {
  // ---------- Acto 1: Fuego y agua ----------
  e_vela: { buena: a => linea(a, 'cera', a.camion(), ['vela']), mala: a => directo(a, 'cera', a.camion()) },
  e_fogon: {
    buena: a => { linea(a, 'cera', a.camion('luz'), ['vela']); linea(a, 'lena', a.camion('calor'), ['fogon']); },
    mala: a => { linea(a, 'cera', a.camion('luz'), ['vela']); directo(a, 'lena', a.camion('calor')); }
  },
  e_rueda: { buena: a => linea(a, 'agua', a.camion(), ['rueda']), mala: a => directo(a, 'agua', a.camion()) },
  e_molinoV: { buena: a => linea(a, 'viento', a.camion(), ['eolico']), mala: a => directo(a, 'viento', a.camion()) },
  e_crecida: {
    buena: a => compuerta(a, a.camion()),
    // Sin compuerta: la crecida rompe la rueda
    mala: a => linea(a, 'agua', a.camion(), ['rueda'])
  },
  e_aldea: {
    buena: a => { linea(a, 'agua', a.camion('mov'), ['rueda']); linea(a, 'cera', a.camion('luz'), ['vela']); linea(a, 'lena', a.camion('calor'), ['fogon']); },
    mala: a => { directo(a, 'agua', a.camion('mov')); linea(a, 'cera', a.camion('luz'), ['vela']); linea(a, 'lena', a.camion('calor'), ['fogon']); }
  },
  e_dep1: {
    // El fogón y la vela estaban cambiados, y una cinta apuntaba afuera
    buena: a => { a.girar(6, 1, 0); a.borrar(1, 4); a.borrar(1, 6); a.est(1, 4, 'vela', 0); a.est(1, 6, 'fogon', 0); },
    mala: a => { a.girar(6, 1, 0); a.borrar(1, 4); a.borrar(1, 6); a.cinta(1, 4, 0); a.cinta(1, 6, 0); }
  },
  e_pueblo: {
    buena: a => { const m = a.camion('mov'); compuerta(a, m); linea(a, 'viento', m, ['eolico']); linea(a, 'lena', a.camion('calor'), ['fogon']); },
    // Sin compuerta y sin el molino de viento: la crecida rompe la rueda
    mala: a => { linea(a, 'agua', a.camion('mov'), ['rueda']); linea(a, 'lena', a.camion('calor'), ['fogon']); }
  },

  // ---------- Acto 2: La electricidad ----------
  e_vapor: { buena: a => linea(a, 'carbon', a.camion(), ['caldera', 'vapor']), mala: a => linea(a, 'carbon', a.camion(), ['caldera']) },
  e_dinamo: { buena: a => linea(a, 'agua', a.camion(), ['rueda', 'generador', 'lampara']), mala: a => linea(a, 'agua', a.camion(), ['rueda', 'generador']) },
  e_central: { buena: a => linea(a, 'gas', a.camion(), ['caldera', 'vapor', 'generador']), mala: a => linea(a, 'gas', a.camion(), ['caldera', 'vapor']) },
  e_termo: {
    buena: a => { const c = linea(a, 'gas', a.camion(), ['caldera', 'termostato']); a.rama(c[1], a.tacho()); },
    // Sin termostato: la casa se recalienta
    mala: a => linea(a, 'gas', a.camion(), ['caldera'])
  },
  e_pico: {
    // Dos máquinas de vapor en paralelo
    buena: a => { const c = linea(a, 'gas', a.camion(), ['caldera', 'repartidor', 'vapor', 'generador']); a.ramaLinea(c[1], c[3], ['vapor']); },
    mala: a => linea(a, 'gas', a.camion(), ['caldera', 'vapor', 'generador'])
  },
  e_red: {
    buena: a => lejos(a, ini(a), a.camion()),
    // Sin elevar la tensión: se pierde en el campo
    mala: a => directo(a, undefined, a.camion())
  },
  e_dep2: {
    // Los transformadores estaban al revés y una cinta volvía
    buena: a => { a.borrar(2, 3); a.borrar(13, 3); a.est(2, 3, 'elevador', 0); a.est(13, 3, 'reductor', 0); a.girar(8, 3, 0); },
    mala: a => a.girar(8, 3, 0)
  },
  e_corte: {
    buena: a => { const b = a.camion(); directo(a, 'elec', b); linea(a, 'agua', b, ['rueda', 'generador']); },
    // Solo la central: cuando se rompe, no alcanza
    mala: a => directo(a, 'elec', a.camion())
  },

  // ---------- Acto 3: Energía para todos ----------
  e_centrales: {
    buena: a => { const r = a.camion(); linea(a, 'agua', r, ['rueda', 'generador']); a.linea(ini(a, 'uranio'), r, ['reactor', 'vapor', 'generador']); },
    // El calor del reactor va directo a la red
    mala: a => linea(a, 'uranio', a.camion(), ['reactor'])
  },
  e_renovable: {
    // El panel carga la batería de día y la batería, pegada a las casas, entrega de noche
    buena: a => linea(a, 'luzSol', a.camion(), ['panel'], { alFinal: ['bateria'] }),
    mala: a => linea(a, 'luzSol', a.camion(), ['panel'])
  },
  e_directo: {
    // Gas directo a estufas: cada gas da un calor
    buena: a => { const c = linea(a, 'gas', a.camion(), ['repartidor', 'estufaGas']); a.ramaLinea(c[0], destino(a, a.camiones()[1].t.label), ['estufaGas']); },
    // Gas → electricidad → estufa eléctrica: se pierde la mitad y no alcanza
    mala: a => { const c = linea(a, 'gas', a.camion(), ['repartidor', 'caldera', 'vapor', 'generador', 'estufaElec']); a.ramaLinea(c[0], destino(a, a.camiones()[1].t.label), ['caldera', 'vapor', 'generador', 'estufaElec']); }
  },
  e_biogas: {
    buena: a => {
      const p = ini(a); a.est(p.x, p.y, 'repartidor', 0);
      a.dosSalidas(p, destino(a, 'Comedor'), destino(a, 'Planta'), { tiposA: ['biodigestor', 'estufaGas'], tiposB: ['biodigestor', 'caldera', 'vapor', 'generador'] });
    },
    // El gas va directo a la planta, sin hacer electricidad
    mala: a => {
      const p = ini(a); a.est(p.x, p.y, 'repartidor', 0);
      a.dosSalidas(p, destino(a, 'Comedor'), destino(a, 'Planta'), { tiposA: ['biodigestor', 'estufaGas'], tiposB: ['biodigestor'] });
    }
  },
  e_puna: {
    // Repartidor después del panel: una línea en alta tensión a la mina y otra a una batería pegada al pueblo
    buena: a => {
      const c = a.linea(ini(a), destino(a, 'Mina de litio'), ['panel', 'repartidor', 'elevador'], { alFinal: ['reductor'] });
      a.ramaLinea(c[1], destino(a, 'Pueblo'), ['elevador'], { alFinal: ['reductor', 'bateria'] });
    },
    // Sin batería: el pueblo recibe de día, cuando no la necesita
    mala: a => {
      const c = a.linea(ini(a), destino(a, 'Mina de litio'), ['panel', 'repartidor', 'elevador'], { alFinal: ['reductor'] });
      a.ramaLinea(c[1], destino(a, 'Pueblo'), ['elevador'], { alFinal: ['reductor'] });
    }
  },
  e_patagonia: {
    buena: a => { const c = a.camion(); for (const v of a.entradas('viento')) lejos(a, a.salida(v), c, ['eolico', 'generador']); },
    mala: a => { const c = a.camion(); for (const v of a.entradas('viento')) a.linea(a.salida(v), c, ['eolico', 'generador']); }
  },
  e_ahorro: {
    // El segundo repartidor mandaba la mitad al aula vacía
    buena: a => { a.borrar(6, 5); a.cinta(6, 5, 3); },
    mala: () => {}
  },
  e_ciudad: {
    buena: a => {
      const [m1, m2] = a.entradas('elec');
      lejos(a, a.salida(m1), destino(a, 'Fábrica de muebles'));
      const c = a.linea(a.salida(m2), destino(a, 'Barrio'), ['elevador'], { alFinal: ['repartidor', 'reductor'] });
      a.ramaLinea(c[c.length - 2], destino(a, 'Planta de reciclaje'), ['reductor']);
    },
    // Sin transformadores: la electricidad se pierde en el camino
    mala: a => {
      const [m1, m2] = a.entradas('elec');
      a.tender(a.camino(a.salida(m1), destino(a, 'Fábrica de muebles')), destino(a, 'Fábrica de muebles'));
      a.tender(a.camino(a.salida(m2), destino(a, 'Barrio')), destino(a, 'Barrio'));
    }
  }
};
