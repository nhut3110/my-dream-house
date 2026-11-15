import {fanStepMarker} from './stair-entry.js';
import {HEIGHT,UPPER,STAIR,entrySpan,THIRD,MASTER_SUITE,SMALL_SUITE,SERVICE} from './design.js';

// Metres above each finished floor. Warm living areas; neutral task/bathroom lighting.
export const LIGHTING_PLAN=[];
const add=(floor,zone,kind,x,z,options={})=>LIGHTING_PLAN.push({floor,zone,kind,x,z,y:HEIGHT-UPPER.slabThickness-.015,kelvin:3000,...options});
for(const [x,z] of [[1.55,3.15],[3.7,3.15],[1.55,4.7],[3.7,4.7]])add(0,'living','ceiling',x,z,{primary:z===3.15,allPriority:10,power:65,range:5.8});
add(0,'dining','pendant',SERVICE.dining.x,SERVICE.dining.z,{y:2.128,radius:.175,primary:true});
for(const z of [6.9,7.8,8.75])add(0,'kitchen','ceiling',4.65,z,{kelvin:3500,primary:z===7.8});
add(0,'rear-hall','ceiling',1.35,10.85,{radius:.13,primary:true});
for(const z of [10.0,12.2])add(0,'grandparents','ceiling',3.7,z,{radius:.18,primary:z===10.0});
for(const z of [11.65,12.65])add(0,'bath-grandparents','ceiling',.95,z,{kelvin:3500,primary:z===11.65});
add(0,'washbasin','mirror',entrySpan(10.55)[0]+.105,10.55,{y:1.92,rotation:Math.PI/2,length:.5,kelvin:3500});
add(0,'address','address',3.5,-.047,{y:1.72,rotation:Math.PI,primary:true,priority:7,power:3,range:1.5});
add(0,'porch','wall',entrySpan(2)[1]+.005,2,{y:1.5,rotation:-Math.PI/2,primary:true,priority:9,power:35,range:4.5});
for(const z of [4.95,8.8])add(0,'exterior','wall',entrySpan(z)[1]+.095,z,{y:2.1,rotation:Math.PI/2,primary:true,priority:8,allPriority:13,power:16,range:6.5});
add(1,'master','ceiling',1.34,2.36,{radius:.23,primary:true,allPriority:10,power:70,range:5.2});
add(1,'master-pc','ceiling',1.5,.65,{kelvin:3500});
add(1,'master-wardrobe','ceiling',4.05,5.8,{radius:.14});
add(1,'bath-master','ceiling',1.7,4.5,{radius:.15,kelvin:3500,primary:true});
add(1,'bath-master','ceiling',.8,4.45,{kelvin:3500});
add(1,'master-vanity','ceiling',2.87,4.25,{radius:.13});
add(1,'master-vanity','mirror',MASTER_SUITE.washbasin.x,5.225,{y:1.99,length:1.02,rotation:Math.PI,kelvin:3500});
add(1,'common','ceiling',4.05,8,{radius:.22,primary:true});
add(1,'upper-hall','ceiling',2.28,6.65,{radius:.13});
add(1,'small-bedroom','ceiling',SMALL_SUITE.bed.x,11.88,{radius:.22,primary:true,allPriority:9,power:70});
add(1,'small-wardrobe','ceiling',4.15,9.85,{radius:.12});
add(1,'bath-small','ceiling',1.2,11.55,{radius:.15,kelvin:3500,primary:true});
add(1,'bath-small','ceiling',1.05,12.65,{kelvin:3500});
add(1,'balcony','wall',MASTER_SUITE.balcony.splitX+.065,.72,{y:2.1,rotation:Math.PI/2,primary:true,priority:9});
for(const z of [4.95,8.8])add(1,'exterior','wall',entrySpan(z)[1]+.095,z,{y:2.1,rotation:Math.PI/2,primary:true,priority:8,allPriority:13,power:16,range:6.5});
add(1,'small-balcony','wall',SMALL_SUITE.balcony.innerX+.055,12.6,{y:2.1,rotation:Math.PI/2});
add(2,'prayer','ceiling',THIRD.prayer.altarX,8.35,{y:3.035,radius:.2,primary:true});
for(const z of [7.4,9.9])add(2,'roof-hall','ceiling',1.85,z,{y:3.035,radius:.14,primary:z===9.9});
for(const x of [THIRD.enclosure.frontDoor.left-.15,THIRD.enclosure.frontDoor.left+THIRD.enclosure.frontDoor.width+.15])add(2,'front-terrace','wall',x,THIRD.enclosure.front-.066,{y:2.23,rotation:Math.PI,primary:true,priority:10,allPriority:8,power:28,range:5.5});
add(2,'rear-yard','wall',2.95,THIRD.enclosure.back+.066,{y:2.23,primary:true,priority:9});
add(2,'laundry','ceiling',1.065,THIRD.laundry.machines[0].z,{y:2.508,radius:.13,kelvin:3500,primary:true});
add(2,'handwash-drying','wall',4.65,13.07,{y:.88,rotation:Math.PI,washUp:.12,primary:true,priority:5});
for(const [x,z] of [[.45,1.2],[.45,4.9],[4.75,1.2],[4.75,4.9]])add(2,'terrace-path','bollard',x,z,{y:.7,primary:(x<1&&z<2)||(x>4&&z>4),allPriority:10,power:22,range:4.8});
// Recessed step markers follow tread height instead of a flat row on the wall.
for(const floor of [0,1]){
 for(const i of [1,4,7,10]){
  const z=STAIR.z+STAIR.width+(i+.5)*STAIR.middleTread;
  add(floor,'stairs','step',entrySpan(z)[0]+.095,z,{y:(STAIR.firstRisers+i+1)*STAIR.rise+.16,rotation:Math.PI/2});
 }
 if(floor===0)add(floor,'stairs','step',fanStepMarker.x,fanStepMarker.z,fanStepMarker);
 else add(floor,'stairs','step',1.25,STAIR.z-.014,{y:.27,rotation:Math.PI});
 add(floor,'stairs','wall',entrySpan(6.65)[0]+.095,6.65,{y:1.8,rotation:Math.PI/2,primary:true});
}
export const REQUIRED_LIT_ZONES=[
 [0,'living'],[0,'dining'],[0,'kitchen'],[0,'rear-hall'],[0,'grandparents'],[0,'bath-grandparents'],[0,'washbasin'],[0,'porch'],[0,'stairs'],
 [1,'master'],[1,'master-pc'],[1,'master-wardrobe'],[1,'bath-master'],[1,'master-vanity'],[1,'common'],[1,'upper-hall'],[1,'small-bedroom'],[1,'small-wardrobe'],[1,'bath-small'],[1,'balcony'],[1,'small-balcony'],[1,'stairs'],
 [2,'prayer'],[2,'roof-hall'],[2,'front-terrace'],[2,'rear-yard'],[2,'laundry'],[2,'handwash-drying'],[2,'terrace-path'],
];

for(const l of LIGHTING_PLAN)if(['porch','balcony'].includes(l.zone)&&l.primary)l.allPriority=9;

for(const floor of[0,1])add(floor,'front-facade','wall',MASTER_SUITE.balcony.splitX-.12,.09,{y:2.52,rotation:Math.PI,primary:true,allPriority:14,priority:9,power:14,range:5.8});
