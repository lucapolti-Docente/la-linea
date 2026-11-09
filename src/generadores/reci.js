/* Generadores de la Planta de reciclaje: cada uno arma la cuadrícula de un nivel a partir del azar r (con semilla). */
import { W, H } from '../motor/estado.js';
import { E } from '../datos/etiquetas.js';
import { ri, emptyGrid, src, truck, station, protect, addPillars, LB, FS, pb, stA, tgt, thermoT, addModule, bolsa } from './comun.js';
import { MIX1 } from '../datos/materiales.js';

function genR1(r){const g=emptyGrid(),rs=ri(r,1,H-2),rt=ri(r,1,H-2),bx=ri(r,4,6),by=r()<.5?0:H-1,avoid=new Set();
  g[rs][0]=src('mezcla',{interval:3,mix:MIX1});g[rt][W-1]=truck('reciclables');g[by][bx]={t:'bin',label:E.rellenoSanitario};
  protect(avoid,0,rs);protect(avoid,W-1,rt);protect(avoid,bx,by);addPillars(g,r,1,avoid);return{g,N:6};}
function genR2(r){const g=emptyGrid(),rs=ri(r,2,H-3);
  g[rs][0]=src('mezcla',{interval:3,mix:[['papel',3],['carton',1],['pet',2],['petColor',1],['vidrio',3]]});
  g[1][W-1]=truck('papel',3);g[3][W-1]=truck('plastico',3);g[5][W-1]=truck('vidrio',3);return{g,N:9};}
function genR3(r){const g=emptyGrid(),rs=ri(r,1,H-2),rt=ri(r,1,H-2),avoid=new Set();
  g[rs][0]=src('mezcla',{interval:2,mix:[['papel',4],['carton',1],['pet',1]]});g[rt][W-1]=truck('papel');g[0][5]={t:'bin',label:E.rellenoSanitario};
  protect(avoid,0,rs);protect(avoid,W-1,rt);protect(avoid,5,0);addPillars(g,r,1,avoid);return{g,N:3};}
function genR4(r){const g=emptyGrid();
  const s=src('mezcla',{interval:2,mix:[['papel',4],['pet',4],['vidrio',2],['basura',2],['organico',1]]});s.seq=bolsa(r,s.mix);g[4][0]=s;
  g[1][W-1]=truck('papel',2);g[4][W-1]=truck('plastico',2);g[7][W-1]=truck('vidrio',3);g[0][4]={t:'bin',label:E.rellenoSanitario};return{g,N:7};}
function genR5(r){const g=emptyGrid(),rs=ri(r,1,H-2),avoid=new Set();
  g[rs][0]=src('mezcla',{interval:2,mix:[['acero',1],['lata',1]]});g[1][W-1]=truck('acero',4);g[4][W-1]=truck('aluminio',4);
  protect(avoid,0,rs);addPillars(g,r,1,avoid,3,W-3);return{g,N:8};}
function genR6(r){const g=emptyGrid();
  g[3][0]=src('mezcla',{interval:2,mix:[['papel',2],['lata',2],['pet',2]]});g[1][W-1]=truck('papel',3);g[3][W-1]=truck('aluminio',3);g[5][W-1]=truck('plastico',3);return{g,N:9};}
function genR7(r){const g=emptyGrid(),rs=ri(r,1,H-2);
  g[rs][0]=src('mezcla',{interval:2,mix:[['pet',1],['petColor',1]]});g[1][W-1]=truck('pet',4);g[4][W-1]=truck('petColor',4);return{g,N:8};}
function genR8(r){const g=emptyGrid();
  const s=src('mezcla',{interval:2,mix:[['acero',2],['lata',2],['papel',2],['pet',2],['petColor',2],['basura',1]]});s.seq=bolsa(r,s.mix);g[4][0]=s;
  g[0][W-1]=truck('acero',2);g[2][W-1]=truck('papel',2);g[4][W-1]=truck('aluminio',2);g[6][W-1]=truck('pet',2);g[8][W-1]=truck('petColor',2);g[0][3]={t:'bin',label:E.rellenoSanitario};return{g,N:10};}
