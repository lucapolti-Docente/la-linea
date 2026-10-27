/* Arma la línea de un nivel a partir de sus datos y del programa del chico, y la evalúa.
   programa: { cintas: [[ids o null], …], repetir: N o null }. Las cintas fijas del nivel se toman del nivel.
   Cuántas piezas: el lote fijo del nivel, o lo que diga Repetir si el nivel tiene un pedido. */
import { producir } from './linea.js';
import { evaluar } from './evaluar.js';
import { rajadas } from './semilla.js';

/* Cada nivel tiene una cinta (casilleros: N) o varias (cintas: [{ casilleros, fija }]). */
export const cintasDe = nivel => nivel.cintas || [{ casilleros: nivel.casilleros }];

export function cantidad(nivel, programa) {
  if (nivel.lote) return nivel.lote;
  if (nivel.pedido) return (programa && programa.repetir) || 1;
  return 1;
}

export function configurar(nivel, programa, materiales) {
  const n = cantidad(nivel, programa);
  return {
    entra: materiales[nivel.entra],
    cintas: cintasDe(nivel).map((c, i) => c.fija || ((programa.cintas && programa.cintas[i]) || []).slice(0, c.casilleros)),
    lote: n,
    rajadas: nivel.rajadas ? rajadas(nivel.rajadas.semilla, n, nivel.rajadas.cuantas) : [],
    prueba: nivel.prueba || null
  };
}

export function jugar(nivel, programa, datos) {
  const prod = producir(configurar(nivel, programa, datos.materiales), datos.estaciones);
  return Object.assign({ prod }, evaluar(nivel, prod));
}
