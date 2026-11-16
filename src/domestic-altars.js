import * as T from 'three';
import {entrySpan,GROUND} from './design.js';

// Design coordinates, metres. Symbolic fittings, not a prescription of ritual practice.
export const DOMESTIC_ALTARS={
 earth:{x:entrySpan(4.68)[0]+.48/2+.025,z:4.68,width:.61,depth:.48,height:.805,rotation:-Math.PI/2},
 kitchen:{x:2.84,z:8.925,width:.48,depth:.33,shelfY:2.02,height:.67,rotation:0},
};
export function buildDomesticAltars({parent,group,box,cyl,rod,M}){
 const wood=M.wood.clone();wood.color.set('#927b62');
 const ceramic=new T.MeshStandardMaterial({color:'#d3be91',roughness:.85});
 const warm=new T.MeshStandardMaterial({color:'#e6c78a',emissive:'#e0a554',emissiveIntensity:.25,roughness:.8});
 function oval(g,x,y,z,sx,sy,sz,mat){const m=new T.Mesh(new T.SphereGeometry(1,16,10),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m;}
 function fittings(g,w,d,y){
  // Incense bowl and unlit sticks, removable offering cups and a small flower vase.
  cyl(g,0,y,-d*.20,.047,.055,ceramic);cyl(g,0,y+.055,-d*.20,.039,.004,M.soil);
  for(const x of[-.017,0,.017])rod(g,[x,y+.057,-d*.20],[x,y+.17,-d*.20],.0017,wood);
  for(const x of[-.075,0,.075])cyl(g,x,y,-d*.39,.014,.022,ceramic);
  cyl(g,-w*.34,y,-d*.14,.025,.07,ceramic);
  for(const dx of[-.012,.012]){rod(g,[-w*.34,y+.05,-d*.14],[-w*.34+dx,y+.19,-d*.13],.002,M.leaf);oval(g,-w*.34+dx,y+.19,-d*.13,.012,.018,.012,M.linen);}
  cyl(g,w*.33,y,-d*.16,.045,.009,ceramic);
  for(const dx of[-.018,.018])oval(g,w*.33+dx,y+.028,-d*.16,.021,.022,.021,M.olive);
 }
 const e=DOMESTIC_ALTARS.earth,g=group(parent,e.x,e.z,e.rotation);g.name='Ban_tho_Ong_Dia_Than_Tai';g.userData={...e,faces:'living-room',floor:0,notUnderStairs:true,besideStairFoot:true};
 // Match the living-room joinery: one light mineral surround, warm oak interior.
 const earthOak=M.oak;
 box(g,0,.005,0,e.width,.045,e.depth,M.stone,.012);
 box(g,0,.05,0,e.width,.085,e.depth,M.linen,.012);
 box(g,0,.135,0,e.width,.025,e.depth,M.stone,.008);
 box(g,0,.16,e.depth/2-.018,e.width,.60,.036,earthOak,.008);
 box(g,0,.205,e.depth/2-.04,e.width-.095,.49,.012,earthOak,.004);
 for(const x of[-e.width/2+.022,e.width/2-.022])box(g,x,.16,0,.044,.60,e.depth,M.linen,.01);
 box(g,0,.76,0,e.width+.02,.045,e.depth+.012,M.stone,.012);
 box(g,0,.747,.075,e.width-.12,.008,.018,warm,.003);
 // The shrine's own back now rests along the side wall, like the TV.
 // Quiet symbolic ceramic figures: Thần Tài on viewer's left, Ông Địa on right.
 // Seen from the living room after the house-root reflection.
 for(const [x,wealth] of [[-.115,true],[.115,false]]){
  oval(g,x,.205,.09,.075,.035,.065,ceramic);
  oval(g,x,.27,.095,.055,.065,.042,ceramic);
  oval(g,x,.355,.08,.038,.043,.035,ceramic);
  oval(g,x,.387,.087,.044,.018,.037,earthOak);
  if(wealth){oval(g,x,.318,.045,.016,.036,.009,M.white);box(g,x,.393,.087,.08,.014,.032,M.brass,.005);}
  else oval(g,x,.264,.052,.042,.042,.025,ceramic);
 }
 fittings(g,e.width,e.depth,.16);
 for(const x of[-.205,.205])cyl(g,x,.16,-.04,.018,.07,warm);
 // A sealed backing of the same joinery conceals the shrine's rear from the TV side.
 box(g,0,.16,e.depth/2+.003,e.width,.60,.018,earthOak,.008);
 const k=DOMESTIC_ALTARS.kitchen,t=group(parent,k.x,k.z,k.rotation);t.name='Ke_tho_Ong_Tao_trong_bep';t.position.y=k.shelfY;t.userData={...k,floor:0,offsetFromHob:true};
 box(t,0,-.04,0,k.width,.04,k.depth,M.stone,.008);
 box(t,0,-.075,.01,k.width+.02,.035,k.depth+.02,wood,.008);
 for(const x of[-.17,.17]){box(t,x,-.22,k.depth/2-.025,.035,.18,.035,wood,.006);rod(t,[x,-.2,k.depth/2-.025],[x,-.065,-k.depth*.25],.012,wood);}
 box(t,0,0,k.depth/2-.012,k.width,.60,.024,wood,.007);
 box(t,0,.06,k.depth/2-.029,k.width-.07,.47,.012,M.linen,.004);
 box(t,0,.60,.035,k.width+.025,.045,k.depth-.03,wood,.008);
 // Upright tablet with three symbolic medallions for Táo Quân.
 box(t,0,.115,.095,.21,.30,.022,wood,.008);
 for(const x of[-.055,0,.055])oval(t,x,.33,.077,.018,.025,.008,M.brass);
 for(const y of[.19,.22,.25])box(t,0,y,.076,.10,.003,.003,M.brass);
 fittings(t,k.width,k.depth,0);
 return {earth:g,kitchen:t};
}
