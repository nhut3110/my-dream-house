import {installCompass} from './compass.js';
import {terraceCanopy,prayerDoors} from './third-floor.js';
import {createSiteContext} from './site-context.js';
import {createHouseLighting} from './house-lighting.js';
import {setupViewerDock} from './viewer-dock.js';
import {installNavigation} from './camera-navigation.js';
import {createRoomPlan} from './room-plan.js';
import './style.css';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {house,floors,labels,assetState,loadFurniture,setHouseView,buildDimensions,box,M,referencePeople,openingAudit,entranceDoor,setEntranceProgress} from './house.js';
import {levels,plot,HEIGHT,assumptions,MIRROR_X,STAIR} from './design.js';
const stage=document.querySelector('#stage'),viewport=document.querySelector('#viewport');
const touchDevice=matchMedia('(any-pointer:coarse)').matches||navigator.maxTouchPoints>0||/Android|iPhone|iPad/.test(navigator.userAgent)||innerWidth<850;
document.documentElement.classList.toggle('touch-device',touchDevice);
let roomPlan=createRoomPlan();viewport.appendChild(roomPlan);
const measureButton=document.createElement('button');measureButton.id='room-measures';measureButton.textContent='Kích thước phòng';measureButton.setAttribute('aria-pressed','false');document.querySelector('#plan').after(measureButton);
function closeRoomPlan(){roomPlan.hidden=true;measureButton.setAttribute('aria-pressed','false')}
measureButton.onclick=()=>{const show=roomPlan.hidden;roomPlan.hidden=!show;measureButton.setAttribute('aria-pressed',String(show));};
for(const id of ['plan','dollhouse','overview','entry'])document.querySelector('#'+id).addEventListener('click',closeRoomPlan);

const technicalButton=document.createElement('button');technicalButton.id='technical-export';technicalButton.textContent='Xuất bản vẽ';document.querySelector('#export').after(technicalButton);
technicalButton.onclick=async()=>{
 const preview=window.open('','_blank');
 if(!preview){toast('Cho phép mở cửa sổ để xem bản vẽ');return;}
 preview.document.body.textContent='Đang dựng bộ bản vẽ…';technicalButton.disabled=true;
 const visibility=[];house.traverse(o=>visibility.push([o,o.visible]));
 const siteVisible=site.root.visible,dimensionsVisible=dimensions.visible,previousMix=lightingMix;
 let drawingRenderer;
 try{
  const {sliceModel,createDrawingSet,elevationSheet,openDrawingViewer}=await import('./technical-drawings.js');
  setHouseView('all',false);site.root.visible=false;dimensions.visible=false;referencePeople.forEach(p=>p.visible=false);applyLighting(0);
  // Yield once so the loading message is painted before mesh intersections.
  await new Promise(resolve=>setTimeout(resolve,30));
  const plans=[0,1,2].map(f=>sliceModel(house,1,f*HEIGHT+1.1));
  const underlays=[0,1,2].map(f=>sliceModel(house,1,f*HEIGHT+.45));
  const cutX=MIRROR_X-(STAIR.x+STAIR.width/2),section=sliceModel(house,0,cutX);
  drawingRenderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});drawingRenderer.setPixelRatio(1);drawingRenderer.setClearColor('#ffffff');drawingRenderer.toneMapping=renderer.toneMapping;drawingRenderer.toneMappingExposure=1.1;
  function elevation(side){
   const aspect=side?1.31:.586,h=13.4,w=h*aspect,c=new T.OrthographicCamera(-w/2,w/2,h/2,-h/2,.1,120);
   if(side)c.position.set(-35,5.4,6.6);else c.position.set(2.75,5.4,-35);
   c.lookAt(2.75,5.4,6.6);
   drawingRenderer.setSize(Math.round(1500*aspect),1500);drawingRenderer.render(scene,c);return drawingRenderer.domElement.toDataURL('image/png');
  }
  const sheets=createDrawingSet({plans,section,cutX,underlays,elevations:[elevationSheet(elevation(false),elevation(true))]});
  openDrawingViewer(sheets,plans,preview);toast('Đã mở bộ bản vẽ · In / Lưu PDF');
 }catch(error){console.error(error);preview.close();toast('Chưa xuất được bản vẽ. Hãy thử lại.');}
 finally{drawingRenderer?.dispose();for(const [o,v]of visibility)o.visible=v;site.root.visible=siteVisible;dimensions.visible=dimensionsVisible;applyLighting(previousMix);lighting.setView(mode,low);technicalButton.disabled=false;invalidate(true);}
};

