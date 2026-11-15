// Paint the lightweight HTML loader before importing the synchronous 3D scene.
await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
try{
 await import('./main.js');
}catch(error){
 console.error('Unable to start house viewer',error);
 document.querySelector('#loading-message').textContent='Chưa tải được phối cảnh.';
 const retry=document.querySelector('#loading-retry');retry.hidden=false;retry.onclick=()=>location.reload();
 document.querySelector('.loading-ring').style.animationPlayState='paused';
}
