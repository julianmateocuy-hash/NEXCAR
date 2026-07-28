// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
toggle?.addEventListener('click', () => mobile.classList.toggle('open'));
mobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));

// Nav shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) nav.style.boxShadow = '0 4px 20px -8px rgba(0,0,0,.1)';
  else nav.style.boxShadow = 'none';
});
