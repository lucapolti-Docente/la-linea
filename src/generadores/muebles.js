/* Generadores de la Fábrica de muebles: cada uno arma la cuadrícula de un nivel a partir del azar r (con semilla). */
import { W, H } from '../motor/estado.js';
import { E } from '../datos/etiquetas.js';
import { ri, emptyGrid, src, truck, station, protect, addPillars, LB, FS, pb, stA, tgt, thermoT, addModule } from './comun.js';

function genA1(r){
  const g=emptyGrid(),rs=ri(r,1,H-2),rw=ri(r,1,H-2),rt=ri(r,0,H-1),avoid=new Set(),wx=4,tx=3;
  g[rs][0]=src('tabla');g[rw][wx]=station('marcar',0,true);
  for(let x=1;x<tx;x++){g[rs][x]={t:'belt',dir:0,locked:true};avoid.add(x+','+rs);}
  if(rs!==rw){const s=rw>rs?1:-1;for(let y=rs;y!==rw;y+=s){g[y][tx]={t:'belt',dir:s>0?1:3,locked:true};avoid.add(tx+','+y);}}
  g[rw][tx]={t:'belt',dir:0,locked:true};avoid.add(tx+','+rw);g[rt][W-1]=truck();
  protect(avoid,wx,rw);protect(avoid,W-1,rt);protect(avoid,0,rs);addPillars(g,r,1,avoid);
  return{g,N:ri(r,3,5)};
}
function genA2(r){
  const g=emptyGrid(),rs=ri(r,1,H-2),rt=ri(r,1,H-2),avoid=new Set();
  g[rs][0]=src('tabla');g[rt][W-1]=truck();protect(avoid,0,rs);protect(avoid,W-1,rt);addPillars(g,r,2,avoid);
  return{g,N:ri(r,3,4)};
}
function genA3(r){
  const g=emptyGrid(),r1=ri(r,0,1),r2=ri(r,H-2,H-1),rt=ri(r,2,H-3),avoid=new Set();
  g[r1][0]=src('tabla',{interval:4});g[r2][0]=src('tabla',{interval:4});g[rt][W-1]=truck();
  protect(avoid,0,r1);protect(avoid,0,r2);protect(avoid,W-1,rt);addPillars(g,r,3,avoid,3,W-3);
  return{g,N:8};
}
function genA4(r){
  const g=emptyGrid(),r1=ri(r,0,1),r2=ri(r,H-2,H-1),rm=ri(r,2,H-3),rt=ri(r,1,H-2),avoid=new Set(),mx=5;
  g[r1][0]=src('tabla');g[r2][0]=src('clavos');g[rm][mx]=station('clavar',0,true);g[rt][W-1]=truck();
  protect(avoid,0,r1);protect(avoid,0,r2);protect(avoid,mx,rm);protect(avoid,W-1,rt);addPillars(g,r,1,avoid);
  return{g,N:ri(r,3,5)};
}
function genA5(r){
  const g=emptyGrid(),r1=ri(r,0,2),r2=ri(r,4,6),rt=ri(r,1,5),avoid=new Set();
  g[r1][0]=src('tabla');g[r2][0]=src('clavos');g[rt][W-1]=truck();
  protect(avoid,0,r1);protect(avoid,0,r2);protect(avoid,W-1,rt);addPillars(g,r,3,avoid);
  return{g,N:ri(r,5,6)};
}
function genA6(r){
  const g=emptyGrid(),rs=ri(r,1,H-2),rt=ri(r,1,H-2),avoid=new Set();
  g[rs][0]=src('tabla',{interval:2});g[rt][W-1]=truck();protect(avoid,0,rs);protect(avoid,W-1,rt);addPillars(g,r,1,avoid);
  return{g,N:8};
}
function genA7(r){
  const g=emptyGrid(),rs=ri(r,1,H-2),rt=ri(r,1,H-2),bx=ri(r,5,7),by=r()<.5?0:H-1,avoid=new Set();
  g[rs][0]=src('tabla',{defect:.35});g[rt][W-1]=truck();g[by][bx]={t:'bin'};
  protect(avoid,0,rs);protect(avoid,W-1,rt);protect(avoid,bx,by);addPillars(g,r,2,avoid);
  return{g,N:ri(r,4,6)};
}
function genA8(r){
  const g=emptyGrid(),rt=ri(r,3,5),bx=ri(r,4,8),avoid=new Set();
  g[1][0]=src('tabla',{interval:3,defect:.3});g[6][0]=src('clavos',{interval:3});g[0][bx]={t:'bin'};g[rt][W-1]=truck();
  protect(avoid,0,1);protect(avoid,0,6);protect(avoid,bx,0);protect(avoid,W-1,rt);addPillars(g,r,2,avoid,3,W-3);
  return{g,N:ri(r,4,5)};
}

