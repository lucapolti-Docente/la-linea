/* Los modos de la pantalla de inicio, en este orden.
   Cada modo es un archivo con: id, nombre, grado, descripcion (de textos.js), color, icono,
   niveles (su lista de src/datos/niveles/), desde (número del primer nivel en la numeración de 1 a 10) y libre.
   Para sumar un modo: creá su archivo acá, sus niveles en src/datos/niveles/ y agregalo a la lista. */
import taller from './taller.js';
import fabrica from './fabrica.js';
import planta from './planta.js';
import libre from './libre.js';

export const MODOS = [taller, fabrica, planta, libre];
export const modo = id => MODOS.find(m => m.id === id) || MODOS[0];
