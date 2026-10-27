/* Todas las estaciones del juego. Cada una es una regla de datos que el motor sabe aplicar:
   - grupo (pestaña del modo libre), sonido (receta en src/sonido.js), nombre (corto, se ve en el botón),
     tipo: 'mano' (herramienta) o 'maquina'. El ícono se dibuja en src/dibujo/iconos.js con el mismo id.
   - minutos: minutos de fábrica (simulados) que tarda con UNA pieza. Las de mano tardan mucho; las máquinas, poco.
   - fallaSi: [{ si: condición, motivo }] → NO FUNCIONA, la pieza no sale. El texto está en textos.js (FALLAS).
   - peorSi: [{ si: condición, defecto }] → SALE PEOR, con un defecto. El texto está en textos.js (DEFECTOS).
   - hace: las propiedades que le cambia a la pieza.
   - desviaSi: condición para sacar la pieza de la línea (a la caja de reciclaje).
   - prueba: true si no se pone en la cinta, sino que el nivel la hace al final.
   Condición: { propiedad: valor }. true y false son "tiene" y "no tiene".
   Si sumás una regla, sumá su caso en tests/reglas.test.js (el test avisa si falta). */

const SOBRE_PINTURA = { pintada: true };

/* Las reglas de cortar, lijar y pintar son iguales a mano o con máquina: cambia el tiempo. */
const CORTAR = {
  fallaSi: [
    { si: { material: 'metal' }, motivo: 'cortar_metal' },
    { si: { material: 'plastico' }, motivo: 'cortar_plastico' }
  ],
  peorSi: [
    { si: { cortada: true }, defecto: 'cortada_de_mas' },
    { si: SOBRE_PINTURA, defecto: 'bordes_sin_pintar' }
  ],
  hace: { cortada: true }
};
const LIJAR = {
  fallaSi: [{ si: { material: 'plastico' }, motivo: 'lijar_plastico' }],
  peorSi: [{ si: SOBRE_PINTURA, defecto: 'pintura_raspada' }],
  hace: { lisa: true }
};
const PINTAR = {
  fallaSi: [{ si: { material: 'plastico' }, motivo: 'pintar_plastico' }],
  peorSi: [{ si: { lisa: false }, defecto: 'pintura_despareja' }],
  hace: { pintada: true }
};

