/* Dibuja una pieza a partir de su estado (el objeto del motor). No guarda nada.
   La pieza ocupa un cuadro de 100 × 70 apoyado en y = 0 (la cinta), centrado en x = 0: de y = −70 a 0. */
import { TINTA } from './iconos.js';

export const COLORES = {
  madera: '#D9A066', maderaOsc: '#A86B32', pintura: '#2A9D8F', pinturaOsc: '#1D6F65',
  metal: '#AEB8C2', metalOsc: '#6B7785', plastico: '#F28AB2', caliente: '#FF8A3D',
  envase: '#F4F7FA', shampoo: '#E84F9A', tapa: '#D9362B', etiqueta: '#FFD166', molde: '#9AA7B4'
};
const C = COLORES;
const L = 'stroke="' + TINTA + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const tiene = (p, d) => (p.defectos || []).indexOf(d) >= 0;

/* Una tabla vista de costado-arriba: superficie y canto. x, y: esquina de arriba a la izquierda. */
function tabla(p, x, y, w) {
  const color = p.pintada ? C.pintura : C.madera;
  const canto = p.pintada ? C.pinturaOsc : C.maderaOsc;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="16" rx="3" fill="${color}" ${L}/>`;
  s += `<rect x="${x}" y="${y + 16}" width="${w}" height="7" rx="2" fill="${canto}" ${L}/>`;
  if (!p.pintada) {
    // vetas: en zigzag si está áspera, suaves si está lisa
    s += p.lisa
      ? `<path d="M${x + 8} ${y + 6} h${w * 0.5} M${x + w * 0.35} ${y + 11} h${w * 0.5}" stroke="${C.maderaOsc}" stroke-width="2" stroke-linecap="round"/>`
      : `<path d="M${x + 6} ${y + 6} l6 3 l6 -3 l6 3 l6 -3 l6 3 M${x + w * 0.45} ${y + 11} l6 3 l6 -3 l6 3 l6 -3" fill="none" stroke="${C.maderaOsc}" stroke-width="2"/>`;
  }
  if (p.pintada && !p.lisa || tiene(p, 'pintura_despareja')) s += `<path d="M${x + 6} ${y + 5} h${w * 0.3} M${x + w * 0.5} ${y + 10} h${w * 0.35}" stroke="#7FD1C6" stroke-width="3" stroke-linecap="round"/>`;
  if (tiene(p, 'pintura_raspada')) s += `<g fill="${C.madera}"><ellipse cx="${x + w * 0.25}" cy="${y + 8}" rx="7" ry="4"/><ellipse cx="${x + w * 0.7}" cy="${y + 9}" rx="9" ry="4"/></g>`;
  if (tiene(p, 'bordes_sin_pintar')) s += `<rect x="${x + 1.5}" y="${y + 1.5}" width="6" height="20" fill="${C.madera}"/><rect x="${x + w - 7.5}" y="${y + 1.5}" width="6" height="20" fill="${C.madera}"/>`;
  if (tiene(p, 'pintura_marcada')) s += `<g fill="${C.pinturaOsc}"><circle cx="${x + w * 0.3}" cy="${y + 8}" r="2.5"/><circle cx="${x + w * 0.62}" cy="${y + 7}" r="2.5"/><circle cx="${x + w * 0.8}" cy="${y + 10}" r="2.5"/></g>`;
  if (tiene(p, 'cola_sobre_pintura')) s += `<path d="M${x + w * 0.4} ${y + 2} v12 M${x + w * 0.66} ${y + 2} v9" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>`;
  if (tiene(p, 'pintura_quemada')) s += `<g fill="#3B2A1A" opacity="0.8"><circle cx="${x + w * 0.2}" cy="${y + 8}" r="4"/><circle cx="${x + w * 0.78}" cy="${y + 9}" r="4"/></g>`;
  if (p.agujero) {
    if (tiene(p, 'pintura_saltada')) s += `<circle cx="${x + w / 2}" cy="${y + 8}" r="10" fill="${C.madera}"/>`;
    s += `<ellipse cx="${x + w / 2}" cy="${y + 8}" rx="6" ry="4" fill="${TINTA}"/>`;
  }
  if (p.rajada) s += `<path d="M${x + w * 0.55} ${y} l-4 6 l5 4 l-4 6 l3 7" fill="none" stroke="${TINTA}" stroke-width="2.5"/>`;
  if (!p.cortada) s += `<path d="M${x + w * 0.72} ${y - 4} v32" stroke="#E4572E" stroke-width="2.5" stroke-dasharray="4 4"/>`;
  return s;
}

/* Marcas de la unión entre tablero y patas. */
function marcasUnion(p, xs, y) {
  if (p.union === 'clavos') return xs.map(x => `<circle cx="${x}" cy="${y}" r="3" fill="${TINTA}"/>`).join('');
  if (p.union === 'cola') return xs.map(x => `<path d="M${x - 6} ${y} h12" stroke="#FFFFFF" stroke-width="3"/>`).join('');
  if (p.union === 'soldadura') return xs.map(x => `<circle cx="${x}" cy="${y}" r="5" fill="#E9A23B" ${L}/>`).join('');
  return '';
}

function mesaConPatas(p) {
  const w = 74, x = -w / 2;
  if (!p.unida) {
    // tablero arriba, las dos patas acostadas al lado: piezas sueltas
    return tabla(p, x, -44, w) +
      `<rect x="-44" y="-14" width="40" height="9" rx="2" fill="${p.pintada ? C.pintura : C.madera}" ${L}/>` +
      `<rect x="4" y="-14" width="40" height="9" rx="2" fill="${p.pintada ? C.pintura : C.madera}" ${L}/>`;
  }
  const pata = p.pintada ? C.pintura : C.madera;
  return `<rect x="${x + 8}" y="-40" width="9" height="40" fill="${pata}" ${L}/><rect x="${x + w - 17}" y="-40" width="9" height="40" fill="${pata}" ${L}/>` +
    tabla(p, x, -62, w) + marcasUnion(p, [x + 12.5, x + w - 12.5], -40);
}

function banco(p) {
  const color = p.pintada ? '#D9362B' : C.metal, osc = p.pintada ? '#8E1F17' : C.metalOsc;
  if (!p.unida) {
    // caños sueltos
    return [-36, -22, -8].map(y => `<rect x="-42" y="${y}" width="84" height="10" rx="5" fill="${color}" ${L}/>`).join('');
  }
  let s = `<path d="M-34 0 v-30 M34 0 v-30" stroke="${TINTA}" stroke-width="11" stroke-linecap="round"/><path d="M-34 0 v-30 M34 0 v-30" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
  s += `<rect x="-44" y="-42" width="88" height="12" rx="6" fill="${color}" ${L}/><path d="M-36 -36 h72" stroke="${osc}" stroke-width="2"/>`;
  s += marcasUnion(p, [-34, 34], -30);
  if (!p.lisa) s += `<path d="M-40 -28 l-4 3 M-30 -28 l3 4 M30 -28 l-3 4 M40 -28 l4 3" ${L}/>`;
  if (tiene(p, 'pintura_despareja')) s += `<path d="M-30 -38 h20 M5 -38 h22" stroke="#FF9B8F" stroke-width="3" stroke-linecap="round"/>`;
  if (tiene(p, 'pintura_raspada')) s += `<g fill="${C.metal}"><ellipse cx="-18" cy="-36" rx="7" ry="3"/><ellipse cx="18" cy="-36" rx="8" ry="3"/></g>`;
  if (tiene(p, 'pintura_quemada')) s += `<g fill="#3B2A1A" opacity="0.8"><circle cx="-34" cy="-34" r="5"/><circle cx="34" cy="-34" r="5"/></g>`;
  return s;
}

