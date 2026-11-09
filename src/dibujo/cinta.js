/* Cintas transportadoras: rectas y curvas. Hay una sola forma de trazar cinta en todo el juego. */
import { DX, DY, tileAt } from '../motor/partida.js';
import { STATIONS } from '../datos/estaciones.js';

export function drawBelt(c,dir,phase,locked){
  c.save();c.rotate(dir*Math.PI/2);
  c.fillStyle='#3b444f';c.fillRect(-0.5,-0.38,1,0.76);
  c.fillStyle='#15191e';c.fillRect(-0.5,-0.3,1,0.6);
  c.save();c.beginPath();c.rect(-0.5,-0.3,1,0.6);c.clip();
  c.strokeStyle='#424d5a';c.lineWidth=0.06;c.lineCap='round';c.lineJoin='round';
  for(let i=0;i<5;i++){const x=-0.6+((i*0.25+phase)%1.25+1.25)%1.25;c.beginPath();c.moveTo(x-0.07,-0.17);c.lineTo(x+0.05,0);c.lineTo(x-0.07,0.17);c.stroke();}
  c.restore();
  c.fillStyle=locked?'#7c8794':'#55606c';
  for(const x of [-0.3,0.3])for(const y of [-0.34,0.34]){c.beginPath();c.arc(x,y,locked?0.028:0.018,0,7);c.fill();}
  c.restore();
}
export function drawBeltCurve(c,inDir,outDir,phase,locked){
  // en el marco rotado la salida es hacia la derecha; la entrada viene desde arriba (o desde abajo, espejado)
  c.save();c.rotate(outDir*Math.PI/2);
  if((inDir-outDir+4)%4===3)c.scale(1,-1);
  c.beginPath();c.rect(-0.5,-0.5,1,1);c.clip();
  const ring=(r1,r2)=>{c.beginPath();c.arc(0.5,-0.5,r2,Math.PI/2,Math.PI);c.arc(0.5,-0.5,r1,Math.PI,Math.PI/2,true);c.closePath();};
  c.fillStyle='#3b444f';ring(0.12,0.88);c.fill();
  c.fillStyle='#15191e';ring(0.2,0.8);c.fill();
  c.save();ring(0.2,0.8);c.clip();
  c.strokeStyle='#424d5a';c.lineWidth=0.06;c.lineCap='round';c.lineJoin='round';
  for(let i=0;i<4;i++){
    const s=((i*0.25+phase)%1+1)%1,a=Math.PI-s*Math.PI/2;
    c.save();c.translate(0.5+0.5*Math.cos(a),-0.5+0.5*Math.sin(a));c.rotate(Math.atan2(-Math.cos(a),Math.sin(a)));
    c.beginPath();c.moveTo(-0.07,-0.17);c.lineTo(0.05,0);c.lineTo(-0.07,0.17);c.stroke();c.restore();
  }
  c.restore();
  c.fillStyle=locked?'#7c8794':'#55606c';
  for(const a of [Math.PI*0.62,Math.PI*0.88]){c.beginPath();c.arc(0.5+0.84*Math.cos(a),-0.5+0.84*Math.sin(a),locked?0.028:0.018,0,7);c.fill();}
  c.restore();
}
export function beltInDir(x,y,t){
  // direcciones de movimiento de lo que alimenta esta cinta
  const ins=[];
  for(let d=0;d<4;d++){
    const n=tileAt(x-DX[d],y-DY[d]);if(!n)continue;
    if(n.t==='belt'&&n.dir===d)ins.push(d);
    else if(n.t==='source'&&d===0)ins.push(d);
    else if(n.t==='station'&&(n.dir===d||((STATIONS[n.type].sensor||STATIONS[n.type].split)&&n.alt===d)))ins.push(d);
  }
  if(ins.includes(t.dir)||ins.length!==1)return t.dir;
  return (ins[0]+2)%4===t.dir?t.dir:ins[0];
}
