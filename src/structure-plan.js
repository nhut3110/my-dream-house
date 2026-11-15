import {entrySpan,HEIGHT,THIRD} from './design.js';

// Architectural coordination only: five paired axes, not a structural calculation.
// Spans respond to openings on both storeys; do not evenly space through windows.
export const STRUCTURE={section:.25,axes:[2.3,4.8,6.6,9.7,13],cutHeight:.8,stage:'concept-only'};
export const columnPlan=STRUCTURE.axes.flatMap((z,i)=>{
 const [left,right]=entrySpan(z);
 return [{id:`C${i*2+1}`,axis:i+1,side:'left',x:left,z},{id:`C${i*2+2}`,axis:i+1,side:'right',x:right,z}];
});

export function buildColumns({interiors,group,box,M,wallParts}){
 for(const [floor,parent] of interiors.slice(0,3).entries()){
  const root=group(parent);root.name='He_cot_10_truc_minh_hoa';
  root.userData={stage:STRUCTURE.stage,section:STRUCTURE.section,verticalLines:10};
  for(const c of columnPlan){
   // The terrace carries the two lower storeys' ten column lines. Only the
   // enclosed penthouse continues to roof height; other heads meet parapets.
   const height=floor<2?HEIGHT:(c.z>THIRD.enclosure.front&&c.z<THIRD.enclosure.back?THIRD.enclosure.height:THIRD.terrace.parapet+THIRD.terrace.rail);
   const full=group(root),low=group(root);
   full.name=`${c.id}_Tang_${floor+1}`;low.name=`${c.id}_Mat_cat_${floor+1}`;
   for(const [g,h] of [[full,height],[low,STRUCTURE.cutHeight]]){
    g.userData={...c,floor,section:STRUCTURE.section,conceptOnly:true};
    box(g,c.x,0,c.z,STRUCTURE.section,h,STRUCTURE.section,M.stone);
   }
   low.visible=false;wallParts.push({full,low,floor});
  }
 }
}
