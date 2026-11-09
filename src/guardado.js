/* Progreso en localStorage, con la misma clave y forma que el juego original:
   laLinea.v1 = {best: {[mundo]: {[idDeNivel]: estrellas}}, name}. Siempre con try/catch. */
import { MUNDOS } from './mundos/index.js';
import { TX } from './datos/textos.js';
import { fmt } from './datos/mensajes.js';

export const SAVE_KEY = 'laLinea.v1';
export const bestW = {};
for (const m of MUNDOS) bestW[m.id] = {};
export const PLAYER = { name: '' };

export function loadSave() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    for (const w in (d.best || {})) bestW[w] = Object.assign(bestW[w] || {}, d.best[w]);
    if (d.name) PLAYER.name = d.name;
  } catch (e) { /* sin localStorage: se juega igual, sin guardar */ }
}

export function saveAll() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ best: bestW, name: PLAYER.name })); } catch (e) { /* idem */ }
}

/* Guarda las estrellas de un nivel si son más que las que tenía. */
export function guardarEstrellas(mundo, id, estrellas) {
  bestW[mundo][id] = Math.max(bestW[mundo][id] || 0, estrellas);
  saveAll();
}

export function borrarProgreso() {
  for (const w in bestW) bestW[w] = {};
  saveAll();
}

/* Resumen de texto para pegarle al docente. */
export function progText() {
  const P = TX.progreso;
  const lines = [fmt(P.textoTitulo, { nombre: PLAYER.name || P.sinNombre, fecha: new Date().toLocaleDateString('es-AR') })];
  for (const Wd of MUNDOS) {
    const b = bestW[Wd.id] || {};
    const done = Wd.levels.filter(L => b[L.id]).length, st = Wd.levels.reduce((a, L) => a + (b[L.id] || 0), 0);
    lines.push(fmt(P.textoMundo, { mundo: Wd.name, done, total: Wd.levels.length, st, max: Wd.levels.length * 3 }));
    lines.push('  ' + Wd.levels.map((L, i) => `${i + 1}:${b[L.id] ? '*'.repeat(b[L.id]) : '-'}`).join(' '));
  }
  return lines.join('\n');
}
