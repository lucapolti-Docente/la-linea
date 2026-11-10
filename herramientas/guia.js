/* npm run guia: arma public/docentes/ (página para docentes, una guía por mundo y la ficha en papel) a partir de
   src/datos/docentes.js y de los datos de cada mundo, y los imprime en PDF con un Chrome o Edge sin ventana.
   Correlo cada vez que cambies un nivel, un texto de docentes.js o este archivo. */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { MUNDOS } from '../src/mundos/index.js';
import { mulberry32 } from '../src/motor/azar.js';
import { diagrama } from '../src/dibujo/diagramas.js';
import { COMUN, GUIAS, FICHA, URL_DC } from '../src/datos/docentes.js';

const CARPETA = resolve('public/docentes');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Fuentes del juego incrustadas: las páginas y los PDF no cargan nada de internet. */
const fuente = (familia, peso, archivo) => `@font-face{font-family:'${familia}';font-weight:${peso};font-style:normal;src:url(data:font/woff2;base64,${readFileSync(resolve('src/fuentes', archivo)).toString('base64')}) format('woff2')}`;
const FUENTES = [fuente('Atkinson Hyperlegible', 400, 'atkinson-400.woff2'), fuente('Atkinson Hyperlegible', 700, 'atkinson-700.woff2'), fuente('Big Shoulders Stencil Display', '700 800', 'big-shoulders-stencil.woff2')].join('\n');

/* Los diagramas usan las mismas reglas que el juego (las .fh de juego.css), con colores de papel. */
const CSS_DIAGRAMA = readFileSync(resolve('src/estilos/juego.css'), 'utf8').split('\n').filter(l => l.startsWith('.fh')).join('\n');

const CSS = `${FUENTES}
:root{--ink:#1e2430;--muted:#5d6672;--line:#cfc4b0;--panel-2:#fbf7ef;--accent:#c98500;--ok:#2f8f55;--bad:#c4473b;--papel:#fff;--fondo:#f6f1e7;
  --f-body:"Atkinson Hyperlegible","Segoe UI",Arial,sans-serif;--f-display:"Big Shoulders Stencil Display",Impact,"Arial Narrow",sans-serif}
*{box-sizing:border-box}
body{margin:0;background:var(--fondo);color:var(--ink);font:16px/1.5 var(--f-body);padding:0 16px}
main{max-width:860px;margin:0 auto;padding:28px 0 56px}
h1,h2,h3{line-height:1.15;margin:0 0 8px}
h1{font:800 46px/1 var(--f-display);letter-spacing:.5px;text-transform:uppercase}
h2{font:800 28px/1.1 var(--f-display);text-transform:uppercase;margin-top:30px;padding-top:6px;border-top:4px solid var(--accent);display:inline-block}
h3{font-size:18px;margin-top:16px}
p{margin:0 0 10px}
a{color:#1f5fb4}
ul,ol{margin:0 0 10px;padding-left:1.3em}
li{margin:4px 0}
.sub{font-size:19px;color:var(--muted);margin-bottom:16px}
.card{background:var(--papel);border:2px solid var(--line);border-radius:12px;padding:12px 16px;margin:10px 0}
.nota{background:#fff4d6;border-color:#e6c25a}
.def{display:grid;grid-template-columns:170px 1fr;gap:6px 14px}
.def b{display:block}
table{border-collapse:collapse;width:100%;background:var(--papel);font-size:14.5px}
th,td{border:1.5px solid var(--line);padding:6px 9px;text-align:left;vertical-align:top}
th{background:var(--panel-2)}
.acto{margin-top:8px}
.acto-cab{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px}
.grado{font-weight:700;font-size:14px;padding:2px 10px;border-radius:99px;background:var(--ink);color:#fff}
.niveles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0}
.nivel{background:var(--papel);border:1.5px solid var(--line);border-radius:10px;padding:9px 12px;display:flex;flex-direction:column;gap:6px}
.nivel h4{margin:0;font-size:16px}
.nivel .tipo{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--muted)}
.nivel .tipo.Depurar{color:var(--bad)}.nivel .tipo.Desafío,.nivel .tipo.Desafío.final{color:var(--accent)}
.nivel .concepto{font-size:14px}
.nivel .dato{font-size:13px;color:var(--muted);margin:0}
.reflexion{border-left:5px solid var(--accent);background:var(--papel);padding:10px 14px;margin:10px 0;border-radius:0 10px 10px 0}
.botones{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0}
.btn{display:inline-flex;flex-direction:column;justify-content:center;min-height:60px;padding:8px 20px;border-radius:12px;border:3px solid var(--ink);background:var(--papel);color:var(--ink);font-weight:700;font-size:18px;text-decoration:none;box-shadow:0 4px 0 var(--ink)}
.btn small{font-weight:400;font-size:14px}
.btn.prin{background:var(--accent);color:#fff}
.btn:focus-visible{outline:4px solid #1f5fb4;outline-offset:3px}
.guias{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.guias .card h3{margin-top:0}
.guias .card a{display:inline-block;padding:10px 0;margin-right:14px;font-weight:700}
.pie{margin-top:40px;font-size:13px;color:var(--muted)}
${CSS_DIAGRAMA}
.fh{font-size:12.5px}
@media (max-width:640px){
  h1{font-size:36px} h2{font-size:24px}
  .niveles,.guias{grid-template-columns:1fr}
  .def{grid-template-columns:1fr}
  .btn{width:100%}
  table{font-size:13px} th,td{padding:5px}
}
@media print{
  @page{size:A4;margin:13mm 12mm}
  body{background:#fff;font-size:10.5pt;padding:0}
  main{max-width:none;padding:0}
  .no-imprimir{display:none!important}
  h1{font-size:34pt} h2{font-size:18pt;margin-top:14pt}
  .card,.nivel,.reflexion,tr,.def>div{break-inside:avoid}
  .acto{break-before:page}
  a{color:var(--ink);text-decoration:none}
}`;

