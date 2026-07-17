const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;
const supportsIntersectionObserver = 'IntersectionObserver' in window;

document.querySelectorAll('.current-year').forEach((element) => {
  const year = String(new Date().getFullYear());
  element.textContent = year;
  element.setAttribute('datetime', year);
});

/* ══ SCROLL REVEAL ══ */
(function initScrollReveal() {
  const fadeUpElements = document.querySelectorAll('.fade-up');

  if (prefersReducedMotion || !supportsIntersectionObserver) {
    fadeUpElements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      currentObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  fadeUpElements.forEach((element) => observer.observe(element));
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
