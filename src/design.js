import geometry from '../plans/plot-geometry.json' with {type:'json'};
export const plot = geometry.vertices.map(v=>[v.x_m,v.y_m]);
export const HEIGHT=3.6;
export const STAIR={x:.25,z:5.45,width:.95,landing:.95,firstRisers:5,secondRisers:16,middleRisers:11,lastRisers:5,risers:21,rise:HEIGHT/21,tread:.27,middleTread:.295,type:'L',firstDirection:'right-to-left',secondDirection:'towards-rear'};
export const MIRROR_X=Math.max(...plot.map(v=>v[0]));
export const toWorld=([x,z])=>[MIRROR_X-x,z];
export const levels=[
 {name:'Tầng một',height:0,rooms:[['Cổng rộng 2,40 m',1.72,.15],['Cửa kính',1.7,2.6],['Sân để xe',3.0,1.5],['Phòng khách',3.1,3.75],['Thang thẳng 1,00 m',.8,5.8],['WC gầm thang',.85,7.5],['Lavabo',1.65,7.45],['Bếp & bàn ăn',2.65,9.1],['Cửa thoát bếp',4.9,8.85],['Phòng hai giường',2.7,11.9]]},
 {name:'Tầng hai',height:HEIGHT,rooms:[['Ban công',3,1],['Phòng ngủ 01',2.8,2.85],['Thang thẳng',.85,5.8],['WC',4.55,6.2],['Sinh hoạt chung',2.7,9.1],['Phòng ngủ 02',2.8,11.8]]},
 {name:'Tầng ba',height:HEIGHT*2,rooms:[['Sân trước',3,1.2],['Phòng thờ',2.8,3.25],['Thang thẳng',.85,5.8],['Sân sau',2.5,10.5],['Khu giặt',4.55,12]]}
];
export const assumptions={units:'metres',externalWall:.18,internalWall:.1,floorToFloor:HEIGHT,stair:STAIR,style:'Contemporary Japandi / warm oak, mineral plaster, olive linen',entry:'Front recessed corner',source:'../plans/plot-geometry.json',stage:'Concept design, not construction drawings'};

// Updated ground-floor brief. Coordinates are metres, right/left are from the gate looking in.
export const GROUND={glassLine:2.3,porchLevel:-.3,stepRise:.15,stepTread:.3,gateEdge:0,gateOpening:2.4,securityHeight:2.2,sofa:{x:4.5,z:3.65,length:2.3,depth:.92,chaiseDepth:1.62},tv:{x:.5,z:3.45,panelLength:1.6,cabinetLength:1.5},rightWindows:[{z:11.65,width:1.8,sill:1.1,head:2.5}],exit:{z:5.65,width:.95},bedroomStart:9.20,beds:[{x:1.25,z:11.85,width:1,length:2},{x:3.75,z:11.85,width:1,length:2}],wc:{x1:.35,x2:1.35,z1:6.65,z2:8.18},parking:[{x:1.14,z:1.04,angle:Math.PI/4,length:1.844,width:.714,height:1.132},{x:2.27,z:1.04,angle:Math.PI/4,length:1.844,width:.714,height:1.132},{x:3.4,z:1.04,angle:Math.PI/4,length:1.844,width:.714,height:1.132}],closedSides:['left','rear']};

export const HUMAN={height:1.7,eye:1.58,shoulder:.46};
export const HONDA_SOURCE='https://www.honda.com.vn/xe-may/san-pham/lead-abs';

// Current iteration: living room plus the requested left-wall L stair.
export const LIVING={start:2.3,end:5.8,coffee:{x:3.08,z:3.55,width:.7,length:.95},rug:{x:3.35,z:3.65,width:2.95,length:2.3},aisle:{minX:.9,maxX:2.55,startZ:2.5,endZ:8}};

