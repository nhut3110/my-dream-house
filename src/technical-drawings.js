import * as T from 'three';
import {plot,buildingPlot,toWorld,HEIGHT,GROUND,STAIR,THIRD,UPPER,MIRROR_X} from './design.js';
import {measuredRooms,upperRooms,roofRooms,roomMetrics,polygonDimensions,labelPoint} from './room-plan.js';
import {fanStepPolygon} from './stair-entry.js';
import {SITE} from './site-plan.js';
import {columnPlan,STRUCTURE} from './structure-plan.js';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const mm=n=>String(Math.round(n*1000));
const dec=n=>n.toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:2});
const floorRooms=[measuredRooms,upperRooms,roofRooms];
const text=(x,y,s,size=2.5,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${esc(s)}</text>`;
const line=(x,y,a,b,extra='')=>`<path d="M${x} ${y}L${a} ${b}" ${extra}/>`;
const path=pts=>'M'+pts.map(p=>p.join(' ')).join('L')+'Z';
const ticks=(a,b)=>line(a-1,b+1,a+1,b-1);
function dimension(a,b,offset,label){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(len<.01)return '';
 const nx=-dy/len,ny=dx/len,p=[a[0]+nx*offset,a[1]+ny*offset],q=[b[0]+nx*offset,b[1]+ny*offset];
 let angle=Math.atan2(dy,dx)*180/Math.PI;if(angle>90)angle-=180;if(angle<-90)angle+=180;
 const x=(p[0]+q[0])/2,y=(p[1]+q[1])/2;
 return `<g stroke="#333" stroke-width=".16" fill="none">${line(...a,p[0]+nx*2,p[1]+ny*2)}${line(...b,q[0]+nx*2,q[1]+ny*2)}${line(...p,...q)}${ticks(...p)}${ticks(...q)}</g><g transform="translate(${x} ${y}) rotate(${angle})"><rect x="-7" y="-3.5" width="14" height="3.8" fill="white"/>${text(0,-.8,label,2.4,'text-anchor="middle"')}</g>`;
}
export function triangleCut(vertices,axis,value){
 const out=[];for(let i=0;i<3;i++){const a=vertices[i],b=vertices[(i+1)%3],da=a[axis]-value,db=b[axis]-value;
  if(Math.abs(da)<1e-8&&Math.abs(db)<1e-8)continue;
  if((da<0&&db<0)||(da>0&&db>0)||Math.abs(da-db)<1e-10)continue;
  const t=da/(da-db);if(t<0||t>1)continue;const p=a.map((v,j)=>v+(b[j]-v)*t);
  if(!out.some(q=>Math.hypot(...p.map((v,j)=>v-q[j]))<1e-7))out.push(p);
 }
 return out.length===2&&Math.hypot(...out[0].map((v,j)=>v-out[1][j]))>1e-6?out:null;
}
// Real mesh/plane intersections, independent of camera projection and zoom.
export function sliceModel(root,axis,value){
 const segments=[],seen=new Set(),v=new T.Vector3(),bounds=new T.Box3();root.updateMatrixWorld(true);
 root.traverseVisible(mesh=>{if(!mesh.isMesh||mesh.isSkinnedMesh)return;const geo=mesh.geometry;if(!geo.boundingBox)geo.computeBoundingBox();bounds.copy(geo.boundingBox).applyMatrix4(mesh.matrixWorld);
  const component=['x','y','z'][axis];if(value<bounds.min[component]-1e-7||value>bounds.max[component]+1e-7)return;
  const pos=geo.attributes.position,idx=geo.index,count=idx?idx.count:pos.count;
  for(let i=0;i<count;i+=3){const verts=[];for(let j=0;j<3;j++){v.fromBufferAttribute(pos,idx?idx.getX(i+j):i+j).applyMatrix4(mesh.matrixWorld);verts.push([v.x,v.y,v.z]);}
   const seg=triangleCut(verts,axis,value);if(!seg)continue;
   const key=seg.map(p=>p.map(n=>Math.round(n*1e5)).join(',')).sort().join('|');if(seen.has(key))continue;seen.add(key);segments.push(seg);
  }
 });return segments;
}
function frame(code,title,scale,body){
 return `<svg xmlns="http://www.w3.org/2000/svg" width="420mm" height="297mm" viewBox="0 0 420 297" role="img" aria-label="${esc(title)}"><style>text{font-family:Arial,sans-serif;fill:#171717}.outline{fill:none;stroke:#111;stroke-width:.35}</style><rect width="420" height="297" fill="white"/><rect x="15" y="8" width="397" height="280" fill="none" stroke="#111" stroke-width=".5"/>${text(22,17,'NHÀ 356/73 HOÀNG DIỆU · ĐÀ NẴNG',3.3)}${text(405,17,'PHƯƠNG ÁN · CHƯA DÙNG XIN PHÉP / THI CÔNG',2.4,'text-anchor="end"')}${body}<g stroke="#222" stroke-width=".2" fill="none"><rect x="222" y="255" width="190" height="33"/>${line(222,265,412,265)}${line(222,278,412,278)}${line(335,278,335,288)}${line(373,278,373,288)}</g>${text(225,261,'HỒ SƠ KIẾN TRÚC TỪ MÔ HÌNH · CHƯA THẨM TRA',2.5)}${text(225,272,title,3)}${text(225,284,`TỶ LỆ ${scale} · A3 · Đơn vị mm`,2.5)}${text(338,284,code,2.8)}${text(376,284,new Date().toLocaleDateString('vi-VN'),2.2)}${text(22,277,'±0,000 = sàn tầng 1; cao độ tính bằng m.',2.3)}${text(22,282,'Ranh đất truy từ ảnh; cần đo đạc và xác nhận pháp lý.',2.3)}${text(22,287,'Thiết kế / chủ trì / kiểm tra: chưa chỉ định, chưa ký.',2.3)}</svg>`;
}
function scaleBar(x,y,scale=20){return `<g stroke="#111" stroke-width=".3">${line(x,y,x+scale*2,y)}${[0,1,2].map(n=>line(x+n*scale,y-1.3,x+n*scale,y+1.3)).join('')}</g>${text(x,y-3,'0',2.3)}${text(x+scale,y-3,'1',2.3)}${text(x+scale*2,y-3,'2 m',2.3)}`;}
function planSheet(floor,segments,underlay=[]){
 // At 1:75, one model metre occupies exactly 13.333 mm on the paper.
 const s=1000/75,x=n=>38+n*s,y=n=>225-n*s,rooms=floorRooms[floor];
 let body=text(38,31,`MẶT BẰNG TẦNG ${floor+1} · CẮT +${(floor*HEIGHT+1.1).toFixed(2)} m`,3.5);
 body+=`<g fill="none" stroke="#999" stroke-width=".12">${underlay.map(seg=>line(x(seg[0][0]),y(seg[0][2]),x(seg[1][0]),y(seg[1][2]))).join('')}</g>`;
 body+=`<g fill="none" stroke="#111" stroke-width=".25">${segments.map(seg=>line(x(seg[0][0]),y(seg[0][2]),x(seg[1][0]),y(seg[1][2]))).join('')}</g>`;
 if(floor<2){
  const polygons=[];
  if(floor===0)for(let i=0;i<STAIR.firstRisers;i++)polygons.push(fanStepPolygon(i));
  else for(let i=0;i<STAIR.firstRisers;i++){const right=STAIR.x+STAIR.landing+(STAIR.firstRisers-1-i)*STAIR.tread,left=i===STAIR.firstRisers-1?STAIR.x:right-STAIR.tread;polygons.push([[left,STAIR.z],[right,STAIR.z],[right,STAIR.z+STAIR.width],[left,STAIR.z+STAIR.width]]);}
  for(let i=0;i<STAIR.middleRisers-1;i++){const z=STAIR.z+STAIR.width+i*STAIR.middleTread;polygons.push([[STAIR.x,z],[STAIR.x+STAIR.width,z],[STAIR.x+STAIR.width,z+STAIR.middleTread],[STAIR.x,z+STAIR.middleTread]]);}
  const rz=UPPER.landingStart;
  polygons.push([[STAIR.x,rz],[STAIR.x+STAIR.width,rz],[STAIR.x+STAIR.width,rz+STAIR.landing],[STAIR.x,rz+STAIR.landing]]);
  for(let i=0;i<STAIR.lastRisers-1;i++){const left=STAIR.x+STAIR.width+i*STAIR.tread,right=left+STAIR.tread;polygons.push([[left,rz],[right,rz],[right,rz+STAIR.landing],[left,rz+STAIR.landing]]);}
  body+=`<g fill="white" fill-opacity=".85" stroke="#444" stroke-width=".15">${polygons.map(poly=>`<path d="${path(poly.map(p=>{const q=toWorld(p);return [x(q[0]),y(q[1])]}))}"/>`).join('')}</g>`;
  body+=text(x(toWorld([STAIR.x+STAIR.width/2,0])[0]),y(STAIR.z+2),'LÊN ↑',2.2,'text-anchor="middle"');
 }
 const cutX=toWorld([STAIR.x+STAIR.width/2,0])[0];
 body+=line(x(cutX),y(0),x(cutX),y(13.2),'stroke="#666" stroke-width=".15" stroke-dasharray="5 1 1 1"')+text(x(cutX)+2,y(0)+5,'A',2.8)+text(x(cutX)+2,y(13.2)-2,'A',2.8);
 const raw=plot.map(p=>[x(p[0]),y(p[1])]);body+=`<path d="${path(raw)}" fill="none" stroke="#777" stroke-width=".18" stroke-dasharray="2 1"/>`;
 const minX=Math.min(...plot.map(p=>p[0])),maxX=Math.max(...plot.map(p=>p[0])),minZ=Math.min(...plot.map(p=>p[1])),maxZ=Math.max(...plot.map(p=>p[1]));
 body+=dimension([x(minX),y(minZ)],[x(maxX),y(minZ)],10,mm(maxX-minX))+dimension([x(maxX),y(minZ)],[x(maxX),y(maxZ)],9,mm(maxZ-minZ));
 body+=`<g fill="none" stroke="#888" stroke-width=".13" stroke-dasharray="3 1">${STRUCTURE.axes.map(z=>line(29,y(z),124,y(z))).join('')}</g>`;
 STRUCTURE.axes.forEach((z,i)=>{body+=`<circle cx="26" cy="${y(z)}" r="2.5" fill="white" stroke="#555" stroke-width=".2"/>`+text(26,y(z)+.8,i+1,2.5,'text-anchor="middle"');if(i)body+=dimension([119,y(STRUCTURE.axes[i-1])],[119,y(z)],8,mm(z-STRUCTURE.axes[i-1]));});
 const centres=rooms.map((r,i)=>{const p=labelPoint(r);return [x(toWorld(p)[0]),y(p[1]),i+1];});
 for(const [cx,cy,n]of centres)body+=`<circle cx="${cx}" cy="${cy}" r="3" fill="white" stroke="#111" stroke-width=".25"/>`+text(cx,cy+1,n,2.8,'text-anchor="middle"');
 body+=text(149,42,'KHÔNG GIAN / DIỆN TÍCH LỌT LÒNG',3);
 rooms.forEach((r,i)=>{body+=text(149,51+i*9,`${i+1}. ${r.name}`,2.9)+text(276,51+i*9,`${dec(roomMetrics(r.points,r.holes).area)} m²`,2.9,'text-anchor="end"');});
 const start=61+rooms.length*9;
 ['Cao độ sàn: '+(floor*HEIGHT).toFixed(3)+' m','Cột 250 × 250: chỉ minh hoạ, chưa tính chịu lực.','Trục 1–5: trục định vị theo phương dọc mô hình.','Nét đen: giao tuyến mô hình tại mặt cắt ngang.','Nét đứt: ranh đất gốc; phương án bo hiên lưu riêng.','Khoảng mở cửa theo mô hình, chưa có thống kê cửa.','Số tròn liên kết bảng cạnh / góc trong bộ hồ sơ.'].forEach((t,i)=>body+=text(149,start+i*6,t,2.5));
 body+=scaleBar(38,244,s)+text(149,240,'Phía trước / sân ở dưới bản vẽ; cuối nhà ở trên.',2.5);
 return {code:`KT-0${floor+2}`,title:`MẶT BẰNG TẦNG ${floor+1}`,svg:frame(`KT-0${floor+2}`,`MẶT BẰNG TẦNG ${floor+1}`,'1:75',body)};
}
function siteSheet(){
 const s=1000/100,x=n=>60+n*s,y=n=>212-n*s;
 let b=text(40,31,'RANH ĐẤT & ĐƯỜNG BAO PHƯƠNG ÁN',3.5);
 b+=`<path d="${path(buildingPlot.map(p=>[x(p[0]),y(p[1])]))}" fill="#eee" stroke="#111" stroke-width=".3"/><path d="${path(plot.map(p=>[x(p[0]),y(p[1])]))}" fill="none" stroke="#555" stroke-width=".2" stroke-dasharray="2 1"/>`;
 polygonDimensions(plot).forEach((d,i)=>{const a=[x(d.point[0]),y(d.point[1])],q=[x(d.next[0]),y(d.next[1])];b+=text(a[0]-2,a[1]-2,`P${i+1}`,2.5);if(d.length>.7)b+=dimension(a,q,-7,mm(d.length));});
 b+=text(160,42,'ĐỈNH / CẠNH / GÓC TRONG',3);
 polygonDimensions(plot).forEach((d,i)=>b+=text(160,51+i*7,`P${i+1} → P${(i+1)%plot.length+1}     ${mm(d.length)} mm     ${d.angle.toFixed(1)}°`,2.7));
 const notes=['Ranh gốc: truy từ ảnh sổ, chưa có toạ độ địa chính.','Đường bao bo hiên là phương án, chưa xác nhận ranh.','Chưa có chỉ giới xây dựng, khoảng lùi được phê duyệt.','Hẻm trước / bên là ước lượng, không dùng định vị pháp lý.','Thiếu sơ đồ vị trí có mốc / hướng Bắc khảo sát.','Cao độ đường minh hoạ: '+SITE.roadY.toFixed(3)+' m.','Hiên: '+GROUND.porchLevel.toFixed(3)+' m; nền trong: ±0,000.'];
 notes.forEach((t,i)=>b+=text(160,122+i*7,t,2.7));b+=scaleBar(60,244,s);
 return {code:'KT-01',title:'RANH ĐẤT / ĐỊNH VỊ SƠ BỘ',svg:frame('KT-01','RANH ĐẤT / ĐỊNH VỊ SƠ BỘ','1:100',b)};
}
function sectionSheet(segments,cutX){
 const s=1000/75,x=n=>42+n*s,y=n=>213-n*s;
 let b=text(42,31,`MẶT CẮT DỌC A–A · X MÔ HÌNH = ${mm(cutX)} mm`,3.5);
 b+=`<g fill="none" stroke="#111" stroke-width=".25">${segments.map(seg=>line(x(seg[0][2]),y(seg[0][1]),x(seg[1][2]),y(seg[1][1]))).join('')}</g>`;
 const heights=[SITE.roadY,0,HEIGHT,HEIGHT*2,HEIGHT*2+THIRD.enclosure.height];
 heights.forEach((h,i)=>{b+=line(37,y(h),235,y(h),'stroke="#aaa" stroke-width=".13" stroke-dasharray="2 1"')+text(239,y(h)+1,(h>=0?'+':'')+h.toFixed(3),2.8);if(i>1)b+=dimension([267,y(heights[i-1])],[267,y(h)],0,mm(h-heights[i-1]));});
 b+=text(291,48,'THANG / CAO ĐỘ',3);
 [`Sàn–sàn: ${mm(HEIGHT)} mm`,`Mỗi thang: ${STAIR.risers} cổ bậc`,`Cao cổ: ${(STAIR.rise*1000).toFixed(1)} mm`,`Rộng thang: ${mm(STAIR.width)} mm`,'Cụm bậc: 5 – 11 – 5','Chi tiết móng / dầm: chưa có.','Mặt cắt không thể hiện móng giả.','Mái / trụ chưa kiểm tra kết cấu.'].forEach((t,i)=>b+=text(291,58+i*7,t,2.7));
 b+=scaleBar(42,244,s);
 return {code:'KT-05',title:'MẶT CẮT DỌC A–A',svg:frame('KT-05','MẶT CẮT DỌC A–A','1:75',b)};
}
function scheduleSheets(){
 const sheets=[];
 floorRooms.forEach((rooms,floor)=>{
  const columns=[[]];let col=columns[0],context='';
  const push=row=>{if(col.length>=33){col=[];columns.push(col);if(!row.header)col.push({header:context+' · tiếp'});}col.push(row);};
  rooms.forEach((r,i)=>{const title=`${i+1}. ${r.name} · ${dec(roomMetrics(r.points,r.holes).area)} m²`;
   [r.points,...(r.holes||[])].forEach((ring,k)=>{
    context=title+(k?` · trừ ${k}`:'');
    if(col.length>30){col=[];columns.push(col);}
    push({header:context});
    polygonDimensions(ring).forEach((d,j)=>push({label:`${k?'H'+k+'-':''}${j+1} → ${(j+1)%ring.length+1}`,length:mm(d.length),angle:d.angle.toFixed(1)+'°',point:d.point.map(v=>v.toFixed(3)).join(' / ')}));
   });
  });
  for(let ci=0;ci<columns.length;ci+=2){let b=text(25,31,`BẢNG CẠNH & GÓC · TẦNG ${floor+1} · PHẦN ${ci/2+1}`,3.5);
   for(let k=0;k<2;k++){const x=25+k*194;b+=text(x,41,'CẠNH',2.4)+text(x+32,41,'DÀI (mm)',2.4)+text(x+65,41,'GÓC',2.4)+text(x+92,41,'X / Z THIẾT KẾ (m)',2.4);
    (columns[ci+k]||[]).forEach((row,j)=>{const y=48+j*5.8;if(row.header)b+=text(x,y,row.header,2.65,'font-weight="bold"');else b+=text(x,y,row.label,2.5)+text(x+32,y,row.length,2.5)+text(x+65,y,row.angle,2.5)+text(x+92,y,row.point,2.5);});
   }
   b+=text(25,248,'Thứ tự đỉnh theo vòng đa giác; X/Z là hệ thiết kế (gương với toạ độ thế giới 3D).',2.5);
   const code=`TK-${floor+1}-${ci/2+1}`;sheets.push({code,title:`CHI TIẾT KÍCH THƯỚC TẦNG ${floor+1}`,svg:frame(code,`CHI TIẾT KÍCH THƯỚC TẦNG ${floor+1}`,'BẢNG SỐ',b)});
  }
 });return sheets;
}
export function createDrawingSet({plans,section,cutX,elevations=[],underlays=[]}){
 const missing=['Đo hiện trạng, toạ độ pháp lý, chỉ giới / khoảng lùi, hướng Bắc.','Khảo sát nền đất; tính móng, dầm, cột, sàn và cốt thép.','Thiết kế cấp điện, cấp nước, thoát nước và điểm đấu nối.','Thống kê cửa, chi tiết cấu tạo, chống thấm, thông gió / PCCC khi yêu cầu.','Cam kết an toàn nhà liền kề; hồ sơ đất và đơn xin phép.','Đơn vị thiết kế, người chủ trì / kiểm tra, ký và xác nhận hồ sơ.'];
 let b=text(25,33,'DANH MỤC BẢN VẼ / TÌNH TRẠNG HỒ SƠ',4);
 const rest=[siteSheet(),...plans.map((p,i)=>planSheet(i,p,underlays[i])),sectionSheet(section,cutX),...elevations,...scheduleSheets()];
 rest.forEach((sheet,i)=>b+=text(25,45+i*7,`${sheet.code}     ${sheet.title}`,2.8));
 b+=text(228,43,'CẦN HOÀN THIỆN TRƯỚC KHI NỘP HỒ SƠ',3);
 missing.forEach((s,i)=>{const parts=s.match(/.{1,46}(?:\s|$)|.{1,46}/g)||[s];parts.forEach((t,j)=>b+=text(228,54+i*19+j*4.5,(j?'   ':`${i+1}. `)+t.trim(),2.5));});
 b+=text(228,182,'Khổ A3; in 100% / Actual size để đúng tỷ lệ.',2.7)+text(228,190,'Số đo xuất từ mô hình, không phải số đo khảo sát.',2.7)+text(228,198,'Không tự sinh móng hoặc thông số chịu lực.',2.7);
 return [{code:'KT-00',title:'DANH MỤC & GHI CHÚ',svg:frame('KT-00','DANH MỤC & GHI CHÚ','—',b)},...rest];
}
export function elevationSheet(front,side){
 const b=text(25,31,'MẶT ĐỨNG TRỰC GIAO TỪ MÔ HÌNH',3.5)+`<image x="25" y="41" width="105" height="179" href="${front}"/><image x="145" y="41" width="235" height="179" href="${side}"/>`+text(25,232,'Mặt trước · hình chiếu mô hình',3)+text(145,232,'Mặt bên hẻm · hình chiếu mô hình',3)+text(25,245,'Hình minh hoạ không ghi tỷ lệ; kích thước / cao độ xem mặt bằng và mặt cắt.',2.6);
 return {code:'KT-06',title:'MẶT ĐỨNG TRƯỚC / BÊN',svg:frame('KT-06','MẶT ĐỨNG TRƯỚC / BÊN','KHÔNG TỶ LỆ',b)};
}
function save(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000);}
export function drawingData(){return {stage:'concept-not-permit-ready',units:'metres',coordinates:{rooms:'design-xz',plot:'world-xz',worldX:'mirrorX - designX',mirrorX:MIRROR_X,dxf:'x=worldX*1000+floorIndex*10000; y=-z*1000; units mm'},datum:'ground-floor-finished-floor',floorToFloor:HEIGHT,plot,proposedOutline:buildingPlot,columns:{...STRUCTURE,points:columnPlan},stairs:STAIR,rooms:floorRooms.map(rooms=>rooms.map(r=>({...r,metrics:roomMetrics(r.points,r.holes),rings:[r.points,...(r.holes||[])].map(polygonDimensions)})))};}
export function drawingDXF(plans){
 const pairs=(...p)=>p.join('\n')+'\n';let d=pairs(0,'SECTION',2,'HEADER',9,'$INSUNITS',70,4,0,'ENDSEC',0,'SECTION',2,'ENTITIES');
 plans.forEach((segments,floor)=>segments.forEach(([a,b])=>{d+=pairs(0,'LINE',8,`PLAN_${floor+1}`,10,a[0]*1000+floor*10000,20,-a[2]*1000,30,0,11,b[0]*1000+floor*10000,21,-b[2]*1000,31,0);}));
 return d+pairs(0,'ENDSEC',0,'EOF');
}
export function openDrawingViewer(sheets,plans,w=window.open('','_blank')){
 if(!w)throw new Error('Trình duyệt đang chặn cửa sổ bản vẽ. Cho phép pop-up rồi thử lại.');
 w.document.open();w.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bản vẽ · Nhà 356/73</title><style>*{box-sizing:border-box}body{margin:0;background:#e7e7e2;font:14px Arial;color:#252923}header{position:sticky;top:0;background:#fafaf6;padding:12px 20px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #ccc}header strong{margin-right:auto}button,select{padding:9px 12px;border:1px solid #c9cdc3;background:white;border-radius:8px;color:inherit;font:inherit;cursor:pointer}main{padding:24px;overflow:auto}.sheet{margin:0 auto 24px;width:420mm;box-shadow:0 4px 22px #0002;background:white}.sheet svg{display:block}#notice{margin:0;padding:10px 20px;background:#f3efdf;font-size:13px}@page{size:A3 landscape;margin:0}@media print{body{background:white}header,#notice{display:none}main{padding:0;overflow:visible}.sheet{margin:0;box-shadow:none;break-after:page;width:420mm;height:297mm}.sheet:last-child{break-after:auto}.sheet svg{width:420mm;height:297mm}}</style></head><body><header><strong>Bản vẽ kiến trúc</strong><select id="sheet-nav" aria-label="Đến tờ bản vẽ">${sheets.map((s,i)=>`<option value="${i}">${s.code} · ${esc(s.title)}</option>`).join('')}</select><button id="print">In / Lưu PDF</button><button id="svg">SVG tờ đang chọn</button><button id="dxf">DXF mặt bằng</button><button id="json">Số liệu JSON</button></header><p id="notice">Phương án trao đổi · Chưa đủ hồ sơ xin phép / thi công. In A3 ngang, tỷ lệ 100%, tắt header/footer của trình duyệt.</p><main>${sheets.map((s,i)=>`<section class="sheet" id="sheet-${i}">${s.svg}</section>`).join('')}</main></body></html>`);w.document.close();
 w.document.querySelector('#sheet-nav').onchange=e=>w.document.getElementById('sheet-'+e.target.value).scrollIntoView({behavior:'smooth'});
 w.document.querySelector('#print').onclick=()=>w.print();
 w.document.querySelector('#svg').onclick=()=>{const s=sheets[+w.document.querySelector('#sheet-nav').value];save(new Blob([s.svg],{type:'image/svg+xml'}),s.code+'.svg');};
 w.document.querySelector('#dxf').onclick=()=>save(new Blob([drawingDXF(plans)],{type:'application/dxf'}),'nha-356-73-mat-bang.dxf');
 w.document.querySelector('#json').onclick=()=>save(new Blob([JSON.stringify(drawingData(),null,2)],{type:'application/json'}),'nha-356-73-thong-so.json');return w;
}
