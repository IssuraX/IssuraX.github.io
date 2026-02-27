/* JS 활성화 표시 (fade-up 애니메이션 활성화) */
document.documentElement.classList.replace('no-js','js-ready');

/* ══ PARTICLE CANVAS ══ */
(function(){
  const canvas=document.getElementById('hero-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const SP=38,RA=1.5,RR=130,SPR=0.06,DAM=0.78,MP=55;
  let W,H,dots=[],mx=-9999,my=-9999,raf;
  function Dot(ox,oy){this.ox=ox;this.oy=oy;this.x=ox;this.y=oy;this.vx=0;this.vy=0}
  function build(){
    W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;dots=[];
    const cols=Math.ceil(W/SP)+2,rows=Math.ceil(H/SP)+2;
    const ox0=(W-(cols-1)*SP)/2,oy0=(H-(rows-1)*SP)/2;
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)dots.push(new Dot(ox0+c*SP,oy0+r*SP));
  }
  function frame(){
    for(let i=0,l=dots.length;i<l;i++){
      const d=dots[i],dx=d.x-mx,dy=d.y-my,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<RR&&dist>0){const f=(1-dist/RR)*MP;d.vx+=(dx/dist)*f*.14;d.vy+=(dy/dist)*f*.14}
      d.vx+=(d.ox-d.x)*SPR;d.vy+=(d.oy-d.y)*SPR;d.vx*=DAM;d.vy*=DAM;d.x+=d.vx;d.y+=d.vy;
    }
    ctx.clearRect(0,0,W,H);
    for(let i=0,l=dots.length;i<l;i++){
      const d=dots[i],ddx=d.x-d.ox,ddy=d.y-d.oy,disp=Math.sqrt(ddx*ddx+ddy*ddy),t=Math.min(disp/MP,1);
      const Rv=Math.round(50+(232-50)*t),Gv=Math.round(50+(255-50)*t),Bv=Math.round(50+(71-50)*t);
      ctx.beginPath();ctx.arc(d.x,d.y,RA+t*2.2,0,Math.PI*2);
      ctx.fillStyle=`rgba(${Rv},${Gv},${Bv},${.18+t*.55})`;ctx.fill();
    }
    raf=requestAnimationFrame(frame);
  }
  function init(){build();if(raf)cancelAnimationFrame(raf);frame()}
  init();
  let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(init,150)});
  const heroEl=document.getElementById('hero');
  heroEl.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
  heroEl.addEventListener('mouseleave',()=>{mx=-9999;my=-9999});
  if(window.matchMedia('(pointer:coarse)').matches){
    heroEl.addEventListener('touchmove',e=>{const r=canvas.getBoundingClientRect();mx=e.touches[0].clientX-r.left;my=e.touches[0].clientY-r.top},{passive:true});
    heroEl.addEventListener('touchend',()=>{mx=-9999;my=-9999});
  }
})();

/* ══ GLOW FOLLOW ══ */
(function(){
  const glow=document.getElementById('hero-glow');
  const hero=document.getElementById('hero');
  if(!glow||!hero)return;
  let tx=0,ty=0,cx=0,cy=0;
  hero.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;glow.style.opacity='1'});
  hero.addEventListener('mouseleave',()=>{glow.style.opacity='0'});
  (function a(){cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;glow.style.left=cx+'px';glow.style.top=cy+'px';requestAnimationFrame(a)})();
})();

/* ══ PARALLAX ══ */
(function(){
  if(window.matchMedia('(pointer:coarse)').matches)return;
  const hero=document.getElementById('hero');
  const left=hero.querySelector('.hero-left'),right=hero.querySelector('.hero-right');
  if(!left||!right)return;
  left.style.transition=right.style.transition='transform .6s cubic-bezier(.23,1,.32,1)';
  hero.addEventListener('mousemove',e=>{
    const r=hero.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;
    left.style.transform=`translate(${nx*8}px,${ny*5}px)`;
    right.style.transform=`translate(${-nx*10}px,${-ny*6}px)`;
  });
  hero.addEventListener('mouseleave',()=>{left.style.transform=right.style.transform=''});
})();

