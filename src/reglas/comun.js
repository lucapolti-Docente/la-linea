/* Reglas que comparten varios niveles: qué cuenta como pieza correcta en cada camión.
   Devuelven null si está bien, o el motivo del error (sale de src/datos/mensajes.js). */
import { MSG, fmt } from '../datos/mensajes.js';
import { CAT, RECICLABLES, PAINTS } from '../datos/materiales.js';
import { TRUCKN, NAMEK, EN } from '../datos/textos.js';

export const RECY = it => RECICLABLES.includes(CAT[it.kind]);
export const catOf = it => (it.kind === 'fardo' ? CAT[it.mat] : CAT[it.kind]);
const nombreK = k => NAMEK[k] || k;

export function truckMatch(it, tr) {
  const w = tr.want;
  if (w === 'reciclables') return RECY(it);
  if (w === 'aluminio') return it.kind === 'lata';
  if (['papel', 'plastico', 'vidrio'].includes(w)) return catOf(it) === w;
  return it.kind === w;
}

export function wrongTruck(it, tr) {
  const m = MSG.reci;
  return fmt(m.camionEquivocado, {
    material: nombreK(it.kind),
    fardoDe: it.kind === 'fardo' ? fmt(m.fardoDe, { material: nombreK(it.mat) }) : '',
    camion: TRUCKN[tr.want]
  });
}

/* Camión correcto o motivo de camión equivocado. */
export const camionOMotivo = (it, tr) => (truckMatch(it, tr) ? null : wrongTruck(it, tr));
/* Camión correcto o "eso no se recicla". */
export const camionONoSeRecicla = (it, tr) => (truckMatch(it, tr) ? null : MSG.reci.noSeRecicla);

export function rFardoCheck(it) {
  const m = MSG.reci;
  if (it.kind !== 'fardo') return m.sinEnfardar;
  if (it.mixed) return m.fardoMezclado;
  if (CAT[it.mat] !== 'papel') return m.fardoNoPapel;
  return null;
}

export function paintCheck(it) {
  const m = MSG.pintura;
  const p = it.steps.filter(x => PAINTS.includes(x));
  if (!p.length) return m.sinPintar;
  if (p.length > 1) return m.dosVeces;
  if (p[0] !== it.tag) return fmt(m.otroColor, { sticker: it.tag, color: p[0] });
  return null;
}

export function tablaCheck(it) {
  const m = MSG.tabla;
  if (it.kind === 'tronco') return m.tronco;
  if (!it.steps.includes('aserrar')) return m.sinSierra;
  if (!it.steps.includes('cortar')) return m.sinCorte;
  if (!it.steps.includes('lijar')) return m.sinLijar;
  return null;
}

export function mesaCheck(it) {
  const m = MSG.industria;
  if (it.kind === 'mesa') return null;
  if (it.kind === 'tabla') return m.tablaSinPatas;
  if (it.kind === 'pata' || it.kind === 'barra') return m.metalSuelto;
  return m.noMesa;
}

export function eCheck(it, tr) {
  const m = MSG.ene;
  if (it.kind !== tr.want) return fmt(m.otraEnergia, { energia: EN[it.kind] || it.kind, destino: tr.label ? tr.label.toLowerCase() : m.elDestino, pide: TRUCKN[tr.want] });
  if (it.kind === 'elec' && it.v === 'alta') return m.altaTension;
  return null;
}

/* "¡Papel se podía reciclar y fue al relleno!": con mayúscula al principio. */
export const reciclableAlRelleno = it => fmt(MSG.reci.reciclableAlRelleno, { material: nombreK(it.kind).replace(/^./, c => c.toUpperCase()) });
