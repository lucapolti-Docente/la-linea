# La Línea: guía para trabajar en el proyecto

Juego educativo para el segundo ciclo (4.º a 7.º) de primarias de CABA. Se programa el ORDEN de las estaciones de una línea de producción: la pieza viaja por una cinta y cada estación la transforma. Del taller a la fábrica: secuencias, materiales y herramientas, productividad, bucles, condicionales y cuello de botella. Lo usa el docente en clase: una clase de 40 a 60 minutos juega un modo.

Este CLAUDE.md manda por sobre el general de `juegos-docente/`: acá sí hay npm + Vite + Vitest, igual que en La Gran Máquina y Planta Reci.

## Contexto de uso
- Se juega en netbooks viejas (1366×768, colores lavados, touchpads malos) y en celulares (360×620). Todo entra en una pantalla, sin scroll.
- Se publica en GitHub Pages (repo `lucapolti-Docente/la-linea`, con GitHub Actions) y también se usa sin internet desde un pendrive con `npm run build:pendrive` (un solo `la-linea.html` que anda con doble clic). Nada puede depender de cargar archivos de internet.
- No hay HTML original: el juego empezó de cero.

## Decisiones que no hay que cambiar
- Sin cuentas ni login. El progreso va en localStorage **por id de nivel** (nunca por número), con try/catch.
- Español rioplatense con voseo, frases cortas y sin retar. Nunca "PERDISTE": errores amables (sacudida + sonido + una frase).
- Dos tipos de error: **no funciona** (la pieza no sale; se marca la estación donde falló) y **sale peor** (sale con un defecto y menos estrellas, con la explicación).
- Estrellas: ⭐ sale igual al modelo · ⭐⭐ además sin defectos · ⭐⭐⭐ además dentro del tiempo meta.
- Ubicar estaciones de tres formas: arrastrar, tocar estación y después casillero, y teclado. Botón Paso: una estación por vez, mostrando cómo cambia la pieza.
- Todos los niveles se pueden saltar. Máximo 7 casilleros por nivel.
- El reloj usa minutos de fábrica simulados: primera pieza + (N−1) × la estación más lenta. Dos estaciones iguales seguidas trabajan juntas (la pieza pasa por una sola; el ritmo de ese puesto se divide por 2).
- El azar (tablas rajadas) sale de una semilla fija por nivel: siempre es igual.
- La encargada (Nora) y los clientes son personajes originales, variados y sin estereotipos de género. Nada con derechos de autor.
- La cinta y las piezas se dibujan en SVG; estaciones y casilleros son botones HTML (ver `DECISIONES.md`).
- Los sonidos se generan dentro del juego. Hay botón de silencio.

## Arquitectura
- `src/motor/` es lógica pura: no toca el DOM ni dibuja, y no sabe de niveles concretos (recibe el catálogo de estaciones y los datos del nivel). Todo lo que cambia reglas se prueba en `tests/`.
- `src/datos/` tiene todo lo editable, sin lógica: `estaciones.js` (cada estación es una regla: condiciones, efecto, minutos, mensajes), `materiales.js`, `personajes.js`, `textos.js` y `niveles/` (cada nivel con `id` fijo y su `solucion` guardada).
- `src/dibujo/` genera SVG a partir del estado del motor y no guarda estado.
- `src/interfaz/` es lo único que toca la pantalla.
- `src/modos/` registra los modos de la pantalla de inicio (Taller, Fábrica, Planta, Libre).

## Antes de dar algo por terminado
- `npm test`: cada estación, cada error de "no funciona" y "sale peor", el reloj, la semilla, y que la solución guardada de cada nivel saque ⭐⭐⭐.
- `npm run soluciones`: cuántos programas dan 1, 2 y 3 estrellas en cada nivel. Usala al tocar un nivel o una regla.
- Skill `verificar-juego` en 1366×768 y en 360×620, tocando los botones como un chico: sin scroll y sin errores en la consola.
- Si cambia algo del armado, probar también `npm run build:pendrive` abriendo el archivo con doble clic.
