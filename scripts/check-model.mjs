import assert from 'node:assert/strict';
import fs from 'node:fs';
import {GROUND,toWorld,HUMAN,LIVING,STAIR,HEIGHT,SERVICE,stairUnderside,LIVING_MIRROR_AXIS,REAR_FURNITURE,UPPER,SECOND,buildingPlot,UPPER_LAYOUT,SMALL_SUITE,entrySpan,MASTER_SUITE,MASTER_BALCONY,THIRD,BEDROOM_AC} from '../src/design.js';
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
const cookingFace=entrySpan(d.z)[1]-.10-k.depth;
assert.ok(cookingFace-(d.x+d.length/2)>.9,'Right cooking aisle exceeds .9 m');
assert.ok((d.x-d.length/2)-1.195>.7,'Left storage aisle exceeds .7 m');
assert.ok(k.start>GROUND.exit.z+GROUND.exit.width/2+.25,'Kitchen starts behind relocated living-room exit');
assert.ok(r.splitX<2&&r.bedDoorX===r.entryX,'Bedroom door is in shared left side partition');assert.ok(r.bedDoorZ-.425>r.start&&r.bedDoorZ+.425<r.wcStart,'Both doors meet the shared vestibule');assert.ok(!GROUND.rightWindows.some(w=>w.z<5),'No window behind TV');assert.ok(f.width>.9&&f.height<1.9,'Side-by-side fridge envelope');assert.ok(GROUND.exit.z-GROUND.exit.width/2>GROUND.tv.z+1.2+.2,'Exit clears the rear end of the TV wall panel');
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
assert.ok(bedLeft-(S.bath.right+.05)>=.6-1e-9,'Compact WC-to-bed passage at least .6 m');
assert.ok(S.balcony.innerX-.05-(S.bed.x+(S.bed.width+.12)/2)>=.6-1e-9,'Bed-to-loggia partition passage at least .6 m');
assert.ok(bedFoot-(S.wardrobe.z+S.wardrobe.depth/2+.04)>=.9,'Wardrobe-to-bed passage at least .9 m');
assert.ok(S.desk.z+S.desk.width/2<bedFoot-.05,'Desk stays clear of bed frame');
assert.ok(S.bath.right-.05-S.bath.left>=1.45-1e-9,'Compact WC usable width at least 1.45 m');
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
assert.equal(M.balcony.splitX,UPPER_LAYOUT.masterBoundary[2][0],'Master balcony divider aligned with entrance wall');
assert.ok(balconyFraction>.37&&balconyFraction<.4,'Master balcony widened without taking over PC desk');
console.log('PASS: master WC/bed/PC chair/wardrobe clearances and reduced balcony.');

assert.equal(M.tv.z,M.bed.z,'TV centered on master bed axis');
assert.ok(M.commonWindow.z-M.commonWindow.width/2>UPPER_LAYOUT.masterBoundary.at(-1)[1]+.05,'Common window clears moved master partition');
assert.equal(M.commonWindow.z,(UPPER_LAYOUT.masterBoundary.at(-1)[1]+UPPER_LAYOUT.smallBoundary.at(-1)[1])/2,'Common window centered between bedroom partitions');
assert.ok(M.commonWindow.z+M.commonWindow.width/2<UPPER_LAYOUT.smallBoundary.at(-1)[1]-.05,'Common window clears small-room partition');
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
assert.ok(13.08-(L.machines[0].z+L.machineDepth/2)>1.6,'Machine doors face at least 1.6 m of open yard');
for(const m of L.machines){
 assert.ok(m.x-L.machineWidth/2>=L.x1&&m.x+L.machineWidth/2<=L.x2,'Machine width covered by canopy');
 assert.ok(m.z-L.machineDepth/2>=L.z1&&m.z+L.machineDepth/2<=L.z2,'Machine depth covered by canopy');
}
assert.ok(L.machines[1].x-L.machines[0].x>L.machineWidth+.05,'Washer and dryer do not overlap');
assert.ok(T3.handwash.x-T3.handwash.width/2>T3.drying.right+.08,'Hand-washing basin clears drying rack');
assert.ok(L.x2<T3.enclosure.rearDoor.left-.9,'Canopy and machines stay clear of rear exit');
console.log('PASS: third-floor stair access, worship room, terrace guard and covered laundry clearances.');

