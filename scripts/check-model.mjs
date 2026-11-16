import {WINDER,fanPoint,fanAngle,fanStepPolygon,fanEntryDirection,fanWalkGoing,fanFacingTarget,fanStepMarker} from '../src/stair-entry.js';
import {ORIENTATION_REFERENCE,ORIENTATION_TARGETS,normalizeBearing,vectorBearing,bearingVector,bedHeadVector,directionName,targetWorldPosition} from '../src/orientation.js';
import {shellSides,shellOutline,railHeightAt} from '../src/building-joints.js';
import {STRUCTURE,columnPlan} from '../src/structure-plan.js';
import {SITE,gateRampCorners,streetPolygon} from '../src/site-plan.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {plot,GROUND,toWorld,HUMAN,LIVING,STAIR,HEIGHT,SERVICE,stairUnderside,LIVING_MIRROR_AXIS,REAR_FURNITURE,UPPER,SECOND,buildingPlot,UPPER_LAYOUT,SMALL_SUITE,entrySpan,MASTER_SUITE,MASTER_BALCONY,THIRD,BEDROOM_AC} from '../src/design.js';
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
assert.equal(STAIR.type,'L');assert.equal(STAIR.firstRisers,5);assert.equal(STAIR.firstRisers+STAIR.secondRisers,STAIR.risers);assert.ok(Math.abs(STAIR.risers*STAIR.rise-HEIGHT)<1e-9);assert.ok(STAIR.z>GROUND.tv.z+GROUND.tv.panelLength/2+.4,'Stair clears rear of resized TV panel by at least 400 mm');
assert.ok(!source.includes('underStairWC('),'No under-stair WC in current iteration');
assert.ok(source.includes('index<1'),'Ground-floor furnishings are not duplicated across storeys');
assert.ok(toWorld([GROUND.sofa.x,0])[0]<toWorld([GROUND.tv.x,0])[0],'Sofa right and TV left from yard');
const contains=([x,z])=>{let inside=false;for(let i=0,j=v.length-1;i<v.length;j=i++){const a=v[i],b=v[j];if(((a.y_m>z)!=(b.y_m>z))&&x<(b.x_m-a.x_m)*(z-a.y_m)/(b.y_m-a.y_m)+a.x_m)inside=!inside}return inside};
const parkingCorners=bike=>{const c=Math.cos(bike.angle),s=Math.sin(bike.angle);return [-1,1].flatMap(i=>[-1,1].map(j=>[bike.x+i*bike.width/2*c+j*bike.length/2*s,bike.z-i*bike.width/2*s+j*bike.length/2*c]))};
for(const bike of GROUND.parking){for(const point of parkingCorners(bike)){assert.ok(contains(toWorld(point)),'Rotated Lead envelope must fit parcel');assert.ok(point[1]<GROUND.glassLine-GROUND.stepTread-.04,'Keep clear of glass')}}
for(let i=0;i<GROUND.parking.length;i++)for(let j=i+1;j<GROUND.parking.length;j++){const a=GROUND.parking[i],b=GROUND.parking[j],dx=b.x-a.x,dz=b.z-a.z;assert.ok(Math.abs(dx*Math.cos(a.angle)-dz*Math.sin(a.angle))>a.width+.025||Math.abs(dx*Math.sin(a.angle)+dz*Math.cos(a.angle))>a.length+.025,'Parked bikes must not overlap')}
assert.equal(GROUND.glassLine,2.3);assert.equal(-GROUND.porchLevel,2*GROUND.stepRise);
const {kitchen:k,fridge:f,dining:d,rear:r}=SERVICE;
assert.ok(stairUnderside(7.15)>.9+.1,'Under-stair pantry clears slab');
assert.ok(stairUnderside(f.z-f.width/2)>f.height+.10,'Fridge clears stair slab');
const cookingFace=entrySpan(d.z)[1]-.10-k.depth;
assert.ok(cookingFace-(d.x+d.length/2)>.8,'Corner trial cooking aisle exceeds .8 m');
assert.ok((d.x-d.length/2)-1.195>.7,'Left storage aisle exceeds .7 m');
assert.ok(k.start>GROUND.exit.z+GROUND.exit.width/2+.25,'Kitchen starts behind relocated living-room exit');
assert.ok(r.splitX<2&&r.bedDoorX===r.entryX,'Bedroom door is in shared left side partition');assert.ok(r.bedDoorZ-.425>r.start&&r.bedDoorZ+.425<r.wcStart,'Both doors meet the shared vestibule');assert.ok(!GROUND.rightWindows.some(w=>w.z<5),'No window behind TV');assert.ok(f.width>.9&&f.height<1.9,'Side-by-side fridge envelope');assert.ok(GROUND.exit.z-GROUND.exit.width/2>GROUND.tv.z+GROUND.tv.panelLength/2+.2,'Exit clears the rear end of the TV wall panel');
assert.ok(f.x+f.depth/2<r.entryX-.7,'Fridge remains beside, not inside, the expanded bedroom');
assert.ok(f.z+f.width/2<r.bedDoorZ-.425-.2,'Fridge clears approach to bedroom doorway');
assert.ok(d.z+d.length/2<r.start-.9,'Access before rear room doors');
const [bed1,bed2]=REAR_FURNITURE.beds,w=REAR_FURNITURE.wardrobe;
assert.ok(r.entryX-r.splitX>=.29,'Entry recess widens shared vestibule');
assert.equal(bed1.rotation,-Math.PI/2);assert.equal(bed2.rotation,-Math.PI/2);
assert.ok(bed2.z-bed1.z-((bed1.width+.08)+(bed2.width+.08))/2>=.7,'Space between 1.4 m transverse bed frames is at least .7 m');
assert.ok(bed1.x-1.04-r.entryX-.05>.9,'Foot-end passage exceeds .9 m');
assert.equal(w.rotation,-Math.PI/2,'Wardrobe faces into room from shared WC wall');
assert.ok(w.x-w.depth/2>=r.splitX+.05,'Wardrobe back meets shared wall without overlap');
assert.ok((bed1.x-1.01)-(w.x+w.depth/2+.04)>.6,'Clear foot passage beside wardrobe');
assert.ok(w.z-w.width/2>r.bedDoorZ+.425,'Wardrobe stays beyond doorway');
assert.ok(REAR_FURNITURE.cabinetEnd<10.15,'Highest post-fridge cabinet removed');
for(const model of['modern-sofa']){const b=fs.readFileSync(new URL(`../public/models/${model}.glb`,import.meta.url));assert.equal(b.subarray(0,4).toString(),'glTF');assert.equal(b.readUInt32LE(4),2);assert.equal(b.readUInt32LE(8),b.length);const len=b.readUInt32LE(12);const json=JSON.parse(b.subarray(20,20+len).toString());assert.ok(json.meshes.length>0);assert.ok(json.images.every(i=>!i.uri),'All model textures must be local and embedded');console.log(`${model}: valid self-contained GLB, ${(b.length/1024/1024).toFixed(2)} MiB`)}
console.log('PASS: 7 boundary lengths, concave corner, angle sum, living-room dimensions, orientation, L-stair rise and TV clearance and embedded model assets.');

