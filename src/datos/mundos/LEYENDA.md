# Campos de cada nivel

Cada mundo es un archivo con `id`, `name`, `desc`, `icono`, `acts` (título, descripción y nombre de la pestaña de cada acto) y `levels` en el orden en que se juegan. El número de nivel sale de ese orden. El progreso se guarda por `id`: **no cambies el `id` de un nivel que ya existe**.

| Campo | Qué es |
| --- | --- |
| `id` | Identificador fijo del nivel (el progreso se guarda con esto). |
| `act` | Acto al que pertenece (1, 2 o 3). |
| `kind` | Tipo: Práctica, Desafío, Depurar, Diseñá, Optimizá. Sale como etiqueta en la grilla de niveles. |
| `title`, `concept` | Nombre del nivel y concepto que trabaja. |
| `text` | Texto de la ventana de inicio del nivel. |
| `goal` | Objetivo (columna izquierda). Es una frase con `${N}`, la cantidad del pedido. |
| `dato` | Dato real de la industria (ventana de inicio). |
| `reflect` | Reflexión al cerrar el acto (ventana de ganaste). |
| `hint` | Texto del botón Pista. |
| `diagram` | Diagrama del objetivo: `seq` (secuencia), `if`, `ifif`, `ififif` (preguntas), `loop` (bucle), `split` (repartir), `par` (paralelo), `join` (juntar), `sub` (subensamblaje). |
| `parts` | Piezas que explica el botón "?" (ids de `src/datos/piezas.js`). |
| `news` | Cuáles de esas piezas son nuevas ("Lo nuevo"). |
| `product`, `productName`, `truckLabel`, `recipe`, `sample`, `materials` | Qué se fabrica, cómo se llama, el cartel del camión, los pasos del plano y el dibujo del pedido. |
| `icono` | Dibujo de la tarjeta del nivel, como `['estacion', 'sierra', 0, {fixed: true}]` (ver `src/dibujo/iconos.js`). |
| `gen` | Nombre del generador del tablero (`src/generadores/`). |
| `check`, `binCheck` | Nombre de la regla que decide si una pieza es correcta en el camión, o si no tenía que ir al tacho (`src/reglas/niveles.js`). Sin `check`, se compara con la receta. |
| `par`, `per` | Estrellas por tiempo: 3 estrellas antes de `par + N × per` ticks, 2 antes de 1,5 veces eso. |
| `dl` | Horario del camión `[a, b]`: sale en el tick `a × N + b`. Sin `dl`, no hay horario. |
| `size` | Tamaño del tablero `[ancho, alto]` en casilleros. |
| `maxSt` | Máximo de estaciones que puede poner el chico (niveles Diseñá). |
| `energy` | kWh disponibles: cada trabajo de una máquina gasta 1. |
| `wear` | Mantenimiento: `{sierra: [usos, ticks parada]}`. |
| `lossDist` | La electricidad en baja tensión se pierde después de tantos casilleros. |
| `daynight` | Hay día y noche (cada 20 ticks). |
| `binWarn`, `dryMsg` | Aviso al tirar algo al tacho / mensaje cuando se acaba el material. |
| `final` | Último nivel del mundo: muestra el cierre del recorrido. |
