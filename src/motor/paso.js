/* Un tick de la línea: entradas, estaciones, sensores, cintas, camiones, errores, tiempo y energía.
   Lógica pura: los carteles quedan en G.eventos y la interfaz los muestra. */
import { G, W } from './estado.js';
import { DX, DY, PROC, key, tileAt, eachTile, isNight } from './partida.js';
import { STATIONS } from '../datos/estaciones.js';
import { CAT } from '../datos/materiales.js';
import { STEP_NAME } from '../datos/textos.js';
import { MSG, fmt } from '../datos/mensajes.js';
import { eCheck } from '../reglas/comun.js';

const M = MSG.motor;
const ahora = () => performance.now();

/* Cartel sobre el tablero. kind: '' (info), 'warn' (aviso: el círculo titila 3 s) o 'bad' (error: queda marcado hasta Reiniciar).
   Se marca la celda G.mk (la última que tocó el motor). */
export function avisar(msg, kind = '') {
  const now = ahora();
  if (G.mk && (kind === 'bad' || kind === 'warn')) {
    G.marks = (G.marks || []).filter(m => m.x !== G.mk[0] || m.y !== G.mk[1]);
    G.marks.push({ x: G.mk[0], y: G.mk[1], t: now, keep: kind === 'bad' });
  }
  G.eventos.push({ msg, kind, t: now });
}

/* Se perdió el nivel: la interfaz muestra la ventana después de `espera` ms. late: se fue el camión. */
function perder(r, late, espera) {
  G.lost = true; G.running = false;
  G.lose = { r, late: !!late, at: ahora() + espera };
}

/* Un error más: con 3, se pierde. */
function error(r) {
  G.errors++; avisar(r, 'bad');
  if (G.errors >= 3) perder(r, false, 500);
}

export function stationAccepts(t, item, mdir, strict) {
  const def = STATIONS[t.type], side = (mdir + 2) % 4;
  if (t.broken || def.passive || t.maint > 0) return false;
  if (side === t.dir) return false;
  if ((def.sensor || def.split) && side === t.alt) return false;
  if (def.battery) { if (item.kind !== 'elec' || item.v === 'alta') return false; return strict ? true : (t.charge || 0) < def.battery; }
  if (def.split) return strict ? true : !t.proc;
  if (def.combineAny) { if (item.kind === 'fardo') return false; if (strict) return true; return !t.proc && t.bufItems.length < def.combineAny; }
  if (def.combine) { const need = def.combine[item.kind]; if (!need) return false; if (item.kind === 'tabla' && item.steps.includes('clavar')) return false; if (strict) return true; return !t.proc && (t.buf[item.kind] || 0) < need; }
  if (item.kind === 'clavos') return false;
  if ((item.kind === 'banquito' || item.kind === 'caja') && !def.sensor) return false;
  if (item.kind === 'tronco' && !def.sensor && t.type !== 'sierra') return false;
  if (def.accepts) { if (!def.accepts.includes(item.kind)) return false; }
  else if (!def.sensor && !def.combine && !['tabla', 'tronco'].includes(item.kind)) return false;
  return strict ? true : !t.proc;
}

