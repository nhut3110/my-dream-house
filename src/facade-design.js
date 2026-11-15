import {buildExteriorTiles} from './exterior-tiles.js';
import * as T from 'three';
import {HEIGHT,THIRD,GROUND,MASTER_SUITE,SMALL_SUITE,buildingPlot,toWorld,entrySpan} from './design.js';

// An exterior finish study. All dimensions in metres; the parcel and openings stay unchanged.
export const FACADE={name:'Nếp · tropical corner house',band:{height:.22,inset:-.035,outset:.13},
 palette:{ivory:'#e8dfcd',stone:'#c1b8a6',clay:'#b0aa9b',clayLight:'#b89c78',bronze:'#655c4d'},
 windows:[
  {id:'master-front',floor:1,side:'front',x:1.44,z:.05,width:2.08,sill:.95,head:2.55},
  ...[[MASTER_SUITE.ventilationWindow,'master-vent'],[MASTER_SUITE.commonWindow,'common'],[SMALL_SUITE.window,'small']].map(([w,id])=>({...w,id,floor:1,side:'right'})),
  ...GROUND.rightWindows.map((w,i)=>({...w,id:`grandparents-${i}`,floor:0,side:'right'}))
 ]};

// Smooth continuous ribbon, following the actual rounded corner and every change of plot slope.
export const facadePath=buildingPlot.slice(0,-1).map(toWorld);
export function offsetFacadePath(path,distance){return path.map((p,i)=>{
 const normal=(a,b)=>{const l=Math.hypot(b[0]-a[0],b[1]-a[1]);return [(b[1]-a[1])/l,-(b[0]-a[0])/l]};
 const a=normal(path[Math.max(0,i-1)],path[i===0?1:i]),b=i===path.length-1?a:normal(path[i],path[i+1]);
 const n=i===path.length-1?a:b;
 if(i===0||i===path.length-1)return [p[0]+n[0]*distance,p[1]+n[1]*distance];
 const sum=[a[0]+b[0],a[1]+b[1]],den=1+a[0]*b[0]+a[1]*b[1];
 return [p[0]+sum[0]*distance/den,p[1]+sum[1]*distance/den];
})}
export function facadeRibbon(path,inside,outside){return [...offsetFacadePath(path,outside),...offsetFacadePath(path,inside).toReversed()]}


// Cut triangles at every change of wall slope before folding the cladding.
// Merely moving the original extrusion vertices leaves diagonal faces cutting through the wall.
export function foldSideGeometry(geometry){
 let triangles=[];const positions=geometry.getAttribute('position');
 for(let i=0;i<positions.count;i+=3)triangles.push([0,1,2].map(j=>[positions.getX(i+j),positions.getY(i+j),positions.getZ(i+j)]));
 for(const cut of [...new Set(facadePath.map(p=>-p[1]))]){
  const clip=(poly,sign)=>{const out=[];for(let i=0;i<poly.length;i++){
   const a=poly[i],b=poly[(i+1)%poly.length],aa=(a[0]-cut)*sign>=0,bb=(b[0]-cut)*sign>=0;
   if(aa)out.push(a);if(aa!==bb){const t=(cut-a[0])/(b[0]-a[0]);out.push(a.map((v,k)=>v+(b[k]-v)*t));}
  }return out;};
  triangles=triangles.flatMap(tri=>{
   if(!tri.some(p=>p[0]<cut-1e-6)||!tri.some(p=>p[0]>cut+1e-6))return [tri];
   return [-1,1].flatMap(sign=>{const poly=clip(tri,sign);return poly.slice(1,-1).map((_,i)=>[poly[0],poly[i+1],poly[i+2]])});
  });
 }
 const flat=triangles.flat(1).flatMap(([u,y,d])=>[entrySpan(-u)[1]+.118+d,y,-u]);
 const folded=new T.BufferGeometry();folded.setAttribute('position',new T.Float32BufferAttribute(flat,3));folded.computeVertexNormals();return folded;
}

function roundedPath(x,y,w,h,r){const p=new T.Shape();p.moveTo(x+r,y);p.lineTo(x+w-r,y);p.quadraticCurveTo(x+w,y,x+w,y+r);p.lineTo(x+w,y+h-r);p.quadraticCurveTo(x+w,y+h,x+w-r,y+h);p.lineTo(x+r,y+h);p.quadraticCurveTo(x,y+h,x,y+h-r);p.lineTo(x,y+r);p.quadraticCurveTo(x,y,x+r,y);return p}

