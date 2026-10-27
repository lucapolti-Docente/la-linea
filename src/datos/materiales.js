/* Lo que entra a la cinta al principio de cada nivel: el material y cómo viene.
   Las propiedades son las mismas que usan las estaciones (ver estaciones.js). */
export const MATERIALES = {
  tabla: { material: 'madera', forma: 'tabla' },
  kit: { material: 'madera', forma: 'kit', patas: true },
  canos: { material: 'metal', forma: 'canos', patas: true, cortada: true, lisa: true },
  granos: { material: 'plastico', forma: 'granos' },
  envase: { material: 'plastico', forma: 'envase', moldeado: true, envase: true }
};
