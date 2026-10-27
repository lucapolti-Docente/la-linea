/* Ventanas: resultado de la producción y menú ☰. */
import { S, $, el, snd, guardar, estrellasDe } from './estado.js';
import { icono } from '../dibujo/iconos.js';
import { pieza as dibujoPieza } from '../dibujo/pieza.js';
import { svgPersonaje } from '../dibujo/personajes.js';
import { PERSONAJES, ENCARGADA } from '../datos/personajes.js';
import { T, DEFECTOS } from '../datos/textos.js';
import { aplicarSonido, aplicarMayus } from './preferencias.js';

let alCerrar = null;
let foco = null;

export function abrir(html, clase, cerrarCon) {
  cerrar(true);
  foco = document.activeElement;
  const fondo = el('div', 'fondo-ventana');
  fondo.innerHTML = '<div class="ventana ' + (clase || '') + '" role="dialog" aria-modal="true">' + html + '</div>';
  fondo.addEventListener('click', e => { if (e.target === fondo) cerrar(); });
  $('capas').appendChild(fondo);
  alCerrar = cerrarCon || null;
  const primero = fondo.querySelector('[data-foco]') || fondo.querySelector('button, a');
  if (primero) primero.focus();
  return fondo;
}

export function cerrar(sinAviso) {
  const c = $('capas');
  if (!c.firstChild) return false;
  c.innerHTML = '';
  const f = alCerrar; alCerrar = null;
  if (!sinAviso && f) f();
  if (foco && foco.focus && document.body.contains(foco)) foco.focus();
  return true;
}

export const hayVentana = () => !!$('capas').firstChild;

const ico = id => '<span class="ico">' + icono(id) + '</span>';
const estrellas = (n, clase) => '<div class="' + clase + '">' + [1, 2, 3].map(i => icono('estrella', i <= n ? 'estrella-on' : 'estrella-off')).join('') + '</div>';

/* ---------- Resultado ---------- */
export function ventanaResultado(r) {
  const n = S.nivel;
  const final = r.prod.sana.pieza;
  let html = '';
  if (n.libre) {
    html += '<h2>' + T.libreSalio + '</h2>';
  } else {
    html += '<h2>' + T.resultado[r.estrellas] + '</h2>' + estrellas(r.estrellas, 'resultado-estrellas');
  }
  html += '<div class="resultado-pieza"><svg viewBox="-60 -80 120 90" aria-hidden="true">' + dibujoPieza(final) + '</svg></div>';
  const lista = [];
  r.defectos.forEach(d => lista.push('<li><b>' + DEFECTOS[d][0] + '</b> ' + DEFECTOS[d][1] + '</li>'));
  const t = Math.round(r.prod.tiempo.total);
  if (n.meta) lista.push('<li class="tiempo">' + (r.aTiempo ? T.aTiempo(t, n.meta) : T.tarde(t, n.meta)) + '</li>');
  else lista.push('<li class="tiempo">' + T.minutos(t) + ' · ' + T.piezas(r.prod.entregadas, r.prod.n) + '</li>');
  if (r.defectos.length && !n.libre) html += '<p><b>' + T.conDefectos + '</b></p>';
  if (lista.length) html += '<ul class="lista-explica">' + lista.join('') + '</ul>';
  if (r.estrellas === 3 && n.aprende) html += '<p class="aprende">' + svgPersonaje(PERSONAJES[ENCARGADA]) + '<span>' + n.aprende + '</span></p>';

  const ultimo = S.idx >= S.modo.niveles.length - 1;
  html += '<div class="ventana-botones"><button class="boton" data-accion="otra">' + ico('repetir') + T.otraVez + '</button>';
  if (!n.libre) {
    html += ultimo
      ? '<button class="boton principal-btn" data-accion="modos" data-foco>' + ico('casa') + T.elegirOtro + '</button>'
      : '<button class="boton principal-btn" data-accion="siguiente" data-foco>' + T.siguiente + ' ' + ico('producir') + '</button>';
  }
  html += '</div>';
  if (!n.libre && ultimo) html = '<p class="aprende">' + T.terminaste + '</p>' + html;
  abrir(html, 'resultado');
  if (r.estrellas >= 1 && !n.libre) {
    snd('gana');
    for (let i = 1; i <= r.estrellas; i++) setTimeout(() => snd('estrella', i), 300 + i * 250);
  }
}

/* ---------- Menú ---------- */
export function ventanaMenu(acciones) {
  const m = S.modo;
  let html = '<h2>' + T.menu + '</h2><div class="menu-lista">';
  html += '<button class="boton" data-accion="inicio">' + ico('casa') + T.menuInicio + '</button>';
  if (m && !m.libre) {
    html += '<p><b>' + T.menuNiveles + ' · ' + m.nombre + '</b></p><div class="menu-niveles">' + m.niveles.map((n, i) =>
      '<button class="boton' + (i === S.idx ? ' actual' : '') + '" data-nivel="' + i + '"><span>' + (m.desde + i) + '. ' + n.nombre + '</span>' +
      estrellas(estrellasDe(n.id), 'mini-estrellas') + '</button>').join('') + '</div>';
  }
  const sonido = S.guardado.sonido !== false, mayus = S.guardado.mayus !== false;
  html += '<button class="boton interruptor" data-accion="sonido" aria-pressed="' + sonido + '">' + ico(sonido ? 'parlante' : 'mudo') + T.menuSonido + '</button>';
  html += '<button class="boton interruptor" data-accion="mayus" aria-pressed="' + mayus + '">Aa ' + T.menuMayus + '</button>';
  html += '<a class="boton" href="docentes/index.html" target="_blank" rel="noopener">' + ico('mano') + T.menuDocentes + '</a>';
  html += '<button class="boton" data-accion="borrar">' + ico('vaciar') + T.menuBorrar + '</button>';
  html += '<button class="boton" data-accion="cerrar" data-foco>' + ico('cruz') + T.cerrar + '</button></div>';
  const v = abrir(html, 'menu');
  v.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const a = b.dataset.accion;
    if (b.dataset.nivel != null) { cerrar(true); acciones.nivel(+b.dataset.nivel); return; }
    if (a === 'cerrar') { snd('clic'); cerrar(); }
    else if (a === 'inicio') { cerrar(true); acciones.inicio(); }
    else if (a === 'sonido') { guardar({ sonido: S.guardado.sonido === false }); aplicarSonido(); snd('clic'); ventanaMenu(acciones); }
    else if (a === 'mayus') { guardar({ mayus: S.guardado.mayus === false }); aplicarMayus(); snd('clic'); ventanaMenu(acciones); }
    else if (a === 'borrar') ventanaBorrar(acciones);
  });
}

function ventanaBorrar(acciones) {
  const v = abrir('<h2>' + T.borrarSeguro + '</h2><div class="ventana-botones"><button class="boton" data-accion="no" data-foco>' + T.no + '</button><button class="boton" data-accion="si">' + T.si + '</button></div>');
  v.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.accion === 'si') { guardar({ estrellas: {} }); acciones.borrado(); }
    ventanaMenu(acciones);
  });
}