export const ESTACIONES = {
  /* Taller: herramientas de mano */
  serrucho: Object.assign({ grupo: 'madera', sonido: 'sierra', nombre: 'CORTAR', tipo: 'mano', minutos: 20 }, CORTAR),
  lija: Object.assign({ grupo: 'madera', sonido: 'lija', nombre: 'LIJAR', tipo: 'mano', minutos: 15 }, LIJAR),
  pincel: Object.assign({ grupo: 'madera', sonido: 'pintar', nombre: 'PINTAR', tipo: 'mano', minutos: 15 }, PINTAR),
  taladro: {
    grupo: 'madera', sonido: 'taladro', nombre: 'AGUJEREAR', tipo: 'mano', minutos: 10,
    fallaSi: [{ si: { material: 'plastico' }, motivo: 'agujerear_plastico' }],
    peorSi: [{ si: SOBRE_PINTURA, defecto: 'pintura_saltada' }],
    hace: { agujero: true }
  },
  clavos: {
    grupo: 'madera', sonido: 'martillo', nombre: 'CLAVAR', tipo: 'mano', minutos: 10,
    fallaSi: [
      { si: { material: 'metal' }, motivo: 'clavar_metal' },
      { si: { patas: false }, motivo: 'unir_sin_partes' }
    ],
    peorSi: [{ si: SOBRE_PINTURA, defecto: 'pintura_marcada' }],
    hace: { unida: true, union: 'clavos' }
  },
  cola: {
    grupo: 'madera', sonido: 'cola', nombre: 'PEGAR', tipo: 'mano', minutos: 10,
    fallaSi: [{ si: { patas: false }, motivo: 'unir_sin_partes' }],
    peorSi: [{ si: SOBRE_PINTURA, defecto: 'cola_sobre_pintura' }],
    hace: { unida: true, union: 'cola' }
  },
  soldadora: {
    grupo: 'madera', sonido: 'soldar', nombre: 'SOLDAR', tipo: 'maquina', minutos: 10,
    fallaSi: [
      { si: { material: 'madera' }, motivo: 'soldar_madera' },
      { si: { material: 'plastico' }, motivo: 'soldar_plastico' },
      { si: { patas: false }, motivo: 'unir_sin_partes' }
    ],
    peorSi: [{ si: SOBRE_PINTURA, defecto: 'pintura_quemada' }],
    /* La soldadura deja rebabas: hay que lijar después. */
    hace: { unida: true, union: 'soldadura', lisa: false }
  },

  /* Fábrica: las mismas tareas, con máquinas */
  sierra: Object.assign({ grupo: 'maquinas', sonido: 'sierra', nombre: 'SIERRA', tipo: 'maquina', minutos: 4 }, CORTAR),
  lijadora: Object.assign({ grupo: 'maquinas', sonido: 'lija', nombre: 'LIJADORA', tipo: 'maquina', minutos: 3 }, LIJAR),
  pistola: Object.assign({ grupo: 'maquinas', sonido: 'pintar', nombre: 'PINTURA', tipo: 'maquina', minutos: 3 }, PINTAR),

  /* Planta: sensor y plástico */
  sensor: {
    grupo: 'maquinas', sonido: 'sensor', nombre: 'SENSOR', tipo: 'maquina', minutos: 1,
    desviaSi: { rajada: true },
    /* Si la tabla rajada ya pasó por otras máquinas, ese trabajo se tiró. */
    peorSi: [
      { si: { rajada: true, cortada: true }, defecto: 'trabajo_perdido' },
      { si: { rajada: true, lisa: true }, defecto: 'trabajo_perdido' },
      { si: { rajada: true, pintada: true }, defecto: 'trabajo_perdido' }
    ],
    hace: {}
  },
  horno: {
    grupo: 'plastico', sonido: 'horno', nombre: 'CALENTAR', tipo: 'maquina', minutos: 5,
    fallaSi: [
      { si: { material: 'madera' }, motivo: 'horno_madera' },
      { si: { material: 'metal' }, motivo: 'horno_metal' },
      { si: { moldeado: true }, motivo: 'horno_moldeado' }
    ],
    hace: { caliente: true }
  },
  molde: {
    grupo: 'plastico', sonido: 'molde', nombre: 'MOLDEAR', tipo: 'maquina', minutos: 4,
    fallaSi: [
      { si: { material: 'madera' }, motivo: 'molde_madera' },
      { si: { material: 'metal' }, motivo: 'molde_metal' },
      { si: { caliente: false }, motivo: 'molde_frio' }
    ],
    hace: { moldeado: true }
  },
  enfriador: {
    grupo: 'plastico', sonido: 'frio', nombre: 'ENFRIAR', tipo: 'maquina', minutos: 4,
    hace: { caliente: false }
  },
  desmoldar: {
    grupo: 'plastico', sonido: 'desmoldar', nombre: 'DESMOLDAR', tipo: 'maquina', minutos: 2,
    fallaSi: [{ si: { moldeado: false }, motivo: 'desmoldar_vacio' }],
    peorSi: [{ si: { caliente: true }, defecto: 'envase_deformado' }],
    hace: { envase: true }
  },
  llenar: {
    grupo: 'envases', sonido: 'llenar', nombre: 'LLENAR', tipo: 'maquina', minutos: 2,
    fallaSi: [
      { si: { envase: false }, motivo: 'llenar_sin_envase' },
      { si: { tapado: true }, motivo: 'llenar_tapado' }
    ],
    hace: { lleno: true }
  },
  tapar: {
    grupo: 'envases', sonido: 'tapar', nombre: 'TAPAR', tipo: 'maquina', minutos: 2,
    fallaSi: [{ si: { envase: false }, motivo: 'tapar_sin_envase' }],
    hace: { tapado: true }
  },
  etiquetar: {
    grupo: 'envases', sonido: 'etiqueta', nombre: 'ETIQUETAR', tipo: 'mano', minutos: 6,
    fallaSi: [{ si: { envase: false }, motivo: 'etiquetar_sin_envase' }],
    hace: { etiquetada: true }
  },
  etiquetadora: {
    grupo: 'envases', sonido: 'etiqueta', nombre: 'ETIQUETADORA', tipo: 'maquina', minutos: 3,
    fallaSi: [{ si: { envase: false }, motivo: 'etiquetar_sin_envase' }],
    hace: { etiquetada: true }
  },

  /* Pruebas que el nivel hace al final de la cinta (no se ponen en un casillero) */
  peso: {
    grupo: 'pruebas', sonido: 'pesa', nombre: 'PRUEBA DE PESO', tipo: 'maquina', minutos: 0, prueba: true,
    fallaSi: [
      { si: { union: 'cola', material: 'metal' }, motivo: 'cola_metal' },
      { si: { patas: true, unida: false }, motivo: 'patas_sueltas' }
    ],
    hace: {}
  }
};
