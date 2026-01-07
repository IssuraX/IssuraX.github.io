(function(){
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  const btn = document.querySelector('.nav-toggle');
  const panel = document.getElementById('mobileNav');

  if(btn && panel){
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      btn.setAttribute('aria-label', expanded ? '메뉴 열기' : '메뉴 닫기');
    });

    // Close on nav click (mobile)
    panel.addEventListener('click', (e) => {
      const t = e.target;
      if(t && t.tagName === 'A'){
        btn.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
        btn.setAttribute('aria-label', '메뉴 열기');
      }
    });
  }
})();