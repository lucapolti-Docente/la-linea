/* Textos de las guías para docentes (public/docentes/). Los niveles, actos, datos reales, diagramas y reflexiones
   salen de los archivos de cada mundo; acá va solo lo que es para el docente. Después de cambiar algo: npm run guia. */

export const URL_DC = 'https://buenosaires.gob.ar/educacion/diseno-curricular-nivel-primario';

export const COMUN = {
  titulo: 'La Línea',
  subtitulo: 'Guía para docentes',
  grados: '4.º a 7.º grado',
  avisoDC: 'Relación con el Diseño Curricular: es una orientación general hecha con los documentos de Tecnologías, Diseño y Programación de la Ciudad. No está verificada nivel por nivel contra el documento. Antes de planificar, chequeala con el Diseño Curricular vigente.',
  comoSeJuega: [
    ['El tablero', 'Es el piso de la fábrica, en casilleros. De las entradas (cajas con rayas) sale el material; el camión espera el pedido. Algunas piezas vienen fijas.'],
    ['Armar la línea', 'Se dibuja la cinta arrastrando sobre el piso y se ubican trabajadores, máquinas y sensores desde la paleta. Tocando una estación se elige por qué lado entrega la pieza.'],
    ['Encender y Paso', 'ENCENDER pone la línea a trabajar sola hasta completar el pedido (velocidad x1, x2 o x4). PASO avanza un tick y se detiene: sirve para seguir una pieza con el dedo y encontrar dónde falla.'],
    ['Cuándo se gana', 'Cuando el camión sale con todo el pedido. En algunos niveles el camión tiene horario: si se va antes de completar, hay que buscar la parte lenta de la línea.'],
    ['Cuándo se vuelve a probar', 'Si llegan 3 piezas mal hechas, el cliente devuelve el pedido. El juego dice por qué y la línea queda armada para corregirla. Nunca dice "perdiste".'],
    ['Estrellas', 'Una estrella por completar el pedido; dos o tres si se termina antes de la hora que muestra el objetivo. El progreso queda guardado solo en esa compu y ese navegador.'],
    ['Ayudas', 'Cada nivel tiene un objetivo con diagrama, un botón Pista y un botón "?" que explica cada pieza. Todos los niveles están abiertos: se puede empezar la clase en cualquiera.']
  ],
  tipos: [
    ['Práctica', 'presenta una sola idea nueva.'],
    ['Desafío', 'junta lo del acto, sin piezas nuevas.'],
    ['Depurar', 'la línea viene armada y con errores; hay que encontrarlos. "Volver a la línea rota" la deja como al principio.'],
    ['Diseñá', 'hay que armar la línea con un máximo de estaciones.'],
    ['Optimizá', 'la línea anda, pero desperdicia (energía o material). Hay que mejorarla.']
  ],
  clase: [
    'Una clase de 40 a 60 minutos alcanza para 3 a 5 niveles de un acto.',
    'Funciona bien en parejas: uno arma y el otro sigue la pieza con PASO y dice qué va a pasar antes de que pase.',
    'En los niveles Depurar conviene pedir que anoten el error antes de arreglarlo.',
    'Para cerrar, usar la reflexión del acto (está en esta guía y aparece al terminar el último nivel del acto).',
    'El juego no pide datos de los chicos. En Progreso pueden escribir un nombre y copiar un resumen de estrellas para el docente.'
  ],
  pie: 'La Línea · Juegos de Tecnología de Luca Polti · lucapolti-docente.github.io'
};

