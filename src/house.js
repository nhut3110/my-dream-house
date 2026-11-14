import {addWindowAwnings,addSmallBalcony} from './exterior-upgrades.js';
import {trailingPlanters} from './trailing-garden.js';
import {displayBookcase,securityCamera} from './home-accessories.js';
import {buildBedroomAirConditioning} from './bedroom-ac.js';
import {buildThirdFloor} from './third-floor.js';
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {plot,HEIGHT,STAIR,levels,GROUND,MIRROR_X,toWorld,HUMAN,LIVING,clipAtZ,entrySpan,SERVICE,LIVING_MIRROR_AXIS,stairUnderside,REAR_FURNITURE,UPPER,buildingPlot,SECOND,UPPER_LAYOUT,SMALL_SUITE,MASTER_SUITE,MASTER_BALCONY} from './design.js';
export const house = new T.Group();house.name='Nha_minh_Phuong_an_01';
export const interiors=[], referencePeople=[], openingAudit=[], floors=[], wallParts=[], glassParts=[], roofs=[], labels=[], assetState={loaded:0,failed:[],expected:0};
const mat=(color,roughness=.75,more={})=>new T.MeshStandardMaterial({color,roughness,...more});
function grain(kind){const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');let seed=21;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};ctx.fillStyle=kind==='wood'?'#b79068':'#e5dfd2';ctx.fillRect(0,0,512,512);for(let i=0;i<6000;i++){const x=rand()*512,y=rand()*512;ctx.strokeStyle=kind==='wood'?`rgba(70,45,20,${rand()*.12})`:`rgba(100,90,70,${rand()*.08})`;ctx.lineWidth=rand()*1.2+.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(kind==='wood'?rand()*85:rand()*3),y+rand()*2);ctx.stroke()}if(kind==='wood'){ctx.strokeStyle='#7e674430';for(let y=0;y<512;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();ctx.beginPath();let xx=(y/64%2)*256;ctx.moveTo(xx,y);ctx.lineTo(xx,y+64);ctx.stroke()}}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(kind==='wood'?2:3,kind==='wood'?2:3);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t}
const woodTex=grain('wood'),stoneTex=grain('stone');
export const M={plaster:mat('#f1eee5'),wood:mat('#c49b70',.65,{map:woodTex}),oak:mat('#d1b38a',.65,{map:woodTex}),stone:mat('#e6e0d3',.85,{map:stoneTex}),dark:mat('#333b35',.48,{metalness:.45}),linen:mat('#d9d3c2',.95),olive:mat('#8b9879',.95),sage:mat('#a6af96'),white:mat('#f8f5ed',.5),black:mat('#18201b',.35),brass:mat('#a68e57',.32,{metalness:.75}),soil:mat('#4f4a36'),leaf:mat('#627b49'),leaf2:mat('#809463'),glass:new T.MeshPhysicalMaterial({color:'#c0d0cd',transparent:true,opacity:.26,roughness:.14,metalness:.05,side:T.DoubleSide,depthWrite:false}),glow:new T.MeshStandardMaterial({color:'#fff1ca',emissive:'#ffe0a0',emissiveIntensity:.8})};
const boxGeo=new T.BoxGeometry(1,1,1);
export function box(parent,x,y,z,w,h,d,m,round=0){let mesh;if(round>0){mesh=new T.Mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(round,w/3,h/3,d/3)),m)}else{mesh=new T.Mesh(boxGeo,m);mesh.scale.set(w,h,d)}mesh.position.set(x,y+h/2,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function cyl(p,x,y,z,r,h,m,r2=r){const mesh=new T.Mesh(new T.CylinderGeometry(r2,r,h,24),m);mesh.position.set(x,y+h/2,z);mesh.castShadow=mesh.receiveShadow=true;p.add(mesh);return mesh}
function rod(p,a,b,r,m){const av=new T.Vector3(...a),bv=new T.Vector3(...b),mid=av.clone().add(bv).multiplyScalar(.5);const mesh=new T.Mesh(new T.CylinderGeometry(r,r,av.distanceTo(bv),10),m);mesh.position.copy(mid);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());mesh.castShadow=true;p.add(mesh);return mesh}
function group(parent,x=0,z=0,rotation=0){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=rotation;parent.add(g);return g}
function shapeSlab(parent,polygon,y,thickness,material,holes=[]){const s=new T.Shape(polygon.map(v=>new T.Vector2(v[0],-v[1])));for(const poly of holes)s.holes.push(new T.Path(poly.map(v=>new T.Vector2(v[0],-v[1]))));const geo=new T.ExtrudeGeometry(s,{depth:thickness,bevelEnabled:false,steps:1});geo.rotateX(-Math.PI/2);const mesh=new T.Mesh(geo,material);mesh.position.y=y-thickness;mesh.receiveShadow=mesh.castShadow=true;parent.add(mesh);return mesh}
function rawWall(p,a,b,h,t=.18,openings=[],material=M.plaster){const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);const g=group(p,a[0],a[1],-Math.atan2(dz,dx));const valid=openings.toSorted((a,b)=>a.start-b.start);let cursor=0;const seg=(start,end,y,height)=>{if(end-start>.001&&height>.001)box(g,(start+end)/2,y,0,end-start,height,t,material)};for(const o of valid){seg(cursor,o.start,0,h);seg(o.start,o.end,0,Math.min(o.bottom,h));seg(o.start,o.end,o.top,Math.max(0,h-o.top));cursor=o.end}seg(cursor,len,0,h);return g}
function wall(p,a,b,h=3.08,t=.12,openings=[],shell=false){const g=rawWall(p,a,b,h,t,openings);g.userData.shell=shell;const low=rawWall(p,a,b,.72,t,openings.filter(o=>o.bottom===0).map(o=>({...o,top:.72})));low.visible=false;wallParts.push({full:g,low,floor:p.userData.floor});return g}
function partition(p,z,doorX=3.65,end=5.22,start=.3){wall(p,[start,z],[end,z],3.08,.1,[{start:doorX-start,end:doorX-start+.9,bottom:0,top:2.25}]);door(p,doorX+.45,z,.9,0)}
function door(p,x,z,w=.9,rot=0){const g=group(p,x,z,rot);const surround=group(g);for(const xx of[-w/2,w/2])box(surround,xx,0,0,.045,2.28,.14,M.oak);box(surround,0,2.24,0,w+.08,.045,.14,M.oak);const leaf=group(g,-w/2,0,-Math.PI*.32);box(leaf,w/2,.015,0,w-.03,2.2,.04,M.oak);box(leaf,w-.13,1.01,-.035,.12,.025,.02,M.brass);glassParts.push({obj:g,floor:p.userData.floor,hideCut:true})}
// Shared bedroom door used on both storeys: full-height oak sliding panel.
function bedroomSlidingDoor(p,x,z,width,name,rotation=0){
 const g=group(p,x,z,rotation);g.name=name;
 box(g,0,.025,0,width,2.15,.035,M.oak,.015);
 box(g,width/2-.105,.94,-.025,.025,.18,.02,M.dark);
 rod(g,[-width*.612,2.24,0],[width*.612,2.24,0],.018,M.dark);
 glassParts.push({obj:g,floor:p.userData.floor,hideCut:true});return g;
}
function windowOn(p,a,b,bottom=.85,top=2.65,mullion=true){const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);const g=group(p,a[0],a[1],-Math.atan2(dz,dx));box(g,len/2,bottom,0,len,top-bottom,.025,M.glass);for(const x of(mullion?[0,len/2,len]:[0,len]))box(g,x,bottom,0,.045,top-bottom,.075,M.dark);for(const y of[bottom,top])box(g,len/2,y-.02,0,len,.045,.075,M.dark);glassParts.push({obj:g,floor:p.userData.floor,hideCut:true});return g}
function facade(p,z,left=.45,right=5.25){if(p.userData.floor===0)[left,right]=entrySpan(z);wall(p,[left,z],[right,z],HEIGHT-UPPER.slabThickness,.16,[{start:.35,end:right-left-.35,bottom:0,top:2.7}],true);const glazing=windowOn(p,[left+.35,z],[right-.35,z],0,2.7);if(p.userData.floor===0){glazing.name='Cua_kinh_truot_vao_phong_khach';glassParts.find(part=>part.obj===glazing).hideCut=true;box(glazing,1.05,0,0,.04,2.7,.075,M.dark);box(glazing,.97,.95,-.055,.025,.28,.025,M.dark)}for(let x=left+.45;x<right-.3;x+=.09){const curtain=box(p,x,.08,z+.08,.045,2.55,.05,M.linen);curtain.castShadow=false;glassParts.push({obj:curtain,floor:p.userData.floor,hideCut:true});if(x>left+1)break}}
function railing(p,a,b,h=1.05){const len=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(len/.13);for(let i=0;i<=n;i++){const t=i/n;rod(p,[a[0]+(b[0]-a[0])*t,0,a[1]+(b[1]-a[1])*t],[a[0]+(b[0]-a[0])*t,h,a[1]+(b[1]-a[1])*t],.012,M.dark)}rod(p,[a[0],h,a[1]],[b[0],h,b[1]],.024,M.dark)}
export function plant(p,x,z,height=.95){const g=group(p,x,z);cyl(g,0,0,0,height*.16,height*.3,M.stone,height*.2);cyl(g,0,height*.3,0,height*.165,.02,M.soil);for(let i=0;i<9;i++){const a=i*2.3999,len=height*(.4+(i%3)*.12),bx=Math.cos(a)*height*.24,bz=Math.sin(a)*height*.24;rod(g,[0,height*.3,0],[bx,len,bz],.009,M.leaf);const leaf=new T.Mesh(new T.SphereGeometry(1,12,8),i%2?M.leaf:M.leaf2);leaf.scale.set(height*.1,height*.26,height*.035);leaf.position.set(bx,len+.07,bz);leaf.rotation.set(Math.sin(a)*.5,a,Math.cos(a)*.65);leaf.castShadow=true;g.add(leaf)}return g}
function rug(p,x,z,w,d){box(p,x,.007,z,w,.012,d,M.linen,.03);for(let i=0;i<5;i++){box(p,x-w/2+.05+i*.025,.02,z,.008,.003,d-.12,M.oak)}return null}
function livingRoom(p){const mirrored=group(p);mirrored.name='Phong_khach_sofa_trai_TV_phai';mirrored.position.x=LIVING_MIRROR_AXIS;mirrored.scale.x=-1;p=mirrored;
 const carpet=group(p,LIVING.rug.x,LIVING.rug.z);carpet.name='Tham_2950x2700';
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#cec8bb';ctx.fillRect(0,0,256,256);
 for(let i=0;i<256;i+=2){ctx.strokeStyle=i%4?'#d8d3c7':'#bfb9ab';ctx.globalAlpha=.32;ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,256);ctx.stroke();ctx.globalAlpha=.16;ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(256,i);ctx.stroke()}ctx.globalAlpha=1;
 const weave=new T.CanvasTexture(c);weave.wrapS=weave.wrapT=T.RepeatWrapping;weave.repeat.set(5,5);weave.colorSpace=T.SRGBColorSpace;weave.anisotropy=8;
 const fabric=mat('#c9c4b8',1,{map:weave});box(carpet,0,.008,0,LIVING.rug.width,.014,LIVING.rug.length,fabric,.04);
 // Low, handle-free credenza on the left party wall; no freestanding TV pedestal.
 const wallSlope=(entrySpan(GROUND.tv.z+.1)[1]-entrySpan(GROUND.tv.z-.1)[1])/.2;
 const tv=group(p,LIVING_MIRROR_AXIS-(entrySpan(GROUND.tv.z)[1]-.09-.225),GROUND.tv.z,-Math.atan(wallSlope));tv.name='TV_ben_phai';tv.userData={wallGap:.01,wallAligned:true};
 box(tv,-.14,.05,0,.12,2.3,2.4,mat('#dedbd2'),.025);
 box(tv,0,.16,0,.43,.31,2.2,M.oak,.035);box(tv,.015,.47,0,.46,.025,2.24,mat('#d6c8b6'),.01);
 for(let i=0;i<4;i++){box(tv,.223,.185,-.825+i*.55,.012,.26,.538,M.linen,.008)}
 box(tv,.025,.92,0,.055,.82,1.45,M.dark,.012);box(tv,.057,.935,0,.008,.79,1.42,mat('#171d20',.16));
 box(tv,.075,.915,0,.015,.004,.06,M.dark);box(tv,.05,.495,-.82,.24,.018,.32,M.stone,.01);box(tv,.05,.515,-.82,.22,.018,.3,M.sage,.01);
 cyl(tv,.04,.495,.88,.075,.16,M.stone,.045);
 // Coffee table: 850 x 1400 mm, 450+ mm clear of sofa front.
 const table=group(p,LIVING.coffee.x,LIVING.coffee.z);table.name='Ban_tra_700x950';
 for(const z of[-.29,.29])box(table,0,.025,z,.5,.29,.14,M.oak,.06);
 box(table,0,.315,0,LIVING.coffee.width,.055,LIVING.coffee.length,mat('#d8d1c4',.65,{map:stoneTex}),.12);
 box(table,-.05,.37,.18,.29,.025,.37,M.linen,.012);box(table,-.04,.397,.18,.27,.015,.35,M.sage,.008);
 cyl(table,.04,.37,-.24,.13,.018,M.dark);cyl(table,.04,.388,-.24,.065,.09,M.white);
 sectionalSofa(p);floorLamp(p,4.55,5.17);plant(p,.45,5.2,.85);
}
function lStair(p,{arrivalRail=true}={}){
 const {x,z,width,landing,firstRisers,middleRisers,lastRisers,rise,tread}=STAIR;
 const g=group(p);g.name='Cau_thang_chu_L';
 const firstY=firstRisers*rise,turnZ=z+width,entryX=x+landing+(firstRisers-1)*tread,rearZ=UPPER.landingStart,rearY=(firstRisers+middleRisers)*rise;
 const material=mat('#d4c6b2',.72),metal=mat('#454945',.55,{metalness:.35});
 function cap(name,cx,cz,y,w,d){const t=group(g);t.name=name;box(t,cx,y-.065,cz,w,.065,d,material,.009)}
 function platform(name,cx,cz,y,w,d){const t=group(g);t.name=name;box(t,cx,y-.18,cz,w,.115,d,M.plaster);cap(name+'_mat',cx,cz,y,w,d)}
 function handrail(points){for(let i=1;i<points.length;i++)rod(g,points[i-1],points[i],.022,M.oak)}
 for(let i=0;i<firstRisers-1;i++){const cx=entryX-(i+.5)*tread,y=(i+1)*rise;box(g,cx,0,z+width/2,tread,y-.065,width,M.oak);cap('Bac_dau_'+(i+1),cx,z+width/2,y,tread,width);}
 box(g,x+landing/2,0,z+width/2,landing,firstY-.065,width,M.oak);cap('Chieu_nghi_dau',x+landing/2,z+width/2,firstY,landing,width);
 const storage=group(g);storage.name='Tu_duoi_bon_bac_dau';for(const xx of[x+.24,x+.71]){box(storage,xx,.07,z-.014,.445,.46,.025,M.linen,.012);box(storage,xx+.15,.32,z-.033,.018,.11,.018,M.dark)}
 // Continuous stepped concrete profile: no overlapping face plates or floating risers.
 const count=middleRisers-1,firstTop=(firstRisers+1)*rise,lastTop=(firstRisers+count)*rise;
 const profile=[[turnZ,firstTop-.185],[rearZ,lastTop-.185]];
 for(let i=count-1;i>=0;i--){const y=(firstRisers+i+1)*rise-.065;profile.push([turnZ+(i+1)*tread,y],[turnZ+i*tread,y])}
 const shape=new T.Shape(profile.map(([zz,y])=>new T.Vector2(zz,y))),geometry=new T.ExtrudeGeometry(shape,{depth:width,bevelEnabled:false,steps:1});geometry.rotateY(-Math.PI/2);
 const body=new T.Mesh(geometry,M.plaster);body.position.x=x+width;body.castShadow=body.receiveShadow=true;body.name='Than_ve_thang_lien_khoi';g.add(body);
 const middleRail=[[x+width-.02,firstY+.95,turnZ]];
 for(let i=0;i<count;i++){const cz=turnZ+(i+.5)*tread,y=(firstRisers+i+1)*rise;cap('Bac_doc_'+(firstRisers+i+1),x+width/2,cz,y,width,tread);rod(g,[x+width-.02,y,cz],[x+width-.02,y+.95,cz],.012,metal);middleRail.push([x+width-.02,y+.95,cz])}
 middleRail.push([x+width-.02,rearY+.95,rearZ]);handrail(middleRail);
 platform('Chieu_nghi_quay_phai',x+width/2,rearZ+landing/2,rearY,width,landing);
 // Final three treads and the twentieth rise turn right, towards the room.
 const finalRail=[[x,rearY+.95,rearZ+landing-.02],[x+width,rearY+.95,rearZ+landing-.02]];
 for(let i=0;i<lastRisers-1;i++){const cx=x+width+(i+.5)*tread,y=(firstRisers+middleRisers+i+1)*rise;box(g,cx,rearY-.18,rearZ+landing/2,tread,y-.065-(rearY-.18),landing,M.plaster);cap('Bac_re_phai_'+(i+1),cx,rearZ+landing/2,y,tread,landing);if(arrivalRail)rod(g,[cx,y,rearZ+landing-.02],[cx,y+.95,rearZ+landing-.02],.012,metal);finalRail.push([cx,y+.95,rearZ+landing-.02])}
 finalRail.push([UPPER.landingX,HEIGHT+UPPER.guardHeight,rearZ+landing-.02]);if(arrivalRail)handrail(finalRail);
 platform('Chieu_toi_re_phai',UPPER.landingX+landing/2,rearZ+landing/2,HEIGHT,landing,landing);
 g.userData={firstRisers,middleRisers,lastRisers,risers:STAIR.risers,width,entry:[entryX,0,z+width/2],turn:[x+width/2,rearY,rearZ+landing/2],exit:[UPPER.landingX+landing/2,HEIGHT,rearZ+landing/2],rightTurn:true};
 return g;
}
function serviceRooms(p){
 const {kitchen:k,fridge:f,dining:d,rear:r}=SERVICE;
 const g=group(p);g.userData.floor=0;g.name='Bep_ban_an_va_hai_phong_cuoi';
 // Bespoke joinery follows the underside continuously, with an inset fridge bay.
 const pantry=group(g);pantry.name='Tu_bep_phu_duoi_thang';
 function wedge(parent,x0,x1,z0,z1,y0,h0,h1,material){const shape=new T.Shape([new T.Vector2(z0,y0),new T.Vector2(z1,y0),new T.Vector2(z1,h1),new T.Vector2(z0,h0)]);const geo=new T.ExtrudeGeometry(shape,{depth:x1-x0,bevelEnabled:false,steps:1});geo.rotateY(-Math.PI/2);const mesh=new T.Mesh(geo,material);mesh.position.x=x1;mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh)}
 const top=z=>stairUnderside(z)-.025,back=entrySpan(8)[0]+.09+.01,front=1.17,fridgeStart=f.z-f.width/2-.035,fridgeEnd=f.z+f.width/2+.035;
 function fittedCabinets(z0,z1){const count=Math.ceil((z1-z0)/.5),span=(z1-z0)/count;
  for(let i=0;i<count;i++){const a=z0+i*span,b=a+span;wedge(pantry,back,front,a,b,.07,top(a),top(b),M.oak);
   wedge(pantry,front,front+.018,a+.009,b-.009,.1,top(a+.009)-.015,top(b-.009)-.015,M.linen);
   const h=Math.min(1.05,(top(a)+.1)/2);box(pantry,front+.024,h,(a+b)/2,.018,.1,.018,M.dark,.005);
  }
 }
 fittedCabinets(STAIR.z+STAIR.width,fridgeStart);
 // Only a 25 mm end panel after the fridge; no tall cabinet toward the WC.
 const endPanel=group(pantry);endPanel.name='Vach_ket_thuc_tu_lanh';
 wedge(endPanel,back,front,fridgeEnd,REAR_FURNITURE.cabinetEnd,.07,top(fridgeEnd),top(REAR_FURNITURE.cabinetEnd),M.oak);
 wedge(pantry,back,front,fridgeStart,fridgeEnd,f.height+.085,top(fridgeStart),top(fridgeEnd),M.oak);
 wedge(pantry,front,front+.018,fridgeStart+.009,fridgeEnd-.009,f.height+.105,top(fridgeStart+.009)-.015,top(fridgeEnd-.009)-.015,M.linen);
 box(pantry,front+.025,f.height+.12,f.z,.015,.015,.55,M.dark);
 const kitchen=group(g);kitchen.name='Bep_nau_rua_ben_phai';kitchen.position.x=k.mirrorAxis;kitchen.scale.x=-1;
 const moduleCount=4,step=(k.end-k.start)/moduleCount;
 for(let i=0;i<moduleCount;i++){const z=k.start+(i+.5)*step;
  box(kitchen,k.x,.08,z,k.depth,.77,step-.009,M.oak,.012);
  box(kitchen,k.x+k.depth/2+.015,.12,z,.025,.69,step-.025,M.linen,.009);
  for(const y of[.36,.61])box(kitchen,k.x+k.depth/2+.03,y,z,.009,.008,step-.04,M.dark);
 }
 box(kitchen,k.x+.0175,.86,(k.start+k.end)/2,k.depth+.035,.04,k.end-k.start,mat('#d6d1c7',.65),.012);
 // Recessed basin illusion with rim and bowl at a realistic counter height.
 box(kitchen,k.x,.901,k.sinkZ,.47,.012,.6,M.dark,.05);
 box(kitchen,k.x,.909,k.sinkZ,.4,.01,.51,mat('#929b98',.36,{metalness:.6}),.045);
 rod(kitchen,[k.x-.2,.91,k.sinkZ-.28],[k.x-.2,1.16,k.sinkZ-.28],.016,M.dark);
 rod(kitchen,[k.x-.2,1.16,k.sinkZ-.28],[k.x+.02,1.16,k.sinkZ-.28],.016,M.dark);
 box(kitchen,k.x,.902,k.hobZ,.51,.013,.56,M.black,.025);
 for(const z of[-.14,.14]){const ring=new T.Mesh(new T.TorusGeometry(.095,.006,8,40),mat('#8c9691',.5));ring.rotation.x=Math.PI/2;ring.position.set(k.x,.918,k.hobZ+z);kitchen.add(ring)}
 // Shallow hood stays beneath the higher portion of the stair slab.
 box(kitchen,k.x,1.62,k.hobZ,.5,.12,.58,M.dark,.025);
 box(kitchen,k.x-.17,1.74,k.hobZ,.16,.16,.3,M.dark,.01);
 for(const [z,h] of[[7.1,2.3],[7.7,2.3],[8.25,2.3]]){box(kitchen,k.x-k.depth/2+.17,1.48,z,.34,h-1.48,.5,M.oak,.012);box(kitchen,k.x-k.depth/2+.35,1.5,z,.018,h-1.52,.48,M.linen,.006)}
 const kitchenZ=(k.start+k.end)/2,slope=(entrySpan(kitchenZ+.1)[1]-entrySpan(kitchenZ-.1)[1])/.2;
 for(const part of kitchen.children){part.position.x-=k.x;part.position.z-=kitchenZ;}
 kitchen.position.set(entrySpan(kitchenZ)[1]-.09-k.depth/2-.01,0,kitchenZ);kitchen.rotation.y=Math.atan(slope);kitchen.userData={wallGap:.01,wallAligned:true};
 // Scribe the joinery to both facade segments, including the slight corner near z=8.18.
 kitchen.updateMatrix();
 for(const part of kitchen.children){
  if(!part.geometry)continue;part.updateMatrix();
  const transform=kitchen.matrix.clone().multiply(part.matrix),inverse=transform.clone().invert(),geometry=part.geometry.clone(),positions=geometry.attributes.position,v=new T.Vector3();
  for(let i=0;i<positions.count;i++){
   v.fromBufferAttribute(positions,i).applyMatrix4(transform);
   v.x+=entrySpan(v.z)[1]-(entrySpan(kitchenZ)[1]+slope*(v.z-kitchenZ));
   v.applyMatrix4(inverse);positions.setXYZ(i,v.x,v.y,v.z);
  }
  geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();part.geometry=geometry;
 }

 const fridge=group(g,f.x,f.z);fridge.name='Tu_lanh_hai_canh_912x716';
 box(fridge,0,0,0,f.depth,f.height,f.width,mat('#aeb8b3',.35,{metalness:.45}),.035);
 for(const side of[-1,1]){box(fridge,f.depth/2+.012,.05,side*f.width/4,.025,f.height-.09,f.width/2-.018,mat('#c4cdc7',.32,{metalness:.35}),.02);box(fridge,f.depth/2+.038,.85,side*.045,.025,.43,.024,M.dark,.009)}
 box(fridge,f.depth/2+.03,.005,0,.018,.035,f.width-.06,M.dark);
 // Four seats; length runs front-to-back and keeps the kitchen working aisle separate.
 const eating=group(g,d.x,d.z,d.rotation);eating.name='Ban_an_4_nguoi';
 box(eating,0,.74,0,d.width,.055,d.length,M.oak,.09);
 for(const z of[-.56,.56])box(eating,0,.03,z,.5,.71,.12,M.wood,.035);
 for(const side of[-1,1])for(const z of[-.48,.48]){const chair=group(eating,side*.72,z,side===1?Math.PI/2:-Math.PI/2);box(chair,0,.44,0,.43,.065,.43,M.linen,.045);box(chair,0,.48,.18,.43,.36,.065,M.oak,.04);for(const x of[-.16,.16])for(const zz of[-.16,.16])box(chair,x,.025,zz,.035,.415,.035,M.wood,.008)}
 cyl(eating,0,.795,0,.075,.18,M.stone);pendant(g,d.x,d.z);
 // Rear bedroom is on the right. The compact WC is left, with the basin outside.
 const [left,right]=entrySpan(r.start),endSpan=entrySpan(r.end);
 wall(g,[r.entryX,r.start],[right,r.start],3.08,.1);
 wall(g,[r.entryX,r.start],[r.entryX,r.wcStart],3.08,.1,[{start:r.bedDoorZ-.425-r.start,end:r.bedDoorZ+.425-r.start,bottom:0,top:2.2}]);
 wall(g,[r.splitX,r.wcStart],[r.entryX,r.wcStart],3.08,.1);
 wall(g,[r.splitX,r.wcStart],[r.splitX,13.16],3.08,.1);
 const wcLeft=entrySpan(r.wcStart)[0];
 wall(g,[wcLeft,r.wcStart],[1.22,r.wcStart],3.08,.1,[{start:r.wcDoorX-.375-wcLeft,end:1.22-wcLeft,bottom:0,top:2.2}]);
 wall(g,[1.22,r.wcStart],[r.splitX,r.wcStart],3.08,.1,[{start:0,end:r.wcDoorX+.375-1.22,bottom:0,top:2.2}]);
 function slidingDoor(x,z,width,name){const leaf=group(g,x,z);leaf.name=name;box(leaf,0,.025,0,width,2.15,.035,M.oak,.015);box(leaf,width/2-.09,.94,-.025,.025,.18,.02,M.dark);rod(leaf,[-width*.6,2.24,0],[width*.6,2.24,0],.018,M.dark);glassParts.push({obj:leaf,floor:0,hideCut:true})}
 bedroomSlidingDoor(g,r.entryX,r.bedDoorZ,.85,'Cua_truot_phong_ngu',Math.PI/2);slidingDoor(r.wcDoorX,r.wcStart,.75,'Cua_truot_WC_cuoi');
 const bedroom=group(g);bedroom.name='Phong_ngu_ben_phai';
 shapeSlab(bedroom,[[r.entryX+.05,r.start+.05],[right-.05,r.start+.05],[endSpan[1]-.05,r.end],[r.splitX+.05,r.end],[r.splitX+.05,r.wcStart+.05],[r.entryX+.05,r.wcStart+.05]],.01,.008,M.oak);
 for(const bed of REAR_FURNITURE.beds)singleBed(bedroom,bed.x,bed.z).rotation.y=bed.rotation;
 const w=REAR_FURNITURE.wardrobe,closet=group(bedroom,w.x,w.z,w.rotation);closet.name='Tu_quan_ao_phong_ong_ba';
 box(closet,0,.035,0,w.width,w.height-.035,w.depth,M.oak,.018);
 for(const side of[-1,1]){box(closet,side*w.width/4,.075,-w.depth/2-.012,w.width/2-.014,w.height-.13,.024,M.linen,.01);box(closet,side*.045,.95,-w.depth/2-.03,.018,.3,.016,M.dark,.005)}
 box(closet,0,.045,-w.depth/2-.028,w.width-.035,.018,.026,M.dark);
 const wc=group(g);wc.name='WC_nho_ben_trai';
 box(wc,(r.splitX+left)/2,.006,(r.wcStart+r.end)/2,r.splitX-left-.05,.012,r.end-r.wcStart-.04,mat('#b8c0b7',.9));
 const toilet=group(wc,.61,11.73,-Math.PI/2);box(toilet,0,.03,.22,.36,.65,.2,M.white,.06);cyl(toilet,0,.08,-.08,.15,.25,M.white);const bowl=new T.Mesh(new T.SphereGeometry(1,24,16),M.white);bowl.position.set(0,.35,-.08);bowl.scale.set(.21,.16,.3);toilet.add(bowl);const seat=new T.Mesh(new T.TorusGeometry(.15,.025,12,40),M.white);seat.rotation.x=Math.PI/2;seat.scale.y=1.3;seat.position.set(0,.49,-.08);toilet.add(seat);
 box(wc,.98,.02,12.65,1.12,.025,.84,M.stone,.025);
 const screen=box(wc,.98,.06,12.21,1.12,1.9,.018,M.glass);glassParts.push({obj:screen,floor:0,hideCut:true});
 rod(wc,[.3,.16,12.65],[.3,2.03,12.65],.014,M.dark);rod(wc,[.3,2.03,12.65],[.55,2.03,12.65],.014,M.dark);cyl(wc,.55,2.005,12.65,.085,.025,M.dark);
 const basinZ=10.55;
 const basin=group(g,.51,basinZ);basin.name='Lavabo_ngoai_WC';
 box(basin,0,.43,0,.38,.32,.42,M.oak,.025);box(basin,0,.76,0,.4,.07,.44,M.white,.035);cyl(basin,0,.83,0,.15,.07,M.white);
 rod(basin,[-.17,.89,0],[-.17,1.08,0],.012,M.dark);rod(basin,[-.17,1.08,0],[0,1.08,0],.012,M.dark);
 const mirror=new T.Mesh(new T.CircleGeometry(.28,48),mat('#aebcba',.15,{metalness:.8}));mirror.rotation.y=Math.PI/2;mirror.name='Guong_lavabo_ngoai_WC';mirror.position.set(entrySpan(basinZ)[0]+.095,1.55,basinZ);g.add(mirror);

}
function sectionalSofa(p){
 const g=group(p,GROUND.sofa.x,GROUND.sofa.z);g.name='Sofa_chu_L_2300x1620';
 const cloth=mat('#d2cbbf',.94,{roughness:.94}),seam=mat('#b7afa1',1);
 const w=GROUND.sofa.length,depth=GROUND.sofa.depth,chaise=GROUND.sofa.chaiseDepth;
 // Main run follows the right wall; chaise returns at the rear, leaving the entrance open.
 for(const x of[-.34,.34])for(const z of[-1.02,1.02])cyl(g,x,.025,z,.025,.13,M.dark);
 for(const x of[-1.0,-.35])for(const z of[.48,.99])cyl(g,x,.025,z,.025,.13,M.dark);
 box(g,0,.14,0,depth,.19,w,cloth,.075);
 box(g,-(chaise-depth)/2,.14,w/2-.43,chaise,.19,.86,cloth,.075);
 // Separate cushions and narrow piping keep the construction readable at human scale.
 for(const z of[-.72,0]){box(g,-.045,.33,z,.76,.15,.69,cloth,.075);box(g,-.045,.327,z,.77,.016,.7,seam,.04)}
 box(g,-.39,.33,w/2-.43,1.46,.15,.78,cloth,.08);
 box(g,.35,.36,0,.2,.45,w-.08,cloth,.075);
 box(g,-.03,.34,-w/2+.065,.86,.31,.13,cloth,.055);
 box(g,-.39,.34,w/2-.065,1.46,.31,.13,cloth,.055);
 for(const z of[-.7,.03,.73]){const cushion=box(g,.19,.48,z,.18,.31,.64,cloth,.065);cushion.rotation.z=-.12}
 const pillow=box(g,.05,.48,-.86,.22,.3,.38,M.linen,.075);pillow.rotation.set(.12,0,-.2);
 const pillow2=box(g,.04,.48,.81,.22,.31,.38,M.olive,.07);pillow2.rotation.set(-.16,0,-.15);
}
function sideTable(p,x,z){cyl(p,x,.42,z,.25,.055,M.oak);cyl(p,x,0,z,.045,.42,M.dark);cyl(p,x,0,z,.17,.025,M.dark);cyl(p,x,.475,z,.06,.12,M.white);}
function coffee(p,x,z){const g=group(p,x,z);box(g,0,.34,0,1.1,.07,.65,M.oak,.12);for(const xx of[-.38,.38])for(const zz of[-.2,.2])box(g,xx,0,zz,.055,.34,.055,M.wood);box(g,-.18,.41,.08,.27,.025,.21,M.sage);cyl(g,.27,.41,-.1,.085,.12,M.stone);}
function floorLamp(p,x,z){cyl(p,x,0,z,.19,.035,M.dark);rod(p,[x,.03,z],[x,1.5,z],.017,M.brass);cyl(p,x,1.42,z,.27,.3,M.linen,.16);cyl(p,x,1.42,z,.21,.012,M.glow);}
function artwork(p,x,z,w=1){const g=group(p,x,z);box(g,0,1.32,0,w,.88,.045,M.oak);box(g,0,1.36,-.026,w-.08,.8,.015,M.linen);const arc=new T.Mesh(new T.CircleGeometry(.25,48,0,Math.PI),M.olive);arc.position.set(.05,1.7,-.038);g.add(arc);box(g,-.12,1.4,-.04,.16,.45,.008,M.stone);glassParts.push({obj:g,floor:p.userData.floor,hideCut:true});return g}
function bed(p,x,z,w=1.6,nightstands=true){const g=group(p,x,z);g.name='Giuong_1600x2000';for(const xx of[-w/2+.15,w/2-.15])for(const zz of[-.8,.8])box(g,xx,.04,zz,.08,.16,.08,M.dark);box(g,0,.17,0,w+.12,.19,2.12,M.wood,.05);box(g,0,.36,0,w,.22,2,M.white,.09);box(g,0,.57,.26,w+.025,.07,1.4,M.linen,.045);box(g,0,.64,.65,w+.05,.045,.47,M.olive,.02);box(g,0,.18,-1.08,w+.22,1.02,.1,M.oak,.04);for(let i=-1;i<=1;i+=2){box(g,i*w*.24,.59,-.67,w*.42,.14,.43,M.white,.08)}if(nightstands)for(const xx of[-w/2-.33,w/2+.33]){box(g,xx,.05,-.73,.45,.39,.43,M.oak,.035);box(g,xx,.45,-.73,.42,.025,.42,M.stone);cyl(g,xx,.475,-.73,.065,.15,M.linen)}return g}
function wardrobe(p,x,z,w=1.7,rot=0){const g=group(p,x,z,rot);box(g,0,0,0,w,2.55,.58,M.oak);for(let i=0;i<4;i++){box(g,-w/2+(i+.5)*w/4,.05,-.305,w/4-.012,2.46,.025,M.linen);box(g,-w/2+(i+.5)*w/4+.1,.9,-.332,.015,.45,.018,M.brass)}return g}
function desk(p,x,z,w=1.2,d=.5){box(p,x,.73,z,w,.055,d,M.oak,.02);for(const xx of[-w/2+.09,w/2-.09])box(p,x+xx,0,z,.04,.73,d-.1,M.dark);box(p,x,.79,z, .35,.025,.25,M.sage);const g=group(p,x,z+.5);box(g,0,.44,0,.42,.06,.42,M.olive,.05);box(g,0,.47,.18,.42,.38,.055,M.olive,.04);for(const xx of[-.16,.16])for(const zz of[-.16,.16])box(g,xx,0,zz,.035,.44,.035,M.oak)}
function kitchen(p){const z=9.1;for(let i=0;i<4;i++){const zz=8.75+i*.4;box(p,.65,.04,zz,.65,.82,.38,M.oak);box(p,.65,.87,zz,.7,.055,.4,M.stone);box(p,1,.13,zz,.025,.67,.36,M.linen);box(p,1.025,.62,zz,.018,.02,.16,M.brass);box(p,.56,1.45,zz,.45,.65,.38,M.linen);box(p,.81,1.48,zz,.02,.59,.36,M.oak)}box(p,.81,.927,8.75,.36,.012,.42,M.dark,.05);box(p,.81,.93,8.75,.3,.012,.34,M.stone,.04);rod(p,[.51,.95,8.85],[.51,1.21,8.85],.018,M.brass);rod(p,[.51,1.21,8.85],[.74,1.21,8.85],.018,M.brass);box(p,.68,.925,9.55,.48,.01,.45,M.black);for(const zz of[9.41,9.68])for(const xx of[.54,.8])cyl(p,xx,.937,zz,.085,.009,M.dark);box(p,1.012,.2,9.55,.018,.49,.43,M.black);box(p,1.036,.62,9.55,.025,.02,.33,M.brass);box(p,4.8,0,7.5,.7,1.94,.68,M.white,.04);box(p,4.44,.04,7.5,.02,1.87,.61,M.stone);box(p,4.416,.35,7.72,.025,.5,.025,M.dark);box(p,1,.95,8.92,.025,.012,2.04,M.glow);}
function dining(p,x,z){p=group(p,x,z,Math.PI/2);x=0;z=0;box(p,x,.73,z,1.45,.065,.8,M.oak,.07);for(const xx of[-.52,.52])for(const zz of[-.25,.25])box(p,x+xx,.04,z+zz,.055,.69,.055,M.wood);for(const side of[-1,1])for(const xx of[-.43,.43]){const g=group(p,x+xx,z+side*.7,side===1?0:Math.PI);box(g,0,.43,0,.4,.06,.4,M.olive,.04);box(g,0,.47,.16,.4,.35,.06,M.oak,.04);for(const a of[-.15,.15])for(const b of[-.15,.15])box(g,a,0,b,.035,.43,.035,M.wood)}cyl(p,x,.8,z,.065,.18,M.stone);}
function bathroom(p){wall(p,[3.95,5],[3.95,7.35],3.08,.1,[{start:.18,end:.98,bottom:0,top:2.2}]);door(p,3.95,5.58,.8,Math.PI/2);wall(p,[3.95,7.35],[5.26,7.35]);box(p,4.6,.005,6.15,1.2,.02,2.24,M.stone);const g=group(p,4.7,6.75);box(g,0,.02,.18,.35,.4,.28,M.white,.06);const bowl=new T.Mesh(new T.SphereGeometry(1,24,12),M.white);bowl.scale.set(.22,.18,.32);bowl.position.set(0,.32,-.12);g.add(bowl);const seat=new T.Mesh(new T.TorusGeometry(.16,.025,12,36),M.white);seat.rotation.x=Math.PI/2;seat.scale.y=1.4;seat.position.set(0,.47,-.14);g.add(seat);box(p,4.84,.67,5.46,.64,.15,.43,M.oak,.04);box(p,4.84,.82,5.46,.57,.08,.37,M.white,.07);rod(p,[4.96,.9,5.58],[4.96,1.11,5.58],.014,M.brass);box(p,4.88,1.22,5.15,.62,.8,.035,M.glass);}
function singleBed(p,x,z){const g=group(p,x,z,Math.PI);g.name='Giuong_don_1000x2000';box(g,0,.08,0,1.06,.23,2.02,M.oak,.04);box(g,0,.31,0,1,.21,2,M.white,.07);box(g,0,.52,.28,1.01,.045,1.4,M.linen,.035);box(g,0,.57,.65,1.02,.025,.48,M.olive,.02);box(g,0,.08,-1.035,1.08,.87,.07,M.oak,.035);box(g,0,.55,-.67,.65,.13,.4,M.white,.06);return g}
function scooter(p,x,z,color){const g=group(p,x,z);g.name='Xe_may_1850x680';const paint=mat(color,.32,{metalness:.18});for(const zz of[-.64,.64]){const tire=new T.Mesh(new T.TorusGeometry(.24,.065,12,32),M.dark);tire.rotation.y=Math.PI/2;tire.position.set(0,.3,zz);g.add(tire);const hub=new T.Mesh(new T.CylinderGeometry(.16,.16,.09,20),M.stone);hub.rotation.z=Math.PI/2;hub.position.copy(tire.position);g.add(hub)}box(g,0,.35,.16,.5,.36,1.05,paint,.13);box(g,0,.69,.16,.48,.09,.83,M.black,.08);box(g,0,.43,-.48,.45,.39,.26,paint,.07);rod(g,[0,.55,-.6],[0,1.01,-.61],.028,M.dark);rod(g,[-.34,1.01,-.61],[.34,1.01,-.61],.024,M.dark);box(g,0,.85,-.64,.26,.17,.12,M.white,.03);for(const side of[-1,1]){rod(g,[side*.26,1.01,-.61],[side*.29,1.16,-.65],.009,M.dark);const mirror=new T.Mesh(new T.SphereGeometry(1,12,8),M.dark);mirror.scale.set(.07,.045,.025);mirror.position.set(side*.29,1.16,-.65);g.add(mirror)}return g}
function fitBox(obj,size){const box=new T.Box3().setFromObject(obj),actual=box.getSize(new T.Vector3());obj.scale.set(size[0]/actual.x,size[1]/actual.y,size[2]/actual.z);return obj}
function human(p,x,z){const g=group(p,x,z);g.name='Nguoi_tham_chieu_1700mm';const skin=mat('#8d978a',.95);const head=new T.Mesh(new T.SphereGeometry(.1,20,16),skin);head.position.set(0,1.59,0);g.add(head);const torso=new T.Mesh(new T.CapsuleGeometry(.15,.28,6,16),skin);torso.position.set(0,1.15,0);g.add(torso);for(const side of[-1,1]){rod(g,[side*.085,.1,0],[side*.085,.94,0],.065,skin);rod(g,[side*.18,1.3,0],[side*.23,.87,.02],.045,skin);box(g,side*.085,0,-.04,.11,.09,.24,skin,.025)}fitBox(g,[HUMAN.shoulder,HUMAN.height,.26]);referencePeople.push(g);g.visible=true;return g}
function frontGate(p,a,b){const len=Math.hypot(b[0]-a[0],b[1]-a[1]),g=group(p,a[0],a[1],-Math.atan2(b[1]-a[1],b[0]-a[0]));g.name='Cong_san_hien';g.position.y=GROUND.porchLevel;const w=len-.12,h=GROUND.securityHeight;
 for(const x of[.03,len-.03])box(g,x,0,0,.075,h,.09,M.dark);
 for(let x=.13;x<len-.1;x+=.085)box(g,x,.08,0,.035,h-.14,.05,M.dark);
 for(const y of[.09,h-.065])box(g,len/2,y,0,w,.045,.06,M.dark);
 box(g,len/2,.95,-.04,.025,.2,.025,M.brass);g.userData={height:h};}

