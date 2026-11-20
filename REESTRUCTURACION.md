# Reestructuración institucional — análisis (2026-11-20)

> **Estado: implementada el 2026-11-20** (ver SPEC, Fase 5). Decisiones: PDF al pie de la letra, fotos de stock y versión EN.
> Minería quedó solo como industria; HSE redirige a Ingeniería; las cifras del hero se reemplazaron por conteos del portafolio.

> Fuentes: `STREX_HOLDINGS_Contenido_Corporativo_Integral.pdf` (documento maestro,
> nov-2026, 10 págs.) y el borrador previo que envió el cliente por chat.
> **Fuente de verdad del contenido: el PDF.** El borrador sirve solo para la
> granularidad de los servicios: tiene las mismas 10 divisiones, con más viñetas.

## 1. Qué pide el cliente
1. **Quitar a los aliados del sitio público**: nombres, logos, fichas, JSON-LD
   y menciones en las páginas de servicio.
2. Pasar de **15 servicios por disciplina** a **10 divisiones de negocio**.
3. Añadir: modelo de gestión (5 pasos), industrias (9), modalidades de
   contratación, experiencia internacional del ecosistema, Venezuela como
   prioridad estratégica, y versión en inglés.
4. Reglas editoriales (PDF §20): no atribuir activos ni resultados de terceros a
   STREX, quitar las cifras sin fuente y evitar superlativos.

## 2. Qué hay hoy en la web que choca con el documento

| Dónde | Hoy | Problema según el PDF |
|---|---|---|
| Sección `#empresas` + nav «Aliados» | 8 fichas con logo (7 en producción) | Hay que eliminarlas |
| JSON-LD `member` | 8 `Organization` con nombre y URL | Hay que eliminarlas (Google las asocia) |
| 13 páginas de servicio | ~30 menciones de TCT, PTSC, Biomax, Metalprest y Totalmontajes | Hay que reescribirlas o retirarlas |
| `assets/logos/` | 8 logos | Hay que borrarlos del repo y del servidor |
| Hero stats | 8 aliados · +15 años · 3 países · 100+ proyectos | Cifras sin fuente: el PDF pide quitarlas |
| «Por qué elegir STREX» | «Trayectoria comprobada», «Tecnología de última generación» | Son superlativos sin respaldo |
| Venezuela | «Presencia operativa» | El PDF la presenta como «prioridad estratégica», sin operaciones afirmadas |
| Hero | «conecta empresas líderes» | Hay que reemplazarlo por el texto del PDF §02 |
| Megamenú | «15 servicios… cada disciplina con su propio equipo» | Pasa a 10 divisiones |

## 3. Mapa de las 15 páginas actuales → 10 divisiones

| División (PDF) | Páginas actuales que absorbe | Página nueva |
|---|---|---|
| 04 Perforación y servicios a pozos | — | **Nueva** |
| 05 Producción y optimización de campos | — | **Nueva** |
| 06 Generación eléctrica | `energia` | Se reescribe |
| 07 Química y petroquímica | `petroquimica`, `lubricacion-industrial` | Se reescribe |
| 08 Marítimo y offshore | (parte marítima de `logistica-integral`) | **Nueva** |
| 09 Ingeniería, mantenimiento e integridad | `ingenieria-y-consultoria`, `integridad-mecanica`, `operacion-y-mantenimiento`, `montajes-industriales`, `soluciones-metalmecanicas`, `sistemas-de-almacenamiento` | Se reescribe |
| 10 Gas natural, GNL y GLP | — | **Nueva** |
| 11 Infraestructura y renovables | `construccion-e-infraestructura`, `soluciones-ambientales` | Se reescribe |
| 12 Procura y cadena de suministro | `procura-internacional`, `logistica-integral` | Se reescribe |
| 13 Desarrollo de negocios e inversiones | — | **Nueva** |
| *(sin división)* | `mineria`, `seguridad-salud-y-medio-ambiente` | ⚠️ Hay que decidir |

- **Minería**: en el PDF solo aparece como industria. La página actual describía
  la operación minera de TCT. Al quitar al aliado, se queda sin contenido propio.
- **HSE**: no es una división. Puede pasar a un principio transversal, pero el
  PDF pide validar las habilitaciones HSE antes de ofrecerlas.
- **URLs viejas**: las 15 están en el sitemap y en producción. Cada una debe
  responder **301** hacia su división. Si el despliegue de Coolify no permite
  editar nginx, la alternativa es dejar un stub con `canonical` y
  `meta refresh` (peor para SEO).

## 4. Arquitectura propuesta (PDF §19, adaptada al sitio estático)
- `index.html`: portada, quiénes somos, misión y visión, divisiones (10
  tarjetas), modelo de gestión, industrias, Venezuela (bloque), modalidades,
  presencia y contacto.
- `divisiones/<slug>.html` × 10: se generan con `_build/generar.js`. La
  plantilla actual (lead, alcance, proceso, FAQ, relacionados) sirve tal cual.
- `venezuela.html`: el PDF §15 da para una página propia y tiene intención de
  búsqueda local.
- `experiencia.html`: **solo si el cliente aporta evidencia** (PDF §14 y §20).
- Versión EN: `/en/…` con `hreflang`. Duplica todas las páginas.

## 5. Bloqueos y decisiones del cliente (no se inventan)
1. ¿Se publica ya o espera la validación interna de los servicios (directos o
   por terceros)? El PDF dice «sujeto a validación».
2. Las cifras del hero: ¿se quitan o el cliente aporta la fuente?
3. ¿El inglés entra en esta fase o en una segunda?
4. ¿Qué hacer con Minería y HSE?
5. ¿Se publica la sección «Experiencia internacional»? Requiere permiso de cada
   aliado.
6. Faltan fotos para perforación, offshore, generación y gas. Hoy solo hay
   refinería, grúa, minería y puerto. ¿Las aporta el cliente o se usan fotos de
   stock?
7. Teléfono: el código usa `+1 (202) 766-2938` (commit 384d365). Hay que
   confirmar que sigue vigente.

## 6. Hallazgos técnicos de paso
- Producción va 1 commit por detrás de `main`: Red Post Energy no se desplegó.
  Da igual, porque se elimina.
- `www` ya responde, pero con **307** (temporal) y no con 301. Hay que
  corregirlo en Coolify (RUNBOOK, Anexo A).
- El SPEC y el CLAUDE.md seguían con el teléfono 561 y con «6 empresas»; se
  corrigieron en este turno.
