(function () {
  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Theme (light/dark)
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');

  const applyTheme = (t) => {
    root.setAttribute('data-theme', t);
    if (themeBtn) {
      const nextLabel = t === 'dark' ? '라이트 모드 켜기' : '다크 모드 켜기';
      themeBtn.setAttribute('aria-label', nextLabel);
      themeBtn.setAttribute('title', nextLabel);
      themeBtn.textContent = t === 'dark' ? '☀' : '◐';
    }
  };

  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  } else {
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  // DOM Ready (jQuery)
  $(function () {
    /** -----------------------------
     * Mobile nav (slide + PC 전환 시 닫기)
     * ---------------------------- */
    const BREAKPOINT = 920; // CSS 브레이크포인트와 동일하게
    const $btn = $('.nav-toggle');
    const $panel = $('#mobileNav');

    const isDesktop = () => window.innerWidth > BREAKPOINT;

    const closeMobileNav = (instant = true) => {
      $btn.attr('aria-expanded', 'false').attr('aria-label', '메뉴 열기');
      if (instant) $panel.stop(true, true).hide();
      else $panel.stop(true, true).slideUp(180);
    };

    const openMobileNav = () => {
      $btn.attr('aria-expanded', 'true').attr('aria-label', '메뉴 닫기');
      $panel.stop(true, true).slideDown(180);
    };

    // 초기 로드: PC면 무조건 닫기
    if (isDesktop()) closeMobileNav(true);

    // 버튼 토글
    $btn.on('click', function () {
      if (isDesktop()) {
        closeMobileNav(true);
        return;
      }
      const expanded = $(this).attr('aria-expanded') === 'true';
      if (expanded) closeMobileNav(false);
      else openMobileNav();
    });

    // 메뉴 클릭 시 닫기
    $panel.on('click', 'a', function () {
      closeMobileNav(false);
    });

    // 리사이즈: PC로 넘어가면 닫기 (디바운스)
    let t = null;
    $(window).on('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        if (isDesktop()) closeMobileNav(true);
      }, 80);
    });

    // matchMedia로도 보강
    if (window.matchMedia) {
      const mq = window.matchMedia(`(min-width:${BREAKPOINT + 1}px)`);
      const handler = (e) => {
        if (e.matches) closeMobileNav(true);
      };
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else if (mq.addListener) mq.addListener(handler);
    }

    /** -----------------------------
     * Swiper (projects)
     * ---------------------------- */
    const el = document.querySelector('.project-swiper');
    if (el && typeof Swiper !== 'undefined') {
      new Swiper('.project-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        centeredSlides: false,
        loop: false,
        grabCursor: true,

        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }
  });
})();