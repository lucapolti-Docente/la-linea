/* Soluciones de la Fábrica de muebles. buena: gana con cualquier semilla. mala: un error típico que pierde.
   noPierde: en ese nivel no hay forma de perder (sin horario ni piezas que puedan salir mal): la mala solo no gana. */

const SECUENCIA = ['marcar', 'cortar', 'lijar'];

/* Línea simple desde la primera entrada de `kind` hasta el camión, con estaciones en orden. */
const simple = (tipos, kind) => a => { const s = a.entrada(kind); a.linea(a.salida(s), a.camion(), tipos); };

/* Inspector: sanas por SÍ hacia el resto de la línea; con nudo por NO al tacho.
   alReves: SÍ y NO cambiados (la solución mala típica). */
function conInspector(a, tipos, { clavos = false, alReves = false, sensor = 'revisar', kind = 'tabla' } = {}) {
  const s = a.entrada(kind), cam = a.camion(), bin = a.tacho();
  // Si hace falta, la línea deja libre la franja del tacho para que llegue la rama del NO
  a.variantes(24, v => {
    const i = v % 6, ancho = Math.floor(v / 6), evitar = ancho ? (x, y) => x >= 2 && Math.abs(y - bin.y) <= ancho : undefined;
    const cells = a.linea(a.salida(s), cam, [sensor, ...tipos], { desdeIndice: i, evitar });
    const p = cells[i];
    a.rama(p, bin);
    if (clavos) a.alimentar(a.salida(a.entrada('clavos')), cells[i + tipos.length]);
    if (alReves) { const t = a.tile(p.x, p.y); [t.dir, t.alt] = [t.alt, t.dir]; }
  });
}

/* Línea de tablas que termina en el martillero, con los clavos entrando de costado. */
function conClavos(a, tipos) {
  a.variantes(6, i => {
    const cells = a.linea(a.salida(a.entrada('tabla')), a.camion(), tipos, { desdeIndice: i });
    a.alimentar(a.salida(a.entrada('clavos')), cells[i + tipos.length - 1]);
  });
}

/* Escáner de color: azul por SÍ a la pintura azul, amarillo por NO a la amarilla, y las dos a `destino`.
   alReves: las pinturas cambiadas. Devuelve las celdas de la línea azul. */
function pinturaPorSticker(a, desde, destino, { alReves = false, antes = [] } = {}) {
  const [si, no] = alReves ? ['pintaAmarilla', 'pintaAzul'] : ['pintaAzul', 'pintaAmarilla'];
  return a.variantes(4, i => {
    const cells = a.linea(desde, destino, [...antes, 'escColor', si], { desdeIndice: i });
    const k = i + antes.length, despues = cells[k + 2];
    a.intentar(() => a.ramaLinea(cells[k], despues || destino, [no]), () => a.ramaLinea(cells[k], destino, [no]));
    return cells;
  });
}

/* Roble por SÍ del escáner fijo (o puesto) con `barniz` estaciones; pino por NO a la pintura según sticker. */
function robleYPino(a, esc, cam, barniz, alReves = false) {
  const tEsc = a.tile(esc.x, esc.y);
  const si = a.salida(esc, tEsc.dir), no = a.salida(esc, tEsc.alt);
  const roble = a.linea(si, cam, barniz);
  const fin = roble[barniz.length] || cam;
  a.intentar(() => pinturaPorSticker(a, no, fin, { alReves }), () => pinturaPorSticker(a, no, cam, { alReves }));
}

/* Repartidor después de la estación i de la línea, con otra `tipo` en paralelo que vuelve a la línea en j. */
function enParalelo(a, cells, iRep, tipo, j) {
  a.ramaLinea(cells[iRep], cells[j], [tipo]);
}

