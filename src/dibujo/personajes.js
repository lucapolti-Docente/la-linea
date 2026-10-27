/* Dibuja el busto de un personaje (datos en src/datos/personajes.js), en un cuadro de 100 × 100. */
import { TINTA } from './iconos.js';

const L = 'stroke="' + TINTA + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';

const PEINADOS = {
  corto: c => `<path d="M28 44 q-2 -26 22 -28 q24 2 22 28 q-4 -12 -22 -14 q-16 2 -22 14 Z" fill="${c}" ${L}/>`,
  rulos: c => [[30, 34], [40, 24], [52, 20], [64, 24], [72, 34], [27, 46], [74, 46]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${c}" ${L}/>`).join(''),
  rodete: c => `<circle cx="50" cy="16" r="10" fill="${c}" ${L}/><path d="M28 46 q-2 -28 22 -28 q24 0 22 28 q-6 -14 -22 -14 q-16 0 -22 14 Z" fill="${c}" ${L}/>`,
  colita: c => `<path d="M70 36 q16 10 8 30 q-6 -10 -10 -16 Z" fill="${c}" ${L}/><path d="M28 46 q-2 -28 22 -28 q24 0 22 28 q-6 -14 -22 -14 q-16 0 -22 14 Z" fill="${c}" ${L}/>`,
  largo: c => `<path d="M26 72 q-8 -50 24 -54 q32 4 24 54 l-8 0 q4 -26 -2 -38 q-14 -6 -28 0 q-6 12 -2 38 Z" fill="${c}" ${L}/>`,
  pelado: c => `<path d="M28 48 q0 -10 4 -14 M72 48 q0 -10 -4 -14" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`
};

const EXTRAS = {
  casco: () => `<path d="M24 38 q0 -26 26 -26 q26 0 26 26 Z" fill="#FFD23F" ${L}/><path d="M18 38 h64" ${L}/><path d="M50 12 v26" stroke="#E0B000" stroke-width="3"/>`,
  gorro: () => `<path d="M32 30 q-12 -8 -4 -18 q6 -8 14 -2 q8 -10 16 0 q8 -6 14 2 q8 10 -4 18 Z" fill="#FFFFFF" ${L}/><rect x="32" y="26" width="36" height="8" fill="#FFFFFF" ${L}/>`,
  silbato: () => `<path d="M36 76 l14 10 l14 -10" fill="none" stroke="#FFFFFF" stroke-width="2.5"/><rect x="44" y="84" width="12" height="7" rx="3" fill="#C9D3DD" ${L}/>`,
  tijera: () => `<g transform="translate(70 76) rotate(-30)"><circle cx="-4" cy="6" r="4" fill="none" ${L}/><circle cx="6" cy="6" r="4" fill="none" ${L}/><path d="M-2 3 l8 -14 M4 3 l-8 -14" ${L}/></g>`,
  anteojos: () => `<circle cx="41" cy="50" r="7" fill="none" ${L}/><circle cx="59" cy="50" r="7" fill="none" ${L}/><path d="M48 50 h4" ${L}/>`,
  'pañuelo': () => `<path d="M28 36 q22 -14 44 0 l-2 6 q-20 -10 -40 0 Z" fill="#E84F9A" ${L}/>`,
  nada: () => ''
};

export function personaje(p) {
  const peinado = PEINADOS[p.peinado] || PEINADOS.corto;
  const extra = EXTRAS[p.extra] || EXTRAS.nada;
  const atras = p.peinado === 'largo' || p.peinado === 'colita';
  let s = '';
  // ropa (hombros)
  s += `<path d="M14 100 q2 -26 36 -26 q34 0 36 26 Z" fill="${p.ropa}" ${L}/>`;
  if (p.extra === 'casco') s += `<path d="M38 76 v24 M62 76 v24" stroke="#FFD23F" stroke-width="4"/>`;
  s += `<rect x="43" y="64" width="14" height="14" fill="${p.piel}" ${L}/>`;
  if (atras) s += peinado(p.pelo);
  // cara
  s += `<ellipse cx="50" cy="50" rx="22" ry="24" fill="${p.piel}" ${L}/>`;
  s += `<circle cx="42" cy="50" r="3" fill="${TINTA}"/><circle cx="58" cy="50" r="3" fill="${TINTA}"/>`;
  s += `<path d="M42 61 q8 7 16 0" fill="none" ${L}/>`;
  if (!atras) s += peinado(p.pelo);
  s += extra();
  return s;
}

export const svgPersonaje = (p, clase) =>
  '<svg class="' + (clase || 'cara') + '" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' + personaje(p) + '</svg>';
