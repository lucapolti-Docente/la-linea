import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

/* Renombra el HTML de la versión para pendrive, así no se confunde con el index.html.
   Las páginas de docentes/ apuntan al juego como ../index.html: en el pendrive se cambia por ../la-linea.html. */
const nombrePendrive = {
  name: 'nombre-pendrive',
  enforce: 'post',
  generateBundle(_, bundle) {
    if (bundle['index.html']) bundle['index.html'].fileName = 'la-linea.html';
  },
  closeBundle() {
    const docentes = 'dist-pendrive/docentes/index.html';
    if (existsSync(docentes)) writeFileSync(docentes, readFileSync(docentes, 'utf8').split('href="../index.html"').join('href="../la-linea.html"'));
  }
};

export default defineConfig(({ mode }) => ({
  // Rutas relativas: sirve igual en GitHub Pages (en cualquier nombre de repo) y abriendo el archivo desde el pendrive.
  base: './',
  plugins: mode === 'pendrive' ? [viteSingleFile(), nombrePendrive] : [],
  build: {
    outDir: mode === 'pendrive' ? 'dist-pendrive' : 'dist',
    emptyOutDir: true
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js']
  }
}));
