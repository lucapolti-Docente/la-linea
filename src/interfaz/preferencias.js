/* Sonido y mayúsculas: se aplican al abrir y cuando se cambian desde el menú o la barra. */
import { S, $, snd, guardar } from './estado.js';
import { Sonido } from '../sonido.js';
import { icono } from '../dibujo/iconos.js';
import { T } from '../datos/textos.js';

export function aplicarSonido() {
  const on = S.guardado.sonido !== false;
  Sonido.config({ efectos: on });
  const b = $('btnSonido');
  if (b) {
    b.innerHTML = icono(on ? 'parlante' : 'mudo');
    b.setAttribute('aria-label', on ? T.silenciar : T.activarSonido);
    b.setAttribute('aria-pressed', String(!on));
  }
}

export function alternarSonido() {
  guardar({ sonido: S.guardado.sonido === false });
  aplicarSonido();
  snd('clic');
}

export function aplicarMayus() {
  document.body.classList.toggle('mayus', S.guardado.mayus !== false);
}