export default {
  tramo: {
    buena: a => { const m = a.fija('marcar'), c = a.camion(); a.tender(a.camino(a.salida(m), c), c); },
    // La cinta se corta antes del camión
    mala: a => { const m = a.fija('marcar'); a.cinta(m.x + 1, m.y, 1); },
    noPierde: true
  },
  pasos: { buena: simple(SECUENCIA), mala: simple(['cortar', 'marcar', 'lijar']) },
  plano: {
    buena: a => simple(a.G.recipe)(a),
    mala: a => { const r = a.G.recipe, falta = SECUENCIA.find(s => !r.includes(s)); simple(falta ? [...r, falta] : [...r].reverse())(a); }
  },
  dosEntradas: { buena: simple(SECUENCIA), mala: simple(['marcar', 'lijar', 'cortar']) },
  materiales: {
    buena: a => {
      const cl = a.fija('clavar'), cam = a.camion();
      a.tender(a.camino(a.salida(cl), cam), cam);
      a.alimentar(a.salida(a.entrada('tabla')), cl);
      a.alimentar(a.salida(a.entrada('clavos')), cl);
    },
    // Las tablas van directo al camión, sin clavar
    mala: a => { const cam = a.camion(); a.tender(a.camino(a.salida(a.entrada('tabla')), cam), cam); }
  },
  banquito: {
    buena: a => conClavos(a, [...SECUENCIA, 'clavar']),
    mala: a => conClavos(a, ['marcar', 'cortar', 'clavar'])
  },
  depTaller: {
    // Tres errores: cortar y marcar cambiados, una cinta que apunta afuera y otra que vuelve hacia atrás
    buena: a => {
      a.borrar(1, 1); a.borrar(2, 1); a.est(1, 1, 'marcar', 0); a.est(2, 1, 'cortar', 0);
      a.girar(9, 3, 0); a.girar(6, 4, 3);
    },
    mala: a => { a.girar(9, 3, 0); a.girar(6, 4, 3); }
  },
  cuello: { buena: simple(['lijar']), mala: simple(['marcar']) },
  inspector: { buena: a => conInspector(a, ['lijar']), mala: a => conInspector(a, ['lijar'], { alReves: true }) },
  tallerChico: { buena: a => conInspector(a, SECUENCIA), mala: a => conInspector(a, SECUENCIA, { alReves: true }) },
  desTaller: {
    buena: a => conInspector(a, [...SECUENCIA, 'clavar'], { clavos: true }),
    mala: a => conInspector(a, [...SECUENCIA, 'clavar'], { clavos: true, alReves: true })
  },

  // ---------- Acto 2: La fábrica ----------
  aserradero: {
    buena: a => a.linea(a.salida(a.entrada('tronco')), a.fija('cortar'), ['sierra'], { entrarPor: [1, 2, 3] }),
    // El tronco va directo al carpintero y le rompe la mesa
    mala: a => { const c = a.fija('cortar'); a.alimentar(a.salida(a.entrada('tronco')), c); }
  },
  persMaq: { buena: simple(['sierra', 'sierra', 'lijadora']), mala: simple(['sierra', 'lijadora']) },
  boleta: {
    // Una sola persona lijando: no gasta de más, pero llega tarde
    sinParalelo: simple(['sierra', 'cortar', 'lijar']),
    // Personas para cortar y lijar (no gastan luz), con dos lijadoras en paralelo
    buena: a => { const cells = a.linea(a.salida(a.entrada('tronco')), a.camion(), ['sierra', 'cortar', 'repartidor', 'lijar']); enParalelo(a, cells, 2, 'lijar', 4); },
    // Todo con máquinas: se pasa de los kWh
    mala: simple(['sierra', 'sierra', 'lijadora'])
  },
  color: {
    buena: a => pinturaPorSticker(a, a.finCinta(), a.camion()),
    mala: a => pinturaPorSticker(a, a.finCinta(), a.camion(), { alReves: true })
  },
  depColor: {
    // Las pinturas estaban cruzadas y dos cintas apuntaban afuera
    buena: a => {
      a.borrar(8, 3); a.borrar(8, 4); a.est(8, 3, 'pintaAzul', 0); a.est(8, 4, 'pintaAmarilla', 0);
      a.girar(7, 4, 0); a.girar(9, 4, 3);
    },
    mala: a => { a.girar(7, 4, 0); a.girar(9, 4, 3); }
  },
  paquetes: {
    buena: a => a.linea(a.finCinta(), a.camion(), ['paquetera']),
    mala: a => a.tender(a.camino(a.finCinta(), a.camion()), a.camion())
  },
  manos: {
    buena: a => a.linea(a.finCinta(), a.camion(), ['barniz', 'barniz']),
    mala: a => a.linea(a.finCinta(), a.camion(), ['barniz'])
  },
  hornoReloj: {
    buena: a => {
      const h = a.fija('hornoReloj'), cam = a.camion();
      a.ajustar(h, { time: 3 });
      a.alimentar(a.salida(a.entrada('tabla')), h);
      a.tender(a.camino(a.salida(h), cam), cam);
    },
    // El reloj queda en 1 minuto: algunas salen húmedas
    mala: a => {
      const h = a.fija('hornoReloj'), cam = a.camion();
      a.alimentar(a.salida(a.entrada('tabla')), h);
      a.tender(a.camino(a.salida(h), cam), cam);
    }
  },
  horno: {
    buena: a => {
      const h = a.fija('horno'), cam = a.camion();
      a.linea(a.salida(a.entrada('tabla')), h, ['barniz'], { entrarPor: [1, 2, 3] });
      a.linea(a.salida(h), cam, ['horno']);
    },
    // Sin barniz
    mala: a => {
      const h = a.fija('horno'), cam = a.camion();
      a.alimentar(a.salida(a.entrada('tabla')), h);
      a.linea(a.salida(h), cam, ['horno']);
    }
  },
  mantenimiento: {
    sinParalelo: simple(['sierra', 'lijadora']),
    // Dos sierras con un repartidor: mientras una para, la otra sigue
    buena: a => {
      const cells = a.linea(a.salida(a.entrada('tronco')), a.camion(), ['repartidor', 'sierra', 'lijadora']);
      enParalelo(a, cells, 0, 'sierra', 2);
    },
    mala: simple(['sierra', 'lijadora'])
  },
  anidado: {
    buena: a => robleYPino(a, a.fija('escMadera'), a.camion(), ['barniz']),
    mala: a => robleYPino(a, a.fija('escMadera'), a.camion(), ['barniz'], true)
  },
  clasif: {
    buena: a => { const esc = a.finCinta(); a.est(esc.x, esc.y, 'escMadera', 0); clasificar(a, esc, false); },
    mala: a => { const esc = a.finCinta(); a.est(esc.x, esc.y, 'escMadera', 0); clasificar(a, esc, true); }
  },
  reparto: {
    buena: a => {
      const emb = a.finCinta(); a.est(emb.x, emb.y, 'embalar', 0);
      const esc = a.salida(emb); a.est(esc.x, esc.y, 'escColor', 0);
      a.dosSalidas(esc, a.camion('azul'), a.camion('amarillo'));
    },
    // Sin embalar
    mala: a => {
      const esc = a.finCinta();
      a.est(esc.x, esc.y, 'escColor', 0);
      a.dosSalidas(esc, a.camion('azul'), a.camion('amarillo'));
    }
  },

  // ---------- Acto 3: Industria ----------
  herramienta: { buena: simple(['cortaMetal'], 'barra'), mala: simple(['cortar'], 'barra') },
  patas: {
    buena: a => mesas(a, a.camion()),
    // Las tablas van solas al camión
    mala: a => { const cam = a.camion(); a.tender(a.camino(a.salida(a.entrada('tabla')), cam), cam); }
  },
  dosBrazos: {
    sinParalelo: a => mesas(a, a.camion()),
    buena: a => {
      const cam = a.camion(), [b1, b2] = a.entradas('barra');
      const A = a.linea(a.salida(b1), cam, ['cortaMetal', 'brazo'], { desdeIndice: 1 });
      const B = a.linea(a.salida(b2), cam, ['cortaMetal', 'brazo'], { desdeIndice: 1 });
      const rep = a.salida(a.entrada('tabla')); a.est(rep.x, rep.y, 'repartidor', 0);
      a.dosSalidas(rep, A[2], B[2]);
    },
    mala: a => mesas(a, a.camion())
  },
  depMesas: {
    // La sierra no corta aluminio, una cinta volvía para atrás y el brazo entregaba para el lado equivocado
    buena: a => { a.borrar(1, 5); a.est(1, 5, 'cortaMetal', 0); a.girar(6, 2, 1); a.lados(6, 4, 0, 1); },
    mala: a => { a.girar(6, 2, 1); a.lados(6, 4, 0, 1); }
  },
  soldadura: {
    // Cinco enfriadores seguidos: aunque el marco salga a 300°, llega a 50°
    buena: a => a.linea(a.salida(a.entrada('hierro')), a.fija('brazoHierro'), ['soldadora', 'enfriador', 'enfriador', 'enfriador', 'enfriador', 'enfriador'], { entrarPor: [1, 3] }),
    // Sin enfriar: el marco quema la madera
    mala: a => a.linea(a.salida(a.entrada('hierro')), a.fija('brazoHierro'), ['soldadora'], { entrarPor: [1, 3] })
  },
  umbral: {
    buena: a => a.ajustar(a.fija('frio'), { thr: 80 }),
    mala: () => {}
  },
  seguridad: {
    buena: a => {
      const p = a.G.pasillo;
      for (const b of a.fijas('brazo')) {
        const cerca = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]].map(([dx, dy]) => ({ x: b.x + dx, y: b.y + dy }))
          .find(c => c.y !== p && a.libre(c.x, c.y));
        a.est(cerca.x, cerca.y, 'presencia', 0);
      }
    },
    mala: () => {}
  },
  calidad: {
    buena: a => conInspector(a, [], { sensor: 'calibre', kind: 'corredera' }),
    mala: a => conInspector(a, [], { sensor: 'calibre', kind: 'corredera', alReves: true })
  },
  ahorroFab: {
    // Sobran la segunda lijadora y el horno: con 3 máquinas por tabla alcanzan los 18 kWh
    buena: a => { for (const c of [a.fijas('lijadora')[1], a.fija('horno')]) { a.borrar(c.x, c.y); a.cinta(c.x, c.y, 0); } },
    mala: () => {}
  },
  cajoneras: {
    buena: a => cajoneras(a, false),
    mala: a => cajoneras(a, true)
  },
  dosClientes: {
    buena: a => {
      const esc = a.camion('tabla'), mue = a.camion('mesa');
      const cells = a.linea(a.salida(a.entrada('barra')), mue, ['cortaMetal', 'brazo'], { desdeIndice: 1 });
      const rep = a.salida(a.entrada('tabla')); a.est(rep.x, rep.y, 'repartidor', 0);
      a.dosSalidas(rep, esc, cells[2]);
    },
    // Todas las tablas a la escuela: la mueblería nunca recibe mesas
    mala: a => { const esc = a.camion('tabla'); a.tender(a.camino(a.salida(a.entrada('tabla')), esc), esc); }
  },
  granFabrica: {
    buena: a => granFabrica(a, false),
    mala: a => granFabrica(a, true)
  }
};

