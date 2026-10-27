/* Estado de la pantalla y ayudas chicas para el DOM. */
import { Guardado } from '../guardado.js';
import { Sonido } from '../sonido.js';

export const S = {
  guardado: Guardado.leer(),
  modo: null,         // objeto de src/modos/
  idx: 0,             // número del nivel dentro del modo
  nivel: null,        // datos del nivel (en libre, con el material elegido)
  programa: null,     // { cintas: [[ids o null]], repetir }
  elegida: null,      // estación elegida para poner (id), o null
  grupo: 'madera',    // pestaña del panel en el modo libre
  material: 'tabla',  // material elegido en el modo libre
  geo: null,          // geometría de la cinta
  corrida: 0,         // cambia cada vez que se corta una animación
  ocupado: false,     // hay una producción empezada (puede estar en pausa entre pasos)
  animando: false,    // hay una animación andando: no se puede tocar la cinta
  paso: null          // producción de a un paso: { cola, r }
};

export const $ = id => document.getElementById(id);

export function el(tag, clase, html) {
  const e = document.createElement(tag);
  if (clase) e.className = clase;
  if (html != null) e.innerHTML = html;
  return e;
}

export const snd = (n, dato) => Sonido.efecto(n, dato);

export function guardar(cambios) {
  S.guardado = Object.assign({}, S.guardado, cambios || {});
  Guardado.escribir(S.guardado);
}

export const estrellasDe = id => (S.guardado.estrellas && S.guardado.estrellas[id]) || 0;

/* Velocidad de las animaciones: con movimiento reducido, casi instantáneas. */
export function factorTiempo() {
  try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0.15; } catch (e) { /* sin matchMedia */ }
  return 1;
}

export const esperar = ms => new Promise(r => setTimeout(r, ms * factorTiempo()));

export function sacudir(nodo) {
  if (!nodo) return;
  nodo.classList.remove('sacudir');
  void nodo.getBoundingClientRect();
  nodo.classList.add('sacudir');
  setTimeout(() => nodo.classList.remove('sacudir'), 500);
}
