import {createPrayerDoors} from './prayer-doors.js';
import {shellSides,shellOutline,shellRightAt,prayerInteriorOutline,roofStairFrontGuard} from './building-joints.js';
import {createTerraceCanopy} from './terrace-canopy.js';
export let terraceCanopy,prayerDoors;
import {addRoofUtilities} from './exterior-upgrades.js';
import {trailingPlanters} from './trailing-garden.js';
import * as T from 'three';
import {HEIGHT,THIRD,UPPER,STAIR,buildingPlot,toWorld,MIRROR_X,entrySpan,BEDROOM_AC} from './design.js';

export function buildThirdFloor(H){
 const {house,floors,interiors,box,cyl,rod,group,shapeSlab,wall,rawWall,railing,windowOn,bedroomSlidingDoor,plant,rug,M,roofs,glassParts,labels}=H;
 const level=new T.Group();level.name='Tang_3_phong_tho_va_san_thuong';level.position.y=HEIGHT*2;level.userData.floor=2;house.add(level);floors.push(level);
 const slab=shapeSlab(level,buildingPlot,0,UPPER.slabThickness,M.stone,[UPPER.opening.map(toWorld)]);slab.name='San_tang_3_co_o_thang';
 const p=group(level);p.position.x=MIRROR_X;p.scale.x=-1;p.userData.floor=2;interiors.push(p);
 const mat=(color,roughness=.8)=>new T.MeshStandardMaterial({color,roughness});
 // Front parapet is half masonry, half railing; rear perimeter is a solid privacy wall.
 const E=THIRD.enclosure;
 const boundary=buildingPlot.map(toWorld);
 for(let i=0;i<boundary.length;i++){
  let a=boundary[i],b=boundary[(i+1)%boundary.length];
  const inset=v=>{const dx=2.7-v[0],dz=6.6-v[1],d=Math.hypot(dx,dz);return [v[0]+dx/d*.075,v[1]+dz/d*.075]};
  // Long party/side walls meet the shell exactly at front/back boundaries.
  if(Math.abs(b[1]-a[1])>1){const side=(a[0]+b[0])/2<2.7?0:1;const align=v=>[entrySpan(Math.max(.6,Math.min(13.15,v[1])))[side],v[1]];a=align(a);b=align(b)}else{a=inset(a);b=inset(b)}
  const cuts=[0,1];for(const z of[E.front,E.back]){const t=(z-a[1])/(b[1]-a[1]);if(t>0&&t<1)cuts.push(t)}cuts.sort((x,y)=>x-y);
  for(let j=0;j<cuts.length-1;j++){
   const point=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],aa=point(cuts[j]),bb=point(cuts[j+1]),front=(aa[1]+bb[1])/2<THIRD.frontEnd;
   if((aa[1]+bb[1])/2>E.front&&(aa[1]+bb[1])/2<E.back)continue;
   const solidStairSide=front&&(aa[0]+bb[0])/2<.40;
   rawWall(p,aa,bb,solidStairSide?1.15:front?THIRD.terrace.parapet:1.15,.14,[],M.plaster);
   if(front&&!solidStairSide){const rail=group(p);rail.position.y=THIRD.terrace.parapet;railing(rail,aa,bb,THIRD.terrace.rail)}
  }
 }
 const guard=group(p);guard.name='Tuong_chan_o_thang_tang_3';guard.userData.floor=2;
 const F=roofStairFrontGuard;
 wall(guard,F.a,F.b,F.height,F.thickness,[],true).name='Tuong_kin_mep_truoc_o_thang';
 wall(guard,[UPPER.hole.left,UPPER.hole.end+.05],[UPPER.landingX,UPPER.hole.end+.05],E.height,.1);
 // One weather enclosure contains the stairwell, its landing and the worship room.
 const shell=group(p);shell.name='Chuong_cu_lien_khoi_thang_va_phong_tho';shell.userData.floor=2;
 const leftFront=entrySpan(E.front)[0],leftBack=entrySpan(E.back)[0];
 for(const side of shellSides)for(let i=1;i<side.length;i++)wall(shell,side[i-1],side[i],E.height,.18,[],true);
 const frontDoor=E.frontDoor,rearDoor=E.rearDoor;
 wall(shell,[leftFront,E.front],[shellRightAt(E.front),E.front],E.height,.12,[
  {start:frontDoor.left-leftFront,end:frontDoor.left+frontDoor.width-leftFront,bottom:0,top:frontDoor.height}
 ],true);
 wall(shell,[leftBack,E.back],[shellRightAt(E.back),E.back],E.height,.12,[{start:rearDoor.left-leftBack,end:rearDoor.left+rearDoor.width-leftBack,bottom:0,top:2.3}],true);
 function exteriorDoor(left,z,width,name){
  const g=group(shell,left+width/2,z);g.name=name;
  box(g,0,.04,0,width-.08,2.21,.028,M.glass);
  for(const x of[-width/2+.023,width/2-.023])box(g,x,.025,0,.046,2.275,.085,M.dark);
  for(const y of[.025,2.255])box(g,0,y,0,width,.045,.085,M.dark);
  rod(g,[width/2-.14,.95,-.06],[width/2-.14,1.18,-.06],.012,M.dark);
  glassParts.push({obj:g,floor:2,hideCut:true});
  box(shell,left+width/2,0,z,width+.12,.04,.22,M.stone);
 }
 prayerDoors=createPrayerDoors({parent:shell,spec:frontDoor,z:E.front,group,box,rod,M,glassParts});
 exteriorDoor(rearDoor.left,E.back,rearDoor.width,'Cua_kin_ra_san_sau');

 // One rectangular timber zone; a continuous side screen conceals both altar undersides.
 const R=THIRD.prayer,prayer=group(p);prayer.name='Phong_tho_mo_hai_ban_tho';prayer.userData.floor=2;
 const screen=wall(prayer,[R.screen.x,R.screen.z1],[R.screen.x,R.screen.z2],R.screen.height,.12);screen.name='Vach_ngan_che_ban_tho';screen.userData={coversBothAltars:true,...R.screen};
 const cable=box(prayer,R.screen.x-.0775,.06,(R.screen.z1+R.back)/2,.035,.07,R.back-R.screen.z1-.1,M.linen);cable.name='Hop_ky_thuat_giau_day_ban_tho';
 const leftScreen=wall(prayer,[R.left,R.front],[R.left,R.back],R.screen.height,.12);leftScreen.name='Vach_trai_phong_tho_noi_lien_tuong_o_thang';
 const rearScreen=wall(prayer,[UPPER.hole.right,R.back],[R.rearWallRight,R.back],R.height,.12);rearScreen.name='Vach_sau_ban_tho_chua_loi_tu_chieu_toi';
 prayer.userData.arrivalRoute={side:'right',width:Math.min(shellRightAt(R.back),shellRightAt(R.front))-.09-(R.screen.x+.06),rearHallDepth:E.back-.06-(R.back+.06)};
 shapeSlab(prayer,prayerInteriorOutline,.012,.012,M.wood);
 const altar=group(prayer,R.altarX,R.altarZ);altar.name='Ban_tho_gia_tien_phia_sau';altar.userData={facing:'front',...R.ancestor};
 const timber=mat('#75523b',.7);
 for(const x of[-.63,.63])for(const z of[-.21,.21])box(altar,x,.04,z,.085,.92,.085,timber,.01);
 box(altar,0,.83,0,1.4,.16,.5,timber,.02);box(altar,0,.99,0,1.55,.07,.6,timber,.025);box(altar,0,1.06,.15,1.35,.09,.25,timber,.012);
 for(const x of[-.53,.53]){cyl(altar,x,1.06,-.01,.075,.24,M.brass,.045);cyl(altar,x,1.3,-.01,.04,.045,M.white)}
 cyl(altar,0,1.06,-.14,.095,.11,M.brass,.115);for(const x of[-.025,0,.025])rod(altar,[x,1.15,-.14],[x,1.4,-.14],.0025,timber);
 for(const x of[-.2,0,.2])cyl(altar,x,1.065,-.25,.027,.035,M.white);
 // Matched, restrained timber apron: recessed panels instead of a solid bulky skirt.
 for(const xx of[-.43,0,.43])box(altar,xx,.86,-.255,.36,.085,.012,M.wood,.005);
 altar.scale.set(R.ancestor.width/1.55,R.ancestor.height/1.06,R.ancestor.depth/.6);
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=192;const ctx=canvas.getContext('2d');ctx.fillStyle='#75523b';ctx.fillRect(0,0,512,192);ctx.strokeStyle='#d8bb73';ctx.lineWidth=6;ctx.strokeRect(12,12,488,168);ctx.fillStyle='#e6ce8d';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 62px serif';ctx.fillText('GIA TIÊN',256,98);
 const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;const plaque=new T.Mesh(new T.PlaneGeometry(1.12,.42),new T.MeshStandardMaterial({map:tex,roughness:.8}));plaque.rotation.y=Math.PI;plaque.scale.x=-1;plaque.position.set(R.altarX,2.06,R.back-.067);prayer.add(plaque);
 const buddhist=group(prayer,R.altarX,R.buddhaZ);buddhist.name='Ban_tho_Phat_phia_truoc';buddhist.userData={facing:'front',...R.buddhist};
 for(const xx of [-.55,.55])for(const zz of [-.2,.2])box(buddhist,xx,.035,zz,.075,1.18,.075,timber,.008);
 box(buddhist,0,1.06,0,1.25,.14,.45,timber,.015);box(buddhist,0,1.2,0,1.42,.08,.57,timber,.02);
 const gold=mat('#b69b61',.42),figure=group(buddhist);figure.name='Tuong_Phat_minh_hoa';
 cyl(figure,0,1.28,.04,.19,.055,gold,.17);
 for(const [xx,yy,zz,sx,sy,sz] of [[0,1.39,.04,.2,.075,.12],[0,1.57,.06,.12,.18,.085],[0,1.79,.045,.075,.09,.075],[0,1.88,.05,.033,.035,.033]]){
  const part=new T.Mesh(new T.SphereGeometry(1,28,20),gold);part.position.set(xx,yy,zz);part.scale.set(sx,sy,sz);part.castShadow=true;figure.add(part);
 }
 for(const xx of [-.46,.46]){cyl(buddhist,xx,1.28,-.04,.05,.17,M.brass,.032);cyl(buddhist,xx,1.45,-.04,.025,.04,M.white)}
 cyl(buddhist,0,1.28,-.19,.065,.07,M.brass,.08);
 for(const xx of[-.36,0,.36])box(buddhist,xx,1.085,-.23,.30,.075,.012,M.wood,.005);
 buddhist.scale.set(R.buddhist.width/1.42,R.buddhist.height/1.28,R.buddhist.depth/.57);
 rug(prayer,R.altarX,7.0,1.65,.8);
 const roof=group(p);roof.name='Mai_kin_chung_cau_thang_phong_tho';roof.userData={floor:2,coversStairOpening:true,slope:E.roofSlope};
 const roofOutline=shellOutline.map(([x,z])=>[x+(x<2.7?-.12:.12),z===E.front?z-.2:z===E.back?z+.12:z]);
 // Continuous perimeter ring visually ties wall heads to the existing column axes.
 const ring=group(shell);ring.name='Dai_dau_tuong_chuong_cu';
 for(let i=0;i<shellOutline.length;i++){
  const a=shellOutline[i],b=shellOutline[(i+1)%shellOutline.length];
  const beam=group(ring,a[0],a[1],-Math.atan2(b[1]-a[1],b[0]-a[0]));
  box(beam,Math.hypot(b[0]-a[0],b[1]-a[1])/2,E.height-.2,0,Math.hypot(b[0]-a[0],b[1]-a[1]),.2,.25,M.stone);
 }
 glassParts.push({obj:ring,floor:2,hideCut:true});
 const cover=shapeSlab(roof,roofOutline,E.height+E.roofThickness,E.roofThickness,M.stone);
 const pos=cover.geometry.attributes.position;
 for(let i=0;i<pos.count;i++)if(pos.getY(i)>E.roofThickness-.001)pos.setY(i,pos.getY(i)+E.roofSlope*(E.back+.12-pos.getZ(i)));
 pos.needsUpdate=true;cover.geometry.computeVertexNormals();roofs.push(roof);
 addRoofUtilities({roof,box,cyl,rod,group,M});
 // Gutters drain outside the enclosed stairwell; raised sills separate the yards.
 const roofDrain=group(roof);roofDrain.name='Mang_va_ong_thoat_mai_ngoai_o_thang';
 const drainage=group(p);drainage.name='Thu_nuoc_ngoai_chan_cua';
 box(roofDrain,(leftBack+shellRightAt(E.back))/2,E.height+.07,E.back+.12,shellRightAt(E.back)-leftBack+.18,.06,.09,M.dark);
 rod(roofDrain,[shellRightAt(E.back)+.09,E.height+.1,E.back+.12],[shellRightAt(E.back)+.09,.12,E.back+.12],.035,M.dark);
 for(const [door,z] of[[frontDoor,E.front-.25],[rearDoor,E.back+.25]]){
  box(drainage,door.left+door.width/2,.002,z,door.width+.24,.014,.12,M.dark);
  for(let x=door.left-.06;x<door.left+door.width+.1;x+=.055)box(drainage,x,.016,z,.012,.005,.1,M.stone);
 }
 // Green terrace: keep the centre open and soften the front parapet with trailing plants.
 const garden=group(p);garden.name='San_thuong_truoc_vuon_cay';
 for(const [x,z,h] of [[.65,1,.95],[4.65,1.1,1.3],[4.85,4.85,1.15],[.6,4.9,1.05],[4.4,4.1,.8]])plant(garden,x,z,h);
 const greenSegments=[];
 for(let i=0;i<boundary.length;i++){
  const a=boundary[i],b=boundary[(i+1)%boundary.length];
  if(Math.min(a[1],b[1])>=THIRD.frontEnd-.15)continue;
  const clip=q=>{if(q[1]<THIRD.frontEnd-.15)return q;const other=q===a?b:a,t=(THIRD.frontEnd-.15-other[1])/(q[1]-other[1]);return [other[0]+t*(q[0]-other[0]),THIRD.frontEnd-.15]};
  greenSegments.push([clip(a),clip(b)]);
 }
 trailingPlanters({parent:garden,rhythm:true,segments:greenSegments,center:[2.7,3],box,rod,group,M,clearances:BEDROOM_AC.map(s=>({minX:4.5,z:s.outdoor.z,halfWidth:s.outdoor.width/2+.15,maxDrop:1.05}))});
 terraceCanopy=createTerraceCanopy({parent:p,box,M});
 // Covered laundry bay, with two full-size front-loading appliances facing into the yard.
 const L=THIRD.laundry,laundry=group(p);laundry.name='San_sau_giat_say';
 for(const appliance of L.machines){
  const g=group(laundry,appliance.x,appliance.z,appliance.rotation);g.name=appliance.kind==='washer'?'May_giat_600x650':'May_say_600x650';
  box(g,0,.055,0,.6,.85,.65,M.white,.025);box(g,0,.08,-.335,.565,.66,.025,M.linen,.018);
  const ring=new T.Mesh(new T.TorusGeometry(.185,.035,16,64),M.dark);ring.position.set(0,.43,-.36);g.add(ring);
  const door=new T.Mesh(new T.CircleGeometry(.16,48),mat('#5b7375',.2));door.rotation.y=Math.PI;door.position.set(0,.43,-.366);g.add(door);
  box(g,0,.75,-.34,.56,.12,.025,M.white,.008);box(g,.14,.795,-.357,.19,.05,.009,M.black,.005);
  const dial=new T.Mesh(new T.CylinderGeometry(.035,.035,.014,32),M.stone);dial.rotation.x=Math.PI/2;dial.position.set(-.11,.81,-.36);g.add(dial);
  for(const x of[-.22,.22])for(const z of[-.25,.25])cyl(g,x,.025,z,.018,.03,M.dark);
  g.userData={width:.6,depth:.65,height:.905};
 }
 // Machines sit against the left side of the penthouse rear wall, facing the open yard.
 const machineCenter=(L.machines[0].x+L.machines[1].x)/2;
 box(laundry,machineCenter,.94,L.machines[0].z,1.44,.045,.7,M.stone,.015);
 const canopy=group(p);canopy.name='Mai_dua_ngan_che_hai_may';canopy.userData={floor:2,attachedToPenthouse:true,projection:L.z2-E.back};
 const canopyWidth=L.x2-L.x1,canopyDepth=L.z2-L.z1,canopyZ=(L.z1+L.z2)/2;
 // Slim metal canopy attached to the wall with two matching front support posts.
 const panel=box(canopy,(L.x1+L.x2)/2,L.roofHeight,canopyZ,canopyWidth,.055,canopyDepth,mat('#c6cbc3',.55));panel.rotation.x=.02;
 box(canopy,(L.x1+L.x2)/2,L.roofHeight-.027,canopyZ,canopyWidth-.06,.025,canopyDepth-.04,M.oak);
 for(const x of[L.x1+.025,L.x2-.025]){
  box(canopy,x,L.roofHeight-.08,canopyZ,.045,.08,canopyDepth,M.dark);
  box(canopy,x,2.27,E.back+.075,.055,.29,.055,M.dark);
 }
 box(canopy,(L.x1+L.x2)/2,L.roofHeight-.045,L.z2,canopyWidth,.075,.055,M.dark);
 box(canopy,(L.x1+L.x2)/2,L.roofHeight-.045,E.back+.025,canopyWidth,.14,.055,M.dark);
 const supports=group(canopy);supports.name='Hai_tru_do_mai_che_may_giat';
 for(const x of[L.x1+.035,L.x2-.035]){
  const post=box(supports,x,.035,L.z2-.025,.055,L.roofHeight-.07,.055,M.dark,.004);post.name='Tru_do_mai_che';
  box(supports,x,.015,L.z2-.025,.12,.02,.12,M.dark,.008);
 }
 rod(canopy,[L.x1-.025,L.roofHeight-.035,L.z2+.015],[L.x1-.025,.1,L.z2+.015],.012,M.dark);
 roofs.push(canopy);
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
 for(const [x,z,color] of [[2.5,11.95,'#d5cdbd'],[3.4,12.3,'#99ad9e']]){
  const cloth=new T.PlaneGeometry(.43,.65,18,18),pos=cloth.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setZ(i,.018*Math.sin(pos.getX(i)*42)*Math.sin((pos.getY(i)+.325)*3));cloth.computeVertexNormals();
  const towel=new T.Mesh(cloth,new T.MeshStandardMaterial({color,roughness:1,side:T.DoubleSide}));towel.rotation.y=Math.PI/2;towel.position.set(x,1.565,z);drying.add(towel);
  for(const dz of[-.15,.15])box(drying,x,1.875,z+dz,.02,.05,.012,M.oak,.003);
 }
 for(const [name,x,z] of [['Sân trước · Vườn cây',2.7,2.8],['Phòng thờ · Hướng phía trước',3.85,7.7],['Giặt · Sấy có mái che',1.05,11.1],['Giặt tay lộ thiên',4.7,12.5],['Giàn phơi lộ thiên',3,12.1],['Sảnh cầu thang',2.6,9.8]])labels.push({text:name,point:new T.Vector3(MIRROR_X-x,.2,z),floor:2});
 level.userData={floor:2,enclosure:THIRD.enclosure,prayer:THIRD.prayer,laundry:THIRD.laundry,handwash:THIRD.handwash,drying:THIRD.drying};
 return level;
}
