import {shellSides,shellRightAt,prayerInteriorOutline} from './building-joints.js';
import {GROUND,STAIR,SERVICE,entrySpan,clipAtZ,plot,toWorld,buildingPlot,SECOND,UPPER,UPPER_LAYOUT,SMALL_SUITE,MASTER_SUITE,MASTER_BALCONY,SMALL_BALCONY,THIRD} from './design.js';
const r=SERVICE.rear;
const dry=MASTER_SUITE.washbasin.niche;
const masterDryPoints=[[dry.left,dry.front],[dry.right,dry.front],[dry.right,dry.back],[dry.left,dry.back]];
const strip=(a,b)=>{const [l0,r0]=entrySpan(a),[l1,r1]=entrySpan(b);return [[l0,a],[r0,a],[r1,b],[l1,b]]};
const right0=entrySpan(r.start+.05)[1],right1=entrySpan(r.end)[1];
export const measuredRooms=[
 {name:'Hiên',points:clipAtZ(buildingPlot,GROUND.glassLine,true).map(toWorld),note:'Theo đường bao sân, gồm phần bậc vào nhà'},
 {name:'Phòng khách',points:strip(GROUND.glassLine+.05,STAIR.z),note:'Khu mở, tính đến đầu cầu thang'},
 {name:'Bếp · ăn · thang',points:strip(STAIR.z,r.start-.05),note:'Diện tích khu chung, gồm thang và tủ'},
 {name:'Sảnh · lavabo',points:[[entrySpan(r.start+.05)[0],r.start+.05],[r.entryX-.05,r.start+.05],[r.entryX-.05,r.wcStart-.05],[entrySpan(r.wcStart-.05)[0],r.wcStart-.05]],note:'Lối vào WC và phòng ngủ'},
 {name:'WC',points:[[entrySpan(r.wcStart+.05)[0],r.wcStart+.05],[r.splitX-.05,r.wcStart+.05],[r.splitX-.05,r.end],[entrySpan(r.end)[0],r.end]],note:'Kích thước lọt lòng'},
 {name:'Phòng ông bà',points:[[r.entryX+.05,r.start+.05],[right0,r.start+.05],[right1,r.end],[r.splitX+.05,r.end],[r.splitX+.05,r.wcStart+.05],[r.entryX+.05,r.wcStart+.05]],note:'Hai giường 1,40 × 2,00 m; khe giữa giường 0,72 m, lối cuối giường hơn 0,90 m'}
];
export const upperRooms=[
 {name:'Ban công',points:MASTER_BALCONY,note:'Vách bên trái gióng theo vách WC/lối vào, rộng hơn 30 cm'},
 {name:'Master',points:UPPER_LAYOUT.masterPolygon,holes:[[[MASTER_SUITE.bath.left,MASTER_SUITE.bath.front],[MASTER_SUITE.bath.right,MASTER_SUITE.bath.front],[MASTER_SUITE.bath.right,MASTER_SUITE.bath.back],[MASTER_SUITE.bath.left,MASTER_SUITE.bath.back]],masterDryPoints],note:'Gồm phần ban công cũ nhập vào phòng; đã trừ WC và hốc lavabo'},
 {name:'WC master',points:[[MASTER_SUITE.bath.left,MASTER_SUITE.bath.front+.05],[MASTER_SUITE.bath.right-.05,MASTER_SUITE.bath.front+.05],[MASTER_SUITE.bath.right-.05,MASTER_SUITE.bath.back],[MASTER_SUITE.bath.left,MASTER_SUITE.bath.back]],note:'WC riêng bên trái cửa vào; cửa lùa'},
 {name:'Lavabo master',points:masterDryPoints,note:'Khu khô mở vào phòng ngủ, tách khỏi phòng tắm và bồn cầu'},
 {name:'Ban công phòng nhỏ',points:SMALL_BALCONY,note:'Loggia lõm trong ranh đất, cửa lùa và chậu cây nhỏ'},
 {name:'Phòng nhỏ',points:UPPER_LAYOUT.smallPolygon,holes:[[[SMALL_SUITE.bath.left,SMALL_SUITE.bath.front],[SMALL_SUITE.bath.right,SMALL_SUITE.bath.front],[SMALL_SUITE.bath.right,SMALL_SUITE.bath.back],[SMALL_SUITE.bath.left,SMALL_SUITE.bath.back]]],note:'Giường 1,40 × 2,00 m; đã trừ khu WC, chưa trừ đồ đạc'},
 {name:'WC phòng nhỏ',points:[[SMALL_SUITE.bath.left,SMALL_SUITE.bath.front],[SMALL_SUITE.bath.right-.05,SMALL_SUITE.bath.front],[SMALL_SUITE.bath.right-.05,SMALL_SUITE.bath.back],[SMALL_SUITE.bath.left,SMALL_SUITE.bath.back]],note:'Tắm, bồn cầu, lavabo; cửa lùa trong phòng'},
 {name:'Bục gỗ',points:[[UPPER_LAYOUT.deck.x1,UPPER_LAYOUT.deck.z1],[UPPER_LAYOUT.deck.x2,UPPER_LAYOUT.deck.z1],[UPPER_LAYOUT.deck.x2,UPPER_LAYOUT.deck.z2],[UPPER_LAYOUT.deck.x1,UPPER_LAYOUT.deck.z2]],note:'Cao 14 cm; sảnh đi lại bên trái giữ nguyên cao độ sàn'}
];
const R=THIRD.prayer,L=THIRD.laundry,E=THIRD.enclosure;
const enclosedOutline=[...shellSides[0].map(([x,z])=>[x+.09,Math.max(E.front+.06,Math.min(E.back-.06,z))]),...shellSides[1].toReversed().map(([x,z])=>[x-.09,Math.max(E.front+.06,Math.min(E.back-.06,z))])];
const prayerOutline=prayerInteriorOutline;
export const roofRooms=[
 {name:'Sân thượng trước',points:clipAtZ(buildingPlot,THIRD.frontEnd,true).map(toWorld),note:'Tường thấp + lan can phủ cây rủ; giữa sân để thoáng'},
 {name:'Sảnh · thang có mái',points:enclosedOutline,holes:[[[R.left-.06,R.front+.06],[shellRightAt(R.front)-.09,R.front+.06],...shellSides[1].filter(v=>v[1]>R.front&&v[1]<R.back).map(([x,z])=>[x-.09,z]),[shellRightAt(R.back)-.09,R.back+.06],[R.left-.06,R.back+.06]]],note:'Cùng khối chuồng cu với phòng thờ; diện tích gồm hình chiếu ô thang'},
 {name:'Phòng thờ',points:prayerOutline,note:'Bàn thờ quay về trước nhà; cửa bên hông từ sảnh thang'},
 {name:'Sân sau',points:clipAtZ(buildingPlot,THIRD.rearStart,false).map(toWorld),note:'Giặt tay và giàn phơi lộ thiên; máy có mái đưa riêng'},
 {name:'Mái che hai máy',points:[[L.x1,L.z1],[L.x2,L.z1],[L.x2,L.z2],[L.x1,L.z2]],note:'Mái đưa ngắn từ chuồng cu, chỉ che hai máy bên trái'},
];
const fmt=n=>n.toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:2});
export function roomMetrics(points,holes=[]){const xs=points.map(p=>p[0]),zs=points.map(p=>p[1]);return {area:Math.abs(points.reduce((a,p,i)=>{const q=points[(i+1)%points.length];return a+p[0]*q[1]-q[0]*p[1]},0))/2-holes.reduce((sum,h)=>sum+roomMetrics(h).area,0),width:Math.max(...xs)-Math.min(...xs),depth:Math.max(...zs)-Math.min(...zs)}}
// Corners follow each polygon's winding, including reflex (concave) corners.
export function polygonDimensions(points){
 const signed=points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1]},0);
 return points.map((p,i)=>{const prev=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length];
  const a=[p[0]-prev[0],p[1]-prev[1]],b=[next[0]-p[0],next[1]-p[1]];
  const turn=Math.atan2(a[0]*b[1]-a[1]*b[0],a[0]*b[0]+a[1]*b[1]);
  return {point:p,next,length:Math.hypot(...b),angle:180-turn*180/Math.PI*Math.sign(signed),label:String.fromCharCode(65+i)};
 });
}
const pathOf=(points,x,y)=>'M '+points.map(p=>`${x(p[0])},${y(p[1])}`).join(' L ')+' Z';
function inside(p,poly){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit}return hit}
function labelPoint(room){
 // Largest clear patch, rather than bounding-box centre (which can lie in a WC).
 let best=room.points[0],score=-1;const m=roomMetrics(room.points),minX=Math.min(...room.points.map(p=>p[0])),minZ=Math.min(...room.points.map(p=>p[1]));
 for(let ix=1;ix<36;ix++)for(let iz=1;iz<60;iz++){const p=[minX+m.width*ix/36,minZ+m.depth*iz/60];if(!inside(p,room.points)||(room.holes||[]).some(h=>inside(p,h)))continue;
 let d=Infinity;for(const ring of [room.points,...(room.holes||[])])for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length],vx=b[0]-a[0],vz=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*vx+(p[1]-a[1])*vz)/(vx*vx+vz*vz)));d=Math.min(d,Math.hypot(p[0]-a[0]-t*vx,p[1]-a[1]-t*vz))}if(d>score){score=d;best=p}}
 return best;
}
function detailDrawing(points,color,title,holes=[]){
 const m=roomMetrics(points),minX=Math.min(...points.map(p=>p[0])),maxZ=Math.max(...points.map(p=>p[1]));
 const scale=Math.min(220/m.width,270/m.depth),w=m.width*scale+110,h=m.depth*scale+110;
 const x=n=>55+(n-minX)*scale,y=n=>55+(maxZ-n)*scale,dims=polygonDimensions(points);
 const signed=points.reduce((s,p,i)=>{const q=points[(i+1)%points.length];return s+p[0]*q[1]-q[0]*p[1]},0);
 const lines=dims.map((d,i)=>{const a=[x(d.point[0]),y(d.point[1])],b=[x(d.next[0]),y(d.next[1])],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=-dy/len*Math.sign(signed),ny=dx/len*Math.sign(signed),offset=23;
 let angle=Math.atan2(dy,dx)*180/Math.PI;if(angle>90)angle-=180;if(angle<-90)angle+=180;
 const tx=(a[0]+b[0])/2+nx*offset,ty=(a[1]+b[1])/2+ny*offset;
 const showCorner=len>34||dims[(i+dims.length-1)%dims.length].length*scale>34;
 return `<g class="plan-dimension">${len>34?`<path d="M ${a[0]+nx*5} ${a[1]+ny*5} L ${a[0]+nx*28} ${a[1]+ny*28} M ${b[0]+nx*5} ${b[1]+ny*5} L ${b[0]+nx*28} ${b[1]+ny*28} M ${a[0]+nx*18} ${a[1]+ny*18} L ${b[0]+nx*18} ${b[1]+ny*18}"/>`: ''}${len>34?`<text x="${tx}" y="${ty}" transform="rotate(${angle} ${tx} ${ty})">${fmt(d.length)}</text>`:''}${showCorner?`<circle cx="${a[0]}" cy="${a[1]}" r="8"/><text class="plan-corner" x="${a[0]}" y="${a[1]+.5}">${d.label}</text>`:''}</g>`;
 }).join('');
 return `<div class="room-detail-drawing"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}: kích thước từng cạnh"><path d="${pathOf(points,x,y)}" fill="${color}" stroke="#717a68" stroke-width="1.2"/>${holes.map(h=>`<path d="${pathOf(h,x,y)}" fill="#f6f6ef" stroke="#87917e" stroke-dasharray="3 3"/>`).join('')}${lines}</svg></div><table class="dimension-table"><thead><tr><th>Cạnh</th><th>Dài (m)</th><th>Góc tại đỉnh</th></tr></thead><tbody>${dims.map((d,i)=>`<tr><td>${d.label}–${dims[(i+1)%dims.length].label}</td><td>${fmt(d.length)}</td><td>${d.label} · ${d.angle.toLocaleString('vi-VN',{maximumFractionDigits:1})}°</td></tr>`).join('')}</tbody></table>`;
}
export function createRoomPlan(floor=0){
 const rooms=floor===2?roofRooms:floor===1?upperRooms:measuredRooms,el=document.createElement('section');el.id='room-measure-plan';el.hidden=true;el.tabIndex=0;el.setAttribute('aria-label','Mặt bằng kích thước các phòng');
 const colors=['#ddd6c6','#dce5cd','#e6dccd','#e2e7df','#cbdedb','#ded6e5','#d8ddd2','#e7dfd4'];
 // Same scale on both axes: the drawing and the angle measurements agree.
 const x=n=>35+n*43,y=n=>610-n*43;
 const zones=rooms.map((room,i)=>{const p=labelPoint(room);return `<g><path d="${[room.points,...(room.holes||[])].map(poly=>pathOf(poly,x,y)).join(' ')}" fill-rule="evenodd" fill="${colors[i]}" stroke="#717a68" stroke-width="1"/><circle cx="${x(p[0])}" cy="${y(p[1])}" r="10" fill="#f6f6ef"/><text x="${x(p[0])}" y="${y(p[1])+3.5}" class="plan-zone-title">${i+1}</text></g>`}).join('');
 el.innerHTML=`<div class="measure-overview"><header><h3>Mặt bằng kích thước</h3><p>Mét · Góc theo mô hình hiện tại</p></header><div class="measure-drawing"><svg viewBox="0 20 310 640" role="img" aria-label="Mặt bằng đúng tỉ lệ, sân ở dưới, cuối nhà ở trên">${zones}<path d="M 45 640 H 131 M45 635 V645 M88 635 V645 M131 635 V645" stroke="#617151" fill="none"/><text x="88" y="628" class="plan-zone-size">2 m</text><text x="224" y="640" class="plan-zone-size">↑ Cuối nhà · Sân ↓</text></svg></div><ol class="measure-legend">${rooms.map((room,i)=>`<li><a href="#room-detail-${floor}-${i}"><span class="measure-index" style="background:${colors[i]}">${i+1}</span><span>${room.name}</span><strong>${fmt(roomMetrics(room.points,room.holes).area)} m²</strong></a></li>`).join('')}</ol></div><div class="measure-summary"><h3>Từng cạnh & góc</h3><p class="measure-intro">Chạm tên phòng để xem chi tiết. A–B là cạnh nối hai đỉnh; góc ghi tại đỉnh A.</p>${rooms.map((room,i)=>{const m=roomMetrics(room.points,room.holes);return `<article class="room-dimension-card" id="room-detail-${floor}-${i}"><header><span class="measure-index" style="background:${colors[i]}">${i+1}</span><h4>${room.name}</h4><strong>${fmt(m.area)} m²</strong></header><p class="room-bounds">Khung bao ${fmt(m.width)} × ${fmt(m.depth)} m</p>${detailDrawing(room.points,colors[i],room.name,room.holes)}${(room.holes||[]).map(h=>`<details><summary>Ranh khu trừ diện tích</summary>${detailDrawing(h,'#eeeae1','Khu trừ diện tích')}</details>`).join('')}<p class="measure-intro">${room.note}</p></article>`}).join('')}<p class="measure-footnote">Các góc tính từ mô hình dựng theo ảnh thửa đất, chưa phải số liệu đo đạc thi công. Góc lõm có thể lớn hơn 180°. Mỗi đoạn bo được đo theo đoạn thẳng của đa giác. Diện tích đã trừ các khu riêng; khung bao chưa trừ góc lõm, chưa trừ đồ đạc.</p></div>`;
 return el;
}