function pendant(p,x,z){rod(p,[x,2.25,z],[x,3.08,z],.008,M.dark);cyl(p,x,2.12,z,.24,.18,M.linen,.13);cyl(p,x,2.115,z,.18,.006,M.glow)}
function terrace(p,front=false){const lo=front?.85:8.8,hi=front?2.4:12.8;plant(p,.65,lo,.95);plant(p,4.85,lo,1.25);if(!front){for(let i=0;i<3;i++)plant(p,.55,9.7+i*1.1,.65);box(p,4.63,0,12.48,1.1,2.25,.85,M.oak);box(p,4.63,.05,11.98,.65,.86,.65,M.white,.04);const drum=new T.Mesh(new T.TorusGeometry(.19,.04,16,40),M.dark);drum.position.set(4.63,.48,11.64);p.add(drum);box(p,4.65,2.3,11.55,1.3,.12,2.6,M.oak);box(p,4.1,0,10.5,.055,2.3,.055,M.dark);box(p,5.15,0,10.5,.055,2.3,.055,M.dark);for(let i=0;i<3;i++)rod(p,[1.45,1.9,11.3+i*.2],[3.45,1.9,11.3+i*.2],.009,M.dark);for(const x of[1.45,3.45])rod(p,[x,0,11.5],[x,1.9,11.5],.018,M.dark);box(p,1.1,.02,9.12,1.8,.4,.48,M.stone,.025);box(p,1.1,.42,9.12,1.8,.035,.5,M.oak);cyl(p,2.8,.56,9.3,.4,.045,M.oak);cyl(p,2.8,0,9.3,.04,.56,M.dark)}else{for(let i=0;i<9;i++)box(p,.6+i*.53,2.65,1.25,.07,.12,1.1,M.oak);for(const x of[.6,4.84])box(p,x,0,1.8,.07,2.65,.07,M.dark)}}
function furnishSecondFloor(level,p){
 p.userData.floor=1;perimeter(level,1);
 const S=SECOND,master=group(p),small=group(p),common=group(p);master.name='Tang2_Master';small.name='Tang2_Phong_ngu_nho';common.name='Tang2_Sinh_hoat_chung';
 const left=.2,right=5.25;
 // Front master suite, rear compact suite, and a clear hall alongside the stair.
 facade(p,S.balconyEnd,...entrySpan(S.balconyEnd));
 wall(p,[left,S.masterEnd],[right,S.masterEnd],3.0,.1,[{start:2.15-left,end:3.1-left,bottom:0,top:2.25}]);door(p,2.625,S.masterEnd,.95);
 wall(p,[S.smallLeft,S.smallStart],[right,S.smallStart],3.0,.1);
 wall(p,[S.smallLeft,S.smallStart],[S.smallLeft,13.1],3.0,.1,[{start:10.75-S.smallStart,end:11.6-S.smallStart,bottom:0,top:2.25}]);const roomDoor=group(p,S.smallLeft,11.175,Math.PI/2);roomDoor.name='Cua_truot_phong_ngu_nho';box(roomDoor,0,.02,0,.85,2.2,.035,M.oak,.012);box(roomDoor,.3,.95,-.03,.018,.2,.018,M.dark);glassParts.push({obj:roomDoor,floor:1,hideCut:true});
 const masterFloor=clipAtZ(clipAtZ(buildingPlot,S.balconyEnd+.08,false),S.masterEnd-.05,true).map(toWorld);
 shapeSlab(master,masterFloor,.012,.012,M.wood);shapeSlab(small,[[S.smallLeft+.05,S.smallStart+.05],[5.24,S.smallStart+.05],[5.2,13.1],[S.smallLeft+.05,13.1]],.012,.012,M.wood);
 const masterBed=bed(master,3.5,3.05,1.8);masterBed.name='Master_giuong_1800x2000';
 const masterCloset=wardrobe(master,.55,2.55,1.7,-Math.PI/2);masterCloset.name='Master_tu_1700x580';
 const work=group(master,4.87,5.2,-Math.PI/2);work.name='Master_ban_lam_viec';desk(work,0,0);box(work,0,.82,0,.47,.31,.025,M.dark,.008);box(work,0,.79,.09,.38,.015,.15,M.black,.006);
 rug(master,3.3,3.5,2.7,2.5);
 const smallBed=bed(small,3.96,12.25,1.4,false);smallBed.rotation.y=-Math.PI/2;smallBed.name='Phong_nho_giuong_1400x2000';
 const smallCloset=wardrobe(small,2.6,9.9,1.6,-Math.PI/2);smallCloset.name='Phong_nho_tu_1600x580';
 const smallDesk=group(small,3.37,11.17,Math.PI);smallDesk.name='Phong_nho_ban_ghe_nho';desk(smallDesk,0,0,.8,.4);
 function ensuite(parent,b,name,backDoor=false){
  const bath=group(parent);bath.name=name;
  shapeSlab(bath,[[b.x1+.05,b.z1+.05],[b.x2,b.z1+.05],[b.x2,b.z2-.05],[b.x1+.05,b.z2-.05]],.024,.012,mat('#b9c8c2',.9));
  if(!backDoor){wall(p,[b.x1,b.z1],[b.x2,b.z1],3,.1);wall(p,[b.x2,b.z1],[b.x2,b.z2],3,.1,[{start:1.1,end:1.85,bottom:0,top:2.2}]);door(p,b.x2,b.z1+1.475,.75,Math.PI/2)}
  else{wall(p,[b.x1,b.z1],[b.x1,b.z2],3,.1);wall(p,[b.x1,b.z2],[b.x2,b.z2],3,.1,[{start:.5,end:1.2,bottom:0,top:2.2}]);const leaf=group(p,b.x1+.85,b.z2);leaf.name='Cua_truot_WC_phong_nho';box(leaf,0,.02,0,.7,2.17,.035,M.oak,.012);box(leaf,.24,.95,-.03,.018,.2,.018,M.dark);glassParts.push({obj:leaf,floor:1,hideCut:true})}
  const shower=backDoor?{x:(b.x1+b.x2)/2,z:b.z1+.46,w:b.x2-b.x1-.12,d:.82}:{x:b.x1+.55,z:b.z2-.5,w:.94,d:.86};
  box(bath,shower.x,.04,shower.z,shower.w,.035,shower.d,M.stone,.025);
  const glass=box(bath,shower.x,.075,backDoor?shower.z+.43:shower.z-.45,shower.w,1.95,.018,M.glass);glassParts.push({obj:glass,floor:1,hideCut:true});
  rod(bath,[shower.x,.2,shower.z-.25],[shower.x,2.05,shower.z-.25],.012,M.dark);cyl(bath,shower.x,2.04,shower.z-.12,.09,.025,M.dark);
  const toilet=group(bath,b.x2-.32,backDoor?b.z2-.65:b.z1+.68,Math.PI/2);toilet.name='Bon_cau';box(toilet,0,.04,.2,.34,.64,.18,M.white,.05);const bowl=new T.Mesh(new T.SphereGeometry(1,24,16),M.white);bowl.scale.set(.2,.15,.29);bowl.position.set(0,.36,-.08);toilet.add(bowl);cyl(toilet,0,.43,-.08,.145,.025,M.white);
  const vx=backDoor?b.x1+.26:b.x1+.48,vz=backDoor?b.z2-.3:b.z1+.32;
  box(bath,vx,.35,vz,.43,.4,.4,M.oak,.015);box(bath,vx,.76,vz,.46,.06,.42,M.white,.03);cyl(bath,vx,.82,vz,.14,.06,M.white);rod(bath,[vx,.87,vz-.15],[vx,1.04,vz-.15],.012,M.dark);
  const mirror=new T.Mesh(new T.CircleGeometry(.22,48),mat('#a7bab7',.18,{metalness:.8}));mirror.position.set(vx,1.48,backDoor?b.z2-.075:b.z1+.075);if(backDoor)mirror.rotation.y=Math.PI;bath.add(mirror);
 }
 ensuite(master,S.masterBath,'WC_rieng_Master');ensuite(small,S.smallBath,'WC_rieng_Phong_nho',true);
 function bean(x,z,color,rotation){const g=group(common,x,z,rotation);g.name='Ghe_luoi';const fabric=mat(color,1);for(const [px,py,pz,sx,sy,sz] of [[0,.27,0,.46,.25,.48],[0,.48,.23,.42,.4,.28]]){const mesh=new T.Mesh(new T.SphereGeometry(1,32,20),fabric);mesh.position.set(px,py,pz);mesh.scale.set(sx,sy,sz);mesh.rotation.x=-.18;mesh.castShadow=mesh.receiveShadow=true;g.add(mesh)}}
 rug(common,3.9,7.65,2.4,2.25);bean(3.25,7.35,'#a7ad92',-.35);bean(4.7,7.55,'#cfb594',.55);cyl(common,4,0,8.3,.06,.36,M.dark);cyl(common,4,.36,8.3,.38,.055,M.oak);box(common,4,.42,8.3,.24,.02,.18,M.sage,.01);plant(common,4.95,6.45,.95);
 // Balcony belongs only to the front master suite.
 const balcony=group(p);balcony.name='Ban_cong_Master';const deck=clipAtZ(buildingPlot,S.balconyEnd-.08,true).map(toWorld);shapeSlab(balcony,deck,.008,.008,mat('#c9c3b3',.9));plant(balcony,4.7,.95,.8);cyl(balcony,1.1,.02,.85,.27,.055,M.oak);cyl(balcony,1.1,0,.85,.035,.45,M.dark);
 for(const [text,x,z] of [['Master · Giường 1,8 m',3.5,3],['WC master',1,4.7],['Ban công',2.5,.8],['Ghế lười · Bàn',3.8,7.7],['Phòng ngủ nhỏ',3.5,12],['WC riêng',4.5,9.9],['Sảnh lên tầng',1.7,10.9]])labels.push({text,point:new T.Vector3(MIRROR_X-x,.15,z),floor:1});
}

