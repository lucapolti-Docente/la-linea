/* Nombres que el juego arma en frases (carteles de camiones, motivos de error, diagramas). */

/* Cartel de cada camión según lo que lleva. */
export const TRUCKN = {
  azul: 'cajas azules', amarillo: 'cajas amarillas', roble: 'roble', pino: 'estantes de pino', mesa: 'mesas', mesaHierro: 'mesas de hierro', cajonera: 'cajoneras', tabla: 'tablas',
  reciclables: 'reciclables', papel: 'papel', plastico: 'plástico', vidrio: 'vidrio', acero: 'acero', aluminio: 'aluminio', pet: 'PET transparente', petColor: 'PET de color',
  pellets: 'pellets', botellaRe: 'botellas reutilizadas', botella: 'vidrio nuevo', compost: 'compost', cartonNuevo: 'cartón nuevo', lingote: 'a la fábrica de muebles',
  pila: 'pilas (tratamiento especial)', placa: 'placas electrónicas', gas: 'biogás', balanza: 'fardos para pesar', fardo: 'fardos',
  luz: 'luz', calor: 'calor', mov: 'movimiento', elec: 'electricidad'
};

/* Pasos del plano: como se dicen en una frase y como se escriben en el diagrama. */
export const STEP_NAME = { marcar: 'marcar con lápiz', cortar: 'cortar', lijar: 'lijar', clavar: 'clavar' };
export const STEP_SHORT = { marcar: 'Marcar', cortar: 'Cortar', lijar: 'Lijar', clavar: 'Clavar' };

/* Planta de reciclaje: cómo se nombra cada residuo en una frase. */
export const NAMEK = {
  papel: 'papel', carton: 'cartón', pet: 'PET transparente', petColor: 'PET de color', vidrio: 'vidrio', lata: 'aluminio', acero: 'acero', organico: 'orgánico',
  basura: 'basura no reciclable', fardo: 'un fardo', escamas: 'escamas', pellets: 'pellets', calcin: 'calcín', botella: 'una botella nueva', botellaRe: 'una botella reutilizada',
  pasta: 'pasta de papel', cartonNuevo: 'cartón nuevo', compost: 'compost', lingote: 'un lingote', pila: 'una pila', celular: 'un celular', placa: 'una placa', gas: 'biogás'
};

/* La usina: qué forma de energía es cada cosa. */
export const EN = {
  cera: 'química (cera)', lena: 'química (leña)', carbon: 'química (carbón)', gas: 'química (gas)', uranio: 'nuclear (uranio)',
  agua: 'movimiento del agua', viento: 'movimiento del viento', luzSol: 'luz del sol', calor: 'calor', mov: 'movimiento', elec: 'electricidad', luz: 'luz', organico: 'restos de comida'
};

