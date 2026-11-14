import assert from 'node:assert/strict';
import fs from 'node:fs';
import {GROUND,toWorld,HUMAN,LIVING,STAIR,HEIGHT,SERVICE,stairUnderside,LIVING_MIRROR_AXIS,REAR_FURNITURE,UPPER,SECOND,buildingPlot,UPPER_LAYOUT,SMALL_SUITE,entrySpan,MASTER_SUITE,MASTER_BALCONY,THIRD} from '../src/design.js';
const geometry=JSON.parse(fs.readFileSync(new URL('../plans/plot-geometry.json',import.meta.url)));
const v=geometry.vertices;
assert.equal(v.length,7);
for(let i=0;i<v.length;i++){const a=v[i],b=v[(i+1)%v.length];assert.ok(Math.abs(Math.hypot(a.x_m-b.x_m,a.y_m-b.y_m)-a.source_label_m)<1e-6)}
assert.ok(Math.abs(v.reduce((s,v)=>s+v.angle_deg,0)-900)<1e-5);
assert.ok(v.some(v=>v.angle_deg>180),'Concave corner must be preserved');
assert.equal(HUMAN.height,1.7);
assert.equal(GROUND.sofa.length,2.3);
assert.ok(LIVING.coffee.x+LIVING.coffee.width/2<GROUND.sofa.x-.6,'Coffee table leaves room before sofa');
const source=fs.readFileSync(new URL('../src/house.js',import.meta.url),'utf8');
assert.equal(STAIR.type,'L');assert.equal(STAIR.firstRisers,4);assert.equal(STAIR.firstRisers+STAIR.secondRisers,STAIR.risers);assert.ok(Math.abs(STAIR.risers*STAIR.rise-HEIGHT)<1e-9);assert.ok(STAIR.z>GROUND.tv.z+1.45+.4,'Stair starts behind TV');
assert.ok(!source.includes('underStairWC('),'No under-stair WC in current iteration');
assert.ok(source.includes('index<1'),'Ground-floor furnishings are not duplicated across storeys');
assert.ok(toWorld([LIVING_MIRROR_AXIS-GROUND.sofa.x,0])[0]>toWorld([LIVING_MIRROR_AXIS-GROUND.tv.x,0])[0],'Sofa left and TV right from yard');
const contains=([x,z])=>{let inside=false;for(let i=0,j=v.length-1;i<v.length;j=i++){const a=v[i],b=v[j];if(((a.y_m>z)!=(b.y_m>z))&&x<(b.x_m-a.x_m)*(z-a.y_m)/(b.y_m-a.y_m)+a.x_m)inside=!inside}return inside};
const parkingCorners=bike=>{const c=Math.cos(bike.angle),s=Math.sin(bike.angle);return [-1,1].flatMap(i=>[-1,1].map(j=>[bike.x+i*bike.width/2*c+j*bike.length/2*s,bike.z-i*bike.width/2*s+j*bike.length/2*c]))};
for(const bike of GROUND.parking){for(const point of parkingCorners(bike)){assert.ok(contains(toWorld(point)),'Rotated Lead envelope must fit parcel');assert.ok(point[1]<GROUND.glassLine-GROUND.stepTread-.04,'Keep clear of glass')}}
for(let i=0;i<GROUND.parking.length;i++)for(let j=i+1;j<GROUND.parking.length;j++){const a=GROUND.parking[i],b=GROUND.parking[j],dx=b.x-a.x,dz=b.z-a.z;assert.ok(Math.abs(dx*Math.cos(a.angle)-dz*Math.sin(a.angle))>a.width+.025||Math.abs(dx*Math.sin(a.angle)+dz*Math.cos(a.angle))>a.length+.025,'Parked bikes must not overlap')}
assert.equal(GROUND.glassLine,2.3);assert.equal(-GROUND.porchLevel,2*GROUND.stepRise);
const {kitchen:k,fridge:f,dining:d,rear:r}=SERVICE;
assert.ok(stairUnderside(7.15)>.9+.1,'Under-stair pantry clears slab');
assert.ok(stairUnderside(f.z-f.width/2)>f.height+.2,'Fridge clears stair slab');
const cookingFace=k.mirrorAxis-k.x-k.depth/2-.035;
assert.ok(cookingFace-(d.x+d.length/2)>.9,'Right cooking aisle exceeds .9 m');
assert.ok((d.x-d.length/2)-1.195>.7,'Left storage aisle exceeds .7 m');
assert.ok(k.end<GROUND.exit.z-GROUND.exit.width/2-.2,'Kitchen ends before side exit');
assert.ok(r.splitX<2&&r.bedDoorX===r.entryX,'Bedroom door is in shared left side partition');assert.ok(r.bedDoorZ-.425>r.start&&r.bedDoorZ+.425<r.wcStart,'Both doors meet the shared vestibule');assert.ok(!GROUND.rightWindows.some(w=>w.z<5),'No window behind TV');assert.ok(f.width>.9&&f.height<1.9,'Side-by-side fridge envelope');assert.ok(r.start-(GROUND.exit.z+GROUND.exit.width/2)<.15,'Exit near bedroom partition');
assert.ok(f.z+f.width/2<r.start-.1,'Fridge stays outside rear partition');
assert.ok(d.z+d.length/2<r.start-.9,'Access before rear room doors');
const [bed1,bed2]=REAR_FURNITURE.beds,w=REAR_FURNITURE.wardrobe;
assert.ok(r.entryX-r.splitX>=.29,'Entry recess widens shared vestibule');
assert.equal(bed1.rotation,-Math.PI/2);assert.equal(bed2.rotation,-Math.PI/2);
assert.ok(bed2.z-bed1.z-1.08>.55,'Space between transverse bed frames exceeds .55 m');
assert.ok(bed1.x-1.04-r.entryX-.05>.9,'Foot-end passage exceeds .9 m');
assert.equal(w.rotation,-Math.PI/2,'Wardrobe faces into room from shared WC wall');
assert.ok(w.x-w.depth/2>=r.splitX+.05,'Wardrobe back meets shared wall without overlap');
assert.ok((bed1.x-1.01)-(w.x+w.depth/2+.04)>.6,'Clear foot passage beside wardrobe');
assert.ok(w.z-w.width/2>r.bedDoorZ+.425,'Wardrobe stays beyond doorway');
assert.ok(REAR_FURNITURE.cabinetEnd<10.15,'Highest post-fridge cabinet removed');
for(const model of['modern-sofa']){const b=fs.readFileSync(new URL(`../public/models/${model}.glb`,import.meta.url));assert.equal(b.subarray(0,4).toString(),'glTF');assert.equal(b.readUInt32LE(4),2);assert.equal(b.readUInt32LE(8),b.length);const len=b.readUInt32LE(12);const json=JSON.parse(b.subarray(20,20+len).toString());assert.ok(json.meshes.length>0);assert.ok(json.images.every(i=>!i.uri),'All model textures must be local and embedded');console.log(`${model}: valid self-contained GLB, ${(b.length/1024/1024).toFixed(2)} MiB`)}
console.log('PASS: 7 boundary lengths, concave corner, angle sum, living-room dimensions, orientation, L-stair rise and TV clearance and embedded model assets.');

