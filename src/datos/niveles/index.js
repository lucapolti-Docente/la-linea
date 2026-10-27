/* Todos los niveles, por modo. El orden de cada lista es el orden en pantalla.
   Para sumar un nivel: agregalo a la lista de su modo con un id nuevo y su solución (el test la prueba). */
import { TALLER } from './taller.js';
import { FABRICA } from './fabrica.js';
import { PLANTA } from './planta.js';
import { LIBRE } from './libre.js';

export const NIVELES = { taller: TALLER, fabrica: FABRICA, planta: PLANTA, libre: LIBRE };
