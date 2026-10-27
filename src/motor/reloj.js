/* El reloj de producción, en minutos de fábrica (simulados).
   Un puesto es una estación de la cinta; si hay dos iguales seguidas, es un puesto con k = 2 trabajadores.
   - La primera pieza pasa por todos: suma de los minutos (cada pieza la hace un solo trabajador).
   - Después sale una pieza cada "ritmo": lo que tarda el puesto más lento (sus minutos / k).
   Para N piezas: primera + (N − 1) × ritmo. */

export function reloj(puestos, catalogo, n) {
  const minutos = puestos.map(p => catalogo[p.id].minutos);
  const ritmos = puestos.map((p, i) => minutos[i] / p.k);
  const primera = minutos.reduce((a, b) => a + b, 0);
  const ritmo = ritmos.length ? Math.max.apply(null, ritmos) : 0;
  const lenta = ritmos.length ? ritmos.indexOf(ritmo) : -1;
  return { primera, ritmo, lenta, ritmos, total: n > 0 ? primera + (n - 1) * ritmo : 0 };
}
