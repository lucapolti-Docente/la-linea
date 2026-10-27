/* Todos los textos que se ven en pantalla (salvo los de cada nivel, que están en niveles/).
   Voseo, frases cortas y sin retar. Para corregir una palabra, se toca solo acá. */

/* NO FUNCIONA: [qué pasó, una pregunta para seguir]. Se muestran en la estación donde falló. */
export const FALLAS = {
  cortar_metal: ['La sierra de madera no corta el metal.', 'Los caños ya vienen cortados. ¿Qué les falta?'],
  cortar_plastico: ['El plástico en granitos no se corta.', '¿Qué le hace falta para tomar forma?'],
  lijar_plastico: ['No hay nada que lijar: son granitos de plástico.', '¿Qué los ablanda?'],
  pintar_plastico: ['La pintura no se pega a los granitos de plástico.', 'Primero hay que darle forma al envase.'],
  agujerear_plastico: ['Los granitos de plástico no se pueden agujerear.', '¿Qué los convierte en un envase?'],
  clavar_metal: ['El clavo no entra en el metal: se dobla.', '¿Qué otra unión probarías?'],
  unir_sin_partes: ['No hay partes para unir.', 'Esta pieza viene entera.'],
  soldar_madera: ['¡La soldadora quemó la madera!', 'La madera se clava o se pega. ¿Qué probarías?'],
  soldar_plastico: ['La soldadora derritió el plástico.', 'La soldadura es para el metal.'],
  horno_madera: ['¡El horno quemó la madera!', 'El horno sirve para ablandar plástico.'],
  horno_metal: ['El horno no alcanza para ablandar el metal.', 'El horno sirve para ablandar plástico.'],
  horno_moldeado: ['El envase volvió al horno y se derritió.', 'Calentar va antes de moldear.'],
  molde_madera: ['La madera no entra en el molde.', 'El molde es para el plástico caliente.'],
  molde_metal: ['El metal no entra en el molde.', 'El molde es para el plástico caliente.'],
  molde_frio: ['El plástico frío está duro y no toma la forma del molde.', '¿Qué lo ablanda antes?'],
  desmoldar_vacio: ['No hay nada en el molde para sacar.', '¿Qué va antes de desmoldar?'],
  llenar_sin_envase: ['No hay envase: el shampoo se cae al piso.', 'Primero tiene que haber un envase.'],
  llenar_tapado: ['El envase está tapado: el shampoo se derramó sobre la tapa.', '¿Qué va primero, llenar o tapar?'],
  tapar_sin_envase: ['No hay envase para tapar.', 'Primero tiene que haber un envase.'],
  etiquetar_sin_envase: ['No hay envase para pegarle la etiqueta.', 'Primero tiene que haber un envase.'],
  cola_metal: ['En la prueba de peso, el pegamento no agarró el metal y se soltó.', '¿Qué otra unión probarías?'],
  patas_sueltas: ['En la prueba de peso, las patas se soltaron.', 'Faltó unir las patas. ¿Con qué?']
};

/* SALE PEOR: [qué defecto tiene, por qué conviene otro orden]. */
export const DEFECTOS = {
  cortada_de_mas: ['La cortaste dos veces y quedó más chica.', 'Con un corte alcanza.'],
  bordes_sin_pintar: ['Los bordes del corte quedaron sin pintar.', 'Pintar conviene al final.'],
  pintura_raspada: ['La lija raspó la pintura.', 'Primero se lija y después se pinta.'],
  pintura_despareja: ['La pintura quedó despareja sobre la madera áspera.', 'Lijá antes de pintar.'],
  pintura_saltada: ['La pintura saltó alrededor del agujero.', 'Pintar conviene al final.'],
  pintura_marcada: ['Los martillazos marcaron la pintura.', 'Pintar conviene al final.'],
  cola_sobre_pintura: ['La cola manchó la pintura.', 'Pintar conviene al final.'],
  pintura_quemada: ['La soldadura quemó la pintura.', 'Pintar conviene al final.'],
  trabajo_perdido: ['Se trabajaron tablas rajadas que después fueron a reciclar.', 'Conviene revisar antes de trabajarlas.'],
  envase_deformado: ['El envase salió caliente y se deformó.', '¿Qué le falta antes de desmoldar?'],
  rajada: ['Salieron mesas con la tabla rajada.', 'Un sensor puede separar las tablas rajadas.']
};

/* Lo que pide el cliente: cada propiedad del modelo con su ícono (de src/dibujo/iconos.js) y su nombre corto. */
export const ITEMS = {
  cortada: ['serrucho', 'CORTADA'],
  lisa: ['lija', 'LISA'],
  agujero: ['taladro', 'CON AGUJERO'],
  pintada: ['pincel', 'PINTADA'],
  unida: ['union', 'PATAS FIRMES'],
  moldeado: ['molde', 'CON FORMA'],
  envase: ['desmoldar', 'ENVASE'],
  lleno: ['llenar', 'LLENO'],
  tapado: ['tapar', 'TAPADO'],
  etiquetada: ['etiquetar', 'CON ETIQUETA']
};