export const GUIAS = {
  muebles: {
    archivo: 'guia-muebles',
    queHacen: 'Arman la línea de una fábrica de muebles: de la carpintera que marca tablas con lápiz a la fábrica donde trabajan solos edificios, brazos robóticos y sensores.',
    grados: { 1: '4.º', 2: '5.º', 3: '6.º y 7.º' },
    dc: [
      ['Comprensión, representación y diseño de los procesos tecnológicos', 'Secuencia de operaciones (marcar, cortar, lijar, clavar), lectura de un plano, trabajo en paralelo y cuello de botella, delegación de tareas de las personas en las máquinas.', 'Actos 1 y 2'],
      ['Transformaciones y gestión de los materiales y la energía', 'Cada material con su herramienta (madera, aluminio, hierro), costo de la energía y ahorro.', 'Niveles 5, 14, 25 y 33'],
      ['Diseño y programación', 'Secuencias, condicionales simples y anidados, bucles (repetir N veces, repetir hasta), contador, depuración en los niveles Depurar.', 'Los tres actos'],
      ['Diseño y resolución de problemas en robótica', 'Sensores (color, temperatura, presencia, calidad) y actuadores (brazos robóticos); umbral de un sensor.', 'Acto 3'],
      ['Reflexión sobre los procesos tecnológicos y computacionales', 'Qué trabajos desaparecen y cuáles aparecen con la automatización; productividad.', 'Cierre de cada acto']
    ],
    articulaciones: 'Educación Digital (pensamiento computacional). Ciencias Sociales: trabajo e industria.',
    antes: {
      titulo: 'La línea humana',
      pasos: [
        'Formen una fila de 4 o 5 chicos. Cada uno es una estación: uno marca con lápiz una tira de papel, otro la corta, otro la "lija" (dobla los bordes) y el último la pega en un afiche: es el camión.',
        'Primero, de a uno: cada uno hace todo el banquito. Después, en línea. Tomen el tiempo de 6 piezas en cada forma.',
        'Sumen un inspector que mira cada pieza: SI está bien, al camión; SI NO, a la caja de reciclar.',
        'Con la ficha "Dibujá tu línea", dibujen la línea que armaron antes de abrir el juego.'
      ]
    },
    cierre: ['¿Dónde se amontonaban las piezas? ¿Qué hicieron para que no pase?', '¿Qué hace una persona en la fábrica que una máquina todavía no puede hacer?']
  },
  reci: {
    archivo: 'guia-reci',
    queHacen: 'Arman una planta de reciclaje: separan residuos a mano como en un Centro Verde, después con máquinas y sensores, y al final transforman cada material en materia prima nueva.',
    grados: { 1: '4.º y 5.º', 2: '5.º y 6.º', 3: '6.º y 7.º' },
    dc: [
      ['Transformaciones y gestión de los materiales y la energía', 'Propiedades de los materiales que sirven para separarlos (imán, aire, corrientes), residuos peligrosos, transformación en materia prima nueva (pellets, calcín, cartón, compost, lingotes).', 'Actos 2 y 3'],
      ['Comprensión, representación y diseño de los procesos tecnológicos', 'El recorrido de los residuos, separar en origen, dividir el trabajo, el orden de las máquinas en la planta.', 'Los tres actos'],
      ['Diseño y programación', 'Condicional SI / NO, preguntas en cadena, contador (cada tres, uno a la balanza), bucles, eventos, depuración.', 'Los tres actos'],
      ['Diseño y resolución de problemas en robótica', 'Sensor óptico con actuador que sopla la pieza a otra cinta.', 'Acto 2'],
      ['Reflexión sobre los procesos tecnológicos y computacionales', 'El trabajo de las cooperativas de recuperadores urbanos, qué separación sigue necesitando ojos humanos, economía circular.', 'Cierre de cada acto']
    ],
    articulaciones: 'Educación Ambiental (residuos, separación en origen, economía circular). Educación Digital.',
    antes: {
      titulo: 'El Centro Verde del aula',
      pasos: [
        'Traigan residuos limpios y secos: papel, cartón, botellas, latas, un tapón de corcho, un envoltorio de golosina.',
        'Un chico es la recuperadora: pregunta "¿Se recicla?" y separa en dos cajas. Después, otro pregunta "¿Es papel?" y separa la caja de reciclables.',
        'Prueben un imán con cada cosa: ¿cuál se pega? Así separa la planta el acero.',
        'Dibujen en la ficha el camino de una bolsa mezclada, con las preguntas como rombos.'
      ]
    },
    cierre: ['¿Qué parte del trabajo de una recuperadora podría hacer una máquina y cuál no?', '¿Qué cosas de la escuela podrían volver a empezar el círculo?']
  },
  ene: {
    archivo: 'guia-usina',
    queHacen: 'Arman la cadena de transformaciones de la energía: de la vela y la rueda de agua a las centrales, la alta tensión y la red que lleva la luz a toda la ciudad.',
    grados: { 1: '5.º', 2: '6.º', 3: '7.º' },
    dc: [
      ['Transformaciones y gestión de los materiales y la energía', 'Formas de energía (química, movimiento, calor, electricidad, luz) y sus transformaciones, pérdidas, fuentes renovables y no renovables, almacenamiento, ahorro.', 'Los tres actos'],
      ['Comprensión, representación y diseño de los procesos tecnológicos', 'Cadenas de transformación, generación, transporte y distribución (alta y baja tensión), redes.', 'Actos 2 y 3'],
      ['Diseño y programación', 'Secuencias, condicional (la crecida), control automático de lazo cerrado (termostato), trabajo en paralelo, depuración.', 'Los tres actos'],
      ['Diseño y resolución de problemas en robótica', 'Sensor y control automático: el termostato prende y apaga según la temperatura.', 'Nivel 12'],
      ['Reflexión sobre los procesos tecnológicos y computacionales', 'De dónde viene la electricidad de la escuela, qué transformaciones se pueden evitar ahorrando.', 'Cierre de cada acto']
    ],
    articulaciones: 'Educación Ambiental (fuentes de energía, ahorro). Ciencias Naturales: energía. Ciencias Sociales: centrales y regiones de la Argentina.',
    antes: {
      titulo: 'La cadena de la energía',
      pasos: [
        'Repartan tarjetas: agua del río, viento, sol, gas, movimiento, calor, electricidad, luz.',
        'Pidan que armen en el piso la cadena que termina en la lamparita del aula. Cada flecha es una máquina: ¿qué máquina pasa del agua al movimiento? ¿Y del movimiento a la electricidad?',
        'Hagan dos cadenas distintas que lleguen a la misma luz. ¿Cuál tiene menos pasos?',
        'Dibujen en la ficha una de las cadenas como una línea de producción.'
      ]
    },
    cierre: ['¿De dónde viene la electricidad de la escuela? ¿Cuántas transformaciones hay en el camino?', '¿Qué aparatos de la escuela gastan energía sin que nadie los use?']
  }
};

