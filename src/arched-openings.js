import * as T from 'three';

// True semicircular head; shared by the glazing, masonry spandrels and gate grille.
export function archShape(width,bottom,top){
 const r=width/2,spring=top-r,s=new T.Shape();
 s.moveTo(-r,bottom);s.lineTo(r,bottom);s.lineTo(r,spring);
 s.absarc(0,spring,r,0,Math.PI,false);s.lineTo(-r,bottom);return s;
}
export function archMesh(parent,shape,depth,material,z=0){
 const m=new T.Mesh(new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:32}),material);
 m.position.z=z;m.castShadow=m.receiveShadow=true;parent.add(m);return m;
}
export function archSpandrels(parent,width,top,depth,material,z=0){
 const r=width/2,spring=top-r;
 for(const side of [-1,1]){
  const points=[[side*r,top],[0,top]];
  for(let i=1;i<=32;i++){const a=Math.PI/2-side*i*Math.PI/64;points.push([Math.cos(a)*r,spring+Math.sin(a)*r]);}
  points.push([side*r,spring]);
  archMesh(parent,new T.Shape(points.map(p=>new T.Vector2(...p))),depth,material,z);
 }
}
export function archFrame(parent,width,bottom,top,thickness,depth,material,z=0){
 const s=archShape(width+thickness*2,bottom-thickness,top+thickness);
 s.holes.push(new T.Path(archShape(width,bottom,top).getPoints(64).toReversed()));
 return archMesh(parent,s,depth,material,z);
}
export const GATE_ARCHES=[{x:3.93,width:.46,bottom:.64,top:1.62},{x:4.51,width:.46,bottom:.64,top:1.62}];
