/* Geometría y dibujo de la cinta. Se calcula en píxeles reales del recuadro (1 unidad = 1 px),
   así los casilleros (botones HTML) quedan justo encima del dibujo SVG.
   - Horizontal (notebook): la pieza va de izquierda a derecha y las estaciones están arriba de la cinta.
   - Vertical (celular): la pieza baja y las estaciones están a la derecha.
   No guarda estado. */
import { TINTA, dibujoIcono } from './iconos.js';

const lim = (v, a, b) => Math.max(a, Math.min(b, v));

/* porCinta: casilleros de cada cinta, por ejemplo [4, 3]. extraArriba: lugar para el cartel de Repetir. */
export function geometria(W, H, porCinta, extraArriba) {
  const ns = porCinta.reduce((a, b) => a + b, 0) || 1;
  const nc = porCinta.length;
  const vertical = W < H * 0.9;
  const slots = [];
  const bandas = [];
  let entrada, salida, escala, ps;

  if (!vertical) {
    const m = 8, eW = lim(W * 0.1, 56, 110), g = nc > 1 ? 28 : 0;
    const sw = Math.min(180, (W - 2 * m - 2 * eW - g * (nc - 1)) / ns);
    ps = Math.min(sw * 0.72, 110, H * 0.26);
    escala = ps / 100;
    const abajo = ps * 0.8 + 12 + 40;   // lugar para la pieza, la cinta y los rodillos
    const sh = lim(Math.min(sw * 1.05, H - 2 * m - extraArriba - abajo), 56, 170);
    const alto = extraArriba + sh + abajo;
    const sy = Math.max(m, (H - alto) / 2) + extraArriba;
    const beltY = sy + sh + 12 + ps * 0.8;
    let x = m + eW + Math.max(0, (W - 2 * m - 2 * eW - g * (nc - 1) - sw * ns) / 2);
    porCinta.forEach((n, c) => {
      const x0 = x;
      for (let i = 0; i < n; i++, x += sw) slots.push({ cinta: c, i, x: x + 5, y: sy, w: sw - 10, h: sh, px: x + sw / 2, py: beltY });
      bandas.push({ x1: c === 0 ? m : x0 - g / 2 + 4, y1: beltY, x2: c === nc - 1 ? W - m : x + g / 2 - 4, y2: beltY });
      x += g;
    });
    entrada = { px: m + eW / 2, py: beltY };
    salida = { px: W - m - eW / 2, py: beltY };
  } else {
    const m = 6, eH = lim(H * 0.07, 34, 56), g = nc > 1 ? 22 : 0;
    const sh = Math.min(84, (H - 2 * m - 2 * eH - g * (nc - 1) - extraArriba) / ns);
    ps = Math.min(sh * 0.92, W * 0.26, 84);
    escala = ps / 100;
    const bx = m + ps / 2 + 6;
    let y = m + eH + extraArriba + Math.max(0, (H - 2 * m - 2 * eH - g * (nc - 1) - extraArriba - sh * ns) / 2);
    const sx = bx + ps / 2 + 10;
    porCinta.forEach((n, c) => {
      const y0 = y;
      for (let i = 0; i < n; i++, y += sh) slots.push({ cinta: c, i, x: sx, y: y + 3, w: W - sx - m, h: sh - 6, px: bx, py: y + sh / 2 + ps * 0.35 });
      bandas.push({ x1: bx, y1: c === 0 ? m + extraArriba : y0 - g / 2 + 4, x2: bx, y2: c === nc - 1 ? H - m : y + g / 2 - 4 });
      y += g;
    });
    entrada = { px: bx, py: m + extraArriba + eH / 2 + ps * 0.35 };
    salida = { px: bx, py: H - m - eH / 2 + ps * 0.35 - 6 };
  }
  return { W, H, vertical, slots, bandas, entrada, salida, escala, ps };
}

/* Dónde se dibuja la pieza para que su base quede en (px, py). */
export const transformPieza = (geo, punto, extra) =>
  'translate(' + punto.px.toFixed(1) + ' ' + punto.py.toFixed(1) + ') scale(' + geo.escala.toFixed(3) + ')' + (extra || '');

