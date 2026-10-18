(() => {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.slider-dot'));
  const prev = document.querySelector('.slider-arrow.prev');
  const next = document.querySelector('.slider-arrow.next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer = null;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
      slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function restartTimer() {
    if (timer) window.clearInterval(timer);
    if (!reducedMotion) timer = window.setInterval(() => showSlide(current + 1), 6500);
  }

  prev.addEventListener('click', () => { showSlide(current - 1); restartTimer(); });
  next.addEventListener('click', () => { showSlide(current + 1); restartTimer(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); restartTimer(); }));

  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', () => { if (timer) window.clearInterval(timer); });
  hero.addEventListener('mouseleave', restartTimer);
  showSlide(0);
  restartTimer();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  }));

  document.getElementById('year').textContent = new Date().getFullYear();
})();