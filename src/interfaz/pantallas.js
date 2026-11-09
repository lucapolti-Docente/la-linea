/* Pantallas fuera del juego: inicio, elegir mundo, niveles, cómo se juega y progreso. Y el menú ☰. */
import { $, ui } from './dom.js';
import { G } from '../motor/estado.js';
import { MUNDOS, MUNDO } from '../mundos/index.js';
import { TX } from '../datos/textos.js';
import { fmt } from '../datos/mensajes.js';
import { paintIcon, starSvg } from '../dibujo/util.js';
import { dibujar } from '../dibujo/iconos.js';
import { bestW, PLAYER, saveAll, progText, borrarProgreso } from '../guardado.js';
import { startLevel, updateSide, resize } from './juego.js';
import { Sonido } from '../sonido.js';

const screens = ['home', 'diff', 'levels', 'help', 'config', 'game'];

export function show(name) {
  if (G && name !== 'game') { G.running = false; updateSide(); }
  ui.current = name;
  screens.forEach(s => { $('#scr-' + s).hidden = s !== name; });
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('current', b.dataset.go === name || (name === 'game' && b.dataset.go === 'levels')));
  closeDrawer();
  $('#qBtn').hidden = name !== 'game';
  $('#barInfo').textContent = name === 'game' && G ? fmt(TX.juego.barra, { acto: G.L.act, n: G.L.n, titulo: G.L.title }) : '';
  if (name === 'levels') buildLevels();
  if (name === 'help') buildHelp();
  if (name === 'config') buildProgress();
  if (name === 'diff') buildWorlds();
  if (name === 'game') requestAnimationFrame(resize);
  scrollTo(0, 0);
}

function openDrawer() { $('#drawer').classList.add('open'); $('#scrim').hidden = false; $('#menuBtn').setAttribute('aria-expanded', 'true'); }
function closeDrawer() { $('#drawer').classList.remove('open'); $('#scrim').hidden = true; $('#menuBtn').setAttribute('aria-expanded', 'false'); }

function buildWorlds() {
  const el = $('#worldCards');
  el.innerHTML = MUNDOS.map(m => `<button class="diff-card" data-w="${m.id}"><canvas width="72" height="72"></canvas><div><h3>${m.name}</h3><p>${m.desc} ${fmt(TX.mundos.cantidad, { n: m.levels.length })}</p></div></button>`).join('');
  el.querySelectorAll('.diff-card').forEach(b => {
    const m = MUNDO[b.dataset.w];
    paintIcon(b.querySelector('canvas'), c => { c.scale(m.iconoEscala, m.iconoEscala); dibujar(c, m.icono); }, 72);
    b.onclick = () => { ui.mundo = m.id; show('levels'); };
  });
}

function buildLevels() {
  const W = MUNDO[ui.mundo], acts = $('#acts');
  let html = '';
  $('#lvTitle').textContent = W.name;
  Object.entries(W.acts).forEach(([a, A]) => {
    html += `<div><div class="act-head"><span class="eyebrow">${fmt(TX.niveles.acto, { n: a })}</span><h3>${A.title}</h3><p>${A.desc}</p></div><div class="lv-grid">`;
    W.levels.forEach((L, i) => {
      if (L.act != +a) return; const s = bestW[ui.mundo][L.id] || 0;
      html += `<button class="lv" data-lv="${i}"><canvas width="56" height="56" data-icon="${i}"></canvas><span class="num">${fmt(TX.niveles.nivel, { n: L.n, tipo: L.kind })}</span><span class="t">${L.title}</span><span class="c">${L.concept}</span><span class="stars">${[1, 2, 3].map(k => starSvg(k <= s)).join('')}</span></button>`;
    });
    html += '</div></div>';
  });
  acts.innerHTML = html;
  acts.querySelectorAll('canvas[data-icon]').forEach(cv => paintIcon(cv, c => { c.scale(.92, .92); dibujar(c, W.levels[+cv.dataset.icon].icono); }, 56));
  acts.querySelectorAll('[data-lv]').forEach(b => { b.onclick = () => startLevel(+b.dataset.lv); });
}

