import * as T from 'three';

// Metres in the third-floor interior coordinates. The roof stacks towards the penthouse.
export const CANOPY={left:.35,right:4.95,front:.9,back:6.18,height:2.72,panels:6,postFront:1.3,stackStep:.055};
export function createTerraceCanopy({parent,box,M}){
 const C=CANOPY,root=new T.Group();root.name='Mai_thu_xep_san_thuong_truoc';parent.add(root);
 const frame=new T.MeshStandardMaterial({color:'#343d3e',roughness:.48,metalness:.65});
 const panelMat=new T.MeshPhysicalMaterial({color:'#c5d1cf',roughness:.4,metalness:.05,transparent:true,opacity:.72,side:T.DoubleSide,depthWrite:false});
 const width=C.right-C.left,depth=C.back-C.front,span=depth/C.panels;
 for(const x of[C.left,C.right]){
  for(const z of[C.postFront,C.back]){
   box(root,x,.015,z,.085,C.height-.015,.085,frame,.006);
   box(root,x,.005,z,.16,.015,.16,frame,.006);
  }
  box(root,x,C.height-.13,(C.front+C.back)/2,.09,.13,depth+.12,frame,.008);
 }
 for(const z of[C.front,C.back])box(root,(C.left+C.right)/2,C.height-.13,z,width+.09,.13,.09,frame,.008);
 box(root,(C.left+C.right)/2,C.height-.08,(C.front+C.back)/2,.055,.08,depth,frame);
 // Slim front gutter and downpipe integrated with the right post.
 box(root,(C.left+C.right)/2,C.height-.15,C.front-.055,width+.15,.09,.075,frame,.006);
 box(root,C.right+.045,.03,C.postFront,.035,C.height-.1,.035,frame,.004);
 const leaves=[];
 for(let i=0;i<C.panels;i++){
  const leaf=new T.Group();leaf.name=`Tam_mai_truot_${i+1}`;root.add(leaf);
  for(const x of[C.left+.06,(C.left+C.right)/2,C.right-.06])box(leaf,x,0,0,.035,.035,span-.015,frame);
  for(const z of[-span/2+.025,span/2-.025])box(leaf,(C.left+C.right)/2,0,z,width-.1,.04,.045,frame);
  for(const sign of[-1,1]){
   const cx=(C.left+C.right)/2+sign*width/4;
   box(leaf,cx,.014,0,width/2-.06,.012,span-.08,panelMat);
   for(let n=1;n<7;n++)box(leaf,cx-width/4+n*(width/2)/7,.024,0,.005,.003,span-.09,panelMat);
  }
  leaves.push(leaf);
 }
 const control=box(root,C.right-.065,1.15,C.back-.07,.055,.14,.08,M.dark,.009);control.name='Nut_bam_dong_mo_mai';
 box(root,C.right-.098,1.19,C.back-.07,.014,.055,.045,M.glow,.005);
 const state={root,leaves,open:false,progress:0,setProgress(value){
  state.progress=T.MathUtils.clamp(value,0,1);
  const lift=Math.min(state.progress/.15,1),slide=Math.max(0,(state.progress-.15)/.85);
  leaves.forEach((leaf,i)=>{
   const closed=C.front+(i+.5)*span,stacked=C.back-span/2-(C.panels-1-i)*.025;
   leaf.position.set(0,C.height+i*C.stackStep*lift,T.MathUtils.lerp(closed,stacked,slide));
  });
 }};
 state.setProgress(0);root.userData={floor:2,interactive:'terrace-canopy',...C};return state;
}
