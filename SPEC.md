# SPEC — STREX Holdings · Posicionamiento SEO

> **Fuente de verdad del proyecto.** Última actualización: 2026-11-20
> Cliente: STREX Holdings (contacto: Osvaldo Castellar)
> Repo: https://github.com/ricor3412-jpg/strex-holdings-web

---

## 1. Qué es STREX Holdings

Holding industrial internacional. **No es dueño de las empresas con las que
trabaja: son aliados**, y desde nov-2026 no se nombran en público (ver
[REESTRUCTURACION.md](REESTRUCTURACION.md)). Vende
proyectos EPC llave en mano a los sectores de oil & gas, petroquímica, minería,
energía e infraestructura.

**Implicación para el SEO:** el cliente es B2B de ciclo largo y ticket alto.
El comprador es un gerente de proyecto o de compras, no un consumidor. Esto
descarta la estrategia de blog de alto volumen y favorece autoridad técnica +
SEO local por sede. Ver sección 7.

---

## 2. Stack y alojamiento

| | |
|---|---|
| Tipo | Sitio estático: HTML + CSS + JS vanilla. Sin build, sin dependencias |
| Archivos | `index.html`, `styles.css`, `script.js`, `assets/` |
| Hosting | VPS Hostinger — **`31.97.147.5`** (el mismo de clubkabanna) |
| Servidor web | nginx 1.31.3 detrás de Traefik (Coolify) |
| Dominio | `strexholdings.com` — **solo responde sin www** |
| DNS | **GoDaddy** (`ns47/ns48.domaincontrol.com`) — no Hostinger |
| Correo | **Google Workspace** (MX de Google) |
| TXT existente | `google-site-verification=rloPWM69jaitUN9xJHL-c3N8HuH4BwC6tT5XrB_RyNE` |

⚠️ **El DNS de `www` ya es correcto** (CNAME → dominio raíz). El fallo es de
configuración en Coolify, no de DNS. Ver [RUNBOOK_FASE_2.md](RUNBOOK_FASE_2.md).

⚠️ **No borrar el TXT de google-site-verification:** usan Google Workspace para
el correo. Reemplazarlo en vez de añadir uno nuevo podría tumbar el email.

---

## 3. NAP oficial (Name · Address · Phone)

> **Regla:** el NAP debe ser idéntico, carácter por carácter, en la web, en
> Google Business Profile, en Instagram y en cualquier directorio. Las
> inconsistencias diluyen las señales de SEO local.

**Nombre:** STREX Holdings

**Teléfono:** `+1 (202) 766-2938`
*(antes `+1 (561) 704-2432`; cambiado el 2026-09-17 en el commit 384d365)*

**Email:** business@strexholdings.com

**Sede Estados Unidos:**
```
1919 S. Canal St
Highlands, TX 77562
```
El cliente escribió "Highland"; el CP 77562 corresponde a **Highlands** (con s),
en el área metropolitana de Houston. Corrección confirmada por el usuario.

**Oficina Colombia:**
```
Cra. 51B #80-58, Oficina 909
Barranquilla, Atlántico
```

**Venezuela:** ⛔ dirección pendiente de recibir.

---

## 4. Redes sociales

| Red | Estado | URL |
|---|---|---|
| Instagram | ✅ Confirmada y enlazada | https://www.instagram.com/strexholdings/ |
| LinkedIn | ⛔ Sin confirmar | — |
| YouTube | ⛔ Sin confirmar | — |

Instagram: 10.1K seguidores. Bio: *"International Industrial Holding. Connecting
companies, capabilities & opportunities. Houston • Venezuela • Colombia"*.

Los símbolos SVG de LinkedIn y YouTube ya están en el sprite de `index.html`
listos para usar; solo falta la URL. **No enlazar con `href="#"`.**

⚠️ **Ojo con la confusión de marca:** existe *Stratex Oil & Gas Holdings* (ticker
STTX), empresa cotizada del mismo sector y nombre casi idéntico. Verificar
siempre que un perfil o mención sea de STREX antes de enlazarlo.

---

## 5. Estado actual — bugs de producción

### 🔴 CRÍTICO — `www.strexholdings.com` caído · **sigue pendiente**

