const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.slide-dot')];
const counter = document.querySelector('#slide-current');
let activeSlide = 0;
let slideTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === activeSlide));
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === activeSlide);
    dot.setAttribute('aria-pressed', String(i === activeSlide));
  });
  if (counter) counter.textContent = String(activeSlide + 1).padStart(2, '0');
}
function startSlider() {
  window.clearInterval(slideTimer);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 6500);
  }
}
dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); startSlider(); }));
startSlider();

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
  mainNav.classList.toggle('open', !isOpen);
});
mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menú');
  mainNav.classList.remove('open');
}));
window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();


// Mantiene resaltada en el menú la sección que se está viendo.
const sectionLinks = [...document.querySelectorAll('.main-nav .nav-link')];
const navSections = sectionLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach(link => {
      const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
navSections.forEach(section => sectionObserver.observe(section));
