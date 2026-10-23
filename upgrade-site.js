#!/usr/bin/env node
/**
 * upgrade-site.js — Phils-Johns Digital Agence
 * Rend le site plus professionnel : SEO, réseaux sociaux, accessibilité,
 * performance, sécurité (Vercel) et finitions UI (animations, bouton WhatsApp...).
 *
 * Utilisation (dans le terminal VS Code, à la racine du projet) :
 *   node upgrade-site.js
 *
 * - Sans dépendance (Node.js 16+)
 * - Sauvegarde automatique des .html dans _backup_<date>/
 * - Peut être relancé sans doublons (marqueurs PRO)
 */

const fs = require('fs');
const path = require('path');

/* ====================== CONFIG (à adapter) ====================== */
const CONFIG = {
  siteUrl: 'https://philjohns.vercel.app',
  brand: 'Phils-Johns Digital Agence',
  themeColor: '#0f172a',
  whatsapp: '22879905677',          // numéro au format international, sans + ni espaces
  whatsappMessage: 'Bonjour Phils-Johns, je souhaite un devis.',
  telephone: '+22879905677',
  ogImage: '/assets/og-image.png',  // image 1200x630 à ajouter dans /assets
  pages: {
    'index.html':    { title: 'Phils-Johns Digital Agence | Graphisme & E-Commerce Premium', desc: 'Agence digitale à Lomé : design graphique, branding, boutique dropshipping et ressources numériques. Transformez votre vision en réalité.' },
    'services.html': { title: 'Services & Tarifs | Phils-Johns Digital Agence', desc: 'Logo, branding, affiches, illustrations : découvrez nos services de design graphique et nos tarifs.' },
    'boutique.html': { title: 'Boutique | Phils-Johns Digital Agence', desc: 'Sélection curatée de produits lifestyle, vêtements et accessoires. Livraison rapide et fiable.' },
    'etagere.html':  { title: "L'Étagère Digitale | Phils-Johns Digital Agence", desc: 'Livres et formations digitales pour développer vos compétences, accessibles immédiatement.' },
    'apropos.html':  { title: 'À propos | Phils-Johns Digital Agence', desc: "Découvrez l'équipe, la vision et les valeurs de Phils-Johns Digital Agence." },
    'contact.html':  { title: 'Contact | Phils-Johns Digital Agence', desc: 'Contactez-nous pour un devis ou une collaboration : design, branding, e-commerce.' },
  },
};
/* ================================================================ */

const ROOT = process.cwd();
const IGNORE = new Set(['node_modules', '.git', '.vercel', 'assets-pro']);
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const BACKUP = path.join(ROOT, `_backup_${stamp}`);

const log = (m) => console.log(m);
const write = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, 'utf8'); };

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(e.name) || e.name.startsWith('_backup_')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/* ---------------------- Fichiers générés ---------------------- */

const PRO_CSS = `/* PRO — améliorations non destructives (faible spécificité) */
:where(html){scroll-behavior:smooth;-webkit-text-size-adjust:100%}
:where(body){text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased}
:where(img,video){max-width:100%;height:auto}
::selection{background:rgba(99,102,241,.25)}

/* Accessibilité */
:where(a,button,input,textarea,select,[tabindex]):focus-visible{outline:3px solid #6366f1;outline-offset:3px;border-radius:6px}
.pro-skip{position:absolute;left:-9999px;top:8px;z-index:10001;background:#111;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none}
.pro-skip:focus{left:8px}
:where(nav a)[aria-current="page"]{font-weight:700;text-decoration:underline;text-underline-offset:6px}

/* Transitions boutons / cartes */
:where(a.btn,.btn,button,[class*="btn"],.card,[class*="card"]){transition:transform .25s ease,box-shadow .25s ease,opacity .25s ease}
:where(a.btn,.btn,button,[class*="btn"]):hover{transform:translateY(-2px)}
:where(a.btn,.btn,button,[class*="btn"]):active{transform:translateY(0)}
:where(.card,[class*="card"]):hover{transform:translateY(-6px);box-shadow:0 18px 40px rgba(0,0,0,.12)}

/* En-tête */
header.pro-scrolled,nav.pro-scrolled{box-shadow:0 6px 24px rgba(0,0,0,.12);backdrop-filter:saturate(180%) blur(10px);-webkit-backdrop-filter:saturate(180%) blur(10px)}
header,nav{transition:box-shadow .3s ease,background-color .3s ease}

/* Apparition au scroll (activée uniquement si JS actif) */
.pro-reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
.pro-reveal.pro-in{opacity:1;transform:none}

/* Barre de progression */
#pro-progress{position:fixed;top:0;left:0;height:3px;width:0;background:linear-gradient(90deg,#6366f1,#ec4899);z-index:10000;transition:width .1s linear}

/* Retour en haut */
#pro-top{position:fixed;right:20px;bottom:90px;width:44px;height:44px;border:none;border-radius:50%;background:#111;color:#fff;font-size:20px;cursor:pointer;opacity:0;pointer-events:none;z-index:9998;box-shadow:0 6px 18px rgba(0,0,0,.25)}
#pro-top.show{opacity:1;pointer-events:auto}

/* WhatsApp */
#pro-wa{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;background:#25d366;display:flex;align-items:center;justify-content:center;z-index:9999;box-shadow:0 8px 22px rgba(37,211,102,.45);transition:transform .25s ease}
#pro-wa:hover{transform:scale(1.08)}
#pro-wa svg{width:30px;height:30px;fill:#fff}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
  .pro-reveal{opacity:1;transform:none}
}
@media print{#pro-wa,#pro-top,#pro-progress{display:none!important}}
`;

