/* La pregunta de cada sensor: si devuelve true, la pieza sale por SÍ; si no, por NO.
   (pieza, estación) → true/false. */
import { CAT } from '../datos/materiales.js';
import { RECY } from './comun.js';
import { G } from '../motor/estado.js';

const sana = it => !it.defect;

export const PRUEBAS = {
  // Fábrica de muebles
  revisar: sana,
  escColor: it => it.tag === 'azul',
  manos: it => (it.coats || 0) >= 2,
  termo: it => !(it.wet > 0),
  escMadera: it => it.wood === 'roble',
  frio: (it, t) => (it.temp || 25) < (t ? t.thr : 80),
  calibre: sana,
  escSano: sana,
  escMesa: it => it.kind === 'mesa',
  escHierro: it => it.kind === 'mesaHierro',
  // Planta de reciclaje
  recReciclable: it => RECY(it),
  recPapel: it => CAT[it.kind] === 'papel',
  recPlastico: it => CAT[it.kind] === 'plastico',
  recVidrio: it => CAT[it.kind] === 'vidrio',
  recMetal: it => CAT[it.kind] === 'metal',
  iman: it => it.kind === 'acero',
  foucault: it => it.kind === 'lata',
  soplador: it => CAT[it.kind] === 'papel',
  optico: it => it.kind === 'pet',
  limpio: it => !(it.dirty > 0),
  sana,
  balanza: it => !!it.c3,
  recPila: it => it.kind === 'pila',
  recElec: it => it.kind === 'celular',
  recOrganico: it => it.kind === 'organico',
  // La usina
  compuerta: it => !!it.big,
  termostato: () => G.trucks.some(tr => tr.thermo && tr.temp < 20)
};