/* La cinta con rodillos, la tolva de entrada, la caja de salida y (si hay) la caja de reciclaje. */
export function svgCinta(geo, opciones) {
  const o = opciones || {};
  let s = '';
  const grosor = 18;
  geo.bandas.forEach(b => {
    if (!geo.vertical) {
      const y = b.y1 + 2, largo = b.x2 - b.x1;
      s += `<rect x="${b.x1}" y="${y}" width="${largo}" height="${grosor}" rx="9" fill="#3B4252" stroke="${TINTA}" stroke-width="3"/>`;
      s += `<path class="cinta-rayas" d="M${b.x1 + 9} ${y + grosor / 2} H${b.x2 - 9}" stroke="#7A8696" stroke-width="4" stroke-dasharray="6 14"/>`;
      for (let x = b.x1 + 14; x < b.x2 - 6; x += 30) s += `<circle cx="${x}" cy="${y + grosor + 7}" r="6" fill="#7A8696" stroke="${TINTA}" stroke-width="2.5"/>`;
    } else {
      const x = b.x1 - grosor / 2 - 14, largo = b.y2 - b.y1;
      const ancho = geo.ps + 12;
      s += `<rect x="${b.x1 - ancho / 2}" y="${b.y1}" width="${ancho}" height="${largo}" rx="9" fill="#3B4252" stroke="${TINTA}" stroke-width="3"/>`;
      s += `<path class="cinta-rayas" d="M${b.x1} ${b.y1 + 9} V${b.y2 - 9}" stroke="#56606E" stroke-width="${ancho - 16}" stroke-dasharray="4 16"/>`;
      void x;
    }
  });
  // entre dos cintas: una flecha que muestra que lo que sale de una entra en la otra
  for (let i = 1; i < geo.bandas.length; i++) {
    const a = geo.bandas[i - 1], b = geo.bandas[i];
    if (!geo.vertical) {
      const x = (a.x2 + b.x1) / 2, y = a.y1 - 14;
      s += `<path d="M${x - 9} ${y} h14 M${x + 1} ${y - 7} l7 7 l-7 7" fill="none" stroke="#FF7A1A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else {
      const y = (a.y2 + b.y1) / 2, x = a.x1 + geo.ps / 2 + 14;
      s += `<path d="M${x} ${y - 8} v14 M${x - 7} ${y} l7 7 l7 -7" fill="none" stroke="#FF7A1A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
  }
  // entrada (tolva) y salida (caja)
  const t = Math.min(52, geo.ps * 0.7);
  s += `<g transform="translate(${geo.entrada.px - t / 2} ${geo.entrada.py - t - (geo.vertical ? geo.ps * 0.35 - t / 2 : 6)}) scale(${t / 48})"><path d="M4 6 h40 l-10 22 h-20 Z" fill="#E9C46A" stroke="${TINTA}" stroke-width="3" stroke-linejoin="round"/><path d="M18 28 v10 h12 v-10" fill="#E9C46A" stroke="${TINTA}" stroke-width="3"/></g>`;
  s += `<g class="caja-salida" transform="translate(${geo.salida.px - t / 2} ${geo.salida.py - t - (geo.vertical ? geo.ps * 0.35 - t / 2 : 4)}) scale(${t / 48})">${dibujoIcono('caja')}</g>`;
  if (o.reciclaje) {
    const r = o.reciclaje, tr = Math.min(40, geo.ps * 0.5);
    const x = geo.vertical ? r.px - geo.ps / 2 - tr * 0.2 : r.px - tr / 2;
    const y = geo.vertical ? r.py - tr : r.py + 4;
    s += `<g class="caja-reciclaje" transform="translate(${x} ${y}) scale(${tr / 48})">${dibujoIcono('reciclar')}</g>`;
  }
  return s;
}

/* Marco naranja de Repetir alrededor de toda la cinta. */
export function svgMarcoRepetir(geo, alto) {
  const m = 3;
  return `<rect class="marco-repetir" x="${m}" y="${m + (geo.vertical ? 0 : 0)}" width="${geo.W - 2 * m}" height="${geo.H - 2 * m}" rx="14" fill="none" stroke="#FF7A1A" stroke-width="5" stroke-dasharray="12 8"/>` +
    (alto ? '' : '');
}
