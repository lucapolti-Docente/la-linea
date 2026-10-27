/* La línea de producción: una o más cintas en serie (la salida de una entra en la siguiente).
   Recibe el catálogo de estaciones; no sabe nada de niveles concretos. */
import { crearPieza } from './pieza.js';
import { aplicar } from './estacion.js';
import { reloj } from './reloj.js';

/* Agrupa los casilleros en puestos. Los vacíos (null) no cuentan.
   Dos estaciones iguales seguidas en la misma cinta son un solo puesto con k = 2: la pieza pasa por una sola. */
export function puestos(cintas) {
  const lista = [];
  cintas.forEach((casilleros, cinta) => {
    let ant = null;
    casilleros.forEach((id, casillero) => {
      if (!id) return;
      if (ant && ant.id === id && ant.cinta === cinta) { ant.k++; ant.casilleros.push(casillero); return; }
      ant = { id, cinta, k: 1, casilleros: [casillero] };
      lista.push(ant);
    });
  });
  return lista;
}

/* Hace pasar una pieza por todos los puestos y, al final, por la prueba (si hay).
   Devuelve los pasos: uno por puesto, con la pieza antes y después. Para en el primer "no funciona" o desvío. */
export function recorrer(entra, ps, catalogo, prueba) {
  let pieza = crearPieza(entra);
  const pasos = [];
  const etapas = prueba ? ps.concat([{ id: prueba, prueba: true, k: 1, casilleros: [] }]) : ps;
  for (const puesto of etapas) {
    const r = aplicar(pieza, catalogo[puesto.id]);
    pasos.push({ puesto, antes: pieza, despues: r.pieza, resultado: r.resultado, motivo: r.motivo });
    pieza = r.pieza;
    if (r.resultado === 'falla' || pieza.descartada) break;
  }
  const ultimo = pasos[pasos.length - 1];
  return { pieza, pasos, falla: ultimo && ultimo.resultado === 'falla' ? ultimo : null };
}

/* Produce un lote. cfg: { entra, cintas: [[ids o null]], lote, rajadas: [índices], prueba }.
   Todas las piezas son iguales salvo las rajadas, así que se recorre una de cada clase.
   La línea para en la primera pieza que no funciona. */
export function producir(cfg, catalogo) {
  const ps = puestos(cfg.cintas);
  const n = Math.max(1, cfg.lote | 0);
  const rajadas = (cfg.rajadas || []).filter(i => i < n);
  const sana = recorrer(cfg.entra, ps, catalogo, cfg.prueba);
  const rajada = rajadas.length ? recorrer(Object.assign({}, cfg.entra, { rajada: true }), ps, catalogo, cfg.prueba) : null;

  let falla = null;
  if (sana.falla) falla = Object.assign({ pieza: 0 }, sana.falla);
  else if (rajada && rajada.falla) falla = Object.assign({ pieza: rajadas[0] }, rajada.falla);

  const cuantasRajadas = falla ? rajadas.filter(i => i < falla.pieza).length : rajadas.length;
  const hechas = falla ? falla.pieza : n;
  const enCaja = rajada && rajada.pieza.descartada ? cuantasRajadas : 0;
  return {
    puestos: ps, n, rajadas, sana, rajada, falla,
    entregadas: hechas - enCaja,
    descartadas: enCaja,
    tiempo: reloj(ps, catalogo, n)
  };
}
