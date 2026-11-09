# La Línea

Juego para 4.º a 7.º grado: armar líneas de producción con cintas y estaciones. Tres mundos: Fábrica de muebles, Planta de reciclaje y La usina.

- Jugar: https://lucapolti-docente.github.io/la-linea/
- Sin internet: `npm run build:pendrive` arma `dist-pendrive/la-linea.html`, que anda con doble clic.

## Para trabajar

```
npm install
npm run dev          # el juego en http://localhost:5173
npm test             # tests (incluye la comparación con el juego original)
npm run soluciones   # cada nivel con 30 semillas: gana, estrellas, margen contra el horario
npm run build        # versión para GitHub Pages (dist/)
npm run build:pendrive
```

## Cambiar textos y niveles

Todo lo editable está en `src/datos/`:

- `mundos/muebles.js`, `mundos/reci.js`, `mundos/usina.js`: los niveles de cada mundo, en orden. Qué es cada campo: `mundos/LEYENDA.md`.
- `textos.js`: los textos de la pantalla. `mensajes.js`: los carteles de error y aviso. `etiquetas.js`: los carteles del tablero.
- `piezas.js`: lo que explica el botón "?" de cada pieza. `estaciones.js`: nombres y comportamiento de cada estación.

No cambies el `id` de un nivel: el progreso de los chicos se guarda con ese id.

## Sumar un nivel

1. Agregalo en el archivo del mundo, en el lugar donde se tiene que jugar, con un `id` nuevo.
2. Si necesita un tablero nuevo, escribí su generador en `src/generadores/<mundo>.js` y sumalo a `GEN` al final del archivo.
3. Si el camión tiene que revisar algo especial, sumá la regla en `src/reglas/niveles.js` y sus motivos en `datos/mensajes.js`.
4. Escribí su solución buena y una mala en `tests/soluciones/<mundo>.js` (`node herramientas/ver-tablero.js <mundo> <nivel> <semilla>` ayuda a mirar el tablero).
5. `npm test` y `npm run soluciones`.

## Sumar un mundo

Crear `src/datos/mundos/<mundo>.js` (copiá uno como modelo) y agregarlo a la lista de `src/mundos/index.js`. Sus generadores van en `src/generadores/` (registrados en `generadores/index.js`).
