/* Genera las 10 páginas de división (ES + EN), las redirecciones de las URLs
   viejas de /servicios/ y el sitemap. Contenido en divisiones.json.
   Ejecutar desde la raíz del repo:  node _build/generar.js
   Idempotente: sobrescribe todo lo que genera. Las portadas salen de cuerpo.es.html y cuerpo.en.html
   (index.html y en/index.html): no editar esos dos archivos a mano. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIVS = JSON.parse(fs.readFileSync(path.join(__dirname, 'divisiones.json'), 'utf8'));
const HOY = new Date().toISOString().slice(0, 10);
const BASE = 'https://strexholdings.com';
const BY_KEY = Object.fromEntries(DIVS.map((d) => [d.key, d]));

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (t) => esc(t).replace(/"/g, '&quot;');

const SPRITE = {
  'i-rig': '<path d="M12 2 7 21M12 2l5 19M9 13.5h6M8 17.5h8M10.3 8.5h3.4"/><path d="M3 21h18"/>',
  'i-flame': '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4.5-10-1.5 2-2.5 3.8-2.5 6-1-.8-2-2-2.3-3.5C7.3 9.6 5 12 5 15a7 7 0 0 0 7 7Z"/>',
  'i-handshake': '<path d="m3 10 4-4h4l3 3"/><path d="m21 10-4-4h-4"/><path d="M7 10v4l3 3 2-2 2 2 3-3v-4"/><path d="m10 13 2-2 2 2"/>',
  'i-wrench': '<path d="M14.7 6.3a4 4 0 0 0-5.6 5L3 17.4 6.6 21l6-6.1a4 4 0 0 0 5-5.6l-2.8 2.8-2.1-2.1 2-2.9Z"/>',
  'i-cart': '<circle cx="9" cy="21" r="1.4"/><circle cx="18" cy="21" r="1.4"/><path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 7H6"/>',
  'i-gear': '<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.4M12 18.6V21M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M3 12h2.4M18.6 12H21M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"/>',
  'i-flask': '<path d="M9 2h6M10 2v6.5L4.8 18a2 2 0 0 0 1.8 3h10.8a2 2 0 0 0 1.8-3L14 8.5V2"/><path d="M7.5 15h9"/>',
  'i-check': '<path d="m4 12 5.5 5.5L20 7"/>',
  'i-phone': '<path d="M5 3h3.5l1.5 5-2.5 1.7a12 12 0 0 0 6.8 6.8L15.5 14l5 1.5V19a2 2 0 0 1-2.1 2C10.4 20.6 3.4 13.6 3 5.1A2 2 0 0 1 5 3Z"/>',
  'i-mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  'i-arrow': '<path d="M4 12h16M14 6l6 6-6 6"/>',
  'i-bolt': '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  'i-bridge': '<path d="M2 18h20M4 18v-4M20 18v-4M4 14c3-5 13-5 16 0M12 9v9"/>',
  'i-ship': '<path d="M4 15h16l-2 5H6l-2-5Z"/><path d="M6 15V6h5l4 4M8 6V3h3"/>',
  'i-instagram': '<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Z"/><path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/><circle cx="18.41" cy="5.59" r="1.44"/>',
};

// Textos de interfaz por idioma. El contenido de cada división vive en el JSON.
const L = {
  es: {
    dir: 'divisiones', home: '/', locale: 'es_ES', inLang: 'es',
    skip: 'Saltar al contenido principal', crumbs: 'Ruta de navegación',
    nav: [['nosotros', 'Nosotros'], ['divisiones', 'Divisiones'], ['modelo', 'Modelo'], ['industrias', 'Industrias'], ['venezuela', 'Venezuela'], ['contacto', 'Contacto']],
    cta: 'Solicitar propuesta', inicio: 'Inicio', divisiones: 'Divisiones', division: 'División',
    other: 'English', otherShort: 'EN', otherLabel: 'Read this page in English',
    verServicios: 'Ver servicios', facts: { ind: 'Industrias', mercados: 'Mercados foco', part: 'Participación' },
    mercados: 'Estados Unidos y América Latina, con especial atención a Colombia y Venezuela',
    part: 'Directa o mediante compañías especializadas, según el alcance contractual',
    servTitle: 'Servicios y soluciones',
    servNote: 'Los servicios pueden prestarse directamente o estructurarse mediante compañías especializadas, según el alcance contractual de cada operación. Su disponibilidad se confirma en cada propuesta.',
    modeloTitle: 'Cómo estructuramos cada proyecto',
    modeloIntro: 'Un mismo modelo de gestión para todas las divisiones, desde la oportunidad hasta la relación de largo plazo.',
    modelo: [
      ['Identificación', 'Análisis de mercados, necesidades operativas y oportunidades comerciales.'],
      ['Estructuración', 'Definición de alcance, modelo contractual, viabilidad y recursos requeridos.'],
      ['Integración', 'Selección y articulación de capacidades técnicas, proveedores y operadores.'],
      ['Coordinación', 'Seguimiento de compromisos y gestión de interfaces entre participantes.'],
      ['Desarrollo de relaciones', 'Consolidación de vínculos de largo plazo con clientes y socios estratégicos.'],
    ],
    modTitle: 'Modalidades de participación',
    modNote: 'Esquemas disponibles para evaluación y estructuración en cada caso; no implican que STREX ejecute directamente todos ellos.',
    modalidades: [
      'Suministro y procura de equipos, materiales y tecnología',
      'Servicios especializados y alquiler de equipos',
      'Operación y mantenimiento',
      'EPC, EPCM y proyectos llave en mano mediante estructuras idóneas',
      'Representación y desarrollo comercial',
      'Consorcios, uniones temporales y empresas conjuntas',
      'Estructuración de inversiones y desarrollo de proyectos',
    ],
    faqTitle: 'Preguntas frecuentes',
    faq: (d) => [
      [`¿STREX presta directamente los servicios de ${d.corto.toLowerCase()}?`, 'El portafolio reúne servicios que pueden prestarse directamente o estructurarse mediante compañías especializadas, según el alcance contractual de cada operación. En cada propuesta se define quién ejecuta cada componente y bajo qué modalidad.'],
      ['¿En qué mercados trabaja STREX Holdings?', 'Orientamos nuestra actividad al desarrollo de oportunidades en Estados Unidos y América Latina, con especial atención a Colombia y Venezuela, y articulamos capacidades de nuestro ecosistema empresarial en mercados internacionales.'],
      ['¿Cómo se puede contratar a STREX?', 'Mediante suministro y procura, servicios especializados y alquiler de equipos, operación y mantenimiento, EPC y EPCM, representación comercial, consorcios y empresas conjuntas, o estructuración de inversiones. Cada esquema se evalúa según el proyecto.'],
    ],
    contactTitle: 'Hablemos de su proyecto',
    contactText: 'Para explorar oportunidades de inversión, desarrollo de negocios, suministro industrial o soluciones especializadas, escríbanos o llámenos.',
    tel: 'Teléfono', relTitle: 'Otras divisiones',
    footer: 'Desarrollo de negocios · Energía · Petróleo y gas · Industria · Infraestructura',
    rights: 'Todos los derechos reservados.', igLabel: 'Instagram de STREX Holdings',
    pais: ['Estados Unidos', 'Colombia', 'Venezuela'],
  },
  en: {
    dir: 'en/divisions', home: '/en/', locale: 'en_US', inLang: 'en',
    skip: 'Skip to main content', crumbs: 'Breadcrumb',
    nav: [['nosotros', 'About'], ['divisiones', 'Divisions'], ['modelo', 'Model'], ['industrias', 'Industries'], ['venezuela', 'Venezuela'], ['contacto', 'Contact']],
    cta: 'Request a proposal', inicio: 'Home', divisiones: 'Divisions', division: 'Division',
    other: 'Español', otherShort: 'ES', otherLabel: 'Leer esta página en español',
    verServicios: 'View services', facts: { ind: 'Industries', mercados: 'Focus markets', part: 'Delivery' },
    mercados: 'United States and Latin America, with particular focus on Colombia and Venezuela',
    part: 'Direct or through specialized companies, depending on contractual scope',
    servTitle: 'Services and solutions',
    servNote: 'Services may be delivered directly or structured through specialized companies, depending on the contractual scope of each operation. Availability is confirmed in each proposal.',
    modeloTitle: 'How we structure every project',
    modeloIntro: 'One management model across all divisions, from the opportunity to the long-term relationship.',
    modelo: [
      ['Identification', 'Analysis of markets, operational needs and commercial opportunities.'],
      ['Structuring', 'Definition of scope, contractual model, feasibility and required resources.'],
      ['Integration', 'Selection and coordination of technical capabilities, suppliers and operators.'],
      ['Coordination', 'Follow-up of commitments and management of interfaces between participants.'],
      ['Relationship development', 'Long-term relationships with clients and strategic partners.'],
    ],
    modTitle: 'Engagement models',
    modNote: 'Schemes available for evaluation and structuring case by case; they do not imply that STREX directly performs all of them.',
    modalidades: [
      'Supply and procurement of equipment, materials and technology',
      'Specialized services and equipment rental',
      'Operation and maintenance',
      'EPC, EPCM and turnkey projects through suitable structures',
      'Commercial representation and business development',
      'Consortia, temporary unions and joint ventures',
      'Investment structuring and project development',
    ],
    faqTitle: 'Frequently asked questions',
    faq: (d) => [
      [`Does STREX deliver ${d.corto.toLowerCase()} services directly?`, 'The portfolio covers services that may be delivered directly or structured through specialized companies, depending on the contractual scope of each operation. Each proposal defines who performs each component and under which model.'],
      ['Which markets does STREX Holdings serve?', 'We focus on developing opportunities in the United States and Latin America, with particular attention to Colombia and Venezuela, and we bring together capabilities from our business ecosystem in international markets.'],
      ['How can STREX be engaged?', 'Through supply and procurement, specialized services and equipment rental, operation and maintenance, EPC and EPCM, commercial representation, consortia and joint ventures, or investment structuring. Each scheme is assessed for the specific project.'],
    ],
    contactTitle: "Let's talk about your project",
    contactText: 'To explore investment opportunities, business development, industrial supply or specialized solutions, email or call our corporate team.',
    tel: 'Phone', relTitle: 'Other divisions',
    footer: 'Business development · Energy · Oil & gas · Industry · Infrastructure',
    rights: 'All rights reserved.', igLabel: 'STREX Holdings on Instagram',
    pais: ['United States', 'Colombia', 'Venezuela'],
  },
};

const urlOf = (lang, d) => `${BASE}/${L[lang].dir}/${d[lang].slug}.html`;
const other = (lang) => (lang === 'es' ? 'en' : 'es');

function pagina(lang, d, num) {
  const t = L[lang];
  const c = d[lang];
  const up = lang === 'es' ? '../' : '../../'; // ruta a la raíz del sitio
  const homeHref = '../index.html'; // ambas carpetas cuelgan de la portada de su idioma
  const url = urlOf(lang, d);
  const otherUrl = urlOf(other(lang), d);
  const otherHref = lang === 'es' ? `../en/divisions/${d.en.slug}.html` : `../../divisiones/${d.es.slug}.html`;
  const foto = `${up}assets/${d.foto}`;
  const nn = String(num).padStart(2, '0');

  const usados = new Set(['i-arrow', 'i-check', 'i-phone', 'i-mail', 'i-instagram', d.icon]);
  const defs = [...usados].map((k) => `  <symbol id="${k}" viewBox="0 0 24 24">${SPRITE[k]}</symbol>`).join('\n');

  const nav = t.nav.map(([id, txt]) => `      <a href="${homeHref}#${id}">${txt}</a>`).join('\n');
  const servicios = c.servicios.map((s) => `      <li><svg class="icon"><use href="#i-check"/></svg>${esc(s)}</li>`).join('\n');
  const pasos = t.modelo.map(([h, p], i) => `      <li>
        <span class="n">0${i + 1}</span>
        <h3>${esc(h)}</h3>
        <p>${esc(p)}</p>
      </li>`).join('\n');
  const mods = t.modalidades.map((m) => `      <li>${esc(m)}</li>`).join('\n');
  const faqs = t.faq(c);
  const faq = faqs.map(([q, a]) => `      <details>
        <summary>${esc(q)}</summary>
        <p>${esc(a)}</p>
      </details>`).join('\n');
  const rel = d.rel.map((k) => `      <a href="${BY_KEY[k][lang].slug}.html">${esc(BY_KEY[k][lang].nombre)} <svg class="icon"><use href="#i-arrow"/></svg></a>`).join('\n');

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: c.nombre,
        serviceType: c.nombre,
        description: c.desc,
        inLanguage: t.inLang,
        provider: { '@id': `${BASE}/#organization` },
        areaServed: t.pais.map((name) => ({ '@type': 'Country', name })),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: c.nombre,
          itemListElement: c.servicios.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s } })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.inicio, item: `${BASE}${t.home}` },
          { '@type': 'ListItem', position: 2, name: t.divisiones, item: `${BASE}${t.home}#divisiones` },
          { '@type': 'ListItem', position: 3, name: c.nombre, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#060f1c">
<title>${esc(c.title)}</title>
<meta name="description" content="${escAttr(c.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="${lang}" href="${url}">
<link rel="alternate" hreflang="${other(lang)}" href="${otherUrl}">
<link rel="alternate" hreflang="x-default" href="${urlOf('es', d)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

<meta property="og:type" content="article">
<meta property="og:site_name" content="STREX Holdings">
<meta property="og:locale" content="${t.locale}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${escAttr(c.title)}">
<meta property="og:description" content="${escAttr(c.desc)}">
<meta property="og:image" content="${BASE}/assets/${d.foto}.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(c.title)}">
<meta name="twitter:description" content="${escAttr(c.desc)}">
<meta name="twitter:image" content="${BASE}/assets/${d.foto}.jpg">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${up}styles.css">
<link rel="stylesheet" href="${up}servicio.css">
<link rel="icon" href="${up}assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${up}assets/favicon-512.png" sizes="512x512" type="image/png">
<link rel="apple-touch-icon" href="${up}assets/apple-touch-icon.png">
</head>
<body>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
${defs}
</defs>
</svg>

<a href="#main" class="skip-link">${t.skip}</a>

<header class="site-header scrolled" id="siteHeader">
  <div class="container">
    <a href="${homeHref}" class="logo on-dark">
      <img src="${up}assets/logo-mark.png" alt="" aria-hidden="true" class="logo-mark"
           width="200" height="69" fetchpriority="high" decoding="async">
      <span class="logo-word">STREX <span>HOLDINGS</span><small>WHERE INDUSTRY CONNECTS</small></span>
    </a>
    <nav class="nav-links">
${nav}
    </nav>
    <div class="header-actions">
      <a href="${otherHref}" class="lang-switch" hreflang="${other(lang)}" lang="${other(lang)}" aria-label="${t.otherLabel}">${t.otherShort}</a>
      <a href="#cotizar" class="btn btn-primary">${t.cta} <svg class="icon"><use href="#i-arrow"/></svg></a>
    </div>
  </div>
</header>

<main id="main">

<section class="svc-hero has-photo" style="--photo:image-set(url('${foto}.webp') type('image/webp'), url('${foto}.jpg') type('image/jpeg'))" aria-labelledby="svc-title">
  <div class="container">
    <nav class="breadcrumb" aria-label="${t.crumbs}">
      <a href="${homeHref}">${t.inicio}</a>
      <span aria-hidden="true">/</span>
      <a href="${homeHref}#divisiones">${t.divisiones}</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${esc(c.corto)}</span>
    </nav>

    <div class="svc-hero-grid">
      <div>
        <span class="eyebrow">${t.division} ${nn} · ${esc(d.en.nombre)}</span>
        <h1 id="svc-title">${esc(c.nombre)}</h1>
        <p class="lead">${esc(c.lead)}</p>
        <div class="hero-actions">
          <a href="#cotizar" class="btn btn-primary">${t.cta} <svg class="icon"><use href="#i-arrow"/></svg></a>
          <a href="#servicios" class="btn btn-ghost">${t.verServicios}</a>
        </div>
      </div>

      <ul class="svc-facts">
        <li><strong>${t.facts.ind}</strong> ${esc(c.industrias.join(' · '))}</li>
        <li><strong>${t.facts.mercados}</strong> ${t.mercados}</li>
        <li><strong>${t.facts.part}</strong> ${t.part}</li>
      </ul>
    </div>
  </div>
</section>

<section class="svc-section" id="servicios" aria-labelledby="serv-title">
  <div class="container">
    <div class="section-head">
      <h2 id="serv-title">${t.servTitle}</h2>
    </div>
    <ul class="svc-checklist">
${servicios}
    </ul>
    <p class="svc-note">${t.servNote}</p>
  </div>
</section>

<section class="svc-section alt" aria-labelledby="modelo-title">
  <div class="container">
    <div class="section-head light">
      <h2 id="modelo-title">${t.modeloTitle}</h2>
      <p>${t.modeloIntro}</p>
    </div>
    <ol class="svc-steps">
${pasos}
    </ol>
  </div>
</section>

<section class="svc-section" aria-labelledby="mod-title">
  <div class="container">
    <div class="section-head">
      <h2 id="mod-title">${t.modTitle}</h2>
      <p>${t.modNote}</p>
    </div>
    <ul class="svc-modalities">
${mods}
    </ul>
  </div>
</section>

<section class="svc-section alt-soft" aria-labelledby="faq-title">
  <div class="container">
    <div class="section-head">
      <h2 id="faq-title">${t.faqTitle}</h2>
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
        <h2 id="cta-title">${t.contactTitle}</h2>
        <p>${t.contactText}</p>
      </div>
      <div class="contact-grid">
        <div class="contact-item">
          <div class="icon-badge"><svg class="icon"><use href="#i-phone"/></svg></div>
          <span class="label">${t.tel}</span>
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
      <h2 id="rel-title">${t.relTitle}</h2>
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
      <a href="${homeHref}" class="logo on-dark">
        <img src="${up}assets/logo-mark.png" alt="" aria-hidden="true" class="logo-mark"
             width="200" height="69" loading="lazy" decoding="async">
        <span class="logo-word" style="color:#fff">STREX <span>HOLDINGS</span></span>
      </a>
      <div class="footer-social">
        <a href="${otherHref}" class="lang-switch" hreflang="${other(lang)}" lang="${other(lang)}">${t.other}</a>
        <a href="https://www.instagram.com/strexholdings/" target="_blank" rel="noopener" aria-label="${t.igLabel}">
          <svg class="icon icon-brand"><use href="#i-instagram"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${t.footer}</span>
      <span>© 2026 STREX Holdings. ${t.rights}</span>
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

// Las 15 URLs viejas de /servicios/ redirigen a su división. Sin acceso a nginx
// usamos meta refresh + canonical.
// shortcut: meta refresh no es un 301 real; cuando haya acceso a Coolify, pasar a 301 en nginx.
const VIEJAS = {
  'ingenieria-y-consultoria': 'ingenieria', 'integridad-mecanica': 'ingenieria',
  'operacion-y-mantenimiento': 'ingenieria', 'montajes-industriales': 'ingenieria',
  'soluciones-metalmecanicas': 'ingenieria', 'sistemas-de-almacenamiento': 'ingenieria',
  'seguridad-salud-y-medio-ambiente': 'ingenieria',
  petroquimica: 'quimica', 'lubricacion-industrial': 'quimica',
  'procura-internacional': 'procura', 'logistica-integral': 'procura',
  'construccion-e-infraestructura': 'infraestructura', 'soluciones-ambientales': 'infraestructura',
  energia: 'generacion', mineria: null, // minería quedó solo como industria
};

function redireccion(destino) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>STREX Holdings</title>
<link rel="canonical" href="${destino}">
<meta http-equiv="refresh" content="0; url=${destino}">
</head>
<body>
<p>Esta página se trasladó a <a href="${destino}">${destino}</a>.</p>
</body>
</html>
`;
}

// ---- Portadas: cuerpo.<lang>.html + piezas comunes ----
const PORTADA = {
  es: {
    title: 'STREX Holdings | Soluciones integrales para energía, petróleo y gas, industria e infraestructura',
    desc: 'Grupo empresarial internacional: perforación y servicios a pozos, producción, generación eléctrica, petroquímica, marítimo y offshore, gas natural, ingeniería, infraestructura y procura. Sede en Highlands, Texas.',
    ogAlt: 'Refinería de petróleo', verDiv: 'Ver división', url: `${BASE}/`,
    orgDesc: 'Grupo empresarial internacional orientado al desarrollo de negocios, la estructuración de proyectos y la integración de soluciones técnicas, operativas y comerciales para la industria energética, petrolera, petroquímica, minera y de infraestructura.',
  },
  en: {
    title: 'STREX Holdings | Integrated Industrial, Energy & Infrastructure Solutions',
    desc: 'International business group: drilling and well services, production, power generation, chemicals, marine and offshore, natural gas, engineering, infrastructure and procurement. Headquartered in Highlands, Texas.',
    ogAlt: 'Oil refinery', verDiv: 'View division', url: `${BASE}/en/`,
    orgDesc: 'International business group focused on business development, project structuring and the integration of technical, operational and commercial solutions for the energy, oil, petrochemical, mining and infrastructure industries.',
  },
};
const SPRITE_HOME = fs.readFileSync(path.join(__dirname, 'sprite.html'), 'utf8');

function portada(lang) {
  const t = L[lang];
  const p = PORTADA[lang];
  const up = lang === 'es' ? '' : '../';
  const href = (d) => `${lang === 'es' ? 'divisiones' : 'divisions'}/${d[lang].slug}.html`;
  const mega = DIVS.map((d, i) => `      <a href="${href(d)}"><span class="n">${String(i + 1).padStart(2, '0')}</span>${esc(d[lang].corto)}</a>`).join('\n');
  const mobile = DIVS.map((d) => `        <a href="${href(d)}">${esc(d[lang].corto)}</a>`).join('\n');
  const cards = DIVS.map((d, i) => `      <a class="service-card is-link" href="${href(d)}" data-reveal style="--i:${i}"><div class="num">${String(i + 1).padStart(2, '0')}</div><svg class="icon"><use href="#${d.icon}"/></svg><h3>${esc(d[lang].corto)}</h3><span class="svc-tag">${esc(d.en.nombre)}</span><span class="svc-more">${p.verDiv} <svg class="icon"><use href="#i-arrow"/></svg></span></a>`).join('\n');
  const steps = t.modelo.map(([h, txt], i) => `          <div class="cap-step"><div class="dot-line"><div class="dot">0${i + 1}</div><div class="bar"></div></div><h3>${esc(h)}</h3><p>${esc(txt)}</p></div>`).join('\n');
  const cuerpo = fs.readFileSync(path.join(__dirname, `cuerpo.${lang}.html`), 'utf8')
    .replace('{{MEGA}}', mega).replace('{{MOBILE}}', mobile).replace('{{CARDS}}', cards)
    .replaceAll('{{STEPS}}', steps);

  const org = {
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: 'STREX Holdings',
    url: `${BASE}/`,
    logo: { '@type': 'ImageObject', url: `${BASE}/assets/logo-mark.png` },
    image: `${BASE}/assets/hero-refinery.jpg`,
    slogan: 'Where Industry Connects',
    description: p.orgDesc,
    email: 'business@strexholdings.com',
    telephone: '+1-202-766-2938',
    sameAs: ['https://www.instagram.com/strexholdings/'],
    address: { '@type': 'PostalAddress', streetAddress: '1919 S. Canal St', addressLocality: 'Highlands', addressRegion: 'TX', postalCode: '77562', addressCountry: 'US' },
    contactPoint: [{ '@type': 'ContactPoint', telephone: '+1-202-766-2938', email: 'business@strexholdings.com', contactType: 'sales', areaServed: ['US', 'CO', 'VE'], availableLanguage: ['es', 'en'] }],
    areaServed: t.pais.map((name) => ({ '@type': 'Country', name })),
    knowsAbout: DIVS.map((d) => d[lang].nombre),
  };
  const sede = (id, name, address) => ({
    '@type': 'LocalBusiness', '@id': `${BASE}/#${id}`, name, parentOrganization: { '@id': `${BASE}/#organization` },
    url: `${BASE}/`, telephone: '+1-202-766-2938', email: 'business@strexholdings.com', image: `${BASE}/assets/hero-refinery.jpg`, address,
  });
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      org,
      sede('sede-usa', 'STREX Holdings — Sede Estados Unidos', { '@type': 'PostalAddress', streetAddress: '1919 S. Canal St', addressLocality: 'Highlands', addressRegion: 'TX', postalCode: '77562', addressCountry: 'US' }),
      sede('sede-colombia', 'STREX Holdings — Oficina Colombia', { '@type': 'PostalAddress', streetAddress: 'Cra. 51B #80-58, Oficina 909', addressLocality: 'Barranquilla', addressRegion: 'Atlántico', addressCountry: 'CO' }),
      { '@type': 'WebSite', '@id': `${p.url}#website`, url: p.url, name: 'STREX Holdings', inLanguage: lang, publisher: { '@id': `${BASE}/#organization` } },
    ],
  };

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#060f1c">
<title>${esc(p.title)}</title>
<meta name="description" content="${escAttr(p.desc)}">
<link rel="canonical" href="${p.url}">
<link rel="alternate" hreflang="es" href="${BASE}/">
<link rel="alternate" hreflang="en" href="${BASE}/en/">
<link rel="alternate" hreflang="x-default" href="${BASE}/">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

<!-- Open Graph / redes sociales -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="STREX Holdings">
<meta property="og:locale" content="${t.locale}">
<meta property="og:url" content="${p.url}">
<meta property="og:title" content="${escAttr(p.title)}">
<meta property="og:description" content="${escAttr(p.desc)}">
<meta property="og:image" content="${BASE}/assets/hero-refinery.jpg">
<meta property="og:image:alt" content="${escAttr(p.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(p.title)}">
<meta name="twitter:description" content="${escAttr(p.desc)}">
<meta name="twitter:image" content="${BASE}/assets/hero-refinery.jpg">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${up}styles.css">
<link rel="icon" href="${up}assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${up}assets/favicon-512.png" sizes="512x512" type="image/png">
<link rel="apple-touch-icon" href="${up}assets/apple-touch-icon.png">
</head>
<body>

${SPRITE_HOME}
${cuerpo}
<!-- ============ FOOTER ============ -->
<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <a href="#top" class="logo on-dark">
        <img src="${up}assets/logo-mark.png" alt="" aria-hidden="true" class="logo-mark"
             width="200" height="69" loading="lazy" decoding="async">
        <span class="logo-word" style="color:#fff">STREX <span>HOLDINGS</span></span>
      </a>
      <div class="footer-social">
        <a href="${lang === 'es' ? 'en/' : '../'}" class="lang-switch" hreflang="${other(lang)}" lang="${other(lang)}">${t.other}</a>
        <a href="https://www.instagram.com/strexholdings/" target="_blank" rel="noopener" aria-label="${t.igLabel}">
          <svg class="icon icon-brand"><use href="#i-instagram"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${t.footer}</span>
      <span>© 2026 STREX Holdings. ${t.rights}</span>
    </div>
  </div>
</footer>

<!-- ============ DATOS ESTRUCTURADOS (Schema.org) ============ -->
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>

<script src="${up}script.js"></script>
</body>
</html>
`;
}

// ---- Generar ----
fs.writeFileSync(path.join(ROOT, 'index.html'), portada('es'), 'utf8');
fs.mkdirSync(path.join(ROOT, 'en'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'en', 'index.html'), portada('en'), 'utf8');
for (const lang of ['es', 'en']) {
  const dir = path.join(ROOT, L[lang].dir);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  DIVS.forEach((d, i) => fs.writeFileSync(path.join(dir, `${d[lang].slug}.html`), pagina(lang, d, i + 1), 'utf8'));
}

const viejasDir = path.join(ROOT, 'servicios');
fs.rmSync(viejasDir, { recursive: true, force: true });
fs.mkdirSync(viejasDir);
for (const [slug, key] of Object.entries(VIEJAS)) {
  const destino = key ? urlOf('es', BY_KEY[key]) : `${BASE}/#industrias`;
  fs.writeFileSync(path.join(viejasDir, `${slug}.html`), redireccion(destino), 'utf8');
}

// ---- Sitemap con hreflang ----
const par = (es, en, prio) =>
  [es, en].map((loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${HOY}</lastmod>
    <priority>${prio}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${es}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${es}"/>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${par(`${BASE}/`, `${BASE}/en/`, '1.0')}
${DIVS.map((d) => par(urlOf('es', d), urlOf('en', d), '0.8')).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

// Autocomprobación: cada división enlaza a divisiones existentes y tiene foto
for (const d of DIVS) {
  d.rel.forEach((k) => { if (!BY_KEY[k]) throw new Error(`rel inexistente: ${d.key} -> ${k}`); });
  if (!fs.existsSync(path.join(ROOT, 'assets', `${d.foto}.webp`))) throw new Error(`falta foto: ${d.foto}.webp`);
  if (!SPRITE[d.icon]) throw new Error(`falta icono: ${d.icon}`);
}

console.log(`${DIVS.length * 2} páginas de división · ${Object.keys(VIEJAS).length} redirecciones · sitemap con ${(DIVS.length + 1) * 2} URLs`);
