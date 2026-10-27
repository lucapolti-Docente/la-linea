/* La cinta en pantalla: dibuja el SVG, ubica los casilleros (botones) encima y maneja la capa de piezas. */
import { S, $, el } from './estado.js';
import { geometria, svgCinta, transformPieza } from '../dibujo/cinta.js';
import { pieza as dibujoPieza } from '../dibujo/pieza.js';
import { icono } from '../dibujo/iconos.js';
import { cintasDe, puestos } from '../motor/index.js';
import { ESTACIONES } from '../datos/estaciones.js';
import { DATOS } from '../datos/index.js';
import { T } from '../datos/textos.js';

const NS = 'http://www.w3.org/2000/svg';

/* Las cintas como las ve la pantalla: las fijas con sus estaciones, las otras con lo que puso el chico. */
export function cintasEnPantalla() {
  return cintasDe(S.nivel).map((c, i) => c.fija ? c.fija.slice() : S.programa.cintas[i]);
}

/* Dónde está el casillero i de la cinta c (en la lista plana de la geometría). */
export function slotDe(c, i) {
  return S.geo.slots.find(s => s.cinta === c && s.i === i);
}
export const botonDe = (c, i) => document.querySelector('.casillero[data-c="' + c + '"][data-i="' + i + '"]');

/* Dónde queda la caja de reciclaje: cerca de la caja de salida. */
export function puntoReciclaje() {
  const g = S.geo;
  return g.vertical
    ? { px: Math.min(g.W - g.ps * 0.45, g.salida.px + g.ps * 1.3), py: g.salida.py }
    : { px: g.salida.px, py: g.salida.py - g.ps * 1.15 };
}

export function dibujarCinta() {
  const caja = $('cintaCaja');
  const W = caja.clientWidth, H = caja.clientHeight;
  if (!W || !H) return;
  const porCinta = cintasDe(S.nivel).map(c => c.casilleros);
  const conRepetir = !!S.nivel.repetir && S.programa.repetir;
  S.geo = geometria(W, H, porCinta, conRepetir ? 46 : (S.nivel.lote ? 34 : 0));
  const svg = $('cintaSvg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  const tieneSensor = S.nivel.libre || S.nivel.estaciones.indexOf('sensor') >= 0;
  $('capaCinta').innerHTML = svgCinta(S.geo, { reciclaje: tieneSensor ? puntoReciclaje() : null }) +
    (conRepetir ? `<rect x="3" y="3" width="${W - 6}" height="${H - 6}" rx="13" fill="none" stroke="#FF7A1A" stroke-width="5" stroke-dasharray="12 8"/>` : '');
  dibujarCasilleros();
  // mientras no se produce, el material espera en la entrada
  if (!S.ocupado) {
    $('capaPiezas').innerHTML = '';
    nuevaPieza(Object.assign({ defectos: [] }, DATOS.materiales[S.nivel.entra]), S.geo.entrada);
  }
}

export function dibujarCasilleros() {
  const cont = $('casilleros');
  // si el foco estaba en un casillero (teclado), vuelve al mismo después de redibujar
  const activo = document.activeElement;
  const enFoco = activo && activo.classList && activo.classList.contains('casillero') ? [activo.dataset.c, activo.dataset.i] : null;
  cont.innerHTML = '';
  const cintas = cintasEnPantalla();
  const defs = cintasDe(S.nivel);
  const lenta = marcaLenta(cintas);
  let n = 0;
  S.geo.slots.forEach(s => {
    n++;
    const id = cintas[s.cinta][s.i];
    const fija = !!defs[s.cinta].fija;
    const est = id && ESTACIONES[id];
    const b = el('button', 'casillero' + (est ? ' lleno' : '') + (est && est.tipo === 'maquina' ? ' maquina' : '') + (fija ? ' fija' : '') + (s.h < 66 ? ' chico' : ''));
    b.dataset.c = s.cinta; b.dataset.i = s.i;
    b.style.left = s.x + 'px'; b.style.top = s.y + 'px'; b.style.width = s.w + 'px'; b.style.height = s.h + 'px';
    if (est) {
      b.innerHTML = '<span class="num">' + n + '</span><span class="ico">' + icono(id) + '</span><span class="nom">' + est.nombre + '</span><span class="min">' + T.minutos(est.minutos) + '</span>' +
        (fija ? '<span class="candado">' + icono('candado') + '</span>' : est.tipo === 'maquina' ? '<span class="engranaje">' + icono('engranaje') + '</span>' : '') +
        '<span class="lenta-txt">' + T.lenta + '</span>';
      b.setAttribute('aria-label', T.casillero(n) + ': ' + est.nombre + (fija ? ' (' + T.fija + ')' : ''));
    } else {
      b.innerHTML = '<span class="num">' + n + '</span>';
      b.setAttribute('aria-label', T.casillero(n) + ': ' + T.vacio);
    }
    if (fija) b.disabled = true;
    if (lenta && lenta.cinta === s.cinta && lenta.casilleros.indexOf(s.i) >= 0) b.classList.add('lenta');
    if (S.elegida && !est && !fija) b.classList.add('destino');
    cont.appendChild(b);
    if (enFoco && enFoco[0] == s.cinta && enFoco[1] == s.i) b.focus();
  });
}

/* En los niveles que lo piden, la estación más lenta se marca en rojo (si hay más de una estación). */
function marcaLenta(cintas) {
  if (!S.nivel.marcarLenta) return null;
  const ps = puestos(cintas);
  if (ps.length < 2) return null;
  let max = -1, cual = null;
  ps.forEach(p => { const r = ESTACIONES[p.id].minutos / p.k; if (r > max) { max = r; cual = p; } });
  return cual;
}

/* ---------- Piezas ---------- */
export function nuevaPieza(estado, punto) {
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'pieza');
  g.innerHTML = dibujoPieza(estado);
  g.setAttribute('transform', transformPieza(S.geo, punto));
  $('capaPiezas').appendChild(g);
  return g;
}
export const redibujarPieza = (g, estado) => { g.innerHTML = dibujoPieza(estado); };
export const ubicarPieza = (g, punto, extra) => g.setAttribute('transform', transformPieza(S.geo, punto, extra));
export function limpiarPiezas() {
  $('capaPiezas').innerHTML = '';
  $('capaEfectos').innerHTML = '';
  document.querySelectorAll('.casillero').forEach(b => b.classList.remove('trabajando', 'mal', 'peor'));
}

/* Un efecto suelto (humo, chispas, gotas) encima de un punto. */
export function efecto(punto, tipo) {
  const g = document.createElementNS(NS, 'g');
  const e = S.geo.escala;
  const color = tipo === 'agua' ? '#E84F9A' : tipo === 'fuego' ? '#FF7A1A' : '#7A8696';
  let s = '';
  for (let i = 0; i < 5; i++) s += `<circle cx="${(i - 2) * 16}" cy="${-60 - (i % 2) * 18}" r="${10 + (i % 3) * 4}" fill="${color}" opacity="0.8"/>`;
  g.innerHTML = '<g class="efecto-humo">' + s + '</g>';
  g.setAttribute('transform', 'translate(' + punto.px + ' ' + punto.py + ') scale(' + e + ')');
  $('capaEfectos').appendChild(g);
  setTimeout(() => g.remove(), 1200);
}