assert.equal(UPPER.landingStart,STAIR.z+STAIR.width+(STAIR.middleRisers-1)*STAIR.tread);assert.ok(UPPER.hole.right-UPPER.hole.left>=STAIR.width);assert.ok(HEIGHT-UPPER.slabThickness-(STAIR.firstRisers+2)*STAIR.rise>=2.1,'Head clearance before upper opening');assert.ok(UPPER.hole.end-UPPER.landingStart>=STAIR.width-.001,'Upper landing depth at least flight width');

const layout=UPPER_LAYOUT;
assert.ok(layout.masterBoundary[0][1]+.05<STAIR.z,'Front partition clears initial stair treads');
assert.ok(layout.masterBoundary[2][0]-.05-(UPPER.hole.right+.1)>=.9,'Hall remains at least .9 m beside master extension');
assert.ok(layout.smallBoundary[0][1]-.05>UPPER.hole.end,'Rear room wall clears turning landing');
assert.ok(layout.deck.x1-(UPPER.hole.right+.1)>=.9,'Raised deck leaves a level circulation route beside stair');
assert.ok(Math.hypot(...layout.masterBoundary[3].map((n,i)=>n-layout.masterBoundary[2][i]))>=.9,'Master doorway at least .9 m');
assert.ok(Math.hypot(...layout.smallBoundary[2].map((n,i)=>n-layout.smallBoundary[1][i]))>=.9,'Rear doorway at least .9 m');
console.log('PASS: upper landing/headroom, sketch room entrances and clear circulation beside deck.');

assert.equal(STAIR.firstRisers+STAIR.middleRisers+STAIR.lastRisers,20);assert.ok(UPPER.landingX+STAIR.landing<3.1,'Right exit stays compact');

const S=SMALL_SUITE,bedLeft=S.bed.x-(S.bed.width+.12)/2,bedFoot=S.bed.z-1.06;
assert.ok(bedLeft-(S.bath.right+.05)>=.8,'WC-to-bed passage at least .8 m');
assert.ok(entrySpan(S.bed.z)[1]-(S.bed.x+(S.bed.width+.12)/2)>=.7,'Window-side bed passage at least .7 m');
assert.ok(bedFoot-(S.wardrobe.z+S.wardrobe.depth/2+.04)>=.9,'Wardrobe-to-bed passage at least .9 m');
assert.ok(S.desk.z+S.desk.width/2<bedFoot-.05,'Desk stays clear of bed frame');
assert.ok(S.bath.right-.05-S.bath.left>=1.7,'WC usable width at least 1.7 m');
assert.ok(S.bath.doorStart>S.bath.front&&S.bath.doorStart+S.bath.doorWidth<12.11,'WC door clear of shower');
console.log('PASS: furnished small suite bed/wardrobe/desk clearances and WC entrance.');

