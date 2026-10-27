/* Producir y Paso. Se arma una cola de acciones animadas a partir del resultado del motor:
   entrar → una acción por estación (tipo 'paso') → salir → resto del lote → evaluar.
   Producir corre todo lo que falta; Paso corre hasta terminar la próxima estación. */
import { S, $, snd, esperar, sacudir, factorTiempo, guardar } from './estado.js';
import { slotDe, botonDe, nuevaPieza, redibujarPieza, ubicarPieza, limpiarPiezas, efecto, EFECTO_TRABAJO, puntoReciclaje, cintasEnPantalla } from './cinta.js';
import { decir, dibujarTablero, marcarItem, cortar, refrescar, dibujarEstrellasBarra, dibujarCliente } from './juego.js';
import { ventanaResultado } from './ventanas.js';
import { jugar, puestos, cantidad } from '../motor/index.js';
import { DATOS } from '../datos/index.js';
import { ESTACIONES } from '../datos/estaciones.js';
import { T, FALLAS, DEFECTOS, ITEMS } from '../datos/textos.js';

/* ---------- Movimiento ---------- */
function mover(g, a, b, ms, corrida) {
  const dur = Math.max(1, ms * factorTiempo());
  return new Promise(fin => {
    const t0 = performance.now();
    (function cuadro(ahora) {
      if (corrida !== S.corrida) return fin(false);
      const k = Math.min(1, (ahora - t0) / dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      ubicarPieza(g, { px: a.px + (b.px - a.px) * e, py: a.py + (b.py - a.py) * e });
      if (k < 1) requestAnimationFrame(cuadro); else fin(true);
    })(t0);
  });
}
const distancia = (a, b) => Math.sqrt(Math.pow(a.px - b.px, 2) + Math.pow(a.py - b.py, 2));
const tiempoViaje = (a, b) => Math.min(900, 160 + distancia(a, b) * 2.2);

/* Dónde trabaja un puesto: debajo de su primer casillero (o en la salida, si es la prueba del final). */
const puntoDe = puesto => (puesto.prueba ? S.geo.salida : slotDe(puesto.cinta, puesto.casilleros[0]));
const botonesDe = puesto => (puesto.prueba ? [] : puesto.casilleros.map(i => botonDe(puesto.cinta, i)).filter(Boolean));

/* Qué cambió en la pieza, en palabras de la tarjeta del cliente. */
function queCambio(antes, despues) {
  return Object.keys(ITEMS).filter(k => !!despues[k] && !antes[k]).map(k => ITEMS[k][1].toLowerCase());
}

/* ---------- Armar la cola ---------- */
function armarCola(r) {
  const cola = [];
  const ctx = { pieza: null, punto: null, minutos: 0 };
  const sana = r.prod.sana;

  cola.push({ tipo: 'entrar', hacer: async corrida => {
    limpiarPiezas();
    $('cintaCaja').classList.add('andando');
    snd('producir');
    ctx.punto = S.geo.entrada;
    ctx.pieza = nuevaPieza(sana.pasos.length ? sana.pasos[0].antes : r.prod.sana.pieza, ctx.punto);
    dibujarTablero(0, 0);
    await esperar(250);
    return corrida === S.corrida;
  } });

  sana.pasos.forEach(paso => {
    cola.push({ tipo: 'paso', hacer: async corrida => {
      const destino = puntoDe(paso.puesto);
      const est = ESTACIONES[paso.puesto.id];
      if (paso.puesto.prueba) decir(T.prueba);
      if (!(await mover(ctx.pieza, ctx.punto, destino, tiempoViaje(ctx.punto, destino), corrida))) return false;
      ctx.punto = destino;
      const bs = botonesDe(paso.puesto);
      bs.forEach(b => b.classList.add('trabajando'));
      snd(est.sonido);
      if (EFECTO_TRABAJO[est.sonido]) efecto(destino, EFECTO_TRABAJO[est.sonido]);
      if (!paso.puesto.prueba) decir(T.trabajando(est.nombre));
      await esperar(650);
      if (corrida !== S.corrida) return false;
      bs.forEach(b => b.classList.remove('trabajando'));
      redibujarPieza(ctx.pieza, paso.despues);
      ctx.minutos += est.minutos;
      dibujarTablero(0, ctx.minutos);

      if (paso.resultado === 'falla') {
        bs.forEach(b => b.classList.add('mal'));
        sacudirPieza(ctx.pieza, ctx.punto);
        efecto(ctx.punto, /quem|horno|soldar/.test(paso.motivo) ? 'fuego' : /llenar/.test(paso.motivo) ? 'agua' : 'humo');
        snd('falla');
        decir(FALLAS[paso.motivo].join(' '), 'mal');
        return 'fin';
      }
      if (paso.resultado === 'peor' || (paso.motivo && DEFECTOS[paso.motivo])) {
        bs.forEach(b => b.classList.add('peor'));
        snd('peor');
        decir(est.nombre + ': ' + DEFECTOS[paso.motivo][0], 'peor');
        await esperar(900);
      } else if (paso.puesto.prueba) {
        snd('tilde');
        decir(T.pruebaBien, 'bien');
        await esperar(500);
      } else {
        const cambio = queCambio(paso.antes, paso.despues);
        decir(cambio.length ? T.cambio(est.nombre, cambio.join(' y ')) : T.sinCambio(est.nombre));
      }
      return corrida === S.corrida;
    } });
  });

  if (!r.prod.falla) {
    cola.push({ tipo: 'salir', hacer: async corrida => {
      const destino = S.geo.salida;
      if (ctx.punto !== destino && !(await mover(ctx.pieza, ctx.punto, destino, tiempoViaje(ctx.punto, destino), corrida))) return false;
      snd('pieza');
      ctx.pieza.remove();
      const n = r.prod.n;
      dibujarTablero(Math.min(1, r.prod.entregadas), n > 1 ? r.prod.tiempo.primera : r.prod.tiempo.total);
      return corrida === S.corrida;
    } });
    if (r.prod.n > 1) cola.push({ tipo: 'lote', hacer: corrida => flujo(r, corrida) });
    cola.push({ tipo: 'evaluar', hacer: corrida => evaluar(r, corrida) });
  }
  return cola;
}

function sacudirPieza(g, punto) {
  const pasos = [-8, 8, -5, 5, 0];
  pasos.forEach((d, i) => setTimeout(() => ubicarPieza(g, { px: punto.px + d, py: punto.py }), i * 80 * factorTiempo()));
}

/* ---------- El resto del lote: la cinta llena de piezas ---------- */
function flujo(r, corrida) {
  const n = r.prod.n;
  const vis = Math.min(n - 1, 14);
  const rajadas = r.prod.rajadas;
  const ps = r.prod.puestos;
  const puntos = [S.geo.entrada].concat(ps.map(p => puntoDe(p)));
  if (puntos[puntos.length - 1] !== S.geo.salida) puntos.push(S.geo.salida);
  const largos = [0];
  for (let i = 1; i < puntos.length; i++) largos.push(largos[i - 1] + distancia(puntos[i - 1], puntos[i]));
  const largo = largos[largos.length - 1];
  const viaje = 1500 * factorTiempo(), separa = Math.min(300, 2200 / Math.max(1, vis)) * factorTiempo();
  const total = viaje + separa * (vis - 1);
  const piezas = [];
  for (let j = 0; j < vis; j++) {
    const idx = n - 1 <= 14 ? j + 1 : Math.round(1 + j * (n - 2) / Math.max(1, vis - 1));
    const rajada = rajadas.indexOf(idx) >= 0 && r.prod.rajada;
    const camino = rajada ? r.prod.rajada : r.prod.sana;
    piezas.push({ t0: j * separa, camino, tramo: -1, g: null, fuera: false, desvio: camino.pieza.descartada ? camino.pasos.length : 0 });
  }
  snd('producir');
  decir(T.produciendo);
  return new Promise(fin => {
    const inicio = performance.now();
    let llegadas = 0, ultimoSonido = 0;
    (function cuadro(ahora) {
      if (corrida !== S.corrida) { fin(false); return; }
      const t = ahora - inicio;
      piezas.forEach(p => {
        if (p.fuera || t < p.t0) return;
        const d = Math.min(largo, ((t - p.t0) / viaje) * largo);
        let k = 0;
        while (k < largos.length - 2 && d > largos[k + 1]) k++;
        if (!p.g) p.g = nuevaPieza(p.camino.pasos.length ? p.camino.pasos[0].antes : p.camino.pieza, puntos[0]);
        // al pasar por un puesto, la pieza cambia
        const pasados = puntos.map((_, i) => i).filter(i => i > 0 && i <= ps.length && largos[i] <= d).length;
        if (pasados !== p.tramo) {
          p.tramo = pasados;
          if (pasados > 0) redibujarPieza(p.g, p.camino.pasos[Math.min(pasados, p.camino.pasos.length) - 1].despues);
        }
        // rajada que el sensor manda a reciclar
        if (p.desvio && pasados >= p.desvio) {
          p.fuera = true;
          const desde = puntos[p.desvio];
          mover(p.g, desde, puntoReciclaje(), 400, corrida).then(() => { if (p.g) p.g.remove(); });
          snd('reciclar');
          return;
        }
        const seg = Math.min(k, puntos.length - 2);
        const a = puntos[seg], b = puntos[seg + 1];
        const u = largos[seg + 1] > largos[seg] ? (d - largos[seg]) / (largos[seg + 1] - largos[seg]) : 1;
        ubicarPieza(p.g, { px: a.px + (b.px - a.px) * u, py: a.py + (b.py - a.py) * u });
        if (d >= largo) { p.fuera = true; p.g.remove(); llegadas++; if (ahora - ultimoSonido > 90) { snd('pieza'); ultimoSonido = ahora; } }
      });
      const k = Math.min(1, t / total);
      const llegan = piezas.filter(p => !p.desvio).length || 1;
      const hechas = 1 + Math.round((Math.min(llegadas, llegan) / llegan) * (r.prod.entregadas - 1));
      dibujarTablero(Math.min(r.prod.entregadas, hechas), r.prod.tiempo.primera + (r.prod.tiempo.total - r.prod.tiempo.primera) * k);
      if (t < total + 450) requestAnimationFrame(cuadro);
      else { dibujarTablero(r.prod.entregadas, r.prod.tiempo.total); fin(true); }
    })(inicio);
  });
}

/* ---------- Evaluar: tildes una por una y ventana de resultado ---------- */
async function evaluar(r, corrida) {
  $('cintaCaja').classList.remove('andando');
  for (const it of r.items) {
    marcarItem(it.id, it.ok);
    snd(it.ok ? 'tilde' : 'falta');
    await esperar(260);
    if (corrida !== S.corrida) return false;
  }
  S.ocupado = false;
  S.animando = false;
  S.paso = null;
  if (S.nivel.libre) { refrescar(); ventanaResultado(r); return 'fin'; }
  if (r.estrellas === 0) {
    const txt = r.faltan > 0 ? T.faltan(r.faltan) : r.faltan < 0 ? T.sobran(-r.faltan) : T.noIgual;
    decir(txt, 'mal');
    snd('falla');
    refrescar();
    return 'fin';
  }
  guardar({ estrellas: Object.assign({}, S.guardado.estrellas, { [S.nivel.id]: Math.max(r.estrellas, (S.guardado.estrellas || {})[S.nivel.id] || 0) }) });
  dibujarEstrellasBarra();
  decir(r.estrellas === 3 ? S.nivel.aprende : T.resultado[r.estrellas], r.estrellas === 3 ? 'bien' : r.defectos.length ? 'peor' : null);
  refrescar();
  ventanaResultado(r);
  return 'fin';
}

/* ---------- Correr la cola ---------- */
function empezar() {
  if (!puestos(cintasEnPantalla()).length) {
    decir(T.vacia, 'mal');
    sacudir($('cintaCaja'));
    snd('falla');
    return null;
  }
  cortar();
  dibujarCliente();
  const r = jugar(S.nivel, S.programa, DATOS);
  S.paso = { cola: armarCola(r), r };
  S.ocupado = true;
  return S.paso;
}

async function correr(soloUnPaso) {
  const estado = S.paso;
  const corrida = S.corrida;
  refrescarBotones(true);
  while (estado.cola.length && corrida === S.corrida) {
    const accion = estado.cola.shift();
    const ok = await accion.hacer(corrida);
    if (ok === false || corrida !== S.corrida) return;
    if (ok === 'fin') { terminar(); return; }
    if (soloUnPaso && accion.tipo === 'paso') break;
  }
  if (!estado.cola.length) terminar();
  else refrescarBotones(false);
}

function terminar() {
  S.ocupado = false;
  S.paso = null;
  $('cintaCaja').classList.remove('andando');
  refrescarBotones(false);
}

/* Mientras una acción anima, los botones esperan. Entre pasos, se puede seguir con Paso o Producir. */
function refrescarBotones(ocupado) {
  S.animando = ocupado;
  $('btnProducir').disabled = ocupado;
  $('btnPaso').disabled = ocupado;
  $('btnVaciar').disabled = ocupado;
}

export function producir() {
  if (S.animando) return;
  if (!S.paso && !empezar()) return;
  correr(false);
}

export function paso() {
  if (S.animando) return;
  if (!S.paso && !empezar()) return;
  correr(true);
}

/* Cuántas piezas se van a hacer (para el contador antes de producir). */
export const piezasDelNivel = () => cantidad(S.nivel, S.programa);
