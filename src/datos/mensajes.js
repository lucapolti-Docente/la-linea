/* Carteles de error (rojo) y aviso (amarillo) que aparecen sobre el tablero.
   Lo que va entre llaves, como {temp}, lo completa el juego: no lo borres.
   Los motivos de cada camión están agrupados por la regla que los usa (src/reglas/). */
export const MSG = {
  // Motor: pasa en cualquier nivel
  motor: {
    metalMaquina: '¡Se rompió la hoja! Una herramienta para madera no corta metal. Buscá la cortadora de aluminio.',
    metalPersona: '¡El serrucho no corta metal y se rompió! Cada material necesita su herramienta.',
    troncoMesa: '¡El tronco rompió la mesa! Un tronco no se trabaja a mano: primero va a la sierra eléctrica.',
    crecida: '¡La crecida rompió la rueda! Poné una compuerta antes, que mande la crecida al vertedero.',
    marcoQuema: '¡El marco llegó a {temp}° y quemó la madera! Tiene que estar a menos de 80°.',
    piezaSanaTacho: 'Una pieza sana se fue al tacho.',
    deDia: 'Esa electricidad se hizo de día y no se guardó. La electricidad no espera en el cable: guardala en una batería.',
    diaSinUso: 'De día las casas no necesitan luz: esa energía se desperdició. Guardala en una batería.',
    casaCaliente: '¡La casa llegó a {temp}°! Le mandaste calor aunque ya estaba caliente. Un termostato mide antes de dejar pasar.',
    sobro: 'Sobró una pieza para un camión que ya salió.',
    hora: 'Se hizo la hora y el camión salió con el pedido incompleto.',
    peligroBrazo: '¡Peligro! El brazo se movió con la técnica al lado. Poné un sensor de presencia pegado al brazo.',
    boleta: 'Se pasó la boleta de luz: las máquinas gastaron más de {kwh} kWh.',
    mantenimiento: 'Una sierra paró para cambiarle la hoja (mantenimiento).',
    perdidaCable: 'Se perdió electricidad en el cable: en baja tensión no aguanta viajes largos. Subila con un transformador elevador.',
    sinGas: 'Se terminó el gas y no alcanzó para todas las casas. ¿Qué camino gastó menos?',
    ruedaRota: 'La rueda está rota. Tocá Reiniciar para arreglarla.',
    mesaRota: 'La mesa está rota. Tocá Reiniciar para arreglarla y poné la sierra eléctrica antes del carpintero.',
    noRecibeTronco: 'Esa máquina no recibe troncos: primero hay que pasarlos por la sierra eléctrica.',
    finCinta: 'Una pieza llegó al final de la cinta y no tiene adónde ir.',
    noRecibe: 'Esa estación no recibe esta pieza, o la está recibiendo por el lado de su flecha.',
    camionSorpresa: '¡Llegó el camión sorpresa! Empieza a entrar material por esta entrada.',
    centralRota: '¡Se rompió la central! Desde ahora no sale más electricidad de ahí.'
  },
  // Cuando el nivel tiene receta (plano): qué le pasó a la pieza
  receta: {
    clavosSueltos: 'Llegaron clavos sueltos al camión.',
    nudo: 'Esa tabla tenía un nudo y el cliente la devolvió.',
    tablaSola: 'Llegó una tabla sola: faltaba clavarla.',
    pasoDeMas: 'A esa pieza le hicieron un paso que el plano no pide: {pasos}.',
    falto: 'A esa pieza le faltó {pasos}.',
    otroOrden: 'Los pasos se hicieron en otro orden: {pasos}.',
    y: ' y ',
    despues: ', después '
  },
  // Fábrica de muebles
  tabla: {
    tronco: 'Llegó un tronco entero al camión.',
    sinSierra: 'Esa pieza no pasó por la sierra eléctrica.',
    sinSierraCorta: 'Esa pieza no pasó por la sierra.',
    sinCarpintero: 'A esa tabla le faltó que el carpintero la corte a medida.',
    sinCorte: 'A esa tabla le faltó el corte a medida.',
    sinLijar: 'A esa tabla le faltó lijar.'
  },
  pintura: {
    sinPintar: 'Llegó una tabla sin pintar.',
    dosVeces: 'Esa tabla se pintó dos veces.',
    otroColor: 'La tabla tenía sticker {sticker} y la pintaron de {color}.',
    robleColor: 'Pintaron una tabla de roble: el roble va con barniz.',
    robleSinBarniz: 'A la tabla de roble le faltó el barniz.',
    robleUnaMano: 'Al roble le faltó la segunda mano.',
    robleMuchas: 'Esa tabla tiene demasiadas manos.',
    pinoBarniz: 'Le pusieron barniz a una tabla de pino: el pino se pinta.'
  },
  paquetes: {
    suelta: 'Llegó una tabla suelta: tenía que ir en un paquete.',
    noEs: 'Eso no es un paquete.'
  },
  manos: {
    sinBarniz: 'Llegó una tabla sin barniz.',
    unaMano: 'Llegó una tabla con una sola mano.',
    demasiadas: 'Esa tabla tiene demasiadas manos de barniz.'
  },
  horno: {
    sinHorno: 'Esa tabla no pasó por el horno.',
    humeda: 'Salió húmeda: le faltaron minutos de horno.',
    sinBarniz: 'A esa tabla le faltó el barniz.',
    secoAntes: 'Se secó antes de barnizar: el barniz quedó húmedo.',
    pegado: 'El barniz todavía estaba húmedo y se pegó en el camión.'
  },
  reparto: {
    pinoEnRoble: 'Llegó pino al camión de roble.',
    humedo: 'El barniz todavía estaba húmedo.',
    robleEnEstantes: 'Llegó roble a un camión de estantes.',
    sinCaja: 'Llegó sin embalar: hay que ponerla en una caja.',
    otroCamion: 'Una caja {sticker} fue al camión de {camion}.'
  },
  industria: {
    barraEntera: 'Llegó una barra entera: faltaba cortarla.',
    noPata: 'Eso no es una pata.',
    tablaSinPatas: 'Llegó una tabla sola: faltaban las patas.',
    tablaSolaCorta: 'Llegó una tabla sola.',
    metalSuelto: 'Llegó metal suelto al camión.',
    noMesa: 'Eso no es una mesa.',
    marcoSinTapa: 'Llegó un marco solo, sin la tapa de madera.',
    marcoSolo: 'Llegó un marco solo.',
    noMesaHierro: 'Eso no es una mesa de hierro.',
    noCorredera: 'Eso no es una corredera.',
    correderaTorcida: 'Llegó una corredera torcida.',
    cajonSuelto: 'Llegó un cajón suelto: faltaba armar el mueble.',
    noCajonera: 'Eso no es una cajonera.',
    cajonTrabado: 'Una corredera torcida trabó un cajón.',
    escuelaTablas: 'A la escuela solo van tablas.',
    rayado: 'Llegó un mueble rayado.',
    camionEquivocado: 'Un mueble fue al camión equivocado (era de {producto}).'
  },
  // Planta de reciclaje
  reci: {
    noSeRecicla: 'Eso no se recicla: tenía que ir al relleno sanitario.',
    reciclableAlRelleno: '¡{material} se podía reciclar y fue al relleno!',
    algoReciclable: '¡Algo reciclable fue al relleno!',
    camionEquivocado: 'Llegó {material}{fardoDe} al camión de {camion}.',
    fardoDe: ' de {material}',
    papelSuelto: 'El papel suelto no entra en el camión: tiene que ir enfardado.',
    fardoConPlastico: 'Fardo mezclado: tenía plástico adentro y nadie lo compra.',
    sinEnfardar: 'Eso tenía que llegar enfardado.',
    sinEnfardarCorto: 'Eso tenía que ir enfardado.',
    fardoMezclado: 'Fardo mezclado: nadie lo compra.',
    fardoNoPapel: 'Ese fardo no es de papel.',
    noEraTercero: 'Ese fardo no era el tercero: tenía que ir al comprador.',
    eraTercero: 'Ese era el tercer fardo: tenía que ir a la balanza.',
    papelAlRelleno: '¡Papel al relleno!',
    pilaAlRelleno: '¡Una pila fue al relleno! Contamina la tierra y el agua.',
    celularAlRelleno: '¡Un celular fue al relleno! Tenía metales para recuperar.',
    noPellets: 'Eso no son pellets.',
    todaviaNoPellets: 'Eso todavía no son pellets.',
    pelletsSucios: 'Pellets sucios: las escamas no se lavaron bien.',
    pelletsSinLavar: 'Pellets sucios: les faltó lavado.',
    pelletsSuciosCorto: 'Pellets sucios.',
    botellaRota: 'Una botella rota no se puede volver a llenar.',
    compostCrudoLargo: 'Compost crudo: le faltaron semanas en la compostera.',
    compostCrudo: 'Ese compost salió crudo: le faltaron semanas.',
    compostCrudoCorto: 'Ese compost salió crudo.',
    comidaACompost: 'La comida podía ir a la compostera.',
    comidaAlRelleno: '¡Comida al relleno! Iba a la compostera.'
  },
  // La usina
  ene: {
    otraEnergia: 'Llegó {energia} y {destino} necesita {pide}.',
    elDestino: 'el destino',
    altaTension: '¡Alta tensión! Quemó la instalación: antes de entrar a una casa hay que bajarla con un transformador reductor.'
  }
};

/* Completa los {marcadores} de un mensaje. */
export function fmt(msg, vars) {
  return msg.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}
