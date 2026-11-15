import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {HEIGHT,MIRROR_X} from './design.js';
import {LIGHTING_PLAN} from './lighting-plan.js';

function gradientTexture(wash=false){
 const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),data=ctx.createImageData(128,128);
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  const u=(x/127-.5)*2,v=y/127,t=1-v;
  const a=wash?Math.exp(-Math.pow(Math.abs(u)/(.05+.85*Math.pow(t,.75)),6)*2)*Math.pow(1-t,.85)*.6:Math.exp(-5*(u*u+Math.pow((v-.5)*2,2)))*.55;
  const i=(y*128+x)*4;data.data.set([255,204,135,Math.round(a*255)],i);
 }
 ctx.putImageData(data,0,0);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;
}

export function createHouseLighting({house,floors,scene}){
 const dark=new T.MeshStandardMaterial({color:'#283431',roughness:.55,metalness:.35});
 const white=new T.MeshStandardMaterial({color:'#eeede5',roughness:.5});
 const glow=new T.MeshStandardMaterial({color:'#fff1cf',emissive:'#ffd5a0',emissiveIntensity:.05,roughness:.4});
 const poolMaterial=new T.MeshBasicMaterial({map:gradientTexture(),transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide});
 const washMaterial=new T.MeshBasicMaterial({map:gradientTexture(true),transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide});
 const roots=floors.map((floor,i)=>{const g=new T.Group();g.name=`He_den_tang_${i+1}`;g.position.x=MIRROR_X;g.scale.x=-1;floor.add(g);return g});
 const fixtures=[],pools=[],wallWashes=[],ceilingBatches=[],wallBatches=[];
 function mesh(parent,geometry,material,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);parent.add(m);return m}
 function box(p,x,y,z,w,h,d,m){return mesh(p,new T.BoxGeometry(w,h,d),m,x,y,z)}
 function wash(g,height,up=true){const m=mesh(g,new T.PlaneGeometry(.9,height),washMaterial,0,(up?1:-1)*(.19+height/2),.006);if(!up)m.rotation.z=Math.PI;m.renderOrder=1;wallWashes.push(m);}
 for(const spec of LIGHTING_PLAN){
  const g=new T.Group();g.name=`Den_${spec.zone}_${fixtures.length+1}`;g.position.set(spec.x,spec.y,spec.z);g.rotation.y=spec.rotation||0;g.userData={...spec};roots[spec.floor].add(g);fixtures.push(g);
  if(spec.kind==='ceiling'||spec.kind==='pendant'){
   const r=spec.radius||.085;
   if(spec.kind==='ceiling')mesh(g,new T.CylinderGeometry(r+.015,r+.015,.03,24),white);
   const disk=mesh(g,new T.CircleGeometry(r,24),glow,0,-.017,0);disk.rotation.x=Math.PI/2;
  }else if(spec.kind==='wall'){
   box(g,0,0,.018,.18,.36,.036,dark);box(g,0,0,.075,.135,.26,.10,glow);
   for(const y of[-.165,.165])box(g,0,y,.07,.19,.035,.14,dark);
   for(const x of[-.085,.085])box(g,x,0,.13,.018,.31,.018,dark);
   wash(g,spec.washUp??.8);wash(g,.8,false);
  }else if(spec.kind==='address'){
   box(g,0,.015,.022,.065,.11,.035,dark);
   box(g,0,0,.09,.46,.045,.15,dark);
   box(g,0,-.026,.095,.39,.012,.09,glow);
   const downwash=mesh(g,new T.PlaneGeometry(.51,.42),washMaterial,0,-.29,.028);downwash.renderOrder=1;wallWashes.push(downwash);
  }else if(spec.kind==='bollard'){
   box(g,0,-spec.y/2,0,.08,spec.y,.08,dark);box(g,0,-.06,0,.085,.06,.085,glow);box(g,0,-.015,0,.11,.025,.11,dark);
  }else if(spec.kind==='step'){
   box(g,0,0,.007,.16,.055,.015,dark);box(g,0,-.012,.017,.12,.012,.009,glow);
  }else if(spec.kind==='mirror'){
   box(g,0,0,0,spec.length,.025,.045,white);box(g,0,-.015,.008,spec.length-.02,.012,.035,glow);
  }else if(spec.kind==='strip'){
   box(g,0,0,0,.025,.016,spec.length,glow);
  }
  if(spec.primary||spec.kind==='bollard'){
   const pool=mesh(roots[spec.floor],new T.PlaneGeometry(spec.kind==='bollard'?1.4:2.8,spec.zone.includes('bath')?1.5:2.8),poolMaterial,spec.x,.035,spec.z);pool.rotation.x=-Math.PI/2;pool.renderOrder=1;pools.push(pool);
  }
 }
 // Number plaque faces the lane; the two-line texture remains readable at close range.
 const sign=new T.Group();sign.name='Bien_so_nha_356_73_Hoang_Dieu';sign.position.set(3.5,1.39,-.047);sign.rotation.y=Math.PI;sign.scale.x=-1;sign.userData={side:'right-from-street',textUnmirrored:true};roots[0].add(sign);
 box(sign,0,0,0,.42,.285,.026,dark);
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=640;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#283431';ctx.fillRect(0,0,1024,640);ctx.strokeStyle='#bea778';ctx.lineWidth=5;ctx.strokeRect(22,22,980,596);ctx.fillStyle='#f2e1b7';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 225px sans-serif';ctx.fillText('356/73',512,260);ctx.font='500 94px sans-serif';ctx.fillText('HOÀNG DIỆU',512,485);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 mesh(sign,new T.PlaneGeometry(.405,.27),new T.MeshBasicMaterial({map:texture}),0,0,.015);
 // Batch static housings and luminous surfaces per floor; keep the fixture plan as metadata.
 for(const root of roots){
  const buckets=new Map();root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert();
  root.traverse(o=>{if(!o.isMesh||![dark,white,glow].includes(o.material))return;let owner=o.parent;while(owner!==root&&!owner.userData.kind)owner=owner.parent;const wall=owner.userData.kind==='wall'||(owner.userData.kind==='step'&&owner.userData.y>.72);o.userData.wallFixture=wall;const ceiling=['ceiling','pendant'].includes(owner.userData.kind);o.userData.ceilingFixture=ceiling;const key=o.material.uuid+ceiling+wall;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o)});
  for(const list of buckets.values()){
   const geometries=list.map(o=>{let geo=o.geometry.clone();if(geo.index){const old=geo;geo=geo.toNonIndexed();old.dispose()}geo.applyMatrix4(inverse.clone().multiply(o.matrixWorld));return geo});
   const merged=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());
   const batch=new T.Mesh(merged,list[0].material);batch.name='Den_gop_hinh_hoc_tinh';batch.castShadow=false;if(list[0].userData.wallFixture)wallBatches.push(batch);if(list[0].userData.ceilingFixture){const ghost=batch.material.clone();ghost.transparent=true;ghost.opacity=.12;ghost.depthWrite=false;ceilingBatches.push({mesh:batch,solid:batch.material,ghost});}root.add(batch);for(const o of list)o.removeFromParent();
  }
 }
 // Fixed light budget: no extra shadow-map renders and no shader recompilation on toggles.
 const slots=Array.from({length:12},()=>{const light=new T.PointLight('#ffdbab',0,4.4,2);scene.add(light);return light});
 let view='all',nightMix=0;
 function update(){
  const active=LIGHTING_PLAN.filter(s=>s.primary&&(view==='all'||+view===s.floor)).toSorted((a,b)=>view==='all'?(b.allPriority||0)-(a.allPriority||0):(b.priority||0)-(a.priority||0)).slice(0,slots.length);
  slots.forEach((light,i)=>{const s=active[i];if(!s){light.intensity=0;return}const offset=s.kind==='wall'?.22:0;light.position.set(MIRROR_X-s.x-Math.sin(s.rotation||0)*offset,HEIGHT*s.floor+s.y-(s.kind==='ceiling'?.25:0),s.z+Math.cos(s.rotation||0)*offset);light.color.set(s.kelvin>=3500?'#ffe5c5':'#ffd5a0');light.intensity=nightMix*(s.power??(s.kind==='wall'?22:62));light.distance=s.range??(s.kind==='wall'?4.1:5.1);});
  glow.emissiveIntensity=.05+nightMix*1.8;washMaterial.opacity=nightMix*.72;poolMaterial.opacity=nightMix*.36;
 }
 return {plan:LIGHTING_PLAN,fixtures,slots,setView(mode,lowWalls=false){view=mode;fixtures.forEach(f=>{if(f.userData.kind==='wall'||(f.userData.kind==='step'&&f.userData.y>.72))f.visible=!lowWalls;});wallBatches.forEach(b=>b.visible=!lowWalls);ceilingBatches.forEach(b=>b.mesh.material=mode==='all'?b.solid:b.ghost);wallWashes.forEach(m=>m.visible=!lowWalls);update()},setMix(value){nightMix=value;update()},stats:()=>({fixtures:fixtures.length,view,nightMix,activeLights:slots.filter(l=>l.intensity>0).length,lightBudget:slots.length,address:'356/73 Hoàng Diệu'})};
}