const pagina = (titulo, cuerpo, extraCss = '') => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<!-- Generado con npm run guia a partir de src/datos/docentes.js y de los datos de cada mundo. No editar a mano. -->
<style>
${CSS}
${extraCss}
</style>
</head>
<body>
<main>
${cuerpo}
</main>
</body>
</html>
`;

/* El diagrama de algunos niveles depende del tablero (el plano cambia con la semilla): se usa la semilla 1. */
function diagramaNivel(L) {
  if (!L.diagram) return '';
  if (typeof L.diagram !== 'function') return diagrama(L.diagram);
  const gen = L.gen(mulberry32(1));
  return diagrama(L.diagram({ ...L, ...gen, recipe: gen.recipe || L.recipe, productName: gen.productName || L.productName }));
}

const comoSeJuega = () => `<h2>Cómo se juega</h2>
<div class="card def">${COMUN.comoSeJuega.map(([t, d]) => `<div><b>${esc(t)}</b></div><div>${esc(d)}</div>`).join('')}</div>
<h3>Tipos de nivel</h3>
<ul>${COMUN.tipos.map(([t, d]) => `<li><b>${esc(t)}</b>: ${esc(d)}</li>`).join('')}</ul>
<h3>En la clase</h3>
<ul>${COMUN.clase.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;

const avisoDC = () => `<div class="card nota"><b>Sin verificar nivel por nivel.</b> ${esc(COMUN.avisoDC)}
Diseño Curricular de primaria (Ciudad de Buenos Aires): <a href="${URL_DC}">${esc(URL_DC.replace('https://', ''))}</a></div>`;

function guiaMundo(M) {
  const G = GUIAS[M.id];
  const actos = Object.entries(M.acts).map(([n, a]) => {
    const niveles = M.levels.filter(L => String(L.act) === n);
    return `<section class="acto">
<div class="acto-cab"><h2>Acto ${n} · ${esc(a.title)}</h2><span class="grado">Sugerido: ${esc(G.grados[n])}</span></div>
<p>${esc(a.desc)} Niveles ${niveles[0].n} a ${niveles[niveles.length - 1].n}.</p>
<div class="niveles">
${niveles.map(L => `<article class="nivel">
  <div><span class="tipo ${esc(L.kind)}">${esc(L.kind)}</span><h4>${L.n}. ${esc(L.title)}</h4><div class="concepto">${esc(L.concept)}</div></div>
  ${diagramaNivel(L)}
  ${L.dato ? `<p class="dato"><b>En la industria real:</b> ${esc(L.dato)}</p>` : ''}
</article>`).join('\n')}
</div>
${niveles.filter(L => L.reflect).map(L => `<div class="reflexion"><b>Reflexión de cierre del acto</b> (aparece al ganar el nivel ${L.n}): ${esc(L.reflect)}</div>`).join('')}
</section>`;
  }).join('\n');

  const cuerpo = `<h1>${esc(COMUN.titulo)} · ${esc(M.name)}</h1>
<p class="sub">${esc(COMUN.subtitulo)} · ${esc(COMUN.grados)} · ${M.levels.length} niveles en 3 actos</p>
<h2>Qué hacen los chicos</h2>
<p>${esc(G.queHacen)}</p>
<table><tr><th>Acto</th><th>Grado sugerido</th><th>De qué se trata</th></tr>
${Object.entries(M.acts).map(([n, a]) => `<tr><td><b>${n}. ${esc(a.title)}</b></td><td>${esc(G.grados[n])}</td><td>${esc(a.desc)}</td></tr>`).join('')}</table>
${comoSeJuega()}
<h2>Antes de la pantalla</h2>
<h3>${esc(G.antes.titulo)}</h3>
<ol>${G.antes.pasos.map(t => `<li>${esc(t)}</li>`).join('')}</ol>
<p>La ficha para dibujar la línea está en <b>ficha-linea.pdf</b>, en la misma carpeta que esta guía.</p>
<h2>Para el cierre</h2>
<ul>${G.cierre.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
<p>Cada acto termina con una reflexión propia (está al final de cada acto en esta guía).</p>
<h2>Diseño Curricular</h2>
${avisoDC()}
<table><tr><th>Eje</th><th>Qué se trabaja</th><th>Dónde</th></tr>
${G.dc.map(([e, q, d]) => `<tr><td><b>${esc(e)}</b></td><td>${esc(q)}</td><td>${esc(d)}</td></tr>`).join('')}</table>
<p><b>Articulaciones:</b> ${esc(G.articulaciones)}</p>
${actos}
<p class="pie">${esc(COMUN.pie)}</p>`;
  return pagina(`${COMUN.titulo} · ${M.name} · Guía docente`, cuerpo);
}

/* Íconos de la ficha, dibujados a mano en SVG (iguales en pantalla y en papel). */
const ICONO = {
  entrada: '<rect x="4" y="4" width="32" height="32" rx="3" fill="none" stroke="#1e2430" stroke-width="2.5"/><path d="M8 32 L32 8 M4 22 L22 4 M18 36 L36 18" stroke="#1e2430" stroke-width="2"/>',
  cinta: '<rect x="2" y="12" width="36" height="16" rx="3" fill="none" stroke="#1e2430" stroke-width="2.5"/><path d="M10 20 H28 M22 15 L28 20 L22 25" fill="none" stroke="#1e2430" stroke-width="2.5" stroke-linecap="round"/>',
  estacion: '<rect x="5" y="5" width="30" height="30" rx="4" fill="none" stroke="#1e2430" stroke-width="2.5"/><path d="M12 26 H28" stroke="#1e2430" stroke-width="2"/><path d="M35 20 h4" stroke="#2f8f55" stroke-width="3"/>',
  pregunta: '<path d="M20 3 L37 20 L20 37 L3 20 Z" fill="none" stroke="#1e2430" stroke-width="2.5"/><text x="20" y="25" font-size="14" font-weight="700" text-anchor="middle" fill="#1e2430">?</text>',
  repartidor: '<rect x="5" y="5" width="30" height="30" rx="4" fill="none" stroke="#1e2430" stroke-width="2.5"/><path d="M20 30 V20 M20 20 L11 11 M20 20 L29 11" fill="none" stroke="#1e2430" stroke-width="2.5" stroke-linecap="round"/>',
  camion: '<rect x="2" y="9" width="22" height="18" fill="none" stroke="#1e2430" stroke-width="2.5"/><path d="M24 15 H32 L37 21 V27 H24" fill="none" stroke="#1e2430" stroke-width="2.5"/><circle cx="10" cy="31" r="4" fill="#fff" stroke="#1e2430" stroke-width="2.5"/><circle cx="30" cy="31" r="4" fill="#fff" stroke="#1e2430" stroke-width="2.5"/>',
  tacho: '<path d="M9 11 H31 L28 36 H12 Z" fill="none" stroke="#1e2430" stroke-width="2.5"/><path d="M6 11 H34 M16 6 H24" stroke="#1e2430" stroke-width="2.5" stroke-linecap="round"/>'
};
const icono = k => `<svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true">${ICONO[k]}</svg>`;

const CSS_FICHA = `
.hoja{background:#fff;padding:18px;border:2px solid var(--line);border-radius:12px;margin-bottom:20px}
.hoja h1{font-size:40px}
.campos{display:flex;flex-wrap:wrap;gap:14px;margin:6px 0 10px}
.campo{flex:1;border-bottom:2px solid var(--ink);padding-top:14px;font-size:13px;color:var(--muted)}
.campo.ancho{flex:3}
.grilla{border-collapse:collapse;margin:8px auto;background:#fff;width:auto;table-layout:fixed}
.grilla-caja{overflow-x:auto}
.grilla td{width:11.5mm;height:11.5mm;border:1px solid #b9b2a4;padding:0}
.simbolos{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px 10px;font-size:12.5px;margin:6px 0}
.simbolos div{display:flex;align-items:center;gap:6px}
.renglon{border-bottom:1.5px solid #9a9384;height:8mm}
.cajas{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:8px 0 14px}
.caja{width:30mm;height:15mm;border:2px solid var(--ink);border-radius:6px}
.caja.fin{border-color:var(--ok);border-width:3px}
.rombo{min-width:30mm;padding:0 4mm;height:18mm;border:2px solid var(--accent);border-radius:40%;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--muted)}
.flecha{font-size:20px;color:var(--muted)}
.rama{display:flex;align-items:center;gap:6px;margin:6px 0 6px 18mm}
.rama b{width:9mm}
.hoja .si{color:var(--ok)}.hoja .no{color:var(--bad)}
@media print{
  .hoja{border:0;padding:0;margin:0;break-after:page}
  .hoja:last-child{break-after:auto}
}`;

function ficha() {
  const filas = Array.from({ length: 9 }, () => `<tr>${'<td></td>'.repeat(14)}</tr>`).join('');
  const campos = `<div class="campos">${FICHA.datos.map((d, i) => `<div class="campo${i === 0 ? ' ancho' : ''}">${esc(d)}</div>`).join('')}</div>`;
  const cuerpo = `<section class="hoja">
<h1>${esc(FICHA.titulo)}</h1>
${campos}
<div class="campos"><div class="campo ancho">${esc(FICHA.pedido)}</div></div>
<p>${esc(FICHA.consigna)}</p>
<div class="grilla-caja"><table class="grilla" aria-label="Casilleros para dibujar la línea">${filas}</table></div>
<div class="simbolos">${FICHA.simbolos.map(([k, t]) => `<div>${icono(k)}<span>${esc(t)}</span></div>`).join('')}</div>
<h3>${esc(FICHA.pasos)}</h3>
<div class="renglon">1.</div><div class="renglon">2.</div><div class="renglon">3.</div>
<h3>${esc(FICHA.falla)}</h3>
<div class="renglon"></div><div class="renglon"></div>
</section>
<section class="hoja">
<h1>${esc(FICHA.titulo2)}</h1>
${campos}
<p>${esc(FICHA.consigna2)}</p>
<h3>${esc(FICHA.secuencia)}</h3>
<div class="cajas"><div class="caja"></div><span class="flecha">→</span><div class="caja"></div><span class="flecha">→</span><div class="caja"></div><span class="flecha">→</span><div class="caja fin"></div></div>
<h3>${esc(FICHA.pregunta)}</h3>
<div class="cajas"><div class="caja"></div><span class="flecha">→</span><div class="rombo">¿ … ?</div></div>
<div class="rama"><b class="si">SÍ</b><span class="flecha">→</span><div class="caja fin"></div></div>
<div class="rama"><b class="no">NO</b><span class="flecha">→</span><div class="caja"></div></div>
<h3>${esc(FICHA.bucle)}</h3>
<div class="cajas"><div class="caja"></div><span class="flecha">→</span><div class="caja"></div><span class="flecha">→</span><div class="rombo">${esc(FICHA.repetirHasta)} ___</div></div>
<div class="rama"><b class="si">SÍ</b><span class="flecha">→</span><div class="caja fin"></div></div>
<div class="rama"><b class="no">NO</b><span class="flecha">↺</span><span>vuelve a empezar</span></div>
<p class="card">${esc(FICHA.probar)}</p>
<h3>${esc(FICHA.ideas)}</h3>
<ul>${FICHA.ejemplos.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
</section>`;
  return pagina(`${COMUN.titulo} · ${FICHA.titulo}`, cuerpo, CSS_FICHA);
}

function indice() {
  const cuerpo = `<h1>${esc(COMUN.titulo)} · Para docentes</h1>
<p class="sub">Líneas de producción con cintas, estaciones y sensores: muebles, reciclaje y energía. ${esc(COMUN.grados)}.</p>
<div class="botones">
  <a class="btn prin" href="../index.html">ABRIR EL JUEGO<small>En el navegador, sin instalar nada</small></a>
  <a class="btn" href="${FICHA.archivo}.pdf">FICHA EN PAPEL<small>Para dibujar la línea (PDF, 2 hojas)</small></a>
</div>
<h2>Guías por mundo</h2>
<div class="guias">
${MUNDOS.map(M => { const G = GUIAS[M.id]; return `<div class="card"><h3>${esc(M.name)}</h3><p>${esc(G.queHacen)}</p>
<p><b>${M.levels.length} niveles.</b> ${Object.entries(G.grados).map(([n, g]) => 'Acto ' + n + ': ' + g).join(' · ')}.</p>
<a href="${G.archivo}.pdf">Guía en PDF</a><a href="${G.archivo}.html">Ver en pantalla</a></div>`; }).join('\n')}
</div>
${comoSeJuega()}
<h2>Diseño Curricular</h2>
${avisoDC()}
<p>Cada guía tiene la tabla de ejes de su mundo, una actividad sin pantalla para antes y preguntas para el cierre.</p>
<p class="pie">${esc(COMUN.pie)}</p>`;
  return pagina(`${COMUN.titulo} · Para docentes`, cuerpo);
}

function buscarNavegador() {
  const candidatos = [process.env.CHROME];
  const pw = join(homedir(), 'AppData', 'Local', 'ms-playwright');
  if (existsSync(pw)) {
    readdirSync(pw).filter(d => d.startsWith('chromium-')).sort().reverse()
      .forEach(d => candidatos.push(join(pw, d, 'chrome-win64', 'chrome.exe'), join(pw, d, 'chrome-win', 'chrome.exe'), join(pw, d, 'chrome-linux', 'chrome')));
  }
  candidatos.push(
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  );
  return candidatos.find(c => c && existsSync(c));
}

mkdirSync(CARPETA, { recursive: true });
const archivos = [['index', indice()], [FICHA.archivo, ficha()], ...MUNDOS.map(M => [GUIAS[M.id].archivo, guiaMundo(M)])];
for (const [nombre, html] of archivos) writeFileSync(join(CARPETA, nombre + '.html'), html);
console.log('Páginas: ' + archivos.map(a => a[0] + '.html').join(', '));

if (process.argv.includes('--sin-pdf')) process.exit(0);
const navegador = buscarNavegador();
if (!navegador) { console.error('No encontré Chrome ni Edge para los PDF. Indicá la ruta con la variable CHROME.'); process.exit(1); }
for (const [nombre] of archivos.slice(1)) {
  const salida = join(CARPETA, nombre + '.pdf');
  execFileSync(navegador, ['--headless', '--disable-gpu', '--no-pdf-header-footer', '--print-to-pdf=' + salida, pathToFileURL(join(CARPETA, nombre + '.html')).href], { stdio: 'ignore' });
  console.log('PDF: ' + nombre + '.pdf');
}
