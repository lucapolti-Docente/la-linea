/* Todos los eventos: botones, tocar estación y después casillero, arrastrar (mouse, touchpad y dedo) y teclado. */
import { S, $, snd } from './estado.js';
import { elegir, tocarCasillero, poner, sacar, mover, vaciar, alternarRepetir, cambiarVeces, cambiarMaterial, cambiarGrupo, cortar, refrescar } from './juego.js';
import { dibujarCinta } from './cinta.js';
import { producir, paso } from './produccion.js';
import { ventanaMenu, cerrar, hayVentana } from './ventanas.js';
import { irInicio, irNiveles, irJuego, elegirModo } from './pantallas.js';
import { alternarSonido } from './preferencias.js';
import { icono } from '../dibujo/iconos.js';

const accionesMenu = {
  inicio: irInicio,
  nivel: i => irJuego(S.modo, i),
  borrado: () => refrescar()
};

let ignorarClick = false;

export function conectar() {
  // pantallas
  $('modos').addEventListener('click', e => { const b = e.target.closest('[data-modo]'); if (b) elegirModo(b.dataset.modo); });
  $('listaNiveles').addEventListener('click', e => { const b = e.target.closest('[data-nivel]'); if (b) { snd('clic'); irJuego(S.modo, +b.dataset.nivel); } });
  $('btnVolverInicio').addEventListener('click', () => { snd('clic'); irInicio(); });

  // barra y pie
  $('btnMenu').addEventListener('click', () => { snd('clic'); ventanaMenu(accionesMenu); });
  $('btnSonido').addEventListener('click', alternarSonido);
  $('btnCasa').addEventListener('click', () => { snd('clic'); irInicio(); });
  $('btnProducir').addEventListener('click', producir);
  $('btnPaso').addEventListener('click', paso);
  $('btnVaciar').addEventListener('click', vaciar);

  // panel, cliente, repetir y casilleros
  $('estaciones').addEventListener('click', e => {
    if (ignorarClick) return;
    if (e.target.closest('#btnRepetir')) { alternarRepetir(); return; }
    const b = e.target.closest('[data-estacion]');
    if (!b) return;
    elegir(b.dataset.estacion);
    // con teclado, después de elegir se salta al primer casillero vacío
    if (e.detail === 0 && S.elegida) {
      const vacio = document.querySelector('.casillero.destino') || document.querySelector('.casillero:not(.fija)');
      if (vacio) vacio.focus();
    }
  });
  $('pestanias').addEventListener('click', e => { const b = e.target.closest('[data-grupo]'); if (b) cambiarGrupo(b.dataset.grupo); });
  $('cliente').addEventListener('click', e => { const b = e.target.closest('[data-material]'); if (b) cambiarMaterial(b.dataset.material); });
  $('repetir').addEventListener('click', e => { const b = e.target.closest('[data-veces]'); if (b) cambiarVeces(+b.dataset.veces); });
  $('casilleros').addEventListener('click', e => {
    if (ignorarClick) return;
    const b = e.target.closest('.casillero');
    if (b && !b.disabled) tocarCasillero(+b.dataset.c, +b.dataset.i);
  });

  // botones de la ventana de resultado
  $('capas').addEventListener('click', e => {
    const b = e.target.closest('[data-accion]');
    if (!b) return;
    const a = b.dataset.accion;
    if (a === 'otra') { snd('clic'); cerrar(); cortar(); refrescar(); $('btnProducir').focus(); }
    else if (a === 'siguiente') { snd('clic'); irJuego(S.modo, S.idx + 1); }
    else if (a === 'modos') { snd('clic'); irNiveles(S.modo); }
  });

  conectarArrastre();
  conectarTeclado();

  let espera = null;
  window.addEventListener('resize', () => {
    clearTimeout(espera);
    espera = setTimeout(() => { if (!$('app').hidden && S.nivel) { if (S.ocupado) cortar(); dibujarCinta(); } }, 120);
  });
}

