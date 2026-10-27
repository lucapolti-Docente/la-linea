/* Pantalla de juego: arma el nivel, el cliente, el panel, el reloj y el contador,
   y maneja cómo se ponen y se sacan estaciones (tocar, arrastrar y teclado). */
import { S, $, el, snd, estrellasDe, sacudir } from './estado.js';
import { dibujarCinta, dibujarCasilleros, cintasEnPantalla, botonDe, limpiarPiezas } from './cinta.js';
import { icono } from '../dibujo/iconos.js';
import { svgPersonaje } from '../dibujo/personajes.js';
import { modelo as dibujoModelo } from '../dibujo/pieza.js';
import { jugar, cintasDe, cantidad, reloj, puestos } from '../motor/index.js';
import { DATOS } from '../datos/index.js';
import { ESTACIONES } from '../datos/estaciones.js';
import { MATERIALES } from '../datos/materiales.js';
import { PERSONAJES, ENCARGADA } from '../datos/personajes.js';
import { T, ITEMS, GRUPOS, MATERIALES_TXT } from '../datos/textos.js';

/* ---------- Mensaje de la encargada ---------- */
export function decir(texto, tipo) {
  $('mensajeTxt').textContent = texto;
  const m = $('mensaje');
  m.className = 'mensaje' + (tipo ? ' ' + tipo : '');
  if (tipo === 'mal') sacudir(m);
}

/* ---------- Cargar un nivel ---------- */
export function cargarNivel(modo, idx) {
  cortar();
  S.modo = modo;
  S.idx = Math.max(0, Math.min(modo.niveles.length - 1, idx));
  const base = modo.niveles[S.idx];
  S.nivel = base.libre ? Object.assign({}, base, { entra: S.material }) : base;
  S.programa = { cintas: cintasDe(S.nivel).map(c => (c.fija ? null : new Array(c.casilleros).fill(null))), repetir: null };
  S.elegida = null;
  if (S.nivel.libre && !GRUPOS[S.grupo]) S.grupo = 'madera';

  $('nivelNum').textContent = modo.libre ? modo.nombre : T.nivel(S.idx + 1, modo.niveles.length);
  $('nivelNombre').textContent = S.nivel.nombre;
  $('caraNora').innerHTML = svgPersonaje(PERSONAJES[ENCARGADA]).replace(/^<svg[^>]*>|<\/svg>$/g, '');
  dibujarCliente();
  dibujarPanel();
  dibujarEstrellasBarra();
  decir(S.nivel.consigna);
  refrescar();
}

/* Vuelve a dibujar todo lo que depende del programa. */
export function refrescar() {
  $('repetir').hidden = !(S.nivel.repetir && S.programa.repetir);
  dibujarRepetir();
  const lote = $('lote');
  lote.hidden = !S.nivel.lote;
  if (S.nivel.lote) lote.textContent = T.lote(S.nivel.lote);
  dibujarCinta();
  dibujarTablero();
  const vacia = !puestos(cintasEnPantalla()).length;
  $('btnProducir').disabled = S.animando;
  $('btnPaso').disabled = S.animando;
  $('btnVaciar').disabled = S.animando || vacia && !S.programa.repetir;
}

/* ---------- Cliente ---------- */
export function dibujarCliente(resultado) {
  const n = S.nivel, c = $('cliente');
  const p = PERSONAJES[n.cliente];
  let html = '<div class="cliente-quien">' + svgPersonaje(p) + '<div><div class="cliente-nombre">' + p.nombre + '</div><div class="cliente-rol">' + p.rol + '</div></div></div>';
  html += '<p class="cliente-pide">' + n.pide + '</p>';
  if (n.libre) {
    html += '<div class="materiales" role="group" aria-label="' + T.material + '">' +
      n.materiales.map(m => '<button data-material="' + m + '" aria-pressed="' + (m === S.material) + '">' + MATERIALES_TXT[m] + '</button>').join('') + '</div>';
  }
  html += '<svg class="cliente-modelo" viewBox="-60 -80 120 90" aria-hidden="true">' + dibujoModelo(MATERIALES[n.entra], n.modelo || {}) + '</svg>';
  if (n.modelo) {
    html += '<ul class="items">' + Object.keys(n.modelo).map(k => {
      const it = resultado && resultado.find(r => r.id === k);
      const clase = it ? (it.ok ? ' ok' : ' no') : '';
      return '<li class="item' + clase + '" data-item="' + k + '"><span class="ico">' + icono(ITEMS[k][0]) + '</span><span class="txt">' + ITEMS[k][1] + '</span><span class="marca">' + (it ? icono(it.ok ? 'tilde' : 'cruz') : '') + '</span></li>';
    }).join('') + '</ul>';
  }
  c.innerHTML = html;
}