| Host | HTTP | Certificado |
|---|---|---|
| `strexholdings.com` | 200 ✅ | Let's Encrypt, válido hasta 2026-11-02 |
| `www.strexholdings.com` | **503** ❌ | `CN=TRAEFIK DEFAULT CERT` (inválido) |

**Causa:** Traefik no tiene router configurado para el subdominio `www`, así que
sirve su certificado de relleno y falla.

**Impacto:** quien escriba el `www` a mano ve una advertencia de seguridad del
navegador y luego un 503. Para un holding industrial es un daño de confianza
directo. Además Google trata `www` y sin-www como sitios separados.

**Fix:** añadir `www.strexholdings.com` como dominio del servicio en
Coolify/Traefik y configurar redirección **301 → `https://strexholdings.com`**.
Requiere acceso al VPS. **No resuelto — pendiente.**

### Ya resueltos (2026-09-15)
- ~~`robots.txt` → 404~~ ✅ creado
- ~~`sitemap.xml` → 404~~ ✅ creado
- ~~Sin canonical, sin Open Graph, sin Schema.org~~ ✅ añadidos
- ~~Teléfono incorrecto~~ ✅ corregido
- ~~Iconos sociales placeholder con `href="#"`~~ ✅ Instagram real
- ~~El bloque de contacto enlazaba a la versión rota con www~~ ✅ corregido

---

## 6. Tareas

### Fase 1 — Fundación ✅ completada (rama `seo/fase-1-fundacion`)
- [x] Clonar repo en local
- [x] Corregir teléfono a +1 (561) 704-2432
- [x] Reemplazar ubicación genérica por las dos sedes reales
- [x] Enlazar Instagram real con icono de marca
- [x] `<title>` y meta description orientados a búsqueda
- [x] Canonical, Open Graph, Twitter Card, favicon
- [x] JSON-LD: Organization + 2× LocalBusiness + WebSite
- [x] `robots.txt` y `sitemap.xml`
- [x] Corregir enlace interno a la versión www rota

### Fase 2 — Infraestructura 🟡 en curso
Diagnóstico completo y runbook listo: **[RUNBOOK_FASE_2.md](RUNBOOK_FASE_2.md)**.
Ejecuta el usuario en el VPS; la verificación la hago yo desde fuera.

- [x] Diagnosticar la causa raíz del fallo de `www` (config de Coolify, no DNS)
- [x] Localizar el DNS (GoDaddy) y detectar Google Workspace + TXT existente
- [x] Redactar el runbook con los valores exactos de Coolify
- [ ] **Añadir `www` al campo Domains + "Redirect to non-www" en Coolify** ← ahora
- [ ] Verificar que el redirect sea **301** y no 302 (Anexo A del runbook)
- [ ] Revisar el icono de Instagram en navegador antes de desplegar
- [x] Merge a `main` y push a GitHub (2026-09-16)
- [x] **Desplegado en producción** (2026-09-16). Las 11 URLs responden 200,
      sitemap y robots servidos, WebP activo, sin errores de consola
- [ ] Pedir acceso delegado a Search Console (el cliente tiene la cuenta)
- [ ] Verificar propiedad tipo **Dominio** vía TXT en GoDaddy (añadir, no reemplazar)
- [ ] Enviar `sitemap.xml` y solicitar indexación de la home
- [ ] Validar el JSON-LD con la Prueba de Resultados Enriquecidos
- [ ] Crear las 2 fichas de Google Business Profile (Highlands + Barranquilla)
- [ ] Medir Core Web Vitals reales (el hero tiene canvas animado + JPGs grandes)

### Fase 2.5 — Pulido de la web ✅ completada (misma rama)
Hecha en paralelo mientras la Fase 2 sigue bloqueada por el acceso al VPS.

**Rendimiento — imágenes: 783K → 201K (−74%)**
- [x] WebP con ffmpeg, redimensionadas a su tamaño real de uso
      (`crane.jpg`: 213K a 1000×1333px para mostrarse a 150×110px)