export function masterBalconyGuardPath(){
 const balconyStart=MASTER_SUITE.balcony.splitX;
 const firstZ=facadePath[0][1]+(facadePath[1][1]-facadePath[0][1])*balconyStart/facadePath[1][0];
 return [[balconyStart,firstZ],...facadePath.filter(p=>p[0]>balconyStart&&p[1]<MASTER_SUITE.balcony.depth),[entrySpan(MASTER_SUITE.balcony.depth)[1]+.095,MASTER_SUITE.balcony.depth]];
}

export function buildFacadeDesign({parents,group,box,shapeSlab,glassParts,M}){
 const material=(color,roughness=.84)=>new T.MeshStandardMaterial({color,roughness});
 const timber=M.oak.clone();timber.color.set('#b5ad9e');
 const ivory=material(FACADE.palette.ivory),stone=material(FACADE.palette.stone),clay=material(FACADE.palette.clay),rib=material(FACADE.palette.clayLight),bronze=material(FACADE.palette.bronze,.55);
 const roots=parents.map((parent,floor)=>{const g=group(parent);g.name=`Mat_dung_Nep_tang_${floor+1}`;g.userData={floor,exteriorFinish:true};glassParts.push({obj:g,floor,hideCut:true});return g});
 // Two unbroken, curved cornices connect both street elevations, with a narrow shadow reveal.
 for(const floor of [0]){
  const root=roots[floor],B=FACADE.band;
  const fascia=shapeSlab(root,facadeRibbon(facadePath,B.inset,B.outset),HEIGHT+.035,B.height,ivory);fascia.name='Dai_vien_bo_lien_mat_truoc_va_hong';
  shapeSlab(root,facadeRibbon(facadePath,-.015,.043),HEIGHT-B.height+.026,.025,bronze);
  const light=shapeSlab(root,facadeRibbon(facadePath,.025,.037),HEIGHT-B.height+.002,.012,M.glow);light.name='LED_giau_duoi_dai_vien';
 }
 // Washable stone skirting above road/porch, split around the escape door rather than crossing it.
 const base=roots[0];
 // One continuous eyebrow and slab edge; no vertical decorative portal at the balcony.
 const front=roots[1],wrapEnd=2.55;
 const wrapPath=[...facadePath.filter(p=>p[1]<wrapEnd),[entrySpan(wrapEnd)[1]+.09,wrapEnd]];
 for(const [top,thickness] of [[3.615,.30],[.345,.31]])shapeSlab(front,facadeRibbon(wrapPath,-.18,.34),top,thickness,ivory).name='Khung_om_goc_ban_cong';
 shapeSlab(front,facadeRibbon(wrapPath,-.12,.285),3.307,.018,M.oak);
 const rearPath=[[entrySpan(wrapEnd)[1]+.09,wrapEnd],...facadePath.filter(p=>p[1]>wrapEnd)];
 shapeSlab(front,facadeRibbon(rearPath,-.035,.13),3.615,.30,ivory).name='Vien_hong_noi_tiep_khong_chong_lop';
 // Warm recessed field behind the front study window, cut out rather than covering glass.
 const inset=roundedPath(.16,.16,2.91,3.25,.20);
 inset.holes.push(new T.Path(roundedPath(.30,.82,2.30,1.87,.10).getPoints(12).toReversed()));
 const infill=new T.Mesh(new T.ExtrudeGeometry(inset,{depth:.07,bevelEnabled:false,curveSegments:12}),clay);
 infill.scale.z=-1;infill.position.z=.04;front.add(infill);
 // Recessed terracotta seam beside the front opening. Ribs are shallow ceramic, not exposed timber.
 box(front,2.88,.16,.004,.34,3.23,.055,clay,.012);
 for(let x=2.745;x<3.04;x+=.064)box(front,x,.18,-.034,.024,3.18,.035,timber,.009);
 // One shared path for the solid privacy base, cap, posts and black handrail.
 // Original straight/arc guards are omitted in perimeter() to avoid double joints.
 const guardPath=masterBalconyGuardPath();
 const guard=group(front);guard.name='Master_Lan_can_tuong_duoi_sat_tren_lien_goc';
 shapeSlab(guard,facadeRibbon(guardPath,-.13,.025),.84,.84,ivory).name='Tuong_chan_chan_bo_lien';
 shapeSlab(guard,facadeRibbon(guardPath,-.145,.035),.865,.035,stone).name='Mu_tuong_lien_goc';
 const centerPath=offsetFacadePath(guardPath,-.05);
 const railCurve=y=>{const c=new T.CurvePath();for(let i=1;i<centerPath.length;i++)c.add(new T.LineCurve3(new T.Vector3(centerPath[i-1][0],y,centerPath[i-1][1]),new T.Vector3(centerPath[i][0],y,centerPath[i][1])));return c;};
 for(const y of [1.12]){
  const tube=new T.Mesh(new T.TubeGeometry(railCurve(y),240,.023,10,false),bronze);tube.castShadow=true;guard.add(tube);
 }
 const rail=railCurve(.9925),count=Math.ceil(rail.getLength()/.115);
 for(let i=0;i<=count;i++){const p=rail.getPointAt(i/count);box(guard,p.x,.855,p.z,.014,.265,.014,bronze);}
 guard.userData={solidHeight:.865,railTop:1.12,continuousCorner:true,lowerRail:false,railColor:FACADE.palette.bronze};
 // An asymmetric rounded balcony niche: a curved head joins the existing dividing wall.
 // No new freestanding pillar and no change to the door, floor or usable balcony depth.
 const niche=group(front);niche.name='Master_Hoc_ban_cong_bo_mem';
 const left=MASTER_SUITE.balcony.splitX-.065,right=entrySpan(.42)[1]+.055;
 const head=new T.Shape();
 head.moveTo(left,3.34);head.lineTo(right,3.34);head.lineTo(right,3.10);
 head.lineTo(left+.66,3.10);head.quadraticCurveTo(left+.13,3.10,left+.13,2.56);
 head.lineTo(left,2.56);head.closePath();
 const arch=new T.Mesh(new T.ExtrudeGeometry(head,{depth:.22,bevelEnabled:false,curveSegments:28}),ivory);
 arch.position.z=-.015;arch.castShadow=arch.receiveShadow=true;niche.add(arch);
 // The vertical return is a facing on the existing partition, not a freestanding post.
 box(niche,left+.065,.34,.095,.13,2.22,.22,ivory);
 // Recessed timber ceiling stops at the masonry, with an inset warm light line.
 const ceiling=[[left+.13,.215],[right-.16,.215],[entrySpan(1.36)[1]-.12,1.36],[left+.13,1.36]];
 shapeSlab(niche,ceiling,3.285,.035,M.oak).name='Tran_go_hoc_ban_cong';
 for(let z=.28;z<1.34;z+=.14)box(niche,(left+right)/2,3.244,z,right-left-.32,.006,.008,bronze);
 box(niche,(left+right)/2,3.238,.29,right-left-.48,.008,.012,M.glow);
 // A compact corner garden balances the broad study window, leaving the doorway clear.
 const garden=group(front,entrySpan(.91)[1]-.34,.91);garden.name='Bon_cay_goc_Master';
 box(garden,0,.02,0,.43,.48,.69,stone,.045);
 box(garden,0,.50,0,.37,.012,.61,M.soil,.018);
 for(let x=-.17;x<=.18;x+=.045)box(garden,x,.065,-.351,.022,.40,.022,timber,.006);
 const branch=(a,b,r)=>{const aa=new T.Vector3(...a),bb=new T.Vector3(...b),d=bb.clone().sub(aa);
  const m=new T.Mesh(new T.CylinderGeometry(r*.65,r,d.length(),8),bronze);
  m.position.copy(aa.add(bb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());garden.add(m);};
 branch([0,.5,0],[-.03,1.63,.01],.026);
 const leafGeo=new T.SphereGeometry(1,8,5);
 for(let i=0;i<7;i++){
  const angle=i*2.4,tip=[Math.cos(angle)*(.18+i%2*.045),1.30+i*.085,Math.sin(angle)*.24];
  branch([-.02,.96+i*.075,0],tip,.011);
  for(let j=0;j<12;j++){
   const a=j*2.4+i,x=tip[0]+Math.cos(a)*.12,y=tip[1]+Math.sin(j*1.7)*.095,z=tip[2]+Math.sin(a)*.10;
   const leaf=new T.Mesh(leafGeo,j%3?M.leaf:M.leaf2);leaf.position.set(x,y,z);
   leaf.scale.set(.042,.09,.018);leaf.rotation.set(.35,a,.5);garden.add(leaf);
  }
 }
 // Match all window reveals and integrate rain hoods. Old separate diagonal awning braces are removed.
 for(const w of FACADE.windows){
  const g=group(roots[w.floor],w.side==='front'?w.x:entrySpan(w.z)[1]+.09,w.z,w.side==='front'?Math.PI:Math.PI/2);g.name=`Khung_cua_va_mai_che_lien_${w.id}`;g.userData={...w,hoodProjection:.30,clearOpening:true};
  const height=w.head-w.sill,half=w.width/2,reveal=w.side==='front'?timber:ivory;
  for(const x of [-half-.065,half+.065])box(g,x,w.sill-.075,.085,.115,height+.15,.17,reveal,.018);
  box(g,0,w.head+.018,.15,w.width+.25,.105,.30,reveal,.018);
  box(g,0,w.head+.005,.14,w.width+.01,.014,.26,M.oak);
  box(g,0,w.sill-.09,.105,w.width+.26,.07,.25,stone,.012);
  box(g,0,w.sill-.098,.195,w.width+.14,.012,.015,bronze);
 }
 // Keep upper side walls uniformly ivory: no overlapping colour skins at window/AC openings.
 const E=THIRD.enclosure;
 // Full-height shading fins turn the open roof into a designed outdoor room.
 // The front stays open to the street; the right rear portion receives the privacy filter.
 const roof=roots[2],screenStart=3.65,screenEnd=6.20;
 for(let zz=screenStart;zz<screenEnd;zz+=.18){
  const fin=group(roof,entrySpan(zz)[1]-.08,zz,Math.PI/2);
  box(fin,0,1.04,0,.045,1.63,.26,ivory,.015);
 }
 const topPath=[...facadePath.filter(p=>p[1]<screenEnd),[entrySpan(screenEnd)[1]+.09,screenEnd]];
 shapeSlab(roof,facadeRibbon(topPath,-.29,.18),2.89,.22,ivory).name='Vien_mai_lon_om_goc_san_thuong';
 shapeSlab(roof,facadeRibbon(topPath,-.255,.14),2.665,.025,M.oak).name='Mat_duoi_mai_go';
 for(const [xx,zz] of [[.18,.12],[5.03,.32]])box(roof,xx,1.04,zz,.11,1.63,.11,ivory,.025);
 // Cap the pavilion side with the same deep architectural edge.
 const roofPath=[...facadePath.filter(p=>p[1]>=E.front&&p[1]<=E.back)];
 roofPath.unshift([entrySpan(E.front)[1]+.09,E.front]);roofPath.push([entrySpan(E.back)[1]+.09,E.back]);
 shapeSlab(roof,facadeRibbon(roofPath,-.10,.20),E.height+.17,.22,ivory).name='Mu_mai_khoi_phong_tho';
 // Warm, protected soffit under the front slab, clear of the gate and porch parking.
 const soffit=group(roots[0]);soffit.name='Tran_hien_nhom_mau_go';
 const soffitPoints=[[.12,.19],[4.72,.19],[4.95,.4],[4.96,2.17],[.12,2.17]];
 shapeSlab(soffit,soffitPoints,HEIGHT-.20,.025,M.oak);
 for(let z=.25;z<2.13;z+=.13)box(soffit,2.52,HEIGHT-.23,z,4.65,.012,.009,bronze);
 buildExteriorTiles({base,front,box,group,shapeSlab,foldSideGeometry,facadePath,facadeRibbon,M});
 // Slim stone cap rather than an extra roof or obstructing screen at the terrace edge.
 const terrace=roots[2],frontOnly=facadePath.filter(p=>p[1]<.58);
 shapeSlab(terrace,facadeRibbon(frontOnly,-.04,.105),.60,.065,ivory).name='Mu_tuong_san_thuong_bo_goc';
 return {roots,palette:{ivory,stone,clay,rib,bronze}};
}
