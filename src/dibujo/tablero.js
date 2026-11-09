/* Dibuja el tablero completo de la partida en juego. No guarda estado: lee G. */
import { rr, textU, labelTxt } from './util.js';
import { drawBelt, drawBeltCurve, beltInDir } from './cinta.js';
import { drawItem } from './piezas.js';
import { drawStation } from './estaciones.js';
import { drawSource, drawTruck, drawBin, drawPillar, drawModule, drawTarget, drawTech } from './objetos.js';
import { G, W, H } from '../motor/estado.js';
import { DX, DY, tileAt, eachTile, isNight } from '../motor/partida.js';
import { STATIONS } from '../datos/estaciones.js';
import { TRUCKC, TRUCK_LETRA_BLANCA } from '../datos/colores.js';
import { TRUCKN, TX } from '../datos/textos.js';
import { fmt } from '../datos/mensajes.js';
import { FONT_D } from './comun.js';

/* c: contexto del canvas del tablero · hover: celda bajo el puntero · tool: herramienta elegida en la paleta */
export function drawBoard(c,dpr,now,frac,hover,tool){
  const cs=G.cs;
  c.setTransform(dpr,0,0,dpr,0,0);
  c.fillStyle='#232a33';c.fillRect(0,0,W*cs,H*cs);
  c.strokeStyle='#2d3540';c.lineWidth=1;c.beginPath();
  for(let x=1;x<W;x++){c.moveTo(x*cs+.5,0);c.lineTo(x*cs+.5,H*cs);}
  for(let y=1;y<H;y++){c.moveTo(0,y*cs+.5);c.lineTo(W*cs,y*cs+.5);}
  c.stroke();
  const cell=(x,y,fn)=>{c.save();c.translate((x+.5)*cs,(y+.5)*cs);c.scale(cs,cs);fn();c.restore();};
  for(const z of G.zones){c.fillStyle='rgba(242,182,50,0.06)';c.fillRect(z.x*cs+2,z.y*cs+2,z.w*cs-4,z.h*cs-4);c.strokeStyle='rgba(242,182,50,0.35)';c.setLineDash([6,5]);c.lineWidth=1.5;c.strokeRect(z.x*cs+2.5,z.y*cs+2.5,z.w*cs-5,z.h*cs-5);c.setLineDash([]);}
  if(G.pasillo>=0){const y=G.pasillo*cs;c.fillStyle='rgba(242,182,50,0.07)';c.fillRect(0,y+2,W*cs,cs-4);c.strokeStyle='rgba(242,182,50,.55)';c.setLineDash([8,6]);c.lineWidth=2;
    c.beginPath();c.moveTo(0,y+3);c.lineTo(W*cs,y+3);c.moveTo(0,y+cs-3);c.lineTo(W*cs,y+cs-3);c.stroke();c.setLineDash([]);}
  eachTile((t,x,y)=>{if(t.t!=='belt')return;const ind=beltInDir(x,y,t);
    cell(x,y,()=>ind===t.dir?drawBelt(c,t.dir,G.phase,t.locked):drawBeltCurve(c,ind,t.dir,G.phase,t.locked));});
  if(hover&&!G.done){
    const t=tileAt(hover.x,hover.y);
    cell(hover.x,hover.y,()=>{
      if(tool==='cinta'&&!t){c.globalAlpha=.35;drawBelt(c,0,0,false);c.globalAlpha=1;}
      else if(tool.startsWith('st:')&&!t){c.globalAlpha=.5;drawStation(c,tool.slice(3),0,{});c.globalAlpha=1;}
      const del=tool==='borrar'&&t&&((t.t==='belt'&&!t.locked)||(t.t==='station'&&!t.fixed));
      c.strokeStyle=del?'#e8665a':'rgba(242,182,50,.7)';c.lineWidth=0.04;rr(c,-0.48,-0.48,0.96,0.96,0.06);c.stroke();
    });
  }
  for(const m of G.modules)drawModule(c,m,cs,now);
  for(const it of G.items){
    const ix=it.px+(it.x-it.px)*frac,iy=it.py+(it.y-it.py)*frac;
    cell(ix,iy,()=>{c.save();c.scale(.72,.72);drawItem(c,it);c.restore();
      if(it.dead||it.rej){c.fillStyle='#e8665a';c.beginPath();c.arc(0.3,-0.3,0.13,0,7);c.fill();textU(c,'!',0.3,-0.3,0.2,'#fff',cs);}
      if(it.kind==='marco'){const T=it.temp||25;c.fillStyle=T>80?'#e8665a':'#2f6b46';rr(c,-0.2,0.2,0.4,0.18,0.05);c.fill();labelTxt(c,`${T}°`,0,0.29,0.14,'#fff');}});
  }
  if(G.pasillo>=0&&G.techX>=-1)cell(G.techX+(G.running?frac:0),G.pasillo,()=>drawTech(c,now/1000));
  const ph=now/1000;
  eachTile((t,x,y)=>{
    if(t.t==='source'&&!t.module)cell(x,y,()=>drawSource(c,t.kind,t.pulse&&now-t.pulse<250?1-(now-t.pulse)/250:0,t));
    else if(t.t==='pillar')cell(x,y,()=>drawPillar(c));
    else if(t.t==='bin')cell(x,y,()=>drawBin(c));
    else if(t.t==='truck'){
      if(t.look){cell(x,y,()=>{drawTarget(c,t.look,t.n?t.got/t.n:0,now);textU(c,`${t.got}/${t.n}`,0,0.36,0.2,'#ece6d8',cs);});return;}
      const lt=t.doneAt?Math.min(1,(now-t.doneAt)/1500):0,off=lt*lt*2.4;
      const bump=t.bump&&now-t.bump<300?1-(now-t.bump)/300:0;
      cell(x+off,y,()=>{drawTruck(c,t.got,t.n,bump,t.want);textU(c,t.ambient?`${t.got}`:`${t.got}/${t.n}`,-0.16,-0.08,0.24,'#1a1d22',cs);});
    }
    else if(t.t==='station'){
      const def=STATIONS[t.type],p=t.proc;
      const o={lossFx:t.lossFx,charge:t.charge,broken:t.broken,alt:t.alt,thr:t.thr,time:t.time,paused:t.paused&&G.running,fixed:t.fixed,working:!!p&&G.running,phase:ph,item:p?p.item:null};
      if(def.sensor&&p&&p.timer<=1)o.judge=def.test(p.item,t)?'ok':'bad';
      if(def.combineAny&&!p)o.bufN=t.bufItems.length;
      if(def.combine&&!p){o.buf=t.buf;const tb=t.bufItems.find(i=>i.kind==='tabla');o.bufSteps=tb?tb.steps:[];}
      cell(x,y,()=>drawStation(c,t.type,t.dir,o));
    }
  });
  const fs=Math.max(10,Math.round(cs*0.2));c.font=`800 ${fs}px ${FONT_D}`;c.textBaseline='middle';c.textAlign='left';
  for(const z of G.zones){const t=z.label.toUpperCase(),w=c.measureText(t).width+12,x=z.x*cs+8,y=z.top?z.y*cs+fs*0.8:(z.y+z.h)*cs-fs*0.8;
    c.fillStyle='rgba(20,24,29,.85)';rr(c,x,y-fs*0.62,w,fs*1.24,4);c.fill();c.fillStyle='#f2b632';c.fillText(t,x+6,y+1);}
  // SÍ / NO en los sensores y 1 / 2 en repartidores
  const ps=Math.max(9,Math.round(cs*0.17));c.font=`800 ${ps}px ${FONT_D}`;c.textAlign='center';
  const pill=(cx,cy,t,bg,fg)=>{const w=c.measureText(t).width+8;c.fillStyle=bg;rr(c,cx-w/2,cy-ps*0.65,w,ps*1.3,ps*0.5);c.fill();c.strokeStyle='#14181d';c.lineWidth=1;c.stroke();c.fillStyle=fg;c.fillText(t,cx,cy+1);};
  eachTile((t,x,y)=>{if(t.t!=='station')return;const def=STATIONS[t.type];if(!def.sensor)return;
    for(const[d,txt,bg,fg]of[[t.dir,def.yes||TX.tablero.si,'#6cc98a','#10301c'],[t.alt,def.no||TX.tablero.no,'#e8665a','#fff']]){
      const ox=(x+.5+DX[d]*0.5)*cs+(DY[d]!==0?cs*0.24:0),oy=(y+.5+DY[d]*0.5)*cs+(DX[d]!==0?-cs*0.24:0);pill(ox,oy,txt,bg,fg);}});
  if(G.L.daynight){const nt=isNight();if(nt){c.fillStyle='rgba(10,14,30,.45)';c.fillRect(0,0,W*cs,H*cs);}
    const r0=cs*0.32,cx=W*cs-r0-8,cy=r0+8;c.fillStyle=nt?'#c9d4ea':'#f2c84b';c.beginPath();c.arc(cx,cy,r0*0.7,0,7);c.fill();if(nt){c.fillStyle='rgba(10,14,30,1)';c.beginPath();c.arc(cx+r0*0.3,cy-r0*0.2,r0*0.6,0,7);c.fill();}
    c.font=`800 ${Math.max(10,Math.round(cs*0.2))}px ${FONT_D}`;c.textAlign='right';c.fillStyle=nt?'#c9d4ea':'#f2c84b';c.fillText(nt?TX.tablero.noche:TX.tablero.dia,cx-r0-6,cy+4);c.textAlign='left';}
  eachTile((t,x,y)=>{c.font=`800 ${Math.max(11,Math.round(cs*0.24))}px ${FONT_D}`;c.textAlign='center';
    if(t.t==='truck'&&t.thermo){const tp=t.temp,col=tp<18?'#7fb6ec':tp<=22?'#6cc98a':tp<=26?'#f2b632':'#e8665a';c.fillStyle='rgba(17,21,26,.85)';rr(c,(x+.5)*cs-cs*0.36,(y+1)*cs-cs*0.02,cs*0.72,cs*0.32,4);c.fill();c.fillStyle=col;c.fillText(tp+'°',(x+.5)*cs,(y+1)*cs+cs*0.22);}
    if(t.t==='station'&&STATIONS[t.type].counter){const n=(t.made||0)%STATIONS[t.type].counter;c.fillStyle='#8a5bb5';rr(c,(x+.5)*cs-cs*0.2,(y+1)*cs-cs*0.02,cs*0.4,cs*0.3,4);c.fill();c.fillStyle='#fff';c.fillText(String(n),(x+.5)*cs,(y+1)*cs+cs*0.21);}
    if(t.t==='station'&&t.maint>0){c.fillStyle='#f2b632';rr(c,(x+.5)*cs-cs*0.46,y*cs+2,cs*0.92,cs*0.26,4);c.fill();c.fillStyle='#14181d';c.font=`800 ${Math.max(9,Math.round(cs*0.18))}px ${FONT_D}`;c.fillText(TX.tablero.mant+t.maint,(x+.5)*cs,y*cs+cs*0.2);c.font=`800 ${Math.max(11,Math.round(cs*0.24))}px ${FONT_D}`;}
    if(t.t==='source'&&t.until&&G.tick>t.until){c.fillStyle='#e8665a';c.fillText(TX.tablero.rota,(x+.5)*cs,(y+1)*cs-4);}
    c.textAlign='left';});
  eachTile((t,x,y)=>{if(t.t==='source'&&t.limit){const left=t.limit-t.made;c.font=`800 ${Math.max(10,Math.round(cs*0.2))}px ${FONT_D}`;c.textAlign='center';c.fillStyle=left?'#f2b632':'#e8665a';c.fillText(left?fmt(TX.tablero.quedan,{n:left}):TX.tablero.seAcabo,(x+.5)*cs,(y+1)*cs-4);c.textAlign='left';}});
  // nombres de las estaciones
  const ns=Math.max(8,Math.round(cs*0.14));c.font=`700 ${ns}px ${FONT_D}`;c.textAlign='center';
  eachTile((t,x,y)=>{if(t.t!=='station')return;const def=STATIONS[t.type];let lab=def.label;
    while(c.measureText(lab).width>cs*1.15&&lab.length>4)lab=lab.slice(0,-2);if(lab!==def.label)lab=lab.trim()+'.';
    const w=c.measureText(lab).width+8,cx=(x+.5)*cs,cy=(y+1)*cs-ns*0.35;
    c.fillStyle='rgba(17,21,26,.88)';rr(c,cx-w/2,cy-ns*0.62,w,ns*1.24,3);c.fill();c.fillStyle='#ece6d8';c.fillText(lab,cx,cy+1);});
  c.font=`800 ${ps}px ${FONT_D}`;
  // carteles de camiones
  eachTile((t,x,y)=>{if(t.t!=='bin'||!t.label)return;const lab=t.label.toUpperCase(),w=c.measureText(lab).width+10,cx=Math.min(W*cs-w/2-2,Math.max(w/2+2,(x+.5)*cs)),cy=y===0?(y+1)*cs-ps*0.7:y*cs+ps*0.75;
    c.fillStyle='#4b5561';rr(c,cx-w/2,cy-ps*0.65,w,ps*1.3,4);c.fill();c.fillStyle='#ece6d8';c.fillText(lab,cx,cy+1);});
  eachTile((t,x,y)=>{if(t.t!=='truck'||(t.doneAt&&!t.look))return;const lab=(t.label||(t.want?TRUCKN[t.want]:(G.L.truckLabel||TX.tablero.pedido))).toUpperCase();
    const w=c.measureText(lab).width+10,cx=Math.min(W*cs-w/2-2,(x+.5)*cs),cy=y===0?(y+1)*cs-ps*0.7:y*cs+ps*0.75;
    c.fillStyle=t.want?TRUCKC[t.want]:'#ece6d8';rr(c,cx-w/2,cy-ps*0.65,w,ps*1.3,4);c.fill();c.strokeStyle='#14181d';c.lineWidth=1;c.stroke();
    c.fillStyle=t.want&&TRUCK_LETRA_BLANCA.includes(t.want)?'#fff':'#1a1d22';c.fillText(lab,cx,cy+1);});
  if(G.marks&&G.marks.length){G.marks=G.marks.filter(m=>m.keep||now-m.t<3000);
    G.marks.forEach(m=>{const e=now-m.t,a=m.keep?1:1-e/3000,p=(Math.sin(e/130)+1)/2,cx=(m.x+.5)*cs,cy=(m.y+.5)*cs;
      c.strokeStyle=`rgba(232,102,90,${a})`;c.lineWidth=m.keep?3:2+2*p;c.beginPath();c.arc(cx,cy,cs*(0.5+(m.keep?0:0.12*p)),0,7);c.stroke();
      if(m.keep){c.fillStyle='#e8665a';c.beginPath();c.arc(cx+cs*0.36,cy-cs*0.36,cs*0.15,0,7);c.fill();c.fillStyle='#fff';c.font=`800 ${cs*0.22}px ${FONT_D}`;c.textAlign='center';c.textBaseline='middle';c.fillText('!',cx+cs*0.36,cy-cs*0.35);}});}
  c.textAlign='left';
}
