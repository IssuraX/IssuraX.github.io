/* fade-up */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
},{threshold:.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));

/* hamburger */
(function(){
  const h=document.getElementById('hamburger'),d=document.getElementById('navDrawer');
  h.addEventListener('click',()=>{const o=h.classList.toggle('open');d.classList.toggle('open',o);h.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
  d.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{h.classList.remove('open');d.classList.remove('open');document.body.style.overflow=''}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){h.classList.remove('open');d.classList.remove('open');document.body.style.overflow=''}});
})();