/* La pieza es un objeto de estado plano: material, forma y propiedades (cortada, lisa, pintada, unida…),
   más la lista de defectos. Las condiciones de las reglas también son datos: { clave: valor } se cumple
   si coinciden todas las claves. true y false comparan "tiene" y "no tiene" (una clave que falta es false). */

export function cumple(pieza, cond) {
  for (const k in cond) {
    const v = cond[k], p = pieza[k];
    if (v === true ? !p : v === false ? !!p : p !== v) return false;
  }
  return true;
}

export const copiar = pieza => Object.assign({}, pieza, { defectos: (pieza.defectos || []).slice() });

export const crearPieza = base => copiar(Object.assign({}, base));
