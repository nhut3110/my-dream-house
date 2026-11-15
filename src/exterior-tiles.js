import * as T from 'three';
import {GROUND,HEIGHT,UPPER,entrySpan,MASTER_SUITE} from './design.js';

export const EXTERIOR_TILE={color:'#c5bfb2',grout:'#aaa79f',width:1.2,height:.6,joint:.003,finish:'matte greige limestone-look porcelain'};
// Rectangular subtraction also handles intersecting openings. No overlapping Shape holes.
export function subtractOpenings(rect,openings){
 return openings.reduce((pieces,o)=>pieces.flatMap(r=>{
  const a=Math.max(r.x1,o.x1),b=Math.min(r.x2,o.x2),c=Math.max(r.y1,o.y1),d=Math.min(r.y2,o.y2);
  if(a>=b||c>=d)return [r];
  return [{x1:r.x1,x2:a,y1:r.y1,y2:r.y2},{x1:b,x2:r.x2,y1:r.y1,y2:r.y2},{x1:a,x2:b,y1:r.y1,y2:c},{x1:a,x2:b,y1:d,y2:r.y2}].filter(p=>p.x2-p.x1>.0001&&p.y2-p.y1>.0001);
 }),[rect]);
}
export function tiledRectangles(bounds,openings=[]){
 const tiles=[],S=EXTERIOR_TILE;
 for(let x=Math.floor(bounds.x1/S.width)*S.width;x<bounds.x2;x+=S.width)
  for(let y=Math.floor(bounds.y1/S.height)*S.height;y<bounds.y2;y+=S.height){
   const rect={x1:Math.max(bounds.x1,x+S.joint/2),x2:Math.min(bounds.x2,x+S.width-S.joint/2),y1:Math.max(bounds.y1,y+S.joint/2),y2:Math.min(bounds.y2,y+S.height-S.joint/2)};
   if(rect.x2>rect.x1&&rect.y2>rect.y1)tiles.push(...subtractOpenings(rect,openings));
  }
 return tiles;
}
export function porchTileMaterial(){
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');
 ctx.fillStyle=EXTERIOR_TILE.color;ctx.fillRect(0,0,256,256);
 ctx.strokeStyle=EXTERIOR_TILE.grout;ctx.lineWidth=1.2;ctx.strokeRect(0,0,256,256);
 const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(1/.6,1/.6);tex.colorSpace=T.SRGBColorSpace;
 return new T.MeshStandardMaterial({map:tex,roughness:.94,color:'#f7f4ed'});
}
export function buildExteriorTiles({base,front,box,group,shapeSlab,foldSideGeometry,facadePath,facadeRibbon,M}){
 const tile=new T.MeshStandardMaterial({color:EXTERIOR_TILE.color,roughness:.88});
 function side(start,end,bottom,top,openings=[],inside=false,left=false){
  const root=group(base);root.name='Gach_porcelain_mat_hong';
  for(const r of tiledRectangles({x1:start,x2:end,y1:bottom,y2:top},openings)){
   const shape=new T.Shape([new T.Vector2(-r.x2,r.y1),new T.Vector2(-r.x1,r.y1),new T.Vector2(-r.x1,r.y2),new T.Vector2(-r.x2,r.y2)]);
   const original=new T.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:false});
   const geo=foldSideGeometry(original);if(inside){const p=geo.attributes.position;for(let i=0;i<p.count;i++){const z=p.getZ(i),depth=p.getX(i)-entrySpan(z)[1]-.118;p.setX(i,left?entrySpan(z)[0]+.10+depth:entrySpan(z)[1]-.10-depth)}if(!left){const p=geo.attributes.position;for(let i=0;i<p.count;i+=3){const a=[p.getX(i),p.getY(i),p.getZ(i)];p.setXYZ(i,p.getX(i+2),p.getY(i+2),p.getZ(i+2));p.setXYZ(i+2,...a)}}geo.computeVertexNormals();}const mesh=new T.Mesh(geo,tile);original.dispose();mesh.castShadow=false;mesh.receiveShadow=true;root.add(mesh);
  }
 }
 const exit={x1:GROUND.exit.z-GROUND.exit.width/2-.10,x2:GROUND.exit.z+GROUND.exit.width/2+.10,y1:-.5,y2:2.28};
 const openings=[exit,...GROUND.rightWindows.map(w=>({x1:w.z-w.width/2-.10,x2:w.z+w.width/2+.10,y1:w.sill-.1,y2:w.head+.1}))];
 side(.574,13.07,-.30,HEIGHT-UPPER.slabThickness,openings);
 side(.574,GROUND.glassLine,-.30,HEIGHT-UPPER.slabThickness,[],true);
 side(.18,GROUND.glassLine,-.30,HEIGHT-UPPER.slabThickness,[],true,true);
 // Finish the living-room entrance head and both jambs in the same tile grid.
 // Meet the structural opening exactly so no bare plaster rim remains.
 const [entryLeft,entryRight]=entrySpan(GROUND.glassLine);
 const surround=group(base);surround.name='Gach_bao_kin_cua_kinh_phong_khach';
 const entryOpening={x1:entryLeft+.35,x2:entryRight-.35,y1:0,y2:2.7};
 for(const r of tiledRectangles({x1:entryLeft,x2:entryRight,y1:-.30,y2:HEIGHT-UPPER.slabThickness},[entryOpening]))
  box(surround,(r.x1+r.x2)/2,r.y1,GROUND.glassLine-.086,r.x2-r.x1,r.y2-r.y1,.012,tile).castShadow=false;
 // Gate-side masonry: tile both fixed piers, never the moving timber gate.
 const gateHole={x1:.43,x2:.46+GROUND.gateOpening+.15,y1:-.5,y2:3};
 for(const r of tiledRectangles({x1:.035,x2:4.84,y1:-.30,y2:GROUND.securityHeight+GROUND.porchLevel},[gateHole])){
  const mid=(r.x1+r.x2)/2,z=facadePath[0][1]+(facadePath[1][1]-facadePath[0][1])*mid/facadePath[1][0]-.031;
  const g=group(base,mid,z,Math.atan2(-(facadePath[1][1]-facadePath[0][1]),facadePath[1][0]));
  box(g,0,r.y1,0,r.x2-r.x1,r.y2-r.y1,.106,tile).castShadow=false;
  box(g,0,r.y1,.208,r.x2-r.x1,r.y2-r.y1,.012,tile).castShadow=false;
 }
 // Wrap a thin matching finish around the curved corner, no stacked rectangular patches.
 const curve=facadePath.filter(p=>p[0]>=4.84&&p[1]<.60);
 shapeSlab(base,facadeRibbon(curve,.072,.086),GROUND.securityHeight+GROUND.porchLevel,GROUND.securityHeight,tile).name='Gach_bo_goc_cong';
 shapeSlab(base,facadeRibbon(curve,-.086,-.072),GROUND.securityHeight+GROUND.porchLevel,GROUND.securityHeight,tile).name='Gach_bo_goc_mat_trong';
 for(let yy=-.30+EXTERIOR_TILE.height;yy<GROUND.securityHeight+GROUND.porchLevel;yy+=EXTERIOR_TILE.height)
  shapeSlab(base,facadeRibbon(curve,.086,.087),yy,.003,new T.MeshStandardMaterial({color:EXTERIOR_TILE.grout,roughness:1}));
 // A single coping joins the flat gate wall to the rounded return and closes its top.
 const gateCapPath=[[3.01,facadePath[0][1]+(facadePath[1][1]-facadePath[0][1])*3.01/facadePath[1][0]],...facadePath.filter(p=>p[0]>=4.84&&p[1]<.60)];
 shapeSlab(base,facadeRibbon(gateCapPath,-.19,.09),GROUND.securityHeight+GROUND.porchLevel+.025,.035,tile).name='Nap_tuong_cong_lien_goc';
 const guard=group(front);guard.name='Chau_hoa_san_ban_cong';
 // One compact flower pot on the broad coping, inside the balcony edge.
 const flowers=group(guard,4.58,.78);flowers.position.y=.008;flowers.name='Chau_hoa_nho_ban_cong';
 const pot=new T.Mesh(new T.CylinderGeometry(.075,.055,.14,24),new T.MeshStandardMaterial({color:'#b4957d',roughness:.9}));pot.position.y=.07;flowers.add(pot);
 const stemMat=new T.MeshStandardMaterial({color:'#5b7150'}),petalMat=new T.MeshStandardMaterial({color:'#e5ccbe'});
 for(let i=0;i<5;i++){
  const a=i*2.4,x=Math.cos(a)*.04,z=Math.sin(a)*.04,y=.23+(i%3)*.035;
  box(flowers,x,.13,z,.005,y-.13,.005,stemMat);
  for(let j=0;j<5;j++){const p=j*Math.PI*2/5,m=new T.Mesh(new T.SphereGeometry(.018,8,6),petalMat);m.position.set(x+Math.cos(p)*.019,y,z+Math.sin(p)*.019);m.scale.y=.45;flowers.add(m);}
 }
 return {guard,tile};
}