export function clipAtZ(polygon,z,front){const result=[];for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],inside=p=>front?p[1]<=z:p[1]>=z;if(inside(a))result.push(a);if(inside(a)!==inside(b)){const t=(z-a[1])/(b[1]-a[1]);result.push([a[0]+t*(b[0]-a[0]),z])}}return result}
export function entrySpan(z){const xs=[];for(let i=0;i<plot.length;i++){const a=plot[i],b=plot[(i+1)%plot.length];if((a[1]<=z&&b[1]>z)||(b[1]<=z&&a[1]>z)){const t=(z-a[1])/(b[1]-a[1]);xs.push(a[0]+(b[0]-a[0])*t)}}return [MIRROR_X-Math.max(...xs)+.095,MIRROR_X-Math.min(...xs)-.095]}

export const SERVICE={kitchen:{x:.84,depth:.64,start:6.5,end:9.09,top:.9,sinkZ:8.77,sinkX:3.6,hobZ:7.35,mirrorAxis:5.45,returnLeft:2.48,returnDepth:.64,water:{x:2.25,z:8.78,rotation:0}},fridge:{x:.69,z:8.92,depth:.716,width:.912,height:1.78,sideClearance:.10,topClearance:.055,model:"Samsung RS62R5001M9"},dining:{x:3.08,z:6.90,width:.8,length:1.4,rotation:Math.PI/2},rear:{start:9.15,splitX:1.66,wcStart:11.15,end:13.02,entryX:2.05,bedDoorX:2.05,bedDoorZ:10.64,wcDoorX:1.15}};
export function stairUnderside(z){const start=STAIR.z+STAIR.width,end=start+(STAIR.middleRisers-1)*STAIR.middleTread;if(z>=end)return (STAIR.firstRisers+STAIR.middleRisers)*STAIR.rise-.18;const first=(STAIR.firstRisers+1)*STAIR.rise-.065-.12;return first+(z-start)*(STAIR.middleRisers-2)*STAIR.rise/(end-start)}

export const LIVING_MIRROR_AXIS=5.3;

export const REAR_FURNITURE={beds:[{x:4.1,z:10.0,width:1.4,length:2,rotation:-Math.PI/2},{x:4.1,z:12.2,width:1.4,length:2,rotation:-Math.PI/2}],wardrobe:{x:2.0,z:12.15,width:1.9,depth:.58,height:2.25,rotation:-Math.PI/2},cabinetEnd:9.501};

// Shared landing/opening geometry for the stair and the future upper-floor layout.
const rearTurnZ=STAIR.z+STAIR.width+(STAIR.middleRisers-1)*STAIR.middleTread;
const lastLandingX=STAIR.x+STAIR.width+(STAIR.lastRisers-1)*STAIR.tread;
export const UPPER={slabThickness:.18,guardHeight:1.05,landingStart:rearTurnZ,landingX:lastLandingX,hole:{left:STAIR.x,right:STAIR.x+STAIR.width,start:STAIR.z+STAIR.width+STAIR.middleTread,end:rearTurnZ+STAIR.landing},opening:[[STAIR.x,STAIR.z+STAIR.width+STAIR.middleTread],[STAIR.x+STAIR.width,STAIR.z+STAIR.width+STAIR.middleTread],[STAIR.x+STAIR.width,rearTurnZ],[lastLandingX+STAIR.landing,rearTurnZ],[lastLandingX+STAIR.landing,rearTurnZ+STAIR.landing],[STAIR.x,rearTurnZ+STAIR.landing]]};

// Visual alternative requested by owner: outward, small-radius porch corner.
// plot remains the original traced parcel; buildingPlot is the proposed envelope.
const corner=[.412,-.0206],radius=.24,arc=[];
for(let i=0;i<=16;i++){const a=-Math.PI/2-i*Math.PI/32;arc.push([corner[0]+radius+radius*Math.cos(a),corner[1]+radius+radius*Math.sin(a)])}
export const buildingPlot=[plot[0],...arc,plot[3],...plot.slice(4)];
export const SECOND={balconyEnd:1.45,masterEnd:6.0,smallStart:8.95,smallLeft:2.2,masterBath:{x1:.22,x2:1.95,z1:3.65,z2:5.95},smallBath:{x1:3.65,x2:5.25,z1:9.0,z2:10.9}};