assert.equal(UPPER.landingStart,STAIR.z+STAIR.width+(STAIR.middleRisers-1)*STAIR.middleTread);assert.ok(UPPER.hole.right-UPPER.hole.left>=STAIR.width);assert.ok(HEIGHT-UPPER.slabThickness-(STAIR.firstRisers+2)*STAIR.rise>=2.1,'Head clearance before upper opening');assert.ok(UPPER.hole.end-UPPER.landingStart>=STAIR.width-.001,'Upper landing depth at least flight width');

const layout=UPPER_LAYOUT;
assert.ok(layout.masterBoundary[0][1]+.05<STAIR.z,'Front partition clears initial stair treads');
assert.ok(layout.masterBoundary[2][0]-.05-(UPPER.hole.right+.1)>=.9,'Hall remains at least .9 m beside master extension');
assert.ok(layout.smallBoundary[0][1]-.05>UPPER.hole.end,'Rear room wall clears turning landing');
assert.ok(layout.deck.x1-(UPPER.hole.right+.1)>=.9,'Raised deck leaves a level circulation route beside stair');
assert.ok(Math.hypot(...layout.masterBoundary[3].map((n,i)=>n-layout.masterBoundary[2][i]))>=.9,'Master doorway at least .9 m');
assert.ok(Math.hypot(...layout.smallBoundary[2].map((n,i)=>n-layout.smallBoundary[1][i]))>=.9,'Rear doorway at least .9 m');
console.log('PASS: upper landing/headroom, sketch room entrances and clear circulation beside deck.');

assert.equal(STAIR.firstRisers+STAIR.middleRisers+STAIR.lastRisers,21);assert.ok(UPPER.landingX+STAIR.landing<layout.smallBoundary[2][0]-.1,'Right exit stays compact');

const S=SMALL_SUITE,bedLeft=S.bed.x-(S.bed.width+.12)/2,bedFoot=S.bed.z-1.06;
assert.ok(bedLeft-(S.bath.right+.05)>=.6-1e-9,'Compact WC-to-bed passage at least .6 m');
assert.ok(S.balcony.innerX-.05-(S.bed.x+(S.bed.width+.12)/2)>=.6-1e-9,'Bed-to-loggia partition passage at least .6 m');
assert.ok(bedFoot-(S.wardrobe.z+S.wardrobe.depth/2+.04)>=.9,'Wardrobe-to-bed passage at least .9 m');
assert.ok(S.desk.z+S.desk.width/2<bedFoot-.05,'Desk stays clear of bed frame');
assert.ok(S.bath.right-.05-S.bath.left>=1.45-1e-9,'Compact WC usable width at least 1.45 m');
assert.ok(S.bath.doorStart>S.bath.front&&S.bath.doorStart+S.bath.doorWidth<12.11,'WC door clear of shower');
assert.ok(S.vanity.x-S.vanity.width/2>S.bath.left+.05,'Small WC vanity fits against front wall');
assert.ok(S.bath.right-.05-(S.vanity.x+S.vanity.width/2)>=.7,'Small WC vanity leaves 700 mm clear approach beside doorway');
console.log('PASS: furnished small suite bed/wardrobe/desk clearances, WC entrance and vanity approach.');

const M=MASTER_SUITE;
assert.ok(M.bath.front-.05-(M.bed.z+(M.bed.width+.22)/2)>.08,'Master headboard clears WC partition');
assert.ok(M.bed.z-(M.bed.width+.12)/2-(M.pc.chairZ+.235)>=.6-1e-9,'Tucked PC chair leaves .6 m beside bed');
assert.ok(M.tv.x-M.tv.depth/2-(M.bed.x+1.13)>=.9,'Master bed foot aisle exceeds .9 m');
assert.ok(M.bath.doorStart>M.bath.front&&M.bath.doorStart+M.bath.doorWidth<M.bath.back,'WC master door fits wardrobe-facing partition');
assert.ok(MASTER_BALCONY.every(p=>p[0]>=M.balcony.splitX-1e-9&&p[1]<=M.balcony.depth+1e-9),'Balcony remains inside its enlarged front footprint');
const balconyFraction=(entrySpan(M.balcony.depth)[1]-M.balcony.splitX)/(entrySpan(M.balcony.depth)[1]-entrySpan(M.balcony.depth)[0]);
assert.ok(M.balcony.splitX-.06-(M.pc.x+M.pc.width/2)>=.25,'Widened balcony partition retains at least 250 mm beside PC desk');
assert.ok(balconyFraction>.46&&balconyFraction<.50,'Master balcony widened without taking over PC desk');
console.log('PASS: master WC/bed/PC chair/wardrobe clearances and reduced balcony.');

assert.equal(M.tv.z,M.bed.z,'TV centered on master bed axis');
assert.ok(M.commonWindow.z-M.commonWindow.width/2>UPPER_LAYOUT.masterBoundary.at(-1)[1]+.05,'Common window clears moved master partition');
assert.ok(M.commonWindow.z+M.commonWindow.width/2<plot[4][1]-.05,'Common window stays on one straight wall before the facade corner');
assert.ok(M.commonWindow.z+M.commonWindow.width/2<UPPER_LAYOUT.smallBoundary.at(-1)[1]-.05,'Common window clears small-room partition');
assert.ok(M.ventilationWindow.z+M.ventilationWindow.width/2<M.wardrobe.z-M.wardrobe.width/2,'Master ventilation window clears wardrobe');
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
assert.ok(entrySpan(P.back)[1]-.09-(P.screen.x+.06)>=.95,'Prayer right-side passage at least .95 m');
assert.ok(P.back+.06<UPPER.landingStart-.05,'Prayer back wall stays in front of final stair treads');
assert.ok(P.sideDoorStart>P.front&&P.sideDoorStart+P.sideDoorWidth<P.back,'Prayer entrance fits side partition');
assert.ok(P.altarZ-P.ancestor.depth/2>P.front+.9&&P.altarZ+P.ancestor.depth/2<P.back-.06,'Altar faces front with clear kneeling space');
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
assert.ok(E.back-.06-(P.back+.06)>=1.2-1e-8,'Covered rear hall at least 1.2 m deep');
assert.ok(E.frontDoor.left>entrySpan(E.front)[0]+.2&&E.frontDoor.left+E.frontDoor.width<entrySpan(E.front)[1]-.2,'Large front opening leaves both corner piers intact');
assert.ok(E.frontDoor.left<UPPER.hole.right&&E.frontDoor.left+E.frontDoor.width>P.left+.9,'Wide opening serves hall and open worship area');
assert.ok(E.rearDoor.left>UPPER.landingX+STAIR.landing+.1,'Rear exit clears stair arrival cap');
assert.ok(E.roofSlope>=.01&&E.roofThickness>=.14,'Continuous roof allows slope without cutting stair headroom');
assert.ok(T3.handwash.x-T3.handwash.width/2>L.x2+.5,'Hand washing stays outside machine canopy');
assert.ok(E.frontDoor.width>=4&&E.frontDoor.height>=2.4,'Large folding doorway opens worship area to terrace');
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

