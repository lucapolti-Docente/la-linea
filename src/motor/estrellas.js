/* Estrellas: salen solo del tiempo.
   ⭐ pedido completo · ⭐⭐ antes de par×1,5 · ⭐⭐⭐ antes de par, con par = L.par + N × L.per. */
export const par = (L, N) => L.par + N * (L.per || 4);

export function estrellas(L, N, tick) {
  const p = par(L, N);
  return tick <= p ? 3 : tick <= p * 1.5 ? 2 : 1;
}