const E=T3.enclosure;
for(const [x,z] of UPPER.opening){
 assert.ok(z>E.front+.06&&z<E.back-.06,'All stair opening vertices stay inside the weather enclosure');
 assert.ok(x>=entrySpan(z)[0]+.05&&x<E.right-.06,'Stair opening clears exterior walls');
}
assert.ok(P.front===E.front&&P.right===E.right&&P.back<E.back,'Prayer room shares exterior front and side walls');
assert.ok(E.back-.06-(P.back+.06)>=1.2,'Covered rear hall at least 1.2 m deep');
assert.ok(E.frontDoor.left>=UPPER.hole.right+.1&&E.frontDoor.left+E.frontDoor.width<P.left-.06,'Front exit connects directly to covered side hall');
assert.ok(E.rearDoor.left>UPPER.landingX+STAIR.landing+.1,'Rear exit clears stair arrival cap');
assert.ok(E.roofSlope>=.01&&E.roofThickness>=.14,'Continuous roof allows slope without cutting stair headroom');
assert.ok(T3.handwash.x-T3.handwash.width/2>L.x2+.5,'Hand washing stays outside machine canopy');
assert.ok(T3.terrace.deck.left>=E.frontDoor.left+E.frontDoor.width,'Outdoor furniture stays beside main front circulation');
assert.ok(T3.terrace.deck.back<E.front-.9,'Seating deck clears front exit approach');
console.log('PASS: unified stair/prayer weather enclosure, covered hall, exits and rearranged outdoor zones.');

assert.ok(Math.abs(L.z1-(E.back-.08))<1e-9,'Short canopy meets penthouse rear wall');
assert.ok(L.z2-E.back<=1.1,'Canopy projects only over appliance bay');
assert.ok(L.machines.every(m=>m.rotation===Math.PI&&m.x<2),'Both machines sit on left and face yard');
assert.ok(T3.drying.left>L.x2+.2,'Drying rack remains completely uncovered');
assert.ok(L.machines[0].z-L.machineDepth/2>E.back+.06,'Machine backs clear penthouse wall');
console.log('PASS: short attached canopy, left-side machines and uncovered washing/drying zones.');

assert.equal(BEDROOM_AC.length,2);
for(const {id,indoor:I,outdoor:O} of BEDROOM_AC){
 assert.ok(I.y+I.height<HEIGHT-UPPER.slabThickness-.15,'Indoor unit has ceiling clearance');
 assert.ok(I.y>2.28+.2,'Indoor unit stays above doors and curtain rails');
 assert.ok(O.y>=2.4,'Condensers mounted high on right facade');
 assert.ok(Math.abs(I.x-(entrySpan(I.z)[1]-.195))<.001,'Indoor units mounted on right exterior wall');
 assert.ok(O.gap>=.15&&O.depth>=.3,'Outdoor rear clearance and realistic depth');
 assert.ok(O.y+O.height<HEIGHT-UPPER.slabThickness,'Outdoor body stays within second-storey elevation');
 if(id==='master'){
  assert.ok(I.x-I.width/2>MASTER_SUITE.bed.x+.5,'Master AC is offset toward foot side, away from headboard');
  assert.ok(O.z+O.width/2<MASTER_SUITE.ventilationWindow.z-MASTER_SUITE.ventilationWindow.width/2-.1,'Master condenser clears ventilation window horizontally');
 }else{
  assert.ok(I.z+I.width/2<SMALL_SUITE.bed.z+.1,'Small-room airflow stays near foot end');
  assert.ok(O.z+O.width/2<SMALL_SUITE.window.z-SMALL_SUITE.window.width/2-.15,'Small-room condenser clears side window');
 }
}
console.log('PASS: bedroom AC ceiling clearance, headboard offset and right-facade window clearance.');

assert.ok(layout.deck.z1>=6.8+.09&&layout.deck.z1<=7,'Expanded timber deck follows master partition while clearing it');

assert.ok(GROUND.parking.every(b=>b.angle===Math.PI/4&&b.length===1.844&&b.width===.714&&b.height===1.132),'Three parallel diagonal Honda LEAD envelopes at manufacturer dimensions');
assert.ok(GROUND.securityHeight>=2.2,'Porch gate raised to 2.2 m above yard');