/* Pantalla de inicio y modos. */
export const MODOS_TXT = {
  taller: { nombre: 'Taller', grado: '4.º grado', descripcion: 'Una pieza por vez, con herramientas de mano.' },
  fabrica: { nombre: 'Fábrica', grado: '5.º grado', descripcion: 'Muchas piezas: máquinas y Repetir.' },
  planta: { nombre: 'Planta', grado: '6.º y 7.º grado', descripcion: 'Sensores, plástico y dos fábricas.' },
  libre: { nombre: 'Libre', grado: 'Todos', descripcion: 'Todas las estaciones, sin pedido.' }
};

/* Nombres de las pestañas del panel en el modo libre. */
export const GRUPOS = { madera: 'Madera', maquinas: 'Máquinas', plastico: 'Plástico', envases: 'Envases' };

/* Nombres de los materiales para elegir en el modo libre. */
export const MATERIALES_TXT = { tabla: 'Tabla', kit: 'Mesa en partes', canos: 'Caños', granos: 'Plástico', envase: 'Envase' };

/* Todo lo demás que se lee en pantalla. Las funciones arman frases con números. */
export const T = {
  titulo: 'La Línea',
  lema: 'Del taller a la fábrica: ordená las estaciones y producí lo que pide el cliente.',
  elegiModo: '¿Dónde trabajamos hoy?',
  elegiNivel: 'Elegí un pedido',
  nivel: (i, total) => 'Pedido ' + i + ' de ' + total,
  producir: 'Producir',
  paso: 'Paso',
  vaciar: 'Vaciar',
  inicio: 'Inicio',
  menu: 'Menú',
  pide: 'Pide',
  estaciones: 'Estaciones',
  material: 'Material',
  casillero: n => 'Casillero ' + n,
  vacio: 'vacío',
  fija: 'Ya armada',
  minutos: m => (Math.round(m * 10) / 10) + ' min',
  meta: m => 'Meta: ' + m + ' min',
  aMano: 'A mano',
  tuLinea: 'Tu línea',
  piezas: (h, n) => h + ' de ' + n,
  repetir: 'Repetir',
  veces: 'veces',
  sacarRepetir: 'Sacar Repetir',
  ponerRepetir: 'Envolver con Repetir',
  lenta: 'La más lenta',
  lote: n => '× ' + n,
  // mensajes de la encargada
  elegiEstacion: 'Tocá una estación y después un casillero. También podés arrastrarla.',
  elegida: nombre => nombre + ': ahora tocá un casillero.',
  puesta: (nombre, n) => nombre + ' en el casillero ' + n + '.',
  sacada: n => 'Vaciaste el casillero ' + n + '.',
  vacia: 'La cinta está vacía. Poné al menos una estación.',
  trabajando: nombre => nombre + '…',
  cambio: (nombre, que) => nombre + ': ahora está ' + que + '.',
  sinCambio: nombre => nombre + ': no cambió nada.',
  reciclaje: 'Rajada: ¡a la caja de reciclaje!',
  prueba: 'Prueba de peso…',
  pruebaBien: '¡Aguantó el peso!',
  produciendo: 'La cinta se llena de piezas…',
  faltan: n => 'Faltan ' + n + ' para el pedido. Mirá el número de Repetir.',
  sobran: n => 'Sobran ' + n + '. El pedido es justo: mirá el número de Repetir.',
  noIgual: 'Salió distinta a lo que pidió el cliente. Mirá las tildes.',
  // ventana de resultado
  resultado: ['¡A probar otra vez!', '¡Salió igual al modelo!', '¡Y sin defectos!', '¡Perfecta y a tiempo!'],
  conDefectos: 'Salió, pero con defectos:',
  tarde: (t, meta) => 'Tardó ' + t + ' min y la meta era ' + meta + '. ¿Hay algo más rápido?',
  aTiempo: (t, meta) => 'Tardó ' + t + ' min. Meta: ' + meta + '. ¡Llegaste!',
  libreSalio: 'Así salió tu pieza.',
  otraVez: 'Otra vez',
  siguiente: 'Siguiente',
  elegirOtro: 'Elegir otro',
  terminaste: '¡Terminaste todos los pedidos de este modo!',
  // menú
  menuInicio: 'Pantalla de inicio',
  menuNiveles: 'Pedidos',
  menuSonido: 'Sonido',
  menuMayus: 'Todo en mayúsculas',
  menuDocentes: 'Para docentes',
  menuBorrar: 'Borrar estrellas',
  borrarSeguro: '¿Borrar todas las estrellas de esta compu?',
  si: 'Sí, borrar',
  no: 'No',
  cerrar: 'Cerrar',
  silenciar: 'Silenciar',
  activarSonido: 'Activar sonido'
};