const HELP_ICONS = [
  ['cinta', 0, 0.1, false], ['estacion', 'marcar', 0, {}], ['estacion', 'repartidor', 0, {}], ['entrada', 'clavos'],
  ['estacion', 'revisar', 0, { judge: 'bad' }], ['estacion', 'sierra', 0, { working: true }], ['estacion', 'escColor', 0, { judge: 'ok' }], ['camion'], ['pilar']
];
function buildHelp() {
  const items = TX.ayuda.items;
  $('#helpList').innerHTML = items.map((it, i) => `<div class="help-item"><canvas width="64" height="64" data-h="${i}"></canvas><div><h3>${it[0]}</h3><p>${it[1]}</p></div></div>`).join('');
  $('#helpList').querySelectorAll('canvas').forEach(cv => paintIcon(cv, c => { c.scale(.9, .9); dibujar(c, HELP_ICONS[+cv.dataset.h]); }, 64));
}

function buildProgress() {
  const P = TX.progreso;
  $('#pName').value = PLAYER.name;
  $('#pWorlds').innerHTML = MUNDOS.map(Wd => {
    const b = bestW[Wd.id] || {};
    const done = Wd.levels.filter(L => b[L.id]).length, st = Wd.levels.reduce((a, L) => a + (b[L.id] || 0), 0);
    return `<div class="prog-world"><h3>${Wd.name}</h3><p class="sum">${fmt(P.resumenMundo, { done, total: Wd.levels.length, st, max: Wd.levels.length * 3 })}</p><div class="prog-lv">${Wd.levels.map((L, i) => `<span class="${b[L.id] ? 'ok' : ''}" title="${L.title}">${i + 1} ${b[L.id] ? '★'.repeat(b[L.id]) : '·'}</span>`).join('')}</div></div>`;
  }).join('');
  $('#pText').hidden = true; $('#pReset').textContent = P.borrar; $('#pReset').dataset.sure = '';
}

export function conectarPantallas() {
  const P = TX.progreso;
  $('#learnList').innerHTML = TX.inicio.aprender.map(t => `<li>${t}</li>`).join('');
  const snd = $('#sndBtn'), pintarSonido = () => {
    const txt = Sonido.activo ? TX.menu.sonido : TX.menu.silencio;
    snd.setAttribute('aria-pressed', String(Sonido.activo)); snd.setAttribute('aria-label', txt); snd.title = txt;
  };
  snd.onclick = () => { Sonido.alternar(); pintarSonido(); Sonido.efecto('clic'); };
  pintarSonido();
  $('#menuBtn').onclick = () => ($('#drawer').classList.contains('open') ? closeDrawer() : openDrawer());
  $('#scrim').onclick = closeDrawer;
  document.querySelectorAll('[data-go]').forEach(b => { b.onclick = () => show(b.dataset.go); });
  $('#playBtn').onclick = () => show('diff');
  $('#pName').oninput = e => { PLAYER.name = e.target.value; saveAll(); };
  $('#pCopy').onclick = async () => {
    const t = progText(), ta = $('#pText'); ta.value = t; ta.hidden = false; let ok = false;
    try { await navigator.clipboard.writeText(t); ok = true; } catch (e) { /* sin portapapeles: queda seleccionado */ }
    ta.select(); $('#pCopy').textContent = ok ? P.copiado : P.seleccionado;
    setTimeout(() => { $('#pCopy').textContent = P.copiar; }, 2500);
  };
  $('#pReset').onclick = () => {
    const b = $('#pReset');
    if (!b.dataset.sure) { b.dataset.sure = '1'; b.textContent = P.seguro; return; }
    borrarProgreso(); buildProgress();
  };
}

