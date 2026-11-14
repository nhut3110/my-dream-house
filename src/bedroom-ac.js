import * as T from 'three';
import {BEDROOM_AC,entrySpan} from './design.js';

export function buildBedroomAirConditioning({parent,box,rod,group,M}){
 const system=group(parent);system.name='Dieu_hoa_hai_phong_tang_2';
 for(const spec of BEDROOM_AC){
  const I=spec.indoor,O=spec.outdoor;
  const indoor=group(system,I.x,I.z,I.rotation);indoor.name=`Dan_lanh_${spec.id}`;indoor.position.y=I.y;
  indoor.userData={...I,airflow:spec.airflow};
  box(indoor,0,0,0,I.width,I.height,I.depth,M.white,.045);
  box(indoor,0,.027,-I.depth/2-.003,I.width-.09,.037,.012,M.dark,.008);
  const louver=box(indoor,0,.023,-I.depth/2-.012,I.width-.10,.012,.037,M.linen,.005);louver.rotation.x=-.25;
  box(indoor,0,.085,-I.depth/2-.002,I.width-.06,.003,.004,M.stone);
  box(indoor,I.width/2-.08,.13,-I.depth/2-.004,.024,.012,.004,M.sage,.002);
  // Mount outdoor units beyond the actual angled right facade, with rear ventilation clearance.
  const wallX=entrySpan(O.z)[1]+.09;
  const slope=(entrySpan(O.z+.05)[1]-entrySpan(O.z-.05)[1])/.1;
  const outdoor=group(system,wallX+O.gap+O.depth/2,O.z,-Math.PI/2+Math.atan(slope));
  outdoor.name=`Dan_nong_vach_phai_${spec.id}`;outdoor.userData={...O,side:'right',wallX};
  box(outdoor,0,O.y,0,O.width,O.height,O.depth,M.linen,.025);
  for(const x of[-.28,.28]){
   box(outdoor,x,O.y-.055,0,.075,.045,.27,M.dark,.005);
   box(outdoor,x,O.y-.1,.075,.035,.035,.52,M.dark);
   box(outdoor,x,O.y-.17,O.depth/2+O.gap-.015,.035,.59,.035,M.dark);
   for(const y of[O.y-.1,O.y+.35])box(outdoor,x,y,O.depth/2+O.gap,.065,.045,.01,M.stone,.004);
  }
  const fan=group(outdoor,-.1,0);fan.position.y=O.y+O.height/2;
  const disk=new T.Mesh(new T.CircleGeometry(.222,48),M.dark);disk.rotation.y=Math.PI;disk.position.z=-O.depth/2-.004;fan.add(disk);
  for(let i=0;i<4;i++){
   const a=i*Math.PI/2,blade=new T.Mesh(new T.SphereGeometry(1,16,8),M.stone);
   blade.scale.set(.095,.047,.008);blade.rotation.z=a+.5;blade.position.set(Math.cos(a)*.105,Math.sin(a)*.105,-O.depth/2-.014);fan.add(blade);
  }
  for(const r of[.07,.13,.185,.225]){
   const ring=new T.Mesh(new T.TorusGeometry(r,.0025,6,48),M.linen);ring.position.z=-O.depth/2-.027;fan.add(ring);
  }
  for(let i=0;i<16;i++){const a=i*Math.PI/8;rod(fan,[0,0,-O.depth/2-.028],[Math.cos(a)*.224,Math.sin(a)*.224,-O.depth/2-.028],.0018,M.linen)}
  for(let y=O.y+.1;y<O.y+O.height-.06;y+=.045)box(outdoor,.3,y,-O.depth/2-.005,.12,.012,.008,M.stone,.003);
  box(outdoor,.3,O.y+O.height-.07,-O.depth/2-.006,.09,.025,.004,M.sage);
  // Concealed high-level trunking, external drop and an indoor condensate drain to each WC.
  const pipes=group(system);pipes.name=`Ong_dieu_hoa_${spec.id}`;
  const routeY=2.99,exitX=entrySpan(spec.pipeZ)[1]+.22;
  const path=[[I.x,routeY,I.z],[exitX,routeY,spec.pipeZ],[exitX,O.y+O.height-.04,spec.pipeZ]];
  for(let i=1;i<path.length;i++)rod(pipes,path[i-1],path[i],.025,M.white);
  for(const point of path.slice(1,-1)){const elbow=new T.Mesh(new T.SphereGeometry(.025,12,8),M.white);elbow.position.set(...point);pipes.add(elbow)}
  rod(pipes,[spec.drain.x,routeY,spec.drain.z],[spec.drain.x,.19,spec.drain.z],.011,M.white);
  pipes.userData={condensateDrain:'WC',routeY,room:spec.id};
 }
 return system;
}
