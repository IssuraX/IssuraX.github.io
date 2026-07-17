/* JS 활성화 표시 (fade-up 애니메이션 활성화) */
document.documentElement.classList.replace('no-js', 'js-ready');

document.querySelectorAll('.current-year').forEach((element) => {
  const year = String(new Date().getFullYear());
  element.textContent = year;
  element.setAttribute('datetime', year);
});

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;
const usesCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const supportsIntersectionObserver = 'IntersectionObserver' in window;

/* ══ PARTICLE CANVAS ══ */
(function initParticleCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const hero = document.getElementById('hero');

  if (!canvas || !hero || prefersReducedMotion || usesCoarsePointer) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const spacing = 38;
  const baseRadius = 1.5;
  const reactionRadius = 130;
  const spring = 0.06;
  const damping = 0.78;
  const maxPush = 55;

  let width = 0;
  let height = 0;
  let dots = [];
  let mouseX = -9999;
  let mouseY = -9999;
  let animationFrame = null;
  let isActive = true;
  let resizeTimer = null;

  function createDot(originX, originY) {
    return {
      originX,
      originY,
      x: originX,
      y: originY,
      velocityX: 0,
      velocityY: 0
    };
  }

  function buildDots() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    dots = [];

    const columns = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;
    const startX = (width - (columns - 1) * spacing) / 2;
    const startY = (height - (rows - 1) * spacing) / 2;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        dots.push(createDot(startX + column * spacing, startY + row * spacing));
      }
    }
  }

  function updateDots() {
    dots.forEach((dot) => {
      const deltaX = dot.x - mouseX;
      const deltaY = dot.y - mouseY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (distance < reactionRadius && distance > 0) {
        const force = (1 - distance / reactionRadius) * maxPush;
        dot.velocityX += (deltaX / distance) * force * 0.14;
        dot.velocityY += (deltaY / distance) * force * 0.14;
      }

      dot.velocityX += (dot.originX - dot.x) * spring;
      dot.velocityY += (dot.originY - dot.y) * spring;
      dot.velocityX *= damping;
      dot.velocityY *= damping;
      dot.x += dot.velocityX;
      dot.y += dot.velocityY;
    });
  }

  function drawDots() {
    context.clearRect(0, 0, width, height);

    dots.forEach((dot) => {
      const offsetX = dot.x - dot.originX;
      const offsetY = dot.y - dot.originY;
      const displacement = Math.sqrt(offsetX ** 2 + offsetY ** 2);
      const intensity = Math.min(displacement / maxPush, 1);
      const red = Math.round(120 + (56 - 120) * intensity);
      const green = Math.round(190 + (170 - 190) * intensity);
      const blue = Math.round(235 + (245 - 235) * intensity);

      context.beginPath();
      context.arc(
        dot.x,
        dot.y,
        baseRadius + intensity * 2.2,
        0,
        Math.PI * 2
      );
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.18 + intensity * 0.55})`;
      context.fill();
    });
  }

  function animate() {
    if (!isActive) {
      animationFrame = null;
      return;
    }

    updateDots();
    drawDots();
    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!animationFrame) animationFrame = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (!animationFrame) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  function rebuildCanvas() {
    stopAnimation();
    buildDots();
    startAnimation();
  }

  function setActiveState(nextState) {
    isActive = nextState;
    if (isActive) startAnimation();
    else stopAnimation();
  }

  rebuildCanvas();

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuildCanvas, 150);
  });

  if (supportsIntersectionObserver) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      setActiveState(entry.isIntersecting && !document.hidden);
    });
    heroObserver.observe(hero);
  }

  document.addEventListener('visibilitychange', () => {
    const heroRect = hero.getBoundingClientRect();
    const isHeroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
    setActiveState(!document.hidden && isHeroVisible);
  });

  hero.addEventListener('mousemove', (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    mouseX = event.clientX - canvasRect.left;
    mouseY = event.clientY - canvasRect.top;
  });

  hero.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });
})();

/* ══ GLOW FOLLOW ══ */
(function initGlowFollow() {
  const glow = document.getElementById('hero-glow');
  const hero = document.getElementById('hero');

  if (!glow || !hero || prefersReducedMotion || usesCoarsePointer) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = null;

  function animateGlow() {
    currentX += (targetX - currentX) * 0.07;
    currentY += (targetY - currentY) * 0.07;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;

    const isMoving =
      Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2;

    animationFrame = isMoving ? requestAnimationFrame(animateGlow) : null;
  }

  hero.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    glow.style.opacity = '1';
    if (!animationFrame) animationFrame = requestAnimationFrame(animateGlow);
  });

  hero.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
})();

/* ══ PARALLAX ══ */
(function initHeroParallax() {
  if (prefersReducedMotion || usesCoarsePointer) return;

  const hero = document.getElementById('hero');
  if (!hero) return;

  const leftColumn = hero.querySelector('.hero-left');
  const rightColumn = hero.querySelector('.hero-right');
  if (!leftColumn || !rightColumn) return;

  const transition = 'transform .6s cubic-bezier(.23, 1, .32, 1)';
  leftColumn.style.transition = transition;
  rightColumn.style.transition = transition;

  hero.addEventListener('mousemove', (event) => {
    const heroRect = hero.getBoundingClientRect();
    const horizontalRatio = (event.clientX - heroRect.left) / heroRect.width - 0.5;
    const verticalRatio = (event.clientY - heroRect.top) / heroRect.height - 0.5;

    leftColumn.style.transform =
      `translate(${horizontalRatio * 8}px, ${verticalRatio * 5}px)`;
    rightColumn.style.transform =
      `translate(${-horizontalRatio * 10}px, ${-verticalRatio * 6}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    leftColumn.style.transform = '';
    rightColumn.style.transform = '';
  });
})();

