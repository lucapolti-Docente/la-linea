/* Piezas para armar tableros: lo que comparten los generadores de los tres mundos. */
import { STATIONS } from '../datos/estaciones.js';
import { W, H } from '../motor/estado.js';

export const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
export const emptyGrid = () => Array.from({ length: H }, () => Array(W).fill(null));
export const src=(kind,o={})=>({t:'source',kind,interval:o.interval||4,defect:o.defect||0,pre:o.pre||[],tags:o.tags||false,woods:!!o.woods,wood:o.wood||null,dry:!!o.dry,ext:!!o.ext,mix:o.mix||null,dirtyOn:!!o.dirty,compost:!!o.compost,day:!!o.day,gusty:!!o.gusty,limit:o.limit||0,cnt:0,made:0,tagIdx:0});
export const truck=(want,n,label)=>({t:'truck',want:want||null,n:n||0,got:0,doneAt:0,bump:0,label:label||null});
export const station=(type,dir,fixed)=>{const d=STATIONS[type];const s={t:'station',type,dir,alt:(dir+1)%4,fixed:!!fixed,proc:null,buf:{},bufItems:[]};if(d.thr)s.thr=80;if(d.timer)s.time=1;return s;};
export function protect(set,x,y){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)set.add((x+dx)+','+(y+dy));}
export function addPillars(g,r,n,avoid,x0,x1){let tries=0;while(n>0&&tries++<300){const x=ri(r,x0??2,x1??W-3),y=ri(r,0,H-1);if(g[y][x]||avoid.has(x+','+y))continue;g[y][x]={t:'pillar'};n--;}}
export const LB=(g,x,y,d)=>{g[y][x]={t:'belt',dir:d,locked:true};};
export const FS=(g,x,y,type,d,flip)=>{const s=station(type,d,true);s.alt=flip?(d+3)%4:(d+1)%4;g[y][x]=s;};
/* Cinta trabada desde un punto, pasando por los vértices que se indiquen (no pisa lo que ya hay). */
export function pb(g,...w){const cells=[];for(let i=0;i<w.length-1;i++){let[x,y]=w[i];const[x2,y2]=w[i+1];while(x!==x2||y!==y2){cells.push([x,y]);if(x!==x2)x+=Math.sign(x2-x);else y+=Math.sign(y2-y);}}cells.push(w[w.length-1]);
  for(let i=0;i<cells.length-1;i++){const[a,b]=cells[i],[c2,d]=cells[i+1];const dir=c2>a?0:c2<a?2:d>b?1:3;if(!g[b][a])g[b][a]={t:'belt',dir};}}
export const stA=(type,dir,alt)=>{const s=station(type,dir);s.alt=alt;return s;};
export const tgt=(want,n,look,label,o={})=>({t:'truck',want,n,got:0,doneAt:0,bump:0,label,look,night:!!o.night});
export const thermoT=(n,label)=>Object.assign(tgt('calor',n,'casa',label),{thermo:true,temp:15,temp0:15});
export function addModule(g,mods,zones,x,y,w,h,label,icon,outs){
  for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)g[yy][xx]={t:'module'};
  for(const o of outs){const s=src(o.kind,o.opts||{});s.module=true;g[y+o.dy][x+w-1]=s;}
  mods.push({x,y,w,h,icon,outs:outs.map(o=>y+o.dy)});zones.push({x,y,w,h,label});
}