/* Textos de la pantalla. Lo que va entre llaves, como {n}, lo completa el juego. */
export const TX = {
  tablero: {
    noche: 'NOCHE', dia: 'DÍA', mant: 'MANT. ', rota: '¡rota!', quedan: 'quedan {n}', seAcabo: '¡se acabó!',
    si: 'SÍ', no: 'NO', pedido: 'Pedido', perdida: 'pérdida'
  },
  marca: 'La <b>Línea</b>',
  menu: { abrir: 'Abrir menú', titulo: 'Menú principal', inicio: 'Inicio', niveles: 'Niveles', ayuda: 'Cómo se juega', progreso: 'Progreso', sonido: 'Sonido: tocá para silenciar', silencio: 'Sin sonido: tocá para activarlo', pie: 'Tecnología · Procesos productivos' },
  inicio: {
    tira: 'Animación de una línea de producción', jugar: 'Jugar',
    lead: 'Armá la cinta de una carpintería y mirá cómo se convierte en fábrica. Cada pedido del cliente se arma paso a paso.',
    queVasAUsar: 'Qué vas a usar',
    aprender: ['Cintas que avanzan, giran y se juntan', 'Pasos en orden: marcar, cortar, lijar', 'Materiales distintos en una misma pieza', 'Bucles que repiten hasta completar el pedido', 'Sensores que deciden por dónde sigue la pieza']
  },
  mundos: { eyebrow: 'La ciudad', titulo: 'Elegí un mundo', cantidad: '{n} niveles.' },
  niveles: { eyebrow: 'Mundo', acto: 'Acto {n}', nivel: 'Nivel {n} · {tipo}' },
  ayuda: {
    eyebrow: 'Instrucciones',
    items: [
      ['Cinta transportadora', 'Elegí "Cinta" y arrastrá sobre el piso para dibujarla. Las flechas muestran hacia dónde avanza. Tocá una cinta para girarla.'],
      ['Trabajadores', 'Elegilos en la paleta y ubicalos en el piso. La flecha verde dice por dónde entregan la pieza. Tocalos para elegir ese lado en un cuadrito, o para quitarlos. Las piezas están agrupadas en Taller, Fábrica e Industria.'],
      ['Repartidor', 'Manda una pieza para cada lado, de a una. Sirve para que dos estaciones iguales trabajen a la vez cuando un paso es lento.'],
      ['Materiales', 'Las cajas con rayas son las entradas: de ahí salen tablas o clavos. Un trabajador puede necesitar dos materiales a la vez.'],
      ['Inspector (sensor)', 'Mira cada pieza. SI está bien, sale por la flecha verde. SI NO, sale por la roja. Las flechas dicen SÍ y NO. Tocalo para elegir de qué lado sale cada una.'],
      ['Máquinas', 'Hacen el mismo trabajo que una persona, pero más rápido. La luz verde se prende cuando trabajan.'],
      ['Escáneres (sensores)', 'Hacen una pregunta, como ¿Azul? o ¿Roble?. SI la respuesta es sí, la pieza sale por la verde. SI NO, por la roja.'],
      ['Camión y pedido', 'El camión recibe lo que pidió el cliente. Si llegan 3 piezas mal hechas, el cliente devuelve el pedido.'],
      ['Encender y borrar', '"Encender" pone la línea a repetir sola hasta completar el pedido. Con "Borrar" sacás cintas y trabajadores.']
    ]
  },
  progreso: {
    eyebrow: 'Ajustes', nombre: 'Tu nombre', nombreAyuda: 'Así sale en el resumen para el docente. Queda guardado en esta compu.', nombrePlaceholder: 'Nombre y grado',
    copiar: 'Copiar resumen para el docente', copiado: 'Copiado', seleccionado: 'Seleccionado: copialo con Ctrl+C',
    docentes: 'Para docentes', docentesAyuda: 'Todos los niveles están abiertos: se puede empezar la clase en cualquiera. El progreso (estrellas) queda guardado solo en esta compu y este navegador.',
    borrar: 'Borrar el progreso de esta compu', seguro: '¿Seguro? Tocá otra vez para borrar',
    resumenMundo: '{done} de {total} niveles · {st} de {max} estrellas',
    textoTitulo: 'La Línea · {nombre} · {fecha}', sinNombre: '(sin nombre)', textoMundo: '{mundo}: {done}/{total} niveles, {st}/{max} estrellas'
  },
  juego: {
    ayudaNivel: 'Cómo funciona este nivel', tablero: 'Tablero de la fábrica', velocidad: 'Velocidad', paleta: 'Piezas para armar la línea',
    objetivo: 'Objetivo', loNuevo: 'Lo nuevo', verTodo: 'Ver cómo funciona todo', pedido: 'Pedido del cliente', reloj: 'Reloj', errores: 'Errores', piezas: 'Piezas',
    reiniciar: 'Reiniciar', pista: 'Pista', borrarTodo: 'Borrar todo', otraLinea: 'Otra línea', volverRota: 'Volver a la línea rota',
    barra: 'Acto {acto} · Nivel {n} · {titulo}',
    ayudaTablero: 'Arrastrá para dibujar cinta · tocá una cinta para girarla · tocá una estación para elegir sus lados',
    encender: 'Encender', pausar: 'Pausar', seguir: 'Seguir',
    paso: 'Paso', pasoAyuda: 'Paso: avanza un tick y se detiene',
    camionSale: 'El camión sale a las {hora}', camionesSalen: 'Los camiones salen a las {hora}', faltan: ' · faltan {n}',
    completo: '<b>Pedido completo.</b> Los camiones salen.',
    repetir: 'Repetir hasta tener <b>{N}</b> · vamos por la <b>{vuelta}.ª</b>',
    tresEstrellas: '3 estrellas: terminar antes de {hora}', energia: 'Energía: {kwh} de {max} kWh',
    camion: 'Camión {que}', nuevo: 'Nuevo',
    nadaDepurar: 'Nada nuevo: la línea ya está armada, pero tiene errores. Encendela y buscalos.',
    nadaOptimiza: 'Nada nuevo: la línea anda, pero desperdicia. Encontrá dónde.',
    nadaDesafio: 'Nada nuevo: es un desafío para usar todo lo que ya aprendiste.',
    cinta: ['Cinta', 'Cinta transportadora'], borrar: ['Borrar', 'Borrar cintas y estaciones'],
    reinicio: 'La producción volvió a cero. Tu línea sigue armada.',
    lineaRota: 'Volvió la línea rota, como estaba al empezar.',
    fija: 'Esa pieza viene fija con la fábrica.', pasillo: 'El pasillo tiene que quedar libre para que pase la técnica.',
    maxEstaciones: 'En este diseño podés usar como máximo {n} estaciones. Borrá una para cambiarla.',
    cintaArmada: 'Esa cinta viene armada. Seguí desde donde termina.', estacionFija: 'Esta estación está fija. Conectá cintas a su alrededor.'
  },
  lados: {
    salida: 'Salida', salidaSi: 'Salida {si}', salidaNo: 'Salida {no}', salida1: 'Salida 1', salida2: 'Salida 2',
    menosDe: '¿Menos de', bajar: 'Bajar', subir: 'Subir', tiempo: 'Tiempo', menos: 'Menos', mas: 'Más', min: 'min',
    sale: 'Sale', salirPor: 'Salir por {lado}', lados: ['la derecha', 'abajo', 'la izquierda', 'arriba'],
    pasiva: 'No recibe piezas: frena los brazos pegados a él cuando pasa la técnica.',
    soloNumero: 'Esta estación está fija: solo podés ajustar su número.',
    tocaLado2: 'Ahora tocá el lado de la {salida}.', tocaLado: 'Tocá el lado por donde sale la pieza.',
    quitar: 'Quitar', listo: 'Listo'
  },
  ventanas: {
    intro: 'Acto {acto} · Nivel {n}', industriaReal: 'En la industria real', pedido: 'Pedido',
    aTrabajar: 'A trabajar', comoFunciona: 'Cómo funciona', volverNiveles: 'Volver a niveles',
    partesTitulo: 'Nivel {n} · {titulo}', nuevo: 'Nuevo', entendido: 'Entendido', pista: 'Pista',
    completo: 'Nivel {n} completo', fabricaTerminada: '¡Fábrica terminada!', entregado: 'Pedido entregado',
    salio: 'El camión salió con {N} {producto} en <strong>{hora}</strong> de fábrica{errores}.',
    conErrores: ', con {n} {palabra}', error: 'error', errores: 'errores', sinErrores: ', sin errores',
    estrella1: '★ Pedido completo', estrella2: '★★ Terminar antes de {hora}', estrella3: '★★★ Terminar antes de {hora}',
    usaste: 'Usaste {cintas} cintas y {estaciones} estaciones{energia}.', energia: ' · se desperdició energía {n} {palabra}', vez: 'vez', veces: 'veces',
    mejorar: ' Una línea más corta, o dos estaciones en paralelo donde se amontonan las piezas, termina antes.',
    quienTrabaja: '¿Quién trabaja ahora?', finRecorrido: 'Fin del recorrido',
    final: 'Empezaste con una carpintera y un lápiz, marcando tablas de a una. Después vinieron el serrucho, el martillo y el inspector. Llegaron las máquinas, los escáneres y el horno. Hoy la fábrica tiene edificios, brazos robóticos y camiones para cada cliente, y en la línea no trabaja ninguna persona. Eso es industrializar.',
    siguiente: 'Siguiente nivel', verNiveles: 'Ver niveles', otraLinea: 'Otra línea', mejorarEsta: 'Mejorar esta',
    horaEyebrow: 'Se hizo la hora', horaTitulo: 'El camión se fue', horaTexto: 'Faltaron piezas cuando llegó la hora de salida ({hora}).',
    horaAyuda: 'Buscá dónde se amontonan las piezas: ahí está la parte lenta de tu línea.',
    devueltoEyebrow: 'Pedido devuelto', devueltoTitulo: 'El cliente no quedó conforme', devueltoTexto: 'Llegaron 3 piezas mal hechas. La última: {motivo}',
    devueltoAyuda: 'Revisá el orden de las estaciones y hacia dónde apuntan las cintas.',
    revisar: 'Revisar la línea', verPista: 'Ver pista'
  },
  diagrama: {
    aria: 'Diagrama del nivel', si: 'SÍ', no: 'NO', entrada: 'Entrada', entrada1: 'Entrada 1', entrada2: 'Entrada 2', repartidor: 'Repartidor', fin: 'Fin',
    sano: '¿Sano?', tacho: 'Tacho', mesa: '¿Mesa?', camionMesas: 'Camión mesas', hierro: '¿Hierro?', camionHierro: 'Camión hierro', camionCajoneras: 'Camión cajoneras',
    tablaCorrederas: 'Tabla + 2 correderas', brazoCajon: 'Brazo cajón', cajon: 'Cajón', tablaCajones: 'Tabla + 2 cajones', brazoMueble: 'Brazo mueble', cajonera: 'Cajonera'
  }
};