function genPlano(r){
  const g=emptyGrid(),rs=ri(r,1,H-2),rt=ri(r,1,H-2),avoid=new Set();
  const opts=[{name:E.repisas,recipe:['marcar','cortar']},{name:E.patas,recipe:['marcar','cortar','lijar']},{name:E.tablasLisas,recipe:['lijar']},{name:E.bases,recipe:['lijar','marcar','cortar']}];
  const o=opts[ri(r,0,opts.length-1)];
  g[rs][0]=src('tabla');g[rt][W-1]=truck();protect(avoid,0,rs);protect(avoid,W-1,rt);addPillars(g,r,1,avoid);
  return{g,N:ri(r,3,4),recipe:o.recipe,productName:o.name};
}
/* Acto 2 */
function genB9(r){
  const g=emptyGrid(),rs=ri(r,0,H-1),rc=ri(r,0,H-2),avoid=new Set();
  g[rs][0]=src('tronco',{interval:3});
  FS(g,6,rc,'cortar',0);LB(g,7,rc,0);FS(g,8,rc,'lijar',0);LB(g,9,rc,0);LB(g,10,rc,0);g[rc][11]=truck();
  for(let y=rc-1;y<=rc+2;y++)for(let x=5;x<12;x++)avoid.add(x+','+y);protect(avoid,0,rs);addPillars(g,r,2,avoid);
  return{g,N:ri(r,6,7),zones:[{x:6,y:rc,w:6,h:2,label:E.carpinteria}]};
}
function genB10(r){
  const g=emptyGrid(),rs=ri(r,1,H-2),rt=ri(r,1,H-2),avoid=new Set();
  g[rs][0]=src('tronco',{interval:2});g[rt][W-1]=truck();protect(avoid,0,rs);protect(avoid,W-1,rt);addPillars(g,r,2,avoid);
  return{g,N:ri(r,9,10)};
}
function buildAserradero(g,tags){g[1][0]=src('tronco',{interval:3,tags});LB(g,1,1,0);FS(g,2,1,'sierra',0);LB(g,3,1,0);FS(g,4,1,'lijadora',0);LB(g,5,1,1);LB(g,5,2,1);LB(g,5,3,0);LB(g,6,3,0);}
function buildProveedor(g,dry){g[5][0]=src('tabla',{interval:4,wood:'roble',pre:['cortar','lijar'],ext:true,dry});for(let x=1;x<5;x++)LB(g,x,5,0);LB(g,5,5,3);LB(g,5,4,3);}
function buildClasif(g){FS(g,7,3,'escMadera',0,false);FS(g,8,3,'barniz',0);LB(g,7,4,1);LB(g,7,5,1);LB(g,7,6,0);}
function buildPintura(g){LB(g,8,6,0);FS(g,9,6,'escColor',0,false);FS(g,10,6,'pintaAzul',0);LB(g,11,6,0);LB(g,12,6,0);LB(g,9,7,0);FS(g,10,7,'pintaAmarilla',0);LB(g,11,7,0);LB(g,12,7,3);}
function buildHorno(g,endX){LB(g,9,3,0);FS(g,10,3,'horno',0);FS(g,11,3,'termo',0,true);LB(g,11,2,2);LB(g,10,2,1);LB(g,12,3,0);LB(g,13,3,0);LB(g,14,3,3);for(let x=14;x<endX;x++)LB(g,x,2,0);}
const Z={A:{x:0,y:0,w:7,h:4,label:E.aserradero},P:{x:0,y:4,w:6,h:2,label:E.robleDeOtraFabrica},C:{x:7,y:3,w:2,h:1,label:E.clasif},
  Pi:{x:8,y:6,w:5,h:2,label:E.pintura},Ho:{x:10,y:2,w:5,h:2,label:E.horno}};