assert.ok(REAR_FURNITURE.cabinetEnd<SERVICE.rear.bedDoorZ-.425-.2,'Retained under-stair fridge panel clears bedroom doorway');
assert.ok(GROUND.exit.z+GROUND.exit.width/2<SERVICE.rear.start-.05,'Exit frame clears bedroom wall');
for(const bed of REAR_FURNITURE.beds){assert.equal(bed.width,1.4);assert.equal(bed.length,2);assert.ok(bed.z-(bed.width+.08)/2>SERVICE.rear.start+.05,'First bed frame clears moved front wall');assert.ok(bed.z+(bed.width+.08)/2<SERVICE.rear.end,'Last bed frame clears rear wall');}
assert.ok(SERVICE.rear.splitX-.05-entrySpan(SERVICE.rear.end)[0]>=1.4,'WC retains at least 1.4 m clear width');
console.log('PASS: aligned grandparents partition, side exit and bed clearance.');

assert.ok(Math.abs(k.end-(r.start-.05-.01))<1e-9,'L return meets bedroom wall with 10 mm joint');
assert.ok(k.returnLeft>r.entryX+.3,'L return clears vestibule');
assert.ok(k.end-k.returnDepth-(d.z+.66+.215)>.65,'Corner trial retains over 650 mm behind seated rear dining chairs');
assert.ok(k.water.x-.18-1.195>.85,'Water station leaves passage opposite fridge');
assert.ok(k.water.x+.18<k.returnLeft-.02,'Water station does not overlap return cabinets');
assert.ok(k.water.z+.16<r.start-.05,'Water station stays outside bedroom wall');
assert.ok(k.hobZ-.3>k.start&&k.hobZ+.3<k.end-k.returnDepth,'Hob clear of counter edges and corner');
assert.ok(k.sinkX-.32>k.returnLeft&&k.sinkX+.32<entrySpan(k.sinkZ)[1]-.1-k.depth,'Sink fits the return');
console.log('PASS: rear L kitchen, relocated exit, cooking/dining aisles and water station.');

const V=M.washbasin,N=V.niche;
assert.ok(V.outside&&V.x-V.length/2>M.bath.right+.05,'Master vanity lies outside wet room');
assert.ok(V.z-V.depth/2-N.front>=1,'Dry vanity standing depth at least 1 m');
assert.ok(V.x+V.length/2<N.right&&V.x-V.length/2>N.left,'1100 mm vanity fits niche');
assert.ok(M.wardrobe.x-M.wardrobe.depth/2-N.right>=1,'Main aisle beside dry niche at least 1 m');
assert.ok(M.bath.back-M.bath.doorStart-M.bath.doorWidth>=M.bath.doorWidth+.015,'WC sliding leaf has a full pocket beside doorway');
assert.ok(V.z-V.depth/2>M.bath.doorStart+M.bath.doorWidth+.25,'Vanity stays clear of WC doorway');
console.log('PASS: separate dry master vanity, standing space, sliding pocket and bedroom aisle.');

assert.equal(-SITE.roadY,.45,'House finished floor is 450 mm above road');
assert.ok(Math.abs(SITE.porchY-SITE.roadY-.15)<1e-8,'Porch is 150 mm above road');
assert.equal(-SITE.porchY,.3,'Keep two 150 mm indoor entry steps');
assert.ok(Math.abs((SITE.sideLanding.top-SITE.roadY)-(-SITE.sideLanding.top))<1e-8,'Single side landing splits 450 mm difference into equal rises');
assert.ok(SITE.sideLanding.projection+SITE.sideLanding.bevel<=.45,'Side entry stays compact beside wall');
const ramp=gateRampCorners();
assert.ok(SITE.rampRun<=.2&&SITE.rampWidth===GROUND.gateOpening,'Curb bevel stays within 200 mm of gate and follows gate width');
assert.ok(ramp[1][1]<ramp[0][1]&&ramp[2][1]<ramp[3][1],'Curb bevel stays outside the flat parking area');
assert.ok(ramp.every(p=>p[1]<.05),'No ramp enters the parking area');
assert.ok(Math.abs(Math.hypot(ramp[1][0]-ramp[0][0],ramp[1][1]-ramp[0][1])-SITE.rampRun)<1e-8,'Curb bevel horizontal run matches plan');
assert.ok(Math.abs(Math.hypot(ramp[3][0]-ramp[0][0],ramp[3][1]-ramp[0][1])-SITE.rampWidth)<1e-8,'Curb bevel width matches plan');
for(const extended of[false,true]){
 const road=streetPolygon(extended);
 assert.equal(Math.min(...road.map(p=>p[1])),-SITE.frontAlleyWidth,'No extra road branch beyond the crossbar');
 assert.ok(road.some(p=>p[1]>13),'T stem continues along exposed side');
}
assert.ok(SITE.leftHeight>9&&SITE.rearHeight>6&&SITE.rearHeight<SITE.leftHeight,'Three-storey left neighbour and two-storey rear block');
const allLights=LIGHTING_PLAN.filter(l=>l.primary).toSorted((a,b)=>(b.allPriority||0)-(a.allPriority||0)).slice(0,12);
for(const floor of[0,1]){
 assert.equal(allLights.filter(l=>l.floor===floor&&l.zone==='exterior').length,2,'Both side wall lights remain active in whole-house view');
 assert.ok(allLights.some(l=>l.floor===floor&&l.zone==='front-facade'),'Front facade has an active light in whole-house view');
}
console.log('PASS: road/porch/floor levels, flat porch / short integral curb bevel and whole-house exterior lighting budget.');

// Exercise the actual moving roof groups, independent of the renderer and static batching.
const T=await import('three');
const {CANOPY,createTerraceCanopy}=await import('../src/terrace-canopy.js');
const roofMaterial=new T.MeshBasicMaterial(),testRoot=new T.Group();
const roofModel=createTerraceCanopy({parent:testRoot,M:{dark:roofMaterial,glow:roofMaterial},box(parent,x,y,z,w,h,d,material){
 const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.position.set(x,y+h/2,z);parent.add(mesh);return mesh;
}});
assert.ok(CANOPY.back<THIRD.enclosure.front-.2,'Retracting roof clears penthouse wall and door');
assert.ok(CANOPY.height+(CANOPY.panels-1)*CANOPY.stackStep+.04<THIRD.enclosure.height,'Stacked panels clear penthouse roof');
for(const progress of[0,.03,.1,.15,.5,.9,1,.5,0]){
 roofModel.setProgress(progress);testRoot.updateMatrixWorld(true);
 const bounds=roofModel.leaves.map(leaf=>new T.Box3().setFromObject(leaf));
 for(const bound of bounds){assert.ok(bound.min.z>=CANOPY.front-.01&&bound.max.z<=CANOPY.back+.01,'Moving panels stay inside terrace roof footprint');assert.ok(bound.min.y>=CANOPY.height-.001,'Panels remain above fixed guide rails');}
 for(let i=0;i<bounds.length;i++)for(let j=i+1;j<bounds.length;j++)assert.ok(!bounds[i].intersectsBox(bounds[j]),'Panel frames never intersect during lift, slide or closing');
 if(progress===1){
  const stack=bounds.reduce((all,b)=>all.union(b),new T.Box3());assert.ok(stack.max.z-stack.min.z<1.1,'Open roof stacks in rear 1.1 m strip');
  for(let i=1;i<bounds.length;i++)assert.ok(bounds[i].min.y>bounds[i-1].max.y,'Stacked panels do not collide');
 }
}
console.log('PASS: retractable front terrace roof footprint, stack clearance and reversible panel poses.');