/* Envase de plástico: en el molde, caliente, deformado, lleno, tapado, con etiqueta. */
function envase(p) {
  if (!p.moldeado && !p.envase) {
    if (p.caliente) return `<path d="M-30 0 q-4 -24 14 -26 q10 -12 22 -2 q16 2 14 28 Z" fill="${C.caliente}" ${L}/><path d="M-12 -18 q4 -4 8 0 M6 -14 q4 -4 8 0" fill="none" stroke="#FFD23F" stroke-width="2.5"/>`;
    let s = '';
    const granos = [[-24, -6], [-12, -6], [0, -6], [12, -6], [24, -6], [-18, -16], [-6, -16], [6, -16], [18, -16], [-12, -26], [0, -26], [12, -26], [-6, -35], [6, -35]];
    granos.forEach(g => { s += `<circle cx="${g[0]}" cy="${g[1]}" r="6" fill="${C.plastico}" ${L}/>`; });
    return s;
  }
  const deforme = tiene(p, 'envase_deformado');
  const cuerpo = deforme
    ? 'M-16 0 q-6 -20 2 -40 q-2 -8 6 -10 v-10 h12 v10 q12 4 4 14 q12 14 8 36 Z'
    : 'M-18 0 v-38 q0 -10 10 -12 v-10 h16 v10 q10 2 10 12 v38 Z';
  const color = p.caliente ? C.caliente : p.envase ? C.envase : '#F7C6DA';
  let s = '';
  if (!p.envase) s += `<rect x="-30" y="-66" width="60" height="66" rx="4" fill="${C.molde}" ${L}/><path d="M0 -66 v66" ${L}/>`;
  s += `<path d="${cuerpo}" fill="${color}" ${L}/>`;
  if (p.lleno) s += `<path d="M-15 -3 v-28 h30 v28 Z" fill="${C.shampoo}" opacity="0.85"/>`;
  if (p.etiquetada) s += `<rect x="-14" y="-28" width="28" height="16" rx="2" fill="${C.etiqueta}" ${L}/><path d="M-7 -20 h14" stroke="${TINTA}" stroke-width="2.5"/>`;
  if (p.tapado) s += `<rect x="-11" y="-68" width="22" height="10" rx="3" fill="${C.tapa}" ${L}/>`;
  return s;
}

/* El dibujo completo de la pieza (sin posición: se ubica con un transform afuera). */
export function pieza(p) {
  let s;
  if (p.forma === 'kit') s = mesaConPatas(p);
  else if (p.forma === 'canos') s = banco(p);
  else if (p.material === 'plastico') s = envase(p);
  else s = tabla(p, p.cortada ? (tiene(p, 'cortada_de_mas') ? -24 : -34) : -48, -24, p.cortada ? (tiene(p, 'cortada_de_mas') ? 48 : 68) : 96);
  return s;
}

/* La pieza modelo: lo que entra más lo que pide el cliente. */
export const modelo = (entra, pedido) => pieza(Object.assign({ defectos: [] }, entra, pedido));