function genB11(r){
  const g=emptyGrid(),rt=ri(r,2,H-2),avoid=new Set();
  buildAserradero(g,'random');g[rt][W-1]=truck();
  for(let y=0;y<4;y++)for(let x=0;x<8;x++)avoid.add(x+','+y);protect(avoid,W-1,rt);addPillars(g,r,2,avoid);
  return{g,N:ri(r,6,7),zones:[Z.A]};
}
function genB12(r){
  const g=emptyGrid(),rt=ri(r,2,H-2),avoid=new Set();
  buildAserradero(g,false);g[rt][W-1]=truck();
  for(let y=0;y<5;y++)for(let x=0;x<9;x++)avoid.add(x+','+y);protect(avoid,W-1,rt);addPillars(g,r,1,avoid);
  return{g,N:ri(r,4,5),zones:[Z.A]};
}
function genPaquetes(r){
  const g=emptyGrid(),rt=ri(r,2,H-2),avoid=new Set();
  buildAserradero(g,false);g[1][0].interval=2;g[rt][W-1]=truck();
  for(let y=0;y<5;y++)for(let x=0;x<9;x++)avoid.add(x+','+y);protect(avoid,W-1,rt);addPillars(g,r,1,avoid);
  return{g,N:ri(r,3,4),zones:[Z.A]};
}
function genHornoReloj(r){
  const g=emptyGrid(),rh=ri(r,1,H-2),rt=ri(r,0,H-1),avoid=new Set();
  const s0=src('tabla',{interval:3,wood:'roble',dry:true,pre:['barniz']});s0.dryMax=3;g[rh][0]=s0;FS(g,4,rh,'hornoReloj',0);g[rt][W-1]=truck();
  protect(avoid,0,rh);protect(avoid,4,rh);protect(avoid,W-1,rt);addPillars(g,r,1,avoid);
  return{g,N:6};
}
function genB13(r){
  const g=emptyGrid(),rs=ri(r,1,H-2),rh=ri(r,2,H-3),rt=ri(r,1,H-2),hx=5,avoid=new Set();
  g[rs][0]=src('tabla',{interval:3,wood:'roble',dry:true});g[rh][hx]=station('horno',0,true);g[rt][W-1]=truck();
  protect(avoid,0,rs);protect(avoid,hx,rh);protect(avoid,W-1,rt);addPillars(g,r,1,avoid);
  return{g,N:ri(r,5,6)};
}
function genB14(r){
  const g=emptyGrid(),rt=ri(r,2,H-3),avoid=new Set();
  g[2][0]=src('tabla',{interval:3,tags:'random',woods:true});LB(g,1,2,0);FS(g,2,2,'escMadera',0,false);g[rt][W-1]=truck();
  protect(avoid,0,2);protect(avoid,2,2);protect(avoid,W-1,rt);addPillars(g,r,1,avoid,5,W-3);
  return{g,N:6};
}
function genB15(r){
  const g=emptyGrid();
  buildAserradero(g,'random');buildProveedor(g,false);g[4][13]=truck();
  if(r()<.6)g[ri(r,0,1)][ri(r,9,12)]={t:'pillar'};
  return{g,N:ri(r,6,7),zones:[Z.A,Z.P]};
}
function genB16(r){
  const g=emptyGrid(),nr=ri(r,2,3),na=ri(r,2,3),nb=ri(r,2,3),ya=ri(r,4,5),yb=ri(r,7,8);
  buildAserradero(g,'exact');buildProveedor(g,true);buildClasif(g);buildHorno(g,16);buildPintura(g);
  g[2][16]=truck('roble',nr);g[ya][16]=truck('azul',na);g[yb][16]=truck('amarillo',nb);
  return{g,N:nr+na+nb,zones:[Z.A,Z.P,Z.C,Z.Ho,Z.Pi]};
}
const WOOD={kind:'tabla',opts:{interval:5,pre:['aserrar','cortar','lijar']}};
function genHerramienta(r){
  const g=emptyGrid(),rs=ri(r,1,H-2),rt=ri(r,1,H-2),avoid=new Set();
  g[rs][0]=src('barra',{interval:2});g[rt][W-1]=truck();protect(avoid,0,rs);protect(avoid,W-1,rt);addPillars(g,r,1,avoid);
  return{g,N:8};
}
function genC17(r){
  const g=emptyGrid(),mods=[],zones=[],my=ri(r,0,2),rb=ri(r,4,H-1),rt=ri(r,1,H-2),avoid=new Set();
  addModule(g,mods,zones,0,my,2,2,E.fabricaDeMadera,'tabla',[{dy:0,...WOOD}]);
  g[rb][0]=src('barra',{interval:1});g[rt][W-1]=truck();
  for(let y=0;y<H;y++)for(let x=0;x<4;x++)avoid.add(x+','+y);protect(avoid,W-1,rt);addPillars(g,r,2,avoid);
  return{g,N:ri(r,3,4),zones,modules:mods};
}
function genC18(r){
  const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,3,2,2,E.fabricaDeMadera2,'tabla',[{dy:0,kind:'tabla',opts:{interval:3,pre:['aserrar','cortar','lijar']}}]);
  g[0][0]=src('barra',{interval:1});g[7][0]=src('barra',{interval:1});g[4][12]=truck();
  return{g,N:8,zones,modules:mods};
}
function genC19(r){
  const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,0,2,2,E.fabricaDeMadera2,'tabla',[{dy:0,...WOOD}]);
  for(let x=2;x<8;x++)LB(g,x,0,0);FS(g,8,0,'brazoHierro',0);LB(g,9,0,0);LB(g,10,0,0);g[0][11]=truck();
  g[5][0]=src('hierro',{interval:2});
  return{g,N:ri(r,3,4),zones,modules:mods};
}
function genUmbral(r){
  const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,0,2,2,E.fabricaDeMadera2,'tabla',[{dy:0,...WOOD}]);
  for(let x=2;x<8;x++)LB(g,x,0,0);FS(g,8,0,'brazoHierro',0);LB(g,9,0,0);LB(g,10,0,0);g[0][11]=truck();
  g[5][0]=src('hierro',{interval:2});FS(g,1,5,'soldadora',0);FS(g,2,5,'enfriador',0);FS(g,3,5,'frio',0,true);g[5][3].thr=160;
  LB(g,3,4,2);LB(g,2,4,1);for(let x=4;x<8;x++)LB(g,x,5,0);LB(g,8,5,3);for(let y=4;y>0;y--)LB(g,8,y,3);
  zones.push({x:1,y:4,w:8,h:2,label:E.soldaduraYaArmada,top:true});
  return{g,N:ri(r,3,4),zones,modules:mods};
}
function genSeguridad(r){
  const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,0,2,2,E.madera,'tabla',[{dy:0,...WOOD}]);
  for(let x=2;x<5;x++)LB(g,x,0,0);LB(g,5,0,1);LB(g,5,1,1);LB(g,5,2,1);
  g[3][0]=src('barra',{interval:1});FS(g,1,3,'cortaMetal',0);for(let x=2;x<5;x++)LB(g,x,3,0);FS(g,5,3,'brazo',0);for(let x=6;x<11;x++)LB(g,x,3,0);g[3][11]=truck();
  addModule(g,mods,zones,0,6,2,2,E.madera,'tabla',[{dy:0,...WOOD}]);
  for(let x=2;x<5;x++)LB(g,x,6,0);LB(g,5,6,3);
  g[5][0]=src('barra',{interval:1});FS(g,1,5,'cortaMetal',0);for(let x=2;x<5;x++)LB(g,x,5,0);FS(g,5,5,'brazo',0);for(let x=6;x<10;x++)LB(g,x,5,0);LB(g,10,5,3);LB(g,10,4,3);
  return{g,N:ri(r,3,4),zones,modules:mods,pasillo:4};
}
function genC20(r){
  const g=emptyGrid(),rs=ri(r,1,H-2),rt=ri(r,1,H-2),bx=ri(r,4,7),by=rs<3?H-1:0,avoid=new Set();
  g[rs][0]=src('corredera',{interval:1,defect:.3});g[by][bx]={t:'bin'};g[rt][W-1]=truck();
  protect(avoid,0,rs);protect(avoid,bx,by);protect(avoid,W-1,rt);addPillars(g,r,1,avoid);
  return{g,N:8};
}
function genC21(r){
  const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,1,2,3,E.fabricaDeMadera2,'tabla',[{dy:0,...WOOD},{dy:2,...WOOD}]);
  g[6][0]=src('corredera',{interval:1,defect:.25});g[7][5]={t:'bin'};g[4][12]=truck();
  return{g,N:ri(r,2,3),zones,modules:mods};
}
function genC22(r){
  const g=emptyGrid(),mods=[],zones=[],nm=ri(r,2,3),nh=ri(r,2,3),nc=ri(r,2,3);
  addModule(g,mods,zones,0,0,2,2,E.mesas,'mesa',[{dy:0,kind:'mesa',opts:{interval:5,defect:.2}}]);
  addModule(g,mods,zones,0,3,2,2,E.hierro,'mesaHierro',[{dy:0,kind:'mesaHierro',opts:{interval:6,defect:.2}}]);
  addModule(g,mods,zones,0,6,2,2,E.cajoneras,'cajonera',[{dy:0,kind:'cajonera',opts:{interval:7,defect:.2}}]);
  for(let x=2;x<5;x++){LB(g,x,0,0);LB(g,x,3,0);LB(g,x,6,0);}
  LB(g,5,0,1);LB(g,5,1,1);LB(g,5,2,1);LB(g,5,6,3);LB(g,5,5,3);LB(g,5,4,3);LB(g,5,3,0);LB(g,6,3,0);
  zones.push({x:5,y:2,w:2,h:3,label:E.playaDeCarga});
  g[0][8]={t:'bin'};g[2][14]=truck('mesa',nm);g[5][14]=truck('mesaHierro',nh);g[8][14]=truck('cajonera',nc);
  return{g,N:nm+nh+nc,zones,modules:mods};
}
function genM1(r){const g=emptyGrid();g[1][0]=src('tabla');g[5][0]=src('clavos');g[3][W-1]=truck();
  g[1][1]=station('cortar',0);g[1][2]=station('marcar',0);g[1][3]=station('lijar',0);pb(g,[4,1],[6,1],[6,3]);g[3][6]=station('clavar',0);
  g[4][6]={t:'belt',dir:1};pb(g,[1,5],[6,5],[6,4]);g[3][9]={t:'belt',dir:1};pb(g,[7,3],[W-1,3]);return{g,N:4};}