const porchLamps=LIGHTING_PLAN.filter(l=>l.floor===0&&l.porchCeiling);
assert.equal(porchLamps.length,2,'Two compact downlights span the porch');
assert.ok(!LIGHTING_PLAN.some(l=>l.floor===0&&['porch','front-facade'].includes(l.zone)&&l.kind==='wall'),'No wall sconces remain at the porch entrance');
for(const l of porchLamps){
 assert.equal(l.kind,'ceiling');
 assert.ok(Math.abs(l.y+.015-(HEIGHT-.23))<1e-8,'Downlight housing meets underside of timber soffit');
 assert.ok(l.x-l.radius>.12&&l.x+l.radius<4.72&&l.z-l.radius>.19&&l.z+l.radius<2.17,'Complete housing stays inside timber soffit');
}
console.log('PASS: porch downlights fixed to timber soffit; hidden with it in cutaway views.');

// Check the paired concept column axes against openings on both occupied floors.
assert.equal(columnPlan.length,10);
assert.equal(new Set(columnPlan.map(c=>c.id)).size,10);
for(const z of STRUCTURE.axes){
 const pair=columnPlan.filter(c=>c.z===z);
 assert.equal(pair.length,2);assert.notEqual(pair[0].side,pair[1].side);
 assert.ok(pair[1].x-pair[0].x>3);
}
const rightOpenings=[...GROUND.rightWindows,MASTER_SUITE.ventilationWindow,MASTER_SUITE.commonWindow,SMALL_SUITE.window,{z:GROUND.exit.z,width:GROUND.exit.width}];
for(const c of columnPlan.filter(c=>c.side==='right')){
 for(const w of rightOpenings)assert.ok(Math.abs(c.z-w.z)>(w.width+STRUCTURE.section)/2,`${c.id} must clear window/door`);
 assert.ok(c.z+STRUCTURE.section/2<SMALL_SUITE.balcony.front||c.z-STRUCTURE.section/2>SMALL_SUITE.balcony.back,`${c.id} clears recessed balcony`);
}
console.log('10 concept column lines: paired axes and opening clearances pass');

const pointSegmentDistance=(p,a,b)=>{
 const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz)));
 return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dz);
};
for(const c of columnPlan.filter(c=>c.z>E.front&&c.z<E.back)){
 const side=shellSides[c.side==='left'?0:1];
 assert.ok(Math.min(...side.slice(1).map((b,i)=>pointSegmentDistance([c.x,c.z],side[i],b)))<1e-8,`${c.id}: penthouse wall follows column axis`);
}
assert.ok(shellSides[1].length>2,'Penthouse follows the change in facade slope');
assert.equal(shellOutline.length,shellSides[0].length+shellSides[1].length);
const sampleRail=[[2,1.1,0],[1,1.6,0],[.5,1.6,0]];
assert.ok(Math.abs(railHeightAt(sampleRail,1.75,0)-1.225)<1e-9,'Picket height interpolates slope');
assert.equal(railHeightAt(sampleRail,.75,0),1.6,'Landing picket joins horizontal rail');
console.log('PASS: penthouse wall/column alignment, facade bend and sloping picket joins.');

// Geographic orientation must survive model mirroring and the 0/360 boundary.
assert.equal(normalizeBearing(-20),340);assert.equal(normalizeBearing(720),0);
for(const front of [0,90,180,270,340])for(const bearing of [0,45,90,180,270,359]){
 const back=vectorBearing(bearingVector(bearing,front),front);
 assert.ok(Math.abs(normalizeBearing(back-bearing+180)-180)<1e-8,'Bearing round-trip');
}
assert.equal(directionName(340),'Bắc Tây Bắc');assert.equal(directionName(360),'Bắc');
assert.equal(vectorBearing([1,0],340),70);assert.equal(vectorBearing([-1,0],340),250);
assert.ok(Math.abs(bedHeadVector(MASTER_SUITE.bed.rotation)[0]-1)<1e-8,'Master headboard points towards world +X after mirroring');
const kitchenFacing=ORIENTATION_TARGETS.find(t=>t.id==='kitchen'),cookFacing=ORIENTATION_TARGETS.find(t=>t.id==='cook');
assert.ok(Math.abs(normalizeBearing(vectorBearing(kitchenFacing.vector)-vectorBearing(cookFacing.vector))-180)<1e-8,'Kitchen working face and cook gaze differ by 180 degrees');
for(const target of ORIENTATION_TARGETS){assert.ok(Math.hypot(...target.vector)>.99);assert.equal(targetWorldPosition(target)[1],target.floor*HEIGHT+target.position[1])}
assert.equal(ORIENTATION_REFERENCE.latitude,16.056323);assert.equal(ORIENTATION_REFERENCE.estimated,true);
console.log('PASS: compass bearings, mirrored headboards, kitchen convention and floor anchors.');