const scene=new T.Scene();
const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,touchDevice?1.3:1.65));renderer.setClearColor(0xf0f1e9,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;stage.appendChild(renderer.domElement);
const pmrem=new T.PMREMGenerator(renderer),environment=new RoomEnvironment();scene.environment=pmrem.fromScene(environment,.05).texture;scene.environmentIntensity=.55;environment.dispose();pmrem.dispose();
const sun=new T.DirectionalLight('#fff5e4',2.1);sun.position.set(-7,17,-8);sun.target.position.set(2.7,2,6.5);sun.castShadow=true;sun.shadow.mapSize.set(touchDevice?1024:2048,touchDevice?1024:2048);Object.assign(sun.shadow.camera,{left:-13,right:13,top:16,bottom:-16,near:.1,far:50});sun.shadow.normalBias=.025;sun.shadow.bias=-.00012;scene.add(sun,sun.target);
const skyLight=new T.HemisphereLight('#fffef0','#b5b8a3',1.55);scene.add(skyLight);const fill=new T.DirectionalLight('#d6e4e8',.65);fill.position.set(10,8,10);scene.add(fill);
scene.add(house);
const lighting=createHouseLighting({house,floors,scene});
const site=createSiteContext({box,M});scene.add(site.root);let siteEnabled=true;
const contextButton=document.createElement('button');contextButton.id='site-context';contextButton.textContent='Bối cảnh';contextButton.setAttribute('aria-pressed','true');document.querySelector('#people').after(contextButton);
contextButton.onclick=()=>{siteEnabled=!siteEnabled;site.setVisible(siteEnabled&&mode==='all');contextButton.setAttribute('aria-pressed',String(siteEnabled));invalidate(true)};
const neighborhoodButton=document.createElement('button');neighborhoodButton.id='site-neighborhood';neighborhoodButton.textContent='Khu phố mở rộng';neighborhoodButton.setAttribute('aria-pressed','false');contextButton.after(neighborhoodButton);
neighborhoodButton.onclick=()=>{const show=neighborhoodButton.getAttribute('aria-pressed')!=='true';site.setAdvanced(show);neighborhoodButton.setAttribute('aria-pressed',String(show));if(show){siteEnabled=true;contextButton.setAttribute('aria-pressed','true');if(mode!=='all')updateView('all');site.setVisible(true);}if(mode==='all')targetCamera();invalidate(true)};
const streetButton=document.createElement('button');streetButton.id='street-view';streetButton.textContent='Góc ngã ba';document.querySelector('#overview').after(streetButton);
function streetView(){updateView('all');transition=null;siteEnabled=true;site.setVisible(true);contextButton.setAttribute('aria-pressed','true');camera=eyeCamera;controls.object=camera;controls.enablePan=true;const distance=Math.max(1,stage.clientHeight/stage.clientWidth);camera.position.set(2-7.5*distance,1.25,4.6-10.4*distance);controls.target.set(2.0,3.6,4.6);camera.lookAt(controls.target);resize();controls.update();title.textContent='Từ ngã ba';invalidate(true)}
streetButton.onclick=streetView;
const dimensions=buildDimensions();dimensions.visible=false;scene.add(dimensions);
const orthoCamera=new T.OrthographicCamera(-10,10,10,-10,.05,180),eyeCamera=new T.PerspectiveCamera(63,1,.05,180);let camera=orthoCamera;const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.085;controls.minZoom=.45;controls.maxZoom=6;controls.maxPolarAngle=Math.PI/2.02;controls.minPolarAngle=.001;controls.zoomToCursor=true;
let mode='all',low=false,plan=false,wide=true,showLabels=false,transition=null,dirty=true,frames=0,lastChange=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const title=document.querySelector('#view-title'),number=document.querySelector('.view-number');
function targetCamera(animate=true){if(!animate)transition=null;freeNav.setFree(false);title.textContent=mode==='all'?'Liên tầng':levels[+mode].name;camera=orthoCamera;controls.object=camera;controls.enablePan=true;document.querySelector('#entry').classList.remove('selected');resize();const neighborhood=mode==='all'&&site.stats().advanced;controls.minZoom=neighborhood?.16:.45;const y=neighborhood?0:mode==='all'?4.8:Number(mode)*HEIGHT+.4;const target=new T.Vector3(2.7,y,plan?6.65:wide?6.3:4.9);const offset=neighborhood?new T.Vector3(-18,46,-24):plan?new T.Vector3(0,28,-.001):mode==='all'?new T.Vector3(-14,12,-18):innerWidth<650?new T.Vector3(-4,13,-12):new T.Vector3(-7,9,-7);const pos=target.clone().add(offset);const zoom=neighborhood?(innerWidth<650?.16:.23):mode==='all'?.7:1;const start={p:camera.position.clone(),t:controls.target.clone(),z:camera.zoom};if(animate&&!reduce.matches){transition={start,end:{p:pos,t:target,z:zoom},time:performance.now()}}else{camera.position.copy(pos);controls.target.copy(target);camera.zoom=zoom;camera.updateProjectionMatrix();controls.update()}invalidate()}
function invalidate(shadows=false){dirty=true;lastChange=performance.now();if(shadows)renderer.shadowMap.needsUpdate=true;}
function updateView(newMode){mode=newMode;const floorLabel=mode==='all'?'Tổng thể':`Tầng ${+mode+1}`;document.querySelector('.floor-current').textContent=floorLabel;document.querySelector('#floor-trigger').setAttribute('aria-label',`Chọn tầng · ${floorLabel}`);document.querySelector('#floor-trigger').dataset.level=mode==='all'?'↗':String(+mode+1);const nextPlan=createRoomPlan(mode==='all'?0:Number(mode));roomPlan.replaceWith(nextPlan);roomPlan=nextPlan;measureButton.disabled=mode==='all';measureButton.title='Kích thước các khu trên tầng đang xem';closeRoomPlan();site.setVisible(siteEnabled&&mode==='all');low=mode!=='all';plan=false;document.querySelector('#dollhouse').classList.add('selected');document.querySelector('#plan').classList.remove('selected');document.querySelector('#walls').setAttribute('aria-pressed',String(low));document.querySelector('#walls').textContent=low?'Tường thấp':'Tường cao';document.querySelectorAll('[data-floor]').forEach(b=>b.classList.toggle('active',b.dataset.floor===mode));setHouseView(mode,low);lighting.setView(mode,low);title.textContent=mode==='all'?'Liên tầng':levels[+mode].name;number.innerHTML=mode==='all'?'⌂ <span>3 TẦNG</span>':`0${+mode+1} <span>/ 03</span>`;dimensions.position.y=mode==='all'?0:+mode*HEIGHT;drawLabels();targetCamera();invalidate(true)}
const labelEls=labels.map(l=>{const el=document.createElement('span');el.textContent=l.text;el.className='room-label';document.querySelector('#room-labels').appendChild(el);return{...l,el}});
function drawLabels(){for(const l of labelEls){if(!showLabels||mode==='all'||l.floor!==+mode){l.el.style.display='none';continue}const v=l.point.clone();v.y+=l.floor*HEIGHT;v.project(camera);l.el.style.display=v.z>-1&&v.z<1?'block':'none';l.el.style.left=`${(v.x*.5+.5)*stage.clientWidth}px`;l.el.style.top=`${(-v.y*.5+.5)*stage.clientHeight}px`}}
function resize(){const w=stage.clientWidth,h=stage.clientHeight,aspect=w/h;const frustum=Math.max(plan?19:wide?13.5:7.8,(plan?8.5:wide?(innerWidth<650?10.5:12):8.2)/aspect);if(camera.isPerspectiveCamera){camera.aspect=aspect}else{camera.left=-frustum*aspect/2;camera.right=frustum*aspect/2;camera.top=frustum/2;camera.bottom=-frustum/2}camera.updateProjectionMatrix();renderer.setSize(w,h);invalidate(true);drawLabels()}
new ResizeObserver(resize).observe(stage);controls.addEventListener('change',()=>invalidate());controls.addEventListener('start',()=>{transition=null});
const freeButton=document.createElement('button');freeButton.id='free-camera';freeButton.textContent='Tự do';freeButton.title='Kéo chuột để nhìn · WASD / ↑↓←→ di chuyển · Q/E xuống/lên · Shift nhanh · Esc thoát';freeButton.setAttribute('aria-pressed','false');document.querySelector('#entry').after(freeButton);
const freeNav=installNavigation({canvas:renderer.domElement,controls,getCamera:()=>camera,invalidate,blocked:()=>!roomPlan.hidden||!!document.querySelector('dialog[open]'),onExit:()=>targetCamera(),onFreeChange:active=>{freeButton.setAttribute('aria-pressed',String(active));document.querySelector('.stage-footer>span:last-child').textContent=active?'WASD / ↑↓←→ · Q/E lên xuống · Shift nhanh · Kéo để nhìn · Esc thoát':'Kéo xoay · Chuột phải dịch · WASD / ↑↓←→ di chuyển · Q/E lên xuống'}});
freeButton.onclick=()=>{if(freeNav.free){targetCamera();return}closeRoomPlan();transition=null;const pos=camera.position.clone(),rotation=camera.quaternion.clone();camera=eyeCamera;camera.position.copy(pos);camera.quaternion.copy(rotation);camera.zoom=1;controls.object=camera;freeNav.setFree(true);document.querySelectorAll('#plan,#dollhouse,#overview,#entry').forEach(b=>b.classList.remove('selected'));resize();title.textContent='Camera tự do';toast('Kéo để nhìn · WASD / mũi tên di chuyển · Q/E lên xuống · Shift nhanh')};
let lightingMix=0,lightingTransition=null,isNight=false;
const lightingButton=document.createElement('button');lightingButton.id='lighting-mode';lightingButton.type='button';lightingButton.textContent='Ngày / đêm';lightingButton.setAttribute('aria-pressed','false');document.querySelector('#tools-trigger').before(lightingButton);
function applyLighting(mix){
 lightingMix=mix;lighting.setMix(mix);
 sun.intensity=T.MathUtils.lerp(2.1,.085,mix);sun.color.set('#fff5e4').lerp(new T.Color('#8eaddf'),mix);
 skyLight.intensity=T.MathUtils.lerp(1.8,.40,mix);skyLight.color.set('#fffef0').lerp(new T.Color('#7798c8'),mix);skyLight.groundColor.set('#b5b8a3').lerp(new T.Color('#252d39'),mix);
 fill.intensity=T.MathUtils.lerp(.8,.28,mix);scene.environmentIntensity=T.MathUtils.lerp(.7,.22,mix);renderer.toneMappingExposure=T.MathUtils.lerp(1.02,1.15,mix);
 M.glass.emissive.set('#ffd5a0');M.glass.emissiveIntensity=mix*.12;M.glow.emissiveIntensity=.15+mix*.95;
 invalidate();
}
function setNight(night){
 isNight=night;document.documentElement.classList.toggle('night-scene',night);
 lightingButton.setAttribute('aria-pressed',String(night));lightingButton.setAttribute('aria-label',night?'Chuyển sang ban ngày':'Chuyển sang ban đêm');lightingButton.title=night?'Chuyển sang ban ngày':'Chuyển sang ban đêm';
 if(reduce.matches){lightingTransition=null;applyLighting(night?1:0)}else lightingTransition={from:lightingMix,to:night?1:0,time:performance.now()};
 invalidate();
}
lightingButton.onclick=()=>setNight(!isNight);
const canopyButton=document.createElement('button');canopyButton.id='terrace-canopy';canopyButton.textContent='Thu / mở mái sân thượng';canopyButton.setAttribute('aria-pressed','false');document.querySelector('#people').after(canopyButton);
let canopyTransition=null;
function toggleCanopy(){
 terraceCanopy.open=!terraceCanopy.open;canopyButton.setAttribute('aria-pressed',String(terraceCanopy.open));
 canopyTransition={from:terraceCanopy.progress,to:terraceCanopy.open?1:0,time:performance.now()};
 if(reduce.matches){terraceCanopy.setProgress(canopyTransition.to);canopyTransition=null;}
 invalidate(true);
}
canopyButton.onclick=()=>{if(mode!=='all'&&mode!=='2')updateView('2');toggleCanopy();};
const prayerDoorButton=document.createElement('button');prayerDoorButton.id='prayer-doors';prayerDoorButton.textContent='Mở / đóng cửa phòng thờ';prayerDoorButton.setAttribute('aria-pressed','false');document.querySelector('#people').after(prayerDoorButton);
let prayerDoorTransition=null;
function togglePrayerDoors(){prayerDoors.open=!prayerDoors.open;prayerDoorButton.setAttribute('aria-pressed',String(prayerDoors.open));prayerDoorTransition={from:prayerDoors.progress,to:prayerDoors.open?1:0,time:performance.now()};if(reduce.matches){prayerDoors.setProgress(prayerDoorTransition.to);prayerDoorTransition=null}invalidate(true)}
prayerDoorButton.onclick=()=>{if(mode!=='all'&&mode!=='2')updateView('2');togglePrayerDoors()};
let doorTransition=null,doorPress=null;
const doorRay=new T.Raycaster(),doorPointer=new T.Vector2();
function toggleEntranceDoor(){entranceDoor.open=!entranceDoor.open;doorTransition={from:entranceDoor.progress,to:entranceDoor.open?1:0,time:performance.now()};if(reduce.matches){setEntranceProgress(doorTransition.to);doorTransition=null}invalidate(true)}
function visibleObject(o){for(let p=o;p;p=p.parent)if(!p.visible)return false;return true}
renderer.domElement.addEventListener('pointerdown',e=>{if(e.button===0)doorPress={x:e.clientX,y:e.clientY,id:e.pointerId,time:performance.now()}});
renderer.domElement.addEventListener('pointercancel',()=>{doorPress=null});
renderer.domElement.addEventListener('pointerup',e=>{
 const press=doorPress;doorPress=null;if(!press||press.id!==e.pointerId||Math.hypot(e.clientX-press.x,e.clientY-press.y)>6||performance.now()-press.time>600||!roomPlan.hidden||document.querySelector('dialog[open]'))return;
 const rect=renderer.domElement.getBoundingClientRect();doorPointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);house.updateMatrixWorld(true);doorRay.setFromCamera(doorPointer,camera);
 const hit=doorRay.intersectObject(house,true).find(h=>visibleObject(h.object));if(!hit)return;
 for(let o=hit.object;o;o=o.parent){if(o===prayerDoors.root){togglePrayerDoors();break}if(o===terraceCanopy.root){toggleCanopy();break}if(o===entranceDoor.group){toggleEntranceDoor();break}}
});
const compass=installCompass({scene,getCamera:()=>camera,getMode:()=>mode,view:updateView,invalidate});
let previousFrame=performance.now();
function tick(now){const dt=Math.min((now-previousFrame)/1000,.05);previousFrame=now;if(document.hidden){requestAnimationFrame(tick);return}let moving=false;if(prayerDoorTransition){const t=Math.min(1,(now-prayerDoorTransition.time)/850),e=t*t*(3-2*t);prayerDoors.setProgress(T.MathUtils.lerp(prayerDoorTransition.from,prayerDoorTransition.to,e));invalidate(true);moving=true;if(t===1)prayerDoorTransition=null}if(canopyTransition){const t=Math.min(1,(now-canopyTransition.time)/1200),e=t*t*(3-2*t);terraceCanopy.setProgress(T.MathUtils.lerp(canopyTransition.from,canopyTransition.to,e));invalidate(true);moving=true;if(t===1)canopyTransition=null;}if(doorTransition){const t=Math.min(1,(now-doorTransition.time)/650),e=t*t*(3-2*t);setEntranceProgress(T.MathUtils.lerp(doorTransition.from,doorTransition.to,e));invalidate(true);moving=true;if(t===1)doorTransition=null}if(lightingTransition){const t=Math.min(1,(now-lightingTransition.time)/650),e=t*t*(3-2*t);applyLighting(T.MathUtils.lerp(lightingTransition.from,lightingTransition.to,e));moving=true;if(t===1)lightingTransition=null}if(transition){const t=Math.min(1,(now-transition.time)/650),e=1-Math.pow(1-t,3);camera.position.lerpVectors(transition.start.p,transition.end.p,e);controls.target.lerpVectors(transition.start.t,transition.end.t,e);camera.zoom=T.MathUtils.lerp(transition.start.z,transition.end.z,e);camera.updateProjectionMatrix();moving=true;if(t===1)transition=null}moving=freeNav.update(dt)||moving;if(!freeNav.free)controls.update();if(dirty||moving||performance.now()-lastChange<100){compass.update();renderer.render(scene,camera);frames++;drawLabels();dirty=false}requestAnimationFrame(tick)}
requestAnimationFrame(tick);resize();setHouseView(mode,low);targetCamera(false);
loadFurniture(()=>{
 setHouseView(mode,low);invalidate(true);
 requestAnimationFrame(()=>{
  renderer.render(scene,camera);frames++;
  requestAnimationFrame(()=>{
   document.documentElement.classList.remove('booting');
   const loading=document.querySelector('#loading');loading.classList.add('is-leaving');
   setTimeout(()=>loading.remove(),300);
   document.querySelector('#status').textContent=assetState.failed.length?'Có nội thất chưa tải được':'Phương án bo góc · Có lưu đường đất gốc';window.houseDemo.ready=true;
  });
 });
});
const floorNav=document.querySelector('#floor-options');
for(const [floor,name,detail] of [['1','Tầng hai','Master · Phòng nhỏ · Khu chung'],['2','Tầng ba','Phòng thờ · Sân · Giặt phơi'],['all','Liên tầng','Cả ba tầng']]){const b=document.createElement('button');b.className='floor-option';b.dataset.floor=floor;b.innerHTML=`<span class="floor-index">${floor==='all'?'↗':'0'+(+floor+1)}</span><span>${name}<small>${detail}</small></span>`;floorNav.appendChild(b)}
document.querySelectorAll('[data-floor]').forEach(b=>b.addEventListener('click',()=>updateView(b.dataset.floor)));
document.querySelector('#walls').addEventListener('click',e=>{low=!low;e.currentTarget.setAttribute('aria-pressed',String(low));e.currentTarget.textContent=low?'Tường thấp':'Tường cao';setHouseView(mode,low);lighting.setView(mode,low);invalidate(true)});
document.querySelector('#labels').addEventListener('click',e=>{showLabels=!showLabels;e.currentTarget.setAttribute('aria-pressed',String(showLabels));invalidate()});
document.querySelector('#dimensions').addEventListener('click',e=>{dimensions.visible=!dimensions.visible;e.currentTarget.setAttribute('aria-pressed',String(dimensions.visible));invalidate()});
for(const id of['plan','dollhouse'])document.querySelector('#'+id).addEventListener('click',()=>{wide=false;document.querySelector('#overview').classList.remove('selected');plan=id==='plan';if(plan&&!low)document.querySelector('#walls').click();document.querySelector('#plan').classList.toggle('selected',plan);document.querySelector('#dollhouse').classList.toggle('selected',!plan);targetCamera()});
document.querySelector('#overview').addEventListener('click',()=>{wide=true;plan=false;document.querySelector('#plan').classList.remove('selected');document.querySelector('#dollhouse').classList.remove('selected');document.querySelector('#overview').classList.add('selected');targetCamera();});
document.querySelector('#entry').addEventListener('click',()=>{
 updateView('0');transition=null;camera=eyeCamera;controls.object=camera;controls.enablePan=false;
 camera.position.set(2.7,1.58,1.1);controls.target.set(2.7,1.25,5.1);camera.lookAt(controls.target);resize();controls.update();
 low=false;setHouseView('0',false);lighting.setView('0',false);document.querySelector('#walls').setAttribute('aria-pressed','false');document.querySelector('#walls').textContent='Tường cao';
 document.querySelector('#entry').classList.add('selected');document.querySelector('#dollhouse').classList.remove('selected');title.textContent='Từ sân nhìn vào';invalidate(true);
});
document.querySelector('#stair-toggle').addEventListener('click',e=>{const show=e.currentTarget.getAttribute('aria-pressed')!=='true';house.getObjectByName('Cau_thang_chu_L').visible=show&&mode!=='2';house.getObjectByName('Cau_thang_tang_2_len_3').visible=show&&mode!=='0';e.currentTarget.setAttribute('aria-pressed',String(show));invalidate(true)});
document.querySelector('#people').addEventListener('click',e=>{const show=e.currentTarget.getAttribute('aria-pressed')!=='true';referencePeople.forEach(p=>p.visible=show);e.currentTarget.setAttribute('aria-pressed',String(show));invalidate(true)});
document.querySelector('#reset').addEventListener('click',()=>targetCamera());
function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.classList.add('show');clearTimeout(el._timer);el._timer=setTimeout(()=>el.classList.remove('show'),3500)}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
document.querySelector('#capture').addEventListener('click',()=>{renderer.render(scene,camera);renderer.domElement.toBlob(blob=>{download(blob,`nha-minh-${mode==='all'?'toan-nha':'tang-'+(+mode+1)}.png`);toast('Đã lưu ảnh phối cảnh')})});
document.querySelector('#export').addEventListener('click',async(e)=>{const button=e.currentTarget;button.disabled=true;toast('Đang đóng gói mô hình…');try{const {GLTFExporter}=await import('three/addons/exporters/GLTFExporter.js');const saved={mode,low};setHouseView('all',false);house.getObjectByName('Cau_thang_chu_L').visible=true;house.getObjectByName('Cau_thang_tang_2_len_3').visible=true;const result=await new GLTFExporter().parseAsync(house,{binary:true,onlyVisible:true});setHouseView(saved.mode,saved.low);download(new Blob([result],{type:'model/gltf-binary'}),'phong-khach-minimalist.glb');toast('Đã lưu mô hình · Đơn vị mét')}catch(err){console.error(err);setHouseView(mode,low);toast('Chưa xuất được mô hình. Hãy thử lại.')}finally{house.getObjectByName('Cau_thang_chu_L').visible=document.querySelector('#stair-toggle').getAttribute('aria-pressed')==='true';setHouseView(mode,low);button.disabled=false;invalidate(true)}});
const notes=document.querySelector('#notes');document.querySelector('#notes-button').onclick=()=>notes.showModal();document.querySelector('#close-notes').onclick=()=>notes.close();notes.addEventListener('click',e=>{if(e.target===notes){const r=notes.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)notes.close()}});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();toast('Mất kết nối 3D. Tải lại trang để tiếp tục.')});
window.houseDemo={ready:false,compass,prayerDoors,togglePrayerDoors,terraceCanopy,toggleCanopy,getCamera:()=>camera,openingAudit,view:updateView,stats:()=>({mode,low,plan,freeCamera:freeNav.free,assets:assetState,triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,frames,visibleFloors:floors.map(f=>f.visible),lighting:lighting.stats(),site:site.stats(),camera:camera.position.toArray(),target:controls.target.toArray(),plot,assumptions}),scene,house,lighting,setNight,entranceDoor,streetView};

setupViewerDock();

// Always open the complete three-storey house.
updateView('all');targetCamera(false);applyLighting(0);
