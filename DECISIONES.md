# Decisiones

## Etapa 1: reorganizar (9/11/2026)

- **Reemplazo de la versión anterior.** El repo tenía otra La Línea hecha de cero (10 niveles, SVG). Quedó entera en la rama `version-de-cero`. Esta versión empieza una historia nueva.
- **Datos sacados del original funcionando.** Para no copiar a mano 84 niveles con sus parches (reordenamientos, piezas nuevas filtradas, desbloqueos pisados), los datos de `src/datos/` se generaron ejecutando el original y volcando su estado final. Los desbloqueos de las 78 estaciones en los 3 mundos coinciden con el original.
- **Un solo motor.** La energía, el reciclaje y la usina ya corrían dentro de la misma función de tick; lo emparchado eran los `Object.assign` desparramados sobre estaciones, colores y nombres. Ahora cada tabla está entera en un solo archivo de datos.
- **Igual que el original.** `tests/original.test.js` corre el motor original (desde `original/la-linea.html`) y el nuevo con las mismas semillas: mismo tablero en los 84 niveles × 5 semillas y misma simulación tick a tick, con carteles incluidos, durante 160 ticks con cintas y estaciones puestas al azar. 39 de 45 capturas son idénticas píxel a píxel; las otras 6 son las correcciones de abajo y piezas de La usina que se animan con el reloj.
- **Los motivos de error salen de `datos/mensajes.js`.** Las reglas de cada nivel pasaron a `src/reglas/`; los textos llevan `{marcadores}` que completa el juego.
- **Íconos como datos.** Los niveles y las piezas dicen qué dibujar con `['estacion', 'sierra', 0, {...}]`; los 16 dibujos que no son una sola pieza están en `PROPIOS` de `src/dibujo/iconos.js`.
- **Textos fijos del HTML con `data-t`.** Se completan desde `textos.js` al arrancar.
- **`window.laLinea`** expone `show`, `startLevel` y la partida para las pruebas con semilla fija. El juego no lo usa.

### Errores que arreglé
- Las tarjetas de mundos decían 28, 12 y 12 niveles; son 36, 24 y 24. Ahora se cuentan desde los datos.
- Las zonas y edificios que nombran un nivel ("Aserradero (nivel 10)", "Mesas (22)", "Central (nivel 7)"…) tenían números viejos de antes de sumar niveles. Ahora se calculan con `{nivel:id}`.
- Algunos carteles de la interfaz (por ejemplo "Esa pieza viene fija") marcaban con un círculo la última celda que había tocado el motor, que no tenía nada que ver. Ahora solo marcan los carteles del motor.
- CSS compatible con Chrome viejo: `inset` y `padding-block` cambiados por `top/right/bottom/left` y `padding-top/bottom`. Se ve igual.
- Faltaba `<meta name="viewport">`: en celulares de verdad la página se veía achicada.
- Se sacaron cosas que no se usaban: `COMING` (lista vacía de niveles "próximamente"), `ACTNAME`, `unlockN`, `redDir`.
