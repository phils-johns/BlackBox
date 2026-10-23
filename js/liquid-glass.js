(function () {
    'use strict';

    // 1) Page active dans la navigation (capsule façon iOS)
    var current = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
        var href = a.getAttribute('href').split('#')[0];
        if (href === current || (current === '' && href === 'index.html')) {
            a.setAttribute('aria-current', 'page');
        }
    });

    // 1b) Évite la coupure "E-" / "Commerce" dans le titre du hero
    var h1 = document.querySelector('.hero h1');
    if (h1 && !h1.children.length) {
        var esc = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
        h1.innerHTML = esc(h1.textContent).replace(/(\S+-\S+)/g, '<span class="lg-nowrap">$1</span>');
    }

    // 2) Reflet spéculaire qui suit la souris sur la dalle hero et le dock
    //    (les cartes sont déjà gérées par js/script.js)
    if (!window.matchMedia('(hover: hover)').matches) return;

    var targets = document.querySelectorAll('.hero-content, nav, .btn');
    targets.forEach(function (el) {
        var raf = 0;
        el.addEventListener('pointermove', function (e) {
            if (raf) return;
            raf = requestAnimationFrame(function () {
                var r = el.getBoundingClientRect();
                el.style.setProperty('--mouse-x', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
                el.style.setProperty('--mouse-y', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
                raf = 0;
            });
        });
        el.addEventListener('pointerleave', function () {
            el.style.setProperty('--mouse-x', '50%');
            el.style.setProperty('--mouse-y', '0%');
        });
    });
})();
