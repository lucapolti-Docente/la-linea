/* La partida en juego y el tamaño del tablero.
   Se exportan como variables "vivas": el motor, los generadores y el dibujo las leen,
   y solo se cambian con estas dos funciones. */
export let G = null;
export let W = 12, H = 7;

export function usarPartida(p) {
  G = p;
  if (p) { W = p.W; H = p.H; }
}

export function fijarTamano(w, h) {
  W = w; H = h;
}
