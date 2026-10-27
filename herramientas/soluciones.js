/* npm run soluciones: para cada nivel, cuántos programas posibles dan 0, 1, 2 y 3 estrellas
   (con el Repetir de la solución guardada). Sirve para ver si un nivel es muy fácil o muy difícil. */
import { NIVELES } from '../src/datos/niveles/index.js';
import { DATOS } from '../src/datos/index.js';
import { programas, jugar } from '../src/motor/index.js';

const filas = [];
for (const [modo, lista] of Object.entries(NIVELES)) {
  if (modo === 'libre') continue;
  lista.forEach((n, i) => {
    const cuenta = [0, 0, 0, 0];
    let falla = 0;
    for (const p of programas(n)) {
      const r = jugar(n, p, DATOS);
      cuenta[r.estrellas]++;
      if (r.fin === 'falla') falla++;
    }
    filas.push({ modo, n: i + 1, id: n.id, programas: cuenta.reduce((a, b) => a + b, 0), 'no funciona': falla, '0⭐': cuenta[0] - falla, '1⭐': cuenta[1], '2⭐': cuenta[2], '3⭐': cuenta[3] });
  });
}
console.table(filas);
