import {GROUND,STAIR,SERVICE,entrySpan,clipAtZ,plot,toWorld,buildingPlot,SECOND,UPPER,UPPER_LAYOUT,SMALL_SUITE,MASTER_SUITE,MASTER_BALCONY,THIRD} from './design.js';
const r=SERVICE.rear;
const strip=(a,b)=>{const [l0,r0]=entrySpan(a),[l1,r1]=entrySpan(b);return [[l0,a],[r0,a],[r1,b],[l1,b]]};
const right0=entrySpan(r.start+.05)[1],right1=entrySpan(r.end)[1];
export const measuredRooms=[
 {name:'Hiên',points:clipAtZ(buildingPlot,GROUND.glassLine,true).map(toWorld),note:'Theo đường bao sân, gồm phần bậc vào nhà'},
 {name:'Phòng khách',points:strip(GROUND.glassLine+.05,STAIR.z),note:'Khu mở, tính đến đầu cầu thang'},
 {name:'Bếp · ăn · thang',points:strip(STAIR.z,r.start-.05),note:'Diện tích khu chung, gồm thang và tủ'},
 {name:'Sảnh · lavabo',points:[[entrySpan(r.start+.05)[0],r.start+.05],[r.entryX-.05,r.start+.05],[r.entryX-.05,r.wcStart-.05],[entrySpan(r.wcStart-.05)[0],r.wcStart-.05]],note:'Lối vào WC và phòng ngủ'},
 {name:'WC',points:[[entrySpan(r.wcStart+.05)[0],r.wcStart+.05],[r.splitX-.05,r.wcStart+.05],[r.splitX-.05,r.end],[entrySpan(r.end)[0],r.end]],note:'Kích thước lọt lòng'},
 {name:'Phòng ông bà',points:[[r.entryX+.05,r.start+.05],[right0,r.start+.05],[right1,r.end],[r.splitX+.05,r.end],[r.splitX+.05,r.wcStart+.05],[r.entryX+.05,r.wcStart+.05]],note:'Có góc lõm; ngang ghi theo khoảng hẹp–rộng'}
];
export const upperRooms=[
 {name:'Ban công',points:MASTER_BALCONY,note:'Chỉ giữ khoảng 1/3 bề ngang phía trước, bên phải'},
 {name:'Master',points:UPPER_LAYOUT.masterPolygon,holes:[[[MASTER_SUITE.bath.left,MASTER_SUITE.bath.front],[MASTER_SUITE.bath.right,MASTER_SUITE.bath.front],[MASTER_SUITE.bath.right,MASTER_SUITE.bath.back],[MASTER_SUITE.bath.left,MASTER_SUITE.bath.back]]],note:'Gồm phần ban công cũ nhập vào phòng; đã trừ WC'},
 {name:'WC master',points:[[MASTER_SUITE.bath.left,MASTER_SUITE.bath.front+.05],[MASTER_SUITE.bath.right-.05,MASTER_SUITE.bath.front+.05],[MASTER_SUITE.bath.right-.05,MASTER_SUITE.bath.back],[MASTER_SUITE.bath.left,MASTER_SUITE.bath.back]],note:'WC riêng bên trái cửa vào; cửa lùa'},
 {name:'Phòng nhỏ',points:UPPER_LAYOUT.smallPolygon,holes:[[[SMALL_SUITE.bath.left,SMALL_SUITE.bath.front],[SMALL_SUITE.bath.right,SMALL_SUITE.bath.front],[SMALL_SUITE.bath.right,SMALL_SUITE.bath.back],[SMALL_SUITE.bath.left,SMALL_SUITE.bath.back]]],note:'Giường 1,40 × 2,00 m; đã trừ khu WC, chưa trừ đồ đạc'},
 {name:'WC phòng nhỏ',points:[[SMALL_SUITE.bath.left,SMALL_SUITE.bath.front],[SMALL_SUITE.bath.right-.05,SMALL_SUITE.bath.front],[SMALL_SUITE.bath.right-.05,SMALL_SUITE.bath.back],[SMALL_SUITE.bath.left,SMALL_SUITE.bath.back]],note:'Tắm, bồn cầu, lavabo; cửa lùa trong phòng'},
 {name:'Bục gỗ',points:[[UPPER_LAYOUT.deck.x1,UPPER_LAYOUT.deck.z1],[UPPER_LAYOUT.deck.x2,UPPER_LAYOUT.deck.z1],[UPPER_LAYOUT.deck.x2,UPPER_LAYOUT.deck.z2],[UPPER_LAYOUT.deck.x1,UPPER_LAYOUT.deck.z2]],note:'Cao 14 cm; sảnh đi lại bên trái giữ nguyên cao độ sàn'}
];
const R=THIRD.prayer,L=THIRD.laundry;
export const roofRooms=[
 {name:'Sân thượng trước',points:clipAtZ(buildingPlot,THIRD.frontEnd,true).map(toWorld),note:'Tường thấp + lan can, cây và bàn ghế'},
 {name:'Phòng thờ',points:[[R.left+.06,R.front+.06],[R.right-.06,R.front+.06],[R.right-.06,R.back-.06],[R.left+.06,R.back-.06]],note:'Bàn thờ quay về trước nhà; cửa bên hông từ sảnh thang'},
 {name:'Sân sau',points:clipAtZ(buildingPlot,THIRD.rearStart,false).map(toWorld),note:'Giặt tay và giàn phơi; gồm vùng máy có mái che'},
 {name:'Mái che giặt–sấy',points:[[L.x1,L.z1],[L.x2,L.z1],[L.x2,L.z2],[L.x1,L.z2]],note:'Nằm trong sân sau; không cộng trùng vào tổng diện tích'},
];
const fmt=n=>n.toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:2});
export function roomMetrics(points,holes=[]){const xs=points.map(p=>p[0]),zs=points.map(p=>p[1]);return {area:Math.abs(points.reduce((a,p,i)=>{const q=points[(i+1)%points.length];return a+p[0]*q[1]-q[0]*p[1]},0))/2-holes.reduce((sum,h)=>sum+roomMetrics(h).area,0),width:Math.max(...xs)-Math.min(...xs),depth:Math.max(...zs)-Math.min(...zs)}}
export function createRoomPlan(floor=0){const rooms=floor===2?roofRooms:floor===1?upperRooms:measuredRooms;const el=document.createElement('section');el.id='room-measure-plan';el.hidden=true;el.setAttribute('aria-label','Mặt bằng kích thước các phòng');
 const colors=['#ddd6c6','#dce5cd','#e6dccd','#e2e7df','#cbdedb','#ded6e5','#d8ddd2'];
 const x=n=>35+n*43,y=n=>610-n*40,frontDepth=floor===2?THIRD.frontEnd:floor===1?SECOND.balconyEnd:GROUND.glassLine,frontName=floor===2?'Sân trước':floor===1?'Ban công':'Hiên';
 const zones=rooms.map((room,i)=>{const m=roomMetrics(room.points,room.holes);room.metrics=m;const cx=(Math.min(...room.points.map(p=>p[0]))+Math.max(...room.points.map(p=>p[0])))/2,cz=(Math.min(...room.points.map(p=>p[1]))+Math.max(...room.points.map(p=>p[1])))/2;return `<g><path d="${[room.points,...(room.holes||[])].map(poly=>'M '+poly.map(p=>`${x(p[0])},${y(p[1])}`).join(' L ')+' Z').join(' ')}" fill-rule="evenodd" fill="${colors[i]}" stroke="#717a68" stroke-width="1"/><text x="${x(cx)}" y="${y(cz)-7}" class="plan-zone-title">${i+1}. ${room.name}</text><text x="${x(cx)}" y="${y(cz)+10}" class="plan-zone-size">${fmt(m.area)} m²</text></g>`}).join('');
 el.innerHTML=`<div class="measure-drawing"><svg viewBox="0 50 330 610" role="img" aria-label="Mặt bằng chia khu theo tỉ lệ, sân ở dưới, cuối nhà ở trên"><defs><marker id="measure-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#617151"/></marker></defs>${zones}<path d="M 290 ${y(frontDepth)} H 305 V ${y(0)} H 290" fill="none" stroke="#617151"/><text x="316" y="${y(frontDepth/2)}" transform="rotate(-90 316 ${y(frontDepth/2)})" class="plan-zone-size">${frontName} ${fmt(frontDepth)} m</text><path d="M 45 640 H 131" stroke="#617151" stroke-width="2"/><path d="M45 635 V645 M88 635 V645 M131 635 V645" stroke="#617151"/><text x="88" y="628" class="plan-zone-size">2 m</text><text x="200" y="640" class="plan-zone-size">↑ Cuối nhà · Sân ↓</text></svg></div><div class="measure-summary"><h3>Kích thước phòng</h3><p class="measure-intro">Mét · Diện tích sàn theo bố trí hiện tại</p>${rooms.map((room,i)=>`<article><span class="measure-index" style="background:${colors[i]}">${i+1}</span><div><h4>${room.name}</h4><p>${fmt(room.metrics.width)} × ${fmt(room.metrics.depth)} m <strong>${fmt(room.metrics.area)} m²</strong></p><small>${room.note}</small></div></article>`).join('')}<p class="measure-footnote">Ngang × sâu là khung bao lớn nhất. Diện tích tính theo đa giác thực, chưa trừ đồ đạc. Các khu mở chia theo ranh giới bố trí, không phải tường mới.</p></div>`;
 return el;
}