- [x] `<picture>` con fallback JPG; `image-set()` en los fondos CSS
- [x] `width`/`height` en todas las imágenes (evita CLS)
- [x] `loading="lazy"` salvo el hero, con `fetchpriority="high"` por ser LCP

**Accesibilidad**
- [x] `<main>` + skip link (WCAG 2.4.1, nivel A)
- [x] `aria-labelledby` en las 8 secciones
- [x] 54 `h4` → `h3`: 6 secciones saltaban de h2 a h4. CSS sincronizado
- [x] 3 fallos de contraste WCAG AA corregidos (ver tabla abajo)
- [x] `:focus-visible` explícito en enlaces y botones
- [x] `#capTrack` ahora es scrollable de verdad en escritorio

| Elemento | Antes | Ahora |
|---|---|---|
| `.service-card .num` (blue-300 / blanco) | 2.62:1 ❌ | 5.04:1 ✅ |
| `.cap-hint` (slate-500 / navy-950) | 3.80:1 ❌ | 8.82:1 ✅ |
| `.footer-bottom` (slate-500 / navy-950) | 3.80:1 ❌ | 8.82:1 ✅ |

**Maquetación y contenido**
- [x] `.contact-grid` de 4 a 3 columnas (5 items dejaban uno huérfano)
- [x] "Houston, Texas — Sede central" → "Highlands, Texas — Sede principal"
- [x] Logos y banderas con `alt=""` (el lector los duplicaba)

**Verificado en Chromium vía Playwright** a 1440/900/390px: sin errores de
consola, sin 404, el hero sirve WebP, el icono de Instagram renderiza como
logo de marca, skip link funcional, sin scroll horizontal.

### Pendientes de accesibilidad (no bloqueantes)
- [ ] `.cap-hint` tiene `aria-hidden="true"` y es la única pista de que el
      carrusel es deslizable: un lector de pantalla no la recibe
- [ ] `.logo-word small` a 9px con tracking 0.32em es ilegible para baja
      visión. Es branding, prioridad baja
- [ ] `.footer-bottom a:hover` es código muerto: no hay enlaces ahí.
      Sugiere que faltan avisos legales (privacidad / términos)

