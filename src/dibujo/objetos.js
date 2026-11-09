/* Entradas, camiones, destinos de energía, tachos, pilares, módulos y la técnica de mantenimiento. */
import { rr } from './util.js';
import { drawItem } from './piezas.js';
import { TRUCKC } from '../datos/colores.js';
import { reduce } from './comun.js';

export function drawSource(c,kind,pulse,sv){
  c.fillStyle='#38414c';rr(c,-0.45,-0.45,0.9,0.9,0.07);c.fill();
  const ext=sv&&sv.ext;
  c.save();rr(c,-0.45,-0.45,0.9,0.17,0.07);c.clip();c.fillStyle=ext?'#3f7fd1':'#f2b632';c.fillRect(-0.5,-0.5,1,0.3);
  c.fillStyle=ext?'#ece6d8':'#14181d';for(let i=-1;i<8;i++){const x=-0.55+i*0.16;c.beginPath();c.moveTo(x,-0.45);c.lineTo(x+0.08,-0.45);c.lineTo(x+0.0,-0.28);c.lineTo(x-0.08,-0.28);c.closePath();c.fill();}
  c.restore();
  c.fillStyle='#20262e';rr(c,-0.36,-0.22,0.72,0.58,0.05);c.fill();
  c.save();c.translate(0,0.1+(pulse||0)*0.03);c.scale(0.72,0.72);
  if(['cera','lena','carbon','gas','uranio'].includes(kind)){c.save();c.translate(-0.08,0.1);c.scale(.7,.7);drawItem(c,{kind});c.restore();c.save();c.translate(0.1,0.12);c.scale(.7,.7);drawItem(c,{kind});c.restore();c.save();c.translate(0.01,-0.05);c.scale(.7,.7);drawItem(c,{kind});c.restore();}
  else if(kind==='agua'){c.fillStyle='#2b5d9e';c.fillRect(-0.36,-0.1,0.72,0.42);c.strokeStyle='#9fd0ee';c.lineWidth=0.03;for(const y of[0,0.12,0.24]){c.beginPath();for(let x=-0.34;x<=0.34;x+=0.04)c.lineTo(x,y+Math.sin(x*18+performance.now()/300)*0.025);c.stroke();}}
  else if(kind==='luzSol'){c.fillStyle='#f2c84b';c.beginPath();c.arc(0,0.08,0.16,0,7);c.fill();c.strokeStyle='#f2c84b';c.lineWidth=0.03;for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(Math.cos(a)*0.21,0.08+Math.sin(a)*0.21);c.lineTo(Math.cos(a)*0.29,0.08+Math.sin(a)*0.29);c.stroke();}}
  else if(kind==='viento'){c.save();c.translate(0,0.08);drawItem(c,{kind:'viento'});c.restore();}
  else if(kind==='elec'){c.save();c.translate(0,0.08);drawItem(c,{kind:'elec'});c.restore();}
  else if(kind==='mezcla'){const mk=(sv&&sv.mix)?sv.mix.map(m=>m[0]):['papel','pet'];
    c.fillStyle='#3f9e5a';c.beginPath();c.moveTo(-0.3,0.3);c.lineTo(-0.26,-0.12);c.lineTo(0.26,-0.12);c.lineTo(0.3,0.3);c.closePath();c.fill();
    c.save();c.translate(-0.08,-0.12);c.scale(0.45,0.45);drawItem(c,{kind:mk[0]});c.restore();if(mk[1]){c.save();c.translate(0.12,-0.14);c.scale(0.45,0.45);drawItem(c,{kind:mk[1]});c.restore();}
    c.fillStyle='#2f6b46';c.fillRect(-0.26,-0.14,0.52,0.05);}
  else if(kind==='tronco'){const tg=sv&&sv.tags;c.save();c.translate(0,0.12);drawItem(c,{kind:'tronco',tag:tg?'amarillo':null});c.restore();c.save();c.translate(0.02,-0.1);drawItem(c,{kind:'tronco',tag:tg?'azul':null});c.restore();}
  else if(kind==='tabla'){const s1=sv||{};const a={kind:'tabla',steps:s1.pre||[],wood:s1.wood||'pino',tag:s1.tags&&!(s1.wood==='roble')?'azul':null},b={kind:'tabla',steps:s1.pre||[],wood:s1.woods?'roble':(s1.wood||'pino'),tag:s1.tags&&!s1.woods&&s1.wood!=='roble'?'amarillo':null};
    c.save();c.translate(0,0.13);drawItem(c,a);c.restore();c.save();c.translate(0.03,-0.1);drawItem(c,b);c.restore();}
  else if(kind==='clavos')drawItem(c,{kind:'clavos',steps:[]});
  else{c.save();c.translate(0,0.12);drawItem(c,{kind,steps:[]});c.restore();c.save();c.translate(0.02,-0.1);drawItem(c,{kind,steps:[]});c.restore();}
  c.restore();
  c.fillStyle='#14181d';c.fillRect(0.42,-0.16,0.08,0.32);
}
export function drawTruck(c,count,N,bump,want){
  const b=bump||0;
  c.fillStyle='#14181d';c.globalAlpha=.35;c.beginPath();c.ellipse(0,0.33,0.46,0.06,0,0,7);c.fill();c.globalAlpha=1;
  c.fillStyle='#ddd5c3';rr(c,-0.47,-0.32-b*0.03,0.62,0.5,0.04);c.fill();
  if(want){c.fillStyle=TRUCKC[want];c.fillRect(-0.47,0.02-b*0.03,0.62,0.16);c.fillStyle=TRUCKC[want];rr(c,0.15,-0.13,0.31,0.31,0.05);}
  else{c.fillStyle='#c9c0ab';c.fillRect(-0.47,0.06-b*0.03,0.62,0.06);}
  if(!want){c.fillStyle='#f2b632';rr(c,0.15,-0.13,0.31,0.31,0.05);}c.fill();
  c.fillStyle='#9cc3dc';rr(c,0.25,-0.09,0.15,0.11,0.02);c.fill();
  c.fillStyle='#1a1d22';for(const x of [-0.3,0.0,0.31]){c.beginPath();c.arc(x,0.22,0.085,0,7);c.fill();}
  c.fillStyle='#8a939d';for(const x of [-0.3,0.0,0.31]){c.beginPath();c.arc(x,0.22,0.035,0,7);c.fill();}
}
export function drawBin(c){
  c.fillStyle='#4b5560';rr(c,-0.3,-0.28,0.6,0.64,0.07);c.fill();
  c.fillStyle='#e8665a';c.fillRect(-0.3,-0.06,0.6,0.07);
  c.fillStyle='#5f6b77';c.fillRect(-0.3,0.17,0.6,0.04);
  c.fillStyle='#1d2228';c.beginPath();c.ellipse(0,-0.28,0.3,0.08,0,0,7);c.fill();
  c.save();c.translate(0.05,-0.33);c.rotate(-0.5);c.fillStyle='#8a5629';c.fillRect(-0.16,-0.03,0.26,0.06);c.restore();
}
export function drawPillar(c){
  c.save();rr(c,-0.42,-0.42,0.84,0.84,0.05);c.clip();
  c.fillStyle='#f2b632';c.fillRect(-0.5,-0.5,1,1);c.strokeStyle='#14181d';c.lineWidth=0.09;
  for(let i=-6;i<6;i++){c.beginPath();c.moveTo(i*0.18-0.5,0.5);c.lineTo(i*0.18+0.5,-0.5);c.stroke();}
  c.restore();
  c.fillStyle='#5b6470';rr(c,-0.32,-0.32,0.64,0.64,0.04);c.fill();
  c.fillStyle='#4c5560';c.fillRect(-0.32,0.12,0.64,0.2);
}
export function drawModule(c,m,cs,now){
  const x=m.x*cs+4,y=m.y*cs+4,w=m.w*cs-8,h=m.h*cs-8,roof=Math.min(h*0.32,cs*0.45);
  c.fillStyle='#4b5561';rr(c,x,y+roof*0.6,w,h-roof*0.6,6);c.fill();
  const n=Math.max(2,Math.round(w/(cs*0.5)));const tw=w/n;
  for(let i=0;i<n;i++){c.fillStyle='#5d6876';c.beginPath();c.moveTo(x+i*tw,y+roof);c.lineTo(x+i*tw,y);c.lineTo(x+(i+1)*tw,y+roof);c.closePath();c.fill();c.fillStyle='#9cc3dc';c.fillRect(x+i*tw+2,y+3,3,roof-6);}
  c.fillStyle='#3d4652';c.fillRect(x+w*0.72,y-cs*0.18,cs*0.12,cs*0.3);
  if(!reduce){c.fillStyle='rgba(200,205,210,.35)';for(let i=0;i<3;i++){const t=((now/1400)+i/3)%1;c.beginPath();c.arc(x+w*0.72+cs*0.06+t*cs*0.12,y-cs*0.2-t*cs*0.35,cs*(0.05+t*0.06),0,7);c.fill();}}
  const wy=y+h-cs*0.32;for(let i=0;i<n;i++){const on=0.6+0.4*Math.sin(now/500+i*1.3);c.fillStyle=`rgba(242,200,75,${on})`;c.fillRect(x+i*tw+tw*0.25,wy,tw*0.5,cs*0.14);}
  c.save();c.translate(x+w*0.38,y+roof+(h-roof)*0.38);c.fillStyle='#ece6d8';c.beginPath();c.arc(0,0,cs*0.3,0,7);c.fill();c.scale(cs*0.5,cs*0.5);drawItem(c,{kind:m.icon,steps:m.icon==='tabla'?['aserrar','cortar','lijar']:[]});c.restore();
  for(const oy of m.outs){const dy=(oy+0.5)*cs;c.fillStyle='#1b2026';c.fillRect(x+w-cs*0.16,dy-cs*0.2,cs*0.16,cs*0.4);c.fillStyle='#f2b632';c.beginPath();c.moveTo(x+w-cs*0.12,dy-cs*0.09);c.lineTo(x+w,dy);c.lineTo(x+w-cs*0.12,dy+cs*0.09);c.fill();}
}
export function drawTarget(c,look,lit,now){
  const L=Math.min(1,lit||0),win=`rgba(242,210,75,${0.25+0.7*L})`;
  if(look==='casa'){c.fillStyle='#c98e64';c.fillRect(-0.3,-0.08,0.6,0.38);c.fillStyle='#8a3b2a';c.beginPath();c.moveTo(-0.38,-0.06);c.lineTo(0,-0.4);c.lineTo(0.38,-0.06);c.closePath();c.fill();c.fillStyle=win;c.fillRect(-0.2,0.02,0.14,0.12);c.fillRect(0.06,0.02,0.14,0.12);c.fillStyle='#4a2b1d';c.fillRect(-0.05,0.14,0.1,0.16);}
  else if(look==='olla'){c.fillStyle='#545e6a';c.fillRect(-0.32,0.12,0.64,0.18);c.fillStyle='#8a939d';rr(c,-0.2,-0.12,0.4,0.24,0.04);c.fill();if(L>0){c.fillStyle='rgba(220,225,230,.7)';for(let i=0;i<3;i++){c.beginPath();c.arc(-0.1+i*0.1,-0.2-((now/700+i*0.3)%0.3)*0.4,0.04,0,7);c.fill();}}}
  else if(look==='molino'){c.fillStyle='#c98e64';c.fillRect(-0.18,-0.2,0.36,0.5);c.fillStyle='#8a3b2a';c.beginPath();c.moveTo(-0.24,-0.18);c.lineTo(0,-0.36);c.lineTo(0.24,-0.18);c.fill();c.save();c.translate(0,-0.12);c.rotate(L>0?now/500:0);c.strokeStyle='#ece6d8';c.lineWidth=0.05;for(let i=0;i<4;i++){c.rotate(Math.PI/2);c.beginPath();c.moveTo(0,0);c.lineTo(0.3,0);c.stroke();}c.restore();}
  else if(look==='barrio'){for(const[x,h]of[[-0.28,0.3],[-0.02,0.44],[0.22,0.34]]){c.fillStyle='#4b5561';c.fillRect(x-0.1,0.3-h,0.2,h);c.fillStyle=win;for(let y=0.3-h+0.06;y<0.26;y+=0.1)c.fillRect(x-0.06,y,0.12,0.05);}}
  else if(look==='fabricaE'||look==='plantaE'){c.fillStyle='#4b5561';c.fillRect(-0.34,-0.08,0.68,0.38);c.fillStyle='#5d6876';for(let i=0;i<3;i++){c.beginPath();c.moveTo(-0.34+i*0.227,-0.08);c.lineTo(-0.34+i*0.227,-0.28);c.lineTo(-0.34+(i+1)*0.227,-0.08);c.fill();}
    c.fillStyle=win;c.fillRect(-0.26,0.04,0.52,0.08);c.save();c.translate(0.18,0.2);c.scale(0.35,0.35);drawItem(c,{kind:look==='fabricaE'?'cajonera':'fardo',mat:'papel'});c.restore();}
}
export function drawPlano(c){
  c.fillStyle='#dfe9f5';rr(c,-0.32,-0.38,0.64,0.76,0.04);c.fill();c.strokeStyle='#3f7fd1';c.lineWidth=0.015;
  for(let i=-0.3;i<0.32;i+=0.1){c.beginPath();c.moveTo(-0.3,i);c.lineTo(0.3,i);c.stroke();}
  c.strokeStyle='#1d4f91';c.lineWidth=0.03;c.strokeRect(-0.2,-0.2,0.4,0.12);c.beginPath();c.moveTo(-0.15,-0.08);c.lineTo(-0.15,0.2);c.moveTo(0.15,-0.08);c.lineTo(0.15,0.2);c.stroke();
  c.fillStyle='#1d4f91';for(let i=0;i<3;i++)c.fillRect(-0.22,0.25+i*0.0,0.1+i*0.12,0.03);
}
export function drawTech(c,ph){
  const step=Math.sin(ph*10)*0.06;
  c.strokeStyle='#2b3440';c.lineWidth=0.07;c.lineCap='round';c.beginPath();c.moveTo(-0.04,0.12);c.lineTo(-0.08+step,0.34);c.moveTo(0.04,0.12);c.lineTo(0.08-step,0.34);c.stroke();
  c.fillStyle='#e8762e';rr(c,-0.13,-0.14,0.26,0.3,0.06);c.fill();c.fillStyle='#f2e14b';c.fillRect(-0.13,-0.02,0.26,0.04);
  c.fillStyle='#c98e64';c.beginPath();c.arc(0,-0.24,0.09,0,7);c.fill();
  c.fillStyle='#f2b632';c.beginPath();c.arc(0,-0.27,0.1,Math.PI,0);c.fill();c.fillRect(-0.12,-0.28,0.24,0.03);
  c.strokeStyle='#9aa3ad';c.lineWidth=0.035;c.beginPath();c.moveTo(0.13,-0.02);c.lineTo(0.24,-0.14);c.stroke();
}