assert.equal(WINDER.risers,5);assert.ok(fanWalkGoing>.25&&fanWalkGoing<.36,'Winder walk-line going remains at least 250 mm');
assert.ok(WINDER.innerRadius*WINDER.angle/WINDER.risers>.14,'Concept inner tread avoids a pointed triangular tip');
assert.ok(Math.abs(fanEntryDirection[0])>.8&&fanEntryDirection[1]<-.45,'Entry is diagonal, not aligned with main or side facade');
const lastFan=fanStepPolygon(WINDER.risers-1);
assert.ok(lastFan.some(p=>Math.abs(p[0]-STAIR.x)<1e-8&&Math.abs(p[1]-(STAIR.z+STAIR.width))<1e-8),'Outer fan edge meets long flight');
assert.ok(lastFan.some(p=>Math.abs(p[0]-STAIR.x-STAIR.width)<1e-8&&Math.abs(p[1]-(STAIR.z+STAIR.width))<1e-8),'Inner fan edge meets long flight');
for(let i=0;i<WINDER.risers-1;i++){
 const a=fanStepPolygon(i),b=fanStepPolygon(i+1);
 for(const radius of [WINDER.innerRadius,WINDER.innerRadius+WINDER.width]){const point=fanPoint(radius,fanAngle((i+1)/WINDER.risers));assert.ok(a.some(p=>Math.hypot(p[0]-point[0],p[1]-point[1])<1e-8)&&b.some(p=>Math.hypot(p[0]-point[0],p[1]-point[1])<1e-8),'Adjacent fan treads share an exact boundary')}
}
const fanMinZ=Math.min(...fanStepPolygon(0).map(p=>p[1]));
assert.ok(fanMinZ-(GROUND.sofa.z+GROUND.sofa.length/2)>.10,'Sofa remains physically clear of curved stair footprint');
assert.ok(fanMinZ-(LIVING.rug.z+LIVING.rug.length/2)>.09,'Rug stops before winder');
assert.ok(E.frontDoor.height<CANOPY.height-.13-.04,'Open folding panels clear overhead canopy beam');
assert.ok(E.frontDoor.left>CANOPY.left+.12&&E.frontDoor.left+E.frontDoor.width<CANOPY.right-.12,'Folding panels clear canopy rear posts');
assert.ok(Math.abs(P.altarZ-P.buddhaZ-(P.ancestor.depth+P.buddhist.depth)/2-.10)<1e-8,'Compact altar pair has a 100 mm separation; access is from the sides');
assert.ok(P.screen.z2-P.screen.z1<2.0&&P.screen.height<1.8,'Side screen remains below eye level and open to the front');
console.log('PASS: diagonal winder continuity, living-room clearance, folding doorway and open dual-altars layout.');

// Trial: both identical flights rise 3.6 m in exactly 21 risers.
assert.equal(HEIGHT,3.6);assert.equal(STAIR.risers,21);
assert.equal(STAIR.middleRisers,11);assert.equal(STAIR.firstRisers+STAIR.middleRisers+STAIR.lastRisers,21);
assert.ok(STAIR.rise>.17&&STAIR.rise<.172);
assert.ok(2*STAIR.rise+STAIR.tread>.60&&2*STAIR.rise+STAIR.tread<.64);
assert.ok(UPPER_LAYOUT.smallBoundary[0][1]-.05-UPPER.hole.end>=.05,'Rear partition leaves physical gap beyond arrival slab');
assert.ok(SMALL_SUITE.vanity.z+SMALL_SUITE.vanity.depth/2+.05<11.55-.2,'Shifted vanity remains clear of WC');
assert.ok(THIRD.enclosure.back-.06-UPPER.hole.end>.06,'Roof stair arrival clears back wall');
console.log('PASS: two 3.6 m storeys / 21 equal risers, rear wall, compact WC and roof arrival clearances.');

assert.deepEqual([STAIR.firstRisers,STAIR.middleRisers,STAIR.lastRisers],[5,11,5]);
assert.ok([STAIR.firstRisers,STAIR.middleRisers,STAIR.lastRisers].every(n=>n%2===1&&n%4!==0));
assert.ok(2*STAIR.rise+STAIR.middleTread>=.60&&2*STAIR.rise+STAIR.middleTread<=.64,'Long-flight walking proportion');
assert.ok(UPPER.landingX+STAIR.landing+.1<UPPER_LAYOUT.smallBoundary[2][0],'Wider final flight clears side partition');
assert.equal(SERVICE.fridge.x,.69);assert.equal(SERVICE.fridge.z,8.92);
const fridgeSpan=[SERVICE.fridge.z-SERVICE.fridge.width/2-SERVICE.fridge.sideClearance,SERVICE.fridge.z+SERVICE.fridge.width/2+SERVICE.fridge.sideClearance];
assert.ok(fridgeSpan[0]<UPPER.landingStart&&fridgeSpan[1]>UPPER.landingStart,'Fridge roof crosses stair/landing transition and needs two fitted pieces');
for(let z=fridgeSpan[0];z<=fridgeSpan[1];z+=.005)assert.ok(stairUnderside(z)-.025>SERVICE.fridge.height+SERVICE.fridge.topClearance,'Fridge overhead joinery clears actual underside');
console.log('PASS: 5–11–5 split, 295 mm long treads, final landing and retained fridge/cabinet envelope.');

// A standing platform is insufficient: require a continuous 950 mm route to the front hall.
const routeRadius=.475,routeX=UPPER.landingX+STAIR.landing/2;
const turnZ=UPPER.landingStart+STAIR.landing/2;
const rightRouteX=(P.screen.x+.06+Math.min(entrySpan(P.front)[1],entrySpan(P.back)[1])-.09)/2;
const route=[[routeX,turnZ],[rightRouteX,turnZ],[rightRouteX,7.2],[4.42,6.93],[4.1,6.5],[4.1,6.0]];
const obstacles=[
 [UPPER.hole.right,UPPER.landingX,UPPER.landingStart-.10,UPPER.landingStart],
 [UPPER.hole.right,UPPER.hole.right+.1,UPPER.hole.start,UPPER.landingStart],
 [P.rearWallLeft,P.rearWallRight,P.back-.06,P.back+.06],
 [P.left-.06,P.left+.06,P.front,P.back],
 [P.screen.x-.06,P.screen.x+.06,P.screen.z1,P.screen.z2],
 [E.frontDoor.left+E.frontDoor.width,entrySpan(E.front)[1],E.front-.06,E.front+.06],
 [P.altarX-P.ancestor.width/2,P.altarX+P.ancestor.width/2,P.altarZ-P.ancestor.depth/2,P.altarZ+P.ancestor.depth/2],
 [P.altarX-P.buddhist.width/2,P.altarX+P.buddhist.width/2,P.buddhaZ-P.buddhist.depth/2,P.buddhaZ+P.buddhist.depth/2]
];
for(let i=1;i<route.length;i++)for(let t=0;t<=1;t+=.01){
 const x=route[i-1][0]+(route[i][0]-route[i-1][0])*t,z=route[i-1][1]+(route[i][1]-route[i-1][1])*t;
 for(const [x1,x2,z1,z2] of obstacles){const dx=Math.max(x1-x,0,x-x2),dz=Math.max(z1-z,0,z-z2);assert.ok(Math.hypot(dx,dz)>=routeRadius-1e-7,`950 mm route hits obstacle ${[x1,x2,z1,z2]} at ${x},${z}; clearance ${Math.hypot(dx,dz)}`);}
 assert.ok(x-routeRadius>UPPER.hole.right+.1,'Route stays on solid floor beside the stair opening');
}
assert.ok(E.back-.06-(P.back+.06)>=1.4,'Rear hall connects stair arrival to right entry with at least 1.4 m depth');
assert.ok(entrySpan(P.back)[1]-.09-(P.screen.x+.06)>=.95,'Right-side entry remains at least 950 mm clear');
assert.ok(P.altarX+P.ancestor.width/2<entrySpan(P.altarZ)[1]-.06,'Shifted ancestor altar clears exterior wall');
console.log('PASS: continuous 950 mm route from stair via rear-right entry and right aisle to front terrace.');