### Fase 5 — Reestructuración institucional (nov-2026) ✅ implementada el 2026-11-20
Detalle y mapa de URLs en [REESTRUCTURACION.md](REESTRUCTURACION.md).
Decisiones del usuario (2026-11-20): seguir el PDF al pie de la letra, publicar, usar fotos de stock y hacer la versión EN.
- [x] Analizar el PDF maestro y el borrador frente al sitio actual
- [x] Quitar a los aliados: sección, nav, JSON-LD, 8 logos y ~30 menciones en las páginas
- [x] 10 divisiones × 2 idiomas generadas desde `_build/divisiones.json`
- [x] Las 15 URLs viejas de `/servicios/` redirigen a su división (minería → #industrias, HSE → ingeniería)
- [x] Sitemap con 22 URLs y `hreflang` es/en/x-default
- [x] Portada según el PDF: hero §02, quiénes somos y misión/visión §03, modelo §16, experiencia §14 (con su descargo), industrias §17 (9), Venezuela §15, modalidades §17, presencia §18
- [x] Cifras del hero sin fuente sustituidas por conteos del propio portafolio (10 divisiones, 9 industrias, 7 modalidades, 3 países foco)
- [x] Versión EN completa (`/en/`)
- [x] Fotos de stock de dominio público o CC0 para 7 divisiones (`assets/CREDITOS-FOTOS.md`)
- [x] Header: el logo ya no se trunca en ningún ancho de 320 a 1920 px (antes fallaba entre 870 y 1100 px)
- [x] Verificado: 22 páginas sin errores de consola ni 404 y sin desborde a 1440 y 390 px; enlaces internos y JSON-LD válidos
- [ ] **Validar con el cliente** qué servicios presta directamente y cuáles mediante terceros (PDF §20). Hoy la web lo cubre con la nota "directamente o mediante compañías especializadas"
- [ ] **Validar la sección Experiencia internacional**: el PDF pide evidencia y permiso de cada aliado antes de publicar países. Se publicó el texto del PDF §14 con su descargo
- [ ] Revisar la traducción EN con un especialista del sector (PDF §20)
- [ ] 301 reales en nginx/Coolify para `/servicios/*` (hoy meta refresh)
- [ ] `www`: cambiar 307 → 301
- [ ] Reenviar el sitemap en Search Console
- [ ] qa-web y revisor-ux: no se corrieron (requieren aprobación del usuario)

### Fase 3 — Datos pendientes del cliente ⛔
- [ ] Dirección de Venezuela
- [ ] URL de LinkedIn y YouTube (si existen)
- [ ] **Aclarar "Washington":** ¿estado de Washington o Washington D.C.?
      Hay tensión con la sede real de Texas. Ver sección 7.
- [ ] Confirmar si las cifras del hero son reales (6 empresas, +15 años,
      3 países, 100+ proyectos) — si van en Schema.org deben ser verificables

### Fase 4 — Arquitectura de contenido 🟡 en curso
- [x] **10 páginas de servicio** con URL propia, generadas desde plantilla
- [x] Malla de enlaces internos: home → servicio → 4 relacionados
- [x] `sitemap.xml` con 11 URLs
- [ ] Páginas por sede para SEO local
- [ ] Google Business Profile en Highlands/Houston y Barranquilla
- [ ] Investigación de keywords real por país (**bloqueada**, ver abajo)
- [ ] Blog: definir arquitectura y automatización

#### Las 10 páginas y por qué esas

> ⚠️ **Histórico, sustituido el 2026-11-20 por la Fase 5.** Las páginas de `/servicios/`
> ahora solo redirigen a las 10 divisiones; `servicios.json` ya no existe.
Se descartaron 5 de los 15 servicios de la home:

| Descartado | Motivo |
|---|---|
| Petroquímica, Energía, Minería | Ya tienen tarjeta en la sección **industrias**. Dos URLs por el mismo término se canibalizan |
| Lubricación industrial, Soluciones ambientales | Alcance específico de Biomax, demasiado de nicho para sostener página propia |

Las 10 publicadas: montajes industriales, ingeniería y consultoría, integridad
mecánica, operación y mantenimiento, procura internacional, construcción e
infraestructura, soluciones metalmecánicas, sistemas de almacenamiento,
logística integral, y seguridad salud y medio ambiente.

#### Cómo se regeneran
El contenido vive en `_build/servicios.json`; `_build/generar.js` lo convierte
en HTML y reescribe el `sitemap.xml`.

```bash
node _build/generar.js
```

Es **idempotente**: corregir la plantilla y volver a ejecutar actualiza las 9
páginas a la vez. **`servicios/montajes-industriales.html` NO se regenera** —
está escrita a mano como referencia visual, así que un cambio de plantilla hay
que replicarlo ahí manualmente.

#### ⛔ Herramientas de keywords no disponibles
Ninguna funcionó al intentar la investigación (2026-09-16):

| Herramienta | Error |
|---|---|
| Ahrefs | `Insufficient plan` |
| Semrush | `API UNITS BALANCE IS ZERO` |
| Ubersuggest | Requiere OAuth, no ejecutable en sesión no interactiva |

La estructura de las páginas se apoyó en análisis de competencia real, no en
volúmenes inventados:
- **INTAC Ingeniería** usa URL propia por servicio → patrón confirmado
- **MRS Industrial** repite la ciudad en títulos y subtítulos
- **Ninguno de los dos tiene blog** → hueco de contenido técnico abierto

Para obtener volúmenes reales hay que recargar créditos de Semrush o autorizar
Ubersuggest desde los conectores de claude.ai.

---

## 7. Nota estratégica sobre el plan de 3 países

El brief original pide "blogs automatizados" para posicionar en Colombia,
Venezuela y EE.UU. Antes de construirlo hay que registrar una objeción:

**El nicho no premia el volumen.** Un EPC industrial no se vende por búsquedas
genéricas masivas. Su mercado es un conjunto reducido de compradores
corporativos. Un blog automatizado de alto volumen es táctica de e-commerce y
aquí produciría contenido que nadie del sector lee ni cita.

**Lo que sí mueve la aguja:**
1. **SEO local por sede** — Google Business Profile es el mayor retorno
   inmediato para "montajes industriales Barranquilla" o "integridad mecánica Houston".
2. **Páginas de servicio** — 15 servicios sin URL propia es la mayor oportunidad
   desperdiciada del sitio. Eso sí es SEO programático con sustancia.
3. **Contenido técnico de autoridad** — pocos artículos y muy buenos, del tipo
   que un ingeniero guardaría. No volumen.

**Sobre Venezuela:** el tráfico de búsqueda es bajo y el acceso a servicios de
Google es irregular. Conviene moderar expectativas de captación orgánica ahí;
probablemente pesen más Instagram y el contacto directo.

**Sobre Washington:** el cliente mencionó Washington pero su sede está en Texas.
Houston es la capital mundial del oil & gas — es donde está el mercado de este
nicho. Si el interés en Washington D.C. es por contratos federales, esa es una
estrategia distinta (registro SAM.gov, no SEO). **Aclarar antes de invertir.**

---

## 8. Auditoría de diseño (impeccable) — hallazgos evaluados

Revisados el 2026-09-15. Los tres son de código preexistente, no de los cambios
de SEO. **No se ha persistido ningún ignore** — requieren confirmación del usuario.

| Hallazgo | Veredicto | Razón |
|---|---|---|
| `side-tab` — `.company-card::before` | Falso positivo | No es un acento estático: la línea de 3px arranca en `scaleX(0)` (invisible) y se despliega solo en hover. Es una animación de revelado, no el borde permanente que la regla persigue. |
| `codex-grid-background` — `.hero::before` | Falso positivo | La propia regla exceptúa superficies de tipo *blueprint*. Es una retícula de plano técnico sobre el hero de una empresa de ingeniería EPC, con `mask-image` que la desvanece. Uso domésticamente correcto. |

> Se identifican por selector, no por número de línea: las ediciones los
> desplazan y la tabla quedaba desfasada en cada sesión.
| `overused-font` — Inter (en `index.html` y en cada página de servicio) | **Real, no corregido** | Inter es efectivamente genérica. Pero los titulares ya usan Bricolage Grotesque (distintiva) e Inter solo carga el cuerpo, donde la neutralidad ayuda. Cambiar la tipografía base es **decisión de marca del cliente**, no un fix técnico a colar en un commit de SEO. Además debe cambiarse en **todas** las páginas a la vez: hacerlo solo en una la desalinearía del resto. Proponer aparte. |

> El hallazgo de `overused-font` reaparece en cada página que carga la línea de
> Google Fonts, a propósito. **Si algún día se cambia la tipografía**, hay que
> tocar dos sitios: `index.html` y la plantilla de `_build/generar.js` (esa
> edición actualiza las 9 generadas), además de `servicios/montajes-industriales.html`,
> que está escrita a mano.

Si el cliente confirma que quiere conservar Inter, persistir con:
`/impeccable hooks ignore-value overused-font "Inter" --shared`

## 9. Trampas del proyecto

- El sitio **no abre con doble clic** de forma fiable si se usan rutas absolutas;
  para previsualizar: `uv run python -m http.server 8901` en la raíz del repo.
- `python` **no está en el PATH** de esta máquina. Usar `uv run python`.
- Obscura (navegador headless) **no logra conectar** al servidor local: timeout
  a los 30s en `browser_navigate`, reproducido en dos sesiones con `127.0.0.1`
  y con `localhost`. **Alternativa que sí funciona:** Playwright con Chromium vía
  `uv run --with playwright python script.py`. Es lo que se usó para verificar
  el render. No insistir con Obscura para previews locales de este proyecto.
- Las imágenes tienen versión `.webp` **y** `.jpg`. Si se reemplaza una foto hay
  que regenerar el WebP, o el navegador seguirá sirviendo la versión vieja:
  `ffmpeg -i foto.jpg -vf "scale=ANCHO:-2" -c:v libwebp -quality 80 foto.webp`
- Los iconos del sprite usan `stroke` con `fill:none`. Los logos de marca son
  siluetas sólidas y necesitan la clase `.icon-brand`, que invierte eso. Sin
  ella se ven como manchas negras.