// Lighting coverage and placement are checked against the room/slab plan.
const {LIGHTING_PLAN,REQUIRED_LIT_ZONES}=await import('../src/lighting-plan.js');
for(const [floor,zone] of REQUIRED_LIT_ZONES)assert.ok(LIGHTING_PLAN.some(l=>l.floor===floor&&l.zone===zone),`Missing lighting in ${floor}:${zone}`);
for(const light of LIGHTING_PLAN){
 assert.ok(light.y>0&&light.y<HEIGHT-UPPER.slabThickness,`Fixture height inside storey: ${light.zone}`);
 if(light.kind==='ceiling'){
  const [left,right]=entrySpan(light.z);assert.ok(light.x>left+.08&&light.x<right-.08,'Ceiling lamp inside facade');
  const inOpening=([x,z])=>{let inside=false;for(let i=0,j=UPPER.opening.length-1;i<UPPER.opening.length;j=i++){const a=UPPER.opening[i],b=UPPER.opening[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside}return inside};
  if(light.floor<2)assert.ok(!inOpening([light.x,light.z]),'No floating ceiling fixtures in upper slab opening');
  if(light.floor===2&&light.zone!=='laundry')assert.ok(light.z>THIRD.enclosure.front&&light.z<THIRD.enclosure.back,'Roof ceiling fixture under enclosed roof');
 }
}
for(const floor of [0,1])assert.ok(LIGHTING_PLAN.filter(l=>l.floor===floor&&l.kind==='step').length>=5,'Step lights cover both stair flights');
console.log(`PASS: ${LIGHTING_PLAN.length} fixtures, all rooms and outdoor zones covered, ceiling supports and stair markers.`);

const B=S.balcony;
assert.ok(Math.min(entrySpan(B.front)[1],entrySpan(B.back)[1])-.06-(B.innerX+.05)>=.65,'Inset planted balcony has at least .65 m usable depth');
assert.ok(B.back-B.front>=1.8-1e-9,'Inset planted balcony has 1.8 m length');
assert.ok(B.doorStart>B.front&&B.doorStart+B.doorWidth<B.back,'Loggia sliding door clears side returns');
assert.ok(S.window.z+S.window.width/2<B.front-.15,'Smaller desk window remains separate from balcony');
for(const l of LIGHTING_PLAN.filter(l=>l.zone==='exterior'))assert.equal(l.y,2.1,'Exterior sconces share one consistent height');
const ext0=LIGHTING_PLAN.filter(l=>l.floor===0&&l.zone==='exterior').map(l=>l.z),ext1=LIGHTING_PLAN.filter(l=>l.floor===1&&l.zone==='exterior').map(l=>l.z);
assert.deepEqual(ext0,ext1,'External sconces align vertically across floors');
assert.ok(LIGHTING_PLAN.filter(l=>l.floor===2&&l.zone==='terrace-path'&&l.primary).length>=2,'Terrace has two separated direct path-light sources');
console.log('PASS: widened aligned master balcony, compact WC/bed and inset planted loggia, aligned exterior sconces and terrace lights.');

// Dimensions must agree with either polygon winding and preserve concave angles.
const {polygonDimensions,measuredRooms,upperRooms,roofRooms}=await import('../src/room-plan.js');
for(const rooms of [measuredRooms,upperRooms,roofRooms])for(const room of rooms)for(const ring of [room.points,...(room.holes||[])]){
 for(const points of [ring,[...ring].reverse()]){const dims=polygonDimensions(points);
 assert.equal(dims.length,points.length);
 assert.ok(dims.every(d=>Number.isFinite(d.angle)&&d.angle>0&&d.angle<360&&d.length>0));
 assert.ok(Math.abs(dims.reduce((sum,d)=>sum+d.angle,0)-(points.length-2)*180)<1e-6,'Interior angles sum');
 }
}
const rectangle=polygonDimensions([[0,0],[3,0],[3,4],[0,4]]);
assert.deepEqual(rectangle.map(d=>d.length),[3,4,3,4]);
assert.ok(rectangle.every(d=>d.angle===90));
assert.ok(polygonDimensions([[0,0],[3,0],[3,1],[1,1],[1,3],[0,3]]).some(d=>d.angle===270));
console.log('PASS: every room edge, clockwise/counterclockwise angles, rectangles and reflex corners.');

assert.ok(Math.abs((SERVICE.rear.start-.05)-REAR_FURNITURE.cabinetEnd)<1e-9,'Kitchen-facing bedroom wall aligns with fridge end panel');
assert.ok(GROUND.exit.z+GROUND.exit.width/2<SERVICE.rear.start-.05,'Exit frame clears bedroom wall');
assert.ok(REAR_FURNITURE.beds[0].z-.54>SERVICE.rear.start+.05+.35,'First bed clears moved front wall');
console.log('PASS: aligned grandparents partition, side exit and bed clearance.');

assert.ok(Math.abs(k.end-(r.start-.05-.01))<1e-9,'L return meets bedroom wall with 10 mm joint');
assert.ok(k.returnLeft>r.entryX+.3,'L return clears vestibule');
assert.ok(k.end-k.returnDepth-(d.z+.935)>.8,'Return work aisle clears occupied dining chairs');
assert.ok(k.water.x-.18-1.195>.85,'Water station leaves passage opposite fridge');
assert.ok(k.water.x+.18<k.returnLeft-.02,'Water station does not overlap return cabinets');
assert.ok(k.water.z+.16<r.start-.05,'Water station stays outside bedroom wall');
assert.ok(k.hobZ-.3>k.start&&k.hobZ+.3<k.end-k.returnDepth,'Hob clear of counter edges and corner');
assert.ok(k.sinkX-.32>k.returnLeft&&k.sinkX+.32<entrySpan(k.sinkZ)[1]-.1-k.depth,'Sink fits the return');
console.log('PASS: rear L kitchen, relocated exit, cooking/dining aisles and water station.');
