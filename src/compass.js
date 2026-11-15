import * as T from 'three';
import {ORIENTATION_REFERENCE as REF,ORIENTATION_TARGETS as TARGETS,DIRECTIONS,normalizeBearing,vectorBearing,bearingVector,directionName,targetWorldPosition} from './orientation.js';

function dial(){return `<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="46" class="compass-orbit"/><g class="compass-rose">${Array.from({length:24},(_,i)=>`<path d="M60 ${i%3?16:14}v${i%3?3:6}" transform="rotate(${i*15} 60 60)"/>`).join('')}${DIRECTIONS.map((d,i)=>{const a=i*Math.PI/4,x=60+Math.sin(a)*34,y=60-Math.cos(a)*34;return `<text x="${x}" y="${y}" class="${i===0?'north':''}" data-angle="${i*45}">${d.short}</text>`}).join('')}<path class="compass-north" d="M60 29l-4 10h8Z"/></g><g class="compass-target"><path d="M60 82V46m-5 6 5-9 5 9"/><circle cx="60" cy="60" r="2"/></g></svg>`}
export function installCompass({scene,getCamera,getMode,view,invalidate}){
 const KEY='house-orientation-v1';let bearing=REF.frontBearing,custom=false;
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved.bearing==='number'&&Number.isFinite(saved.bearing)){bearing=normalizeBearing(saved.bearing);custom=true}}catch{}
 let selected=TARGETS[0],showArrow=false,visible=true,lastRotation=NaN;
 const badge=document.createElement('button');badge.type='button';badge.id='compass-badge';badge.innerHTML=`${dial()}<span class="compass-badge-value"></span>`;badge.setAttribute('aria-label','La bàn · xem hướng nhà và nội thất');document.querySelector('#viewport').append(badge);
 const panel=document.createElement('dialog');panel.id='compass-panel';panel.setAttribute('aria-labelledby','compass-title');panel.innerHTML=`<div class="compass-sheet"><header><div><span class="compass-eyebrow">356/73 HOÀNG DIỆU</span><h2 id="compass-title">Hướng ngôi nhà.</h2></div><button type="button" class="compass-close" aria-label="Đóng la bàn">×</button></header><div class="compass-reading">${dial()}<div><span id="compass-selected-name"></span><strong id="compass-selected-bearing"></strong><span id="compass-selected-direction"></span></div></div><span id="compass-reference-state" class="compass-source"></span><div class="compass-targets">${TARGETS.map(t=>`<button type="button" data-target="${t.id}" aria-pressed="false"><span>${t.label}</span><span data-result="${t.id}"></span></button>`).join('')}</div><p id="compass-target-note"></p><label class="compass-check"><input id="compass-show-arrow" type="checkbox">Hiện mũi tên trên nhà</label><details class="compass-calibration"><summary>Căn hướng Bắc</summary><label for="compass-bearing">Hướng cửa chính · độ từ Bắc</label><div class="compass-input-row"><input id="compass-bearing" type="number" min="0" max="360" step="1" inputmode="decimal" required><span>°</span><button type="button" id="compass-reset">Theo bản đồ</button></div><p>0° Bắc · 90° Đông · 180° Nam · 270° Tây. Lưu trên trình duyệt này.</p><a href="${REF.mapUrl}" target="_blank" rel="noopener noreferrer">Xem marker trên Google Maps ↗</a><p>Ước lượng từ ảnh vệ tinh, chưa phải số đo tại nhà. Đối chiếu la bàn thực tế trước khi xét phong thuỷ chi tiết; Bắc từ có thể khác Bắc địa lý trên bản đồ.</p></details></div>`;document.body.append(panel);
 const input=panel.querySelector('#compass-bearing');input.value=String(bearing);
 const north=new T.Vector3(),right=new T.Vector3(),screenUp=new T.Vector3();
 const arrow=new T.ArrowHelper(new T.Vector3(0,0,-1),new T.Vector3(),1.25,0xa27d41,.23,.14);arrow.name='Mui_ten_huong_dang_xem';arrow.visible=false;scene.add(arrow);for(const m of [arrow.line,arrow.cone]){m.material.depthTest=false;m.material.depthWrite=false;m.renderOrder=20}
 const roses=[badge,panel].map(el=>({rose:el.querySelector('.compass-rose'),target:el.querySelector('.compass-target'),letters:[...el.querySelectorAll('[data-angle]')]}));
 function updateReading(){
  const result=vectorBearing(selected.vector,bearing),degree=`≈ ${Math.round(result)%360}°`;
  badge.querySelector('.compass-badge-value').textContent=degree;badge.title=`${selected.label} · ${degree} · ${directionName(result)} · ${custom?'tự căn':'ước lượng từ bản đồ'}`;
  panel.querySelector('#compass-selected-name').textContent=selected.label;panel.querySelector('#compass-selected-bearing').textContent=degree;panel.querySelector('#compass-selected-direction').textContent=directionName(result);
  panel.querySelector('#compass-target-note').textContent=selected.note;
  panel.querySelector('#compass-reference-state').textContent=custom?'Bạn tự căn · chưa xác minh':'Ước lượng từ marker & ảnh vệ tinh';
  for(const t of TARGETS){const b=vectorBearing(t.vector,bearing);panel.querySelector(`[data-result="${t.id}"]`).textContent=`${Math.round(b)%360}° · ${directionName(b)}`;panel.querySelector(`[data-target="${t.id}"]`).setAttribute('aria-pressed',String(t===selected))}
  const len=Math.hypot(...selected.vector);arrow.setDirection(new T.Vector3(selected.vector[0]/len,0,selected.vector[1]/len));arrow.position.fromArray(targetWorldPosition(selected));
  lastRotation=NaN;invalidate();
 }
 function update(){
  arrow.visible=showArrow&&visible&&(getMode()==='all'||Number(getMode())===selected.floor);
  if(!visible)return;
  const camera=getCamera(),[nx,nz]=bearingVector(0,bearing);north.set(nx,0,nz);right.set(1,0,0).applyQuaternion(camera.quaternion);right.y=0;right.normalize();screenUp.set(right.z,0,-right.x);
  const angle=Math.atan2(north.dot(right),north.dot(screenUp))*180/Math.PI;
  if(Number.isFinite(lastRotation)&&Math.abs(angle-lastRotation)<.01)return;lastRotation=angle;
  for(const r of roses){r.rose.setAttribute('transform',`rotate(${angle} 60 60)`);r.target.setAttribute('transform',`rotate(${angle+vectorBearing(selected.vector,bearing)} 60 60)`);for(const text of r.letters){text.setAttribute('transform',`rotate(${-angle} ${text.getAttribute('x')} ${text.getAttribute('y')})`)}}
 }
 function open(){updateReading();update();if(!panel.open)panel.showModal()}
 badge.onclick=open;panel.querySelector('.compass-close').onclick=()=>panel.close();panel.addEventListener('click',e=>{if(e.target!==panel)return;const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)panel.close()});
 for(const button of panel.querySelectorAll('[data-target]'))button.onclick=()=>{selected=TARGETS.find(t=>t.id===button.dataset.target);showArrow=true;panel.querySelector('#compass-show-arrow').checked=true;view(String(selected.floor));updateReading();update()};
 panel.querySelector('#compass-show-arrow').onchange=e=>{showArrow=e.target.checked;update();invalidate()};
 input.addEventListener('input',()=>{input.setCustomValidity('')});
 input.addEventListener('change',()=>{if(!input.validity.valid||input.value.trim()===''||!Number.isFinite(input.valueAsNumber)){input.setCustomValidity('Nhập góc từ 0 đến 360°.');input.reportValidity();return}bearing=normalizeBearing(input.valueAsNumber);input.value=String(bearing);custom=true;try{localStorage.setItem(KEY,JSON.stringify({bearing}))}catch{}updateReading();update()});
 panel.querySelector('#compass-reset').onclick=()=>{bearing=REF.frontBearing;custom=false;input.value=String(bearing);input.setCustomValidity('');try{localStorage.removeItem(KEY)}catch{}updateReading();update()};
 updateReading();
 return {update,open,panel,badge,stats:()=>({frontBearing:bearing,custom,estimated:true,selected:selected.id,bearing:vectorBearing(selected.vector,bearing),arrow:arrow.visible}),setVisible(value){visible=value;badge.hidden=!value;update()}};
}