/* ══ HERO TEXT ANIMATIONS ══ */
(function initHeroTextAnimations() {
  const label = document.getElementById('heroLabel');
  const nameWrapper = document.getElementById('heroNameWrap');
  const nameCharacters = document.getElementById('heroNameChars');
  const role = document.getElementById('heroRole');
  const roleText = document.getElementById('heroRoleText');
  const roleCursor = document.getElementById('heroRoleCursor');
  const description = document.getElementById('heroDesc');
  const tags = document.getElementById('heroTags');
  const callToAction = document.getElementById('heroCta');
  const statCards = [
    document.getElementById('sc1'),
    document.getElementById('sc2'),
    document.getElementById('sc3')
  ].filter(Boolean);

  const requiredElements = [
    label,
    nameWrapper,
    nameCharacters,
    role,
    roleText,
    roleCursor,
    description,
    tags,
    callToAction
  ];
  if (requiredElements.some((element) => !element)) return;

  const name = '신동혁';
  const jobTitle = 'Web Publisher';
  const glitchCharacters = [...'SHINDONGHYEOKWEBPUBLISHER'];

  function revealAllImmediately() {
    label.classList.add('in');
    nameCharacters.textContent = name;
    role.classList.add('in');
    roleText.textContent = jobTitle;
    roleCursor.style.display = 'none';
    [description, tags, callToAction, ...statCards].forEach((element) => {
      element.classList.add('in');
    });
  }

  if (prefersReducedMotion) {
    revealAllImmediately();
    return;
  }

  function randomGlitchCharacter() {
    return glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)];
  }

  function triggerNameGlitch() {
    nameWrapper.classList.add('glitch');
    setTimeout(() => nameWrapper.classList.remove('glitch'), 400);
  }

  function animateStatNumber(statCard) {
    const numberElement = statCard.querySelector('.stat-num');
    if (!numberElement || !numberElement.dataset.count) return;

    const target = Number.parseFloat(numberElement.dataset.count);
    if (!Number.isFinite(target)) return;

    const suffix = numberElement.dataset.suffix || '';
    const hasDecimal = !Number.isInteger(target);
    const duration = 1200;
    let startedAt = null;

    function easeOut(progress) {
      return 1 - (1 - progress) ** 3;
    }

    function update(timestamp) {
      if (!startedAt) startedAt = timestamp;

      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const value = easeOut(progress) * target;
      const displayValue = hasDecimal ? value.toFixed(1) : Math.floor(value);
      numberElement.textContent = `${displayValue}${suffix}`;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  setTimeout(() => label.classList.add('in'), 200);

  const characters = [...name].map((finalCharacter, index) => ({
    finalCharacter,
    element: null,
    delay: 400 + index * 120
  }));

  characters.forEach((character) => {
    const characterElement = document.createElement('span');
    characterElement.className = 'char';
    characterElement.textContent = randomGlitchCharacter();
    character.element = characterElement;
    nameCharacters.appendChild(characterElement);
  });

  characters.forEach((character) => {
    setTimeout(() => {
      const { element } = character;
      if (!element) return;

      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';

      let iteration = 0;
      const scrambleTimer = setInterval(() => {
        if (iteration > 6) {
          element.textContent = character.finalCharacter;
          element.style.color = '';
          clearInterval(scrambleTimer);
          return;
        }

        element.textContent = randomGlitchCharacter();
        element.style.color = iteration % 2 ? 'var(--accent2)' : 'var(--accent)';
        iteration += 1;
      }, 55);
    }, character.delay);
  });

  const lastCharacterDelay = characters.at(-1).delay + 400;

  setTimeout(() => {
    triggerNameGlitch();
    setInterval(triggerNameGlitch, 7000);
  }, lastCharacterDelay + 300);

  setTimeout(() => {
    role.classList.add('in');
    let visibleLength = 0;

    const typingTimer = setInterval(() => {
      if (visibleLength <= jobTitle.length) {
        roleText.textContent = jobTitle.slice(0, visibleLength);
        visibleLength += 1;
        return;
      }

      clearInterval(typingTimer);
      setTimeout(() => {
        roleCursor.style.display = 'none';
      }, 1500);
    }, 65);
  }, lastCharacterDelay - 100);

  const contentRevealDelay = lastCharacterDelay + 200;
  setTimeout(() => description.classList.add('in'), contentRevealDelay);
  setTimeout(() => tags.classList.add('in'), contentRevealDelay + 150);
  setTimeout(() => callToAction.classList.add('in'), contentRevealDelay + 300);

  statCards.forEach((statCard, index) => {
    setTimeout(() => {
      statCard.classList.add('in');
      animateStatNumber(statCard);
    }, contentRevealDelay + 400 + index * 140);
  });
})();

