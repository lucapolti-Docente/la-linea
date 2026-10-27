/* Pantalla de inicio (cuatro modos) y selector de pedidos de cada modo. */
import { S, $, el, snd, guardar, estrellasDe } from './estado.js';
import { cargarNivel, cortar } from './juego.js';
import { cerrar } from './ventanas.js';
import { icono, dibujoIcono } from '../dibujo/iconos.js';
import { svgPersonaje } from '../dibujo/personajes.js';
import { MODOS, modo as modoPorId } from '../modos/index.js';
import { PERSONAJES } from '../datos/personajes.js';
import { T } from '../datos/textos.js';

function mostrar(id) {
  ['inicio', 'niveles', 'app'].forEach(p => { $(p).hidden = p !== id; });
}

export function irInicio() {
  cortar();
  cerrar(true);
  mostrar('inicio');
  $('tituloInicio').textContent = T.titulo;
  $('lema').textContent = T.lema;
  $('preguntaModo').textContent = T.elegiModo;
  // logo: una cinta con una mesa encima
  $('logo').innerHTML = '<rect x="10" y="58" width="220" height="18" rx="9" fill="#3B4252" stroke="#1E2430" stroke-width="3"/>' +
    [30, 70, 110, 150, 190].map(x => '<circle cx="' + (x + 10) + '" cy="84" r="5" fill="#7A8696" stroke="#1E2430" stroke-width="2"/>').join('') +
    '<g transform="translate(40 8) scale(1)">' + dibujoIcono('serrucho') + '</g><g transform="translate(96 8)">' + dibujoIcono('sierra') + '</g><g transform="translate(152 8)">' + dibujoIcono('tapar') + '</g>';
  const cont = $('modos');
  cont.innerHTML = '';
  MODOS.forEach(m => {
    const ganadas = m.libre ? null : m.niveles.reduce((a, n) => a + estrellasDe(n.id), 0);
    const b = el('button', 'modo',
      '<span class="modo-icono" style="background:' + m.color + '">' + icono(m.icono) + '</span>' +
      '<span class="modo-nombre">' + m.nombre + '</span>' +
      '<span class="modo-grado" style="background:' + m.color + '">' + m.grado + '</span>' +
      '<span class="modo-desc">' + m.descripcion + '</span>' +
      (ganadas != null ? '<span class="modo-estrellas">' + icono('estrella', 'estrella-on') + ganadas + ' / ' + m.niveles.length * 3 + '</span>' : ''));
    b.dataset.modo = m.id;
    cont.appendChild(b);
  });
  const ultimo = S.guardado.modo && cont.querySelector('[data-modo="' + S.guardado.modo + '"]');
  (ultimo || cont.firstChild).focus();
}

export function elegirModo(id) {
  const m = modoPorId(id);
  snd('clic');
  guardar({ modo: m.id });
  if (m.libre) { irJuego(m, 0); return; }
  irNiveles(m);
}

export function irNiveles(m) {
  cortar();
  cerrar(true);
  S.modo = m;
  mostrar('niveles');
  $('btnVolverInicio').innerHTML = icono('casa');
  $('btnVolverInicio').setAttribute('aria-label', T.inicio);
  $('tituloModo').textContent = m.nombre + ' · ' + m.grado;
  $('preguntaNivel').textContent = T.elegiNivel;
  const cont = $('listaNiveles');
  cont.innerHTML = '';
  const actual = S.guardado.nivel;
  m.niveles.forEach((n, i) => {
    const e = estrellasDe(n.id);
    const b = el('button', 'tarjeta-nivel' + (n.id === actual ? ' actual' : ''),
      '<span class="num">' + (m.desde + i) + '</span>' + svgPersonaje(PERSONAJES[n.cliente]) +
      '<span class="nombre">' + n.nombre + '</span><span class="pide">' + n.pide + '</span>' +
      '<span class="estrellas">' + [1, 2, 3].map(k => icono('estrella', k <= e ? 'estrella-on' : 'estrella-off')).join('') + '</span>');
    b.dataset.nivel = i;
    cont.appendChild(b);
  });
  const foco = cont.querySelector('.actual') || cont.firstChild;
  if (foco) foco.focus();
}

export function irJuego(m, idx) {
  cerrar(true);
  mostrar('app');
  cargarNivel(m, idx);
  guardar({ modo: m.id, nivel: m.niveles[S.idx].id });
  $('btnProducir').focus();
}