/* ---------- Arrastrar ---------- */
function conectarArrastre() {
  const fantasma = $('arrastre');
  let a = null;

  const casilleroEn = (x, y) => {
    const e = document.elementFromPoint(x, y);
    const b = e && e.closest('.casillero');
    return b && !b.disabled ? b : null;
  };
  const marcar = b => {
    document.querySelectorAll('.casillero.sobre').forEach(c => { if (c !== b) c.classList.remove('sobre'); });
    if (b) b.classList.add('sobre');
  };
  const terminar = () => {
    fantasma.hidden = true;
    marcar(null);
    a = null;
  };

  document.addEventListener('pointerdown', e => {
    if (e.button > 0 || S.animando || hayVentana()) return;
    const est = e.target.closest('.estacion[data-estacion]');
    const cas = e.target.closest('.casillero.lleno:not(.fija)');
    if (!est && !cas) return;
    a = {
      x0: e.clientX, y0: e.clientY, activo: false,
      id: est ? est.dataset.estacion : S.programa.cintas[+cas.dataset.c][+cas.dataset.i],
      desde: cas ? { c: +cas.dataset.c, i: +cas.dataset.i } : null
    };
  });

  document.addEventListener('pointermove', e => {
    if (!a) return;
    if (!a.activo) {
      if (Math.abs(e.clientX - a.x0) + Math.abs(e.clientY - a.y0) < 12) return;
      a.activo = true;
      fantasma.innerHTML = icono(a.id);
      fantasma.hidden = false;
      snd('elegir');
    }
    fantasma.style.transform = 'translate(' + (e.clientX - 40) + 'px,' + (e.clientY - 40) + 'px)';
    marcar(casilleroEn(e.clientX, e.clientY));
    e.preventDefault();
  });

  document.addEventListener('pointerup', e => {
    if (!a) return;
    const arr = a;
    if (!arr.activo) { a = null; return; }
    const b = casilleroEn(e.clientX, e.clientY);
    terminar();
    ignorarClick = true;
    setTimeout(() => { ignorarClick = false; }, 0);
    if (b) {
      const c = +b.dataset.c, i = +b.dataset.i;
      if (arr.desde) { if (arr.desde.c !== c || arr.desde.i !== i) mover(arr.desde.c, arr.desde.i, c, i); }
      else poner(c, i, arr.id);
    } else if (arr.desde) {
      sacar(arr.desde.c, arr.desde.i);
    }
  });

  document.addEventListener('pointercancel', terminar);
}

/* ---------- Teclado ---------- */
function conectarTeclado() {
  document.addEventListener('keydown', e => {
    ignorarClick = false;
    if (e.key === 'Escape') {
      if (cerrar()) { e.preventDefault(); return; }
      if (S.elegida) { elegir(S.elegida); e.preventDefault(); }
      return;
    }
    if (hayVentana() || $('app').hidden) return;
    const actual = document.activeElement;
    const cas = actual && actual.closest && actual.closest('.casillero');
    if (cas && (e.key === 'Delete' || e.key === 'Backspace')) {
      sacar(+cas.dataset.c, +cas.dataset.i);
      const b = document.querySelector('.casillero[data-c="' + cas.dataset.c + '"][data-i="' + cas.dataset.i + '"]');
      if (b) b.focus();
      e.preventDefault();
      return;
    }
    // flechas: moverse entre casilleros o entre estaciones
    const grupo = cas ? '.casillero:not([disabled])' : actual && actual.closest && actual.closest('.estacion') ? '.estacion' : null;
    if (!grupo) return;
    const paso = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!paso) return;
    const lista = Array.prototype.slice.call(document.querySelectorAll(grupo));
    const i = lista.indexOf(cas || actual.closest('.estacion'));
    const sig = lista[(i + paso + lista.length) % lista.length];
    if (sig) { sig.focus(); e.preventDefault(); }
  });
}