const M=MASTER_SUITE;
assert.ok(M.bath.front-.05-(M.bed.z+(M.bed.width+.22)/2)>.08,'Master headboard clears WC partition');
assert.ok(M.bed.z-(M.bed.width+.12)/2-(M.pc.chairZ+.235)>=.6-1e-9,'Tucked PC chair leaves .6 m beside bed');
assert.ok(M.tv.x-M.tv.depth/2-(M.bed.x+1.13)>=.9,'Master bed foot aisle exceeds .9 m');
assert.ok(M.endWardrobe.z-M.endWardrobe.depth/2-(M.wardrobe.z+M.wardrobe.width/2)>.04,'L-shaped cabinets meet without overlap');
assert.ok(M.bath.doorStart>M.bath.front&&M.bath.doorStart+M.bath.doorWidth<M.bath.back,'WC master door fits wardrobe-facing partition');
assert.ok(MASTER_BALCONY.every(p=>p[0]>=M.balcony.splitX-1e-9&&p[1]<=M.balcony.depth+1e-9),'Balcony only occupies right third');
const balconyFraction=(entrySpan(M.balcony.depth)[1]-M.balcony.splitX)/(entrySpan(M.balcony.depth)[1]-entrySpan(M.balcony.depth)[0]);
assert.ok(balconyFraction>.3&&balconyFraction<.35,'Balcony width close to one third');
console.log('PASS: master WC/bed/PC chair/wardrobe clearances and reduced balcony.');

assert.equal(M.tv.z,M.bed.z,'TV centered on master bed axis');
assert.ok(M.commonWindow.z-M.commonWindow.width/2>UPPER_LAYOUT.masterBoundary.at(-1)[1]+.05,'Common window clears moved master partition');
assert.ok(M.commonWindow.z+M.commonWindow.width/2<8.18,'Common window fits right facade before corner');
assert.ok(M.ventilationWindow.z+M.ventilationWindow.width/2<M.wardrobe.z-M.wardrobe.width/2,'Master ventilation window clears wardrobe');
assert.ok(M.endWardrobe.z+M.endWardrobe.depth/2<UPPER_LAYOUT.masterBoundary.at(-1)[1]-.04,'Back wardrobe fits moved wall');
console.log('PASS: wider common area, aligned TV and two new right-side windows.');

assert.equal(M.bath.doorAxis,'right');
assert.ok(M.shower.right-M.shower.left>=.9,'Shower at least .9 m wide');
assert.ok(4.46-M.shower.front>=.7,'Shower entry at least .7 m');
for(const z of M.nightstands.zs){
 assert.ok(z+M.nightstands.width/2+.008<M.bath.front-.05,'Bedside cabinet clears WC wall');
 assert.ok(Math.abs(z-M.bed.z)>(M.bed.width+.12)/2+M.nightstands.width/2,'Bedside cabinet clears bed frame');
}
assert.equal(UPPER_LAYOUT.masterBoundary[2][0],UPPER_LAYOUT.masterBoundary[3][0],'Master entrance remains on side wall');
console.log('PASS: shower layout, wardrobe-facing WC entrance and two bedside cabinets.');

const T3=THIRD,P=T3.prayer,L=T3.laundry;
assert.ok(P.left-.06-(UPPER.hole.right+.1)>=.9,'Prayer side passage at least .9 m');
assert.ok(P.back+.06<UPPER.landingStart-.05,'Prayer room clears stair arrival branch');
assert.ok(P.sideDoorStart>P.front&&P.sideDoorStart+P.sideDoorWidth<P.back,'Prayer entrance fits side partition');
assert.ok(P.altarZ-.3>P.front+.9&&P.altarZ+.3<P.back-.06,'Altar faces front with clear kneeling space');
assert.ok(T3.terrace.parapet+T3.terrace.rail>=1.1,'Front terrace guard at least 1.1 m');
assert.ok(L.machines[0].x-L.machineDepth/2-L.x1>=.9,'Laundry door aisle at least .9 m');
for(const m of L.machines){
 assert.ok(m.x-L.machineDepth/2>=L.x1&&m.x+L.machineDepth/2<=L.x2,'Machine depth covered by canopy');
 assert.ok(m.z-L.machineWidth/2>=L.z1&&m.z+L.machineWidth/2<=L.z2,'Machine width covered by canopy');
}
assert.ok(L.machines[1].z-L.machines[0].z>L.machineWidth+.05,'Washer and dryer do not overlap');
assert.ok(T3.handwash.x-T3.handwash.width/2>T3.drying.right+.08,'Hand-washing basin clears drying rack');
assert.ok(L.x1-T3.drying.right>1.2,'Central rear-yard circulation stays open');
console.log('PASS: third-floor stair access, worship room, terrace guard and covered laundry clearances.');