function genR9(r){const g=emptyGrid(),rs=ri(r,1,H-2),rt=ri(r,1,H-2),avoid=new Set();
  g[rs][0]=src('mezcla',{interval:3,mix:[['pet',1]],dirty:true});g[rt][W-1]=truck();
  protect(avoid,0,rs);protect(avoid,W-1,rt);addPillars(g,r,1,avoid);return{g,N:5};}
function genR10(r){const g=emptyGrid();
  const s=src('mezcla',{interval:3,mix:[['vidrio',1]],defect:.4});s.defectSeq=bolsa(r,[[true,2],[false,3]]);g[3][0]=s;g[1][W-1]=truck('botellaRe',3);g[5][W-1]=truck('botella',3);return{g,N:6};}
function genR11(r){const g=emptyGrid();
  const so=src('mezcla',{interval:3,mix:[['organico',1]],compost:true});g[1][0]=so;FS(g,4,1,'compostera',0);
  g[5][0]=src('mezcla',{interval:3,mix:[['papel',1]]});g[1][W-1]=truck('compost',3);g[5][W-1]=truck('cartonNuevo',3);return{g,N:6};}
function genR12(r){const g=emptyGrid(),mods=[],zones=[];
  addModule(g,mods,zones,0,1,2,5,E.plantaDeSeparacion,'lata',[{dy:0,kind:'lata',opts:{interval:3}},{dy:4,kind:'pet',opts:{interval:3,mix:[['pet',1]],dirty:true}}]);
  zones[0].top=true;g[1][W-1]=truck('lingote',3);g[5][W-1]=truck('pellets',3);return{g,N:6,zones,modules:mods};}
function genR13(r){const g=emptyGrid(),zones=[{x:0,y:0,w:1,h:3,label:E.bolsasVerdes},{x:0,y:4,w:1,h:3,label:E.bolsasMezcladas}];g[1][0]=src('mezcla',{interval:5,mix:[['papel',2],['pet',2],['vidrio',1],['lata',1]]});
  g[5][0]=src('mezcla',{interval:3,mix:[['basura',1],['papel',1],['organico',1],['pet',1],['vidrio',1]]});g[3][W-1]=truck('reciclables');g[H-1][5]={t:'bin',label:E.rellenoSanitario};return{g,N:10,zones};}
function genR14(r){const g=emptyGrid();g[3][0]=src('mezcla',{interval:3,mix:[['papel',3],['carton',1],['pet',2],['petColor',1],['vidrio',3]]});
  g[1][W-1]=truck('papel',3);g[3][W-1]=truck('plastico',3);g[5][W-1]=truck('vidrio',3);
  g[3][1]=stA('recPapel',0,3);pb(g,[1,2],[1,1],[W-1,1]);g[3][2]={t:'belt',dir:2};
  g[3][3]=stA('recVidrio',0,1);pb(g,[4,3],[W-1,3]);pb(g,[3,4],[3,5],[W-1,5]);return{g,N:9};}
function genR15(r){const g=emptyGrid();g[3][0]=src('mezcla',{interval:2,mix:[['papel',4],['carton',1],['pet',1]]});
  g[1][W-1]=truck('fardo',4,E.comprador);g[5][W-1]=truck('balanza',2,E.balanza);g[0][3]={t:'bin',label:E.rellenoSanitario};return{g,N:6};}
function genR16(r){const g=emptyGrid();{const s0=src('mezcla',{interval:1,mix:MIX1});s0.seq=['papel','pet','basura','vidrio','lata','organico','papel','pet','vidrio','basura'];g[4][0]=s0;}g[1][W-1]=truck('reciclables');g[4][7]={t:'bin',label:E.rellenoSanitario};return{g,N:10};}
function genR17(r){const g=emptyGrid();g[3][0]=src('mezcla',{interval:3,mix:[['celular',2],['pila',2],['basura',1]]});
  g[1][W-1]=truck('placa',3);g[5][W-1]=truck('pila',3);g[3][W-1]={t:'bin',label:E.rellenoSanitario};return{g,N:6};}