/* Clasificar y barnizar: roble por SÍ con dos manos de barniz; pino por NO, pintado según su sticker. */
function clasificar(a, esc, alReves) {
  const cam = a.camion(), [si, no] = alReves ? ['pintaAmarilla', 'pintaAzul'] : ['pintaAzul', 'pintaAmarilla'];
  const { A, B } = a.dosSalidas(esc, cam, cam, { tiposA: ['barniz', 'barniz'], tiposB: ['escColor', si] });
  a.intentar(() => a.ramaLinea(B[0], B[2] || cam, [no]), () => a.ramaLinea(B[0], A[2] || cam, [no]), () => a.ramaLinea(B[0], cam, [no]));
}

/* Barra → cortadora → brazo de mesa (con tablas de costado) → camión. */
function mesas(a, cam) {
  a.variantes(4, i => {
    const cells = a.linea(a.salida(a.entrada('barra')), cam, ['cortaMetal', 'brazo'], { desdeIndice: i });
    a.alimentar(a.salida(a.entrada('tabla')), cells[i + 1]);
  });
}

/* Correderas → ¿derecha? (torcidas al tacho) → brazo cajón → brazo mueble → camión, con tablas de los dos módulos. */
function cajoneras(a, alReves) {
  const [t1, t2] = a.entradas('tabla'), cam = a.camion();
  a.variantes(24, i => {
    const k = i % 4, sep = 1 + Math.floor(i / 4) % 3, [u, v] = i >= 12 ? [t2, t1] : [t1, t2];
    const cells = a.linea(a.salida(a.entrada('corredera')), cam, ['calibre', 'brazoCajon', 'brazoMueble'], { desdeIndice: k, separar: sep });
    a.rama(cells[k], a.tacho());
    // Mala: el sensor manda las derechas al tacho y las torcidas a los brazos
    if (alReves) { const t = a.tile(cells[k].x, cells[k].y); [t.dir, t.alt] = [t.alt, t.dir]; }
    // Primero se alimenta el brazo más lejano, para que su cinta no tape al otro
    a.alimentar(a.salida(v), cells[k + 2 * sep]);
    a.alimentar(a.salida(u), cells[k + sep]);
  });
}

/* ¿Sano? (no → tacho) → ¿Mesa? (sí → camión de mesas) → ¿Hierro? (sí → hierro, no → cajoneras). */
function granFabrica(a, sinSano) {
  const ini = a.finCinta(), bin = a.tacho();
  const cM = a.camion('mesa'), cH = a.camion('mesaHierro'), cC = a.camion('cajonera');
  a.variantes(6, i => {
    const tipos = sinSano ? ['escMesa'] : ['escSano', 'escMesa'];
    const cells = a.linea(ini, cM, tipos, { desdeIndice: i % 3, separar: 1 + Math.floor(i / 3) });
    const k = i % 3, sep = 1 + Math.floor(i / 3);
    if (!sinSano) a.rama(cells[k], bin);
    const mesa = cells[k + (sinSano ? 0 : sep)];
    const r = a.ramaLinea(mesa, cH, ['escHierro']);
    a.rama(r[0], cC);
  });
}
