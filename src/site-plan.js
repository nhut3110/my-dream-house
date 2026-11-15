import {plot,buildingPlot,GROUND} from './design.js';
// Visual estimates from April 2021 panoramas, satellite imagery and owner description.
export const SITE={roadY:-.45,porchY:-.3,alleyWidth:2.5,frontAlleyWidth:3.2,leftHeight:9.6,rearHeight:6.2,
 sideLanding:{projection:.32,bevel:.12,top:-.225},radius:30,rampRun:.20,rampWidth:GROUND.gateOpening,source:'Google Street View April 2021 + satellite + owner description',estimated:true};
// Short integral curb bevel along the gate threshold; parking surface stays flat.
export function gateRampCorners(){
 const a=plot[0],b=buildingPlot[1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),u=[(b[0]-a[0])/len,(b[1]-a[1])/len],out=[-u[1],u[0]];
 const offset=.46+(GROUND.gateOpening+.12-SITE.rampWidth)/2;
 const start=[a[0]+u[0]*offset,a[1]+u[1]*offset],end=[start[0]+u[0]*SITE.rampWidth,start[1]+u[1]*SITE.rampWidth];
 return [start,[start[0]+out[0]*SITE.rampRun,start[1]+out[1]*SITE.rampRun],[end[0]+out[0]*SITE.rampRun,end[1]+out[1]*SITE.rampRun],end];
}
// Crossbar in front of the gate; the T stem continues only along the exposed right side.
export function streetPolygon(extended=false){const side=plot[3][0],w=SITE.alleyWidth,min=extended?-30:-7,max=extended?32:14,back=extended?34:20;
 return [[min,-SITE.frontAlleyWidth],[max,-SITE.frontAlleyWidth],[max,0],[side,0],[side,back],[side-w,back],[side-w,0],[min,0]];
}
