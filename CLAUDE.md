# CLAUDE.md — STREX Holdings

> Contexto rápido. La fuente de verdad es **[SPEC.md](SPEC.md)** — leerla antes de trabajar.

## Qué es
Sitio estático bilingüe (ES/EN) de un grupo empresarial de energía, oil & gas,
industria e infraestructura. HTML + CSS + JS vanilla; todo el HTML sale de un
generador Node sin dependencias.

## Stack
- `index.html` (ES) · `en/index.html` · `divisiones/` · `en/divisions/` · `styles.css` · `servicio.css` · `script.js` · `assets/`
- Hosting: **VPS Hostinger** con Traefik (probablemente Coolify)
- Dominio: `strexholdings.com` (`www` ya responde, pero con **307** y no con 301; ver SPEC §5)

## Datos que NO se inventan
- Teléfono: `+1 (202) 766-2938` (cambiado el 2026-09-17, commit 384d365; confirmar vigencia)
- Email: `business@strexholdings.com`
- Sede USA: 1919 S. Canal St, Highlands, TX 77562
- Oficina CO: Cra. 51B #80-58, of. 909, Barranquilla
- Instagram: https://www.instagram.com/strexholdings/
- Venezuela, LinkedIn y YouTube: **pendientes, no rellenar con placeholders**

Si cambia cualquiera de estos, hay que actualizarlo en **4 sitios**: el bloque de
contacto de `_build/cuerpo.es.html` y `cuerpo.en.html`, el JSON-LD de
`portada()` y el contacto de `pagina()` en `_build/generar.js`, la SPEC y este archivo.

## Restricciones
- `python` no está en el PATH → usar `uv run python`
- Previsualizar: `uv run python -m http.server 8901`
- Los logos de marca del footer necesitan la clase `.icon-brand` (invierte
  stroke→fill). Sin ella se ven como manchas negras.
- ⚠️ No confundir con **Stratex Oil & Gas Holdings** (STTX), empresa cotizada
  distinta, mismo sector, nombre casi idéntico.

## Cómo se genera el sitio (no editar HTML generado a mano)
```bash
node _build/generar.js   # portadas ES/EN, 20 páginas de división, 15 redirecciones y sitemap
```
- `_build/divisiones.json`: las 10 divisiones, ES y EN emparejadas (slug, textos, foto, icono,
  relacionadas). Los servicios van en `grupos: [{ t, s: [...] }]`, y ES y EN tienen el mismo orden.
- `_build/cuerpo.es.html` / `cuerpo.en.html`: cuerpo de cada portada, con marcadores
  `{{MEGA}}`, `{{MOBILE}}`, `{{CARDS}}`, `{{STEPS}}` y `{{VZ}}` (tarjetas de Venezuela, datos en
  `VZ` de `generar.js`). Las rutas del EN llevan `../`.
- **Despliegue:** Coolify no despliega solo con el push; hay que pulsar Redeploy.
- **Caché:** nginx no envía `Cache-Control`. Tras publicar, el cliente puede ver la versión
  vieja durante días: que recargue con Ctrl+F5.
- `_build/sprite.html`: iconos de la portada. Las divisiones usan su propio `SPRITE` en `generar.js`.
- `servicios/*.html`: **solo redirecciones** (meta refresh + canonical) de las 15 URLs
  viejas; ver `VIEJAS` en `generar.js`. El 301 real requiere nginx/Coolify.
- Fotos de stock: dominio público o CC0, con origen en `assets/CREDITOS-FOTOS.md`.
- Header: entre 861 y 1240 px se oculta el CTA y entre 861 y 960 px el selector de
  idioma, para que el logo no se trunque. Cualquier enlace nuevo en el menú exige
  volver a medir (`scrollWidth` de `.logo-word`).
- Reglas editoriales del cliente (PDF §20): **no nombrar aliados**, no publicar cifras sin
  fuente, no afirmar activos propios (taladros, flotas, plantas) ni contratos adjudicados.

## Estado
Reestructuración nov-2026 hecha: sin aliados, 10 divisiones, versión EN y Venezuela.
El análisis está en [REESTRUCTURACION.md](REESTRUCTURACION.md) y el documento
maestro del cliente es `Downloads/STREX_HOLDINGS_Contenido_Corporativo_Integral.pdf`.
Pendientes en SPEC §6, Fase 5.
