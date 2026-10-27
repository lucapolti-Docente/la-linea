/* Modo libre: todas las estaciones y todos los materiales, sin pedido ni meta.
   Se ve la pieza que sale y el reloj. El material se elige en pantalla. */
import { ESTACIONES } from '../estaciones.js';

export const LIBRE = [
  {
    id: 'libre',
    nombre: 'Taller libre',
    cliente: 'nora',
    pide: 'Inventá lo que quieras',
    consigna: 'Elegí un material, armá la cinta y mirá qué sale.',
    entra: 'tabla',
    materiales: ['tabla', 'kit', 'canos', 'granos', 'envase'],
    libre: true,
    estaciones: Object.keys(ESTACIONES).filter(id => !ESTACIONES[id].prueba),
    casilleros: 7,
    repetir: true
  }
];
