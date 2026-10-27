/* Taller (4.º): una pieza por vez, con herramientas de mano. Ver LEYENDA.md para qué es cada campo. */
export const TALLER = [
  {
    id: 'taller-mesa',
    nombre: 'La primera mesa',
    cliente: 'ramiro',
    pide: 'Una mesa para el comedor',
    consigna: 'Poné las herramientas en orden: cada una cambia la tabla.',
    aprende: 'Cada estación transforma la pieza un poco. ¡El orden hace la mesa!',
    entra: 'tabla',
    modelo: { cortada: true, lisa: true, pintada: true },
    estaciones: ['serrucho', 'lija', 'pincel'],
    casilleros: 3,
    meta: 50,
    solucion: { cintas: [['serrucho', 'lija', 'pincel']] }
  },
  {
    id: 'taller-sombrilla',
    nombre: 'Mesa con sombrilla',
    cliente: 'marta',
    pide: 'Una mesa con agujero para la sombrilla',
    consigna: 'Ahora va un agujero. Ojo: hay órdenes que andan, pero salen peor.',
    aprende: 'Pintar va al final: si no, el agujero salta la pintura.',
    entra: 'tabla',
    modelo: { cortada: true, lisa: true, agujero: true, pintada: true },
    estaciones: ['serrucho', 'lija', 'taladro', 'pincel'],
    casilleros: 4,
    meta: 60,
    solucion: { cintas: [['serrucho', 'lija', 'taladro', 'pincel']] }
  },
  {
    id: 'taller-patas',
    nombre: 'Mesa con patas',
    cliente: 'joaquin',
    pide: 'Una mesa firme para leer',
    consigna: 'El tablero y las patas vienen separados. Al final hay prueba de peso.',
    aprende: 'Las partes se unen. La madera se clava o se pega.',
    entra: 'kit',
    modelo: { cortada: true, lisa: true, unida: true, pintada: true },
    estaciones: ['serrucho', 'lija', 'clavos', 'cola', 'pincel'],
    casilleros: 4,
    prueba: 'peso',
    meta: 60,
    solucion: { cintas: [['serrucho', 'lija', 'clavos', 'pincel']] }
  },
  {
    id: 'taller-banco',
    nombre: 'Banco de metal',
    cliente: 'vilma',
    pide: 'Un banco de metal para el club',
    consigna: 'Ahora trajeron caños de metal. ¿Con qué se unen?',
    aprende: 'Cada material tiene su herramienta: el metal no se pega, se suelda.',
    entra: 'canos',
    modelo: { unida: true, lisa: true, pintada: true },
    estaciones: ['clavos', 'cola', 'soldadora', 'lija', 'pincel'],
    casilleros: 3,
    prueba: 'peso',
    meta: 40,
    solucion: { cintas: [['soldadora', 'lija', 'pincel']] }
  }
];
