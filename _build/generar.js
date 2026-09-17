/* Genera las páginas de servicio desde servicios.json.
   Ejecutar desde la raíz del repo:  node _build/generar.js
   Idempotente: sobrescribe las páginas generadas y reescribe el sitemap. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'servicios.json'), 'utf8'));
const HOY = new Date().toISOString().slice(0, 10);
const BASE = 'https://strexholdings.com';

// montajes-industriales ya existe escrita a mano y sirve de referencia visual;
// se incluye en el sitemap y en los "relacionados", pero no se regenera.
const YA_EXISTE = 'montajes-industriales';
const NOMBRES = { [YA_EXISTE]: 'Montajes industriales' };
for (const [slug, s] of Object.entries(DATA)) NOMBRES[slug] = s.nombre;

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (t) => esc(t).replace(/"/g, '&quot;');

// Sólo los símbolos que la página usa realmente, para no arrastrar el sprite entero
const SPRITE = {
  'i-target': '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/>',
  'i-eye': '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>',
  'i-shield': '<path d="M12 2 4 5v6c0 5 3.4 8.7 8 9 4.6-.3 8-4 8-9V5l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  'i-bulb': '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.5 1 .5 1.6V16h6v-.5c0-.6 0-1.2.5-1.6A6 6 0 0 0 12 3Z"/>',
  'i-award': '<circle cx="12" cy="8" r="5.5"/><path d="m8.5 13-1.5 8 5-2.5L16 21l-1.5-8"/>',
  'i-leaf': '<path d="M4 20c8 0 15-6 16-16-10 0-16 7-16 16Z"/><path d="M4 20c2-5 5-8 10-11"/>',
  'i-wrench': '<path d="M14.7 6.3a4 4 0 0 0-5.6 5L3 17.4 6.6 21l6-6.1a4 4 0 0 0 5-5.6l-2.8 2.8-2.1-2.1 2-2.9Z"/>',
  'i-cart': '<circle cx="9" cy="21" r="1.4"/><circle cx="18" cy="21" r="1.4"/><path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 7H6"/>',
  'i-crane': '<path d="M4 21V9l10-6v6M4 9h14M14 9v12M18 9l3 3M18 21v-6l3-3"/>',
  'i-gear': '<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.4M12 18.6V21M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M3 12h2.4M18.6 12H21M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"/>',
  'i-flask': '<path d="M9 2h6M10 2v6.5L4.8 18a2 2 0 0 0 1.8 3h10.8a2 2 0 0 0 1.8-3L14 8.5V2"/><path d="M7.5 15h9"/>',
  'i-globe': '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.6 4 6 4 9.5s-1.4 6.9-4 9.5c-2.6-2.6-4-6-4-9.5s1.4-6.9 4-9.5Z"/>',
  'i-check': '<path d="m4 12 5.5 5.5L20 7"/>',
  'i-phone': '<path d="M5 3h3.5l1.5 5-2.5 1.7a12 12 0 0 0 6.8 6.8L15.5 14l5 1.5V19a2 2 0 0 1-2.1 2C10.4 20.6 3.4 13.6 3 5.1A2 2 0 0 1 5 3Z"/>',
  'i-mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  'i-arrow': '<path d="M4 12h16M14 6l6 6-6 6"/>',
  'i-bolt': '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  'i-drop': '<path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z"/>',
  'i-factory': '<path d="M3 21V10l5 3v-3l5 3V8l5 3v10H3Z"/><path d="M7 21v-4M12 21v-4M17 21v-4"/>',
  'i-bridge': '<path d="M2 18h20M4 18v-4M20 18v-4M4 14c3-5 13-5 16 0M12 9v9"/>',
  'i-ship': '<path d="M4 15h16l-2 5H6l-2-5Z"/><path d="M6 15V6h5l4 4M8 6V3h3"/>',
  'i-building': '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/>',
  'i-truck': '<path d="M2 8h11v9H2z"/><path d="M13 11h4l4 3v3h-8"/><circle cx="6" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>',
  'i-instagram': '<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Z"/><path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/><circle cx="18.41" cy="5.59" r="1.44"/>',
};

function pagina(slug, s) {
  const url = `${BASE}/servicios/${slug}.html`;

  // Recolectar sólo los iconos usados
  const usados = new Set(['i-arrow', 'i-check', 'i-phone', 'i-mail', 'i-instagram', s.icon]);
  s.alcance.forEach(([ic]) => usados.add(ic));
  const defs = [...usados]
    .filter((k) => SPRITE[k])
    .map((k) => `  <symbol id="${k}" viewBox="0 0 24 24">${SPRITE[k]}</symbol>`)
    .join('\n');

  const facts = s.facts
    .map(([k, v]) => `        <li><strong>${esc(k)}</strong> ${esc(v)}</li>`)
    .join('\n');

  const alcance = s.alcance
    .map(
      ([ic, t, d]) => `      <article class="svc-card">
        <svg class="icon"><use href="#${ic}"/></svg>
        <h3>${esc(t)}</h3>
        <p>${esc(d)}</p>
      </article>`
    )
    .join('\n');

  const pasos = s.proceso
    .map(
      ([t, d], i) => `      <li>
        <span class="n">0${i + 1}</span>
        <h3>${esc(t)}</h3>
        <p>${esc(d)}</p>
      </li>`
    )
    .join('\n');

  const porque = s.porque
    .map(
      ([t, d]) => `      <article class="svc-card plain">
        <h3>${esc(t)}</h3>
        <p>${esc(d)}</p>
      </article>`
    )
    .join('\n');

  const faq = s.faq
    .map(
      ([q, a]) => `      <details>
        <summary>${esc(q)}</summary>
        <p>${esc(a)}</p>
      </details>`
    )
    .join('\n');

  const rel = s.rel
    .filter((r) => NOMBRES[r])
    .map(
      (r) =>
        `      <a href="${r}.html">${esc(NOMBRES[r])} <svg class="icon"><use href="#i-arrow"/></svg></a>`
    )
    .join('\n');

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: s.nombre,
        serviceType: s.nombre,
        description: s.desc,
        provider: { '@id': `${BASE}/#organization` },
        areaServed: [
          { '@type': 'Country', name: 'Colombia' },
          { '@type': 'Country', name: 'Venezuela' },
          { '@type': 'Country', name: 'Estados Unidos' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `Alcance de ${s.nombre.toLowerCase()}`,
          itemListElement: s.alcance.map(([, t]) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: t },
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${BASE}/#servicios` },
          { '@type': 'ListItem', position: 3, name: s.nombre, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: s.faq.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  };

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#060f1c">
<title>${esc(s.title)}</title>
<meta name="description" content="${escAttr(s.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

<meta property="og:type" content="article">
<meta property="og:site_name" content="STREX Holdings">
<meta property="og:locale" content="es_ES">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${escAttr(s.title)}">
<meta property="og:description" content="${escAttr(s.desc)}">
<meta property="og:image" content="${BASE}/assets/hero-refinery.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(s.title)}">
<meta name="twitter:description" content="${escAttr(s.desc)}">
<meta name="twitter:image" content="${BASE}/assets/hero-refinery.jpg">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../servicio.css">
<link rel="icon" href="../assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="../assets/favicon-512.png" sizes="512x512" type="image/png">
<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
</head>
<body>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
${defs}
</defs>
</svg>

<a href="#main" class="skip-link">Saltar al contenido principal</a>

<header class="site-header scrolled" id="siteHeader">
  <div class="container">
    <a href="../index.html" class="logo on-dark">
      <img src="../assets/logo-mark.png" alt="" aria-hidden="true" class="logo-mark"
           width="200" height="69" fetchpriority="high" decoding="async">
      <span class="logo-word">STREX <span>HOLDINGS</span><small>WHERE INDUSTRY CONNECTS</small></span>
    </a>
    <nav class="nav-links">
      <a href="../index.html#nosotros">Nosotros</a>
      <a href="../index.html#servicios">Servicios</a>
      <a href="../index.html#empresas">Empresas</a>
      <a href="../index.html#contacto">Contacto</a>
    </nav>
    <div class="header-actions">
      <a href="#cotizar" class="btn btn-primary">Solicitar cotización <svg class="icon"><use href="#i-arrow"/></svg></a>
    </div>
  </div>
</header>

<main id="main">

<section class="svc-hero" aria-labelledby="svc-title">
  <div class="container">
    <nav class="breadcrumb" aria-label="Ruta de navegación">
      <a href="../index.html">Inicio</a>
      <span aria-hidden="true">/</span>
      <a href="../index.html#servicios">Servicios</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${esc(s.nombre)}</span>
    </nav>

    <div class="svc-hero-grid">
      <div>
        <span class="eyebrow">Servicio ${s.num}</span>
        <h1 id="svc-title">${esc(s.nombre)}</h1>
        <p class="lead">${esc(s.lead)}</p>
        <div class="hero-actions">
          <a href="#cotizar" class="btn btn-primary">Solicitar cotización <svg class="icon"><use href="#i-arrow"/></svg></a>
          <a href="#alcance" class="btn btn-ghost">Ver alcance técnico</a>
        </div>
      </div>

      <ul class="svc-facts">
${facts}
      </ul>
    </div>
  </div>
</section>

<section class="svc-section" id="alcance" aria-labelledby="alcance-title">
  <div class="container">
    <div class="section-head">
      <h2 id="alcance-title">Alcance del servicio</h2>
      <p>${esc(s.alcance_intro)}</p>
    </div>
    <div class="svc-grid">
${alcance}
    </div>
  </div>
</section>

<section class="svc-section alt" aria-labelledby="proceso-title">
  <div class="container">
    <div class="section-head light">
      <h2 id="proceso-title">Cómo lo ejecutamos</h2>
      <p>${esc(s.proceso_intro)}</p>
    </div>
    <ol class="svc-steps">
${pasos}
    </ol>
  </div>
</section>

<section class="svc-section" aria-labelledby="porque-title">
  <div class="container">
    <div class="section-head">
      <h2 id="porque-title">Por qué contratarnos</h2>
    </div>
    <div class="svc-grid cols-3">
${porque}
    </div>
  </div>
</section>

<section class="svc-section alt-soft" aria-labelledby="faq-title">
  <div class="container">
    <div class="section-head">
      <h2 id="faq-title">Preguntas frecuentes</h2>
    </div>
    <div class="faq">
${faq}
    </div>
  </div>
</section>

<section class="contact" id="cotizar" aria-labelledby="cta-title">
  <div class="container">
    <div class="contact-panel">
      <div class="contact-top">
        <h2 id="cta-title">Hablemos de su proyecto</h2>
        <p>Cuéntenos el alcance y la ventana de tiempo. Le respondemos con una propuesta técnica, no con un folleto.</p>
      </div>
      <div class="contact-grid">
        <div class="contact-item">
          <div class="icon-badge"><svg class="icon"><use href="#i-phone"/></svg></div>
          <span class="label">Teléfono</span>
          <a href="tel:+12027662938">+1 (202) 766-2938</a>
        </div>
        <div class="contact-item">
          <div class="icon-badge"><svg class="icon"><use href="#i-mail"/></svg></div>
          <span class="label">Email</span>
          <a href="mailto:business@strexholdings.com">business@strexholdings.com</a>
        </div>
        <div class="contact-item">
          <div class="icon-badge"><svg class="icon"><use href="#i-instagram"/></svg></div>
          <span class="label">Instagram</span>
          <a href="https://www.instagram.com/strexholdings/" target="_blank" rel="noopener">@strexholdings</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="svc-section" aria-labelledby="rel-title">
  <div class="container">
    <div class="section-head">
      <h2 id="rel-title">Servicios relacionados</h2>
    </div>
    <div class="svc-related">
${rel}
    </div>
  </div>
</section>

</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <a href="../index.html" class="logo on-dark">
        <img src="../assets/logo-mark.png" alt="" aria-hidden="true" class="logo-mark"
             width="200" height="69" loading="lazy" decoding="async">
        <span class="logo-word" style="color:#fff">STREX <span>HOLDINGS</span></span>
      </a>
      <div class="footer-social">
        <a href="https://www.instagram.com/strexholdings/" target="_blank" rel="noopener" aria-label="Instagram de STREX Holdings">
          <svg class="icon icon-brand"><use href="#i-instagram"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>Ingeniería · Integridad · Innovación · Compromiso · Sostenibilidad</span>
      <span>© 2026 STREX Holdings. Todos los derechos reservados.</span>
    </div>
  </div>
</footer>

<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>

</body>
</html>
`;
}

// ---- Generar páginas ----
const dir = path.join(ROOT, 'servicios');
fs.mkdirSync(dir, { recursive: true });

let n = 0;
for (const [slug, s] of Object.entries(DATA)) {
  fs.writeFileSync(path.join(dir, `${slug}.html`), pagina(slug, s), 'utf8');
  n++;
  console.log(`  ${slug}.html`);
}

// ---- Sitemap ----
const slugs = [YA_EXISTE, ...Object.keys(DATA)].sort();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE}/</loc>
    <lastmod>${HOY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
${slugs
  .map(
    (s) => `  <url>
    <loc>${BASE}/servicios/${s}.html</loc>
    <lastmod>${HOY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

console.log(`\n${n} páginas generadas · sitemap con ${slugs.length + 1} URLs`);
