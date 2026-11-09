/* Soluciones de la Planta de reciclaje. Ver muebles.js. */

const ini = a => a.salida(a.entrada());
const ir = (dest, ...tipos) => ({ a: dest, tipos });

/* Árbol de sensores desde la primera entrada; prueba también después de un tramo de cinta. */
function arbol(a, construir, desde = ini(a)) {
  a.variantes(4, i => {
    let p = desde;
    for (let k = 0; k < i; k++) { a.cinta(p.x, p.y, 0); p = { x: p.x + 1, y: p.y }; }
    a.arbol(p, construir());
  });
}

export default {
  // ---------- Acto 1: Centro Verde ----------
  r_bolsa: {
    buena: a => arbol(a, () => ({ s: 'recReciclable', si: a.camion(), no: a.tacho() })),
    mala: a => arbol(a, () => ({ s: 'recReciclable', si: a.tacho(), no: a.camion() }))
  },
  r_vereda: {
    // Las bolsas verdes ya vienen separadas: van directo. Las mezcladas pasan por la recuperadora.
    buena: a => {
      const [verde, mezcla] = a.entradas(), cam = a.camion();
      a.tender(a.camino(a.salida(verde), cam), cam);
      arbol(a, () => ({ s: 'recReciclable', si: cam, no: a.tacho() }), a.salida(mezcla));
    },
    // La recuperadora con el SÍ y el NO cambiados
    mala: a => {
      const [verde, mezcla] = a.entradas(), cam = a.camion();
      a.tender(a.camino(a.salida(verde), cam), cam);
      arbol(a, () => ({ s: 'recReciclable', si: a.tacho(), no: cam }), a.salida(mezcla));
    }
  },
  r_triaje: {
    buena: a => arbol(a, () => ({ s: 'recPapel', si: a.camion('papel'), no: { s: 'recPlastico', si: a.camion('plastico'), no: a.camion('vidrio') } })),
    // ¿Papel? con el SÍ y el NO cambiados
    mala: a => { arbol(a, () => ({ s: 'recPapel', si: a.camion('papel'), no: { s: 'recPlastico', si: a.camion('plastico'), no: a.camion('vidrio') } })); alReves(a, 'recPapel'); }
  },
  r_dep1: {
    // El papel salía para el lado equivocado, una cinta volvía y en lugar de ¿Plástico? había ¿Vidrio?
    buena: a => { a.lados(1, 3, 3, 0); a.girar(2, 3, 0); a.borrar(3, 3); a.est(3, 3, 'recPlastico', 0, 1); },
    mala: a => { a.lados(1, 3, 3, 0); a.girar(2, 3, 0); }
  },
  r_fardo: {
    buena: a => arbol(a, () => ({ s: 'recPapel', si: ir(a.camion(), 'prensa'), no: a.tacho() })),
    // Papel suelto, sin enfardar
    mala: a => arbol(a, () => ({ s: 'recPapel', si: a.camion(), no: a.tacho() }))
  },
  r_contador: {
    buena: a => contador(a),
    mala: a => contador(a, true)
  },
  r_centro: {
    buena: a => centroVerde(a),
    mala: // Sin enfardar
    a => centroVerde(a, false)
  },

  r_cooperativa: {
    // Llega una cosa por tick: una sola recuperadora no da abasto. Repartidor y dos recuperadoras.
    buena: a => {
      const cam = a.camion(), bin = a.tacho(), p = ini(a);
      a.est(p.x, p.y, 'repartidor', 0);
      a.intentar(...[0, 1, 2, 3].map(d => () => {
        const t = a.tile(p.x, p.y), lados = [0, 1, 2, 3].filter(x => x !== 2);
        t.dir = lados[d % 3]; t.alt = lados[(d + 1) % 3];
        a.arbol(a.salida(p, t.dir), { s: 'recReciclable', si: cam, no: bin });
        a.arbol(a.salida(p, t.alt), { s: 'recReciclable', si: cam, no: bin });
      }));
    },
    mala: a => arbol(a, () => ({ s: 'recReciclable', si: a.camion(), no: a.tacho() }))
  },

  // ---------- Acto 2: Planta automática ----------
  r_iman: {
    buena: a => arbol(a, () => ({ s: 'iman', si: a.camion('acero'), no: a.camion('aluminio') })),
    mala: a => arbol(a, () => ({ s: 'iman', si: a.camion('aluminio'), no: a.camion('acero') }))
  },
  r_aire: {
    buena: a => arbol(a, () => ({ s: 'soplador', si: a.camion('papel'), no: { s: 'foucault', si: a.camion('aluminio'), no: a.camion('plastico') } })),
    mala: a => arbol(a, () => ({ s: 'soplador', si: a.camion('papel'), no: { s: 'foucault', si: a.camion('plastico'), no: a.camion('aluminio') } }))
  },
  r_optico: {
    buena: a => arbol(a, () => ({ s: 'optico', si: a.camion('pet'), no: a.camion('petColor') })),
    mala: a => arbol(a, () => ({ s: 'optico', si: a.camion('petColor'), no: a.camion('pet') }))
  },
  r_electronicos: {
    buena: a => arbol(a, () => ({ s: 'recPila', si: a.camion('pila'), no: { s: 'recElec', si: ir(a.camion('placa'), 'desarme'), no: a.tacho() } })),
    // Las pilas van al relleno
    mala: a => arbol(a, () => ({ s: 'recElec', si: ir(a.camion('placa'), 'desarme'), no: a.tacho() }))
  },
  r_dep2: {
    // El imán mandaba el acero al camión de papel, una cinta volvía y el separador de aluminio entregaba afuera
    buena: a => { a.lados(1, 3, 3, 0); a.girar(3, 4, 1); a.lados(3, 5, 0, 1); },
    mala: a => { a.girar(3, 4, 1); a.lados(3, 5, 0, 1); }
  },
  r_relleno: {
    // ¿Papel? manda el plástico y las latas al relleno: con ¿Reciclable? se recuperan todos
    buena: a => { a.borrar(1, 3); a.est(1, 3, 'recReciclable', 3, 1); },
    mala: () => {}
  },
  r_planta: {
    buena: a => plantaAutomatica(a),
    mala: // El óptico con el SÍ y el NO cambiados
    a => plantaAutomatica(a, true)
  },

  r_sorpresa: {
    buena: a => {
      const [arriba, abajo] = a.entradas();
      arbol(a, () => ({ s: 'soplador', si: a.camion('papel'), no: a.camion('aluminio') }), a.salida(arriba));
      arbol(a, () => ({ s: 'recVidrio', si: a.camion('vidrio'), no: a.tacho() }), a.salida(abajo));
    },
    // Sin preparar la segunda entrada: el vidrio no tiene adónde ir y se hace la hora
    mala: a => arbol(a, () => ({ s: 'soplador', si: a.camion('papel'), no: a.camion('aluminio') }), a.salida(a.entradas()[0]))
  },

  // ---------- Acto 3: Reinventar el material ----------
  r_plastico: {
    buena: a => a.linea(ini(a), a.camion(), ['trituradora', 'lavadora', 'lavadora', 'extrusora']),
    mala: a => a.linea(ini(a), a.camion(), ['trituradora', 'extrusora'])
  },
  r_dep3: {
    // La extrusora estaba antes que la lavadora y el sensor ¿Limpio? mandaba todo afuera
    buena: a => {
      for (const x of [2, 3, 4]) a.borrar(x, 3);
      a.est(2, 3, 'lavadora', 0); a.est(3, 3, 'lavadora', 0); a.est(4, 3, 'extrusora', 0);
    },
    mala: a => { a.borrar(3, 3); a.cinta(3, 3, 0); a.borrar(4, 3); a.cinta(4, 3, 0); }
  },
  r_reuso: {
    buena: a => arbol(a, () => ({ s: 'sana', si: ir(a.camion('botellaRe'), 'lavaBotellas'), no: ir(a.camion('botella'), 'trituradora', 'hornoVidrio') })),
    // Las rotas también se lavan y se vuelven a llenar
    mala: a => a.linea(ini(a), a.camion('botellaRe'), ['lavaBotellas'])
  },
  r_compost: {
    buena: a => compostYCarton(a, 3),
    // La compostera con 1 semana: sale compost crudo
    mala: a => compostYCarton(a, 1)
  },
  r_biogas: {
    buena: a => {
      const p = ini(a); a.est(p.x, p.y, 'repartidor', 0);
      const { B } = a.dosSalidas(p, a.camion('gas'), a.camion('compost'), { tiposA: ['biodigestorR'], tiposB: ['compostera'] });
      a.ajustar(B[0], { time: 3 });
    },
    mala: a => {
      const p = ini(a); a.est(p.x, p.y, 'repartidor', 0);
      a.dosSalidas(p, a.camion('gas'), a.camion('compost'), { tiposA: ['biodigestorR'], tiposB: ['compostera'] });
    }
  },
  r_puntoVerde: {
    buena: a => { arbol(a, () => ({ s: 'recPapel', si: a.camion('papel'), no: { s: 'recPlastico', si: a.camion('plastico'), no: { s: 'recOrganico', si: ir(a.camion('compost'), 'compostera'), no: a.tacho() } } })); compostera3(a); },
    // La comida va al relleno
    mala: a => arbol(a, () => ({ s: 'recPapel', si: a.camion('papel'), no: { s: 'recPlastico', si: a.camion('plastico'), no: a.tacho() } }))
  },
  r_basuraCero: {
    buena: a => basuraCero(a),
    mala: // La comida va al relleno
    a => basuraCero(a, false)
  },

  r_circular: {
    buena: a => {
      a.linea(a.salida(a.entrada('lata')), a.camion('lingote'), ['fundidora']);
      a.linea(a.salida(a.entrada('pet')), a.camion('pellets'), ['trituradora', 'lavadora', 'lavadora', 'extrusora']);
    },
    mala: a => {
      a.linea(a.salida(a.entrada('lata')), a.camion('lingote'), ['fundidora']);
      a.linea(a.salida(a.entrada('pet')), a.camion('pellets'), ['trituradora', 'extrusora']);
    }
  }
};

