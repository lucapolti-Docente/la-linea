/* Libre: todas las estaciones y todos los materiales, sin pedido. Va directo a la cinta (no hay selector de niveles). */
import { NIVELES } from '../datos/niveles/index.js';
import { MODOS_TXT } from '../datos/textos.js';

export default Object.assign({ id: 'libre', color: 'var(--libre)', icono: 'libre', niveles: NIVELES.libre, libre: true }, MODOS_TXT.libre);
