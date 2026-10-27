/* Una estación transforma la pieza siguiendo su regla de datos (ver src/datos/estaciones.js):
   1. fallaSi: si se cumple alguna, NO FUNCIONA y la pieza no sigue.
   2. peorSi: si se cumple alguna, la pieza sale con ese defecto (SALE PEOR).
   3. hace: las propiedades que cambia.
   4. desviaSi: si se cumple, la pieza sale de la línea (por ejemplo, a la caja de reciclaje). */
import { cumple, copiar } from './pieza.js';

export function aplicar(pieza, est) {
  const falla = (est.fallaSi || []).find(r => cumple(pieza, r.si));
  if (falla) return { pieza: copiar(pieza), resultado: 'falla', motivo: falla.motivo };
  const despues = copiar(pieza);
  const peor = (est.peorSi || []).find(r => cumple(pieza, r.si));
  if (peor) despues.defectos.push(peor.defecto);
  Object.assign(despues, est.hace);
  const desvia = !!est.desviaSi && cumple(pieza, est.desviaSi);
  if (desvia) despues.descartada = true;
  return { pieza: despues, resultado: desvia ? 'desvia' : peor ? 'peor' : 'ok', motivo: peor ? peor.defecto : null };
}