// The first tread now faces inward, beyond the side door, rather than toward either entrance.
const fanMouth=fanPoint(WINDER.innerRadius+WINDER.width/2,fanAngle(0));
const outward=fanEntryDirection.map(n=>-n),toSolidWall=fanFacingTarget.map((n,i)=>n-fanMouth[i]);
assert.ok(Math.abs(outward[0]*toSolidWall[1]-outward[1]*toSolidWall[0])<1e-8,'First tread normal must hit designated interior solid-wall target');
assert.ok(outward[0]*toSolidWall[0]+outward[1]*toSolidWall[1]>0,'Solid interior wall is in front of stair mouth');
const rayX=entrySpan(GROUND.tv.z)[1]-.09,rayZ=fanMouth[1]+(rayX-fanMouth[0])*outward[1]/outward[0];
assert.ok(rayZ>GROUND.exit.z+GROUND.exit.width/2+.5,'Interior-facing ray hits solid wall beyond the side exit');
assert.deepEqual([f.width,f.depth,f.height],[.912,.716,1.78],'Samsung RS62R5001M9 actual overall dimensions');
assert.ok(9.28-f.z>=.35,'Fridge moves toward kitchen by roughly one joinery module');
assert.ok(f.x-f.depth/2-(entrySpan(f.z)[0]+.09)>=.05,'At least 50 mm behind fridge');
assert.ok(f.sideClearance>=.1&&f.topClearance>=.05,'Reference installation gaps remain ventilated');
assert.ok(Math.abs(REAR_FURNITURE.cabinetEnd-(f.z+f.width/2+f.sideClearance)-.025)<1e-8,'End divider follows new bay with no leftover tall cabinet');
console.log('PASS: stair mouth faces inward, misses doors; relocated real-size fridge and ventilation gaps.');

// Shortened side screen covers legs and wiring; only the front tabletop overhangs by 15 mm.
assert.ok(P.screen.z1<=Math.min(P.buddhaZ-P.buddhist.depth/2,P.altarZ-P.ancestor.depth/2)+.02);
assert.ok(P.screen.z2>=Math.max(P.buddhaZ+P.buddhist.depth/2,P.altarZ+P.ancestor.depth/2)+.1);
assert.equal(P.screen.z2,P.back,'Side screen meets rear wall without a gap');
assert.equal(P.screen.x,P.rearWallRight,'Right screen meets end of rear wall beside the entry');
assert.ok(P.screen.height>1.28,'Screen conceals both table undersides');
assert.ok(P.screen.x-.06-(P.altarX+P.ancestor.width/2)>.4,'Ancestor tabletop has over 400 mm beside the right screen');
assert.ok(P.altarZ+P.ancestor.depth/2<P.back-.06,'Ancestor table clears back wall');
const {prayerInteriorOutline}=await import('../src/building-joints.js');
assert.equal(prayerInteriorOutline.filter(p=>Math.abs(p[0]-(P.left+.06))<1e-8).length,2,'Timber zone has one straight left edge');
assert.ok(Math.abs(P.altarX-(P.left+P.screen.x)/2)<1e-9,'Both altars are centred between the left and right worship walls');
console.log('PASS: closer altars, rectangular timber zone, continuous side/rear screen and concealed cable route.');

// Check the full first-tread mouth, including its two edges, against both door zones.
for(const radius of [WINDER.innerRadius,WINDER.innerRadius+WINDER.width]){
 const p=fanPoint(radius,fanAngle(0));
 const wallZ=p[1]+(rayX-p[0])*outward[1]/outward[0];
 assert.ok(wallZ>GROUND.glassLine+.2,'Entire stair mouth hits side wall before the front entrance');
 assert.ok(wallZ>GROUND.exit.z+GROUND.exit.width/2+.6,'Entire stair mouth hits wall at least 600 mm beyond side exit zone');
}
assert.ok(fanFacingTarget[1]>GROUND.exit.z+GROUND.exit.width/2+1,'Target lies well behind side exit');
assert.ok(Math.abs(WINDER.angle*180/Math.PI-120)<1e-8,'Fan rotates to 120 degrees, facing into the house');
console.log('PASS: both edges of stair mouth clear front and side doors, interior target and tread depth.');

assert.equal(P.rearWallLeft,P.left,'Rear wall starts at stair-side worship wall');
assert.equal(P.rearWallRight,P.screen.x,'Rear entry is at the right corner');
assert.ok(P.back+.06<UPPER.landingStart-.05,'Rear wall does not cross final treads');
assert.ok(Math.abs(P.left-(UPPER.hole.right+.05))<1e-9,'Left worship wall joins existing stair guard without a parallel gap');
assert.ok(P.screen.x-.06-(P.altarX+P.ancestor.width/2)>.5&&P.altarX-P.ancestor.width/2-(P.left+.06)>.5,'Centred ancestor altar leaves over 500 mm each side');
console.log('PASS: centred altar pair, rear-right entry, joined left stair wall and door-corner circulation.');

assert.ok(P.screen.z2-P.screen.z1<=1.45+1e-8,'Screen shortened from 1.85 m to 1.45 m');
assert.ok(P.screen.z1<=P.buddhaZ-.2375*P.buddhist.depth/.57,'Short screen still conceals front legs');
assert.deepEqual(P.ancestor,{width:1.53,depth:.61,height:1.07});
assert.deepEqual(P.buddhist,{width:1.27,depth:.61,height:1.27});
assert.ok(P.buddhist.height>P.ancestor.height,'Buddhist tabletop remains higher than ancestor tabletop');

// Audit the full mouth, including small angular deviations, against actual sloping side wall.
const stairRayHits=[];
for(let i=0;i<=100;i++)for(const delta of[-2,0,2]){
 const point=fanPoint(WINDER.innerRadius+WINDER.width*i/100,fanAngle(0));
 const angle=WINDER.angle+delta*Math.PI/180,d=[Math.sin(angle),-Math.cos(angle)];
 let z=4;
 for(let k=0;k<20;k++)z=point[1]+(entrySpan(z)[1]-.09-point[0])*d[1]/d[0];
 const hit=[entrySpan(z)[1]-.09,z];stairRayHits.push(hit);
 assert.ok(hit[0]>point[0],'Ray goes to TV-side wall');
 assert.ok(z>GROUND.glassLine+.8,'Whole fan plus 2 degree tolerance hits solid side wall before front door');
 assert.ok(z>GROUND.exit.z+GROUND.exit.width/2+.5,'Whole fan plus 2 degree tolerance hits solid wall at least 500 mm beyond side door');
}
const marker=LIGHTING_PLAN.find(l=>l.floor===0&&l.mounting==='first-winder-riser');
assert.ok(marker,'Ground-floor fan has a mounted riser marker');
assert.ok(Math.hypot(marker.x-fanMouth[0],marker.z-fanMouth[1])<1e-8,'Marker backplate lies exactly on first riser plane');
assert.ok(marker.y-.0275>0&&marker.y+.0275<STAIR.rise-.065,'Marker fits inside exposed concrete riser below stone cap');
assert.ok(Math.abs(Math.sin(marker.rotation)+fanEntryDirection[0])<1e-8&&Math.abs(Math.cos(marker.rotation)+fanEntryDirection[1])<1e-8,'Marker points outward from riser');
console.log(`PASS: 303 mouth rays including +/-2 degrees hit solid wall at z ${Math.min(...stairRayHits.map(p=>p[1])).toFixed(3)}–${Math.max(...stairRayHits.map(p=>p[1])).toFixed(3)} m; riser light mounted below tread.`);