// Owner's red/green sketch: front L-shaped master, rear compact room.
const masterFront=SECOND.balconyEnd+.08;
export const UPPER_LAYOUT={
 masterBoundary:[[entrySpan(5.3)[0],5.3],[3.15,5.3],[3.15,5.35],[3.15,6.3],[3.15,6.8],[entrySpan(6.8)[1],6.8]],
 smallBoundary:[[entrySpan(10.4)[0],10.4],[2.18,10.4],[3.4,10.4],[3.4,9.2],[entrySpan(9.2)[1],9.2]],
 masterPolygon:[[entrySpan(masterFront)[0],masterFront],[entrySpan(masterFront)[1],masterFront],[entrySpan(6.8)[1],6.8],[3.15,6.8],[3.15,5.3],[2.2,5.3],[entrySpan(5.3)[0],5.3]],
 smallPolygon:[[entrySpan(10.4)[0],10.4],[2.18,10.4],[3.4,10.4],[3.4,9.2],[entrySpan(9.2)[1],9.2],[entrySpan(13.08)[1],13.08],[entrySpan(13.08)[0],13.08]],
 deck:{x1:2.6,x2:5.12,z1:6.9,z2:9.08,height:.14},
 chairs:[{x:3.27,z:8.18,rotation:-.35,color:'#a4ad92'},{x:4.5,z:8.42,rotation:.55,color:'#d0b99d'}],
 fan:{x:2.92,z:8.85},
};

export const SMALL_SUITE={
 bath:{left:.24,right:1.74,front:10.45,back:13.08,doorStart:10.78,doorWidth:.75},
 vanity:{x:.64,z:10.76,width:.65,depth:.43},
 bed:{x:3.15,z:11.88,width:1.4,length:2,rotation:Math.PI},
 wardrobe:{x:4.28,z:9.59,width:1.6,depth:.58,height:2.55},
 desk:{x:4.96,z:10.38,width:.72,depth:.4},
 window:{z:10.38,width:.7,sill:1.1,head:2.4},
 balcony:{innerX:4.57,front:11.05,back:12.85,doorStart:11.43,doorWidth:.86},
};

const SB=SMALL_SUITE.balcony;
UPPER_LAYOUT.smallPolygon=[[entrySpan(10.4)[0],10.4],[2.18,10.4],[3.4,10.4],[3.4,9.2],[entrySpan(9.2)[1],9.2],[entrySpan(SB.front)[1],SB.front],[SB.innerX,SB.front],[SB.innerX,SB.back],[entrySpan(SB.back)[1],SB.back],[entrySpan(13.08)[1],13.08],[entrySpan(13.08)[0],13.08]];
export const SMALL_BALCONY=[[SB.innerX,SB.front],[entrySpan(SB.front)[1],SB.front],[entrySpan(SB.back)[1],SB.back],[SB.innerX,SB.back]];

