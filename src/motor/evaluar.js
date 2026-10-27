/* Compara lo producido con el pedido del cliente.
   ⭐ sale igual al modelo (y la cantidad pedida, si la hay) · ⭐⭐ además sin defectos · ⭐⭐⭐ además dentro del tiempo meta.
   fin: 'falla' (no funciona), 'distinta' (salió, pero no es lo que pidió) o 'gana'. */
import { cumple } from './pieza.js';

export function evaluar(pedido, prod) {
  const modelo = pedido.modelo || {};
  const final = prod.sana.pieza;
  const items = Object.keys(modelo).map(id => ({ id, ok: !prod.falla && cumple(final, { [id]: modelo[id] }) }));
  const faltan = pedido.pedido ? pedido.pedido - prod.entregadas : 0;

  const defectos = [];
  const sumar = d => { if (defectos.indexOf(d) < 0) defectos.push(d); };
  if (!prod.falla) {
    final.defectos.forEach(sumar);
    if (prod.rajada) {
      prod.rajada.pieza.defectos.forEach(sumar);
      if (!prod.rajada.pieza.descartada) sumar('rajada');
    }
  }

  const igual = !prod.falla && items.every(i => i.ok) && faltan === 0;
  const sinDefectos = igual && defectos.length === 0;
  const aTiempo = sinDefectos && (pedido.meta == null || prod.tiempo.total <= pedido.meta);
  return {
    fin: prod.falla ? 'falla' : igual ? 'gana' : 'distinta',
    estrellas: aTiempo ? 3 : sinDefectos ? 2 : igual ? 1 : 0,
    items, faltan, defectos,
    aTiempo: pedido.meta == null || prod.tiempo.total <= pedido.meta
  };
}
