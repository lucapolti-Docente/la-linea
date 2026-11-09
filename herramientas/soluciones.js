/* npm run soluciones [mundo] [idNivel...]
   Juega la solución guardada de cada nivel con 30 semillas y muestra: cuántas gana, estrellas,
   ticks que tardó y margen contra el horario del camión. También si la solución mala pierde. */
import { MUNDOS, MUNDO } from '../src/mundos/index.js';
import { SOLUCIONES, SEMILLAS, jugar } from '../tests/soluciones/correr.js';

const [mundo, ...ids] = process.argv.slice(2);
const mundos = mundo ? [MUNDO[mundo]] : MUNDOS;
for (const M of mundos) {
  console.log(`\n${M.name}`);
  console.log('nivel                          gana  ⭐ (1/2/3)   ticks min-máx  margen horario  mala');
  for (const L of M.levels) {
    if (ids.length && !ids.includes(L.id)) continue;
    if (!SOLUCIONES[M.id][L.id]) { console.log(`${(L.n + '. ' + L.id).padEnd(30)} sin solución`); continue; }
    let gana = 0, est = [0, 0, 0, 0], tmin = 1e9, tmax = 0, margen = 1e9, falla = '';
    for (const s of SEMILLAS) {
      let r;
      try { r = jugar(M.id, L.id, s); } catch (e) { falla = falla || `semilla ${s}: ${e.message}`; continue; }
      if (r.gano) { gana++; est[r.estrellas]++; tmin = Math.min(tmin, r.tick); tmax = Math.max(tmax, r.tick); if (r.dl) margen = Math.min(margen, r.dl - r.tick); }
      else falla = falla || `semilla ${s}: ${r.motivo || 'no terminó (' + r.tick + ' ticks)'} · ${r.carteles.slice(-2).join(' | ')}`;
    }
    let mala = '';
    try { const r = jugar(M.id, L.id, SEMILLAS[0], 'mala', 1500); mala = r.perdio ? 'pierde' : r.gano ? 'GANA' : 'no gana'; } catch (e) { mala = 'error: ' + e.message; }
    console.log(`${(L.n + '. ' + L.id).padEnd(30)} ${String(gana).padStart(2)}/30  ${est.slice(1).join('/').padEnd(11)} ${gana ? (tmin + '-' + tmax).padEnd(14) : ''.padEnd(14)} ${margen < 1e9 ? String(margen).padEnd(15) : '-'.padEnd(15)} ${mala}`);
    if (falla) console.log('   ' + falla);
  }
}
