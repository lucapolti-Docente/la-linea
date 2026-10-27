/* Íconos propios en SVG (no dependen de los emojis de la compu). Todos en un cuadro de 48 × 48,
   con contorno oscuro y colores planos, para que se vean en pantallas lavadas.
   Los de estaciones tienen el mismo id que la estación (src/datos/estaciones.js). */
export const TINTA = '#1E2430';
const L = 'stroke="' + TINTA + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';

const DIBUJOS = {
  /* Herramientas de mano */
  serrucho: `<path d="M6 30 L34 12 L40 20 L12 38 Z" fill="#C9D3DD" ${L}/><path d="M12 38 l2-4 l3 2 l2-4 l3 2 l2-4 l3 2 l2-4 l3 2 l2-4 l3 2" fill="none" ${L}/><rect x="33" y="6" width="11" height="16" rx="4" transform="rotate(-33 38 14)" fill="#E4572E" ${L}/>`,
  lija: `<rect x="8" y="14" width="32" height="22" rx="4" fill="#E9C46A" ${L}/><g fill="#B5892E"><circle cx="15" cy="21" r="1.6"/><circle cx="22" cy="27" r="1.6"/><circle cx="30" cy="20" r="1.6"/><circle cx="34" cy="29" r="1.6"/><circle cx="17" cy="30" r="1.6"/><circle cx="26" cy="19" r="1.6"/></g>`,
  pincel: `<rect x="20" y="4" width="8" height="20" rx="3" fill="#E4572E" ${L}/><rect x="18" y="23" width="12" height="7" fill="#C9D3DD" ${L}/><path d="M17 30 h14 l-2 12 q-5 4 -10 0 Z" fill="#2A9D8F" ${L}/>`,
  taladro: `<rect x="6" y="14" width="24" height="12" rx="4" fill="#F4A261" ${L}/><path d="M30 18 h8 v4 h-8" fill="#C9D3DD" ${L}/><path d="M38 20 h6" ${L}/><path d="M14 26 v14 h8 v-14" fill="#F4A261" ${L}/>`,
  clavos: `<rect x="8" y="8" width="22" height="11" rx="3" fill="#7A8696" ${L}/><rect x="17" y="18" width="6" height="24" rx="2" fill="#B5793F" ${L}/><path d="M36 22 v18 M32 22 h8" ${L}/>`,
  cola: `<path d="M14 18 h20 v22 q0 4 -4 4 h-12 q-4 0 -4 -4 Z" fill="#FFFFFF" ${L}/><path d="M20 18 v-6 h8 v6" fill="#F4A261" ${L}/><path d="M24 12 v-6" ${L}/><rect x="17" y="26" width="14" height="8" fill="#F4A261" ${L}/>`,
  soldadora: `<rect x="6" y="20" width="20" height="18" rx="3" fill="#F4A261" ${L}/><path d="M26 26 q8 -2 10 -10" fill="none" ${L}/><path d="M36 16 l6 -8" ${L}/><path d="M40 4 l-2 6 l5 -1 l-3 7" fill="#FFD23F" ${L}/><circle cx="16" cy="29" r="4" fill="#FFFFFF" ${L}/>`,
  /* Máquinas de la fábrica */
  sierra: `<rect x="4" y="30" width="40" height="12" rx="2" fill="#7A8696" ${L}/><circle cx="24" cy="24" r="13" fill="#C9D3DD" ${L}/><path d="M24 11 l3 -3 M37 24 l3 3 M24 37 l-3 3 M11 24 l-3 -3 M33 15 l4 -1 M33 33 l1 4 M15 33 l-4 1 M15 15 l-1 -4" ${L}/><circle cx="24" cy="24" r="3" fill="${TINTA}"/>`,
  lijadora: `<rect x="8" y="10" width="32" height="18" rx="5" fill="#F4A261" ${L}/><rect x="6" y="28" width="36" height="9" rx="2" fill="#E9C46A" ${L}/><path d="M18 10 v-5 h12 v5" fill="none" ${L}/><path d="M14 41 h4 M22 41 h4 M30 41 h4" ${L}/>`,
  pistola: `<rect x="16" y="12" width="14" height="28" rx="4" fill="#2A9D8F" ${L}/><rect x="19" y="5" width="8" height="7" fill="#C9D3DD" ${L}/><path d="M30 8 h4" ${L}/><g fill="#2A9D8F"><circle cx="39" cy="5" r="2"/><circle cx="42" cy="11" r="2"/><circle cx="38" cy="14" r="1.6"/></g><rect x="16" y="22" width="14" height="8" fill="#FFFFFF" ${L}/>`,
  sensor: `<rect x="6" y="6" width="22" height="16" rx="4" fill="#7A3FC2" ${L}/><circle cx="17" cy="14" r="4" fill="#FFD23F" ${L}/><path d="M17 22 L8 42 M17 22 L30 42" stroke="#FFD23F" stroke-width="3"/><path d="M34 18 l4 4 l6 -8" fill="none" stroke="#1E8F45" stroke-width="4" stroke-linecap="round"/>`,
  horno: `<rect x="6" y="8" width="36" height="32" rx="4" fill="#C9D3DD" ${L}/><rect x="11" y="16" width="26" height="18" rx="2" fill="#3B4252" ${L}/><path d="M24 31 q-6 -4 -2 -10 q1 4 4 3 q-1 -4 2 -6 q4 7 -4 13" fill="#FF7A1A"/><path d="M12 12 h4 M20 12 h4" ${L}/>`,
  molde: `<path d="M10 8 h12 v32 h-12 Z" fill="#9AA7B4" ${L}/><path d="M26 8 h12 v32 h-12 Z" fill="#9AA7B4" ${L}/><path d="M22 14 q-6 2 -6 8 v12 h6 M26 14 q6 2 6 8 v12 h-6" fill="#F28AB2" ${L}/>`,
  enfriador: `<rect x="6" y="6" width="36" height="36" rx="6" fill="#BFE3F5" ${L}/><path d="M24 12 v24 M14 18 l20 12 M34 18 l-20 12" stroke="#1F6FD1" stroke-width="4" stroke-linecap="round"/>`,
  desmoldar: `<path d="M17 18 q0 -4 4 -5 v-5 h6 v5 q4 1 4 5 v22 h-14 Z" fill="#F4F7FA" ${L}/><path d="M8 42 h32" ${L}/><path d="M38 30 v-18 M33 17 l5 -5 l5 5" fill="none" stroke="#1E8F45" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  llenar: `<path d="M8 6 h18 v8 h-8 v6" fill="none" ${L}/><path d="M18 22 q-4 6 0 8 q4 -2 0 -8" fill="#E84F9A" ${L}/><path d="M16 26 q0 -2 2 -3 v-1 M12 30 h20 v12 h-20 Z" fill="#F4F7FA" ${L}/><rect x="14" y="36" width="16" height="4" fill="#E84F9A"/>`,
  tapar: `<path d="M16 22 h16 v20 h-16 Z" fill="#F4F7FA" ${L}/><rect x="14" y="12" width="20" height="9" rx="2" fill="#D9362B" ${L}/><path d="M24 4 v6 M20 7 l4 4 l4 -4" fill="none" ${L}/>`,
  etiquetar: `<path d="M8 14 h22 l10 10 l-10 10 h-22 Z" fill="#FFD166" ${L}/><circle cx="30" cy="24" r="3" fill="#FFFFFF" ${L}/><path d="M13 20 h10 M13 28 h8" ${L}/>`,
  etiquetadora: `<path d="M4 10 h18 l8 8 l-8 8 h-18 Z" fill="#FFD166" ${L}/><path d="M9 15 h8" ${L}/><rect x="10" y="28" width="32" height="14" rx="3" fill="#7A8696" ${L}/><circle cx="20" cy="35" r="3" fill="#C9D3DD" ${L}/><circle cx="32" cy="35" r="3" fill="#C9D3DD" ${L}/>`,
  peso: `<path d="M14 18 h20 l6 24 h-32 Z" fill="#4E5D6C" ${L}/><circle cx="24" cy="12" r="5" fill="none" ${L}/><text x="24" y="36" text-anchor="middle" font-size="11" font-weight="bold" fill="#FFFFFF" font-family="Verdana,sans-serif">KG</text>`,
  /* Para la tarjeta del cliente y la interfaz */
  union: `<rect x="6" y="10" width="36" height="9" rx="2" fill="#D9A066" ${L}/><path d="M12 19 v22 M36 19 v22" stroke="${TINTA}" stroke-width="7" stroke-linecap="round"/><path d="M12 19 v22 M36 19 v22" stroke="#D9A066" stroke-width="3" stroke-linecap="round"/>`,
  repetir: `<path d="M10 22 a14 14 0 0 1 24 -9 l4 -5 v14 h-14 l5 -5 a8 8 0 0 0 -13 5" fill="#FF7A1A" ${L}/><path d="M38 26 a14 14 0 0 1 -24 9 l-4 5 v-14 h14 l-5 5 a8 8 0 0 0 13 -5" fill="#FF7A1A" ${L}/>`,
  menu: `<path d="M8 13 h32 M8 24 h32 M8 35 h32" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,
  casa: `<path d="M6 24 L24 8 L42 24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22 v18 h9 v-10 h6 v10 h9 v-18" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>`,
  producir: `<path d="M14 8 L40 24 L14 40 Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`,
  paso: `<path d="M8 10 L28 24 L8 38 Z" fill="currentColor"/><rect x="32" y="10" width="7" height="28" rx="2" fill="currentColor"/>`,
  vaciar: `<path d="M12 14 h24 l-2 28 h-20 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M8 14 h32 M19 14 v-5 h10 v5 M20 21 v14 M28 21 v14" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
  reloj: `<circle cx="24" cy="26" r="16" fill="#FFFFFF" ${L}/><path d="M24 26 V16 M24 26 l7 5" ${L}/><path d="M19 6 h10" ${L}/>`,
  caja: `<path d="M6 16 L24 8 L42 16 L24 24 Z" fill="#E9C46A" ${L}/><path d="M6 16 v20 l18 8 v-20 Z" fill="#D9A066" ${L}/><path d="M42 16 v20 l-18 8 v-20 Z" fill="#B5793F" ${L}/>`,
  reciclar: `<path d="M24 6 l8 12 h-6 l-2 -3 l-6 9 l-6 -4 Z M40 26 l-6 14 l-3 -5 h4 l-5 -9 l7 -3 Z M8 30 l14 0 l-3 5 l-3 -1 l-1 10 l-7 -1 Z" fill="#2F9E5B" ${L}/>`,
  parlante: `<path d="M8 18 h8 l10 -9 v30 l-10 -9 h-8 Z" fill="currentColor"/><path d="M32 16 q5 8 0 16 M37 11 q9 13 0 26" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
  mudo: `<path d="M8 18 h8 l10 -9 v30 l-10 -9 h-8 Z" fill="currentColor"/><path d="M32 18 l10 12 M42 18 l-10 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
  candado: `<rect x="10" y="20" width="28" height="22" rx="4" fill="#7A8696" ${L}/><path d="M16 20 v-6 a8 8 0 0 1 16 0 v6" fill="none" ${L}/>`,
  engranaje: `<path d="M24 4 l4 0 l1 6 l5 2 l5 -4 l3 3 l-4 5 l2 5 l6 1 v4 l-6 1 l-2 5 l4 5 l-3 3 l-5 -4 l-5 2 l-1 6 h-4 l-1 -6 l-5 -2 l-5 4 l-3 -3 l4 -5 l-2 -5 l-6 -1 v-4 l6 -1 l2 -5 l-4 -5 l3 -3 l5 4 l5 -2 Z" fill="#7A8696" ${L}/><circle cx="24" cy="24" r="6" fill="#FFFFFF" ${L}/>`,
  mano: `<path d="M14 42 v-14 l-4 -6 a3 3 0 0 1 5 -3 l3 4 v-15 a3 3 0 0 1 6 0 v12 v-14 a3 3 0 0 1 6 0 v14 v-11 a3 3 0 0 1 6 0 v24 q0 9 -9 9 Z" fill="#F2C9A0" ${L}/>`,
  estrella: `<path d="M24 4 l6 13 l14 1 l-11 9 l4 14 l-13 -8 l-13 8 l4 -14 l-11 -9 l14 -1 Z" fill="currentColor" stroke="${TINTA}" stroke-width="2.5" stroke-linejoin="round"/>`,
  tilde: `<path d="M8 26 l10 10 l22 -24" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  cruz: `<path d="M12 12 l24 24 M36 12 l-24 24" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>`,
  libre: `<circle cx="24" cy="24" r="18" fill="#FFD166" ${L}/><path d="M16 20 a3 3 0 1 1 0.1 0 M32 20 a3 3 0 1 1 0.1 0" ${L}/><path d="M14 28 q10 10 20 0" fill="none" ${L}/>`
};

/* Devuelve un <svg> listo para meter en un botón. */
export function icono(id, clase) {
  return '<svg class="icono ' + (clase || '') + '" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + (DIBUJOS[id] || DIBUJOS.caja) + '</svg>';
}

/* El dibujo suelto, para meterlo dentro de otro SVG. */
export const dibujoIcono = id => DIBUJOS[id] || DIBUJOS.caja;

export const hayIcono = id => !!DIBUJOS[id];
