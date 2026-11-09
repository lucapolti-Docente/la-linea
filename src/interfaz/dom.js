/* Lo mínimo para tocar la pantalla, y el estado de la interfaz (no del juego). */
import { TX } from '../datos/textos.js';

export const $ = s => document.querySelector(s);

/* tool: herramienta de la paleta ('cinta', 'borrar' o 'st:<estación>') · hover: celda bajo el puntero
   drag: arrastre en curso · pick: selector de lados abierto · current: pantalla visible · mundo: id del mundo elegido */
export const ui = { tool: 'cinta', hover: null, drag: null, dpr: 1, pick: null, current: 'home', mundo: 'muebles' };

/* Texto de TX por ruta: 'juego.reloj' → TX.juego.reloj */
export const tx = ruta => ruta.split('.').reduce((o, k) => (o ? o[k] : undefined), TX);

/* Completa los textos fijos del HTML: data-t (texto), data-t-html, data-t-aria y data-t-placeholder. */
export function aplicarTextos(raiz = document) {
  raiz.querySelectorAll('[data-t]').forEach(el => { el.textContent = tx(el.dataset.t); });
  raiz.querySelectorAll('[data-t-html]').forEach(el => { el.innerHTML = tx(el.dataset.tHtml); });
  raiz.querySelectorAll('[data-t-aria]').forEach(el => { el.setAttribute('aria-label', tx(el.dataset.tAria)); });
  raiz.querySelectorAll('[data-t-placeholder]').forEach(el => { el.setAttribute('placeholder', tx(el.dataset.tPlaceholder)); });
}

/* Minutos de fábrica: 65 → "1:05". */
export function fmtHora(t) { return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); }
