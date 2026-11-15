import * as T from 'three';

// Static, seeded planting: dense crown and varied cascading strands, no animation loop.
export function trailingPlanters({parent,segments,center,box,rod,group,M,clearances=[],rhythm=false}){
 const garden=group(parent);garden.name='Cay_ru_day_lan_can';
 const leafGeometry=new T.SphereGeometry(1,8,5);
 for(const [a,b] of segments){
  const length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(length<.5)continue;
  const count=Math.max(1,Math.ceil(length/.82)),tx=(b[0]-a[0])/length,tz=(b[1]-a[1])/length;
  for(let j=0;j<count;j++){
   const t=(j+.5)/count,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;
   const d=Math.hypot(center[0]-x,center[1]-z),nx=(center[0]-x)/d,nz=(center[1]-z)/d;
   const planter=group(garden,x+nx*.13,z+nz*.13,-Math.atan2(tz,tx));planter.name='Bon_cay_ru_lan_can';
   const width=length/count-.035;
   box(planter,0,.64,0,width,.22,.22,M.stone,.015);box(planter,0,.86,0,width-.04,.012,.17,M.soil);
   for(let k=0;k<13;k++){
    const along=(k/12-.5)*(width-.04),seed=j*19+k;
    const start=new T.Vector3(x+tx*along,.94,z+tz*along);
    let prev=start.clone();let dropLength= rhythm ? .50+(Math.sin(j*1.9+x*.9+z*.7)+1)*.40+(Math.sin(seed*2.4)+1)*.12 : 1.05+(Math.sin(seed*2.4)+1)*.4;
    for(const c of clearances)if(start.x>c.minX&&Math.abs(start.z-c.z)<c.halfWidth)dropLength=Math.min(dropLength,c.maxDrop);
    for(let n=0;n<14;n++){
     const q=n/13,reach=Math.sin(Math.min(q*3,1)*Math.PI/2)*(rhythm?.47:.24);
     const sway=Math.sin(q*6+seed)*.035;
     const next=new T.Vector3(start.x-nx*reach+tx*sway,.96-q*dropLength,start.z-nz*reach+tz*sway);
     rod(garden,prev.toArray(),next.toArray(),.0035,M.leaf);prev=next;
     for(const side of[-1,1]){
      const leaf=new T.Mesh(leafGeometry,(n+k)%4?M.leaf:M.leaf2);
      leaf.position.copy(next);leaf.position.x+=tx*side*.026;leaf.position.z+=tz*side*.026;
      leaf.scale.set(.032,.047,.017);leaf.rotation.set(.4,seed*.6,side*.6);garden.add(leaf);
     }
    }
    for(let n=0;n<3;n++){
     const crown=new T.Mesh(leafGeometry,k%3?M.leaf:M.leaf2);
     crown.position.set(start.x+nx*(.03+n*.045),.92+n*.04,start.z+nz*(.03+n*.045));crown.scale.set(.08,.11,.055);crown.rotation.z=seed;garden.add(crown);
    }
   }
  }
 }
 return garden;
}
