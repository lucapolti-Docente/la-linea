/* Personajes originales (inventados). Se dibujan en src/dibujo/personajes.js a partir de estos datos.
   Variados en edad, piel y pelo, y sin estereotipos de oficio: una encargada de fábrica, un cocinero,
   un peluquero, una entrenadora, un bibliotecario, una huertera.
   piel, pelo (color), peinado: corto | rulos | rodete | colita | pelado | largo,
   ropa (color), extra: casco | gorro | silbato | tijera | anteojos | pañuelo | nada. */
export const PERSONAJES = {
  nora: { nombre: 'Nora', rol: 'Encargada de la fábrica', piel: '#8D5A3B', pelo: '#2B1B12', peinado: 'rodete', ropa: '#1F6FD1', extra: 'casco' },
  ramiro: { nombre: 'Ramiro', rol: 'Cocinero del comedor escolar', piel: '#F2C9A0', pelo: '#6B4226', peinado: 'corto', ropa: '#FFFFFF', extra: 'gorro' },
  marta: { nombre: 'Marta', rol: 'Huerta comunitaria', piel: '#C68B59', pelo: '#BDBDBD', peinado: 'colita', ropa: '#2F9E5B', extra: 'pañuelo' },
  joaquin: { nombre: 'Joaquín', rol: 'Biblioteca popular', piel: '#5C3A21', pelo: '#111111', peinado: 'rulos', ropa: '#7A3FC2', extra: 'anteojos' },
  vilma: { nombre: 'Vilma', rol: 'Entrenadora del club', piel: '#E8B48A', pelo: '#C0392B', peinado: 'corto', ropa: '#D9362B', extra: 'silbato' },
  tito: { nombre: 'Tito', rol: 'Peluquería Rulos', piel: '#A86B45', pelo: '#3B2A1A', peinado: 'pelado', ropa: '#E84F9A', extra: 'tijera' }
};

/* Quién da las indicaciones en la fábrica. */
export const ENCARGADA = 'nora';
