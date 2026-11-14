import * as T from 'three';
import {GROUND,HEIGHT,MASTER_SUITE,SMALL_SUITE,THIRD,entrySpan} from './design.js';

export function addWindowAwnings({parents,box,rod,group,M}){
 const metal=new T.MeshStandardMaterial({color:'#5a645e',metalness:.55,roughness:.48});
 function canopy(parent,x,z,width,head,rotation,name){
  const g=group(parent,x,z,rotation);g.position.y=head+.14;g.name=name;g.userData={width,projection:.43,windowHead:head};
  const top=box(g,0,0,.23,width,.045,.46,metal,.007);top.rotation.x=.045;
  box(g,0,-.022,.22,width-.05,.018,.40,M.oak);
  box(g,0,-.012,.447,width,.055,.025,metal);
  for(const xx of[-width/2+.12,width/2-.12])rod(g,[xx,-.18,.005],[xx,-.015,.35],.012,M.dark);
 }
 for(const w of GROUND.rightWindows)canopy(parents[0],entrySpan(w.z)[1]+.095,w.z,w.width+.28,w.head,Math.PI/2,'Mai_che_cua_so_phong_ong_ba');
 for(const [w,name] of [[MASTER_SUITE.ventilationWindow,'master'],[MASTER_SUITE.commonWindow,'khu_chung'],[SMALL_SUITE.window,'ban_hoc_phong_nho']])canopy(parents[1],entrySpan(w.z)[1]+.095,w.z,w.width+.26,w.head,Math.PI/2,`Mai_che_cua_so_${name}`);
 canopy(parents[1],1.58,-.045,2.42,2.55,Math.PI,'Mai_che_cua_so_PC_master');
 canopy(parents[2],3.9,THIRD.enclosure.front-.066,1.66,2.4,Math.PI,'Mai_che_cua_so_phong_tho');
}

export function addRoofUtilities({roof,box,cyl,rod,group,M}){
 const g=group(roof);g.name='Bon_nuoc_va_thang_len_mai';
 const steel=new T.MeshStandardMaterial({color:'#bec9c7',roughness:.3,metalness:.8});
 const x=4.08,z=8.85,y=THIRD.enclosure.height+THIRD.enclosure.roofThickness+THIRD.enclosure.roofSlope*(THIRD.enclosure.back+.12-z)+.005;
 const tank=group(g,x,z);tank.position.y=y;tank.name='Bon_nuoc_dung_1000L';tank.userData={nominalLitres:1000,diameter:1.02,height:1.45};
 for(const xx of[-.37,.37])for(const zz of[-.3,.3])box(tank,xx,0,zz,.045,.18,.045,M.dark);
 box(tank,0,.15,0,.94,.045,.85,M.dark);
 cyl(tank,0,.20,0,.51,1.30,steel);
 for(const yy of[.24,.43,.64,.85,1.06,1.27,1.46]){
  const ring=new T.Mesh(new T.TorusGeometry(.512,.012,8,48),steel);ring.rotation.x=Math.PI/2;ring.position.y=yy;tank.add(ring);
 }
 const cap=new T.Mesh(new T.SphereGeometry(.51,32,12,0,Math.PI*2,0,Math.PI/2),steel);cap.scale.y=.18;cap.position.y=1.5;tank.add(cap);
 cyl(tank,0,1.57,0,.17,.035,M.dark);rod(tank,[.45,.35,0],[.7,.35,0],.018,steel);
 rod(g,[x+.7,y+.35,z],[4.9,y+.35,z],.016,M.white);rod(g,[4.9,y+.35,z],[4.9,y+.35,10.58],.016,M.white);rod(g,[4.9,y+.35,10.58],[4.9,.25,10.58],.016,M.white);
 const ladder=group(g);ladder.name='Thang_thep_len_mai_chuong_cu';ladder.userData={clearWidth:.46,rungSpacing:.28,roofLevel:y};
 for(const xx of[2.17,2.63]){
  rod(ladder,[xx,.22,10.82],[xx,y+1.0,10.82],.021,M.dark);
  rod(ladder,[xx,y+1.0,10.82],[xx,y+1.0,10.38],.021,M.dark);
  rod(ladder,[xx,y+1.0,10.38],[xx,y+.04,10.38],.021,M.dark);
  for(const yy of[.6,1.8,2.8])rod(ladder,[xx,yy,10.82],[xx,yy,10.64],.014,M.dark);
 }
 for(let yy=.3;yy<y+.05;yy+=.28)rod(ladder,[2.17,yy,10.82],[2.63,yy,10.82],.016,M.dark);
 box(g,2.4,THIRD.enclosure.height+THIRD.enclosure.roofThickness+THIRD.enclosure.roofSlope*(THIRD.enclosure.back+.12-10.32)+.005,10.32,.7,.025,.55,M.dark,.006);
 return g;
}

export function addSmallBalcony({parent,box,rod,group,wall,windowOn,shapeSlab,plant,M}){
 const B=SMALL_SUITE.balcony,g=group(parent);g.name='Loggia_cay_phong_nho_tang_2';g.userData={...B};
 const a=[entrySpan(B.front)[1],B.front],b=[entrySpan(B.back)[1],B.back];
 shapeSlab(g,[[B.innerX,B.front],a,b,[B.innerX,B.back]],.012,.025,M.stone);
 wall(g,[B.innerX,B.front],[B.innerX,B.back],HEIGHT-.18,.10,[{start:B.doorStart-B.front,end:B.doorStart+B.doorWidth-B.front,bottom:0,top:2.35}]);
 const glazing=windowOn(g,[B.innerX,B.doorStart],[B.innerX,B.doorStart+B.doorWidth],0,2.35);glazing.name='Cua_kinh_lua_ra_loggia_phong_nho';
 rod(g,[B.innerX-.075,.95,B.doorStart+.12],[B.innerX-.075,1.2,B.doorStart+.12],.01,M.dark);
 rod(g,[B.innerX,2.4,B.doorStart-.1],[B.innerX,2.4,B.doorStart+B.doorWidth+.1],.014,M.dark);
 for(const end of [a,b])wall(g,[B.innerX,end[1]],end,HEIGHT-.18,.1);
 wall(g,a,b,.48,.12);
 for(let z=B.front;z<=B.back+.001;z+=.12){const x=entrySpan(z)[1];rod(g,[x,.48,z],[x,1.1,z],.01,M.dark)}
 rod(g,[a[0],1.1,a[1]],[b[0],1.1,b[1]],.02,M.dark);
 for(const z of [B.front+.28,B.back-.28]){
  const x=entrySpan(z)[1]-.18,pot=plant(g,x,z,.42);pot.position.y=.76;
  rod(g,[x+.18,1.1,z],[x,1.1,z],.008,M.dark);
  rod(g,[x,1.1,z],[x,.88,z],.008,M.dark);
 }
 box(g,B.innerX+.10,.035,B.front+.12,.16,.015,.13,M.dark);
 return g;
}
