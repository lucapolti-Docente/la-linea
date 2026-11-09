/* Reglas de cada nivel, por nombre (el campo check o binCheck del nivel en src/datos/mundos/).
   check(pieza, camión): null si el camión acepta la pieza, o el motivo del error.
   binCheck(pieza): motivo si esa pieza NO tenía que ir al tacho (cuenta como error), o null. */
import { MSG } from '../datos/mensajes.js';
import { CAT, PAINTS } from '../datos/materiales.js';
import { TRUCKN } from '../datos/textos.js';
import { fmt } from '../datos/mensajes.js';
import {
  RECY, truckMatch, wrongTruck, camionOMotivo, camionONoSeRecicla, rFardoCheck,
  paintCheck, tablaCheck, mesaCheck, eCheck, reciclableAlRelleno
} from './comun.js';

const T = MSG.tabla, P = MSG.pintura, H = MSG.horno, I = MSG.industria, R = MSG.reci;

/* Roble con barniz, pino pintado del color del sticker. manos2: el roble lleva dos manos. */
function robleOPino(it, manos2) {
  if (it.wood === 'roble') {
    if (it.steps.some(x => PAINTS.includes(x))) return P.robleColor;
    if (!manos2) return it.steps.includes('barniz') ? null : P.robleSinBarniz;
    const c = it.coats || 0;
    if (c < 2) return c === 0 ? P.robleSinBarniz : P.robleUnaMano;
    if (c > 2) return P.robleMuchas;
    return null;
  }
  if (it.steps.includes('barniz')) return P.pinoBarniz;
  return paintCheck(it);
}

/* Compost bien hecho: crudo si le faltaron semanas. */
const compostOk = msg => (it, tr) => {
  if (!truckMatch(it, tr)) return wrongTruck(it, tr);
  if (it.kind === 'compost' && it.wet > 0) return msg;
  return null;
};
const reciclableAlTacho = it => (RECY(it) ? R.algoReciclable : null);

