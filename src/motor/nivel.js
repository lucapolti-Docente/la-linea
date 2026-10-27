/* Arma la línea de un nivel a partir de sus datos y del programa del chico, y la evalúa.
   programa: { cintas: [[ids o null], …], repetir: N o null }. Las cintas fijas del nivel se toman del nivel.
   Cuántas piezas: el lote fijo del nivel, o lo que diga Repetir si el nivel lo tiene. */
import { producir } from './linea.js';
import { evaluar } from './evaluar.js';
import { rajadas } from './semilla.js';

/* Cada nivel tiene una cinta (casilleros: N) o varias (cintas: [{ casilleros, fija }]). */
export const cintasDe = nivel => nivel.cintas || [{ casilleros: nivel.casilleros }];

export function cantidad(nivel, programa) {
  if (nivel.lote) return nivel.lote;
  if (nivel.repetir) return (programa && programa.repetir) || 1;
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

/* Todos los programas posibles de un nivel (cada casillero libre: una estación del panel o vacío),
   con el Repetir de la solución. Sirve para verificar que se pueda ganar y para npm run soluciones. */
export function programas(nivel) {
  const opciones = [null].concat(nivel.estaciones);
  const libres = cintasDe(nivel).map(c => (c.fija ? 0 : c.casilleros));
  const total = libres.reduce((a, b) => a + b, 0);
  const lista = [];
  const elegidos = [];
  (function armar(i) {
    if (i === total) {
      let k = 0;
      const cintas = libres.map(n => (n ? elegidos.slice(k, (k += n)) : null));
      lista.push({ cintas, repetir: nivel.solucion && nivel.solucion.repetir });
      return;
    }
    for (const o of opciones) { elegidos[i] = o; armar(i + 1); }
  })(0);
  return lista;
}

export function jugar(nivel, programa, datos) {
  const prod = producir(configurar(nivel, programa, datos.materiales), datos.estaciones);
  return Object.assign({ prod }, evaluar(nivel, prod));
}
