/* Diagramas del objetivo (HTML): secuencia, si, si anidado, bucle, repartir, juntar.
   Cajas con texto de verdad que se acomoda al ancho (se lee igual en la columna angosta y en el celular).
   Las ramas (SÍ/NO, 1/2) van en renglones con sangría. */
import { TX } from '../datos/textos.js';

const T = TX.diagrama;

const caja = (t, cls = '') => `<span class="fh-b ${cls}">${t}</span>`;
const preg = t => `<span class="fh-b fh-q">${t}</span>`;
// la flecha va pegada a la caja que sigue, así ningún renglón termina en una flecha suelta
const seguir = p => p.map((x, i) => i ? `<span class="fh-n"><span class="fh-ar" aria-hidden="true">→</span>${x}</span>` : x).join('');
const fila = (...p) => `<div class="fh-row">${seguir(p)}</div>`;
const rama = (lbl, cls, ...p) => `<div class="fh-br"><span class="fh-l ${cls}">${lbl}</span>${seguir(p)}</div>`;
const sub = html => `<div class="fh-sub">${html}</div>`;

export function diagrama(d) {
  if (!d) return '';
  let b = '';
  if (d.type === 'seq') b = fila(...d.steps.map((t, i) => caja(t, i === d.steps.length - 1 ? 'end' : '')));
  else if (d.type === 'if') b = fila(preg(d.q)) + sub(rama(T.si, 'yes', caja(d.yes, 'end')) + rama(T.no, 'no', caja(d.no, 'bad')));
  else if (d.type === 'ifif') b = fila(preg(d.q1)) + sub(rama(T.si, 'yes', caja(d.yes1, 'end')) + rama(T.no, 'no', preg(d.q2)) + sub(rama(T.si, 'yes', caja(d.yes2, 'end')) + rama(T.no, 'no', caja(d.no2, 'end'))));
  else if (d.type === 'ififif') b = fila(preg(T.sano)) + sub(rama(T.no, 'no', caja(T.tacho, 'bad')) + rama(T.si, 'yes', preg(T.mesa)) + sub(rama(T.si, 'yes', caja(T.camionMesas, 'end')) + rama(T.no, 'no', preg(T.hierro)) + sub(rama(T.si, 'yes', caja(T.camionHierro, 'end')) + rama(T.no, 'no', caja(T.camionCajoneras, 'end')))));
  else if (d.type === 'loop') b = fila(caja(d.step), preg(d.q)) + sub(rama(T.si, 'yes', caja(d.yes, 'end')) + rama(T.no, 'no', caja(d.no) + `<span class="fh-ar no" title="${T.otraVuelta}">↺</span>`));
  else if (d.type === 'split') b = fila(caja(T.entrada), caja(T.repartidor, 'acc')) + sub(rama('1', 'acc', caja(d.a)) + rama('2', 'acc', caja(d.b)));
  else if (d.type === 'par') b = rama(T.entrada1, 'in', caja(d.a)) + rama(T.entrada2, 'in', caja(d.b));
  else if (d.type === 'join') b = fila(caja(d.a)) + fila(caja(d.b)) + sub(rama('', '', caja(d.out, 'end')));
  else if (d.type === 'sub') b = fila(caja(T.tablaCorrederas), caja(T.brazoCajon, 'acc'), caja(T.cajon)) + fila(caja(T.tablaCajones), caja(T.brazoMueble, 'acc'), caja(T.cajonera, 'end'));
  return `<div class="fh" role="img" aria-label="${T.aria}">${b}</div>`;
}
