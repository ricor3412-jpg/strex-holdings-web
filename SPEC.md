# SPEC — STREX Holdings · Posicionamiento SEO

> **Fuente de verdad del proyecto.** Última actualización: 2026-09-15
> Cliente: STREX Holdings (contacto: Osvaldo Castellar)
> Repo: https://github.com/ricor3412-jpg/strex-holdings-web

---

## 1. Qué es STREX Holdings

Holding industrial internacional. Agrupa 6 empresas especializadas y vende
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
| Hosting | VPS propio en Hostinger |
| Proxy | Traefik (el cert por defecto delata Traefik, probablemente vía Coolify) |
| Dominio | `strexholdings.com` — **solo responde sin www** |

---

## 3. NAP oficial (Name · Address · Phone)

> **Regla:** el NAP debe ser idéntico, carácter por carácter, en la web, en
> Google Business Profile, en Instagram y en cualquier directorio. Las
> inconsistencias diluyen las señales de SEO local.

**Nombre:** STREX Holdings

**Teléfono:** `+1 (561) 704-2432`
*(el anterior `+1 (561) 702-2422` era incorrecto — corregido 2026-09-15)*

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

### 🔴 CRÍTICO — `www.strexholdings.com` caído

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

### Fase 2 — Infraestructura ⛔ bloqueada (requiere acceso VPS)
- [ ] **Arreglar `www` en Traefik + redirección 301** ← máxima prioridad
- [ ] Desplegar la rama `seo/fase-1-fundacion` a producción
- [ ] Verificar dominio en Google Search Console
- [ ] Enviar `sitemap.xml` desde Search Console
- [ ] Validar el JSON-LD con la Prueba de Resultados Enriquecidos de Google
- [ ] Medir Core Web Vitals reales (el hero tiene canvas animado + JPGs grandes)

### Fase 3 — Datos pendientes del cliente ⛔
- [ ] Dirección de Venezuela
- [ ] URL de LinkedIn y YouTube (si existen)
- [ ] **Aclarar "Washington":** ¿estado de Washington o Washington D.C.?
      Hay tensión con la sede real de Texas. Ver sección 7.
- [ ] Confirmar si las cifras del hero son reales (6 empresas, +15 años,
      3 países, 100+ proyectos) — si van en Schema.org deben ser verificables

### Fase 4 — Arquitectura de contenido (no iniciada)
- [ ] Página dedicada por servicio (hoy los 15 son solo `<h4>` sin URL propia)
- [ ] Páginas por sede para SEO local
- [ ] Google Business Profile en Highlands/Houston y Barranquilla
- [ ] Investigación de keywords real por país
- [ ] Blog: definir arquitectura y automatización

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

## 8. Trampas del proyecto

- El sitio **no abre con doble clic** de forma fiable si se usan rutas absolutas;
  para previsualizar: `uv run python -m http.server 8901` en la raíz del repo.
- `python` **no está en el PATH** de esta máquina. Usar `uv run python`.
- Obscura (navegador headless) **no logró conectar** al servidor local en esta
  sesión: timeout a los 30s en `browser_navigate`, probablemente por el canvas
  animado del hero. La verificación visual se hizo por análisis de código.
- Los iconos del sprite usan `stroke` con `fill:none`. Los logos de marca son
  siluetas sólidas y necesitan la clase `.icon-brand`, que invierte eso. Sin
  ella se ven como manchas negras.
