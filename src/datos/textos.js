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