/* Marca un ítem del cliente con tilde o cruz. */
export function marcarItem(id, ok) {
  const li = document.querySelector('.item[data-item="' + id + '"]');
  if (!li) return;
  li.className = 'item ' + (ok ? 'ok' : 'no');
  li.querySelector('.marca').innerHTML = icono(ok ? 'tilde' : 'cruz');
}

/* ---------- Panel de estaciones ---------- */
export function dibujarPanel() {
  const n = S.nivel;
  $('panelTitulo').textContent = T.estaciones;
  const tabs = $('pestanias');
  tabs.hidden = !n.libre;
  if (n.libre) {
    tabs.innerHTML = Object.keys(GRUPOS).map(g => '<button role="tab" data-grupo="' + g + '" aria-selected="' + (g === S.grupo) + '">' + GRUPOS[g] + '</button>').join('');
  }
  const lista = n.libre ? n.estaciones.filter(id => ESTACIONES[id].grupo === S.grupo) : n.estaciones;
  const cont = $('estaciones');
  cont.innerHTML = '';
  lista.forEach(id => {
    const e = ESTACIONES[id];
    const b = el('button', 'estacion' + (e.tipo === 'maquina' ? ' maquina' : ''),
      '<span class="ico">' + icono(id) + '</span><span class="nom">' + e.nombre + '</span><span class="min">' + T.minutos(e.minutos) + '</span>' +
      (e.tipo === 'maquina' ? '<span class="engranaje">' + icono('engranaje') + '</span>' : ''));
    b.dataset.estacion = id;
    b.setAttribute('aria-pressed', String(S.elegida === id));
    b.setAttribute('aria-label', e.nombre + ', ' + T.minutos(e.minutos));
    cont.appendChild(b);
  });
  if (n.repetir) {
    const b = el('button', 'estacion repetir-bloque', '<span class="ico">' + icono('repetir') + '</span><span class="nom">' + (S.programa.repetir ? T.sacarRepetir : T.ponerRepetir) + '</span>');
    b.id = 'btnRepetir';
    b.setAttribute('aria-pressed', String(!!S.programa.repetir));
    cont.appendChild(b);
  }
}

function dibujarEstrellasBarra() {
  const n = S.nivel.libre ? 0 : estrellasDe(S.nivel.id);
  $('estrellasNivel').innerHTML = S.nivel.libre ? '' : [1, 2, 3].map(i => icono('estrella', i <= n ? 'estrella-on' : 'estrella-off')).join('');
}
export { dibujarEstrellasBarra };

/* ---------- Repetir ---------- */
function dibujarRepetir() {
  const r = $('repetir');
  if (r.hidden) return;
  r.innerHTML = '<span class="ico">' + icono('repetir') + '</span><span>' + T.repetir + '</span>' +
    '<button data-veces="-10">−10</button><button data-veces="-1">−1</button>' +
    '<span class="veces-num" aria-live="polite">' + S.programa.repetir + '</span>' +
    '<button data-veces="1">+1</button><button data-veces="10">+10</button><span>' + T.veces + '</span>';
}

export function alternarRepetir() {
  if (S.animando) return;
  cortar();
  S.programa.repetir = S.programa.repetir ? null : 10;
  snd(S.programa.repetir ? 'poner' : 'sacar');
  dibujarPanel();
  refrescar();
}

export function cambiarVeces(d) {
  if (S.animando) return;
  cortar();
  S.programa.repetir = Math.max(1, Math.min(999, (S.programa.repetir || 1) + d));
  snd('clic');
  refrescar();
}

/* ---------- Reloj y contador ---------- */
export function dibujarTablero(hechas, minutos) {
  if (hechas == null) hechas = S.hechas || 0; else S.hechas = hechas;
  const r = jugar(S.nivel, S.programa, DATOS);
  const n = cantidad(S.nivel, S.programa);
  const total = minutos != null ? minutos : r.prod.tiempo.total;
  const meta = S.nivel.meta;
  const tope = Math.max(total, meta || 0, 1) * 1.1;
  let html = '<span class="ico">' + icono('reloj') + '</span><div class="reloj-datos"><span class="reloj-valor">' + T.minutos(Math.round(total)) + '</span>';
  if (meta) html += '<span class="reloj-meta">' + T.meta(meta) + '</span>';
  if (S.nivel.comparar) {
    const mano = reloj(puestos([S.nivel.comparar]), ESTACIONES, n).total;
    const tope2 = Math.max(tope, mano * 1.05);
    html += barra(T.aMano, mano, tope2, meta, 'mano') + barra(T.tuLinea, total, tope2, meta);
  } else if (meta) {
    html += barra('', total, tope, meta);
  }
  $('reloj').innerHTML = html + '</div>';
  const pedido = S.nivel.pedido || n;
  $('contador').innerHTML = '<span class="ico">' + icono('caja') + '</span><span class="valor">' + T.piezas(hechas || 0, pedido) + '</span>';
}

