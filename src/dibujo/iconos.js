/* Íconos descritos como datos: ['estacion', 'sierra', 0, {fixed:true}] dibuja una estación, etc.
   Así los niveles y las piezas de src/datos/ dicen QUÉ dibujar sin tener código adentro.
   Los dibujos que no son una sola pieza están en PROPIOS, por nombre. */
import { rr, labelTxt } from './util.js';
import { drawBelt, drawBeltCurve } from './cinta.js';
import { drawItem } from './piezas.js';
import { drawStation } from './estaciones.js';
import { drawSource, drawTruck, drawBin, drawPillar, drawModule, drawTarget, drawPlano, drawTech } from './objetos.js';
import { TX } from '../datos/textos.js';

const rayo = c => { c.fillStyle = '#f2c84b'; c.beginPath(); c.moveTo(0.05, -0.32); c.lineTo(-0.16, 0.04); c.lineTo(0, 0.04); c.lineTo(-0.06, 0.32); c.lineTo(0.18, -0.06); c.lineTo(0.02, -0.06); c.closePath(); c.fill(); };
const reloj = c => { c.strokeStyle = '#ece6d8'; c.lineWidth = 0.05; c.beginPath(); c.arc(0, 0, 0.3, 0, 7); c.stroke(); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -0.2); c.moveTo(0, 0); c.lineTo(0.14, 0.06); c.stroke(); };

export const PROPIOS = {
  // Piezas del botón "?"
  'parte:kwh': rayo,
  'parte:variable': c => { c.fillStyle = '#ece6d8'; rr(c, -0.36, -0.22, 0.72, 0.44, 0.06); c.fill(); labelTxt(c, '3', 0, 0.02, 0.36, '#1a1d22'); },
  'parte:disena': c => { c.strokeStyle = '#6cc98a'; c.lineWidth = 0.06; rr(c, -0.28, -0.3, 0.56, 0.6, 0.05); c.stroke(); c.beginPath(); c.moveTo(-0.16, -0.12); c.lineTo(0.16, -0.12); c.moveTo(-0.16, 0.02); c.lineTo(0.16, 0.02); c.moveTo(-0.16, 0.16); c.lineTo(0.06, 0.16); c.stroke(); },
  'parte:depurar': c => { c.strokeStyle = '#e8665a'; c.lineWidth = 0.08; c.beginPath(); c.arc(0, 0, 0.3, 0, 7); c.stroke(); c.fillStyle = '#e8665a'; c.font = '800 0.4px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('!', 0, 0.02); },
  'parte:corte': c => { c.fillStyle = '#e8665a'; c.beginPath(); c.arc(0, 0, 0.28, 0, 7); c.fill(); c.fillStyle = '#fff'; c.fillRect(-0.04, -0.16, 0.08, 0.2); c.fillRect(-0.04, 0.08, 0.08, 0.08); },
  'parte:perdida': c => { c.fillStyle = '#e8762e'; c.beginPath(); c.arc(0, 0, 0.14, 0, 7); c.fill(); labelTxt(c, TX.tablero.perdida, 0, 0.3, 0.14, '#ffb07a'); },
  'parte:noche': c => { c.fillStyle = '#c9d4ea'; c.beginPath(); c.arc(0, 0, 0.22, 0, 7); c.fill(); c.fillStyle = '#1a1d22'; c.beginPath(); c.arc(0.09, -0.06, 0.19, 0, 7); c.fill(); },
  'parte:timerC': reloj,
  'parte:timer': reloj,
  'parte:sidepick': c => { drawStation(c, 'cortar', 0, {}); c.strokeStyle = '#f2b632'; c.lineWidth = 0.04; c.setLineDash([0.06, 0.05]); c.strokeRect(-0.48, -0.48, 0.96, 0.96); c.setLineDash([]); },
  'parte:cuello': c => { drawBelt(c, 0, 0.1, false); for (const x of [-0.3, -0.05, 0.2]) { c.save(); c.translate(x, 0); c.scale(0.4, 0.4); drawItem(c, { kind: 'tabla', steps: [] }); c.restore(); } },
  'parte:modulo': c => { c.save(); c.scale(1 / 80, 1 / 80); drawModule(c, { x: -0.5, y: -0.5, w: 1, h: 1, icon: 'tabla', outs: [0] }, 80, 0); c.restore(); },
  'parte:corredera': c => { c.save(); c.translate(0, -0.12); drawItem(c, { kind: 'corredera' }); c.restore(); c.save(); c.translate(0, 0.15); drawItem(c, { kind: 'corredera', defect: true }); c.restore(); },
  'parte:zona': c => { c.fillStyle = 'rgba(242,182,50,.15)'; c.fillRect(-0.45, -0.45, 0.9, 0.9); c.strokeStyle = '#f2b632'; c.setLineDash([0.08, 0.06]); c.lineWidth = 0.03; c.strokeRect(-0.45, -0.45, 0.9, 0.9); c.setLineDash([]); c.save(); c.scale(.7, .7); drawStation(c, 'sierra', 0, { fixed: true }); c.restore(); },
  'parte:tag': c => { c.scale(1.3, 1.3); drawItem(c, { kind: 'tabla', steps: [], tag: 'azul' }); },
  'parte:roble': c => { c.save(); c.translate(0, -0.15); drawItem(c, { kind: 'tabla', steps: [], tag: 'amarillo', wood: 'pino' }); c.restore(); c.save(); c.translate(0, 0.15); drawItem(c, { kind: 'tabla', steps: [], wood: 'roble' }); c.restore(); },
  // Interfaz
  'mundo:ene': c => { c.fillStyle = '#f2c84b'; c.beginPath(); c.moveTo(0.05, -0.4); c.lineTo(-0.2, 0.05); c.lineTo(0, 0.05); c.lineTo(-0.08, 0.4); c.lineTo(0.22, -0.08); c.lineTo(0.02, -0.08); c.closePath(); c.fill(); },
  borrar: c => { c.globalAlpha = .5; drawBelt(c, 0, 0.12, false); c.globalAlpha = 1; c.strokeStyle = '#e8665a'; c.lineWidth = 0.1; c.lineCap = 'round'; c.beginPath(); c.moveTo(-0.26, -0.26); c.lineTo(0.26, 0.26); c.moveTo(0.26, -0.26); c.lineTo(-0.26, 0.26); c.stroke(); }
};

const TIPOS = {
  estacion: drawStation, pieza: drawItem, entrada: drawSource, tacho: drawBin, destino: drawTarget, camion: drawTruck,
  plano: drawPlano, cinta: drawBelt, curva: drawBeltCurve, pilar: drawPillar, tecnica: drawTech,
  propio: (c, nombre) => PROPIOS[nombre](c)
};

/* Dibuja un ícono descrito como ['tipo', ...argumentos]. */
export function dibujar(c, spec) {
  const [tipo, ...args] = spec;
  TIPOS[tipo](c, ...args);
}