function furnishSmallUpperRoom(p){
 const S=SMALL_SUITE,b=S.bath;
 const room=group(p);room.userData.floor=1;room.name='Tang2_Phong_nho_noi_that';
 const bath=group(room);bath.name='WC_phong_nho_theo_net_xanh';bath.userData.floor=1;
 // Existing room perimeter forms the front/rear/left boundaries; add only the shared partition.
 wall(bath,[b.right,b.front],[b.right,b.back],HEIGHT-UPPER.slabThickness,.1,[{start:b.doorStart-b.front,end:b.doorStart+b.doorWidth-b.front,bottom:0,top:2.28}]);
 bedroomSlidingDoor(bath,b.right,b.doorStart+b.doorWidth/2,b.doorWidth,'Cua_lua_WC_phong_nho',Math.PI/2);
 const tile=mat('#b9c6bf',.86);
 shapeSlab(bath,[[b.left,b.front],[b.right-.05,b.front],[b.right-.05,b.back],[b.left,b.back]],.018,.018,tile);
 // Shower at the rear, with an open access beside the fixed glass panel.
 const shower=group(bath,.98,12.58);shower.name='Sen_tam_phong_nho';
 box(shower,0,.02,0,1.38,.025,.88,M.stone,.025);
 const screen=box(bath,.64,.045,12.11,.72,1.95,.018,M.glass);glassParts.push({obj:screen,floor:1,hideCut:true});
 rod(bath,[.28,.045,12.11],[.28,2.02,12.11],.012,M.dark);rod(bath,[.28,2.02,12.11],[1.0,2.02,12.11],.012,M.dark);
 rod(bath,[.72,.85,12.98],[.72,2.08,12.98],.012,M.dark);rod(bath,[.72,2.08,12.98],[.72,2.08,12.72],.012,M.dark);cyl(bath,.72,2.065,12.72,.09,.025,M.dark);
 box(bath,.72,1.03,12.97,.15,.035,.035,M.dark,.01);
 const drain=box(bath,1.4,.047,12.83,.2,.006,.055,M.dark,.005);drain.name='Thoat_san_WC';
 const toilet=group(bath,.65,11.55,-Math.PI/2);toilet.name='Bon_cau_phong_nho';
 box(toilet,0,.03,.22,.36,.67,.18,M.white,.045);
 const bowl=new T.Mesh(new T.SphereGeometry(1,32,20),M.white);bowl.scale.set(.22,.18,.31);bowl.position.set(0,.32,-.12);toilet.add(bowl);
 const seat=new T.Mesh(new T.TorusGeometry(.16,.023,12,48),M.white);seat.rotation.x=Math.PI/2;seat.scale.y=1.45;seat.position.set(0,.48,-.14);toilet.add(seat);
 box(toilet,0,.704,.22,.08,.006,.025,M.brass,.003);
 const vanity=group(bath,1.18,10.76);vanity.name='Lavabo_WC_phong_nho';
 box(vanity,0,.36,0,.62,.39,.4,M.oak,.018);box(vanity,0,.76,0,.65,.045,.43,M.stone,.015);
 const sink=new T.Mesh(new T.TorusGeometry(.135,.025,12,48),M.white);sink.rotation.x=Math.PI/2;sink.scale.x=1.25;sink.position.set(0,.825,0);vanity.add(sink);
 cyl(vanity,0,.79,0,.13,.025,M.white);rod(vanity,[.2,.81,-.12],[.2,1.03,-.12],.012,M.dark);rod(vanity,[.2,1.03,-.12],[.07,1.03,-.12],.012,M.dark);
 const mirror=new T.Mesh(new T.CircleGeometry(.25,64),mat('#b7c6c3',.12,{metalness:.85}));mirror.position.set(1.18,1.46,10.51);bath.add(mirror);
 box(bath,1.18,1.88,10.52,.42,.025,.045,M.glow,.01);
 const sleeping=group(room);sleeping.name='Giuong_tu_va_ban_phong_nho';
 const B=S.bed;
 const frame=bed(sleeping,B.x,B.z,B.width,false);frame.rotation.y=B.rotation;frame.name='Giuong_phong_nho_1400x2000';
 // Wardrobe sits against the stepped front wall, facing into the room.
 const W=S.wardrobe;const closet=wardrobe(sleeping,W.x,W.z,W.width,Math.PI);closet.name='Tu_ao_phong_nho_1900x580';
 const D=S.desk;const work=group(sleeping,D.x,D.z,-Math.PI/2);work.name='Ban_phong_nho_720x400';desk(work,0,0,D.width,D.depth);
 for(const x of [S.bed.x-.94,S.bed.x+.94]){box(sleeping,x,.04,12.68,.32,.43,.34,M.oak,.025);box(sleeping,x,.47,12.68,.34,.025,.36,M.stone,.012);cyl(sleeping,x,.495,12.68,.055,.16,M.linen)}
 room.userData={bath:S.bath,bed:S.bed,wardrobe:S.wardrobe,desk:S.desk};
}

