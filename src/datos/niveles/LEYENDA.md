# Cómo se escribe un nivel

| Campo | Qué es |
| --- | --- |
| `id` | Fijo y único (minúsculas y guiones). El progreso se guarda por id: no lo cambies una vez publicado. |
| `nombre` | Título corto del nivel. |
| `cliente` | Id de un personaje de `personajes.js`. |
| `pide` | Lo que pide el cliente, en una línea. |
| `consigna` | Lo que dice la encargada al empezar. Una línea. |
| `aprende` | Lo que dice al ganar: la idea del nivel, como la diría un chico. |
| `entra` | Material que entra a la cinta (`materiales.js`). |
| `modelo` | Lo que tiene que tener la pieza al final: `{ cortada: true, pintada: true }`. Cada clave es una tilde de la tarjeta del cliente (nombres en `textos.js`, `ITEMS`). |
| `estaciones` | Las que aparecen en el panel (ids de `estaciones.js`). |
| `casilleros` | Cuántos lugares tiene la cinta (1 a 7). |
| `cintas` | En lugar de `casilleros`, para varias cintas en serie: `[{ casilleros: 4, fija: [...] }, { casilleros: 3 }]`. Una cinta `fija` viene armada y no se toca. |
| `prueba` | Prueba automática al final de la cinta (por ejemplo `'peso'`). |
| `lote` | Cuántas piezas se hacen, fijo (se ve un cartel "×30"). |
| `pedido` + `repetir: true` | Cuántas piezas pide el cliente: hay que envolver la cinta con REPETIR y poner ese número. |
| `rajadas` | `{ semilla, cuantas }`: cuántas piezas del lote vienen rajadas. La semilla hace que siempre sean las mismas. |
| `meta` | Tiempo meta en minutos de fábrica para la tercera estrella. |
| `comparar` | Estaciones "a mano" para dibujar una barra de comparación con el reloj. |
| `marcarLenta` | Marca en rojo la estación más lenta. |
| `solucion` | `{ cintas: [[...]], repetir }`: un programa que saca ⭐⭐⭐. Los tests lo comprueban. En las cintas fijas va `null`. |

Estrellas: ⭐ sale igual al modelo (y la cantidad justa) · ⭐⭐ además sin defectos · ⭐⭐⭐ además dentro de la meta.

Para ver cuántos programas ganan cada nivel: `npm run soluciones`.
