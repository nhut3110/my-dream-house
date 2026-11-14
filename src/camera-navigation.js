import * as T from 'three';
export function installNavigation({canvas,controls,getCamera,invalidate,blocked,onExit,onFreeChange}){
 const keys=new Set(),velocity=new T.Vector3(),up=new T.Vector3(0,1,0),forward=new T.Vector3(),right=new T.Vector3(),desired=new T.Vector3(),delta=new T.Vector3();
 const codes=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyQ','KeyE','ShiftLeft','ShiftRight']);
 let free=false,drag=null;
 canvas.tabIndex=0;canvas.setAttribute('aria-label','Khung xem nhà. WASD hoặc phím mũi tên để di chuyển, Q xuống, E lên.');
 const clear=()=>{keys.clear();velocity.set(0,0,0);drag=null};
 window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
 canvas.addEventListener('blur',clear);
 canvas.addEventListener('keydown',e=>{if(e.code==='Escape'&&free){onExit();return}if(blocked())return;if(codes.has(e.code)){e.preventDefault();keys.add(e.code)}});
 window.addEventListener('keyup',e=>keys.delete(e.code));
 canvas.addEventListener('pointerdown',e=>{canvas.focus({preventScroll:true});if(!free||e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!free||!drag||drag.id!==e.pointerId)return;const cam=getCamera(),rotation=new T.Euler().setFromQuaternion(cam.quaternion,'YXZ');rotation.y-=(e.clientX-drag.x)*.004;rotation.x=T.MathUtils.clamp(rotation.x-(e.clientY-drag.y)*.004,-Math.PI/2+.02,Math.PI/2-.02);cam.quaternion.setFromEuler(rotation);drag.x=e.clientX;drag.y=e.clientY;syncTarget();invalidate()});
 const release=()=>drag=null;canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
 canvas.addEventListener('wheel',e=>{if(!free||blocked())return;e.preventDefault();const cam=getCamera();cam.getWorldDirection(forward);cam.position.addScaledVector(forward,-Math.sign(e.deltaY)*.35);syncTarget();invalidate()},{passive:false});
 function syncTarget(){const cam=getCamera();cam.getWorldDirection(forward);controls.target.copy(cam.position).addScaledVector(forward,3)}
 return {get free(){return free},setFree(value){free=value;clear();controls.enabled=!free;canvas.style.cursor=free?'grab':'';onFreeChange(free);if(free){syncTarget();canvas.focus({preventScroll:true})}},update(dt){if(blocked()){clear();return false}const cam=getCamera();cam.getWorldDirection(forward);forward.y=0;if(forward.lengthSq()<.001)forward.set(0,0,1);forward.normalize();right.crossVectors(forward,up).normalize();const axis=(a,b)=>Number(keys.has(a))-Number(keys.has(b));const f=axis('KeyW','KeyS')+axis('ArrowUp','ArrowDown'),r=axis('KeyD','KeyA')+axis('ArrowRight','ArrowLeft');desired.set(0,0,0).addScaledVector(forward,f).addScaledVector(right,r);desired.y=axis('KeyE','KeyQ');if(desired.lengthSq()>0)desired.normalize().multiplyScalar(keys.has('ShiftLeft')||keys.has('ShiftRight')?5:1.8);velocity.lerp(desired,1-Math.exp(-14*dt));if(velocity.lengthSq()<.00001){velocity.set(0,0,0);return false}delta.copy(velocity).multiplyScalar(dt);cam.position.add(delta);controls.target.add(delta);invalidate();return true}}
}
