/* Fábrica (5.º): muchas piezas. Por qué existen las máquinas y el Repetir. Ver LEYENDA.md. */
export const FABRICA = [
  {
    id: 'fabrica-30-mesas',
    nombre: '30 mesas',
    cliente: 'ramiro',
    pide: '30 mesas para el comedor nuevo',
    consigna: 'Son 30 mesas. Mirá el reloj: ¿llegamos a mano?',
    aprende: 'Las máquinas hacen lo mismo que la herramienta, pero mucho más rápido.',
    entra: 'tabla',
    modelo: { cortada: true, lisa: true, pintada: true },
    estaciones: ['serrucho', 'lija', 'pincel', 'sierra', 'lijadora', 'pistola'],
    casilleros: 3,
    lote: 30,
    meta: 150,
    /* Se dibuja una barra con el tiempo de hacerlo todo a mano, para comparar. */
    comparar: ['serrucho', 'lija', 'pincel'],
    solucion: { cintas: [['sierra', 'lijadora', 'pistola']] }
  },
  {
    id: 'fabrica-100-mesas',
    nombre: '100 mesas',
    cliente: 'ramiro',
    pide: '100 mesas para todas las escuelas',
    consigna: 'Armá la cinta de UNA mesa y envolvela con REPETIR.',
    aprende: 'El programa de una mesa, repetido, hace 100. Así trabaja una fábrica.',
    entra: 'tabla',
    modelo: { cortada: true, lisa: true, pintada: true },
    estaciones: ['sierra', 'lijadora', 'pistola'],
    casilleros: 3,
    pedido: 100,
    repetir: true,
    meta: 410,
    solucion: { cintas: [['sierra', 'lijadora', 'pistola']], repetir: 100 }
  }
];
