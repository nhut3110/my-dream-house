import {STAIR,GROUND,entrySpan} from './design.js';
// Concept winder. Keep the long flight, opening, riser count and floor levels.
// Rotate the mouth beyond the side-door direction: the outgoing normal points into the house.
// A 120-degree fan uses deeper walk-line treads while retaining five equal rises.
const innerRadius=.36,cx=STAIR.x+STAIR.width+innerRadius,cz=STAIR.z+STAIR.width;
export const WINDER={innerRadius,angle:2*Math.PI/3,risers:STAIR.firstRisers,width:STAIR.width,cx,cz};
export const fanPoint=(radius,angle)=>[WINDER.cx+radius*Math.cos(angle),WINDER.cz+radius*Math.sin(angle)];
export const fanAngle=t=>Math.PI+WINDER.angle*(1-t);
export const fanHeight=t=>STAIR.rise*Math.max(1,Math.min(WINDER.risers,.5+t*WINDER.risers));
export function fanStepPolygon(index,segments=10){
 const a=fanAngle(index/WINDER.risers),b=fanAngle((index+1)/WINDER.risers);
 const arc=radius=>Array.from({length:segments+1},(_,j)=>fanPoint(radius,a+(b-a)*j/segments));
 return [...arc(WINDER.innerRadius+WINDER.width),...arc(WINDER.innerRadius).toReversed()];
}
export const fanEntryDirection=[Math.sin(fanAngle(0)),-Math.cos(fanAngle(0))];
export const fanWalkGoing=(WINDER.innerRadius+WINDER.width/2)*WINDER.angle/WINDER.risers;

// Fixture sits on the first vertical riser, never floating above a fan tread.
const firstRiser=fanPoint(WINDER.innerRadius+WINDER.width/2,fanAngle(0));
export const fanStepMarker={x:firstRiser[0],z:firstRiser[1],y:(STAIR.rise-.065)/2,rotation:Math.atan2(-fanEntryDirection[0],-fanEntryDirection[1]),mounting:'first-winder-riser'};

const facingOrigin=fanPoint(WINDER.innerRadius+WINDER.width/2,fanAngle(0));
export const fanFacingTarget=[entrySpan(7.4)[1]-.09,0];
fanFacingTarget[1]=facingOrigin[1]+(fanFacingTarget[0]-facingOrigin[0])*(-fanEntryDirection[1])/(-fanEntryDirection[0]);