function furnishMasterSuite(p){
 const S=MASTER_SUITE,b=S.bath,g=group(p);g.name='Tang2_Master_noi_that';g.userData.floor=1;
 // Keep enlarged footprint; return to walk-in shower and place the WC door towards wardrobes.
 const bath=group(g);bath.name='WC_master_mo_rong_co_sen';bath.userData.floor=1;
 wall(bath,[b.left,b.front],[b.right,b.front],HEIGHT-UPPER.slabThickness,.1);
 wall(bath,[b.right,b.front],[b.right,b.back],HEIGHT-UPPER.slabThickness,.1,[{start:b.doorStart-b.front,end:b.doorStart+b.doorWidth-b.front,bottom:0,top:2.28}]);
 bedroomSlidingDoor(bath,b.right,b.doorStart+b.doorWidth/2,b.doorWidth,'Cua_lua_WC_master',Math.PI/2);
 shapeSlab(bath,[[b.left,b.front+.05],[b.right-.05,b.front+.05],[b.right-.05,b.back],[b.left,b.back]],.018,.018,mat('#c3c9c1',.9));
 const Q=S.shower,shower=group(bath);shower.name='Khu_tam_dung_master';
 box(shower,(Q.left+Q.right)/2,.02,(Q.front+Q.back)/2,Q.right-Q.left,.025,Q.back-Q.front,M.stone,.02);
 const screen=box(shower,Q.right,.045,4.82,.018,1.95,.72,M.glass);glassParts.push({obj:screen,floor:1,hideCut:true});
 rod(shower,[Q.right,.045,5.18],[Q.right,2.01,5.18],.012,M.dark);rod(shower,[Q.right,2.01,4.46],[Q.right,2.01,5.18],.012,M.dark);
 rod(shower,[.33,.85,4.85],[.33,2.08,4.85],.012,M.dark);rod(shower,[.33,2.08,4.85],[.67,2.08,4.85],.012,M.dark);cyl(shower,.67,2.065,4.85,.09,.025,M.dark);
 box(shower,.33,1.03,4.85,.035,.035,.17,M.dark,.008);box(shower,.75,.047,5.03,.23,.006,.05,M.dark,.004);
 shower.userData={width:Q.right-Q.left,depth:Q.back-Q.front,entrance:4.46-Q.front};
 const toilet=group(bath,1.7,4.83);toilet.name='Bon_cau_master';box(toilet,0,.03,.2,.35,.65,.18,M.white,.04);
 const bowl=new T.Mesh(new T.SphereGeometry(1,32,20),M.white);bowl.scale.set(.21,.17,.3);bowl.position.set(0,.32,-.12);toilet.add(bowl);
 const seat=new T.Mesh(new T.TorusGeometry(.15,.023,12,40),M.white);seat.rotation.x=Math.PI/2;seat.scale.y=1.4;seat.position.set(0,.47,-.14);toilet.add(seat);
 const V=S.washbasin,vanity=group(bath,V.x,V.z,Math.PI);vanity.name='Lavabo_master_1100x450';
 box(vanity,0,.34,0,V.length,.42,V.depth,M.oak,.02);box(vanity,0,.77,0,V.length+.02,.045,V.depth+.02,M.stone,.015);
 for(const x of[-.265,.265])box(vanity,x,.38,-V.depth/2-.012,.51,.33,.02,M.linen,.008);
 const basin=new T.Mesh(new T.TorusGeometry(.16,.028,16,64),M.white);basin.rotation.x=Math.PI/2;basin.scale.x=1.7;basin.position.set(0,.85,-.015);vanity.add(basin);
 const bottom=cyl(vanity,0,.81,-.015,.15,.025,M.white);bottom.scale.x=1.6;
 rod(vanity,[.36,.815,.14],[.36,1.04,.14],.012,M.dark);rod(vanity,[.36,1.04,.14],[.14,1.04,.14],.012,M.dark);
 box(bath,V.x,1.05,3.72,1.04,.85,.012,mat('#afbfbc',.12,{metalness:.85}),.005);box(bath,V.x,1.97,3.74,.85,.025,.045,M.glow,.008);
 // Headboard on the left; the screen faces the foot of the bed across the open aisle.
 const B=S.bed,masterBed=bed(g,B.x,B.z,B.width,false);masterBed.rotation.y=B.rotation;masterBed.name='Giuong_master_1800x2000';
 for(const z of S.nightstands.zs){
  const N=S.nightstands,tab=group(g,N.x,z);tab.name='Tab_dau_giuong_master';
  box(tab,0,.04,0,N.depth,N.height-.04,N.width,M.oak,.015);box(tab,.006,N.height,0,N.depth+.015,.02,N.width+.015,M.stone,.008);
  box(tab,N.depth/2+.005,.1,0,.012,.3,N.width-.025,M.linen,.005);box(tab,N.depth/2+.014,.33,0,.018,.012,.08,M.brass,.003);
  const plateX=entrySpan(z)[0]+.015,socket=group(g,plateX,z);socket.name='O_cam_doi_dau_giuong';
  box(socket,0,.74,0,.012,.12,.18,M.white,.004);
  for(const zz of[-.045,.045])for(const shift of[-.012,.012])box(socket,.008,.785,zz+shift,.004,.018,.004,M.dark,.001);
  box(socket,.008,.823,0,.004,.008,.024,M.dark,.001);
 }
 const pc=group(g,S.pc.x,S.pc.z);pc.name='Ban_PC_master_1850x600';
 box(pc,0,.735,0,S.pc.width,.055,S.pc.depth,M.oak,.02);
 for(const x of [-.78,.78])box(pc,x,.025,0,.04,.71,.48,M.dark);
 box(pc,-.12,.84,-.08,.78,.43,.035,M.dark,.015);box(pc,-.12,.858,-.056,.74,.39,.008,mat('#233a3a',.3));box(pc,-.12,.79,-.07,.035,.09,.035,M.dark);box(pc,-.12,.785,-.06,.22,.012,.14,M.dark);
 box(pc,-.16,.793,.16,.46,.015,.14,M.dark,.008);box(pc,.23,.792,.17,.055,.018,.08,M.dark,.018);
 box(pc,.68,.79,-.01,.23,.43,.36,M.dark,.02);box(pc,.68,.84,.176,.17,.32,.006,M.black,.01);
 for(const y of [1,1.13]){const ring=new T.Mesh(new T.TorusGeometry(.048,.004,8,36),M.sage);ring.position.set(.68,y,.182);pc.add(ring)}
 // Chair tucked under the desk keeps the passage usable beside the bed.
 const chair=group(g,S.pc.x,S.pc.chairZ);chair.name='Ghe_ban_PC_master';
 box(chair,0,.43,0,.46,.07,.43,M.olive,.045);box(chair,0,.48,.19,.45,.48,.055,M.olive,.04);cyl(chair,0,.1,0,.025,.33,M.dark);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;rod(chair,[0,.1,0],[Math.cos(a)*.23,.06,Math.sin(a)*.23],.012,M.dark);cyl(chair,Math.cos(a)*.23,.025,Math.sin(a)*.23,.025,.035,M.dark)}
 const W=S.wardrobe,closet=wardrobe(g,W.x,W.z,W.width,Math.PI/2);closet.name='Tu_ao_master_ben_phai_1300x580';
 const E=S.endWardrobe,endCloset=wardrobe(g,E.x,E.z,E.width);endCloset.name='Tu_ao_master_theo_dai_xanh_1800x580';
 // Follow the actual sloping facade; panel, bracket and screen stay attached in cutaway view.
 const slope=(entrySpan(S.tv.z+.1)[1]-entrySpan(S.tv.z-.1)[1])/.2,angle=Math.atan(slope),screenOffset=S.tv.depth/2-.03;
 const tv=group(g,entrySpan(S.tv.z)[1]-S.tv.depth/2-.04,S.tv.z+screenOffset*Math.sin(angle),Math.PI/2+angle);tv.name='He_tu_TV_master';
 const panel=box(tv,0,0,S.tv.depth/2+.02,S.tv.length+.12,2.12,.04,M.plaster,.012);panel.name='Tam_op_TV_sat_tuong';
 box(tv,0,.05,0,S.tv.length,.43,S.tv.depth,M.oak,.025);box(tv,0,.48,0,S.tv.length+.025,.025,S.tv.depth+.02,M.stone,.012);
 for(let i=0;i<3;i++)box(tv,-S.tv.length/2+(i+.5)*S.tv.length/3,.08,-S.tv.depth/2-.012,S.tv.length/3-.012,.36,.025,M.linen,.008);
 box(tv,0,1.22,S.tv.depth/2-.005,.26,.18,.015,M.dark,.004);
 const screenBox=box(tv,0,1.02,screenOffset,1.3,.75,.04,M.dark,.015);screenBox.name='TV_master_gan_tuong';
 box(tv,0,1.04,screenOffset-.025,1.25,.7,.008,mat('#192b2d',.25));
 tv.userData={wallMounted:true,wallGap:.01,alignedZ:S.bed.z};
 labels.push({text:'WC master',point:new T.Vector3(MIRROR_X-1.1,.15,4.5),floor:1},{text:'Bàn PC',point:new T.Vector3(MIRROR_X-S.pc.x,.15,.6),floor:1},{text:'Tủ áo chữ L',point:new T.Vector3(MIRROR_X-4,.15,5.9),floor:1});
 g.userData={bed:S.bed,bath:S.bath,pc:S.pc,balcony:S.balcony};
}