function genM2(r){const g=emptyGrid();g[3][0]=src('tabla',{interval:3,defect:.3});g[3][W-1]=truck();g[0][5]={t:'bin'};return{g,N:5};}
function genM3(r){const g=emptyGrid();g[3][0]=src('tronco',{interval:2,limit:6});g[3][W-1]=truck();return{g,N:6};}
function genM4(r){const g=emptyGrid();buildAserradero(g,'random');g[3][W-1]=truck();
  const e=station('escColor',0);e.alt=1;g[3][7]=e;g[3][8]=station('pintaAmarilla',0);g[4][8]=station('pintaAzul',0);g[4][7]={t:'belt',dir:2};g[4][9]={t:'belt',dir:1};
  pb(g,[9,3],[W-1,3]);return{g,N:6,zones:[Z.A]};}
function genM5(r){const g=emptyGrid();g[3][0]=src('tronco',{interval:1});g[3][W-1]=truck();return{g,N:10};}
function genM6(r){const g=emptyGrid(),mods=[],zones=[];addModule(g,mods,zones,0,1,2,2,E.fabricaDeMadera,'tabla',[{dy:0,...WOOD}]);
  g[5][0]=src('barra',{interval:1});g[4][W-1]=truck();
  g[5][1]=station('sierra',0);g[2][6]={t:'belt',dir:3};pb(g,[2,1],[6,1],[6,4]);g[4][6]=station('brazo',2);pb(g,[2,5],[6,5],[6,4]);pb(g,[7,4],[W-1,4]);return{g,N:3,zones,modules:mods};}