/* ══ SCROLL REVEAL & SKILL BARS ══ */
(function initScrollReveal() {
  const fadeUpElements = document.querySelectorAll('.fade-up');
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillsGrid = document.getElementById('skillsGrid');

  document.querySelectorAll('.skill-item').forEach((item) => {
    const name = item.querySelector('.skill-name');
    const bar = item.querySelector('.skill-bar');
    if (!name || !bar) return;

    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', `${name.textContent.trim()} 숙련도`);
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', bar.dataset.w || '0');
  });

  function revealAll() {
    fadeUpElements.forEach((element) => element.classList.add('visible'));
    skillBars.forEach((bar) => {
      bar.style.width = `${bar.dataset.w || 0}%`;
    });
  }

  if (prefersReducedMotion || !supportsIntersectionObserver) {
    revealAll();
    return;
  }

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeUpElements.forEach((element) => fadeObserver.observe(element));

  if (!skillsGrid) return;

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.querySelectorAll('.skill-bar').forEach((bar) => {
        bar.style.transition = 'width 1s ease';
        bar.style.width = `${bar.dataset.w || 0}%`;
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  skillObserver.observe(skillsGrid);
})();

/* ══ WORKS SWIPER ══ */
(function initWorksSwiper() {
  const worksElement = document.getElementById('worksSwiper');
  if (!worksElement || typeof Swiper === 'undefined') return;

  new Swiper(worksElement, {
    slidesPerView: 1,
    spaceBetween: 14,
    speed: 550,
    grabCursor: true,
    pagination: {
      el: '.works-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.works-next',
      prevEl: '.works-prev'
    },
    breakpoints: {
      768: { slidesPerView: 1.2, spaceBetween: 16 },
      1024: { slidesPerView: 2, spaceBetween: 18 },
      1400: { slidesPerView: 2.35, spaceBetween: 20 }
    }
  });
})();

/* ══ ACTIVE NAV ══ */
(function initActiveNavigation() {
  if (!supportsIntersectionObserver) return;

  const sectionIds = ['hero', 'projects', 'works', 'skills', 'about', 'contact'];
  const navigationLinks = document.querySelectorAll('.nav-links a');
  const sideDots = document.querySelectorAll('.side-dot');

  function updateLinkState(link, isActive) {
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }

  function setActiveSection(sectionId) {
    navigationLinks.forEach((link) => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      updateLinkState(link, targetId === sectionId);
    });

    sideDots.forEach((dot) => {
      updateLinkState(dot, dot.dataset.target === sectionId);
    });
  }

  const navigationHeight = getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-h')
    .trim();

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveSection(entry.target.id);
    });
  }, {
    rootMargin: `-${navigationHeight} 0px -50% 0px`,
    threshold: 0
  });

  sectionIds.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) sectionObserver.observe(section);
  });
})();

