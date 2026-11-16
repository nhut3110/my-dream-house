import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {SITE,gateRampCorners,streetPolygon} from './site-plan.js';
import {plot,buildingPlot,GROUND,MIRROR_X,entrySpan} from './design.js';

export function createSiteContext({box,M}){
 const root=new T.Group();root.name='Boi_canh_nga_ba_uoc_luong';root.userData={...SITE};
 const massing=new T.Group();massing.name='Nha_giap_ranh';root.add(massing);
 const material=color=>new T.MeshStandardMaterial({color,roughness:.94});
 const road=material('#868982'),concrete=material('#b7b7a8'),neighbor=material('#c9c8b9'),rear=material('#c0c6bb'),trim=material('#a4aca2'),metal=material('#515e56');
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(256,256);let seed=48109;
 for(let i=0;i<pixels.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const value=132+(seed%23);pixels.data.set([value,value+2,value-3,255],i);}
 ctx.putImageData(pixels,0,0);const texture=new T.CanvasTexture(canvas);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(.4,.4);texture.colorSpace=T.SRGBColorSpace;road.map=texture;

 function slab(p,poly,top,depth,m){const s=new T.Shape(poly.map(([x,z])=>new T.Vector2(x,-z))),geo=new T.ExtrudeGeometry(s,{depth,bevelEnabled:false});geo.rotateX(-Math.PI/2);const mesh=new T.Mesh(geo,m);mesh.position.y=top-depth;mesh.receiveShadow=true;p.add(mesh);return mesh;}
 function block(poly,height,m,parent=massing){const g=new T.Group();parent.add(g);const body=slab(g,poly,SITE.roadY+height,height,m);body.castShadow=true;slab(g,poly,SITE.roadY+height+.09,.09,trim);return g;}
 // A genuine T: frontage is the crossbar, exposed side is the stem.
 const side=plot[3][0],w=SITE.alleyWidth;
 slab(root,streetPolygon(),SITE.roadY,.14,road);
 slab(root,buildingPlot,SITE.porchY,.30,concrete);
 // Narrow drainage channels follow the two street-facing elevations.
 box(root,5.2,SITE.roadY+.006,-.10,17.6,.012,.11,metal);
 for(let z=.5;z<18;z+=.5){const x=z<13.2?MIRROR_X-entrySpan(z)[1]-.09:side-.09;box(root,x,SITE.roadY+.008,z,.11,.012,.48,metal);}
 for(const z of[1.5,6.5,11.5]){const x=MIRROR_X-entrySpan(z)[1]-.11;box(root,x,SITE.roadY+.013,z,.23,.014,.48,metal);for(let i=0;i<7;i++)box(root,x-.09+i*.03,SITE.roadY+.029,z,.012,.009,.42,concrete);}
 // Integral curb bevels share the concrete finish of the raised foundation.
 function curbBevel(corners,top,name){
  const points=[];for(let i=0;i<4;i++)points.push(corners[i][0],i===0||i===3?top:SITE.roadY+.003,corners[i][1]);
  for(const i of[0,3])points.push(corners[i][0],SITE.roadY,corners[i][1]);
  let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(points,3));geo.setAttribute('uv',new T.Float32BufferAttribute([0,0,0,1,1,1,1,0,0,0,1,0],2));
  geo.setIndex([0,1,2,0,2,3,0,4,1,3,2,5,0,3,5,0,5,4]);
  const indexed=geo;geo=geo.toNonIndexed();indexed.dispose();geo.computeVertexNormals();
  const mesh=new T.Mesh(geo,concrete);mesh.name=name;mesh.receiveShadow=true;root.add(mesh);
 }
 curbBevel(gateRampCorners(),SITE.porchY,'Mep_vat_le_cong_sau_200mm');
 // One compact intermediate landing; two equal 225 mm rises bridge the 450 mm level difference.
 const E=SITE.sideLanding,exitX=MIRROR_X-entrySpan(GROUND.exit.z)[1],outer=exitX-E.projection,half=(GROUND.exit.width+.12)/2;
 box(root,exitX-E.projection/2,SITE.roadY,GROUND.exit.z,E.projection,E.top-SITE.roadY,half*2,concrete);
 curbBevel([[outer,GROUND.exit.z-half],[outer-E.bevel,GROUND.exit.z-half],[outer-E.bevel,GROUND.exit.z+half],[outer,GROUND.exit.z+half]],E.top,'Mep_vat_buc_cua_ben');
 // Party-wall neighbour on the LEFT when looking in from the yard.
 const left=block([[plot[0][0]+.015,.05],[10.4,.05],[10.4,13.24],[plot[6][0]+.015,13.24]],SITE.leftHeight,neighbor);left.name='Nha_trai_3_tang_giap_vach';
 // Front detail only; do not invent openings in the shared party wall.
 for(let floor=0;floor<3;floor++){
  const y=SITE.roadY+floor*3.2;
  box(left,7.9,y+.85,.017,1.9,1.65,.045,metal);box(left,7.9,y+.88,-.011,1.8,1.56,.015,M.glass);
  for(const x of[6.1,9.65])box(left,x,y,0,.14,3.2,.18,trim);
  box(left,8.1,y+2.82,-.10,4.55,.14,.38,trim);
 }
 const back=block([[.06,13.31],[10.4,13.31],[10.4,18.1],[.06,18.1]],SITE.rearHeight,rear);back.name='Day_tro_sau_2_tang_giap_vach';
 // A visible side corridor and modest repeated room doors identify the two-storey rental block.
 for(let floor=0;floor<2;floor++){
  const y=SITE.roadY+floor*3.1;
  for(const z of[14.2,16.4])box(back,.035,y+.12,z,.04,2.1,.82,metal);
  box(back,-.22,y+2.75,15.6,.6,.12,4.9,trim);
 }
 // Separate batches preserve the compact/advanced visibility boundary.
 function batch(parent){
  root.updateMatrixWorld(true);const buckets=new Map();
  parent.traverse(o=>{if(o.isMesh&&!o.material.transparent){const key=o.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);}});
  for(const meshes of buckets.values()){
   const geometries=meshes.map(o=>{let g=o.geometry.clone();if(g.index){const old=g;g=g.toNonIndexed();old.dispose();}g.applyMatrix4(o.matrixWorld);return g;});
   const merged=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());
   if(!merged)continue;
   const mesh=new T.Mesh(merged,meshes[0].material);mesh.receiveShadow=true;mesh.castShadow=meshes.some(o=>o.castShadow);parent.add(mesh);meshes.forEach(o=>o.removeFromParent());
  }
 }
 batch(root);
 let neighborhood=null,advanced=false,neighborhoodCount=0;
 function setAdvanced(show){
  if(show&&!neighborhood){
   neighborhood=new T.Group();neighborhood.name='Khu_pho_uoc_luong_ban_kinh_30m';root.add(neighborhood);
   slab(neighborhood,streetPolygon(true),SITE.roadY-.003,.14,road);
   // Survey-derived frontage strips: contiguous narrow houses, varied roof lines.
   // Unseen rear footprints remain massing only, not a claimed cadastral reconstruction.
   const rows=[
    {axis:'x',from:-25,to:29,start:-13,end:-SITE.frontAlleyWidth-.12,facing:'front'},
    {axis:'x',from:-25,to:-12.2,start:.12,end:12,facing:'back'},
    {axis:'x',from:10.55,to:29,start:.12,end:13.2,facing:'back'},
    {axis:'z',from:.2,to:31,start:-12,end:side-w-.12,facing:'side'},
    {axis:'z',from:18.3,to:32,start:.1,end:10.4,facing:'rear'}
   ];
   const widths=[4.2,3.8,5.1,4.4,3.6,4.8],heights=[3.8,6.3,4.1,9.2,6.5,3.5];
   const palette=['#b6c4b5','#d8d3bd','#bec6c5','#b4b9aa','#cec0aa','#aebcb5'].map(material);
   for(const row of rows){let cursor=row.from,index=0;
    while(cursor<row.to-.8){const width=Math.min(widths[index%widths.length],row.to-cursor)-.06,h=heights[(index+(row.axis==='z'?2:0))%heights.length];
     const poly=row.axis==='x'?[[cursor,row.start],[cursor+width,row.start],[cursor+width,row.end],[cursor,row.end]]:[[row.start,cursor],[row.end,cursor],[row.end,cursor+width],[row.start,cursor+width]];
     const g=block(poly,h,palette[index%palette.length],neighborhood);neighborhoodCount++;
     const n=Math.max(1,Math.round(h/3.15));
     for(let f=0;f<n;f++){
      const y=SITE.roadY+f*3.15;
      if(row.axis==='x'){
       const z=row.facing==='front'?row.end+.03:row.start-.03,sgn=row.facing==='front'?1:-1;
       box(g,cursor+width/2,y+.12,z,width*.65,f===0?2.15:1.45,.055,metal);
       box(g,cursor+width/2,y+2.55,z+sgn*.28,width+.06,.09,.65,trim);
       if(f===0)for(let j=0;j<9;j++)box(g,cursor+width*.2+j*width*.075,y+.2,z+sgn*.04,.025,1.95,.025,trim);
      }else{
       const x=row.facing==='side'?row.end+.03:row.start-.03,sgn=row.facing==='side'?1:-1;
       box(g,x,y+.12,cursor+width/2,.055,f===0?2.1:1.4,width*.6,metal);
       box(g,x+sgn*.24,y+2.6,cursor+width/2,.6,.08,width+.04,trim);
      }
     }
     cursor+=width+.06;index++;
    }
   }
   // Hanging-plant trellis seen down the narrower side branch.
   for(const z of[3,5,7]){box(neighborhood,side-w-.15,SITE.roadY,z,.045,2.6,.045,metal);box(neighborhood,side-w-.55,2.13,z,.85,.06,.055,metal);box(neighborhood,side-w-.32,1.70,z,.22,.23,.24,M.olive);box(neighborhood,side-w-.32,1.91,z,.30,.25,.30,M.leaf);}
   batch(neighborhood);
  }
  advanced=show;if(neighborhood)neighborhood.visible=show;
 }
 return {root,setAdvanced,setVisible(show){root.visible=show;},stats:()=>({...SITE,visible:root.visible,advanced,neighborhoodCount,indoorAboveRoad:-SITE.roadY,porchAboveRoad:SITE.porchY-SITE.roadY})};
}