/* ══ HERO TEXT ANIMATIONS ══ */
(function(){
  const label=document.getElementById('heroLabel');
  const nameWrap=document.getElementById('heroNameWrap'),charsEl=document.getElementById('heroNameChars');
  const role=document.getElementById('heroRole'),roleText=document.getElementById('heroRoleText'),roleCur=document.getElementById('heroRoleCursor');
  const desc=document.getElementById('heroDesc'),tags=document.getElementById('heroTags'),cta=document.getElementById('heroCta');
  const sc1=document.getElementById('sc1'),sc2=document.getElementById('sc2'),sc3=document.getElementById('sc3');
  const NAME='신동혁',ROLE='Web Publisher';
  const GL='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?';

  setTimeout(()=>label.classList.add('in'),200);

  const chars=NAME.split('').map((ch,i)=>({final:ch,el:null,settled:false,delay:400+i*120}));
  chars.forEach(c=>{
    const s=document.createElement('span');s.className='char';
    s.textContent=GL[Math.floor(Math.random()*GL.length)];c.el=s;charsEl.appendChild(s);
  });
  chars.forEach(c=>{
    setTimeout(()=>{
      c.el.style.opacity='1';c.el.style.transform='translateY(0)';
      let it=0;
      const sc=setInterval(()=>{
        if(it++>6||c.settled){c.el.textContent=c.final;c.el.style.color='';c.settled=true;clearInterval(sc)}
        else{c.el.textContent=GL[Math.floor(Math.random()*GL.length)];c.el.style.color=it%2?'var(--accent2)':'var(--accent)'}
      },55);
    },c.delay);
  });

  const lastDelay=chars[chars.length-1].delay+400;
  function trigGlitch(){nameWrap.classList.add('glitch');setTimeout(()=>nameWrap.classList.remove('glitch'),400)}
  setTimeout(()=>{trigGlitch();setInterval(trigGlitch,6000+Math.random()*4000)},lastDelay+300);

  setTimeout(()=>{
    role.classList.add('in');let i=0;
    const t=setInterval(()=>{
      if(i<=ROLE.length){roleText.textContent=ROLE.slice(0,i);i++}
      else{clearInterval(t);setTimeout(()=>roleCur.style.display='none',1500)}
    },65);
  },lastDelay-100);

  const base=lastDelay+200;
  setTimeout(()=>desc.classList.add('in'),base);
  setTimeout(()=>tags.classList.add('in'),base+150);
  setTimeout(()=>cta.classList.add('in'),base+300);

  /* stat counter */
  [sc1,sc2,sc3].forEach((el,i)=>{
    if(!el)return;
    setTimeout(()=>{
      el.classList.add('in');
      const numEl=el.querySelector('.stat-num');
      const target=parseFloat(numEl.dataset.count),suffix=numEl.dataset.suffix||'',isF=String(target).includes('.');
      let st=null;
      const eO=t=>1-Math.pow(1-t,3);
      const run=ts=>{if(!st)st=ts;const p=Math.min((ts-st)/1200,1),v=eO(p)*target;numEl.textContent=(isF?v.toFixed(1):Math.floor(v))+suffix;if(p<1)requestAnimationFrame(run)};
      requestAnimationFrame(run);
    },base+400+i*140);
  });
})();

/* ══ SCROLL REVEAL (IntersectionObserver) ══ */
(function(){
  /* fade-up */
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
  },{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));

  /* skill bars */
  const sObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll('.skill-bar').forEach(b=>{b.style.transition='width 1s ease';b.style.width=b.dataset.w+'%'});
        sObs.unobserve(e.target);
      }
    });
  },{threshold:.2});
  const sg=document.getElementById('skillsGrid');
  if(sg)sObs.observe(sg);
})();

/* ══ ACTIVE NAV via IntersectionObserver ══ */
(function(){
  const sections=['hero','projects','skills','about','contact'];
  const navLinks=document.querySelectorAll('.nav-links a');
  const sideDots=document.querySelectorAll('.side-dot');

  function setActive(id){
    navLinks.forEach(a=>{
      const href=a.getAttribute('href').replace('#','');
      a.classList.toggle('active',href===id);
    });
    sideDots.forEach(d=>d.classList.toggle('active',d.dataset.target===id));
  }

  /* rootMargin: 위 nav 높이만큼 offset */
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)});
  },{rootMargin:`-${getComputedStyle(document.documentElement).getPropertyValue('--nav-h')} 0px -50% 0px`,threshold:0});

  sections.forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el)});

  /* side dot 클릭 → 해당 섹션으로 스크롤 */
  sideDots.forEach(d=>{
    d.addEventListener('click',()=>{
      const el=document.getElementById(d.dataset.target);
      if(el)el.scrollIntoView({behavior:'smooth'});
    });
  });
})();

/* ══ HAMBURGER ══ */
(function(){
  const hamburger=document.getElementById('hamburger');
  const navDrawer=document.getElementById('navDrawer');
  hamburger.addEventListener('click',()=>{
    const isOpen=hamburger.classList.toggle('open');
    navDrawer.classList.toggle('open',isOpen);
    hamburger.setAttribute('aria-expanded',isOpen);
    navDrawer.setAttribute('aria-hidden',!isOpen);
    document.body.style.overflow=isOpen?'hidden':'';
  });
  navDrawer.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click',()=>{
      hamburger.classList.remove('open');
      navDrawer.classList.remove('open');
      document.body.style.overflow='';
    });
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&navDrawer.classList.contains('open')){
      hamburger.classList.remove('open');
      navDrawer.classList.remove('open');
      document.body.style.overflow='';
    }
  });
})();

/* ══ CONTACT VISITOR COUNTER (localStorage) ══ */
(function(){
  const counterEl=document.getElementById('visitorCount');
  if(!counterEl)return;

  const KEY='portfolioVisitorCount';
  let count=parseInt(localStorage.getItem(KEY),10);
  if(Number.isNaN(count)||count<0)count=0;
  count+=1;
  localStorage.setItem(KEY,String(count));

  counterEl.textContent=count.toLocaleString('ko-KR')+'명';
})();