/* Intenta pasar la pieza a la celda (x,y) entrando en dirección mdir. existing: ya estaba en una cinta. */
function deliver(x, y, item, mdir, ox, oy, occ, existing) {
  G.mk = [x, y]; const t = tileAt(x, y); if (!t) return false;
  if (t.t === 'belt') {
    const k = key(x, y); if (occ.has(k)) return false;
    if (existing) occ.delete(key(item.x, item.y)); else { item.px = ox; item.py = oy; item.gone = false; G.items.push(item); }
    item.x = x; item.y = y; item.moved = true; item.wait = 0; item.dead = false; item.rej = false; occ.set(k, item);
    if (G.L.lossDist && item.kind === 'elec' && item.v !== 'alta') item.dist = (item.dist || 0) + 1; return true;
  }
  const consume = () => { if (existing) { item.gone = true; occ.delete(key(item.x, item.y)); } };
  if (t.t === 'station') {
    const sd = STATIONS[t.type], side = (mdir + 2) % 4;
    if ((item.kind === 'barra' || item.kind === 'hierro') && ['cortar', 'sierra', 'lijar', 'lijadora', 'marcar'].includes(t.type) && !t.broken && side !== t.dir) {
      t.broken = true; t.proc = null; consume();
      error(sd.machine ? M.metalMaquina : M.metalPersona); return true;
    }
    if (item.kind === 'tronco' && !sd.machine && !sd.sensor && !sd.split && !t.broken && side !== t.dir) {
      t.broken = true; t.proc = null; t.buf = {}; t.bufItems = []; consume();
      error(M.troncoMesa); return true;
    }
    if (item.big && sd.machine === 'wheel' && !t.broken && side !== t.dir && stationAccepts(t, item, mdir, true)) {
      t.broken = true; t.proc = null; consume(); error(M.crecida); return true;
    }
    if (sd.burnHot && (item.temp || 25) > 80 && stationAccepts(t, item, mdir, true)) {
      consume(); t.burn = ahora(); error(fmt(M.marcoQuema, { temp: item.temp })); return true;
    }
    if (!stationAccepts(t, item, mdir, false)) return false;
    const def = STATIONS[t.type];
    if (def.combine) { t.buf[item.kind] = (t.buf[item.kind] || 0) + 1; t.bufItems.push(item); }
    else if (def.combineAny) t.bufItems.push(item);
    else if (def.battery) { t.charge = (t.charge || 0) + 1; consume(); return true; }
    else t.proc = { item, timer: def.timer ? t.time + 1 : (def.proc ?? PROC), applied: false };
    consume(); return true;
  }
  if (t.t === 'truck') { if (G.done) return false; consume(); judge(item, t); return true; }
  if (t.t === 'bin') {
    consume(); G.wasted++;
    if (G.L.binWarn) avisar(G.L.binWarn, 'warn');
    if (G.L.binCheck) { const r = G.L.binCheck(item); if (r) error(r); }
    else if (!item.defect) avisar(M.piezaSanaTacho, 'warn');
    return true;
  }
  return false;
}

/* Llegó una pieza a un camión o destino. */
function judge(item, tr) {
  const L = G.L, now = ahora(); let r;
  if (tr.ambient) { tr.got++; tr.bump = now; return; }
  if (tr.night && isNight() && item.born === 'd') { G.waste = (G.waste || 0) + 1; avisar(M.deDia, 'warn'); return; }
  if (tr.night && !isNight()) { G.waste = (G.waste || 0) + 1; avisar(M.diaSinUso, 'warn'); return; }
  if (tr.thermo) {
    if (item.kind !== 'calor') { error(eCheck(item, tr)); return; }
    tr.temp += 2; tr.bump = now;
    if (tr.temp > 26) error(fmt(M.casaCaliente, { temp: tr.temp }));
    return;
  }
  if (tr.doneAt) { avisar(M.sobro, 'warn'); G.wasted++; return; }
  if (L.check) r = L.check(item, tr);
  else { const R = G.recipe; const ok = item.kind === L.product && !item.defect && item.steps.length === R.length && item.steps.every((s, i) => s === R[i]); r = ok ? null : reason(item); }
  if (!r) {
    tr.got++; tr.bump = now; G.delivered++; if (tr.got >= tr.n) tr.doneAt = now;
    if (G.trucks.every(x => x.got >= x.n)) { G.done = true; G.running = false; G.doneAt = now; }
  }
  else error(r);
}

/* Motivo de rechazo cuando el nivel tiene receta (plano). */
function reason(item) {
  const L = G.L, m = MSG.receta;
  if (item.kind === 'clavos') return m.clavosSueltos;
  if (item.defect) return m.nudo;
  if (L.product === 'banquito' && item.kind === 'tabla') return m.tablaSola;
  const miss = G.recipe.filter(s => !item.steps.includes(s));
  const extra = item.steps.filter(s => !G.recipe.includes(s)); if (extra.length) return fmt(m.pasoDeMas, { pasos: extra.map(s => STEP_NAME[s] || s).join(m.y) });
  if (miss.length) return fmt(m.falto, { pasos: miss.map(s => STEP_NAME[s]).join(m.y) });
  return fmt(m.otroOrden, { pasos: item.steps.map(s => STEP_NAME[s]).join(m.despues) });
}

