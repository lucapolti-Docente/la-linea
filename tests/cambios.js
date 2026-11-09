/* Cambios hechos a propósito respecto del original (ver DECISIONES.md). Los tests de comparación los tienen en cuenta. */

/* Generador corregido: el tablero tiene la misma forma, pero la secuencia de materiales es otra. */
export const GENERADOR_NUEVO = { reci: ['r_centro', 'r_planta', 'r_reuso'] };

/* Horario con más margen (etapa 3): en el original el camión salía demasiado justo. */
export const HORARIO_NUEVO = { muebles: ['boleta', 'mantenimiento', 'dosBrazos'], reci: ['r_cooperativa'], ene: ['e_pico'] };

export const cambio = (lista, mundo, id) => (lista[mundo] || []).includes(id);
