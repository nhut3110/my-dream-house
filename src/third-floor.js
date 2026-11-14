import * as T from 'three';
import {HEIGHT,THIRD,UPPER,STAIR,buildingPlot,toWorld,MIRROR_X} from './design.js';

export function buildThirdFloor(H){
 const {house,floors,interiors,box,cyl,rod,group,shapeSlab,wall,rawWall,railing,windowOn,bedroomSlidingDoor,plant,rug,M,roofs,glassParts,labels}=H;
 const level=new T.Group();level.name='Tang_3_phong_tho_va_san_thuong';level.position.y=HEIGHT*2;level.userData.floor=2;house.add(level);floors.push(level);
 const slab=shapeSlab(level,buildingPlot,0,UPPER.slabThickness,M.stone,[UPPER.opening.map(toWorld)]);slab.name='San_tang_3_co_o_thang';
 const p=group(level);p.position.x=MIRROR_X;p.scale.x=-1;p.userData.floor=2;interiors.push(p);
 const mat=(color,roughness=.8)=>new T.MeshStandardMaterial({color,roughness});
 // Front parapet is half masonry, half railing; rear perimeter is a solid privacy wall.
 const boundary=buildingPlot.map(toWorld);
 for(let i=0;i<boundary.length;i++){
  let a=boundary[i],b=boundary[(i+1)%boundary.length];
  const inset=v=>{const dx=2.7-v[0],dz=6.6-v[1],d=Math.hypot(dx,dz);return [v[0]+dx/d*.075,v[1]+dz/d*.075]};a=inset(a);b=inset(b);
  const cuts=[0,1],t=(THIRD.frontEnd-a[1])/(b[1]-a[1]);if(t>0&&t<1)cuts.push(t);cuts.sort((x,y)=>x-y);
  for(let j=0;j<cuts.length-1;j++){
   const point=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],aa=point(cuts[j]),bb=point(cuts[j+1]),front=(aa[1]+bb[1])/2<THIRD.frontEnd;
   rawWall(p,aa,bb,front?THIRD.terrace.parapet:1.15,.14,[],M.plaster);
   if(front){const rail=group(p);rail.position.y=THIRD.terrace.parapet;railing(rail,aa,bb,THIRD.terrace.rail)}
  }
 }
 const guard=group(p);guard.name='Tuong_chan_o_thang_tang_3';
 rawWall(guard,[UPPER.hole.right+.05,UPPER.hole.start],[UPPER.hole.right+.05,UPPER.landingStart-.05],1.05,.1);
 rawWall(guard,[UPPER.hole.right,UPPER.landingStart-.05],[UPPER.landingX,UPPER.landingStart-.05],1.05,.1);
 rawWall(guard,[UPPER.hole.left,UPPER.hole.end+.05],[UPPER.landingX,UPPER.hole.end+.05],1.05,.1);
 // Landing opens into a side passage; the worship room never blocks circulation to either yard.
 const R=THIRD.prayer,prayer=group(p);prayer.name='Phong_tho_quay_ra_truoc';prayer.userData.floor=2;
 wall(prayer,[R.left,R.front],[R.left,R.back],R.height,.12,[{start:R.sideDoorStart-R.front,end:R.sideDoorStart+R.sideDoorWidth-R.front,bottom:0,top:2.28}]);
 bedroomSlidingDoor(prayer,R.left,R.sideDoorStart+R.sideDoorWidth/2,R.sideDoorWidth,'Cua_phong_tho_tu_sanh',Math.PI/2);
 wall(prayer,[R.left,R.back],[R.right,R.back],R.height,.12);wall(prayer,[R.right,R.front],[R.right,R.back],R.height,.12);
 const doorLeft=3.2,doorRight=4.6;
 wall(prayer,[R.left,R.front],[R.right,R.front],R.height,.12,[{start:doorLeft-R.left,end:doorRight-R.left,bottom:0,top:2.35}]);
 windowOn(prayer,[doorLeft,R.front],[doorRight,R.front],0,2.35);
 rod(prayer,[3.92,.92,R.front-.04],[3.92,1.17,R.front-.04],.012,M.dark);
 shapeSlab(prayer,[[R.left+.06,R.front+.06],[R.right-.06,R.front+.06],[R.right-.06,R.back-.06],[R.left+.06,R.back-.06]],.012,.012,M.wood);
 const altar=group(prayer,R.altarX,R.altarZ);altar.name='Ban_tho_gia_tien_huong_truoc';altar.userData.facing='front';
 const timber=mat('#75523b',.7);
 for(const x of[-.63,.63])for(const z of[-.21,.21])box(altar,x,.04,z,.085,.92,.085,timber,.01);
 box(altar,0,.77,0,1.4,.22,.5,timber,.02);box(altar,0,.99,0,1.55,.07,.6,timber,.025);box(altar,0,1.06,.15,1.35,.09,.25,timber,.012);
 for(const x of[-.53,.53]){cyl(altar,x,1.06,-.01,.075,.24,M.brass,.045);cyl(altar,x,1.3,-.01,.04,.045,M.white)}
 cyl(altar,0,1.06,-.14,.095,.11,M.brass,.115);for(const x of[-.025,0,.025])rod(altar,[x,1.15,-.14],[x,1.4,-.14],.0025,timber);
 for(const x of[-.2,0,.2])cyl(altar,x,1.065,-.25,.027,.035,M.white);
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=192;const ctx=canvas.getContext('2d');ctx.fillStyle='#75523b';ctx.fillRect(0,0,512,192);ctx.strokeStyle='#d8bb73';ctx.lineWidth=6;ctx.strokeRect(12,12,488,168);ctx.fillStyle='#e6ce8d';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 62px serif';ctx.fillText('GIA TIÊN',256,98);
 const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;const plaque=new T.Mesh(new T.PlaneGeometry(1.12,.42),new T.MeshStandardMaterial({map:tex,roughness:.8}));plaque.rotation.y=Math.PI;plaque.scale.x=-1;plaque.position.set(R.altarX,2.06,R.back-.067);prayer.add(plaque);
 rug(prayer,R.altarX,7.55,1.95,1.2);
 for(const x of[R.altarX-.36,R.altarX+.36])box(prayer,x,.035,7.65,.52,.07,.62,M.linen,.04);
 const prayerRoof=group(p);prayerRoof.name='Mai_phong_tho';prayerRoof.userData.floor=2;
 box(prayerRoof,(R.left+R.right)/2,R.height,(R.front+R.back)/2,R.right-R.left+.25,.13,R.back-R.front+.25,M.stone);roofs.push(prayerRoof);
 // Outdoor furniture and planters on the front terrace.
 const lounge=group(p);lounge.name='San_thuong_truoc_cay_va_ban_ghe';
 const table=THIRD.terrace;cyl(lounge,table.tableX,.52,table.tableZ,.43,.05,M.stone);cyl(lounge,table.tableX,.04,table.tableZ,.055,.48,M.dark);cyl(lounge,table.tableX,.025,table.tableZ,.25,.025,M.dark);
 function outdoorChair(x,z,rotation){const c=group(lounge,x,z,rotation);c.name='Ghe_ngoai_troi';box(c,0,.43,0,.51,.055,.5,M.oak,.035);box(c,0,.48,.22,.51,.44,.045,M.oak,.025);box(c,0,.486,0,.45,.045,.43,M.linen,.035);for(const a of[-.21,.21])for(const b of[-.2,.2])box(c,a,.025,b,.025,.405,.025,M.dark);for(const a of[-.27,.27]){box(c,a,.45,.16,.025,.2,.025,M.dark);box(c,a,.65,0,.035,.025,.46,M.oak,.008)}}
 outdoorChair(1.65,2.85,-Math.PI/2);outdoorChair(3.85,2.85,Math.PI/2);outdoorChair(2.75,1.75,Math.PI);outdoorChair(2.75,3.95,0);
 for(const [x,z,h] of [[.6,.55,.9],[2.6,.38,.6],[4.6,.55,1],[4.8,4.85,1.2],[.55,4.7,.85]])plant(lounge,x,z,h);
 box(lounge,4.72,.08,5.53,.46,.42,1.3,M.stone,.025);box(lounge,4.72,.5,5.53,.48,.04,1.32,M.oak,.018);
 // Covered laundry bay, with two full-size front-loading appliances facing into the yard.
 const L=THIRD.laundry,laundry=group(p);laundry.name='San_sau_giat_say';
 for(const appliance of L.machines){
  const g=group(laundry,appliance.x,appliance.z,Math.PI/2);g.name=appliance.kind==='washer'?'May_giat_600x650':'May_say_600x650';
  box(g,0,.055,0,.6,.85,.65,M.white,.025);box(g,0,.08,-.335,.565,.66,.025,M.linen,.018);
  const ring=new T.Mesh(new T.TorusGeometry(.185,.035,16,64),M.dark);ring.position.set(0,.43,-.36);g.add(ring);
  const door=new T.Mesh(new T.CircleGeometry(.16,48),mat('#5b7375',.2));door.rotation.y=Math.PI;door.position.set(0,.43,-.366);g.add(door);
  box(g,0,.75,-.34,.56,.12,.025,M.white,.008);box(g,.14,.795,-.357,.19,.05,.009,M.black,.005);
  const dial=new T.Mesh(new T.CylinderGeometry(.035,.035,.014,32),M.stone);dial.rotation.x=Math.PI/2;dial.position.set(-.11,.81,-.36);g.add(dial);
  for(const x of[-.22,.22])for(const z of[-.25,.25])cyl(g,x,.025,z,.018,.03,M.dark);
  g.userData={width:.6,depth:.65,height:.905};
 }
 const canopy=group(p);canopy.name='Mai_che_may_giat_say';canopy.userData.floor=2;
 for(const x of[L.x1,L.x2])for(const z of[L.z1,L.z2])box(p,x,.015,z,.045,L.roofHeight,.045,M.dark);
 for(const x of[L.x1,L.x2])box(canopy,x,L.roofHeight-.06,(L.z1+L.z2)/2,.05,.06,L.z2-L.z1+.2,M.dark);
 box(canopy,(L.x1+L.x2)/2,L.roofHeight,(L.z1+L.z2)/2,L.x2-L.x1+.2,.055,L.z2-L.z1+.2,mat('#cbd5cf',.5));
 for(let z=L.z1;z<=L.z2;z+=.32)box(canopy,(L.x1+L.x2)/2,L.roofHeight+.056,z,L.x2-L.x1+.2,.012,.012,M.dark);roofs.push(canopy);
 // Low hand-washing sink and stool, separate from the machine doors.
 const W=THIRD.handwash,wash=group(laundry,W.x,W.z);wash.name='Cho_ngoi_giat_tay';
 box(wash,0,.045,0,W.width,.35,W.depth,M.stone,.025);box(wash,0,.395,0,W.width+.04,.1,W.depth+.02,M.white,.02);
 box(wash,0,.497,0,W.width-.15,.008,W.depth-.16,mat('#bacac6'),.03);for(const x of[-W.width/2+.045,W.width/2-.045])box(wash,x,.495,0,.075,.095,W.depth,M.white,.01);for(const z of[-W.depth/2+.04,W.depth/2-.04])box(wash,0,.495,z,W.width,.095,.07,M.white,.01);
 rod(wash,[0,.57,.23],[0,.83,.23],.012,M.dark);rod(wash,[0,.83,.23],[0,.83,.02],.012,M.dark);
 cyl(laundry,W.x,.025,W.z-.82,.18,.25,M.olive);cyl(laundry,W.x,.275,W.z-.82,.2,.025,M.linen);
 const D=THIRD.drying,drying=group(p);drying.name='Gian_phoi_san_sau';
 for(const x of[D.left,D.right])for(const z of[D.front,D.back]){rod(drying,[x,.03,z],[x,D.height,z],.015,M.dark);cyl(drying,x,.02,z,.055,.015,M.dark)}
 for(const z of[D.front,D.back])rod(drying,[D.left,D.height,z],[D.right,D.height,z],.018,M.dark);
 for(let x=D.left;x<=D.right+.01;x+=.4)rod(drying,[x,D.height,D.front],[x,D.height,D.back],.003,M.dark);
 for(const [x,z,color] of [[.88,11.4,'#d5cdbd'],[1.68,11.9,'#99ad9e']]){
  const cloth=new T.PlaneGeometry(.43,.65,18,18),pos=cloth.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setZ(i,.018*Math.sin(pos.getX(i)*42)*Math.sin((pos.getY(i)+.325)*3));cloth.computeVertexNormals();
  const towel=new T.Mesh(cloth,new T.MeshStandardMaterial({color,roughness:1,side:T.DoubleSide}));towel.rotation.y=Math.PI/2;towel.position.set(x,1.565,z);drying.add(towel);
  for(const dz of[-.15,.15])box(drying,x,1.875,z+dz,.02,.05,.012,M.oak,.003);
 }
 for(const [name,x,z] of [['Sân trước · Cây và bàn ghế',2.7,2.8],['Phòng thờ · Hướng phía trước',3.85,7.7],['Giặt · Sấy có mái che',4.5,11.3],['Giặt tay',2.6,12.6],['Giàn phơi',1.3,11.6],['Sảnh cầu thang',2.6,9.8]])labels.push({text:name,point:new T.Vector3(MIRROR_X-x,.2,z),floor:2});
 level.userData={floor:2,prayer:THIRD.prayer,laundry:THIRD.laundry,handwash:THIRD.handwash,drying:THIRD.drying};
 return level;
}
