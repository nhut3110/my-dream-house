import {WINDER,fanPoint,fanAngle,fanEntryDirection} from './stair-entry.js';
import {GROUND,SERVICE,MASTER_SUITE,SMALL_SUITE,REAR_FURNITURE,THIRD,toWorld,HEIGHT,entrySpan} from './design.js';

export const ORIENTATION_REFERENCE={frontBearing:340,estimated:true,source:'Model reference bearing; no geographic location stored'};
export const normalizeBearing=n=>((n%360)+360)%360;
// Model -Z is the main door's outward normal. Model +X is left from the yard.
export function vectorBearing([x,z],frontBearing=ORIENTATION_REFERENCE.frontBearing){return normalizeBearing(frontBearing+Math.atan2(x,-z)*180/Math.PI)}
export function bearingVector(bearing,frontBearing=ORIENTATION_REFERENCE.frontBearing){const a=(bearing-frontBearing)*Math.PI/180;return [Math.sin(a),-Math.cos(a)]}
export const DIRECTIONS=[{short:'B',name:'Bắc'},{short:'ĐB',name:'Đông Bắc'},{short:'Đ',name:'Đông'},{short:'ĐN',name:'Đông Nam'},{short:'N',name:'Nam'},{short:'TN',name:'Tây Nam'},{short:'T',name:'Tây'},{short:'TB',name:'Tây Bắc'}];
const WINDS=['Bắc','Bắc Đông Bắc','Đông Bắc','Đông Đông Bắc','Đông','Đông Đông Nam','Đông Nam','Nam Đông Nam','Nam','Nam Tây Nam','Tây Nam','Tây Tây Nam','Tây','Tây Tây Bắc','Tây Bắc','Bắc Tây Bắc'];
export const directionName=bearing=>WINDS[Math.floor((normalizeBearing(bearing)+11.25)/22.5)%16];
export function bedHeadVector(rotation){return [Math.sin(rotation),-Math.cos(rotation)]} // interior X is mirrored into world X
const at=(x,z,y=0)=>{const [wx,wz]=toWorld([x,z]);return [wx,y,wz]};
const stairMouth=fanPoint(WINDER.innerRadius+WINDER.width/2,fanAngle(0));
const K=SERVICE.kitchen;
const wallSlope=(entrySpan(K.hobZ+.01)[1]-entrySpan(K.hobZ-.01)[1])/.02;
const kitchenFront=[1,wallSlope]; // normal from side worktop towards standing cook
export const ORIENTATION_TARGETS=[
 {id:'front',label:'Cửa chính',floor:0,vector:[0,-1],position:at((entrySpan(GROUND.glassLine)[0]*3+entrySpan(GROUND.glassLine)[1])/4,GROUND.glassLine,.12),note:'Từ trong nhà nhìn qua cửa kính ra sân.'},
 {id:'stairs',label:'Miệng thang tầng 1',floor:0,vector:[fanEntryDirection[0],-fanEntryDirection[1]],position:at(...stairMouth,.22),note:'Từ bậc đầu nhìn ra: hướng chéo vào trong nhà, qua khỏi vùng cửa bên. Kiểm tra toàn miệng thang và sai lệch ±2° không chạm cửa trước hay cửa bên trong mô hình.'},
 {id:'kitchen',label:'Bếp · mặt thao tác',floor:0,vector:kitchenFront,position:at(entrySpan(K.hobZ)[1]-.35,K.hobZ,K.top+.1),note:'Từ bếp hướng ra chỗ đứng; cùng chiều lưng người nấu. Đây là quy ước hiển thị, không tự kết luận phong thuỷ.'},
 {id:'cook',label:'Người nấu nhìn',floor:0,vector:kitchenFront.map(n=>-n),position:at(entrySpan(K.hobZ)[1]-1,K.hobZ,.12),note:'Từ chỗ đứng nhìn vào bếp. Ngược 180° với mặt thao tác.'},
 {id:'master',label:'Đầu giường master',floor:1,vector:bedHeadVector(MASTER_SUITE.bed.rotation),position:at(MASTER_SUITE.bed.x,MASTER_SUITE.bed.z,.9),note:'Từ chân giường về đầu giường, không phải hướng nằm nhìn.'},
 {id:'small',label:'Đầu giường phòng nhỏ',floor:1,vector:bedHeadVector(SMALL_SUITE.bed.rotation),position:at(SMALL_SUITE.bed.x,SMALL_SUITE.bed.z,.9),note:'Từ chân giường về đầu giường.'},
 {id:'grandparents',label:'Đầu giường ông bà',floor:0,vector:bedHeadVector(REAR_FURNITURE.beds[0].rotation),position:at(REAR_FURNITURE.beds[0].x,REAR_FURNITURE.beds[0].z,.9),note:'Hai giường cùng chiều; mũi tên từ chân về đầu giường.'},
 {id:'altar',label:'Bàn thờ ông bà',floor:2,vector:[0,-1],position:at(THIRD.prayer.altarX,THIRD.prayer.altarZ,1.2),note:'Từ bàn thờ nhìn ra phía trước nhà.'},
 {id:'buddha',label:'Bàn thờ Phật',floor:2,vector:[0,-1],position:at(THIRD.prayer.altarX,THIRD.prayer.buddhaZ,1.95),note:'Từ bàn thờ Phật nhìn ra sân thượng.'},
 {id:'side-door',label:'Cửa bên',floor:0,vector:[-1,-wallSlope],position:at(entrySpan(GROUND.exit.z)[1],GROUND.exit.z,.15),note:'Từ trong nhà nhìn ra kiệt bên hông.'},
];
export const targetWorldPosition=target=>[target.position[0],target.floor*HEIGHT+target.position[1],target.position[2]];
