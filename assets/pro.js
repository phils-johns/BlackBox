/* PRO — finitions UI */
(function () {
  'use strict';
  var doc = document, WA = window.__PRO_WA__ || {};

  var header = doc.querySelector('header') || doc.querySelector('nav');
  if (header) {
    var cs = getComputedStyle(header);
    if (cs.position === 'static') {
      header.style.position = 'sticky'; header.style.top = '0'; header.style.zIndex = '1000';
      if (/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)) {
        header.style.backgroundColor = getComputedStyle(doc.body).backgroundColor;
      }
    }
  }

  var current = location.pathname.split('/').pop() || 'index.html';
  doc.querySelectorAll('nav a[href]').forEach(function (a) {
    var h = a.getAttribute('href').split('#')[0].split('/').pop();
    if (h === current || (current === '' && h === 'index.html')) a.setAttribute('aria-current', 'page');
  });

  var bar = doc.createElement('div'); bar.id = 'pro-progress'; doc.body.appendChild(bar);
  var top = doc.createElement('button'); top.id = 'pro-top'; top.type = 'button';
  top.setAttribute('aria-label', 'Retour en haut'); top.textContent = '↑'; doc.body.appendChild(top);
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  var ticking = false;
  function onScroll() {
    var y = window.scrollY || doc.documentElement.scrollTop;
    var h = doc.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    top.classList.toggle('show', y > 500);
    if (header) header.classList.toggle('pro-scrolled', y > 10);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('pro-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    doc.querySelectorAll('main section, section, article, .card, [class*="card"]').forEach(function (el) {
      if (el.closest('header,nav,footer')) return;
      el.classList.add('pro-reveal'); io.observe(el);
    });
  }

  if (WA.number) {
    var a = doc.createElement('a'); a.id = 'pro-wa';
    a.href = 'https://wa.me/' + WA.number + '?text=' + encodeURIComponent(WA.message || '');
    a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', 'Discuter sur WhatsApp');
    a.innerHTML = '<span aria-hidden="true" style="font-size:28px;line-height:1">💬</span>';
    doc.body.appendChild(a);
  }
})();