/* Uno de cada tres fardos a la balanza. alReves: el contador manda al revés. */
function contador(a, alReves = false) {
  const comp = a.camion('fardo'), bal = a.camion('balanza');
  arbol(a, () => ({ s: 'recPapel', si: { antes: ['prensa'], s: 'balanza', si: alReves ? comp : bal, no: alReves ? bal : comp }, no: a.tacho() }));
}

function alReves(a, tipo) { const p = a.fija(tipo), t = a.tile(p.x, p.y); [t.dir, t.alt] = [t.alt, t.dir]; }

function compostera3(a) { for (const c of a.fijas('compostera')) a.ajustar(c, { time: 3 }); }

function compostYCarton(a, semanas) {
  const c = a.fija('compostera');
  a.ajustar(c, { time: semanas });
  a.alimentar(a.salida(a.todas(t => t.t === 'source' && t.mix && t.mix[0][0] === 'organico')[0]), c);
  a.tender(a.camino(a.salida(c), a.camion('compost')), a.camion('compost'));
  a.linea(a.salida(a.todas(t => t.t === 'source' && t.mix && t.mix[0][0] === 'papel')[0]), a.camion('cartonNuevo'), ['pulper', 'secadora']);
}

/* Armado a mano (tableros que no cambian con la semilla). */
const fila = (a, x0, x1, y, dir) => { for (let x = x0; x <= x1; x++) a.cinta(x, y, dir); };
const col = (a, x, y0, y1, dir) => { for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) a.cinta(x, y, dir); };