export const MASTER_SUITE={
 balcony:{splitX:2.65,depth:1.45},
 frontWindow:{x:1.36,centers:[.755,2.015],width:2.08/3,sill:.65,head:2.95},
 bath:{left:.22,right:2.2,front:3.65,back:5.25,doorStart:3.73,doorWidth:.75,doorAxis:"right"},
 bed:{x:1.34,z:2.36,width:1.8,length:2,rotation:Math.PI/2},
 pc:{x:1.36,z:.43,width:1.85,depth:.6,chairZ:.565},
 shower:{left:.27,right:1.27,front:3.72,back:5.18},
 nightstands:{x:.55,zs:[1.26,3.46],width:.26,depth:.34,height:.47},
 washbasin:{x:2.87,z:5.025,length:1.1,depth:.45,outside:true,niche:{left:2.25,right:3.5,front:3.7,back:5.25}},
 wardrobe:{x:4.97,z:5.47,width:1.3,depth:.58,height:2.55},
 tv:{x:4.85,z:2.36,length:1.75,depth:.42},
 ventilationWindow:{z:4,width:.65,sill:1.9,head:2.55},
 commonWindow:{z:7.5,width:1.1,sill:.95,head:2.5},
};
function clipDesignRight(poly,x){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];if(a[0]>=x)out.push(a);if((a[0]>=x)!==(b[0]>=x)){const t=(x-a[0])/(b[0]-a[0]);out.push([x,a[1]+t*(b[1]-a[1])])}}return out}
export const MASTER_BALCONY=clipDesignRight(clipAtZ(buildingPlot,MASTER_SUITE.balcony.depth,true).map(toWorld),MASTER_SUITE.balcony.splitX);
// Reclaim the former left two-thirds of the balcony as enclosed master floor.
UPPER_LAYOUT.masterPolygon=[[.1,.15],[MASTER_SUITE.balcony.splitX-.05,.15],[MASTER_SUITE.balcony.splitX-.05,1.53],[entrySpan(1.53)[1],1.53],[entrySpan(6.8)[1],6.8],[3.15,6.8],[3.15,5.3],[2.2,5.3],[entrySpan(5.3)[0],5.3]];

export const THIRD={
 frontEnd:6.5,rearStart:10.72,
 enclosure:{front:6.5,back:10.72,right:5.2,height:3.05,roofThickness:.16,roofSlope:.015,frontDoor:{left:.6,width:4.2,height:2.5,kind:'folding'},rearDoor:{left:3.4,width:.95}},
 prayer:{left:1.25,right:5.2,front:6.5,back:9.15,sideDoorStart:8,sideDoorWidth:.9,height:3.05,rearWallLeft:1.25,rearWallRight:4.0,altarX:2.625,altarZ:8.7,buddhaZ:7.99,ancestor:{width:1.53,depth:.61,height:1.07},buddhist:{width:1.27,depth:.61,height:1.27},screen:{x:4.0,z1:7.70,z2:9.15,height:1.65}},
 laundry:{x1:.28,x2:1.85,z1:10.64,z2:11.77,roofHeight:2.55,machines:[{x:.7,z:11.145,rotation:Math.PI,kind:'washer'},{x:1.4,z:11.145,rotation:Math.PI,kind:'dryer'}],machineWidth:.6,machineDepth:.65},
 handwash:{x:4.7,z:12.61,width:.8,depth:.6,height:.59},
 drying:{left:2.15,right:3.85,front:11.5,back:12.8,height:1.9},
 terrace:{tableX:3.5,tableZ:3.45,parapet:.58,rail:.57,deck:{left:2.3,right:4.85,front:2.1,back:4.85}},
};

// Split air-conditioning locations in design coordinates; right is from the front yard looking in.
export const BEDROOM_AC=[
 {id:'master',indoor:{x:entrySpan(3.1)[1]-.195,z:3.1,y:2.63,width:.88,height:.29,depth:.21,rotation:Math.PI/2},outdoor:{z:3.1,y:2.43,width:.82,height:.6,depth:.32,gap:.15},pipeZ:3.1,drain:{x:2.94,z:3.76},airflow:'across-foot-end'},
 {id:'phong_nho',indoor:{x:entrySpan(9.6)[1]-.195,z:9.6,y:2.63,width:.8,height:.29,depth:.21,rotation:Math.PI/2},outdoor:{z:9.45,y:2.43,width:.82,height:.6,depth:.32,gap:.15},pipeZ:9.45,drain:{x:1.68,z:10.68},airflow:'across-foot-end'},
];