const PRO_JS = `/* PRO — finitions UI */
(function () {
  'use strict';
  var doc = document, WA = window.__PRO_WA__ || {};

  // En-tête : ombre au scroll + sticky si besoin
  var header = doc.querySelector('header') || doc.querySelector('nav');
  if (header) {
    var cs = getComputedStyle(header);
    if (cs.position === 'static') {
      header.style.position = 'sticky'; header.style.top = '0'; header.style.zIndex = '1000';
      if (/rgba\\(0, 0, 0, 0\\)|transparent/.test(cs.backgroundColor)) {
        header.style.backgroundColor = getComputedStyle(doc.body).backgroundColor;
      }
    }
  }

  // Lien de navigation actif
  var current = location.pathname.split('/').pop() || 'index.html';
  doc.querySelectorAll('nav a[href]').forEach(function (a) {
    var h = a.getAttribute('href').split('#')[0].split('/').pop();
    if (h === current || (current === '' && h === 'index.html')) a.setAttribute('aria-current', 'page');
  });

  // Barre de progression + retour en haut
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

  // Apparition au scroll
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('pro-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    doc.querySelectorAll('main section, section, article, .card, [class*="card"]').forEach(function (el) {
      if (el.closest('header,nav,footer')) return;
      el.classList.add('pro-reveal'); io.observe(el);
    });
  }

  // Bouton WhatsApp
  if (WA.number) {
    var a = doc.createElement('a'); a.id = 'pro-wa';
    a.href = 'https://wa.me/' + WA.number + '?text=' + encodeURIComponent(WA.message || '');
    a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', 'Discuter sur WhatsApp');
    a.innerHTML = '<span aria-hidden="true" style="font-size:28px;line-height:1">💬</span>';
    doc.body.appendChild(a);
  }
})();
`;

const ROBOTS = `User-agent: *\nAllow: /\n\nSitemap: ${CONFIG.siteUrl}/sitemap.xml\n`;

const VERCEL_JSON = {
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ],
    },
    {
      source: '/assets/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
};

/* ---------------------- Transformation HTML ---------------------- */

function buildHead(file, html) {
  const name = path.basename(file);
  const meta = CONFIG.pages[name] || {};
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = meta.title || (titleMatch ? titleMatch[1].trim() : CONFIG.brand);
  const url = `${CONFIG.siteUrl}/${name === 'index.html' ? '' : name.replace(/\.html$/, '')}`;
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const desc = meta.desc || (descMatch ? descMatch[1] : CONFIG.brand);
  const emoji = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#0f172a"/><text x="50" y="68" font-size="52" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700">PJ</text></svg>')}`;

  let block = `<!-- PRO:HEAD:START -->
<meta name="theme-color" content="${CONFIG.themeColor}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
${/rel=["'](shortcut )?icon["']/i.test(html) ? '' : `<link rel="icon" href="${emoji}">\n`}<meta property="og:type" content="website">
<meta property="og:site_name" content="${CONFIG.brand}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${CONFIG.siteUrl}${CONFIG.ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${CONFIG.siteUrl}${CONFIG.ogImage}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/assets/pro.css">
`;
  if (name === 'index.html') {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: CONFIG.brand,
      url: CONFIG.siteUrl,
      telephone: CONFIG.telephone,
      areaServed: 'TG',
      address: { '@type': 'PostalAddress', addressLocality: 'Lomé', addressCountry: 'TG' },
      description: desc,
    };
    block += `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n`;
  }
  block += '<!-- PRO:HEAD:END -->';
  return { block, title, desc };
}