function genR18(r){const g=emptyGrid();g[3][0]=src('mezcla',{interval:2,mix:[['acero',1],['papel',1],['lata',1]]});
  g[1][W-1]=truck('acero',3);g[3][W-1]=truck('papel',3);g[5][W-1]=truck('aluminio',3);
  g[3][1]=stA('iman',0,3);pb(g,[1,2],[1,1],[W-1,1]);g[3][2]={t:'belt',dir:0};g[3][3]=stA('soplador',0,1);pb(g,[4,3],[W-1,3]);
  g[4][3]={t:'belt',dir:3};g[5][3]=stA('foucault',1,0);pb(g,[4,5],[W-1,5]);return{g,N:9};}
function genR19(r){const g=emptyGrid(),s=src('mezcla',{interval:2,limit:14,mix:[['papel',3],['pet',3],['lata',2],['basura',2]]});s.seq=['papel','pet','basura','lata','papel','pet','pet','basura','papel','lata','pet','basura','papel','lata'];g[3][0]=s;
  g[1][W-1]=truck('reciclables',10);g[H-1][8]={t:'bin',label:E.rellenoSanitario};
  g[3][1]=stA('recPapel',3,1);pb(g,[1,2],[1,1],[W-1,1]);pb(g,[1,4],[1,6],[8,6]);return{g,N:10};}
function genR20(r){const g=emptyGrid();g[1][0]=src('mezcla',{interval:2,mix:[['papel',1],['lata',1]]});
  const s=src('mezcla',{interval:2,mix:[['vidrio',3],['basura',1]]});s.from=24;g[6][0]=s;
  g[0][W-1]=truck('papel',4);g[3][W-1]=truck('aluminio',4);g[6][W-1]=truck('vidrio',4);g[H-1][6]={t:'bin',label:E.rellenoSanitario};return{g,N:12};}
function genR21(r){const g=emptyGrid();g[3][0]=src('mezcla',{interval:3,mix:[['pet',1]],dirty:true});g[3][W-1]=truck();
  g[3][1]=station('trituradora',0);g[3][2]=station('extrusora',0);g[3][3]=station('lavadora',0);g[3][4]=stA('limpio',1,0);pb(g,[5,3],[W-1,3]);pb(g,[4,4],[4,5],[6,5]);return{g,N:4};}
function genR22(r){const g=emptyGrid();g[3][0]=src('mezcla',{interval:2,mix:[['organico',1]],compost:true});g[1][W-1]=truck('gas',3,E.usina);g[5][W-1]=truck('compost',3,E.huerta);return{g,N:6};}
function genR23(r){const g=emptyGrid();g[4][0]=src('mezcla',{interval:3,mix:[['papel',2],['pet',2],['organico',2],['basura',1]],compost:true});
  g[1][W-1]=truck('papel',3);g[4][W-1]=truck('plastico',3);g[7][W-1]=truck('compost',2,E.huertaDeLaEscuela);g[5][8]={t:'bin',label:E.rellenoSanitario};return{g,N:8};}
function genR24(r){const g=emptyGrid();g[4][0]=src('mezcla',{interval:2,mix:[['papel',2],['vidrio',2],['lata',2],['organico',2],['basura',1]],compost:true});
  g[0][W-1]=truck('cartonNuevo',2);g[2][W-1]=truck('botella',2);g[4][W-1]=truck('aluminio',2);g[8][W-1]=truck('compost',2,E.huerta);g[6][W-1]={t:'bin',label:E.rellenoSanitario};return{g,N:8};}

export const GEN = { genR1, genR2, genR3, genR4, genR5, genR6, genR7, genR8, genR9, genR10, genR11, genR12, genR13, genR14, genR15, genR16, genR17, genR18, genR19, genR20, genR21, genR22, genR23, genR24 };
