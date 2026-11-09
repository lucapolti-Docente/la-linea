/* Generadores de La usina: cada uno arma la cuadrícula de un nivel a partir del azar r (con semilla). */
import { W, H } from '../motor/estado.js';
import { E } from '../datos/etiquetas.js';
import { ri, emptyGrid, src, truck, station, protect, addPillars, LB, FS, pb, stA, tgt, thermoT, addModule } from './comun.js';

function genE1(r){const g=emptyGrid(),rt=ri(r,1,H-2);g[2][0]=src('cera',{interval:3});g[rt][W-1]=tgt('luz',4,'casa',E.casa);return{g,N:4};}
function genE2(r){const g=emptyGrid();g[1][0]=src('cera',{interval:3});g[4][0]=src('lena',{interval:3});g[1][W-1]=tgt('luz',3,'casa',E.casa);g[4][W-1]=tgt('calor',3,'olla',E.cocina);return{g,N:6};}
function genE3(r){const g=emptyGrid(),rs=ri(r,1,H-2),avoid=new Set();g[rs][0]=src('agua',{interval:2});g[ri(r,1,H-2)][W-1]=tgt('mov',4,'molino',E.molino);protect(avoid,0,rs);addPillars(g,r,1,avoid,3,W-3);return{g,N:4};}
function genE4(r){const g=emptyGrid(),avoid=new Set();g[1][0]=src('agua',{interval:2});g[4][0]=src('cera',{interval:3});g[6][0]=src('lena',{interval:3});
  g[1][W-1]=tgt('mov',3,'molino',E.molino);g[4][W-1]=tgt('luz',3,'casa',E.casa);g[6][W-1]=tgt('calor',3,'olla',E.cocina);
  for(let y=0;y<H;y++){avoid.add('0,'+y);avoid.add('1,'+y);avoid.add((W-1)+','+y);avoid.add((W-2)+','+y);}addPillars(g,r,3,avoid,3,W-3);return{g,N:9};}
function genE5(r){const g=emptyGrid();g[2][0]=src('carbon',{interval:1});g[ri(r,1,H-2)][W-1]=tgt('mov',4,'fabricaE',E.fabrica);return{g,N:4};}
function genE6(r){const g=emptyGrid();g[2][0]=src('agua',{interval:2});g[ri(r,1,H-2)][W-1]=tgt('luz',4,'casa',E.casa);return{g,N:4};}
function genE7(r){const g=emptyGrid();g[3][0]=src('gas',{interval:1});g[ri(r,1,H-2)][W-1]=tgt('elec',5,'barrio',E.barrio);return{g,N:5};}
function genE8(r){const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,2,2,3,E.central,'elec',[{dy:1,kind:'elec',opts:{interval:2}}]);
  zones.push({x:4,y:0,w:8,h:7,label:E.campo300Km,top:true});g[3][W-1]=tgt('elec',5,'barrio',E.barrio);return{g,N:5,zones,modules:mods};}
function genE9(r){const g=emptyGrid();g[1][0]=src('agua',{interval:2});g[6][0]=src('uranio',{interval:3});g[4][W-1]=tgt('elec',6,'barrio',E.red);return{g,N:6};}
function genE10(r){const g=emptyGrid();g[1][0]=src('luzSol',{interval:2,day:true});g[5][0]=src('viento',{interval:4,gusty:true});g[3][W-1]=tgt('elec',6,'barrio',E.casas,{night:true});return{g,N:6};}
function genE11(r){const g=emptyGrid();g[3][0]=src('gas',{interval:2,limit:8});g[1][W-1]=tgt('calor',3,'casa',E.casaA);g[5][W-1]=tgt('calor',3,'casa',E.casaB);return{g,N:6};}
function genE12(r){const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,0,2,3,E.central2,'elec',[{dy:1,kind:'elec',opts:{interval:2}}]);
  addModule(g,mods,zones,0,5,2,3,E.represa,'elec',[{dy:1,kind:'elec',opts:{interval:2}}]);
  zones.push({x:4,y:0,w:6,h:9,label:E.campo300Km,top:true});
  g[1][W-1]=tgt('elec',3,'fabricaE',E.fabricaDeMuebles);g[4][W-1]=tgt('elec',3,'plantaE',E.plantaDeReciclaje);g[7][W-1]=tgt('elec',3,'barrio',E.barrio);return{g,N:9,zones,modules:mods};}
