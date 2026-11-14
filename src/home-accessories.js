import * as T from 'three';
import {entrySpan} from './design.js';

export function displayBookcase({parent,box,group,M}){
 const z=4.12,depth=.32,width=1.26;
 const g=group(parent,entrySpan(z)[1]-.09-depth/2-.01,z,Math.PI/2+Math.atan((entrySpan(z+.1)[1]-entrySpan(z-.1)[1])/.2));g.name='Tu_sach_va_trung_bay_LEGO_master';
 box(g,0,.04,depth/2-.012,width,1.68,.024,M.oak);
 for(const x of[-width/2+.015,width/2-.015])box(g,x,.04,0,.03,1.68,depth,M.oak);
 for(const y of[.04,.56,1.08,1.69])box(g,0,y,0,width,.025,depth,M.oak);
 for(let row=0;row<2;row++)for(let k=0;k<5;k++){
  const x=-.5+k*.075,h=.23+(k%3)*.045;
  box(g,x,.59+row*.52,-.045,.055,h,.18,[M.sage,M.linen,M.olive][k%3],.004);
 }
 // A small brick-built spacecraft, car and robot give the shelves a clear display use.
 const toy=group(g,.3,0);toy.name='Mo_hinh_do_choi_trung_bay';
 box(toy,0,.59,-.04,.27,.05,.15,M.sage,.006);box(toy,0,.64,-.04,.12,.04,.1,M.dark,.004);
 for(const x of[-.1,.1])for(const z of[-.1,.02])box(toy,x,.575,z,.04,.06,.035,M.dark,.007);
 box(toy,0,1.13,-.035,.2,.04,.11,M.white);box(toy,0,1.17,-.035,.08,.04,.08,M.olive);
 box(toy,0,1.13,-.035,.1,.12,.075,M.sage);box(toy,0,1.25,-.035,.09,.07,.075,M.white);
 for(const x of[-.028,.028])box(toy,x,1.275,-.076,.013,.013,.008,M.dark);
 g.userData={width,depth,height:1.72};return g;
}

export function securityCamera({parent,position,target,name,mountRotation=0,box,cyl,rod,group,M}){
 const base=group(parent,position[0],position[2]);base.position.y=position[1];base.rotation.y=mountRotation;base.name=name;
 box(base,0,-.055,0,.12,.12,.035,M.white,.015);
 rod(base,[0,0,0],[0,-.07,-.13],.016,M.white);
 const head=group(base);head.position.set(0,-.07,-.13);
 const direction=new T.Vector3(target[0]-position[0],target[1]-position[1],target[2]-position[2]).normalize().applyAxisAngle(new T.Vector3(0,1,0),-mountRotation);
 head.quaternion.setFromUnitVectors(new T.Vector3(0,0,-1),direction);
 box(head,0,-.045,0,.105,.09,.16,M.white,.02);box(head,0,-.035,-.085,.08,.07,.015,M.dark,.014);
 const lens=new T.Mesh(new T.CircleGeometry(.022,20),M.black);lens.rotation.y=Math.PI;lens.position.set(0,0,-.095);head.add(lens);
 box(head,.034,.015,-.095,.007,.007,.003,M.sage);
 base.userData={target,position};return base;
}
