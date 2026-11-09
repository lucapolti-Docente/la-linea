/* npm run capturas:comparar — compara píxel a píxel pruebas/base/*.png con pruebas/nuevo/*.png
   y escribe en pruebas/dif/ una imagen con las diferencias en rojo. Sin dependencias. */
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

const [base = 'pruebas/base', nuevo = 'pruebas/nuevo', dif = 'pruebas/dif'] = process.argv.slice(2);

function leerPNG(archivo) {
  const b = fs.readFileSync(archivo);
  let p = 8, w = 0, h = 0, tipo = 0; const datos = [];
  while (p < b.length) {
    const largo = b.readUInt32BE(p), nombre = b.toString('ascii', p + 4, p + 8), cuerpo = b.subarray(p + 8, p + 8 + largo);
    if (nombre === 'IHDR') { w = cuerpo.readUInt32BE(0); h = cuerpo.readUInt32BE(4); tipo = cuerpo[9]; if (cuerpo[8] !== 8) throw new Error('Solo PNG de 8 bits'); }
    if (nombre === 'IDAT') datos.push(cuerpo);
    p += 12 + largo;
  }
  const bpp = tipo === 6 ? 4 : tipo === 2 ? 3 : 0; if (!bpp) throw new Error('Tipo de PNG no soportado: ' + tipo);
  const crudo = zlib.inflateSync(Buffer.concat(datos)), fila = w * bpp, px = Buffer.alloc(w * h * 4);
  let prev = Buffer.alloc(fila);
  for (let y = 0; y < h; y++) {
    const f = crudo[y * (fila + 1)], lin = Buffer.from(crudo.subarray(y * (fila + 1) + 1, (y + 1) * (fila + 1)));
    for (let i = 0; i < fila; i++) {
      const a = i >= bpp ? lin[i - bpp] : 0, u = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      const pa = Math.abs(u - c), pb = Math.abs(a - c), pc = Math.abs(a + u - 2 * c);
      lin[i] = (lin[i] + [0, a, u, (a + u) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? u : c][f]) & 255;
    }
    for (let x = 0; x < w; x++) for (let k = 0; k < 4; k++) px[(y * w + x) * 4 + k] = k < bpp ? lin[x * bpp + k] : 255;
    prev = lin;
  }
  return { w, h, px };
}

function escribirPNG(archivo, w, h, px) {
  const crc = buf => { let c = ~0; for (const v of buf) { c ^= v; for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xEDB88320 : c >>> 1; } return ~c >>> 0; };
  const trozo = (n, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const t = Buffer.concat([Buffer.from(n), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(t)); return Buffer.concat([l, t, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const crudo = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) px.copy(crudo, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  fs.writeFileSync(archivo, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), trozo('IHDR', ihdr), trozo('IDAT', zlib.deflateSync(crudo)), trozo('IEND', Buffer.alloc(0))]));
}

fs.mkdirSync(dif, { recursive: true });
let iguales = 0;
for (const f of fs.readdirSync(base).filter(f => f.endsWith('.png')).sort()) {
  const n = path.join(nuevo, f);
  if (!fs.existsSync(n)) { console.log(`${f}: falta en ${nuevo}`); continue; }
  const A = leerPNG(path.join(base, f)), B = leerPNG(n);
  if (A.w !== B.w || A.h !== B.h) { console.log(`${f}: tamaño distinto ${A.w}x${A.h} / ${B.w}x${B.h}`); continue; }
  let distintos = 0; const out = Buffer.from(B.px);
  for (let i = 0; i < A.px.length; i += 4) {
    const d = Math.abs(A.px[i] - B.px[i]) + Math.abs(A.px[i + 1] - B.px[i + 1]) + Math.abs(A.px[i + 2] - B.px[i + 2]);
    if (d > 24) { distintos++; out[i] = 255; out[i + 1] = 0; out[i + 2] = 0; } else { out[i + 3] = 60; }
  }
  const pct = (100 * distintos / (A.w * A.h)).toFixed(2);
  if (distintos) escribirPNG(path.join(dif, f), A.w, A.h, out); else iguales++;
  console.log(`${distintos ? 'DISTINTA' : 'igual   '} ${f}${distintos ? `  ${distintos} px (${pct} %)` : ''}`);
}
console.log(`${iguales} iguales.`);
