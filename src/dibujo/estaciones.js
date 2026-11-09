/* Estaciones: personas con su herramienta y máquinas, con sus flechas de salida. */
import { TX } from '../datos/textos.js';
import { rr, labelTxt } from './util.js';
import { drawItem } from './piezas.js';
import { STATIONS } from '../datos/estaciones.js';

export function drawArrow(c,dir,col){c.save();c.rotate(dir*Math.PI/2);c.fillStyle=col;c.strokeStyle='#14181d';c.lineWidth=0.025;c.beginPath();c.moveTo(0.3,-0.15);c.lineTo(0.49,0);c.lineTo(0.3,0.15);c.closePath();c.fill();c.stroke();c.restore();}
export function drawTool(c,tool,judge){
  c.lineCap='round';
  if(tool==='pencil'){c.rotate(-0.7);c.fillStyle='#f2c94c';c.fillRect(-0.02,-0.17,0.04,0.16);c.fillStyle='#e88aa0';c.fillRect(-0.02,-0.2,0.04,0.03);c.fillStyle='#e9d4ab';c.beginPath();c.moveTo(-0.02,-0.01);c.lineTo(0.02,-0.01);c.lineTo(0,0.035);c.closePath();c.fill();c.fillStyle='#2a2a2a';c.beginPath();c.moveTo(-0.007,0.02);c.lineTo(0.007,0.02);c.lineTo(0,0.035);c.fill();}
  else if(tool==='saw'){c.fillStyle='#c6cdd5';c.beginPath();c.moveTo(-0.01,-0.045);c.lineTo(0.25,-0.02);c.lineTo(0.25,0.03);c.lineTo(-0.01,0.05);c.closePath();c.fill();c.strokeStyle='#7d8791';c.lineWidth=0.012;c.beginPath();for(let x=0;x<0.24;x+=0.03){c.moveTo(x,0.048-x*0.07);c.lineTo(x+0.015,0.065-x*0.07);}c.stroke();c.fillStyle='#7a4a26';rr(c,-0.1,-0.055,0.09,0.11,0.025);c.fill();}
  else if(tool==='sand'){c.fillStyle='#8a5a32';rr(c,-0.09,-0.06,0.18,0.07,0.015);c.fill();c.fillStyle='#d9964a';c.fillRect(-0.09,0.01,0.18,0.03);}
  else if(tool==='hammer'){c.strokeStyle='#8a5a32';c.lineWidth=0.04;c.beginPath();c.moveTo(0,0.05);c.lineTo(0,-0.16);c.stroke();c.fillStyle='#a0a9b3';rr(c,-0.08,-0.21,0.16,0.06,0.012);c.fill();}
  else if(tool==='glove'){c.fillStyle='#4f9e5a';rr(c,-0.06,-0.08,0.12,0.12,0.04);c.fill();c.fillRect(-0.06,-0.14,0.03,0.07);c.fillRect(-0.02,-0.15,0.03,0.08);c.fillRect(0.02,-0.14,0.03,0.07);if(judge){c.fillStyle=judge==='ok'?'#6cc98a':'#e8665a';c.beginPath();c.arc(0.1,-0.16,0.05,0,7);c.fill();}}
  else if(tool==='lens'){c.strokeStyle='#6a5236';c.lineWidth=0.035;c.beginPath();c.moveTo(0.03,0.02);c.lineTo(0.09,0.1);c.stroke();c.fillStyle=judge==='ok'?'rgba(108,201,138,.75)':judge==='bad'?'rgba(232,102,90,.8)':'rgba(170,210,235,.35)';c.beginPath();c.arc(-0.02,-0.04,0.07,0,7);c.fill();c.strokeStyle='#d4dae1';c.lineWidth=0.024;c.stroke();}
}
export function drawMachine(c,type,dir,o){
  const def=STATIONS[type],m=def.machine,ph=o.phase||0,w=o.working;
  if(m==='scan'||m==='thermo'){
    // arco del sensor
    c.fillStyle='#4b5561';c.fillRect(-0.36,-0.22,0.09,0.5);c.fillRect(0.27,-0.22,0.09,0.5);
    c.fillStyle='#2a3038';c.fillRect(-0.36,0.22,0.72,0.06);
    if(o.item){c.save();c.translate(0,0.04);c.scale(0.55,0.55);drawItem(c,o.item);c.restore();}
    const by=w?-0.12+((Math.sin(ph*7)+1)/2)*0.3:0.04;
    c.strokeStyle=o.judge==='ok'?'#6cc98a':o.judge==='bad'?'#e8665a':'rgba(120,210,240,.85)';c.lineWidth=0.025;c.beginPath();c.moveTo(-0.27,by);c.lineTo(0.27,by);c.stroke();
    c.fillStyle='#ece6d8';rr(c,-0.42,-0.45,0.84,0.23,0.04);c.fill();c.strokeStyle='#14181d';c.lineWidth=0.02;c.stroke();
    if(m==='thermo'){c.fillStyle='#b2402f';c.fillRect(-0.36,-0.42,0.03,0.15);c.beginPath();c.arc(-0.345,-0.27,0.035,0,7);c.fill();}
    labelTxt(c,def.thr?`¿<${o.thr??80}°?`:def.q,0.03,-0.333,0.15,def.qc);
    return;
  }
  // gabinete
  c.fillStyle='#6b7581';rr(c,-0.36,-0.32,0.72,0.6,0.06);c.fill();
  c.fillStyle='#545e6a';c.fillRect(-0.36,0.12,0.72,0.12);
  c.fillStyle='#f2b632';c.fillRect(-0.36,0.21,0.72,0.035);
  if(def.paint){c.fillStyle=def.paint;c.fillRect(-0.3,0.14,0.36,0.06);}
  // ventana
  c.fillStyle=m==='oven'?(w?`rgba(232,120,50,${0.55+0.25*Math.sin(ph*6)})`:'#4a2b1d'):'#1b2026';rr(c,-0.27,-0.2,0.54,0.3,0.04);c.fill();
  if(o.item){c.save();c.beginPath();c.rect(-0.27,-0.2,0.54,0.3);c.clip();c.translate(0,-0.05);c.scale(0.55,0.55);drawItem(c,o.item);c.restore();}
  if(m==='paint'&&w){c.fillStyle=def.paint;c.globalAlpha=.6;for(let i=0;i<6;i++){const a=ph*9+i*1.7;c.beginPath();c.arc(Math.sin(a)*0.18,-0.12+((i*0.05+ph)%0.2),0.02,0,7);c.fill();}c.globalAlpha=1;}
  c.fillStyle=w?'#6cc98a':'#33413a';c.beginPath();c.arc(0.27,0.18,0.03,0,7);c.fill();
  if(def.combine&&!def.machine?false:(def.combine&&m!=='arm'&&o.buf)){const ks=Object.keys(def.combine);ks.forEach((k,i)=>{labelTxt(c,`${o.buf[k]||0}/${def.combine[k]}`,-0.15+i*0.3,0.18,0.12,'#ece6d8');});}
  if(m==='arm'){
    const a1=w?-0.9+Math.sin(ph*5)*0.5:-0.9,a2=w?1.2+Math.cos(ph*5)*0.6:1.3;
    const sx=-0.18,sy=-0.28,ex=sx+Math.cos(a1)*0.22,ey=sy+Math.sin(a1)*0.22,gx=ex+Math.cos(a1+a2)*0.2,gy=ey+Math.sin(a1+a2)*0.2;
    c.lineCap='round';c.strokeStyle='#e08a2e';c.lineWidth=0.075;c.beginPath();c.moveTo(sx,sy);c.lineTo(ex,ey);c.lineTo(gx,gy);c.stroke();
    c.fillStyle='#3d4652';for(const[x,y]of[[sx,sy],[ex,ey]]){c.beginPath();c.arc(x,y,0.04,0,7);c.fill();}
    c.strokeStyle='#c3ccd6';c.lineWidth=0.025;c.beginPath();c.moveTo(gx-0.04,gy);c.lineTo(gx-0.05,gy+0.06);c.moveTo(gx+0.04,gy);c.lineTo(gx+0.05,gy+0.06);c.stroke();
    if(o.buf&&def.combine){const ks=Object.keys(def.combine);ks.forEach((k,i)=>{const x=-0.2+i*0.3;c.save();c.translate(x-0.08,0.2);c.scale(0.22,0.22);drawItem(c,{kind:k,steps:[]});c.restore();labelTxt(c,`${o.buf[k]||0}/${def.combine[k]}`,x+0.08,0.2,0.11,'#ece6d8');});}
  }
  if(m==='weld'){c.fillStyle='#3d4652';c.fillRect(0.02,-0.44,0.06,0.16);c.fillStyle='#c3ccd6';c.beginPath();c.moveTo(0.05,-0.28);c.lineTo(0.0,-0.2);c.lineTo(0.1,-0.2);c.fill();
    if(w){c.fillStyle='#ffe08a';for(let i=0;i<7;i++){const a=ph*11+i*0.9,d=0.05+((i*0.07+ph*3)%0.18);c.beginPath();c.arc(0.05+Math.cos(a)*d,-0.15+Math.sin(a)*d,0.014,0,7);c.fill();}c.fillStyle='rgba(180,220,255,.9)';c.beginPath();c.arc(0.05,-0.17,0.03,0,7);c.fill();}}
  if(m==='fan'){c.save();c.translate(0,-0.36);c.fillStyle='#3d4652';c.beginPath();c.arc(0,0,0.11,0,7);c.fill();c.rotate(w?ph*16:0.4);c.fillStyle='#9cc3dc';for(let i=0;i<4;i++){c.rotate(Math.PI/2);c.beginPath();c.ellipse(0.05,0,0.05,0.022,0,0,7);c.fill();}c.restore();
    c.fillStyle='rgba(120,190,240,.25)';rr(c,-0.27,-0.2,0.54,0.3,0.04);c.fill();}
  if(m==='saw'){c.save();c.translate(-0.12,-0.34);c.rotate(w?ph*14:0.3);c.fillStyle=def.metal?'#9cc3dc':'#c6cdd5';c.beginPath();for(let i=0;i<20;i++){const a=i*Math.PI/10,r=i%2?0.11:0.135;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();c.fillStyle='#545e6a';c.beginPath();c.arc(0,0,0.035,0,7);c.fill();c.restore();}
  else if(m==='sander'){const sx=w?Math.sin(ph*16)*0.05:0;c.fillStyle='#545e6a';c.fillRect(-0.04,-0.4,0.08,0.09);c.fillStyle='#8a5a32';rr(c,-0.17+sx,-0.44,0.34,0.07,0.02);c.fill();c.fillStyle='#d9964a';c.fillRect(-0.17+sx,-0.385,0.34,0.025);}
  else if(m==='paint'){c.fillStyle='#545e6a';c.fillRect(-0.05,-0.42,0.1,0.11);c.fillStyle=def.paint;c.beginPath();c.arc(0,-0.42,0.06,Math.PI,0);c.fill();}
  else if(m==='oven'){c.fillStyle='#545e6a';c.fillRect(0.1,-0.45,0.1,0.14);if(w){c.strokeStyle='rgba(240,170,110,.8)';c.lineWidth=0.02;for(const x of[0.12,0.18]){c.beginPath();c.moveTo(x,-0.47);c.quadraticCurveTo(x+0.04,-0.5+Math.sin(ph*5)*0.02,x,-0.53);c.stroke();}}
    c.fillStyle='#ece6d8';c.fillRect(-0.3,-0.42,0.04,0.1);c.fillStyle='#e8665a';c.fillRect(-0.29,-0.39,0.02,0.07);}
  else if(m==='candle'){c.fillStyle='#f3efe4';c.fillRect(-0.05,-0.42,0.1,0.18);const f=w?Math.sin(ph*14)*0.02:0;c.fillStyle='#f2c84b';c.beginPath();c.moveTo(0,-0.56+f);c.quadraticCurveTo(0.06,-0.47,0,-0.43);c.quadraticCurveTo(-0.06,-0.47,0,-0.56+f);c.fill();}
  else if(m==='fire'){for(let i=0;i<3;i++){const f=w?Math.sin(ph*12+i)*0.03:0;c.fillStyle=i===1?'#f2c84b':'#e8762e';c.beginPath();c.moveTo(-0.12+i*0.12,-0.3);c.quadraticCurveTo(-0.08+i*0.12,-0.46+f,-0.12+i*0.12+0.02,-0.5+f);c.quadraticCurveTo(-0.02+i*0.12,-0.4,-0.04+i*0.12,-0.3);c.fill();}}
  else if(m==='wheel'||m==='windmill'||m==='gen'||m==='motor'||m==='steam'){c.save();c.translate(0,-0.36);c.rotate(w?ph*6:0);
    if(m==='windmill'){c.fillStyle='#ece6d8';for(let i=0;i<3;i++){c.rotate(Math.PI*2/3);c.beginPath();c.ellipse(0.1,0,0.1,0.03,0,0,7);c.fill();}}
    else{c.strokeStyle=m==='wheel'?'#6b4325':'#9aa3ad';c.lineWidth=0.03;c.beginPath();c.arc(0,0,0.1,0,7);c.stroke();for(let i=0;i<6;i++){c.rotate(Math.PI/3);c.beginPath();c.moveTo(0,0);c.lineTo(0.12,0);c.stroke();}}
    c.restore();if(m==='gen'){c.fillStyle='#f2b632';c.beginPath();c.moveTo(0.2,-0.46);c.lineTo(0.15,-0.38);c.lineTo(0.19,-0.38);c.lineTo(0.15,-0.3);c.lineTo(0.24,-0.4);c.lineTo(0.2,-0.4);c.closePath();c.fill();}
    if(m==='steam'&&w){c.fillStyle='rgba(220,225,230,.6)';for(let i=0;i<3;i++){c.beginPath();c.arc(0.18+i*0.04,-0.44-((ph+i*0.3)%0.4)*0.2,0.03+i*0.01,0,7);c.fill();}}}
  else if(m==='boiler'){c.fillStyle=w?`rgba(232,118,46,${0.6+0.3*Math.sin(ph*6)})`:'#5a3b22';rr(c,-0.27,-0.2,0.54,0.3,0.04);c.fill();c.fillStyle='#545e6a';c.fillRect(0.08,-0.46,0.1,0.14);}
  else if(m==='lamp'){c.fillStyle=w?'#fff3b0':'#9aa3ad';c.beginPath();c.arc(0,-0.38,0.09,0,7);c.fill();c.fillStyle='#545e6a';c.fillRect(-0.04,-0.3,0.08,0.06);}
  else if(m==='heater'){c.strokeStyle=w?'#e8762e':'#9aa3ad';c.lineWidth=0.03;c.beginPath();for(let x=-0.16;x<=0.16;x+=0.04)c.lineTo(x,-0.38+((x*25|0)%2?0.05:-0.05));c.stroke();}
  else if(m==='trafo'){const up=def.up;c.fillStyle='#545e6a';c.fillRect(-0.18,-0.46,0.36,0.14);c.strokeStyle='#c56cf0';c.lineWidth=0.025;for(let i=0;i<4;i++){c.beginPath();c.arc(-0.1+i*0.07,-0.39,0.03,0,7);c.stroke();}labelTxt(c,up?'▲ AT':'▼ BT',0,-0.12,0.12,up?'#e3b5f7':'#f2d24b');}
  else if(m==='reactor'){c.fillStyle='#545e6a';c.beginPath();c.moveTo(-0.16,-0.3);c.quadraticCurveTo(-0.12,-0.5,0,-0.5);c.quadraticCurveTo(0.12,-0.5,0.16,-0.3);c.closePath();c.fill();c.fillStyle=w?'rgba(108,201,138,.8)':'#2f6b46';rr(c,-0.27,-0.2,0.54,0.3,0.04);c.fill();}
  else if(m==='panel'){c.fillStyle='#2b5d9e';c.beginPath();c.moveTo(-0.24,-0.3);c.lineTo(0.24,-0.3);c.lineTo(0.18,-0.46);c.lineTo(-0.18,-0.46);c.closePath();c.fill();c.strokeStyle='#9fd0ee';c.lineWidth=0.012;for(let x=-0.12;x<=0.12;x+=0.08){c.beginPath();c.moveTo(x,-0.3);c.lineTo(x*0.8,-0.46);c.stroke();}}
  else if(m==='battery'){c.fillStyle='#3d4652';rr(c,-0.14,-0.48,0.28,0.18,0.03);c.fill();c.fillStyle='#6cc98a';c.fillRect(-0.03,-0.52,0.06,0.04);}
  else if(m==='press'){const py=w?-0.1+Math.abs(Math.sin(ph*4))*0.12:-0.1;c.fillStyle='#3d4652';c.fillRect(-0.03,-0.46,0.06,0.2);c.fillStyle='#e8665a';c.fillRect(-0.22,py-0.08,0.44,0.06);
    if(o.bufN!==undefined)labelTxt(c,`${o.bufN}/4`,0,0.18,0.14,'#ece6d8');}
  else if(m==='magnet'){c.save();c.translate(0,-0.36);c.strokeStyle='#e8665a';c.lineWidth=0.08;c.beginPath();c.arc(0,0,0.12,Math.PI,0);c.stroke();c.fillStyle='#c3ccd6';c.fillRect(-0.16,-0.01,0.08,0.06);c.fillRect(0.08,-0.01,0.08,0.06);c.restore();
    if(w){c.strokeStyle='rgba(232,102,90,.6)';c.lineWidth=0.015;for(const r of[0.18,0.24]){c.beginPath();c.arc(0,-0.3,r,0.3,Math.PI-0.3);c.stroke();}}}
  else if(m==='eddy'){c.save();c.translate(0,-0.36);c.fillStyle='#545e6a';c.beginPath();c.arc(0,0,0.1,0,7);c.fill();c.rotate(w?ph*20:0);c.fillStyle='#e8665a';c.fillRect(-0.09,-0.02,0.18,0.04);c.fillStyle='#3f7fd1';c.fillRect(-0.02,-0.09,0.04,0.18);c.restore();
    if(w){c.strokeStyle='#f2e14b';c.lineWidth=0.02;c.beginPath();c.moveTo(0.15,-0.42);c.lineTo(0.2,-0.36);c.lineTo(0.16,-0.35);c.lineTo(0.22,-0.28);c.stroke();}}
  else if(m==='blower'){c.fillStyle='#545e6a';c.fillRect(-0.24,-0.42,0.14,0.12);c.beginPath();c.moveTo(-0.1,-0.42);c.lineTo(0.02,-0.39);c.lineTo(0.02,-0.33);c.lineTo(-0.1,-0.3);c.fill();
    if(w){c.strokeStyle='rgba(200,230,255,.8)';c.lineWidth=0.02;for(let i=0;i<3;i++){const x=0.05+((ph*2+i*0.3)%0.3);c.beginPath();c.moveTo(x,-0.38+i*0.03);c.lineTo(x+0.1,-0.38+i*0.03);c.stroke();}}}
  else if(m==='crusher'){for(const x of[-0.1,0.1]){c.save();c.translate(x,-0.36);c.rotate((w?ph*8:0)*(x<0?1:-1));c.fillStyle='#8a939d';c.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6,r=i%2?0.07:0.1;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();c.restore();}}
  else if(m==='washer'){c.fillStyle='rgba(120,190,240,.35)';rr(c,-0.27,-0.2,0.54,0.3,0.04);c.fill();c.fillStyle='#545e6a';c.fillRect(-0.04,-0.44,0.08,0.12);
    if(w){c.fillStyle='rgba(200,230,255,.9)';for(let i=0;i<5;i++){c.beginPath();c.arc(-0.2+i*0.1,-0.12+Math.sin(ph*8+i)*0.05,0.025,0,7);c.fill();}}}
  else if(m==='extruder'){c.fillStyle='#545e6a';c.beginPath();c.moveTo(-0.15,-0.46);c.lineTo(0.15,-0.46);c.lineTo(0.05,-0.32);c.lineTo(-0.05,-0.32);c.closePath();c.fill();
    if(w){c.fillStyle='#9fd0ee';for(let i=0;i<3;i++){c.beginPath();c.arc(0.12+i*0.06,0.0+((ph*3+i*0.3)%0.2),0.025,0,7);c.fill();}}}
  else if(m==='compost'){c.fillStyle='#4a3220';rr(c,-0.27,-0.2,0.54,0.3,0.04);c.fill();c.strokeStyle='#4f9e5a';c.lineWidth=0.03;for(const x of[-0.15,0,0.15]){c.beginPath();c.moveTo(x,-0.2);c.quadraticCurveTo(x+0.05,-0.32,x+0.02,-0.4);c.stroke();}}
  else if(m==='pulper'){c.save();c.translate(0,-0.36);c.fillStyle='#b9bdc2';c.beginPath();c.ellipse(0,0,0.16,0.07,0,0,7);c.fill();c.strokeStyle='#5b6470';c.lineWidth=0.02;c.beginPath();c.arc(0,0,0.05+(w?Math.abs(Math.sin(ph*6))*0.04:0),0,5);c.stroke();c.restore();}
  else if(m==='foundry'){c.fillStyle=w?`rgba(255,140,50,${0.6+0.3*Math.sin(ph*6)})`:'#5a3b22';rr(c,-0.27,-0.2,0.54,0.3,0.04);c.fill();c.fillStyle='#3d4652';c.beginPath();c.moveTo(-0.12,-0.46);c.lineTo(0.12,-0.46);c.lineTo(0.08,-0.3);c.lineTo(-0.08,-0.3);c.closePath();c.fill();c.fillStyle='#ff9a3e';c.fillRect(-0.08,-0.46,0.16,0.04);}
  else if(m==='box'){c.fillStyle='#b98a52';c.beginPath();c.moveTo(-0.3,-0.32);c.lineTo(-0.2,-0.44);c.lineTo(-0.02,-0.44);c.lineTo(-0.02,-0.32);c.closePath();c.fill();c.beginPath();c.moveTo(0.3,-0.32);c.lineTo(0.2,-0.44);c.lineTo(0.02,-0.44);c.lineTo(0.02,-0.32);c.closePath();c.fill();}
}
export function drawStation(c,type,dir,o={}){
  const def=STATIONS[type];
  c.fillStyle=o.fixed?'#2e3741':'#343e4a';rr(c,-0.47,-0.47,0.94,0.94,0.08);c.fill();
  c.strokeStyle=o.fixed?'#4b5664':'rgba(242,182,50,.6)';c.lineWidth=0.022;c.stroke();
  if(o.fixed){c.fillStyle='#5d6876';for(const x of [-0.38,0.38])for(const y of [-0.38,0.38]){c.beginPath();c.arc(x,y,0.022,0,7);c.fill();}}
  if(!def.passive)drawArrow(c,dir,def.split?'#f2b632':'#6cc98a');
  const alt=o.alt??(dir+1)%4;
  if(def.sensor)drawArrow(c,alt,'#e8665a');
  if(def.split){drawArrow(c,alt,'#f2b632');c.fillStyle='#545e6a';rr(c,-0.3,-0.3,0.6,0.6,0.08);c.fill();
    const a=dir*Math.PI/2,b=alt*Math.PI/2,sw=o.phase?Math.sin(o.phase*6)*0.5+0.5:0.5;
    c.strokeStyle='#f2b632';c.lineWidth=0.07;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*0.24,Math.sin(a)*0.24);c.moveTo(0,0);c.lineTo(Math.cos(b)*0.24,Math.sin(b)*0.24);c.stroke();
    c.fillStyle='#ece6d8';c.beginPath();c.arc(0,0,0.08,0,7);c.fill();
    labelTxt(c,'1',Math.cos(a)*0.2+Math.cos(a+1.57)*0.1,Math.sin(a)*0.2+Math.sin(a+1.57)*0.1,0.13,'#ece6d8');labelTxt(c,'2',Math.cos(b)*0.2+Math.cos(b-1.57)*0.1,Math.sin(b)*0.2+Math.sin(b-1.57)*0.1,0.13,'#ece6d8');
    if(o.item){c.save();c.scale(0.4,0.4);drawItem(c,o.item);c.restore();}return;}
  if(def.machine==='presence'){
    c.fillStyle='#3d4652';rr(c,-0.08,-0.2,0.16,0.5,0.03);c.fill();c.fillStyle='#545e6a';rr(c,-0.22,0.26,0.44,0.1,0.03);c.fill();
    c.fillStyle='#f2b632';rr(c,-0.16,-0.36,0.32,0.2,0.05);c.fill();c.fillStyle='#e8665a';c.beginPath();c.arc(0,-0.26,0.05,0,7);c.fill();
    c.strokeStyle='rgba(242,182,50,.7)';c.lineWidth=0.025;for(const r of[0.26,0.36]){c.beginPath();c.arc(0,-0.26,r,-0.6,0.6);c.stroke();c.beginPath();c.arc(0,-0.26,r,Math.PI-0.6,Math.PI+0.6);c.stroke();}
    return;}
  if(def.machine){drawMachine(c,type,dir,o);
    if(def.timer){c.fillStyle='#ece6d8';c.beginPath();c.arc(0.27,-0.3,0.13,0,7);c.fill();c.strokeStyle='#1a1d22';c.lineWidth=0.02;c.stroke();labelTxt(c,def.unit==='sem'?`${o.time??1}s`:`${o.time??1}'`,0.27,-0.29,0.14,'#1a1d22');}
    if(o.lossFx&&performance.now()-o.lossFx<700){const k=(performance.now()-o.lossFx)/700;c.globalAlpha=1-k;c.fillStyle='#e8762e';c.beginPath();c.arc(0.25,-0.35-k*0.2,0.06+k*0.06,0,7);c.fill();labelTxt(c,TX.tablero.perdida,0.12,-0.48-k*0.15,0.1,'#ffb07a');c.globalAlpha=1;}
    if(def.battery){const ch=o.charge||0;c.fillStyle='#14181d';c.fillRect(-0.2,0.14,0.4,0.08);c.fillStyle='#6cc98a';c.fillRect(-0.2,0.14,0.4*ch/def.battery,0.08);labelTxt(c,`${ch}/${def.battery}`,0,0.3,0.11,'#ece6d8');}
    if(o.paused){c.fillStyle='rgba(242,182,50,.92)';c.beginPath();c.arc(0,-0.05,0.17,0,7);c.fill();c.fillStyle='#1a1d22';c.fillRect(-0.07,-0.13,0.05,0.16);c.fillRect(0.02,-0.13,0.05,0.16);}
    if(o.broken){c.strokeStyle='#e8665a';c.lineWidth=0.05;c.beginPath();c.moveTo(-0.25,-0.2);c.lineTo(-0.05,0);c.lineTo(-0.15,0.05);c.lineTo(0.2,0.2);c.stroke();
      c.fillStyle='rgba(120,125,130,.6)';for(const[x,y,r]of[[-0.1,-0.4,0.07],[0.05,-0.46,0.09],[0.18,-0.4,0.06]]){c.beginPath();c.arc(x,y,r,0,7);c.fill();}
      c.fillStyle='#e8665a';c.beginPath();c.arc(0.3,-0.3,0.11,0,7);c.fill();labelTxt(c,'!',0.3,-0.3,0.17,'#fff');}
    return;}
  const ph=o.phase||0,w=o.working;
  c.fillStyle=def.shirt;rr(c,-0.14,-0.16,0.28,0.25,0.07);c.fill();
  c.fillStyle='#e0b18a';c.beginPath();c.arc(0,-0.27,0.095,0,7);c.fill();
  c.fillStyle=def.hair;c.beginPath();c.arc(0,-0.285,0.098,Math.PI,0);c.fill();
  let hx=0.15,hy=-0.03;
  if(w){if(def.tool==='saw'||def.tool==='sand')hx+=Math.sin(ph*12)*0.07;else if(def.tool==='hammer')hy-=Math.abs(Math.sin(ph*9))*0.12;else if(def.tool==='pencil'){hx+=Math.sin(ph*16)*0.03;hy+=Math.cos(ph*16)*0.015;}else hx+=Math.sin(ph*4)*0.03;}
  c.strokeStyle='#e0b18a';c.lineWidth=0.055;c.lineCap='round';c.beginPath();c.moveTo(0.09,-0.1);c.lineTo(hx,hy);c.moveTo(-0.09,-0.1);c.lineTo(-0.16,0.02);c.stroke();
  if(o.broken){
    c.fillStyle='#6b4325';c.save();c.translate(-0.33,0.25);c.rotate(-0.5);c.fillRect(-0.025,-0.11,0.05,0.22);c.restore();c.save();c.translate(0.33,0.27);c.rotate(0.6);c.fillRect(-0.025,-0.1,0.05,0.2);c.restore();
    c.fillStyle='#9a6537';c.save();c.translate(-0.22,0.15);c.rotate(0.35);rr(c,-0.21,-0.05,0.42,0.1,0.02);c.fill();c.restore();
    c.save();c.translate(0.22,0.17);c.rotate(-0.4);rr(c,-0.2,-0.05,0.4,0.1,0.02);c.fill();c.restore();
    c.save();c.translate(0.02,0.22);c.scale(0.5,0.5);drawItem(c,{kind:'tronco'});c.restore();
    c.fillStyle='#e8665a';c.beginPath();c.arc(0.3,-0.3,0.11,0,7);c.fill();labelTxt(c,'!',0.3,-0.3,0.17,'#fff');
  }else{
  c.fillStyle='#6b4325';c.fillRect(-0.38,0.14,0.05,0.22);c.fillRect(0.33,0.14,0.05,0.22);
  c.fillStyle='#9a6537';rr(c,-0.42,0.04,0.84,0.11,0.02);c.fill();
  c.fillStyle='#b77a45';c.fillRect(-0.42,0.04,0.84,0.025);}
  if(o.item){c.save();c.translate(-0.06,-0.02);c.scale(0.6,0.6);drawItem(c,o.item);c.restore();}
  if(o.buf){
    if(o.buf.tabla){c.save();c.translate(-0.17,-0.01);c.scale(0.45,0.45);drawItem(c,{kind:'tabla',steps:o.bufSteps||[],defect:false});c.restore();}
    if(o.buf.clavos){c.save();c.translate(0.24,-0.03);c.scale(0.45,0.45);drawItem(c,{kind:'clavos',steps:[]});c.restore();}
  }
  c.save();c.translate(hx,hy);drawTool(c,def.tool,o.judge);c.restore();
}
