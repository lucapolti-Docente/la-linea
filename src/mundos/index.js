/* Registro de mundos. Para sumar un mundo: crear su archivo en src/datos/mundos/ y agregarlo a la lista.
   (Si trae generadores o reglas nuevas, van en src/generadores/ y src/reglas/niveles.js.) */
import muebles from '../datos/mundos/muebles.js';
import reci from '../datos/mundos/reci.js';
import usina from '../datos/mundos/usina.js';
import { STATIONS } from '../datos/estaciones.js';
import { GEN } from '../generadores/index.js';
import { CHECKS, BIN_CHECKS } from '../reglas/niveles.js';
import { PRUEBAS } from '../reglas/sensores.js';

export const MUNDOS = [muebles, reci, usina];

export const MUNDO = {};
for (const m of MUNDOS) {
  MUNDO[m.id] = m;
  m.levels.forEach((L, i) => {
    L.n = i + 1;
    // Los datos nombran generadores y reglas por texto; acá se cambian por las funciones.
    if (typeof L.gen === 'string') { if (!GEN[L.gen]) throw new Error(`Falta el generador ${L.gen} (nivel ${L.id})`); L.gen = GEN[L.gen]; }
    if (typeof L.check === 'string') { if (!CHECKS[L.check]) throw new Error(`Falta la regla ${L.check} (nivel ${L.id})`); L.check = CHECKS[L.check]; }
    if (typeof L.binCheck === 'string') { if (!BIN_CHECKS[L.binCheck]) throw new Error(`Falta la regla ${L.binCheck} (nivel ${L.id})`); L.binCheck = BIN_CHECKS[L.binCheck]; }
  });
}

/* Desde qué nivel aparece cada estación en la paleta de cada mundo (999 = nunca). */
for (const [k, d] of Object.entries(STATIONS)) {
  d.un = {};
  for (const m of MUNDOS) {
    const id = d.desbloqueo[m.id];
    const i = id ? m.levels.findIndex(l => l.id === id) : -1;
    d.un[m.id] = i < 0 ? 999 : i + 1;
  }
  if (d.sensor) { if (!PRUEBAS[k]) throw new Error(`Falta la pregunta del sensor ${k}`); d.test = PRUEBAS[k]; }
}