export const CHECKS = {
  // ---------- Fábrica de muebles ----------
  tablaCheck, paintCheck, mesaCheck,
  aserradero: it => {
    if (it.kind === 'tronco') return T.tronco;
    if (!it.steps.includes('aserrar')) return T.sinSierra;
    if (!it.steps.includes('cortar')) return T.sinCarpintero;
    if (!it.steps.includes('lijar')) return T.sinLijar;
    return null;
  },
  persMaq: it => {
    if (it.kind === 'tronco') return T.tronco;
    if (!it.steps.includes('aserrar')) return T.sinSierra;
    if (it.steps.filter(s => s === 'cortar').length < 1) return T.sinCorte;
    if (!it.steps.includes('lijar')) return T.sinLijar;
    return null;
  },
  paquetes: it => (it.kind === 'paquete' ? null : it.kind === 'tabla' ? MSG.paquetes.suelta : MSG.paquetes.noEs),
  manos: it => {
    const c = it.coats || 0, m = MSG.manos;
    if (c < 2) return c === 0 ? m.sinBarniz : m.unaMano;
    if (c > 2) return m.demasiadas;
    return null;
  },
  hornoReloj: it => {
    if (!it.steps.includes('secar')) return H.sinHorno;
    if (it.wet > 0) return H.humeda;
    return null;
  },
  horno: it => {
    if (!it.steps.includes('barniz')) return H.sinBarniz;
    if (!it.steps.includes('secar')) return H.sinHorno;
    if (it.steps.indexOf('secar') < it.steps.indexOf('barniz')) return H.secoAntes;
    if (it.wet > 0) return H.pegado;
    return null;
  },
  mantenimiento: it => {
    if (it.kind === 'tronco') return T.tronco;
    if (!it.steps.includes('aserrar')) return T.sinSierraCorta;
    if (!it.steps.includes('lijar')) return T.sinLijar;
    return null;
  },
  anidado: it => robleOPino(it, false),
  clasif: it => robleOPino(it, true),
  reparto: (it, tr) => {
    const m = MSG.reparto;
    if (tr.want === 'roble') {
      if (it.wood !== 'roble') return m.pinoEnRoble;
      if (it.wet > 0) return m.humedo;
      return null;
    }
    if (it.wood === 'roble') return m.robleEnEstantes;
    const r = paintCheck(it);
    if (r) return r;
    if (it.kind !== 'caja') return m.sinCaja;
    if (tr.want !== it.tag) return fmt(m.otroCamion, { sticker: it.tag, camion: TRUCKN[tr.want] });
    return null;
  },
  herramienta: it => (it.kind === 'pata' ? null : it.kind === 'barra' ? I.barraEntera : I.noPata),
  patas: mesaCheck,
  dosBrazos: it => {
    if (it.kind === 'mesa') return null;
    if (it.kind === 'tabla') return I.tablaSolaCorta;
    return I.noMesa;
  },
  soldadura: it => {
    if (it.kind === 'mesaHierro') return null;
    if (it.kind === 'marco') return I.marcoSinTapa;
    return I.noMesaHierro;
  },
  umbral: it => {
    if (it.kind === 'mesaHierro') return null;
    if (it.kind === 'marco') return I.marcoSolo;
    return I.noMesaHierro;
  },
  seguridad: it => (it.kind === 'mesa' ? null : I.noMesa),
  calidad: it => (it.kind !== 'corredera' ? I.noCorredera : it.defect ? I.correderaTorcida : null),
  cajoneras: it => {
    if (it.kind !== 'cajonera') return it.kind === 'cajon' ? I.cajonSuelto : I.noCajonera;
    if (it.defect) return I.cajonTrabado;
    return null;
  },
  dosClientes: (it, tr) => (tr.want === 'mesa' ? mesaCheck(it) : it.kind === 'tabla' ? null : I.escuelaTablas),
  granFabrica: (it, tr) => (it.defect ? I.rayado : it.kind === tr.want ? null : fmt(I.camionEquivocado, { producto: TRUCKN[it.kind] || it.kind })),

  // ---------- Planta de reciclaje ----------
  r_bolsa: camionONoSeRecicla,
  r_vereda: camionONoSeRecicla,
  r_triaje: camionOMotivo,
  r_dep1: camionOMotivo,
  r_fardo: it => (it.kind !== 'fardo' ? R.papelSuelto : it.mixed ? R.fardoConPlastico : null),
  r_contador: (it, tr) => {
    const r = rFardoCheck(it);
    if (r) return r;
    if (tr.want === 'balanza' && !it.c3) return R.noEraTercero;
    if (tr.want === 'fardo' && it.c3) return R.eraTercero;
    return null;
  },
  r_centro: (it, tr) => {
    if (!truckMatch(it, tr)) return wrongTruck(it, tr);
    if (tr.want !== 'vidrio' && it.kind !== 'fardo') return R.sinEnfardarCorto;
    if (it.mixed) return R.fardoMezclado;
    return null;
  },
  r_cooperativa: camionONoSeRecicla,
  r_iman: camionOMotivo,
  r_aire: camionOMotivo,
  r_optico: camionOMotivo,
  r_electronicos: camionOMotivo,
  r_dep2: camionOMotivo,
  r_relleno: camionONoSeRecicla,
  r_planta: camionOMotivo,
  r_sorpresa: camionOMotivo,
  r_plastico: it => (it.kind !== 'pellets' ? R.noPellets : it.dirty > 0 ? R.pelletsSucios : null),
  r_dep3: it => (it.kind !== 'pellets' ? R.todaviaNoPellets : it.dirty > 0 ? R.pelletsSinLavar : null),
  r_reuso: (it, tr) => {
    if (!truckMatch(it, tr)) return wrongTruck(it, tr);
    if (it.defect) return R.botellaRota;
    return null;
  },
  r_compost: compostOk(R.compostCrudoLargo),
  r_biogas: compostOk(R.compostCrudo),
  r_puntoVerde: compostOk(R.compostCrudo),
  r_basuraCero: compostOk(R.compostCrudoCorto),
  r_circular: (it, tr) => {
    if (!truckMatch(it, tr)) return wrongTruck(it, tr);
    if (it.dirty > 0) return R.pelletsSuciosCorto;
    return null;
  },

  // ---------- La usina ----------
  eCheck
};

export const BIN_CHECKS = {
  r_bolsaTacho: it => (RECY(it) ? reciclableAlRelleno(it) : null),
  r_veredaTacho: it => (RECY(it) ? reciclableAlRelleno(it) : null),
  r_contadorTacho: it => (CAT[it.kind] === 'papel' ? R.papelAlRelleno : null),
  r_centroTacho: reciclableAlTacho,
  r_cooperativaTacho: reciclableAlTacho,
  r_electronicosTacho: it => (it.kind === 'pila' ? R.pilaAlRelleno : it.kind === 'celular' ? R.celularAlRelleno : null),
  r_plantaTacho: reciclableAlTacho,
  r_sorpresaTacho: reciclableAlTacho,
  r_puntoVerdeTacho: it => (RECY(it) ? R.algoReciclable : it.kind === 'organico' ? R.comidaACompost : null),
  r_basuraCeroTacho: it => (RECY(it) ? R.algoReciclable : it.kind === 'organico' ? R.comidaAlRelleno : null),
  // Al vertedero puede ir cualquier cosa, sin error ni aviso
  e_crecidaTacho: () => null,
  e_puebloTacho: () => null,
  e_termoTacho: () => null,
  e_ahorroTacho: () => null
};
