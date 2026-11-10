# La Línea: guía para trabajar en el proyecto

Juego educativo para el segundo ciclo (4.º a 7.º) de primarias de CABA. El chico arma líneas de producción con cintas y estaciones para que lo que entra salga como lo pide el destino (un camión o una casa). Tres mundos: Fábrica de muebles (36 niveles), Planta de reciclaje (24) y La usina (24). Lo usa el docente en clase.

Este CLAUDE.md manda por sobre el general de `juegos-docente/`: acá sí hay npm + Vite + Vitest, igual que en La Gran Máquina y Planta Reci.

## Contexto de uso
- Se juega en netbooks viejas (1366×768, colores lavados, touchpads malos) y en celulares (360×620).
- Se publica en GitHub Pages (repo `lucapolti-Docente/la-linea`, con GitHub Actions) y también se usa sin internet desde un pendrive con `npm run build:pendrive` (un solo `la-linea.html` que anda con doble clic). Nada puede depender de cargar archivos de internet.
- `original/la-linea.html` es el juego de partida. No se edita: es la referencia para comparar (los tests corren su motor al lado del nuevo).

## Decisiones que no hay que cambiar
- Tablero central grande. Objetivo siempre visible en chico a la izquierda. Botón "?" arriba a la derecha que explica las piezas del nivel, con lo nuevo destacado.
- Español rioplatense con "vos". Todo dibujado con código, sin emojis.
- Interfaz:
  - Tocar la estación abre el selector de lados (no rotar varias veces).
  - Etiquetas SÍ/NO en los sensores, nombre debajo de cada estación, cartel en cada camión.
  - Paleta por pestañas de acto, sin límite de piezas: equivocarse es parte del proceso.
- Errores: 3 errores y perdés, siempre con el motivo explicado y marcado en el tablero.
- Progresión pedagógica:
  - Primero personas, después máquinas (la máquina aparece cuando hay una excusa real: tronco, tiempo, volumen).
  - Niveles de práctica y de desafío con complejidad creciente.
  - Datos reales de la industria argentina.
  - Reflexión al cierre de cada acto.
- Escala: la sensación de crecimiento viene de módulos de secciones anteriores que entregan material de verdad. Nada de edificios decorativos.
- Mundos y acceso: los tres mundos se mantienen (Taller de máquinas queda fuera). Todos los niveles abiertos para que el docente arranque en cualquiera. Progreso guardado por id de nivel, no por posición, para poder agregar niveles sin romper lo guardado.
- localStorage: clave `laLinea.v1` con `{best:{[mundo]:{[idDeNivel]:estrellas}}, name}`, siempre con try/catch. No cambiar la clave ni la forma.

## Arquitectura
- `src/motor/` es lógica pura (ticks, cintas, estaciones, sensores, errores, tiempo y energía): no toca el DOM ni dibuja. Los carteles quedan en `G.eventos` y la interfaz los muestra. `estado.js` tiene la partida en juego (`G`) y el tamaño del tablero.
- `src/generadores/` arma el tablero de cada nivel a partir de una semilla (mulberry32). Una sola función para trazar cinta (`pb`).
- `src/reglas/` decide qué cuenta como pieza correcta (camiones, tachos, sensores). Sin textos: los motivos salen de `src/datos/mensajes.js`.
- `src/datos/` tiene todo lo editable, sin lógica: un archivo por mundo en `mundos/` (niveles, textos, diagramas; campos en `mundos/LEYENDA.md`), `estaciones.js`, `piezas.js` (diccionario del botón "?"), `textos.js` (pantalla), `mensajes.js` (errores y avisos), `etiquetas.js` (carteles del tablero), `colores.js`, `materiales.js`.
- `src/mundos/index.js` es el registro: sumar un mundo es agregar su archivo de datos y una línea.
- `src/dibujo/` dibuja en canvas (y los diagramas en SVG) a partir del estado y no guarda estado.
- `src/interfaz/` es lo único que toca la pantalla.

## Antes de dar algo por terminado
- `npm test`: el motor nuevo da lo mismo que el original tick a tick (`tests/original.test.js`), la solución guardada de cada nivel gana con 30 semillas y la mala pierde (`tests/niveles.test.js`), estrellas y horario (`tests/reglas.test.js`).
- Los cambios hechos a propósito respecto del original (generadores, horarios) se anotan en `tests/cambios.js`; si no, los tests de comparación fallan.
- `npm run soluciones` al tocar un nivel, un generador o una regla: muestra cuántas semillas gana cada solución, las estrellas y el margen contra el horario. Para mirar un tablero: `node herramientas/ver-tablero.js <mundo> <nivel> <semilla>`.
- Cada nivel nuevo necesita su solución buena y mala en `tests/soluciones/<mundo>.js`.
- `npm run capturas:comparar` después de sacar capturas nuevas con la skill `verificar-juego` (base en `pruebas/base/`).
- Skill `verificar-juego` en 1366×768 y en 360×620, tocando los botones como un chico: sin errores en la consola.
- Si cambia algo del armado, probar también `npm run build:pendrive` abriendo el archivo con doble clic.
- Si cambia un nivel o un texto para docentes (`src/datos/docentes.js`): `npm run guia` vuelve a armar `public/docentes/` (páginas y PDF).