function genM7(r){const g=emptyGrid();g[3][0]=src('tronco',{interval:2,limit:6});g[3][W-1]=truck();
  g[3][1]=station('sierra',0);g[3][2]=station('sierra',0);g[3][3]=station('lijadora',0);g[3][4]=station('lijadora',0);g[3][5]=station('horno',0);pb(g,[6,3],[W-1,3]);return{g,N:6};}
function genM8(r){const g=emptyGrid(),mods=[],zones=[];addModule(g,mods,zones,0,2,2,2,E.fabricaDeMadera2,'tabla',[{dy:0,kind:'tabla',opts:{interval:4,pre:['aserrar','cortar','lijar']}}]);
  g[6][0]=src('barra',{interval:1});g[0][W-1]=Object.assign(truck('tabla',3),{label:E.escuela});g[4][W-1]=Object.assign(truck('mesa',2),{label:E.muebleria});return{g,N:5,zones,modules:mods};}

export const GEN = { genA1, genA2, genA3, genA4, genA5, genA6, genA7, genA8, genPlano, genB9, genB10, genB11, genB12, genPaquetes, genHornoReloj, genB13, genB14, genB15, genB16, genHerramienta, genC17, genC18, genC19, genUmbral, genSeguridad, genC20, genC21, genC22, genM1, genM2, genM3, genM4, genM5, genM6, genM7, genM8 };
