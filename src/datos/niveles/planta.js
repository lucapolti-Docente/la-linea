/* Planta (6.º y 7.º): sensores, materiales que mandan, cadena de fábricas y cuello de botella. Ver LEYENDA.md. */
export const PLANTA = [
  {
    id: 'planta-sensor',
    nombre: 'Tablas rajadas',
    cliente: 'ramiro',
    pide: 'Solo mesas sanas: nada de rajaduras',
    consigna: 'Algunas tablas vienen rajadas. El sensor las manda a reciclar.',
    aprende: 'La máquina decide según lo que sensa: si está rajada, va a reciclar.',
    entra: 'tabla',
    modelo: { cortada: true, lisa: true, pintada: true },
    estaciones: ['sierra', 'lijadora', 'pistola', 'sensor'],
    casilleros: 4,
    lote: 12,
    /* Siempre las mismas tablas rajadas: salen de esta semilla. */
    rajadas: { semilla: 7, cuantas: 3 },
    meta: 60,
    solucion: { cintas: [['sensor', 'sierra', 'lijadora', 'pistola']] }
  },
  {
    id: 'planta-envases',
    nombre: 'Fábrica de envases',
    cliente: 'tito',
    pide: 'Un envase de plástico para shampoo',
    consigna: 'Llegan granitos de plástico. ¿Cómo se hace un envase?',
    aprende: 'Las propiedades del material mandan: el plástico frío no se moldea.',
    entra: 'granos',
    modelo: { moldeado: true, envase: true },
    estaciones: ['horno', 'molde', 'enfriador', 'desmoldar'],
    casilleros: 4,
    meta: 15,
    solucion: { cintas: [['horno', 'molde', 'enfriador', 'desmoldar']] }
  },
  {
    id: 'planta-shampoo',
    nombre: 'Dos fábricas',
    cliente: 'tito',
    pide: 'Un shampoo listo para vender',
    consigna: 'La fábrica de envases ya anda. Armá la segunda: la del shampoo.',
    aprende: 'Lo que sale de una fábrica es la materia prima de otra.',
    entra: 'granos',
    modelo: { envase: true, lleno: true, tapado: true, etiquetada: true },
    estaciones: ['llenar', 'tapar', 'etiquetar'],
    /* Dos cintas en serie: la primera ya viene armada (fija) y no se puede cambiar. */
    cintas: [
      { casilleros: 4, fija: ['horno', 'molde', 'enfriador', 'desmoldar'] },
      { casilleros: 3 }
    ],
    meta: 25,
    solucion: { cintas: [null, ['llenar', 'tapar', 'etiquetar']] }
  },
  {
    id: 'planta-cuello',
    nombre: 'La más lenta',
    cliente: 'tito',
    pide: '100 shampoos para mañana',
    consigna: 'La estación más lenta marca el ritmo. ¿Cómo la apurás?',
    aprende: 'Cuello de botella: la más lenta manda. Duplicala o poné una máquina.',
    entra: 'envase',
    modelo: { lleno: true, tapado: true, etiquetada: true },
    estaciones: ['llenar', 'tapar', 'etiquetar', 'etiquetadora'],
    casilleros: 4,
    pedido: 100,
    repetir: true,
    meta: 310,
    /* La estación más lenta se marca en rojo. */
    marcarLenta: true,
    solucion: { cintas: [['llenar', 'tapar', 'etiquetadora']], repetir: 100 }
  }
];
