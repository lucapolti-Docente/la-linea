/* node herramientas/ver-tablero.js <mundo> <idNivel> [semilla]
   Muestra en texto el tablero que arma el generador, para escribir y revisar soluciones. */
import { MUNDO } from '../src/mundos/index.js';
import { crearPartida } from '../src/motor/partida.js';
import { dibujoTexto } from '../tests/soluciones/api.js';

const [mundo = 'muebles', id = 'tramo', semilla = '1'] = process.argv.slice(2);
const M = MUNDO[mundo], idx = M.levels.findIndex(l => l.id === id);
if (idx < 0) { console.log('No existe el nivel', id, 'en', mundo); process.exit(1); }
const G = crearPartida(M, idx, +semilla), L = G.L;
console.log(`${L.n}. ${L.title} (${L.kind}) · N=${G.N} · horario=${G.dl || '-'} · par=${L.par}+N*${L.per} · ${L.size.join('x')}`);
console.log(L.goal(G.N, G));
console.log('    ' + Array.from({ length: G.W }, (_, x) => String(x).padEnd(4)).join(''));
dibujoTexto(G.grid).split('\n').forEach((f, y) => console.log(String(y).padEnd(4) + f));
G.grid.forEach((f, y) => f.forEach((t, x) => {
  if (t && t.t === 'station') console.log(`  estación ${t.type} en ${x},${y} sale ${t.dir}${t.alt !== undefined ? ' alt ' + t.alt : ''}${t.fixed ? ' (fija)' : ''}`);
  if (t && t.t === 'source') console.log(`  entrada ${t.kind} en ${x},${y} cada ${t.interval}${t.mix ? ' mezcla ' + JSON.stringify(t.mix) : ''}${t.seq ? ' seq' : ''}${t.limit ? ' límite ' + t.limit : ''}${t.from ? ' desde ' + t.from : ''}${t.until ? ' hasta ' + t.until : ''}${t.module ? ' (módulo)' : ''}`);
  if (t && t.t === 'truck') console.log(`  destino ${t.want || '(pedido)'} x${t.n} en ${x},${y}${t.label ? ' "' + t.label + '"' : ''}${t.night ? ' noche' : ''}${t.thermo ? ' termo' : ''}`);
  if (t && t.t === 'bin') console.log(`  tacho en ${x},${y}`);
}));
