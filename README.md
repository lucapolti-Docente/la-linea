# La Línea

Juego para 4.º a 7.º grado: del taller a la fábrica. Se ordenan las estaciones de una línea de producción
(cortar, lijar, pintar, soldar, calentar, llenar…) y se produce lo que pide el cliente.

- Jugar: https://lucapolti-docente.github.io/la-linea/
- Para docentes (guía y PDF): https://lucapolti-docente.github.io/la-linea/docentes/

## Usarlo sin internet (pendrive)

```
npm ci
npm run build:pendrive
```

Copiá `dist-pendrive/la-linea.html` y la carpeta `dist-pendrive/docentes/` al pendrive. Se abre con doble clic.

## Trabajar en el código

```
npm ci
npm run dev          # abre el juego en el navegador y se recarga al guardar
npm test             # reglas de cada estación, reloj, semilla y la solución de cada nivel
npm run soluciones   # cuántos programas dan 0, 1, 2 y 3 estrellas en cada nivel
npm run guia         # vuelve a armar docentes/guia-docente.pdf desde docentes/index.html
```

Cada vez que se sube a `main`, GitHub Actions corre los tests, arma el juego y lo publica en GitHub Pages.

## Dónde se cambia cada cosa

Todo lo editable está en `src/datos/`, sin lógica:

| Quiero cambiar… | Archivo |
| --- | --- |
| Una palabra o un mensaje | `src/datos/textos.js` |
| Un nivel, o sumar uno | `src/datos/niveles/` (ver `LEYENDA.md`) |
| Lo que hace una estación, su tiempo o sus errores | `src/datos/estaciones.js` (y su caso en `tests/reglas.test.js`) |
| Un personaje | `src/datos/personajes.js` |
| Lo que entra a la cinta | `src/datos/materiales.js` |
| Un modo de la pantalla de inicio | `src/modos/` |

### Sumar un nivel
1. Agregalo a la lista de su modo en `src/datos/niveles/` con un `id` nuevo (no lo cambies después: las estrellas se guardan por id).
2. Poné su `solucion`: un programa que saque ⭐⭐⭐.
3. `npm test` comprueba que la solución gana y que el nivel no se gana con cualquier cosa. `npm run soluciones` muestra qué tan difícil es.

### Sumar una estación
1. Agregala en `src/datos/estaciones.js` con sus reglas (`fallaSi`, `peorSi`, `hace`), sus minutos y su sonido.
2. Escribí los textos de sus errores en `src/datos/textos.js` y su ícono en `src/dibujo/iconos.js` (mismo id).
3. Sumá sus casos en `tests/reglas.test.js`: el test avisa si una regla queda sin probar.

## Arquitectura
- `src/motor/`: lógica pura (pieza, estaciones, línea, reloj, semilla, estrellas). No toca la pantalla.
- `src/dibujo/`: genera SVG a partir del estado.
- `src/interfaz/`: lo único que toca la pantalla.
- Decisiones de diseño: `DECISIONES.md`.
