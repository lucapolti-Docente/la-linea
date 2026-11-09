/* Planta de reciclaje: a qué grupo pertenece cada residuo (lo usan los sensores y los camiones). */
export const CAT = {
  papel: 'papel', carton: 'papel', pet: 'plastico', petColor: 'plastico', vidrio: 'vidrio', lata: 'metal', acero: 'metal',
  organico: 'organico', basura: 'basura', pila: 'peligroso', celular: 'electronico'
};

/* Grupos que se reciclan. */
export const RECICLABLES = ['papel', 'plastico', 'vidrio', 'metal'];

/* Mezcla de residuos de los primeros niveles de reciclaje: [material, cuántos de cada 12]. */
export const MIX1 = [['papel', 3], ['pet', 2], ['vidrio', 2], ['lata', 1], ['basura', 2], ['organico', 2]];

/* Pinturas que puede tener una tabla (mismo nombre que el sticker). */
export const PAINTS = ['azul', 'amarillo'];
