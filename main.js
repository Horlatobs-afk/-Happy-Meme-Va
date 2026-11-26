const $=(s,r=document)=>r.querySelector(s),V=window.VAULT||{videos:[],pictures:[]};
/* cinematic intro: once per visit, home page only */
const intro=$('#intro');
if(intro){ if(sessionStorage.seen){intro.remove()} else {sessionStorage.seen=1;setTimeout(()=>{intro.classList.add('go');setTimeout(()=>intro.remove(),1100)},1900)} }
/* cursor glow + hero parallax */
const glow=$('#glow'),fr=$('.frame');
addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';
 if(fr){const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;fr.style.setProperty('--ry',-6+x*14+'deg');fr.style.setProperty('--rx',3-y*14+'deg');fr.style.setProperty('--px',x*-14+'px');fr.style.setProperty('--py',y*-14+'px')}});
/* gold dust */
const c=$('#dust'),g=c.getContext('2d');let P=[];
function size(){c.width=innerWidth;c.height=innerHeight;P=Array.from({length:Math.min(70,innerWidth/18)},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2.4+.6,v:Math.random()*.5+.15,a:Math.random()*6}))}
size();addEventListener('resize',size);
(function loop(){g.clearRect(0,0,c.width,c.height);for(const p of P){p.y-=p.v;p.a+=.02;p.x+=Math.sin(p.a)*.4;if(p.y<-5){p.y=c.height+5;p.x=Math.random()*c.width}
 g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fillStyle=`rgba(245,184,0,${.25+Math.sin(p.a)*.2})`;g.fill()}requestAnimationFrame(loop)})();
/* scroll reveal */
const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&(x.target.classList.add('in'),io.unobserve(x.target))),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
/* counts on home */
$('#vc')&&($('#vc').textContent=V.videos.length+' videos');$('#pc')&&($('#pc').textContent=V.pictures.length+' pictures');
/* galleries */
const grid=$('#grid');
if(grid){const type=grid.dataset.type,list=V[type],isV=type==='videos',dir=`assets/${type}/`;
 if(!list.length){grid.innerHTML=Array.from({length:isV?3:6},()=>`<div class="item empty"><div><img src="assets/logo.png" alt=""><b>This slot is open</b>Add ${type} in js/media.js</div></div>`).join('')}
 else grid.innerHTML=list.map((m,i)=>`<div class="item rv" tabindex="0" data-i="${i}">${isV?`<video src="${encodeURI(dir+m.file)}#t=0.5" muted loop playsinline preload="metadata"></video><span class="play"></span>`:`<img src="${encodeURI(dir+m.file)}" alt="${m.title||''}" loading="lazy">`}<div class="cap">${m.title||''}</div></div>`).join('');
 const lb=$('#lb'),box=$('#lbm'),cap=$('#lbt');let cur=0;
 const show=i=>{cur=(i+list.length)%list.length;const m=list[cur];box.innerHTML=isV?`<video src="${encodeURI(dir+m.file)}" controls autoplay playsinline></video>`:`<img src="${encodeURI(dir+m.file)}" alt="">`;cap.textContent=m.title||'';lb.classList.add('open')};
 const close=()=>{lb.classList.remove('open');box.innerHTML=''};
 grid.querySelectorAll('.item:not(.empty)').forEach(el=>{io.observe(el);el.onclick=()=>show(+el.dataset.i);el.onkeydown=e=>e.key==='Enter'&&show(+el.dataset.i);
  if(isV){const v=$('video',el);el.onmouseenter=()=>v.play();el.onmouseleave=()=>{v.pause();v.currentTime=.5}}});
 $('.x',lb).onclick=close;$('.p',lb).onclick=()=>show(cur-1);$('.n',lb).onclick=()=>show(cur+1);lb.onclick=e=>e.target===lb&&close();
 addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;e.key==='Escape'&&close();e.key==='ArrowLeft'&&show(cur-1);e.key==='ArrowRight'&&show(cur+1)})}
