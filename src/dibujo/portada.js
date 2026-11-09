/* Tira animada de la pantalla de inicio. */
import { drawBelt } from './cinta.js';
import { drawItem } from './piezas.js';
import { drawStation } from './estaciones.js';
import { reduce } from './comun.js';

/* strip: el canvas de la tira · sctx: su contexto */
export function drawStrip(strip,sctx,now){
  const d=window.devicePixelRatio||1,w=strip.clientWidth,h=strip.clientHeight;if(!w)return;
  if(strip.width!==Math.round(w*d)||strip.height!==Math.round(h*d)){strip.width=Math.round(w*d);strip.height=Math.round(h*d);}
  const c=sctx;c.setTransform(d,0,0,d,0,0);c.fillStyle='#232a33';c.fillRect(0,0,w,h);
  const cs=Math.min(110,h*0.72),n=Math.ceil(w/cs)+1,y0=h/2+4,t=reduce?2.2:now/650;
  const cell=(x,fn)=>{c.save();c.translate((x+.5)*cs,y0);c.scale(cs,cs);fn();c.restore();};
  for(let i=0;i<n;i++)cell(i,()=>drawBelt(c,0,t,false));
  const cols=Math.max(4,Math.floor(w/cs)),st=[1,2,3].map(i=>Math.floor(i*cols/4)),types=['marcar','cortar','lijar'];
  const spacing=1.6,cycle=Math.ceil((cols+2)/spacing)*spacing;
  for(let k=0;k*spacing<cycle;k++){
    const p=((t+k*spacing)%cycle)-1;
    if(st.some(s=>Math.abs(p-s)<0.45))continue;
    const steps=[];st.forEach((s,i)=>{if(p>s)steps.push(types[i]);});
    cell(p,()=>{c.scale(.72,.72);drawItem(c,{kind:'tabla',steps,defect:false});});
  }
  st.forEach((s,i)=>{const busy=[...Array(Math.ceil(cycle/spacing)).keys()].some(k=>Math.abs((((t+k*spacing)%cycle)-1)-s)<0.45);cell(s,()=>drawStation(c,types[i],0,{fixed:true,working:busy&&!reduce,phase:now/1000,item:busy?{kind:'tabla',steps:types.slice(0,i),defect:false}:null}));});
}
