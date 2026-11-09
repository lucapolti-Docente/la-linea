/* Ayudantes de dibujo: rectángulos redondeados, textos que no se deforman al escalar, íconos en canvas chicos. */
import { FONT_D } from './comun.js';

export function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
export function textU(c,t,x,y,size,col,s){c.save();c.scale(1/s,1/s);c.font=`800 ${Math.max(9,Math.round(size*s))}px ${FONT_D}`;c.textAlign='center';c.textBaseline='middle';c.fillStyle=col;c.fillText(t,x*s,y*s);c.restore();}
export function labelTxt(c,t,x,y,size,col){const s=Math.abs(c.getTransform().a)||1;c.save();c.scale(1/s,1/s);c.font=`800 ${Math.max(7,Math.round(size*s))}px ${FONT_D}`;c.textAlign='center';c.textBaseline='middle';c.fillStyle=col;c.fillText(t,x*s,y*s);c.restore();}
export function sparkle(c,x,y,s){c.beginPath();c.moveTo(x,y-s);c.lineTo(x+s*.3,y-s*.3);c.lineTo(x+s,y);c.lineTo(x+s*.3,y+s*.3);c.lineTo(x,y+s);c.lineTo(x-s*.3,y+s*.3);c.lineTo(x-s,y);c.lineTo(x-s*.3,y-s*.3);c.closePath();c.fill();}
export function knot(c,x,y){c.fillStyle='#43260f';c.beginPath();c.ellipse(x,y,0.045,0.033,0,0,7);c.fill();c.strokeStyle='#5e3a1e';c.lineWidth=0.016;c.beginPath();c.ellipse(x,y,0.075,0.058,0,0,7);c.stroke();}
export function paintIcon(cv,fn,size){const d=window.devicePixelRatio||1;cv.width=size*d;cv.height=size*d;const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,size,size);c.translate(size/2,size/2);c.scale(size,size);fn(c);}
export function starSvg(on,size=18){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z" fill="${on?'var(--accent)':'none'}" stroke="var(--accent)" stroke-width="1.6" stroke-linejoin="round"/></svg>`;}