function transform(file) {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  const rel = path.relative(ROOT, file);

  // 1) Nettoyage d'une exécution précédente (idempotence)
  html = html
    .replace(/<!-- PRO:HEAD:START -->[\s\S]*?<!-- PRO:HEAD:END -->\s*/g, '')
    .replace(/<!-- PRO:BODY:START -->[\s\S]*?<!-- PRO:BODY:END -->\s*/g, '')
    .replace(/<a class="pro-skip"[^>]*>[^<]*<\/a>\s*/g, '');

  // 2) lang="fr"
  if (/<html[^>]*>/i.test(html) && !/<html[^>]*\blang=/i.test(html)) {
    html = html.replace(/<html/i, '<html lang="fr"');
  }

  // 3) <title> et meta description si absents
  const name = path.basename(file);
  const conf = CONFIG.pages[name];
  if (!/<title>/i.test(html) && /<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `<title>${(conf && conf.title) || CONFIG.brand}</title>\n</head>`);
  }
  if (!/<meta[^>]+name=["']description["']/i.test(html) && conf) {
    html = html.replace(/<\/head>/i, `<meta name="description" content="${conf.desc}">\n</head>`);
  }

  // 4) Bloc <head>
  const { block } = buildHead(file, html);
  html = html.replace(/<\/head>/i, `${block}\n</head>`);

  // 5) Lien d'évitement + id="main"
  if (/<body[^>]*>/i.test(html)) {
    html = html.replace(/<body([^>]*)>/i, (m) => `${m}\n<a class="pro-skip" href="#main">Aller au contenu</a>`);
    if (!/id=["']main["']/i.test(html)) {
      html = html.replace(/<main(?![^>]*\bid=)([^>]*)>/i, '<main id="main"$1>');
    }
  }

  // 6) Images : lazy-loading + decoding (sauf la 1re image de la page)
  let imgCount = 0;
  html = html.replace(/<img\b([^>]*?)>/gi, (m, attrs) => {
    imgCount++;
    let a = attrs;
    if (!/\bloading=/i.test(a) && imgCount > 1) a += ' loading="lazy"';
    if (!/\bdecoding=/i.test(a)) a += ' decoding="async"';
    if (!/\balt=/i.test(a)) { a += ' alt=""'; log(`  ⚠  ${rel}: image sans alt (ajoutez une description) → ${m.slice(0, 70)}…`); }
    return `<img${a}>`;
  });

  // 7) Liens externes sécurisés
  html = html.replace(/<a\b([^>]*\btarget=["']_blank["'][^>]*)>/gi, (m, attrs) =>
    /\brel=/i.test(attrs) ? m : `<a${attrs} rel="noopener noreferrer">`);

  // 8) Scripts en fin de body
  const bodyBlock = `<!-- PRO:BODY:START -->
<script>window.__PRO_WA__={number:"${CONFIG.whatsapp}",message:${JSON.stringify(CONFIG.whatsappMessage)}};</script>
<script src="/assets/pro.js" defer></script>
<!-- PRO:BODY:END -->`;
  html = html.replace(/<\/body>/i, `${bodyBlock}\n</body>`);

  if (html !== original) {
    const dest = path.join(BACKUP, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, original, 'utf8');
    fs.writeFileSync(file, html, 'utf8');
    log(`✔ ${rel}`);
  }
}

/* ---------------------- Exécution ---------------------- */

function main() {
  const files = walk(ROOT);
  if (!files.length) {
    console.error('Aucun fichier .html trouvé. Lancez le script à la racine du projet.');
    process.exit(1);
  }
  log(`\n🚀 Amélioration de ${files.length} page(s)…\n`);
  files.forEach(transform);

  write(path.join(ROOT, 'assets', 'pro.css'), PRO_CSS);
  write(path.join(ROOT, 'assets', 'pro.js'), PRO_JS);
  write(path.join(ROOT, 'robots.txt'), ROBOTS);

  const today = new Date().toISOString().slice(0, 10);
  const urls = files.map((f) => {
    const n = path.basename(f);
    const loc = `${CONFIG.siteUrl}/${n === 'index.html' ? '' : n.replace(/\.html$/, '')}`;
    return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`;
  });
  write(path.join(ROOT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);

  const vp = path.join(ROOT, 'vercel.json');
  if (fs.existsSync(vp)) {
    fs.copyFileSync(vp, path.join(BACKUP, 'vercel.json'));
    log('ℹ  vercel.json existant sauvegardé puis fusionné.');
    try {
      const cur = JSON.parse(fs.readFileSync(vp, 'utf8'));
      cur.cleanUrls = true;
      cur.headers = [...(cur.headers || []).filter((h) => !['/(.*)', '/assets/(.*)'].includes(h.source)), ...VERCEL_JSON.headers];
      write(vp, JSON.stringify(cur, null, 2));
    } catch { log('⚠  vercel.json illisible, laissé tel quel.'); }
  } else {
    write(vp, JSON.stringify(VERCEL_JSON, null, 2));
  }

  log('\n✅ Terminé. Sauvegarde : ' + path.basename(BACKUP));
  log('Prochaines étapes :');
  log('  1. Ouvrez avec Live Server et vérifiez chaque page');
  log(`  2. Ajoutez une image 1200x630 : assets/${path.basename(CONFIG.ogImage)}`);
  log('  3. git add . && git commit -m "Amélioration pro du site" && git push (Vercel redéploie)\n');
}

main();
