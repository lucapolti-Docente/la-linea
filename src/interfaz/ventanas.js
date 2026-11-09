/* Ventanas: intro del nivel, cómo funciona (botón ?), ganaste y perdiste. */
import { $, ui, fmtHora } from './dom.js';
import { G } from '../motor/estado.js';
import { resetProduction, usage } from '../motor/partida.js';
import { par, estrellas } from '../motor/estrellas.js';
import { PARTS } from '../datos/piezas.js';
import { TX } from '../datos/textos.js';
import { fmt } from '../datos/mensajes.js';
import { paintIcon, starSvg } from '../dibujo/util.js';
import { drawItem } from '../dibujo/piezas.js';
import { diagrama } from '../dibujo/diagramas.js';
import { dibujar } from '../dibujo/iconos.js';
import { guardarEstrellas } from '../guardado.js';
import { show } from './pantallas.js';
import { startLevel, updateSide, WL } from './juego.js';

const V = TX.ventanas;

/* El diagrama de un nivel puede depender de la partida (por ejemplo, del plano que tocó). */
export function diag(L) { return typeof L.diagram === 'function' ? L.diagram(G) : L.diagram; }

export function openModal(html, after, wide) {
  $('.modal-card').classList.toggle('wide', !!wide); $('#modalBody').innerHTML = html; $('#modal').hidden = false;
  $('#modalBody').querySelectorAll('[data-close]').forEach(b => { b.onclick = closeModal; });
  if (after) after();
  const f = $('#modalBody').querySelector('.btn.primary'); if (f) f.focus({ preventScroll: true });
  $('.modal-card').scrollTop = 0;
}
export function closeModal() { $('#modal').hidden = true; }

function kindCls(k) { return k.startsWith('Desaf') ? 'des' : k === 'Depurar' ? 'dep' : (k === 'Diseñá' || k === 'Optimizá') ? 'abi' : ''; }

export function showIntro() {
  const L = G.L;
  openModal(`<span class="eyebrow">${fmt(V.intro, { acto: L.act, n: L.n })}</span><h2>${L.title}</h2><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="kind ${kindCls(L.kind)}">${L.kind}</span><span class="chip">${L.concept}</span></div><p>${L.text}</p>
   ${L.diagram ? `<div>${diagrama(diag(L))}</div>` : ''}
   ${L.dato ? `<div class="dato"><b>${V.industriaReal}</b>${L.dato}</div>` : ''}
   <div class="preview"><canvas id="introIcon" width="64" height="64"></canvas><div><div class="eyebrow">${V.pedido}</div><strong>${G.N} ${G.productName}</strong></div></div>
   <div class="modal-actions"><button class="btn primary big" data-close>${V.aTrabajar}</button><button class="btn" id="introHow">${V.comoFunciona}</button><button class="btn" id="introBack">${V.volverNiveles}</button></div>`,
  () => { paintIcon($('#introIcon'), c => drawItem(c, L.sample || { kind: L.product, steps: G.recipe, defect: false }), 64); $('#introBack').onclick = () => { closeModal(); show('levels'); }; $('#introHow').onclick = showParts; }, true);
}

export function showParts() {
  const L = G.L; G.running = false; updateSide();
  openModal(`<span class="eyebrow">${fmt(V.partesTitulo, { n: L.n, titulo: L.title })}</span><h2>${V.comoFunciona}</h2><p>${L.goal(G.N, G)}</p>${L.diagram ? `<div>${diagrama(diag(L))}</div>` : ''}
   <div class="parts">${L.parts.map(k => `<div class="part"><canvas width="56" height="56" data-p="${k}"></canvas><div><h4>${PARTS[k].name}${L.news.includes(k) ? ` <span class="chip">${V.nuevo}</span>` : ''}</h4><p>${PARTS[k].text}</p></div></div>`).join('')}</div>
   <div class="modal-actions"><button class="btn primary" data-close>${V.entendido}</button></div>`,
  () => $('#modalBody').querySelectorAll('canvas[data-p]').forEach(cv => paintIcon(cv, c => { c.scale(.92, .92); dibujar(c, PARTS[cv.dataset.p].dibujo); }, 56)), true);
}

export function showWin() {
  const L = G.L, p = par(L, G.N), stars = estrellas(L, G.N, G.tick);
  guardarEstrellas(ui.mundo, L.id, stars);
  const next = G.idx + 1 < WL().length, u = usage();
  const errores = G.errors ? fmt(V.conErrores, { n: G.errors, palabra: G.errors === 1 ? V.error : V.errores }) : V.sinErrores;
  const energia = G.waste ? fmt(V.energia, { n: G.waste, palabra: G.waste === 1 ? V.vez : V.veces }) : '';
  openModal(`<span class="eyebrow">${fmt(V.completo, { n: L.n })}</span><h2>${L.final ? V.fabricaTerminada : V.entregado}</h2><div class="big-stars">${[1, 2, 3].map(k => starSvg(k <= stars, 40)).join('')}</div>
   <p>${fmt(V.salio, { N: G.N, producto: G.productName, hora: fmtHora(G.tick), errores })}</p>
   <ul class="crit"><li class="ok">${V.estrella1}</li><li class="${stars >= 2 ? 'ok' : ''}">${fmt(V.estrella2, { hora: fmtHora(Math.floor(p * 1.5)) })}</li><li class="${stars >= 3 ? 'ok' : ''}">${fmt(V.estrella3, { hora: fmtHora(p) })}</li></ul>
   <p style="color:var(--muted)">${fmt(V.usaste, { cintas: u.belts, estaciones: u.st, energia })}${stars < 3 ? V.mejorar : ''}</p>
   ${L.reflect ? `<div class="dato"><b>${V.quienTrabaja}</b>${L.reflect}</div>` : ''}
   ${L.final ? `<div class="preview"><div><div class="eyebrow">${V.finRecorrido}</div><p style="margin:6px 0 0">${V.final}</p></div></div>` : ''}
   <div class="modal-actions">${next ? `<button class="btn primary" id="wNext">${V.siguiente}</button>` : `<button class="btn primary" id="wLv">${V.verNiveles}</button>`}<button class="btn" id="wAgain">${V.otraLinea}</button><button class="btn" id="wSame">${V.mejorarEsta}</button></div>`,
  () => {
    const n = $('#wNext'); if (n) n.onclick = () => { closeModal(); startLevel(G.idx + 1); };
    const l = $('#wLv'); if (l) l.onclick = () => { closeModal(); show('levels'); };
    $('#wAgain').onclick = () => { closeModal(); startLevel(G.idx); };
    $('#wSame').onclick = () => { closeModal(); resetProduction(); updateSide(); };
  });
}

export function showLose(r, late) {
  openModal((late
    ? `<span class="eyebrow">${V.horaEyebrow}</span><h2>${V.horaTitulo}</h2><p>${fmt(V.horaTexto, { hora: fmtHora(G.dl) })}</p><p style="color:var(--muted)">${V.horaAyuda}</p>`
    : `<span class="eyebrow">${V.devueltoEyebrow}</span><h2>${V.devueltoTitulo}</h2><p>${fmt(V.devueltoTexto, { motivo: r.charAt(0).toLowerCase() + r.slice(1) })}</p><p style="color:var(--muted)">${V.devueltoAyuda}</p>`) + `
   <div class="modal-actions"><button class="btn primary" id="lFix">${V.revisar}</button><button class="btn" id="lHint">${V.verPista}</button></div>`,
  () => { $('#lFix').onclick = () => { closeModal(); resetProduction(); updateSide(); }; $('#lHint').onclick = () => $('#hintBtn').click(); });
}