/* Centro Verde: ¿Vidrio? → ¿Plástico? → ¿Papel? → relleno. Papel y plástico se enfardan. */
function centroVerde(a, enfardar = true) {
  const pr = (x, y, d) => (enfardar ? a.est(x, y, 'prensa', d) : a.cinta(x, y, d));
  a.est(1, 4, 'recVidrio', 1, 0); col(a, 1, 5, 6, 1); a.cinta(1, 7, 0); fila(a, 2, 12, 7, 0);
  a.est(2, 4, 'recPlastico', 0, 3); pr(3, 4, 0); fila(a, 4, 12, 4, 0);
  a.est(2, 3, 'recPapel', 0, 3); pr(3, 3, 0); fila(a, 4, 11, 3, 0); col(a, 12, 2, 3, 3); a.cinta(12, 1, 0);
  a.cinta(2, 2, 3); a.cinta(2, 1, 0); a.cinta(3, 1, 0); a.cinta(4, 1, 3);
}

/* Planta automática: ¿Reciclable? (no → relleno) → imán → soplador → separador de aluminio → óptico. */
function plantaAutomatica(a, opticoAlReves = false) {
  a.est(1, 4, 'recReciclable', 0, 3); col(a, 1, 1, 3, 3); a.cinta(1, 0, 0); a.cinta(2, 0, 0);
  a.est(2, 4, 'iman', 3, 0); col(a, 2, 2, 3, 3); a.cinta(2, 1, 0); fila(a, 3, 13, 1, 0); a.cinta(14, 1, 3);
  a.est(3, 4, 'soplador', 3, 0); a.cinta(3, 3, 3); a.cinta(3, 2, 0); fila(a, 4, 13, 2, 0);
  a.est(4, 4, 'foucault', 0, 1); fila(a, 5, 13, 4, 0);
  a.est(4, 5, 'optico', ...(opticoAlReves ? [1, 0] : [0, 1]));
  if (opticoAlReves) { col(a, 4, 6, 7, 1); a.cinta(4, 8, 0); fila(a, 5, 13, 8, 0); fila(a, 5, 13, 5, 0); a.cinta(14, 5, 1); }
  else { fila(a, 5, 13, 5, 0); a.cinta(14, 5, 1); col(a, 4, 6, 7, 1); a.cinta(4, 8, 0); fila(a, 5, 13, 8, 0); }
}

/* Basura cero: ¿Papel? → ¿Vidrio? → ¿Metal? → ¿Comida? → relleno. */
function basuraCero(a, conComida = true) {
  a.est(1, 4, 'recPapel', 3, 0); a.est(1, 3, 'pulper', 3); a.est(1, 2, 'secadora', 3); a.cinta(1, 1, 3); a.cinta(1, 0, 0); fila(a, 2, 13, 0, 0);
  a.est(2, 4, 'recVidrio', 3, 0); a.est(2, 3, 'trituradora', 3); a.est(2, 2, 'hornoVidrio', 3); a.cinta(2, 1, 0); fila(a, 3, 13, 1, 0); a.cinta(14, 1, 1);
  a.est(3, 4, 'recMetal', 0, 1); fila(a, 4, 13, 4, 0);
  if (conComida) { a.est(3, 5, 'recOrganico', 1, 0); a.est(3, 6, 'compostera', 1).time = 3; a.cinta(3, 7, 1); a.cinta(3, 8, 0); fila(a, 4, 13, 8, 0); }
  else a.cinta(3, 5, 0);
  fila(a, 4, 13, 5, 0); a.cinta(14, 5, 1);
}