function genE13(r){const g=emptyGrid(),rs=ri(r,1,H-2),avoid=new Set();g[rs][0]=src('viento',{interval:2,gusty:true});g[ri(r,1,H-2)][W-1]=tgt('mov',4,'molino',E.molino);protect(avoid,0,rs);addPillars(g,r,1,avoid,3,W-3);return{g,N:4};}
function genE14(r){const g=emptyGrid(),s=src('agua',{interval:2});s.crecida=true;g[2][0]=s;g[ri(r,1,H-2)][W-1]=tgt('mov',4,'molino',E.molino);g[H-1][ri(r,3,6)]={t:'bin',label:E.vertedero};return{g,N:4};}
function genE15(r){const g=emptyGrid();g[1][0]=src('agua',{interval:2});g[4][0]=src('cera',{interval:3});g[6][0]=src('lena',{interval:3});
  g[1][W-1]=tgt('mov',3,'molino',E.molino);g[4][W-1]=tgt('luz',3,'casa',E.casa);g[6][W-1]=tgt('calor',3,'olla',E.cocina);
  g[1][1]=station('rueda',0);g[1][6]={t:'belt',dir:1};pb(g,[2,1],[W-1,1]);
  g[4][1]=station('fogon',0);pb(g,[2,4],[W-1,4]);g[6][1]=station('vela',0);pb(g,[2,6],[W-1,6]);return{g,N:9};}
function genE16(r){const g=emptyGrid(),a=src('agua',{interval:2});a.crecida=true;g[1][0]=a;g[4][0]=src('viento',{interval:2,gusty:true});g[6][0]=src('lena',{interval:3});
  g[2][W-1]=tgt('mov',5,'molino',E.molino);g[6][W-1]=tgt('calor',3,'olla',E.cocina);g[0][3]={t:'bin',label:E.vertedero};return{g,N:8};}
function genE17(r){const g=emptyGrid();g[3][0]=src('gas',{interval:2});g[3][W-1]=thermoT(10,E.casa);g[H-1][W-3]={t:'bin',label:E.tanqueDeAguaCaliente};return{g,N:10};}
function genE18(r){const g=emptyGrid();g[3][0]=src('gas',{interval:1});g[3][W-1]=tgt('elec',8,'barrio',E.barrio);return{g,N:8};}
function genE19(r){const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,2,2,3,E.central2,'elec',[{dy:1,kind:'elec',opts:{interval:2}}]);
  zones.push({x:4,y:0,w:8,h:7,label:E.campo300Km,top:true});g[3][W-1]=tgt('elec',5,'barrio',E.barrio);
  g[3][2]=station('reductor',0);g[3][8]={t:'belt',dir:2};pb(g,[3,3],[13,3]);g[3][13]=station('elevador',0);g[3][14]={t:'belt',dir:0};return{g,N:5,zones,modules:mods};}
function genE20(r){const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,0,2,3,E.centralAGas,'elec',[{dy:1,kind:'elec',opts:{interval:3}}]);g[1][1].until=18;
  g[6][0]=src('agua',{interval:2});g[3][W-1]=tgt('elec',8,'barrio',E.barrio);return{g,N:8,zones,modules:mods};}
function genE21(r){const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,2,2,3,E.plantaDeReciclaje,'organico',[{dy:1,kind:'organico',opts:{interval:1}}]);
  g[1][W-1]=tgt('calor',3,'olla',E.comedor);g[6][W-1]=tgt('elec',2,'plantaE',E.planta);return{g,N:5,zones,modules:mods};}
function genE22(r){const g=emptyGrid(),zones=[];g[3][0]=src('luzSol',{interval:1,day:true});zones.push({x:4,y:0,w:8,h:8,label:E.puna200Km,top:true});
  g[1][W-1]=tgt('elec',5,'fabricaE',E.minaDeLitio);g[6][W-1]=tgt('elec',3,'barrio',E.pueblo,{night:true});return{g,N:8,zones};}
function genE23(r){const g=emptyGrid(),zones=[];g[1][0]=src('viento',{interval:2,gusty:true});g[7][0]=src('viento',{interval:2,gusty:true});
  zones.push({x:5,y:0,w:7,h:9,label:E.campo1000Km,top:true});g[4][W-1]=tgt('elec',8,'barrio',E.ciudad);return{g,N:8,zones};}
function genE24(r){const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,2,2,3,E.central2,'elec',[{dy:1,kind:'elec',opts:{interval:2,limit:6}}]);
  g[1][W-1]=tgt('luz',3,'casa',E.casa);g[4][W-1]=tgt('luz',3,'casa',E.escuela);g[7][W-1]={t:'bin',label:E.aulaVacia};
  const s1=station('repartidor',3);s1.alt=1;g[3][2]=s1;pb(g,[2,2],[2,1],[10,1]);g[1][10]=station('lampara',0);g[1][11]={t:'belt',dir:0};
  pb(g,[2,4],[2,5],[6,5]);const s2=station('repartidor',3);s2.alt=1;g[5][6]=s2;pb(g,[6,4],[10,4]);g[4][10]=station('lampara',0);g[4][11]={t:'belt',dir:0};
  pb(g,[6,6],[6,7],[10,7]);g[7][10]=station('lampara',0);g[7][11]={t:'belt',dir:0};return{g,N:6,zones,modules:mods};}

export const GEN = { genE1, genE2, genE3, genE4, genE5, genE6, genE7, genE8, genE9, genE10, genE11, genE12, genE13, genE14, genE15, genE16, genE17, genE18, genE19, genE20, genE21, genE22, genE23, genE24 };
