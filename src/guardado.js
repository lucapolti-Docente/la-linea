/* Guarda progreso y preferencias en el navegador. Si no se puede (modo privado, bloqueado), el juego sigue igual.
   Formato: { version: 1, estrellas: { [id de nivel]: 0 a 3 }, modo, nivel (id), sonido, mayus }.
   El progreso se guarda por id de nivel, nunca por número: así se pueden reordenar los niveles. */
export const CLAVE = 'la-linea-v1';

export function crearGuardado(dameStorage) {
  const storage = () => { try { return dameStorage(); } catch (e) { return null; } };
  return {
    leer() {
      try {
        const v = JSON.parse(storage().getItem(CLAVE));
        return v && typeof v === 'object' ? v : {};
      } catch (e) { return {}; }
    },
    escribir(datos) {
      try { storage().setItem(CLAVE, JSON.stringify(Object.assign({}, datos, { version: 1 }))); } catch (e) { /* sin guardado: se sigue jugando igual */ }
    }
  };
}

/* Solo se guarda la mejor marca de cada nivel. */
export function sumarEstrellas(datos, id, estrellas) {
  const antes = (datos.estrellas && datos.estrellas[id]) || 0;
  return Object.assign({}, datos, { estrellas: Object.assign({}, datos.estrellas, { [id]: Math.max(antes, estrellas) }) });
}

export const Guardado = crearGuardado(() => window.localStorage);
