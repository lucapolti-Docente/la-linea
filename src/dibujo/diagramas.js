/* Diagramas del objetivo (SVG): secuencia, si, si anidado, bucle, repartir, juntar. */
import { TX } from '../datos/textos.js';

const T = TX.diagrama;


export function flowSVG(d){
  if(!d)return '';
  const box=(x,y,w,t,cls)=>{let tx;const cap=Math.floor(w/5.6);if(t.length<=cap)tx=`<text x="${x+w/2}" y="${y+19.5}" class="ft">${t}</text>`;else{const ws=t.split(' ');let l1='';while(ws.length&&(l1+' '+ws[0]).trim().length<=Math.max(cap,ws[0].length))l1=(l1+' '+ws.shift()).trim();const l2=ws.join(' ');tx=l2?`<text x="${x+w/2}" y="${y+13}" class="ft" style="font-size:9px">${l1}</text><text x="${x+w/2}" y="${y+24}" class="ft" style="font-size:9px">${l2}</text>`:`<text x="${x+w/2}" y="${y+19}" class="ft" style="font-size:9px">${l1}</text>`;}
    return `<g><rect x="${x}" y="${y}" width="${w}" height="30" rx="7" class="fb ${cls||''}"/>${tx}</g>`;};
  const dia=(x,y,w,t)=>`<g><polygon points="${x},${y+18} ${x+w/2},${y} ${x+w},${y+18} ${x+w/2},${y+36}" class="fd"/><text x="${x+w/2}" y="${y+22}" class="ft">${t}</text></g>`;
  const ar=(x1,y1,x2,y2,cls)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="fa ${cls||''}" marker-end="url(#ah${cls?'-'+cls:''})"/>`;
  const lab=(x,y,t,cls)=>`<text x="${x}" y="${y}" class="fl ${cls}">${t}</text>`;
  const defs=`<defs>${['','yes','no'].map(k=>`<marker id="ah${k?'-'+k:''}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fm ${k}"/></marker>`).join('')}</defs>`;
  let b='',h=60;
  if(d.type==='seq'){const n=d.steps.length,per=n<=4?n:Math.ceil(n/Math.ceil(n/3)),rows=Math.ceil(n/per),w=Math.min(84,(300-(per-1)*14)/per);
    d.steps.forEach((t,i)=>{const r=Math.floor(i/per),k=i%per,x=k*(w+14),y=10+r*52;b+=box(x,y,w,t,i===n-1?'end':'');
      if(i<n-1){if(k<per-1)b+=ar(x+w+1,y+15,x+w+12,y+15);else b+=`<path d="M${x+w/2} ${y+31} L${x+w/2} ${y+41} L${w/2} ${y+41} L${w/2} ${y+50}" class="fa" marker-end="url(#ah)"/>`;}});h=rows*52;}
  else if(d.type==='if'){b+=dia(0,6,120,d.q)+ar(121,24,168,24,'yes')+lab(144,17,T.si,'yes')+box(170,9,130,d.yes,'end')+ar(60,43,60,72,'no')+lab(72,62,T.no,'no')+box(0,74,120,d.no,'bad');h=110;}
  else if(d.type==='ifif'){b+=dia(0,6,120,d.q1)+ar(121,24,168,24,'yes')+lab(144,17,T.si,'yes')+box(170,9,130,d.yes1,'end')+ar(60,43,60,70,'no')+lab(72,60,T.no,'no')+dia(0,72,120,d.q2)+ar(121,90,168,90,'yes')+lab(144,83,T.si,'yes')+box(170,75,130,d.yes2,'end')+ar(60,109,60,136,'no')+lab(72,126,T.no,'no')+box(0,138,120,d.no2,'end');h=176;}
  else if(d.type==='ififif'){b+=dia(0,4,100,T.sano)+ar(50,40,50,58,'yes')+lab(62,52,T.si,'yes')+ar(101,22,150,22,'no')+lab(122,15,T.no,'no')+box(152,7,90,T.tacho,'bad')+dia(0,60,100,T.mesa)+ar(101,78,150,78,'yes')+lab(122,71,T.si,'yes')+box(152,63,140,T.camionMesas,'end')+ar(50,96,50,114,'no')+lab(62,108,T.no,'no')+dia(0,116,100,T.hierro)+ar(101,134,150,134,'yes')+lab(122,127,T.si,'yes')+box(152,119,140,T.camionHierro,'end')+ar(50,152,50,170,'no')+lab(62,164,T.no,'no')+box(0,172,140,T.camionCajoneras,'end');h=210;}
  else if(d.type==='loop'){b+=box(0,40,110,d.step)+ar(111,55,138,55)+dia(140,37,110,d.q)+ar(251,55,268,55,'yes')+lab(258,47,T.si,'yes')+box(270,40,30,'→','end');
    b+=`<path d="M195 74 L195 96 L55 96 L55 72" class="fa no" marker-end="url(#ah-no)"/>`+lab(125,112,T.no+': '+d.no,'no')+`<text x="270" y="30" class="fl yes" text-anchor="end">${d.yes}</text>`;h=120;}
  else if(d.type==='split'){b+=box(0,40,70,T.entrada)+ar(71,55,92,55)+box(94,40,70,T.repartidor,'acc')+ar(165,50,192,22)+ar(165,60,192,88)+box(194,7,106,d.a)+box(194,73,106,d.b)+lab(176,30,'1','acc')+lab(176,90,'2','acc');h=110;}
  else if(d.type==='par'){b+=box(0,7,60,T.entrada1)+ar(61,22,80,22)+box(82,7,150,d.a)+box(0,73,60,T.entrada2)+ar(61,88,80,88)+box(82,73,150,d.b)+ar(233,22,258,50)+ar(233,88,258,60)+box(260,40,40,T.fin,'end');h=110;}
  else if(d.type==='join'){b+=box(0,7,90,d.a)+box(0,73,90,d.b)+ar(91,22,128,50)+ar(91,88,128,60)+box(130,40,170,d.out,'end');h=110;}
  else if(d.type==='sub'){b+=box(0,7,100,T.tablaCorrederas)+ar(101,22,122,22)+box(124,7,80,T.brazoCajon,'acc')+ar(205,22,226,22)+box(228,7,72,T.cajon)+box(0,73,100,T.tablaCajones)+ar(101,88,122,88)+box(124,73,80,T.brazoMueble,'acc')+ar(205,88,226,88)+box(228,73,72,T.cajonera,'end')+`<path d="M264 38 L264 56 L60 56 L60 70" class="fa" marker-end="url(#ah)"/>`;h=110;}
  return `<svg class="flow" viewBox="0 0 300 ${h}" role="img" aria-label="${T.aria}">${defs}${b}</svg>`;
}
