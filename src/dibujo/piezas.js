/* Piezas que viajan por la cinta, de los tres mundos. */
import { rr, labelTxt, sparkle, knot } from './util.js';
import { TAGC } from '../datos/colores.js';
import { PAINTS } from '../datos/materiales.js';

/* Dibuja una pieza (tabla, residuo, energía…) centrada en (0,0), en una celda de 1×1. */
export function drawItem(c,it){
  dibujarPieza(c,it);
  // La crecida: agua con barro, piedras y ramas
  if(it&&it.big){c.fillStyle='#7a5532';c.beginPath();c.arc(-0.1,0.06,0.08,0,7);c.fill();c.fillStyle='#8a8f96';c.beginPath();c.arc(0.1,0.1,0.07,0,7);c.fill();c.strokeStyle='#5b3a1d';c.lineWidth=0.05;c.beginPath();c.moveTo(-0.2,-0.12);c.lineTo(0.18,-0.04);c.stroke();}
}
function dibujarPieza(c,it){
  if(it.kind==='pila'){c.fillStyle='#2b2f36';rr(c,-0.13,-0.26,0.26,0.52,0.05);c.fill();c.fillStyle='#e8665a';rr(c,-0.13,-0.26,0.26,0.2,0.05);c.fill();c.fillStyle='#c3ccd6';c.fillRect(-0.05,-0.31,0.1,0.06);c.fillStyle='#fff';c.font='800 0.16px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('+',0,-0.16);return;}
  if(it.kind==='celular'){c.fillStyle='#1f242b';rr(c,-0.16,-0.28,0.32,0.56,0.06);c.fill();c.fillStyle='#4f7fa8';rr(c,-0.12,-0.22,0.24,0.38,0.03);c.fill();c.strokeStyle='#e8665a';c.lineWidth=0.025;c.beginPath();c.moveTo(-0.1,-0.18);c.lineTo(0.1,0.1);c.stroke();c.fillStyle='#8a939d';c.beginPath();c.arc(0,0.22,0.03,0,7);c.fill();return;}
  if(it.kind==='placa'){c.fillStyle='#2f7a4a';rr(c,-0.24,-0.18,0.48,0.36,0.03);c.fill();c.strokeStyle='#e6c25a';c.lineWidth=0.025;c.beginPath();c.moveTo(-0.2,-0.08);c.lineTo(0.02,-0.08);c.lineTo(0.08,0.02);c.lineTo(0.2,0.02);c.moveTo(-0.2,0.08);c.lineTo(0.12,0.08);c.stroke();c.fillStyle='#14181d';c.fillRect(-0.08,-0.14,0.12,0.1);c.fillStyle='#e6c25a';for(let i=0;i<4;i++)c.fillRect(-0.2+i*0.05,0.13,0.025,0.05);return;}
  if(!it.steps)it={...it,steps:[]};
  if(it.kind==='clavos'){
    c.lineCap='round';
    [[-0.13,-0.35],[0,0.15],[0.13,-0.1]].forEach(([x,a])=>{c.save();c.translate(x,0.02);c.rotate(a);c.strokeStyle='#aeb7c1';c.lineWidth=0.045;c.beginPath();c.moveTo(0,-0.13);c.lineTo(0,0.15);c.stroke();c.fillStyle='#dfe4ea';c.fillRect(-0.055,-0.17,0.11,0.045);c.restore();});
    return;
  }
  const metal=(x,y,w,h,col)=>{c.fillStyle=col||'#c3ccd6';rr(c,x,y,w,h,Math.min(w,h)/2.5);c.fill();c.fillStyle='rgba(255,255,255,.55)';c.fillRect(x+w*0.08,y+h*0.2,w*0.84,Math.max(0.012,h*0.18));};
  const heat=()=>{if((it.temp||25)>80){c.strokeStyle='rgba(255,150,80,.9)';c.lineWidth=0.02;for(const x of[-0.12,0,0.12]){c.beginPath();c.moveTo(x,-0.3);c.quadraticCurveTo(x+0.05,-0.36,x,-0.42);c.stroke();}}};
  const orb=(col,glow)=>{c.fillStyle=glow;c.beginPath();c.arc(0,0,0.26,0,7);c.fill();c.fillStyle=col;c.beginPath();c.arc(0,0,0.17,0,7);c.fill();};
  if(it.kind==='luz'){orb('#fff3b0','rgba(242,210,75,.45)');c.strokeStyle='#f2d24b';c.lineWidth=0.03;for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(Math.cos(a)*0.2,Math.sin(a)*0.2);c.lineTo(Math.cos(a)*0.3,Math.sin(a)*0.3);c.stroke();}return;}
  if(it.kind==='calor'){orb('#e8762e','rgba(232,118,46,.35)');c.strokeStyle='#ffd27a';c.lineWidth=0.025;for(const x of[-0.07,0.07]){c.beginPath();c.moveTo(x,0.08);c.quadraticCurveTo(x+0.05,0,x,-0.08);c.stroke();}return;}
  if(it.kind==='mov'){c.save();c.rotate(performance.now()/300);c.fillStyle='#9aa3ad';c.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?0.15:0.22;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();c.fillStyle='#3d4652';c.beginPath();c.arc(0,0,0.06,0,7);c.fill();c.restore();return;}
  if(it.kind==='elec'){const hi=it.v==='alta';orb(hi?'#c56cf0':'#f2d24b',hi?'rgba(197,108,240,.35)':'rgba(242,182,50,.35)');c.fillStyle=hi?'#fff':'#1a1d22';c.beginPath();c.moveTo(0.03,-0.14);c.lineTo(-0.07,0.02);c.lineTo(0,0.02);c.lineTo(-0.03,0.14);c.lineTo(0.08,-0.03);c.lineTo(0.01,-0.03);c.closePath();c.fill();
    if(hi){labelTxt(c,'AT',0,-0.3,0.12,'#e3b5f7');}return;}
  if(it.kind==='agua'){c.fillStyle='#3f7fd1';c.beginPath();c.moveTo(0,-0.24);c.quadraticCurveTo(0.2,0.04,0.12,0.14);c.quadraticCurveTo(0,0.26,-0.12,0.14);c.quadraticCurveTo(-0.2,0.04,0,-0.24);c.fill();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.arc(-0.05,0.06,0.04,0,7);c.fill();return;}
  if(it.kind==='viento'){c.strokeStyle='#c9d4ea';c.lineWidth=0.04;c.lineCap='round';for(const y of[-0.1,0.02,0.14]){c.beginPath();c.moveTo(-0.25,y);c.lineTo(0.12,y);c.quadraticCurveTo(0.24,y,0.2,y-0.08);c.stroke();}return;}
  if(it.kind==='luzSol'){orb('#f2c84b','rgba(242,200,75,.35)');return;}
  if(it.kind==='cera'){c.fillStyle='#f3efe4';rr(c,-0.07,-0.15,0.14,0.36,0.03);c.fill();c.strokeStyle='#3d2a17';c.lineWidth=0.02;c.beginPath();c.moveTo(0,-0.15);c.lineTo(0,-0.22);c.stroke();return;}
  if(it.kind==='lena'){c.fillStyle='#6b4325';rr(c,-0.28,-0.08,0.56,0.16,0.05);c.fill();c.fillStyle='#d9a066';c.beginPath();c.ellipse(0.27,0,0.05,0.08,0,0,7);c.fill();return;}
  if(it.kind==='carbon'){c.fillStyle='#2b2f35';c.beginPath();c.moveTo(-0.2,0.1);c.lineTo(-0.12,-0.15);c.lineTo(0.1,-0.18);c.lineTo(0.22,0.02);c.lineTo(0.1,0.18);c.lineTo(-0.1,0.16);c.closePath();c.fill();c.fillStyle='#545e6a';c.fillRect(-0.05,-0.08,0.06,0.04);return;}
  if(it.kind==='gas'){c.fillStyle='#3f7fd1';c.beginPath();c.moveTo(0,-0.22);c.quadraticCurveTo(0.18,0,0.1,0.15);c.quadraticCurveTo(0,0.22,-0.1,0.15);c.quadraticCurveTo(-0.18,0,0,-0.22);c.fill();c.fillStyle='#9fd0ee';c.beginPath();c.moveTo(0,-0.06);c.quadraticCurveTo(0.08,0.06,0,0.12);c.quadraticCurveTo(-0.08,0.06,0,-0.06);c.fill();return;}
  if(it.kind==='uranio'){c.fillStyle='rgba(108,201,138,.35)';c.beginPath();c.arc(0,0,0.24,0,7);c.fill();c.fillStyle='#6cc98a';rr(c,-0.1,-0.14,0.2,0.28,0.06);c.fill();return;}
  const bottle=(fill,stroke,cap)=>{c.fillStyle=fill;c.strokeStyle=stroke;c.lineWidth=0.02;c.beginPath();c.moveTo(-0.07,-0.28);c.lineTo(0.07,-0.28);c.lineTo(0.07,-0.2);c.quadraticCurveTo(0.16,-0.14,0.16,-0.04);c.lineTo(0.16,0.26);c.quadraticCurveTo(0.16,0.3,0.12,0.3);c.lineTo(-0.12,0.3);c.quadraticCurveTo(-0.16,0.3,-0.16,0.26);c.lineTo(-0.16,-0.04);c.quadraticCurveTo(-0.16,-0.14,-0.07,-0.2);c.closePath();c.fill();c.stroke();c.fillStyle=cap;c.fillRect(-0.075,-0.34,0.15,0.07);};
  const crack=()=>{c.strokeStyle='#e8665a';c.lineWidth=0.025;c.beginPath();c.moveTo(-0.12,-0.05);c.lineTo(0,0.05);c.lineTo(-0.05,0.12);c.lineTo(0.1,0.22);c.stroke();};
  const dirt=()=>{if(it.dirty>0){c.fillStyle='#6b4a2a';for(const[x,y]of[[-0.1,0.05],[0.08,-0.06],[0.05,0.15]].slice(0,it.dirty+1)){c.beginPath();c.arc(x,y,0.045,0,7);c.fill();}}};
  if(it.kind==='pet'){c.save();c.rotate(-1.57);bottle('rgba(190,227,245,.85)','#7fb3e8','#3f7fd1');c.restore();return;}
  if(it.kind==='petColor'){c.save();c.rotate(-1.57);bottle('#4f9e5a','#2f6b46','#f2b632');c.restore();return;}
  if(it.kind==='vidrio'){c.save();c.rotate(-1.57);bottle('#6b4a2a','#3d2a17','#c3ccd6');c.restore();if(it.defect)crack();return;}
  if(it.kind==='botella'){c.save();c.rotate(-1.57);bottle('#6aa7c9','#2b5d9e','#c3ccd6');c.restore();c.fillStyle='rgba(255,255,255,.9)';sparkle(c,0.25,-0.15,0.05);return;}
  if(it.kind==='botellaRe'){c.save();c.rotate(-1.57);bottle('#4f7a3a','#2f4a20','#e8665a');c.restore();c.fillStyle='#ece6d8';c.fillRect(-0.08,-0.09,0.18,0.18);c.fillStyle='#4f9e5a';c.beginPath();c.arc(0.01,0,0.05,0,7);c.fill();if(it.defect)crack();return;}
  if(it.kind==='papel'){c.save();c.rotate(-0.12);c.fillStyle='#f3efe4';c.fillRect(-0.26,-0.18,0.52,0.36);c.fillStyle='#9aa3ad';c.fillRect(-0.21,-0.13,0.2,0.1);for(let i=0;i<4;i++)c.fillRect(0.02,-0.13+i*0.06,0.18,0.025);for(let i=0;i<2;i++)c.fillRect(-0.21,0.03+i*0.06,0.41,0.025);c.restore();return;}
  if(it.kind==='carton'||it.kind==='cartonNuevo'){c.fillStyle=it.kind==='carton'?'#b98a52':'#c79a5b';rr(c,-0.26,-0.18,0.52,0.36,0.02);c.fill();c.strokeStyle='#8a6232';c.lineWidth=0.018;for(let x=-0.2;x<0.25;x+=0.07){c.beginPath();c.moveTo(x,-0.18);c.lineTo(x,0.18);c.stroke();}
    if(it.kind==='cartonNuevo'){c.fillStyle='rgba(255,255,255,.9)';sparkle(c,0.22,-0.22,0.05);}return;}
  if(it.kind==='lata'){c.fillStyle='#c3ccd6';rr(c,-0.13,-0.24,0.26,0.48,0.05);c.fill();c.fillStyle='#e8665a';c.fillRect(-0.13,-0.08,0.26,0.16);c.fillStyle='#eef2f6';c.fillRect(-0.09,-0.22,0.04,0.42);return;}
  if(it.kind==='acero'){c.fillStyle='#8a939d';rr(c,-0.16,-0.2,0.32,0.4,0.03);c.fill();c.fillStyle='#d9b26a';c.fillRect(-0.16,-0.1,0.32,0.2);c.strokeStyle='#5b6470';c.lineWidth=0.02;for(const y of[-0.17,0.17]){c.beginPath();c.moveTo(-0.16,y);c.lineTo(0.16,y);c.stroke();}return;}
  if(it.kind==='organico'){c.fillStyle='#f2d24b';c.beginPath();c.moveTo(-0.25,0.1);c.quadraticCurveTo(0,0.3,0.25,0.05);c.quadraticCurveTo(0.05,0.12,-0.25,0.1);c.fill();c.fillStyle='#e8762e';c.beginPath();c.arc(-0.05,-0.08,0.11,0,7);c.fill();c.fillStyle='#4f9e5a';c.fillRect(-0.06,-0.24,0.03,0.08);return;}
  if(it.kind==='basura'){c.fillStyle='#8a5bb5';c.beginPath();c.moveTo(-0.24,-0.1);c.lineTo(-0.1,-0.2);c.lineTo(0.2,-0.14);c.lineTo(0.25,0.08);c.lineTo(0.05,0.2);c.lineTo(-0.2,0.14);c.closePath();c.fill();c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=0.02;c.beginPath();c.moveTo(-0.12,-0.08);c.lineTo(0.1,0.06);c.stroke();return;}
  if(it.kind==='fardo'){const cm={papel:'#e8dcc2',carton:'#c79a5b',pet:'#9fd0ee',petColor:'#4f9e5a',vidrio:'#5b8c6e',lata:'#c3ccd6',acero:'#8a939d'};
    c.fillStyle=cm[it.mat]||'#aaa';rr(c,-0.27,-0.22,0.54,0.44,0.03);c.fill();
    if(it.mixed){c.fillStyle='#4f9e5a';c.fillRect(-0.2,-0.15,0.14,0.1);c.fillStyle='#e8665a';c.fillRect(0.05,0.03,0.14,0.1);c.fillStyle='#3f7fd1';c.fillRect(-0.1,0.08,0.1,0.08);}
    c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=0.015;for(let y=-0.15;y<0.2;y+=0.07){c.beginPath();c.moveTo(-0.27,y);c.lineTo(0.27,y);c.stroke();}
    c.fillStyle='#3d4652';c.fillRect(-0.15,-0.22,0.04,0.44);c.fillRect(0.11,-0.22,0.04,0.44);return;}
  if(it.kind==='escamas'||it.kind==='calcin'){const col=it.kind==='calcin'?'#6b8a5a':it.mat==='petColor'?'#4f9e5a':'#9fd0ee';c.fillStyle=col;
    for(const[x,y,a]of[[-0.15,-0.08,0.3],[0.05,-0.12,1.1],[0.15,0.05,2],[-0.05,0.08,0.7],[-0.2,0.1,1.6],[0.1,0.15,2.6]]){c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.moveTo(-0.06,-0.03);c.lineTo(0.06,-0.04);c.lineTo(0.03,0.04);c.closePath();c.fill();c.restore();}dirt();return;}
  if(it.kind==='pellets'){c.fillStyle='#ece6d8';rr(c,-0.2,-0.24,0.4,0.48,0.06);c.fill();c.fillStyle='#9fd0ee';for(let i=0;i<9;i++){c.beginPath();c.arc(-0.1+(i%3)*0.1,-0.1+Math.floor(i/3)*0.1,0.035,0,7);c.fill();}dirt();return;}
  if(it.kind==='pasta'){c.fillStyle='#b9bdc2';c.beginPath();c.ellipse(0,0.05,0.25,0.15,0,0,7);c.fill();c.fillStyle='#d6d9dc';c.beginPath();c.ellipse(-0.05,0,0.12,0.07,0,0,7);c.fill();return;}
  if(it.kind==='compost'){c.fillStyle=it.wet>0?'#7a6a3a':'#4a3220';c.beginPath();c.moveTo(-0.28,0.18);c.quadraticCurveTo(0,-0.2,0.28,0.18);c.closePath();c.fill();
    if(it.wet>0){c.fillStyle='#f2d24b';c.beginPath();c.arc(0.05,0.05,0.06,0,7);c.fill();}else{c.strokeStyle='#4f9e5a';c.lineWidth=0.03;c.beginPath();c.moveTo(0,0.0);c.lineTo(0,-0.14);c.stroke();c.fillStyle='#6cc98a';c.beginPath();c.ellipse(0.05,-0.15,0.05,0.025,-0.5,0,7);c.fill();}return;}
  if(it.kind==='lingote'){c.fillStyle='#c3ccd6';c.beginPath();c.moveTo(-0.28,0.12);c.lineTo(-0.2,-0.1);c.lineTo(0.2,-0.1);c.lineTo(0.28,0.12);c.closePath();c.fill();c.fillStyle='#eef2f6';c.beginPath();c.moveTo(-0.2,-0.1);c.lineTo(0.2,-0.1);c.lineTo(0.16,-0.04);c.lineTo(-0.16,-0.04);c.closePath();c.fill();return;}
  if(it.kind==='paquete'){for(let i=0;i<4;i++){c.fillStyle=i%2?'#d6a468':'#e6bc7f';rr(c,-0.32,0.12-i*0.09,0.64,0.08,0.015);c.fill();}c.fillStyle='#3f7fd1';c.fillRect(-0.18,-0.17,0.05,0.38);c.fillRect(0.13,-0.17,0.05,0.38);return;}
  if(it.kind==='barra'){metal(-0.4,-0.05,0.8,0.1);return;}
  if(it.kind==='pata'){metal(-0.05,-0.22,0.1,0.44);c.fillStyle='#4b5561';c.fillRect(-0.06,0.18,0.12,0.05);return;}
  if(it.kind==='hierro'){metal(-0.4,-0.06,0.8,0.12,'#6b7581');return;}
  if(it.kind==='marco'){const T=it.temp||25,hot=T>80;const col=T>200?'#ff7a2e':hot?'#d9673a':'#5b6470';if(hot){c.fillStyle='rgba(255,120,40,.25)';c.beginPath();c.arc(0,0,0.34,0,7);c.fill();}
    c.strokeStyle=col;c.lineWidth=0.08;c.strokeRect(-0.22,-0.2,0.44,0.4);c.fillStyle='#ffd27a';if(hot)for(const[x,y]of[[-0.22,-0.2],[0.22,0.2]]){c.beginPath();c.arc(x,y,0.04,0,7);c.fill();}heat();return;}
  if(it.kind==='corredera'){c.save();if(it.defect)c.rotate(0.25);metal(-0.35,-0.05,it.defect?0.36:0.7,0.1,'#aab4bf');if(it.defect){c.rotate(-0.55);metal(-0.02,-0.05,0.36,0.1,'#aab4bf');}c.fillStyle='#4b5561';for(const x of[-0.25,-0.1,0.05,0.2]){c.beginPath();c.arc(x,0,0.015,0,7);c.fill();}c.restore();return;}
  if(it.kind==='cajon'){c.save();if(it.defect)c.rotate(-0.15);c.fillStyle='#c98e4f';rr(c,-0.28,-0.16,0.56,0.32,0.03);c.fill();c.strokeStyle='#8a5629';c.lineWidth=0.02;c.strokeRect(-0.22,-0.1,0.44,0.2);
    metal(-0.08,-0.03,0.16,0.06);c.fillStyle='#aab4bf';c.fillRect(-0.3,0.16,0.6,0.03);c.restore();return;}
  if(it.kind==='cajonera'){c.fillStyle='#b77840';rr(c,-0.24,-0.32,0.48,0.64,0.03);c.fill();for(const y of[-0.26,0.02]){c.fillStyle='#d6a468';rr(c,-0.19,y,0.38,0.24,0.02);c.fill();metal(-0.07,y+0.09,0.14,0.05);}
    if(it.defect){c.strokeStyle='#e8665a';c.lineWidth=0.03;c.beginPath();c.moveTo(-0.2,0.3);c.lineTo(0.2,0.02);c.stroke();}return;}
  if(it.kind==='mesa'||it.kind==='mesaHierro'){const iron=it.kind==='mesaHierro';
    if(iron){c.strokeStyle='#4b5561';c.lineWidth=0.05;c.strokeRect(-0.24,-0.04,0.48,0.24);c.beginPath();c.moveTo(-0.24,0.2);c.lineTo(-0.24,0.28);c.moveTo(0.24,0.2);c.lineTo(0.24,0.28);c.stroke();}
    else{metal(-0.27,-0.05,0.07,0.32);metal(0.2,-0.05,0.07,0.32);metal(-0.14,-0.05,0.05,0.26,'#a3adb8');metal(0.09,-0.05,0.05,0.26,'#a3adb8');}
    c.fillStyle='#e6bc7f';rr(c,-0.34,-0.14,0.68,0.1,0.02);c.fill();c.fillStyle='#c4935a';c.fillRect(-0.34,-0.06,0.68,0.02);
    if(it.defect){c.strokeStyle='#e8665a';c.lineWidth=0.025;c.beginPath();c.moveTo(-0.2,-0.13);c.lineTo(0.05,-0.06);c.lineTo(0.2,-0.12);c.stroke();}return;}
  if(it.kind==='tronco'){
    c.fillStyle='#6b4325';rr(c,-0.36,-0.15,0.66,0.3,0.06);c.fill();
    c.strokeStyle='#4f2f18';c.lineWidth=0.02;c.beginPath();c.moveTo(-0.3,-0.06);c.lineTo(0.1,-0.07);c.moveTo(-0.25,0.06);c.lineTo(0.2,0.05);c.stroke();
    c.fillStyle='#d9a066';c.beginPath();c.ellipse(0.3,0,0.09,0.15,0,0,7);c.fill();
    c.strokeStyle='#a8743f';c.lineWidth=0.014;c.beginPath();c.ellipse(0.3,0,0.055,0.095,0,0,7);c.stroke();c.beginPath();c.ellipse(0.3,0,0.025,0.045,0,0,7);c.stroke();
    if(it.tag){c.fillStyle='#fff';c.beginPath();c.arc(-0.2,0,0.07,0,7);c.fill();c.fillStyle=TAGC[it.tag];c.beginPath();c.arc(-0.2,0,0.052,0,7);c.fill();}
    return;
  }
  if(it.kind==='caja'){
    c.fillStyle='#b98a52';rr(c,-0.27,-0.2,0.54,0.4,0.03);c.fill();
    c.fillStyle='#9c713e';c.fillRect(-0.27,-0.2,0.54,0.07);
    c.fillStyle='#e0c690';c.fillRect(-0.04,-0.2,0.08,0.4);
    c.strokeStyle='#7d5a2f';c.lineWidth=0.012;c.beginPath();c.moveTo(-0.2,0.08);c.lineTo(-0.1,0.08);c.moveTo(-0.2,0.12);c.lineTo(-0.13,0.12);c.stroke();
    if(it.tag){c.fillStyle='#fff';c.beginPath();c.arc(0.15,0.06,0.075,0,7);c.fill();c.fillStyle=TAGC[it.tag];c.beginPath();c.arc(0.15,0.06,0.058,0,7);c.fill();}
    return;
  }
  const sanded=it.steps.includes('lijar'),pnt=it.steps.find(x=>PAINTS.includes(x)),barn=it.steps.includes('barniz'),roble=it.wood==='roble';
  let col=sanded?'#e6bc7f':'#b77840',dark=sanded?'#c4935a':'#8a5629';
  if(roble){col='#7f4f2c';dark='#5a3418';}
  if(barn){col='#6e3514';dark='#46200a';}
  if(pnt){col=TAGC[pnt];dark=pnt==='azul'?'#2b5d9e':'#c99a1d';}
  if(it.kind==='banquito'){
    c.fillStyle=dark;c.fillRect(-0.24,-0.03,0.065,0.26);c.fillRect(0.175,-0.03,0.065,0.26);c.fillRect(-0.2,0.1,0.4,0.04);
    c.fillStyle=col;rr(c,-0.31,-0.13,0.62,0.11,0.025);c.fill();
    c.fillStyle='#dfe4ea';for(const x of [-0.21,0.21]){c.beginPath();c.arc(x,-0.075,0.02,0,7);c.fill();}
    if(it.defect)knot(c,0,-0.075);
    if(sanded){c.fillStyle='rgba(255,250,235,.9)';sparkle(c,0.27,-0.2,0.04);}
    return;
  }
  const L=it.steps.includes('cortar')?0.5:0.8;
  c.fillStyle=col;rr(c,-L/2,-0.1,L,0.2,0.025);c.fill();
  c.strokeStyle=dark;c.lineWidth=0.018;c.beginPath();
  c.moveTo(-L/2+0.04,-0.035);c.bezierCurveTo(-0.1,-0.07,0.05,0.0,L/2-0.04,-0.045);
  c.moveTo(-L/2+0.06,0.045);c.bezierCurveTo(-0.05,0.02,0.1,0.075,L/2-0.05,0.04);c.stroke();
  if(it.defect)knot(c,-L/4,0);
  if(it.steps.includes('marcar')){
    c.strokeStyle='#22272d';c.lineWidth=0.024;c.setLineDash([0.04,0.025]);
    const mx=it.steps.includes('cortar')?L/2-0.035:L/2-0.26;
    c.beginPath();c.moveTo(mx,-0.1);c.lineTo(mx,0.1);c.stroke();c.setLineDash([]);
  }
  if(sanded&&!pnt){c.fillStyle='rgba(255,250,235,.9)';sparkle(c,L/2-0.09,-0.16,0.045);}
  if(barn){c.fillStyle='rgba(255,236,210,.55)';c.fillRect(-L/2+0.06,-0.075,L-0.14,0.03);}
  if(it.wet>0){c.fillStyle='rgba(170,215,240,.95)';for(const[x,y]of[[-L/4,0.13],[L/6,0.15]]){c.beginPath();c.moveTo(x,y-0.06);c.quadraticCurveTo(x+0.04,y,x,y+0.03);c.quadraticCurveTo(x-0.04,y,x,y-0.06);c.fill();}}
  if(it.tag){const tx=-L/2+0.1;c.fillStyle='#fff';c.beginPath();c.arc(tx,0,0.07,0,7);c.fill();c.fillStyle=TAGC[it.tag];c.beginPath();c.arc(tx,0,0.052,0,7);c.fill();}
}
