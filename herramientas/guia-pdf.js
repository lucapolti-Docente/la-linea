/* npm run guia: arma public/docentes/guia-docente.pdf imprimiendo public/docentes/index.html
   con un Chrome o Edge sin ventana. Correlo cada vez que cambies la página de docentes. */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { pathToFileURL } from 'node:url';

function buscarNavegador() {
  const candidatos = [process.env.CHROME];
  const pw = join(homedir(), 'AppData', 'Local', 'ms-playwright');
  if (existsSync(pw)) {
    readdirSync(pw).filter(d => d.startsWith('chromium-')).sort().reverse()
      .forEach(d => candidatos.push(join(pw, d, 'chrome-win64', 'chrome.exe'), join(pw, d, 'chrome-linux', 'chrome')));
  }
  candidatos.push(
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  );
  return candidatos.find(c => c && existsSync(c));
}

const navegador = buscarNavegador();
if (!navegador) { console.error('No encontré Chrome ni Edge. Indicá la ruta con la variable CHROME.'); process.exit(1); }
const pagina = pathToFileURL(resolve('public/docentes/index.html')).href;
const salida = resolve('public/docentes/guia-docente.pdf');
execFileSync(navegador, ['--headless', '--disable-gpu', '--no-pdf-header-footer', '--print-to-pdf=' + salida, pagina], { stdio: 'inherit' });
console.log('Listo: ' + salida);
