/* Herramientas para escribir soluciones que se adaptan al tablero de cada semilla.
   Una solución recibe `a` (esta API) y pone cintas y estaciones como lo haría un chico:
   solo en casilleros vacíos, sin tocar lo que viene fijo. */
import { G } from '../../src/motor/estado.js';
import { DX, DY, tileAt, eachTile } from '../../src/motor/partida.js';
import { station } from '../../src/generadores/comun.js';
import { STATIONS } from '../../src/datos/estaciones.js';

export const DIR = { der: 0, aba: 1, izq: 2, arr: 3 };
const dirDe = (a, b) => (b.x > a.x ? 0 : b.x < a.x ? 2 : b.y > a.y ? 1 : 3);

export class NoSePuede extends Error {}

export function crearApi() {
  const W = G.W, H = G.H;
  const libre = (x, y) => x >= 0 && y >= 0 && x < W && y < H && !G.grid[y][x];
  const a = {
    W, H, G,
    libre,
    tile: (x, y) => tileAt(x, y),
    /* Todas las celdas que cumplen pred(t), en orden de lectura. */
    todas(pred) { const r = []; eachTile((t, x, y) => { if (pred(t, x, y)) r.push({ x, y, t }); }); return r; },
    una(pred, que = 'pieza') { const r = a.todas(pred); if (!r.length) throw new NoSePuede('No encontré ' + que); return r[0]; },
    entrada(kind) { return a.una(t => t.t === 'source' && (!kind || t.kind === kind), 'entrada ' + (kind || '')); },
    entradas(kind) { return a.todas(t => t.t === 'source' && (!kind || t.kind === kind)); },
    camion(want) { return a.una(t => t.t === 'truck' && (want === undefined || t.want === want), 'camión ' + (want || '')); },
    camiones() { return a.todas(t => t.t === 'truck'); },
    tacho() { return a.una(t => t.t === 'bin', 'tacho'); },
    fija(type) { return a.una(t => t.t === 'station' && t.type === type, 'estación ' + type); },
    fijas(type) { return a.todas(t => t.t === 'station' && t.type === type); },
    /* Celda a la que entrega algo que sale para la derecha (entradas) o por dir. */
    salida(p, dir = 0) { return { x: p.x + DX[dir], y: p.y + DY[dir] }; },
    cinta(x, y, dir) { if (!libre(x, y)) throw new NoSePuede(`Ocupado ${x},${y}`); G.grid[y][x] = { t: 'belt', dir }; },
    est(x, y, type, dir, alt) {
      if (!libre(x, y)) throw new NoSePuede(`Ocupado ${x},${y} para ${type}`);
      const s = station(type, dir, false); if (alt !== undefined) s.alt = alt; G.grid[y][x] = s; return s;
    },
    /* Camino más corto de casilleros vacíos desde `desde` (vacío) hasta una celda vecina de `hasta`.
       evitar(x,y) puede prohibir casilleros. entrarPor: lados de `hasta` por donde se permite llegar. */
    camino(desde, hasta, { evitar, entrarPor } = {}) {
      // Nunca pasar por delante de una entrada: le metería material a la cinta
      const frente = new Set(a.entradas().map(s => (s.x + 1) + ',' + s.y));
      frente.delete(desde.x + ',' + desde.y);
      const ok = (x, y) => libre(x, y) && !frente.has(x + ',' + y) && !(evitar && evitar(x, y));
      if (!ok(desde.x, desde.y)) throw new NoSePuede(`Inicio ocupado ${desde.x},${desde.y}`);
      const prev = new Map(), k = (x, y) => x + ',' + y, cola = [desde]; prev.set(k(desde.x, desde.y), null);
      const meta = (x, y) => [0, 1, 2, 3].some(d => x + DX[d] === hasta.x && y + DY[d] === hasta.y && (!entrarPor || entrarPor.includes((d + 2) % 4)));
      while (cola.length) {
        const c = cola.shift();
        if (meta(c.x, c.y)) {
          const r = []; let p = c; while (p) { r.unshift(p); p = prev.get(k(p.x, p.y)); }
          return r;
        }
        for (let d = 0; d < 4; d++) {
          const n = { x: c.x + DX[d], y: c.y + DY[d] };
          if (ok(n.x, n.y) && !prev.has(k(n.x, n.y))) { prev.set(k(n.x, n.y), c); cola.push(n); }
        }
      }
      throw new NoSePuede(`Sin camino de ${desde.x},${desde.y} a ${hasta.x},${hasta.y}`);
    },
    /* Pone cinta por un camino; la última apunta a `hasta`. Devuelve las celdas. */
    tender(cells, hasta) {
      cells.forEach((c, i) => a.cinta(c.x, c.y, dirDe(c, cells[i + 1] || hasta)));
      return cells;
    },
    /* Línea: camino desde `desde` hasta `hasta`, con estaciones en orden.
       Cada estación ocupa un casillero del camino (repartidas desde `desdeIndice`). */
    linea(desde, hasta, tipos = [], { evitar, entrarPor, separar = 1, desdeIndice = 0, alFinal = [] } = {}) {
      const cells = a.camino(desde, hasta, { evitar, entrarPor });
      if (cells.length < desdeIndice + tipos.length * separar + alFinal.length) throw new NoSePuede('Camino corto para ' + tipos.concat(alFinal).join(','));
      const pos = new Map(tipos.map((tp, i) => [desdeIndice + i * separar, tp]));
      alFinal.forEach((tp, i) => pos.set(cells.length - alFinal.length + i, tp));
      cells.forEach((c, i) => {
        const d = dirDe(c, cells[i + 1] || hasta);
        if (pos.has(i)) a.est(c.x, c.y, pos.get(i), d); else a.cinta(c.x, c.y, d);
      });
      return cells;
    },
    def: type => STATIONS[type],
    /* Celda vacía adonde entrega una cinta trabada que termina en el aire (la salida de un tramo ya armado). */
    finCinta(pred = () => true) {
      const r = a.todas((t, x, y) => t.t === 'belt' && t.locked && libre(x + DX[t.dir], y + DY[t.dir]) && pred(t, x, y));
      if (!r.length) throw new NoSePuede('No hay cinta trabada abierta');
      return { x: r[0].x + DX[r[0].t.dir], y: r[0].y + DY[r[0].t.dir] };
    },
    /* Cambia el número de una estación que lo tiene (minutos del horno, grados del sensor). */
    ajustar(p, props) { Object.assign(tileAt(p.x, p.y), props); },
    /* Como rama, pero con estaciones al principio del camino. Devuelve las celdas. */
    ramaLinea(p, destino, tipos, opts = {}) {
      const t = tileAt(p.x, p.y);
      const lados = [0, 1, 2, 3].filter(d => d !== t.dir && libre(p.x + DX[d], p.y + DY[d]));
      for (const d of lados) {
        try {
          const cells = a.linea({ x: p.x + DX[d], y: p.y + DY[d] }, destino, tipos, opts);
          t.alt = d; return cells;
        } catch (e) { if (!(e instanceof NoSePuede)) throw e; }
      }
      throw new NoSePuede(`Sin rama con ${tipos.join(',')} desde ${p.x},${p.y}`);
    },
    /* Estación con dos salidas (sensor o repartidor) ya puesta en p: busca lados para que
       dir lleve a destA (con estaciones tiposA) y alt a destB (con tiposB). */
    dosSalidas(p, destA, destB, { tiposA = [], tiposB = [], evitarA, evitarB } = {}) {
      const t = tileAt(p.x, p.y);
      const lados = [0, 1, 2, 3].filter(d => libre(p.x + DX[d], p.y + DY[d]));
      for (const d of lados) for (const e of lados) {
        if (d === e) continue;
        const copia = G.grid.map(f => f.slice());
        try {
          t.dir = d; t.alt = e;
          const A = a.linea({ x: p.x + DX[d], y: p.y + DY[d] }, destA, tiposA, { evitar: (x, y) => (x === p.x + DX[e] && y === p.y + DY[e]) || (evitarA && evitarA(x, y)) });
          const B = a.linea({ x: p.x + DX[e], y: p.y + DY[e] }, destB, tiposB, { evitar: evitarB });
          return { A, B };
        } catch (er) {
          if (!(er instanceof NoSePuede)) throw er;
          copia.forEach((f, y) => { G.grid[y] = f; });
        }
      }
      throw new NoSePuede(`Sin dos salidas desde ${p.x},${p.y}`);
    },
    /* Árbol de sensores desde la celda vacía `desde`:
       nodo = {s: 'tipoDeSensor', si: rama, no: rama, antes: [estaciones antes del sensor]}
       rama = nodo, o {a: posDestino, tipos: [estaciones en el camino]}, o directamente una posición. */
    arbol(desde, nodo) {
      let p = desde;
      if (nodo.antes && nodo.antes.length) {
        // Estaciones antes del sensor: una por celda, probando hacia qué lado sigue
        const [tipo, ...resto] = nodo.antes;
        const st = a.est(p.x, p.y, tipo, 0);
        for (const d of [0, 1, 2, 3].filter(d => libre(p.x + DX[d], p.y + DY[d]))) {
          const copia = G.grid.map(f => f.slice());
          try { st.dir = d; a.arbol({ x: p.x + DX[d], y: p.y + DY[d] }, { ...nodo, antes: resto }); return st; } catch (er) {
            if (!(er instanceof NoSePuede)) throw er;
            copia.forEach((f, y) => { G.grid[y] = f; });
          }
        }
        G.grid[p.y][p.x] = null;
        throw new NoSePuede(`Sin lugar para ${tipo} en ${p.x},${p.y}`);
      }
      const t = a.est(p.x, p.y, nodo.s, 0);
      const lados = [0, 1, 2, 3].filter(d => libre(p.x + DX[d], p.y + DY[d]));
      const hoja = r => (r.s ? null : r.a ? r : { a: r, tipos: [] });
      const armar = (d, r, evitarCelda) => {
        const out = { x: p.x + DX[d], y: p.y + DY[d] };
        if (r.s) {
          // El sensor siguiente pegado, o después de un tramo recto de cinta
          for (let k = 0; k <= 3; k++) {
            const copia = G.grid.map(f => f.slice());
            try {
              let q = out;
              for (let i = 0; i < k; i++) { a.cinta(q.x, q.y, d); q = { x: q.x + DX[d], y: q.y + DY[d] }; }
              if (!libre(q.x, q.y)) throw new NoSePuede('ocupado');
              return a.arbol(q, r);
            } catch (er) { if (!(er instanceof NoSePuede)) throw er; copia.forEach((f, y) => { G.grid[y] = f; }); }
          }
          throw new NoSePuede('Sin lugar para ' + r.s);
        }
        const h = hoja(r);
        return a.linea(out, h.a, h.tipos, { evitar: evitarCelda ? (x, y) => x === evitarCelda.x && y === evitarCelda.y : undefined });
      };
      for (const d of lados) for (const e of lados) {
        if (d === e) continue;
        const copia = G.grid.map(f => f.slice());
        try {
          t.dir = d; t.alt = e;
          const oe = { x: p.x + DX[e], y: p.y + DY[e] };
          armar(d, nodo.si, oe);
          if (!libre(oe.x, oe.y)) throw new NoSePuede('tapado');
          armar(e, nodo.no);
          return t;
        } catch (er) {
          if (!(er instanceof NoSePuede)) throw er;
          copia.forEach((f, y) => { G.grid[y] = f; });
        }
      }
      G.grid[p.y][p.x] = null;
      throw new NoSePuede(`Sin árbol ${nodo.s} en ${p.x},${p.y}`);
    },
    /* Prueba armados en orden: si uno no entra en el tablero, deshace y prueba el siguiente. */
    intentar(...armados) {
      let ultimo;
      for (const f of armados) {
        const copia = G.grid.map(f => f.map(t => (t && (t.t === 'belt' || t.t === 'station') ? { ...t } : t)));
        try { return f(a); } catch (e) {
          if (!(e instanceof NoSePuede)) throw e;
          ultimo = e; copia.forEach((fila, y) => fila.forEach((t, x) => { G.grid[y][x] = t; }));
        }
      }
      throw ultimo;
    },
    /* intentar con un armado que recibe un número: f(0), f(1)... hasta n-1. */
    variantes(n, f) { return a.intentar(...Array.from({ length: n }, (_, i) => () => f(i))); },
    /* Lo que puede hacer un chico con lo que no viene fijo: borrar y girar. */
    borrar(x, y) { const t = tileAt(x, y); if (!t || t.fixed || t.locked || !['belt', 'station'].includes(t.t)) throw new NoSePuede(`No se puede borrar ${x},${y}`); G.grid[y][x] = null; },
    girar(x, y, dir) { const t = tileAt(x, y); if (!t || t.t !== 'belt' || t.locked) throw new NoSePuede(`No es cinta ${x},${y}`); t.dir = dir; },
    lados(x, y, dir, alt) { const t = tileAt(x, y); if (!t || t.t !== 'station') throw new NoSePuede(`No es estación ${x},${y}`); t.dir = dir; if (alt !== undefined) t.alt = alt; },
    /* Lleva material desde `desde` hasta la estación p, entrando por un lado libre que no sea salida. */
    alimentar(desde, p, opts = {}) {
      const t = tileAt(p.x, p.y), def = t.t === 'station' ? STATIONS[t.type] : {};
      const prohibidos = t.t === 'station' ? [t.dir].concat(def.sensor || def.split ? [t.alt] : []) : [];
      const entrarPor = (opts.entrarPor || [0, 1, 2, 3]).filter(s => !prohibidos.includes(s));
      return a.tender(a.camino(desde, p, { ...opts, entrarPor }), p);
    },
    /* Sale de la estación s (en p) por su lado alt hacia `destino`: prueba los lados libres. */
    rama(p, destino, opts = {}) {
      const t = tileAt(p.x, p.y);
      const lados = [0, 1, 2, 3].filter(d => d !== t.dir && libre(p.x + DX[d], p.y + DY[d]));
      for (const d of opts.preferir ? opts.preferir.concat(lados) : lados) {
        if (!lados.includes(d)) continue;
        try {
          const ini = { x: p.x + DX[d], y: p.y + DY[d] };
          const cells = a.camino(ini, destino, opts);
          t.alt = d; a.tender(cells, destino); return cells;
        } catch (e) { if (!(e instanceof NoSePuede)) throw e; }
      }
      throw new NoSePuede(`Sin rama desde ${p.x},${p.y}`);
    }
  };
  return a;
}

/* Tablero en texto, para mirar y escribir soluciones. */
const FLECHA = ['>', 'v', '<', '^'];
export function dibujoTexto(g) {
  return g.map(f => f.map(t => {
    if (!t) return ' . ';
    if (t.t === 'belt') return (t.locked ? '=' : ' ') + FLECHA[t.dir] + ' ';
    if (t.t === 'source') return 'S' + (t.kind || '?').slice(0, 2);
    if (t.t === 'truck') return 'T' + (t.want || '').slice(0, 2).padEnd(2);
    if (t.t === 'bin') return '[B]';
    if (t.t === 'pillar') return '###';
    if (t.t === 'module') return 'MMM';
    if (t.t === 'station') return (t.fixed ? '*' : ' ') + t.type.slice(0, 2) + FLECHA[t.dir];
    return ' ? ';
  }).map(s => s.padEnd(4).slice(0, 4)).join('')).join('\n');
}
