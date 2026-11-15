export function createPrayerDoors({parent,spec,z,group,box,rod,M,glassParts}){
 const root=group(parent);root.name='Bo_cua_lon_xep_ra_san_thuong';
 const width=spec.width/4,height=spec.height,pairs=[];
 for(const side of [1,-1]){
  const hinge=group(root,side>0?spec.left:spec.left+spec.width,z),second=group(hinge,side*width,0);
  for(const leaf of [hinge,second]){
   const pane=group(leaf);pane.name='Canh_kinh_xep';
   box(pane,side*width/2,.04,0,width-.065,height-.085,.028,M.glass);
   for(const xx of [0,side*width])box(pane,xx,.025,0,.04,height-.025,.06,M.dark);
   for(const y of [.025,height-.035])box(pane,side*width/2,y,0,width,.04,.06,M.dark);
  }
  rod(second,[side*(width-.13),1.04,-.06],[side*(width-.13),1.3,-.06],.012,M.dark);
  pairs.push({hinge,second,side});
 }
 for(const xx of [spec.left,spec.left+spec.width])box(root,xx,0,z,.055,height+.03,.1,M.dark);
 box(root,spec.left+spec.width/2,height,z,spec.width+.08,.045,.1,M.dark);
 box(root,spec.left+spec.width/2,.008,z,spec.width+.08,.018,.12,M.dark);
 root.userData={interactive:'prayer-doors',width:spec.width,height};glassParts.push({obj:root,floor:2,hideCut:true});
 const state={root,open:false,progress:0,setProgress(value){state.progress=Math.max(0,Math.min(1,value));for(const p of pairs){const angle=p.side*state.progress*Math.PI*80/180;p.hinge.rotation.y=angle;p.second.rotation.y=-2*angle}}};
 return state;
}