/* Avanza la línea un tick. */
export function step() {
  G.tick++;
  if (G.dl && G.tick > G.dl && !G.done && !G.lost) { G.mk = null; avisar(M.hora, 'bad'); perder(M.hora, true, 400); return; }
  if (G.tick % 3 === 0) G.trucks.forEach(tr => {
    if (!tr.thermo || tr.got >= tr.n) return; tr.temp = Math.max(8, tr.temp - 1);
    if (tr.temp >= 18 && tr.temp <= 22) { tr.got++; G.delivered++; tr.bump = ahora(); if (tr.got >= tr.n) tr.doneAt = ahora(); if (G.trucks.every(x => x.got >= x.n)) { G.done = true; G.running = false; G.doneAt = ahora(); } }
  });
  const occ = new Map();
  G.items.forEach(it => { it.px = it.x; it.py = it.y; it.moved = false; occ.set(key(it.x, it.y), it); });
  if (G.pasillo >= 0) { const ph = (G.tick - 4) % (W + 4); G.techX = G.tick >= 4 && ph < W + 2 ? ph - 1 : -99; if (G.techX === -1) G.techHit = {}; }
  eachTile((t, x, y) => {
    if (t.t !== 'station') return; const def = STATIONS[t.type];
    t.paused = false;
    if (t.maint > 0 && !t.proc) { t.maint--; return; }
    if (def.battery) { if ((t.charge || 0) > 0 && (!G.L.daynight || isNight())) { const it = { id: G.nextId++, kind: 'elec', v: 'baja', steps: [], wait: 0 }; if (deliver(x + DX[t.dir], y + DY[t.dir], it, t.dir, x, y, occ, false)) t.charge--; } return; }
    if (G.pasillo >= 0 && def.machine === 'arm' && Math.abs(y - G.pasillo) === 1 && Math.abs(x - G.techX) <= 1) {
      let safe = false; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const n = tileAt(x + dx, y + dy); if (n && n.t === 'station' && STATIONS[n.type].passive) safe = true; }
      t.paused = true;
      if (!safe && !G.techHit[key(x, y)]) { G.mk = [x, y]; G.techHit[key(x, y)] = 1; t.accident = ahora(); error(M.peligroBrazo); }
      return;
    }
    if (def.combineAny && !t.proc && t.bufItems.length >= def.combineAny) {
      const b = t.bufItems, m0 = b[0].kind;
      t.proc = { item: { id: G.nextId++, kind: 'fardo', mat: m0, steps: [], mixed: b.some(i => CAT[i.kind] !== CAT[m0]) }, timer: def.proc, applied: false }; t.bufItems = [];
    }
    if (def.combine && !t.proc && Object.entries(def.combine).every(([k, n]) => (t.buf[k] || 0) >= n)) {
      const main = t.bufItems.find(i => i.kind === 'tabla') || t.bufItems[0];
      if (def.loss) t.lossFx = ahora();
      const ni = { id: G.nextId++, kind: def.makes || 'banquito', steps: [...main.steps], defect: t.bufItems.some(i => i.defect), wood: main.wood };
      if (def.heat) { t.made = (t.made || 0) + 1; ni.temp = t.made === 1 ? 300 : t.made === 2 ? 200 : [200, 250, 300][Math.floor(G.drng() * 3)]; }
      t.proc = { item: ni, timer: def.proc ?? PROC, applied: false }; t.buf = {}; t.bufItems = [];
    }
    if (t.proc) {
      if (t.proc.timer > 0) t.proc.timer--;
      if (t.proc.timer <= 0) {
        if (!t.proc.applied) {
          const it = t.proc.item;
          if (t.type === 'sierra' && it.kind === 'tronco') { it.kind = 'tabla'; it.steps.push('aserrar'); }
          else if (def.step && !((def.step === 'secar' || def.step === 'enfriar') && it.steps.includes(def.step))) it.steps.push(def.step);
          if (t.type === 'barniz') { it.wet = it.dryNeed || 0; it.coats = (it.coats || 0) + 1; if (it.coats > 1) it.steps.pop(); }
          if (t.type === 'horno' && it.wet > 0) it.wet--;
          if (t.type === 'hornoReloj') it.wet = Math.max(0, (it.wet || 0) - t.time);
          if (t.type === 'enfriador') it.temp = Math.max(25, (it.temp || 25) - 50);
          if (t.type === 'trituradora') { it.defect = false; if (it.kind === 'vidrio') it.kind = 'calcin'; else { it.mat = it.kind; it.kind = 'escamas'; } }
          if (t.type === 'lavadora' && it.dirty > 0) it.dirty--;
          if (t.type === 'compostera') it.wet = Math.max(0, (it.wet || 0) - t.time);
          if (def.counter) { t.made = (t.made || 0) + 1; it.c3 = t.made % def.counter === 0; }
          if (G.L.energy && def.machine && !def.sensor && !def.split) {
            G.kwh = (G.kwh || 0) + 1;
            if (G.kwh > G.L.energy && !G.lost) { G.mk = [x, y]; const r = fmt(M.boleta, { kwh: G.L.energy }); avisar(r, 'bad'); perder(r, false, 500); }
          }
          if (G.L.wear && G.L.wear[t.type]) { t.uses = (t.uses || 0) + 1; if (t.uses % G.L.wear[t.type][0] === 0) { t.maint = G.L.wear[t.type][1]; G.mk = [x, y]; avisar(M.mantenimiento, 'warn'); } }
          if (def.makesKind) it.kind = def.makesKind;
          if (it.kind === 'elec' && !it.v) it.v = 'baja'; if (G.L.daynight && it.kind === 'elec' && !it.born) it.born = isNight() ? 'n' : 'd'; if (def.up) { it.v = 'alta'; it.dist = 0; } if (def.down) { it.v = 'baja'; it.dist = 0; } if (def.loss) t.lossFx = ahora();
          if (t.type === 'embalar') it.kind = 'caja';
          t.proc.applied = true;
        }
        if (def.split) {
          const first = t.flipOut ? t.alt : t.dir, second = t.flipOut ? t.dir : t.alt;
          if (deliver(x + DX[first], y + DY[first], t.proc.item, first, x, y, occ, false)) { t.proc = null; t.flipOut = !t.flipOut; }
          else if (deliver(x + DX[second], y + DY[second], t.proc.item, second, x, y, occ, false)) t.proc = null;
        }
        else {
          const od = def.sensor && !def.test(t.proc.item, t) ? t.alt : t.dir;
          if (deliver(x + DX[od], y + DY[od], t.proc.item, od, x, y, occ, false)) t.proc = null;
        }
      }
    }
  });
  let changed = true, guard = 0;
  while (changed && guard++ < 200) {
    changed = false;
    for (const it of G.items) {
      if (it.moved || it.gone) continue;
      const t = tileAt(it.x, it.y);
      if (!t || t.t !== 'belt') { it.gone = true; occ.delete(key(it.x, it.y)); changed = true; continue; }
      if (deliver(it.x + DX[t.dir], it.y + DY[t.dir], it, t.dir, 0, 0, occ, true)) changed = true;
    }
  }
  if (G.L.lossDist) G.items.forEach(it => { if (!it.gone && it.kind === 'elec' && it.v !== 'alta' && it.dist > G.L.lossDist) { it.gone = true; G.mk = [it.x, it.y]; G.waste = (G.waste || 0) + 1; avisar(M.perdidaCable, 'warn'); } });
  G.items = G.items.filter(i => !i.gone);
  if (!G.done && !G.lost) {
    let lim = false, left = false; eachTile(t => { if (t.t === 'source' && t.limit) { lim = true; if (t.made < t.limit) left = true; } });
    if (lim && !left) { G.dryT = (G.dryT || 0) + 1; if (G.dryT > 25 && !G.items.length) { G.mk = null; const r = G.L.dryMsg || M.sinGas; avisar(r, 'bad'); perder(r, false, 400); } }
  }
  G.items.forEach(it => {
    if (it.moved) return; G.mk = [it.x, it.y];
    it.wait = (it.wait || 0) + 1;
    const t = tileAt(it.x, it.y), nt = tileAt(it.x + DX[t.dir], it.y + DY[t.dir]);
    it.dead = !nt || nt.t === 'pillar' || nt.t === 'source' || nt.t === 'module';
    it.rej = !!nt && nt.t === 'station' && !stationAccepts(nt, it, t.dir, true);
    if (it.rej && nt.broken) { if (it.wait === 4) avisar(G.mundo === 'ene' ? M.ruedaRota : M.mesaRota, 'warn'); }
    else if (it.rej && it.kind === 'tronco' && !G.toldTronco && it.wait > 1) { G.toldTronco = true; avisar(M.noRecibeTronco, 'warn'); }
    else if ((it.dead || it.rej) && !G.toldDead && it.wait > 2) { G.toldDead = true; avisar(it.dead ? M.finCinta : M.noRecibe, 'warn'); }
  });
  if (!G.done) eachTile((t, x, y) => {
    if (t.t !== 'source') return; if (t.limit && t.made >= t.limit) return; if (t.day && isNight()) return; if (t.from && G.tick < t.from) return;
    if (t.from && G.tick === t.from) { G.mk = [x, y]; avisar(M.camionSorpresa, 'warn'); }
    if (t.until && G.tick > t.until) { if (G.tick === t.until + 1) { G.mk = [x, y]; avisar(M.centralRota, 'warn'); } return; }
    t.cnt++;
    if (t.cnt >= t.interval) {
      const defect = t.defectSeq ? t.defectSeq[t.made % t.defectSeq.length] : t.defect ? (t.made === 1 ? true : t.made === 0 ? false : G.drng() < t.defect) : false;
      let kind = t.kind;
      if (t.mix) { if (t.made < t.mix.length) kind = t.mix[t.made][0]; else { const tot = t.mix.reduce((a, m) => a + m[1], 0); let q = G.drng() * tot; for (const m of t.mix) { q -= m[1]; if (q < 0) { kind = m[0]; break; } } } }
      if (t.seq) kind = t.seq[t.made % t.seq.length];
      const item = { id: G.nextId++, kind, steps: [...t.pre], defect, wait: 0 };
      if (item.kind === 'elec') item.v = 'baja';
      if (t.crecida) item.big = t.made === 1 || (t.made > 2 && G.drng() < .3);
      if (t.gusty && t.made > 1 && G.drng() < .45) { t.cnt = 0; return; }
      if (t.dirtyOn) item.dirty = t.made === 0 ? 1 : t.made === 1 ? 2 : 1 + Math.floor(G.drng() * 2);
      if (t.compost) item.wet = t.made === 0 ? 2 : t.made === 1 ? 3 : 2 + Math.floor(G.drng() * 2);
      if (t.kind === 'tronco') item.wood = 'pino';
      if (t.woods) item.wood = t.made === 0 ? 'roble' : t.made === 1 ? 'pino' : (G.drng() < .45 ? 'roble' : 'pino'); else if (t.wood) item.wood = t.wood;
      if (t.tags && item.wood !== 'roble') {
        if (t.tags === 'exact') item.tag = G.tagSeq[t.tagIdx % G.tagSeq.length];
        else item.tag = t.tagIdx === 0 ? 'azul' : t.tagIdx === 1 ? 'amarillo' : (G.drng() < .5 ? 'azul' : 'amarillo');
      }
      if (t.dry) item.dryNeed = t.dryMax ? (t.made === 0 ? 1 : t.made === 1 ? 3 : 1 + Math.floor(G.drng() * 3)) : (t.made === 0 ? 2 : (G.drng() < .4 ? 2 : 1));
      if (t.pre.includes('barniz')) { item.wet = item.dryNeed || 0; item.coats = 1; }
      if (deliver(x + 1, y, item, 0, x, y, occ, false)) { t.cnt = 0; t.made++; if (item.tag) t.tagIdx++; t.pulse = ahora(); }
    }
  });
}
