/* Arranque: estilos, íconos fijos de los botones, preferencias, eventos y pantalla de inicio. */
import './estilos/index.css';
import { $ } from './interfaz/estado.js';
import { icono } from './dibujo/iconos.js';
import { T } from './datos/textos.js';
import { conectar } from './interfaz/eventos.js';
import { irInicio } from './interfaz/pantallas.js';
import { aplicarSonido, aplicarMayus } from './interfaz/preferencias.js';

const boton = (id, ico, texto, etiqueta) => {
  const b = $(id);
  b.innerHTML = '<span class="ico">' + icono(ico) + '</span>' + (texto ? '<span>' + texto + '</span>' : '');
  b.setAttribute('aria-label', etiqueta || texto);
};
boton('btnMenu', 'menu', '', T.menu);
boton('btnVaciar', 'vaciar', T.vaciar);
boton('btnPaso', 'paso', T.paso);
boton('btnProducir', 'producir', T.producir);
boton('btnCasa', 'casa', '', T.inicio);
$('btnMenu').innerHTML = icono('menu');

aplicarSonido();
aplicarMayus();
conectar();
irInicio();