function perimeter(p,index){
 for(let i=0;i<plot.length;i++){
  if(i===1){const arc=buildingPlot.slice(1,-3);for(let j=1;j<arc.length;j++){const aa=arc[j-1],bb=arc[j];if(index===0){wall(p,aa,bb,GROUND.securityHeight+GROUND.porchLevel,.14,[],true)}else rod(p,[aa[0],1.05,aa[1]],[bb[0],1.05,bb[1]],.024,M.dark)}if(index!==0)for(let j=0;j<arc.length;j++)if(j%4===0||j===arc.length-1){const a=arc[j];rod(p,[a[0],0,a[1]],[a[0],1.05,a[1]],.012,M.dark)}continue}if(i===2)continue;
  let a=plot[i],b=i===0?buildingPlot[1]:plot[(i+1)%plot.length];const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);
  a=[a[0]+dz/len*.095,a[1]-dx/len*.095];b=[b[0]+dz/len*.095,b[1]-dx/len*.095];
  if(i<3){
   if(index===0){
    if(i===0){const start=.46,end=start+GROUND.gateOpening+.12;wall(p,a,b,GROUND.securityHeight+GROUND.porchLevel,.14,[{start,end,bottom:0,top:GROUND.securityHeight+GROUND.porchLevel}],true);frontGate(p,[a[0]+dx/len*start,a[1]+dz/len*start],[a[0]+dx/len*end,a[1]+dz/len*end])}
    else wall(p,a,b,GROUND.securityHeight+GROUND.porchLevel,.14,[],true);
   }else if(index===1&&i===0){
    const splitX=MIRROR_X-MASTER_SUITE.balcony.splitX,t=(splitX-a[0])/(b[0]-a[0]),cut=[splitX,a[1]+t*(b[1]-a[1])];
    const length=Math.hypot(cut[0]-a[0],cut[1]-a[1]),vx=(cut[0]-a[0])/length,vz=(cut[1]-a[1])/length;
    wall(p,a,cut,HEIGHT-UPPER.slabThickness,.18,[{start:.4,end:2.48,bottom:.95,top:2.55}],true);
    windowOn(p,[a[0]+vx*.4,a[1]+vz*.4],[a[0]+vx*2.48,a[1]+vz*2.48],.95,2.55);
    openingAudit.push({floor:1,kind:'window',side:'front',zone:'master-pc'});railing(p,cut,b);
   }else railing(p,a,b);continue;
  }
  if(index===2){const cuts=[0,1];for(const z of[1.92,8.5]){let t=(z-a[1])/(b[1]-a[1]);if(t>0&&t<1)cuts.push(t)}cuts.sort((a,b)=>a-b);for(let j=0;j<cuts.length-1;j++){const aa=[a[0]+(b[0]-a[0])*cuts[j],a[1]+(b[1]-a[1])*cuts[j]],bb=[a[0]+(b[0]-a[0])*cuts[j+1],a[1]+(b[1]-a[1])*cuts[j+1]],mid=(aa[1]+bb[1])/2;wall(p,aa,bb,mid>1.92&&mid<8.5?3.08:1,.18,[],true)}continue}
  if(index===1&&i===3){
   const t=(MASTER_SUITE.balcony.depth-a[1])/(b[1]-a[1]),cut=[a[0]+(b[0]-a[0])*t,MASTER_SUITE.balcony.depth];
   railing(p,a,cut);
   const length=Math.hypot(b[0]-cut[0],b[1]-cut[1]),vx=(b[0]-cut[0])/length,vz=(b[1]-cut[1])/length,windows=[];
   for(const [w,zone] of [[MASTER_SUITE.ventilationWindow,'master-ventilation'],[MASTER_SUITE.commonWindow,'common-study']]){
    const c=length*(w.z-cut[1])/(b[1]-cut[1]),start=Math.max(0,c-w.width/2),end=Math.min(length,c+w.width/2);
    if(end<=start)continue;
    windows.push({start,end,bottom:w.sill,top:w.head});
    windowOn(p,[cut[0]+vx*start,cut[1]+vz*start],[cut[0]+vx*end,cut[1]+vz*end],w.sill,w.head,w!==MASTER_SUITE.commonWindow);
    openingAudit.push({floor:1,kind:'window',edge:i,z:w.z,side:'right',zone,width:w.width,sill:w.sill,head:w.head});
   }
   wall(p,cut,b,HEIGHT-UPPER.slabThickness,.18,windows,true);continue;
  }
  const openings=[];
  // Left and rear are adjoining walls. Only the right elevation receives windows/escape door.
  if(i===3||i===4){const windows=index===0?GROUND.rightWindows:[MASTER_SUITE.commonWindow,SMALL_SUITE.window];
   for(const w of windows){const c=len*(w.z-a[1])/(b[1]-a[1]),start=Math.max(0,c-w.width/2),end=Math.min(len,c+w.width/2);if(end-start<.03)continue;openings.push({start,end,bottom:w.sill,top:w.head});openingAudit.push({floor:index,kind:"window",edge:i,z:w.z,side:"right"});windowOn(p,[a[0]+dx/len*start,a[1]+dz/len*start],[a[0]+dx/len*end,a[1]+dz/len*end],w.sill,w.head)}
   if(index===0&&GROUND.exit.z>Math.min(a[1],b[1])&&GROUND.exit.z<Math.max(a[1],b[1])){const c=len*(GROUND.exit.z-a[1])/(b[1]-a[1]),start=c-GROUND.exit.width/2,end=c+GROUND.exit.width/2;openings.push({start,end,bottom:0,top:2.2});openingAudit.push({floor:index,kind:"exit",edge:i,z:GROUND.exit.z,side:"right"});const x=a[0]+dx/len*c;door(p,x,GROUND.exit.z,GROUND.exit.width,-Math.PI/2);box(p,x+.15,.012,GROUND.exit.z,.3,.012,.9,M.sage)}
  }
  if(index===1&&i===4){
   const B=SMALL_SUITE.balcony,c1=len*(B.front-a[1])/(b[1]-a[1]),c2=len*(B.back-a[1])/(b[1]-a[1]);
   openings.push({start:Math.min(c1,c2),end:Math.max(c1,c2),bottom:0,top:HEIGHT-UPPER.slabThickness});
  }
  wall(p,a,b,HEIGHT-UPPER.slabThickness,.18,openings,true);
 }
}
const hole=[[.27,3.0],[1.43,3.0],[1.43,8.28],[.27,8.28]],lightwell=[[2.78,7.6],[3.65,7.6],[3.65,8.45],[2.78,8.45]];
for(let index=0;index<1;index++){
 const level=new T.Group();level.position.y=index*HEIGHT;level.userData.floor=index;level.name=levels[index].name;house.add(level);floors.push(level);
 shapeSlab(level,clipAtZ(plot,GROUND.glassLine,false),0,.35,M.stone);perimeter(level,index);
 const p=new T.Group();p.userData.floor=index;p.position.x=MIRROR_X;p.scale.x=-1;level.add(p);interiors.push(p);
 if(index<2){
  facade(p,index===0?GROUND.glassLine:1.75);
  if(index===0){
   // Porch is a separate outside forecourt between the gate and glass door.
   const yard=clipAtZ(buildingPlot,GROUND.glassLine,true).map(toWorld);
   const porch=group(p);porch.name='Hien_2300_cao_do_am300';
   shapeSlab(porch,yard,GROUND.porchLevel,.15,mat('#bbbdb1',.95));
   // Close the lower wall bases at the lowered porch without changing the parcel.
   for(let i=0;i<buildingPlot.length;i++){const a=buildingPlot[i],b=buildingPlot[(i+1)%buildingPlot.length];if(Math.min(a[1],b[1])>=GROUND.glassLine)continue;let end=b,start=a;
    if(a[1]>GROUND.glassLine){const t=(GROUND.glassLine-b[1])/(a[1]-b[1]);start=[b[0]+(a[0]-b[0])*t,GROUND.glassLine]}
    if(b[1]>GROUND.glassLine){const t=(GROUND.glassLine-a[1])/(b[1]-a[1]);end=[a[0]+(b[0]-a[0])*t,GROUND.glassLine]}
    const base=group(level);base.position.y=GROUND.porchLevel;const length=Math.hypot(end[0]-start[0],end[1]-start[1]);
    rawWall(base,start,end,.3,.19,i===0?[{start:.46,end:.46+GROUND.gateOpening+.12,bottom:0,top:.3}]:[]);
   }
   const [left,right]=entrySpan(GROUND.glassLine),steps=group(p);steps.name='Hai_bac_150mm';
   box(steps,(left+right)/2,-.3,GROUND.glassLine-.15,right-left-.65,.15,.3,M.stone);
   box(steps,(left+right)/2,.001,GROUND.glassLine+.15,right-left-.65,.012,.3,M.stone);
   for(const bike of GROUND.parking){
    const holder=group(p,bike.x,bike.z,bike.angle);holder.name='Honda_LEAD_1844x714x1132';holder.position.y=GROUND.porchLevel+.005;
    const model=fitBox(scooter(new T.Group(),0,0,'#a7b5aa'),[bike.width,bike.height,bike.length]);
    const bounds=new T.Box3().setFromObject(model),center=bounds.getCenter(new T.Vector3());
    model.position.set(-center.x,-bounds.min.y,-center.z);holder.add(model);holder.userData={...bike};
   }
   box(p,.9,.018,GROUND.glassLine+.35,.85,.01,.32,M.olive);
   const shoes=group(p,4.82,1.65,Math.PI/2);shoes.name='Ke_giay_hien_800x280';shoes.position.y=GROUND.porchLevel;
   for(const y of[.06,.29,.52,.75])box(shoes,0,y,0,.8,.025,.28,M.oak,.008);
   for(const x of[-.385,.385])box(shoes,x,.06,0,.03,.7,.28,M.oak,.008);
   for(const x of[-.22,.15])for(const side of[-.045,.045])box(shoes,x+side,.32,-.015,.065,.045,.2,M.linen,.02);
   securityCamera({parent:p,position:[entrySpan(2.13)[1]-.12,2.65,2.13],target:[2.5,.5,.2],mountRotation:Math.PI/2,name:'Camera_goc_hien',box,cyl,rod,group,M});
   securityCamera({parent:p,position:[2.11,2.65,10.35],target:[3.9,.8,12],mountRotation:-Math.PI/2,name:'Camera_phong_ong_ba',box,cyl,rod,group,M});
   livingRoom(p);lStair(p,{arrivalRail:false});serviceRooms(p);
  }else{
   partition(p,3.95,3.7,5.22,1.5);wall(p,[1.45,1.75],[1.45,3.95]);partition(p,10.25,3.7);bathroom(p);
   box(p,2.72,.002,11.7,5.03,.008,2.76,M.oak);bed(p,2.45,11.55);wardrobe(p,.65,11.8,1.7,-Math.PI/2);desk(p,4.4,12.2);artwork(p,2.4,10.31,1.1);
   box(p,2.8,.002,3.2,4.8,.008,2.75,M.oak);bed(p,2.35,2.85).rotation.y=Math.PI/2;wardrobe(p,4.7,2.85,1.6,Math.PI/2);
   rug(p,2.5,3.05,2.5,2.7);rug(p,2.6,9,2.5,1.75);coffee(p,2.5,9.25);
   box(p,4.85,.17,8.9,.4,.5,1.6,M.oak,.02);box(p,5.05,.97,8.9,.035,.7,1.2,M.black);
   plant(p,1,1.05,.95);plant(p,4.8,1.05,1.1);
   railing(p,[2.75,7.6],[2.75,8.45]);railing(p,[3.68,7.6],[3.68,8.45]);railing(p,[2.75,7.6],[3.68,7.6]);railing(p,[2.75,8.45],[3.68,8.45]);
  }
 }else{
  facade(p,2);partition(p,3.95,3.7,5.22,1.5);wall(p,[1.45,2],[1.45,3.95]);facade(p,8.5,.3,5.25);
  railing(p,[1.46,3],[1.46,8.28]);railing(p,[3.68,7.6],[3.68,8.45]);railing(p,[2.75,7.6],[3.68,7.6]);railing(p,[2.75,8.45],[3.68,8.45]);
  box(p,2.3,.1,2.65,1.9,.95,.6,M.wood,.025);box(p,2.3,1.05,2.65,2.02,.07,.67,M.oak,.025);
  for(const x of[1.65,2.95]){cyl(p,x,1.12,2.65,.06,.26,M.brass);cyl(p,x,1.38,2.65,.07,.02,M.glow)}
  cyl(p,2.3,1.12,2.7,.1,.14,M.stone);box(p,2.3,1.35,2.11,.85,.95,.05,M.wood);rug(p,2.3,3.45,1.7,.65);
  for(const x of[1.85,2.75])box(p,x,.03,3.45,.6,.08,.5,M.olive,.08);terrace(p,true);terrace(p,false);
  const roof=new T.Group();roof.name='Mai_phong_tho_va_thang';p.add(roof);shapeSlab(roof,[[.34,1.92],[5.25,1.92],[5.25,8.58],[.25,8.58]],3.3,.18,M.plaster,[[[2.78,7.6],[3.65,7.6],[3.65,8.45],[2.78,8.45]]]);box(roof,3.215,3.31,8.025,.87,.045,.85,M.glass);roofs.push(roof);
 }
 if(index===0){const person=human(p,1.65,7.5);person.visible=false}
 (index===0?[['Sân',3,1.5],['Phòng khách',3,4.9],['Bếp bên phải',4.7,7.3],['Bàn ăn',2.6,7.65],['Phòng ngủ',3.5,11.9],['WC',1,12],['Lavabo',.8,10.55]]:levels[index].rooms).forEach(([text,x,z])=>labels.push({text,point:new T.Vector3(MIRROR_X-x,.15,z),floor:index}));
}
// Upper floor shell only: no unapproved room partitions or furniture.
const upperFloor=new T.Group();upperFloor.name='Tang_2_san_va_o_thang';upperFloor.position.y=HEIGHT;upperFloor.userData.floor=1;house.add(upperFloor);floors.push(upperFloor);
const opening=UPPER.hole,openingPoints=UPPER.opening;
const upperSlab=shapeSlab(upperFloor,buildingPlot,0,UPPER.slabThickness,M.stone,[openingPoints.map(toWorld)]);upperSlab.name='San_tang_2_co_o_thang';
const upperInterior=group(upperFloor);upperInterior.position.x=MIRROR_X;upperInterior.scale.x=-1;interiors.push(upperInterior);
// Solid guard abuts the next flight; keep the turn and arrival unobstructed.
const guards=group(upperInterior);guards.name='Tuong_chan_o_thang_tang_2';
const guardStart=STAIR.z+STAIR.width,guardEnd=UPPER.landingStart;
const guardWall=box(guards,opening.right+.05,0,(guardStart+guardEnd)/2,.1,UPPER.guardHeight,guardEnd-guardStart,M.plaster);
guardWall.name='Vach_dac_sat_ve_thang_len_3';
guards.userData={thickness:.1,height:UPPER.guardHeight,stairGap:0,arrivalOpen:true};
// Temporarily clear the approved trial suites; keep the exterior and balcony only.
upperInterior.userData.floor=1;perimeter(upperFloor,1);
// Balcony occupies only the front right third; PC room has its own front window.
const balconyLeft=MASTER_SUITE.balcony.splitX,balconyRight=entrySpan(SECOND.balconyEnd)[1];
facade(upperInterior,SECOND.balconyEnd,balconyLeft,balconyRight);
wall(upperInterior,[balconyLeft,.05],[balconyLeft,SECOND.balconyEnd],HEIGHT-UPPER.slabThickness,.12,[],true);
const balcony=group(upperInterior);balcony.name='Ban_cong_tang_2';
shapeSlab(balcony,MASTER_BALCONY,.008,.008,mat('#c9c3b3',.9));
trailingPlanters({parent:balcony,segments:[[[MASTER_SUITE.balcony.splitX+.07,.08],[4.8,.06]],[[5,.24],[5.05,1.28]]],center:[4.1,.85],box,rod,group,M});
securityCamera({parent:upperInterior,position:[entrySpan(10.95)[1]+.14,2.9,10.95],target:[6.5,-2.5,-1.5],mountRotation:-Math.PI/2,name:'Camera_vach_phai_tang_2_nhin_ra_duong',box,cyl,rod,group,M});
const upperStair=lStair(upperInterior);upperStair.name='Cau_thang_tang_2_len_3';
// Partitions follow the owner's sketch; the front master remains empty.
const layout=UPPER_LAYOUT;
const roomWalls=group(upperInterior);roomWalls.userData.floor=1;roomWalls.name='Tang2_Vach_theo_phac_thao';
for(const [boundary,skip,name] of [[layout.masterBoundary,2,'Cua_phong_lon'],[layout.smallBoundary,1,'Cua_phong_nho']]){
 for(let i=0;i<boundary.length-1;i++)if(i!==skip)wall(roomWalls,boundary[i],boundary[i+1],HEIGHT-UPPER.slabThickness,.1);
 const a=boundary[skip],b=boundary[skip+1],w=Math.hypot(b[0]-a[0],b[1]-a[1]);
 wall(roomWalls,a,b,HEIGHT-UPPER.slabThickness,.1,[{start:0,end:w,bottom:0,top:2.28}]);
 bedroomSlidingDoor(upperInterior,(a[0]+b[0])/2,(a[1]+b[1])/2,w,name,-Math.atan2(b[1]-a[1],b[0]-a[0]));
}
furnishSmallUpperRoom(upperInterior);
addSmallBalcony({parent:upperInterior,box,rod,group,wall,windowOn,shapeSlab,plant,M});
furnishMasterSuite(upperInterior);
displayBookcase({parent:upperInterior,box,group,M});
buildBedroomAirConditioning({parent:upperInterior,box,rod,group,M});
const lounge=group(upperInterior);lounge.name='Tang2_Buc_go_ghe_luoi_va_quat';
const deck=layout.deck;
box(lounge,(deck.x1+deck.x2)/2,0,(deck.z1+deck.z2)/2,deck.x2-deck.x1,deck.height-.018,deck.z2-deck.z1,M.oak);
const planks=Math.ceil((deck.z2-deck.z1)/.14),plankDepth=(deck.z2-deck.z1)/planks;
for(let i=0;i<planks;i++)box(lounge,(deck.x1+deck.x2)/2,deck.height-.018,deck.z1+(i+.5)*plankDepth,deck.x2-deck.x1,.018,plankDepth-.003,M.wood,.002);
for(const chair of layout.chairs){
 const g=group(lounge,chair.x,chair.z,chair.rotation);g.position.y=deck.height;g.name='Ghe_luoi_khu_chung';
 const fabric=mat(chair.color,.98);
 for(const [x,y,z,sx,sy,sz] of [[0,.23,0,.43,.23,.46],[0,.44,.22,.4,.36,.26]]){
  const mesh=new T.Mesh(new T.SphereGeometry(1,40,28),fabric);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.rotation.x=-.17;mesh.castShadow=mesh.receiveShadow=true;g.add(mesh);
 }
 const seam=new T.Mesh(new T.TorusGeometry(.38,.003,6,64),mat('#8b8274',1));seam.rotation.x=Math.PI/2;seam.scale.y=1.1;seam.position.set(0,.21,-.025);g.add(seam);
}
const fan=group(lounge,layout.fan.x,layout.fan.z,.2);fan.position.y=deck.height;fan.name='Quat_dung_khu_chung';
cyl(fan,0,0,0,.17,.035,M.linen);cyl(fan,0,.035,0,.018,.77,M.dark);cyl(fan,0,.65,0,.026,.2,M.linen);
const head=group(fan);head.position.y=.99;
box(head,0,-.08,.065,.12,.16,.13,M.linen,.035);
for(const [radius,z] of [[.195,-.045],[.195,.025],[.15,-.07],[.10,-.09]]){
 const ring=new T.Mesh(new T.TorusGeometry(radius,.003,6,64),M.dark);ring.position.z=z;head.add(ring);
}
for(let i=0;i<24;i++){const a=i*Math.PI/12;rod(head,[Math.cos(a)*.035,Math.sin(a)*.035,-.095],[Math.cos(a)*.195,Math.sin(a)*.195,-.045],.0018,M.dark)}
for(let i=0;i<3;i++){
 const a=i*Math.PI*2/3,blade=new T.Mesh(new T.SphereGeometry(1,24,12),M.sage);blade.position.set(Math.cos(a)*.092,Math.sin(a)*.092,-.01);blade.scale.set(.09,.041,.009);blade.rotation.z=a+.45;head.add(blade);
}
const hub=new T.Mesh(new T.SphereGeometry(.035,20,12),M.linen);hub.scale.z=.55;hub.position.z=-.095;head.add(hub);
labels.push({text:'Master · Giường 1,8 m',point:new T.Vector3(MIRROR_X-1.5,.15,MASTER_SUITE.bed.z),floor:1},{text:'Phòng nhỏ · Giường 1,4 m',point:new T.Vector3(MIRROR_X-3.7,.15,11.8),floor:1},{text:'WC riêng',point:new T.Vector3(MIRROR_X-1.15,.15,11.8),floor:1},{text:'Bục gỗ · Ghế lười',point:new T.Vector3(MIRROR_X-3.8,.3,8.1),floor:1},{text:'Ban công',point:new T.Vector3(MIRROR_X-4.2,.15,.75),floor:1});
buildThirdFloor({house,floors,interiors,box,cyl,rod,group,shapeSlab,wall,rawWall,railing,windowOn,bedroomSlidingDoor,plant,rug,M,roofs,glassParts,labels});
// The irregular footprint is preserved without scaling either horizontal axis.
const plinth=shapeSlab(house,buildingPlot,-.45,.18,mat('#c0bfae'));plinth.name='Duong_bao_dat_7_dinh';
const boundary=new T.LineLoop(new T.BufferGeometry().setFromPoints(buildingPlot.map(([x,z])=>new T.Vector3(x,z<GROUND.glassLine?GROUND.porchLevel+.005:.005,z))),new T.LineBasicMaterial({color:'#81946b'}));house.add(boundary);
// Batch static opaque parts per parent and material, preserving the groups used by cutaway controls.
addWindowAwnings({parents:interiors.slice(0,3),box,rod,group,M});
const protectedMeshes=new Set(glassParts.map(part=>part.obj));
for(const floor of floors){
 const parents=[];floor.traverse(o=>{if(o.isGroup)parents.push(o)});
 for(const parent of parents){
  const buckets=new Map();
  for(const mesh of [...parent.children])if(mesh.isMesh&&!Array.isArray(mesh.material)&&!mesh.material.transparent&&!protectedMeshes.has(mesh)){
   const key=mesh.material.uuid+mesh.castShadow+mesh.receiveShadow;
   if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(mesh);
  }
  for(const meshes of buckets.values())if(meshes.length>=3){
   const geos=meshes.map(mesh=>{mesh.updateMatrix();let geo=mesh.geometry.clone();if(geo.index){const old=geo;geo=geo.toNonIndexed();old.dispose()}geo.applyMatrix4(mesh.matrix);return geo});
   const merged=mergeGeometries(geos,false);geos.forEach(g=>g.dispose());if(!merged)continue;
   const mesh=new T.Mesh(merged,meshes[0].material);mesh.name='Static_batch';mesh.castShadow=meshes[0].castShadow;mesh.receiveShadow=meshes[0].receiveShadow;
   for(const original of meshes)parent.remove(original);parent.add(mesh);
  }
 }
}
// The stair belongs to both storeys; retain its world transform when changing floors.
const sharedStair=house.getObjectByName('Cau_thang_chu_L');house.updateMatrixWorld(true);house.attach(sharedStair);const nextStair=house.getObjectByName('Cau_thang_tang_2_len_3');house.attach(nextStair);
export async function loadFurniture(onChange){await Promise.resolve();onChange?.();}
export function setHouseView(mode,lowWalls){plinth.visible=mode==='all'||mode==='0';boundary.visible=mode==='all'||mode==='0';floors.forEach((f,i)=>f.visible=mode==='all'||Number(mode)===i);const stairsOn=document.querySelector('#stair-toggle')?.getAttribute('aria-pressed')!=='false';sharedStair.visible=stairsOn&&mode!=='2';nextStair.visible=stairsOn&&mode!=='0';for(const w of wallParts){w.full.visible=!lowWalls;w.low.visible=lowWalls}for(const part of glassParts)part.obj.visible=!(lowWalls&&part.hideCut);roofs.forEach(r=>r.visible=!lowWalls&&(mode==='all'||Number(mode)===r.userData.floor))}
export function buildDimensions(){const g=new T.Group();g.name='Kich_thuoc_duong_bao';for(let i=0;i<plot.length;i++){const a=plot[i],b=plot[(i+1)%plot.length],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),ox=-dz/len*.5,oz=dx/len*.5;const aa=new T.Vector3(a[0]+ox,.02,a[1]+oz),bb=new T.Vector3(b[0]+ox,.02,b[1]+oz);const pts=[new T.Vector3(a[0],.02,a[1]),aa,bb,new T.Vector3(b[0],.02,b[1])];g.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:'#849573'})));const c=document.createElement('canvas');c.width=512;c.height=96;const ctx=c.getContext('2d');ctx.font='500 42px sans-serif';ctx.textAlign='center';ctx.fillStyle='#5a6d48';ctx.fillText(`${len.toFixed(2).replace('.',',')} m`,256,60);const tex=new T.CanvasTexture(c);const sprite=new T.Sprite(new T.SpriteMaterial({map:tex,depthTest:false}));sprite.position.copy(aa).add(bb).multiplyScalar(.5);sprite.position.y=.12;sprite.scale.set(i===1||i===2?.8:1.35,.26,1);if(i===1){sprite.position.x-=.55;sprite.position.z-=.18}if(i===2){sprite.position.x-=.1;sprite.position.z+=.3}g.add(sprite)}return g}