/* ══ MOBILE NAVIGATION ══ */
(function initMobileNavigation() {
  const menuButton = document.getElementById('hamburger');
  const navigationDrawer = document.getElementById('navDrawer');
  if (!menuButton || !navigationDrawer) return;

  function setDrawerState(isOpen, { restoreFocus = false } = {}) {
    menuButton.classList.toggle('open', isOpen);
    navigationDrawer.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    navigationDrawer.setAttribute('aria-hidden', String(!isOpen));
    navigationDrawer.inert = !isOpen;
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', () => {
    const shouldOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    setDrawerState(shouldOpen);
  });

  navigationDrawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setDrawerState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (!navigationDrawer.classList.contains('open')) return;

    if (event.key === 'Escape') {
      setDrawerState(false, { restoreFocus: true });
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = [
      menuButton,
      ...navigationDrawer.querySelectorAll('a')
    ];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
})();

/* ══ CONTACT VISITOR COUNTER ══ */
(function initVisitorCounter() {
  const yesterdayElement = document.getElementById('visitorYesterday');
  const todayElement = document.getElementById('visitorToday');
  if (!yesterdayElement || !todayElement) return;

  const storageKey = 'portfolioVisitorCounterDaily';
  const now = new Date();
  const todayKey = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');

  let state = { date: todayKey, today: 0, yesterday: 0 };

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');

    if (saved && typeof saved === 'object') {
      const savedToday = Number(saved.today);
      const savedYesterday = Number(saved.yesterday);

      state = {
        date: typeof saved.date === 'string' ? saved.date : todayKey,
        today: Number.isFinite(savedToday) && savedToday >= 0
          ? Math.floor(savedToday)
          : 0,
        yesterday: Number.isFinite(savedYesterday) && savedYesterday >= 0
          ? Math.floor(savedYesterday)
          : 0
      };
    }

    state = state.date === todayKey
      ? { ...state, today: state.today + 1 }
      : { date: todayKey, today: 1, yesterday: state.today };

    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (_error) {
    // 저장소 접근이 제한된 환경에서는 기본값을 표시합니다.
  }

  yesterdayElement.textContent = `${state.yesterday.toLocaleString('ko-KR')}명`;
  todayElement.textContent = `${state.today.toLocaleString('ko-KR')}명`;
})();
