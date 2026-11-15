import {entrySpan,THIRD,plot} from './design.js';

// Include every change in parcel slope so walls and column axes share a line.
export const shellStations=[THIRD.enclosure.front,...plot.map(p=>p[1]).filter(z=>z>THIRD.enclosure.front&&z<THIRD.enclosure.back),THIRD.enclosure.back].sort((a,b)=>a-b);
export const shellSides=[0,1].map(side=>shellStations.map(z=>[entrySpan(z)[side],z]));
export const shellRightAt=z=>entrySpan(z)[1];
export const shellOutline=[...shellSides[0],...shellSides[1].toReversed()];

const R=THIRD.prayer;
export const prayerInteriorOutline=[[R.left+.06,R.front+.06],[shellRightAt(R.front)-.09,R.front+.06],...shellSides[1].filter(v=>v[1]>R.front&&v[1]<R.back).map(([x,z])=>[x-.09,z]),[shellRightAt(R.back)-.09,R.back-.06],[R.left+.06,R.back-.06]];

// Each picket meets the sloping handrail at its own position, not at step centre.
export function railHeightAt(points,x,z){
 let nearest=Infinity,height=points[0][1];
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],dx=b[0]-a[0],dz=b[2]-a[2],len=dx*dx+dz*dz;
  const t=len?Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[2])*dz)/len)):0;
  const distance=Math.hypot(x-a[0]-t*dx,z-a[2]-t*dz);
  if(distance<nearest){nearest=distance;height=a[1]+t*(b[1]-a[1])}
 }
 return height;
}
