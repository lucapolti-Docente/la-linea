/* Azar repetible: con la misma semilla salen siempre las mismas tablas rajadas. */

export function azar(semilla) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Qué piezas del lote (0 a lote − 1) vienen rajadas, ordenadas. */
export function rajadas(semilla, lote, cuantas) {
  const r = azar(semilla), elegidas = new Set();
  const total = Math.min(cuantas, lote);
  while (elegidas.size < total) elegidas.add(Math.floor(r() * lote));
  return Array.from(elegidas).sort((a, b) => a - b);
}