// A 500 mm person envelope reaches the stair via the open front of the dining area.
const frontDiningChair=[d.x-.48-.215,d.x-.48+.215,d.z-.66-.215,d.z-.66+.215];
const approach=[[2.75,5.1],[2.65,5.35],[2.5,5.52],[2.25,5.565],[2.12,5.55],fanMouth];
for(let i=1;i<approach.length;i++)for(let j=0;j<=20;j++){
 const t=j/20,p=approach[i].map((v,k)=>v*t+approach[i-1][k]*(1-t));
 const dx=Math.max(frontDiningChair[0]-p[0],0,p[0]-frontDiningChair[1]);
 const dz=Math.max(frontDiningChair[2]-p[1],0,p[1]-frontDiningChair[3]);
 assert.ok(Math.hypot(dx,dz)>.25,'500 mm approach envelope clears front dining chair');
 for(const radius of[WINDER.innerRadius+.02,WINDER.innerRadius+WINDER.width-.02]){
  let a=Math.atan2(p[1]-WINDER.cz,p[0]-WINDER.cx);if(a<0)a+=Math.PI*2;
  a=Math.max(fanAngle(1),Math.min(fanAngle(0),a));
  const q=fanPoint(radius,a);assert.ok(Math.hypot(p[0]-q[0],p[1]-q[1])>.272,'500 mm person clears both curved handrails on approach');
 }
}
assert.ok(fanMinZ-(GROUND.tv.z+GROUND.tv.panelLength/2)>.15,'Curved stair and left TV panel have a physical gap, measured from real fan footprint');
assert.ok(entrySpan(d.z)[1]-.09-SERVICE.kitchen.depth-(d.x+d.length/2)>.80,'Corner trial retains over 800 mm beside kitchen');
console.log('PASS: swapped living room, real TV/fan separation, 500 mm stair approach and kitchen aisle.');

// Exterior finish must track the parcel bends and leave existing glazed openings/exit clear.
const {FACADE,facadePath,facadeRibbon,offsetFacadePath}=await import('../src/facade-design.js');
assert.ok(facadePath.length>8,'Keep the sampled rounded street corner');
for(const path of [facadePath,facadePath.filter(p=>p[1]<.58)]){
 const ribbon=facadeRibbon(path,FACADE.band.inset,FACADE.band.outset);
 assert.equal(ribbon.length,path.length*2);
 assert.ok(ribbon.every(p=>p.every(Number.isFinite)),'No degenerate facade vertices');
 const outer=offsetFacadePath(path,FACADE.band.outset);
 outer.forEach((p,i)=>assert.ok(Math.hypot(p[0]-path[i][0],p[1]-path[i][1])<.19,'No long mitre spikes at corners'));
}
for(const w of FACADE.windows){
 assert.ok(w.head>w.sill&&w.width>0&&w.head+.123<HEIGHT-FACADE.band.height,'Hoods below floor band');
}
assert.ok(GROUND.exit.z-GROUND.exit.width/2>.58,'Stone base starts before exit');
assert.ok(!source.includes('addWindowAwnings({'),'No duplicate old awnings');
console.log('PASS: finite curved facade ribbons, bounded projections, hood heights and removal of duplicate awnings.');

// A wall skin crossing the parcel kink must be split there; otherwise diagonal
// triangles cut through the original wall, despite every input corner looking correct.
const THREE=await import('three');
const {foldSideGeometry}=await import('../src/facade-design.js');
const testSkin=new THREE.ExtrudeGeometry(new THREE.Shape([
 new THREE.Vector2(-10,.2),new THREE.Vector2(-6,.2),new THREE.Vector2(-6,3.3),new THREE.Vector2(-10,3.3)
]),{depth:.035,bevelEnabled:false});
const folded=foldSideGeometry(testSkin),pp=folded.getAttribute('position');
for(let i=0;i<pp.count;i+=3){
 const center=[0,0,0];
 for(let j=0;j<3;j++)for(let k=0;k<3;k++)center[k]+=pp.array[(i+j)*3+k]/3;
 const depths=[0,1,2].map(j=>pp.getX(i+j)-entrySpan(pp.getZ(i+j))[1]-.118);
 assert.ok(depths.every(d=>d>-.00001&&d<.03501),'Cladding lies outside the wall');
 assert.ok(Math.abs(center[0]-entrySpan(center[2])[1]-.118-depths.reduce((a,b)=>a+b,0)/3)<.00001,'Every folded face follows the real wall plane');
}
testSkin.dispose();folded.dispose();
console.log('PASS: folded exterior triangles follow the slope on both sides of the parcel kink.');

// Regression: intersecting window/AC holes previously produced triangles across glass.
// Tile subtraction must remain disjoint and clear even for overlapping openings.
const {subtractOpenings,tiledRectangles}=await import('../src/exterior-tiles.js');
const bounds={x1:0,x2:4,y1:0,y2:4};
const cuts=[{x1:1,x2:3,y1:1,y2:3},{x1:2,x2:3.5,y1:2,y2:3.5}];
const pieces=subtractOpenings(bounds,cuts),area=r=>(r.x2-r.x1)*(r.y2-r.y1);
assert.ok(Math.abs(pieces.reduce((n,r)=>n+area(r),0)-10.75)<1e-8,'Subtract union of overlapping holes once');
const overlap=(a,b)=>Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1)>1e-7&&Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1)>1e-7;
for(const rects of [pieces,tiledRectangles(bounds,cuts)])for(let i=0;i<rects.length;i++){
 assert.ok(!cuts.some(c=>overlap(rects[i],c)),'No finish in an opening');
 assert.ok(!rects.slice(i+1).some(c=>overlap(rects[i],c)),'No stacked tile fragments');
}
const finishSource=fs.readFileSync(new URL('../src/facade-design.js',import.meta.url),'utf8');
assert.ok(!finishSource.includes('Mang_lon_xanh_khoang_hong'),'Remove faulty green window overlay');
console.log('PASS: tile/opening subtraction handles intersecting holes without covering glazing or overlapping pieces.');

