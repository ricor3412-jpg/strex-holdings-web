# CLAUDE.md — STREX Holdings

> Contexto rápido. La fuente de verdad es **[SPEC.md](SPEC.md)** — leerla antes de trabajar.

## Qué es
Landing estática de un holding industrial (proyectos EPC, oil & gas, minería,
petroquímica). HTML + CSS + JS vanilla, sin build ni dependencias.

## Stack
- `index.html` · `styles.css` · `script.js` · `assets/`
- Hosting: **VPS Hostinger** con Traefik (probablemente Coolify)
- Dominio: `strexholdings.com` (⚠️ **la versión con `www` está caída** — ver SPEC §5)

## Datos que NO se inventan
- Teléfono: `+1 (561) 704-2432`
- Email: `business@strexholdings.com`
- Sede USA: 1919 S. Canal St, Highlands, TX 77562
- Oficina CO: Cra. 51B #80-58, of. 909, Barranquilla
- Instagram: https://www.instagram.com/strexholdings/
- Venezuela, LinkedIn y YouTube: **pendientes, no rellenar con placeholders**

Si cambia cualquiera de estos, hay que actualizarlo en **4 sitios**: el bloque de
contacto, el JSON-LD del final de `index.html`, la SPEC y este archivo.

## Restricciones
- `python` no está en el PATH → usar `uv run python`
- Previsualizar: `uv run python -m http.server 8901`
- Los logos de marca del footer necesitan la clase `.icon-brand` (invierte
  stroke→fill). Sin ella se ven como manchas negras.
- ⚠️ No confundir con **Stratex Oil & Gas Holdings** (STTX), empresa cotizada
  distinta, mismo sector, nombre casi idéntico.

## Páginas de servicio
10 páginas bajo `servicios/`, generadas desde plantilla:

```bash
node _build/generar.js     # regenera las 9 + el sitemap
```

- Contenido en `_build/servicios.json`, plantilla en `_build/generar.js`
- ⚠️ **`servicios/montajes-industriales.html` NO se regenera**: está escrita a
  mano. Un cambio de plantilla hay que replicarlo ahí a mano.
- Al añadir una página hay que enlazarla desde su tarjeta en `index.html`, o
  queda huérfana para Google.

## Estado
Todo en la rama `seo/fase-1-fundacion`, **sin desplegar**. Lo siguiente es
arreglar el `www` en el VPS. Ver [RUNBOOK_FASE_2.md](RUNBOOK_FASE_2.md).
