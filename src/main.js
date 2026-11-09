/* Punto de entrada: estilos, textos fijos, progreso guardado y pantalla de inicio. */
import './estilos/juego.css';
import './mundos/index.js';
import { aplicarTextos, ui } from './interfaz/dom.js';
import { loadSave } from './guardado.js';
import { conectarPantallas, show } from './interfaz/pantallas.js';
import { conectarJuego, startLevel } from './interfaz/juego.js';
import { showIntro, closeModal } from './interfaz/ventanas.js';
import { G } from './motor/estado.js';

aplicarTextos();
loadSave();
conectarPantallas();
conectarJuego();

// Para las pruebas automáticas (capturas con una semilla fija). El juego no lo usa.
window.laLinea = { show, startLevel, showIntro, closeModal, ui, get G() { return G; } };
