/* Planta (6.º y 7.º): niveles 7 a 10. */
import { NIVELES } from '../datos/niveles/index.js';
import { MODOS_TXT } from '../datos/textos.js';

export default Object.assign({ id: 'planta', color: 'var(--planta)', icono: 'sensor', niveles: NIVELES.planta, desde: 7 }, MODOS_TXT.planta);