/* Ficha en papel (una hoja para dibujar la línea y una para el diagrama). */
export const FICHA = {
  archivo: 'ficha-linea',
  titulo: 'Dibujá tu línea',
  datos: ['Nombre', 'Grado', 'Fecha'],
  pedido: '¿Qué hay que fabricar o separar?',
  consigna: 'Dibujá la línea en los casilleros: de dónde sale el material, por dónde va la cinta, qué estaciones hay y adónde llega.',
  simbolos: [
    ['entrada', 'Entrada de material'], ['cinta', 'Cinta (la flecha dice hacia dónde va)'], ['estacion', 'Trabajador o máquina (escribí qué hace)'],
    ['pregunta', 'Pregunta o sensor: SÍ / NO'], ['repartidor', 'Repartidor: una pieza para cada lado'], ['camion', 'Camión: lo que pidió el cliente'], ['tacho', 'Tacho o relleno']
  ],
  pasos: 'Los pasos, en orden',
  falla: '¿Dónde puede fallar tu línea? ¿Cómo te darías cuenta?',
  titulo2: 'Primero el diagrama',
  consigna2: 'Antes de dibujar la línea, escribí en las cajas qué pasa con cada pieza.',
  secuencia: 'Secuencia: un paso detrás del otro',
  pregunta: 'Pregunta: la pieza sigue por un lado o por el otro',
  bucle: 'Bucle: se repite hasta tener el pedido',
  repetirHasta: 'Repetir hasta tener',
  probar: 'Probá con un compañero: sigan una pieza con el dedo por el dibujo. ¿Llega al camión? ¿Qué pasa con una pieza mal hecha?',
  ideas: 'Ideas de pedidos',
  ejemplos: ['Un banquito: marcar, cortar, lijar y clavar.', 'Una bolsa mezclada: lo reciclable al Centro Verde, lo demás al relleno.', 'Del río a la lamparita: agua, movimiento, electricidad, luz.', 'Cajas azules y amarillas: un sensor de color manda cada una a su camión.']
};