function barra(nombre, valor, tope, meta, clase) {
  const pasada = meta && valor > meta;
  return '<div class="barra-fila">' + (nombre ? '<span>' + nombre + '</span>' : '') +
    '<div class="barra-tiempo' + (clase ? ' ' + clase : pasada ? ' pasada' : '') + '"><div class="relleno" style="width:' + Math.min(100, (valor / tope) * 100) + '%"></div>' +
    (meta ? '<div class="marca-meta" style="left:' + Math.min(99, (meta / tope) * 100) + '%"></div>' : '') + '</div></div>';
}

/* ---------- Poner y sacar estaciones ---------- */
export function elegir(id) {
  if (S.animando) return;
  S.elegida = S.elegida === id ? null : id;
  snd('elegir');
  document.querySelectorAll('.estacion[data-estacion]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.estacion === S.elegida)));
  dibujarCasilleros();
  decir(S.elegida ? T.elegida(ESTACIONES[S.elegida].nombre) : S.nivel.consigna);
}

const numeroDe = (c, i) => S.geo.slots.findIndex(s => s.cinta === c && s.i === i) + 1;

export function poner(c, i, id) {
  if (S.animando || cintasDe(S.nivel)[c].fija) return;
  cortar();
  S.programa.cintas[c][i] = id;
  S.elegida = null;
  snd('poner');
  document.querySelectorAll('.estacion[data-estacion]').forEach(b => b.setAttribute('aria-pressed', 'false'));
  decir(T.puesta(ESTACIONES[id].nombre, numeroDe(c, i)));
  refrescar();
}

export function sacar(c, i) {
  if (S.animando || cintasDe(S.nivel)[c].fija) return null;
  cortar();
  const id = S.programa.cintas[c][i];
  if (!id) return null;
  S.programa.cintas[c][i] = null;
  snd('sacar');
  decir(T.sacada(numeroDe(c, i)));
  refrescar();
  return id;
}

/* Mueve (o intercambia) la estación de un casillero a otro. */
export function mover(c1, i1, c2, i2) {
  if (S.animando || cintasDe(S.nivel)[c2].fija) return;
  cortar();
  const a = S.programa.cintas[c1][i1], b = S.programa.cintas[c2][i2];
  S.programa.cintas[c2][i2] = a;
  S.programa.cintas[c1][i1] = b;
  snd('poner');
  decir(T.puesta(ESTACIONES[a].nombre, numeroDe(c2, i2)));
  refrescar();
}

/* Tocar un casillero: si hay una estación elegida, la pone; si no, saca la que hay y la deja elegida para moverla. */
export function tocarCasillero(c, i) {
  if (S.animando) return;
  if (S.elegida) { poner(c, i, S.elegida); return; }
  const id = sacar(c, i);
  if (id) {
    S.elegida = id;
    document.querySelectorAll('.estacion[data-estacion]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.estacion === id)));
    dibujarCasilleros();
    decir(T.elegida(ESTACIONES[id].nombre));
    const b = botonDe(c, i); if (b) b.focus();
  } else {
    decir(T.elegiEstacion);
    sacudir($('panel'));
  }
}

export function vaciar() {
  if (S.animando) return;
  cortar();
  S.programa.cintas = S.programa.cintas.map(c => (c ? c.map(() => null) : null));
  snd('sacar');
  decir(S.nivel.consigna);
  dibujarCliente();
  refrescar();
}

/* Corta cualquier producción o paso a paso que esté andando y deja la cinta limpia. */
export function cortar() {
  S.corrida++;
  S.ocupado = false;
  S.animando = false;
  S.paso = null;
  S.hechas = 0;
  limpiarPiezas();
  document.querySelectorAll('.item').forEach(li => { li.className = 'item'; li.querySelector('.marca').innerHTML = ''; });
  const cc = $('cintaCaja'); if (cc) cc.classList.remove('andando');
}

export function cambiarMaterial(m) {
  if (S.animando) return;
  S.material = m;
  S.nivel = Object.assign({}, S.nivel, { entra: m });
  cortar();
  snd('clic');
  dibujarCliente();
  refrescar();
}

export function cambiarGrupo(g) {
  S.grupo = g;
  snd('clic');
  dibujarPanel();
  const b = document.querySelector('.pestanias [data-grupo="' + g + '"]'); if (b) b.focus();
}