const {roofStairFrontGuard:roofFront}=await import('../src/building-joints.js');
assert.ok(roofFront.a[0]-roofFront.thickness/2<=UPPER.hole.left&&roofFront.b[0]+roofFront.thickness/2>=UPPER.hole.right,'Front wall spans the complete stair void');
assert.ok(Math.abs(roofFront.a[1]+roofFront.thickness/2-UPPER.hole.start)<1e-8,'Front guard sits on solid slab, flush with void edge');
assert.equal(roofFront.height,THIRD.enclosure.height,'Front stair barrier reaches the enclosure roof');
assert.ok(THIRD.enclosure.frontDoor.left+THIRD.enclosure.frontDoor.width-(roofFront.b[0]+roofFront.thickness/2)>3,'Terrace doorway retains over 3 m clear beside stair wall');
const {ADDRESS_MOUNT}=await import('../src/lighting-plan.js');
const tileFace=.043199780982963176+(-.0206-.043199780982963176)*ADDRESS_MOUNT.x/4.8405875785593295-.031-.106/2;
assert.ok(Math.abs(ADDRESS_MOUNT.z+.026/2-tileFace)<.002,'Address plaque back sits flush against finished tile face');
console.log('PASS: roof stair front edge is fully enclosed, terrace entrance stays clear, address plaque clears tile.');

// Balcony privacy guard uses a continuous sampled corner, with no separately offset joints.
const {masterBalconyGuardPath}=await import('../src/facade-design.js');
const masterGuardPath=masterBalconyGuardPath();
assert.ok(masterGuardPath.length>16,'Curved balcony corner keeps its smooth samples');
for(let i=1;i<masterGuardPath.length;i++){
 assert.ok(masterGuardPath[i].every(Number.isFinite),'Guard coordinates are finite');
 assert.ok(Math.hypot(masterGuardPath[i][0]-masterGuardPath[i-1][0],masterGuardPath[i][1]-masterGuardPath[i-1][1])>.001,'No zero-length rail section at joins');
}
assert.equal(masterGuardPath.at(-1)[1],M.balcony.depth,'Guard returns all the way to the side wall');
const entryFrontLamp=LIGHTING_PLAN.find(l=>l.floor===0&&l.zone==='front-facade');
assert.equal(entryFrontLamp.kind,'ceiling','Front entrance uses a soffit downlight instead of a wall sconce');
const masterFrontLamp=LIGHTING_PLAN.find(l=>l.floor===1&&l.zone==='front-facade');
assert.ok(Math.abs(masterFrontLamp.x-(M.frontWindow.centers[0]+M.frontWindow.centers[1])/2)<1e-9,'Master lamp is centred between both arches');
assert.ok(masterFrontLamp.x-.095>M.frontWindow.centers[0]+M.frontWindow.width/2+.065&&masterFrontLamp.x+.095<M.frontWindow.centers[1]-M.frontWindow.width/2-.065,'Lamp clears both arched window frames');
assert.ok(Math.abs(ADDRESS_MOUNT.lightZ-tileFace)<.002,'Address lamp mounting plate meets the finished wall');
console.log('PASS: continuous master balcony guard and supported facade/address fixture locations.');

const {DOMESTIC_ALTARS:DA}=await import('../src/domestic-altars.js');
const A=DA.earth,Tao=DA.kitchen;
assert.ok(A.z-A.width/2>GROUND.glassLine+.4,'Low shrine clears entry threshold');
assert.ok(LIVING.aisle.maxX-(A.x+(A.depth+.035)/2)>=1.2,'Shrine leaves at least 1.2 m passage on its right');
assert.ok(A.z+(A.width+.025)/2<fanMinZ-.05,'Shrine canopy clears the curved stair and rail');
assert.ok(A.z-(A.width+.025)/2>GROUND.tv.z+GROUND.tv.cabinetLength/2,'Shrine clears TV credenza');
assert.ok(Tao.x+Tao.width/2+.025<SERVICE.kitchen.sinkX-.32,'Shelf is beside the sink, not over the bowl');
assert.ok(Tao.shelfY-.22>1.27+.5,'Shelf brackets clear faucet height');
assert.ok(Tao.z-Tao.depth/2>SERVICE.kitchen.hobZ+.34,'Kitchen shrine does not overlap cooking hood');
assert.ok(Math.abs(Tao.z+Tao.depth/2-SERVICE.kitchen.end)<1e-8,'Shelf backing meets tiled return wall');
assert.ok(SMALL_SUITE.wardrobe.x-SMALL_SUITE.wardrobe.width/2>3.45,'Small wardrobe stays behind room wall and out of shared landing');
assert.ok(Tao.shelfY+Tao.height<HEIGHT-UPPER.slabThickness-.5,'Shelf leaves overhead space');
console.log('PASS: domestic altars clear entrance, TV, stairs, escape door, hob/hood and sink.');

// New arched facade: dimensions, glazing contour and gate lintels remain buildable in the concept.
const {archShape,archSpandrels,GATE_ARCHES}=await import('../src/arched-openings.js');
assert.ok(Math.abs(M.frontWindow.width-2.08/3)<1e-9,'Front window reduced to one third of its former width');
assert.ok(M.frontWindow.x+M.frontWindow.width/2+.15<M.balcony.splitX,'Arched window clears the enlarged balcony divider');
assert.ok(M.balcony.splitX-.06-(M.bed.x+1.13)>=.10,'Balcony return does not intersect the bed');
const arcGroup=new THREE.Group();archSpandrels(arcGroup,M.frontWindow.width,M.frontWindow.head,.18,new THREE.MeshBasicMaterial());
for(const mesh of arcGroup.children){
 const p=mesh.geometry.attributes.position,r=M.frontWindow.width/2,spring=M.frontWindow.head-r;
 for(let i=0;i<p.count;i++)assert.ok(Math.hypot(p.getX(i),p.getY(i)-spring)>=r-.001,'Arch corner masonry stays outside glazed semicircle');
}
for(const w of GATE_ARCHES){
 assert.ok(w.x-w.width/2>.46+GROUND.gateOpening+.15,'Arched grille stays off the sliding gate');
 assert.ok(w.x+w.width/2<4.84,'Arched grille stays off the curved corner');
 assert.ok(w.top+.15<GROUND.securityHeight+GROUND.porchLevel,'Gate arch retains a solid lintel above');
}
console.log('PASS: one-third arched window, widened balcony furniture clearance and arched gate lintels.');

assert.equal(M.frontWindow.centers.length,2,'Master facade has two narrow arched windows');
const centers=M.frontWindow.centers;
assert.ok(centers[0]-M.frontWindow.width/2>.15,'First arched window retains a solid outer jamb');
assert.ok(centers[1]-centers[0]-M.frontWindow.width>.25,'Paired arches retain a solid pier between them');
assert.ok(centers[1]+M.frontWindow.width/2+.065<M.balcony.splitX-.15,'Second arch and frame clear balcony divider');
console.log('PASS: paired master arches retain outer jamb, middle pier and balcony clearance.');

assert.ok(Math.abs(DA.earth.x-DA.earth.depth/2-entrySpan(DA.earth.z)[0]-.025)<1e-9,'Earth shrine back sits 25 mm from the living room wall');
assert.ok(DA.earth.z-DA.earth.width/2>GROUND.tv.z+GROUND.tv.panelLength/2+.10,'Moved TV panel retains a separate shrine bay');
console.log('PASS: moved TV and wall-backed shrine retain a separate bay.');

assert.equal(DA.earth.rotation,-Math.PI/2,'Shrine back faces the side wall and front faces the living room');
