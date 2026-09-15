# Runbook Fase 2 — Infraestructura y Search Console

> Guía de ejecución paso a paso. Tú aplicas, yo verifico después.
> Creada: 2026-09-15 · Ver [SPEC.md](SPEC.md) para el contexto completo.

---

## Diagnóstico confirmado antes de empezar

| Comprobación | Resultado |
|---|---|
| VPS | `31.97.147.5` — el mismo de clubkabanna |
| Servidor web | nginx 1.31.3 detrás de Traefik |
| DNS `strexholdings.com` | → `31.97.147.5` ✅ |
| DNS `www` | CNAME → `strexholdings.com` ✅ **ya correcto** |
| Nameservers | GoDaddy (`ns47/ns48.domaincontrol.com`) |
| Correo | Google Workspace (MX de Google) |
| TXT existente | `google-site-verification=rloPWM69jaitUN9xJHL-c3N8HuH4BwC6tT5XrB_RyNE` |
| `http://strexholdings.com` | 307 → https ✅ |
| `http://www...` | **404** `"404 page not found"` ❌ |
| `https://www...` | **503** `"no available server"` + cert `TRAEFIK DEFAULT CERT` ❌ |

**Causa raíz:** el DNS está bien. El servicio en Coolify tiene declarado un solo
dominio (`strexholdings.com`), así que Traefik no genera router para `www` y las
peticiones caen al catch-all. **Es configuración, no DNS.** No hay que esperar
propagación.

---

## PASO 1 — Arreglar `www` en Coolify 🔴 prioridad máxima

1. Entrar a Coolify en el VPS `31.97.147.5` y abrir el servicio de
   **strexholdings**.
2. Ir a **Configuration → General**, campo **Domains** (FQDN).
3. Cambiar el valor para que contenga **ambos** dominios separados por coma,
   sin espacio:
   ```
   https://strexholdings.com,https://www.strexholdings.com
   ```
4. Verificar que **Readonly labels** esté **activado** (es el valor por defecto).
   Si está desactivado, el ajuste del paso 5 no aparece.
5. En **Set Direction**, seleccionar **"Redirect to non-www."**
   → esto hace que `www` redirija al dominio sin www, que es el canonical que ya
   declaramos en el HTML.
6. **Guardar** y **Redeploy** del servicio.
7. Esperar ~1-2 min a que Let's Encrypt emita el certificado para `www`.

> ⚠️ **Importante:** el redirect por defecto de Traefik es **302** (temporal).
> Para SEO necesitamos **301** (permanente). El ajuste integrado de Coolify
> debería dar 301, pero **hay que comprobarlo** — es justo lo que verifico yo
> en el paso 3. Si sale 302, se corrige con labels manuales (ver Anexo A).

---

## PASO 2 — Desplegar la rama con los cambios de SEO

Los cambios de Fase 1 están en la rama `seo/fase-1-fundacion`, **sin desplegar**.
El sitio en producción sigue con el teléfono viejo y sin robots/sitemap.

Opciones:
- **Si Coolify despliega desde `main`:** hacer merge de la rama a `main` y push.
- **Si despliega desde otra rama:** cambiar la rama del servicio, o hacer merge
  a la que corresponda.

```bash
cd "C:/anti/CLIENTES/AMIGO OSVALDO/strex-holdings-web"
git checkout main
git merge seo/fase-1-fundacion
git push origin main
```

> ❗ **Antes del merge, abre el sitio en el navegador** y revisa el footer: el
> icono de Instagram debe verse como el logo de Instagram, no como una mancha
> negra. No pude verificarlo visualmente (Obscura dio timeout contra el
> servidor local). Para previsualizar:
> `uv run python -m http.server 8901` y abrir `http://127.0.0.1:8901`

---

## PASO 3 — Verificación (esto lo hago yo)

Cuando termines los pasos 1 y 2, avísame y compruebo desde fuera:

- [ ] `https://www.strexholdings.com` responde **301** hacia la versión sin www
      (301, **no** 302 — si es 302 hay que aplicar el Anexo A)
- [ ] El certificado de `www` es de **Let's Encrypt**, no `TRAEFIK DEFAULT CERT`
- [ ] `https://strexholdings.com/robots.txt` → 200
- [ ] `https://strexholdings.com/sitemap.xml` → 200
- [ ] El teléfono correcto aparece en producción
- [ ] El JSON-LD se sirve y es válido

---

## PASO 4 — Google Search Console

**Quién:** el cliente tiene la cuenta de Google. Como usan **Google Workspace**
y ya existe un `google-site-verification` en el DNS, es muy probable que ya
tengan acceso — habría que pedir que te añadan como **usuario delegado** de la
propiedad (Configuración → Usuarios y permisos → Añadir usuario, permiso
*Completo*). Es más limpio que compartir contraseñas.

**Tipo de propiedad:** usar **"Dominio"** (verificación por DNS), no "Prefijo de
URL". La propiedad de dominio cubre www, sin-www, http y https de una sola vez.
Requiere añadir un registro TXT en **GoDaddy**.

> Ya existe un TXT de google-site-verification. Un dominio admite **varios** TXT
> de verificación sin conflicto: **añadir uno nuevo, no reemplazar el existente**
> — borrarlo podría romper la verificación de Google Workspace y tumbar el correo.

**Orden correcto:**
1. Arreglar `www` (Paso 1) — verificar con una variante caída da datos sucios
2. Desplegar los cambios (Paso 2)
3. Verificar la propiedad de dominio en Search Console
4. Enviar `https://strexholdings.com/sitemap.xml`
5. Usar "Inspección de URLs" para solicitar indexación de la home
6. Validar el JSON-LD en la Prueba de Resultados Enriquecidos:
   https://search.google.com/test/rich-results

---

## PASO 5 — Google Business Profile (el mayor retorno para SEO local)

Dos fichas, una por sede. Es lo que más mueve la aguja en este nicho.

**Ficha 1 — Highlands, TX**
```
Nombre:    STREX Holdings
Dirección: 1919 S. Canal St, Highlands, TX 77562
Teléfono:  +1 (561) 704-2432
Web:       https://strexholdings.com
```

**Ficha 2 — Barranquilla**
```
Nombre:    STREX Holdings
Dirección: Cra. 51B #80-58, Oficina 909, Barranquilla, Atlántico
Teléfono:  +1 (561) 704-2432
Web:       https://strexholdings.com
```

> El NAP debe coincidir **carácter por carácter** con el de la web y el JSON-LD.
> Ambas fichas requieren verificación postal o por vídeo. Puede tardar semanas:
> conviene arrancarlo cuanto antes, en paralelo con lo demás.

---

## Anexo A — Si el redirect sale 302 en vez de 301

Desactivar **Readonly labels** en el servicio y añadir estas labels manualmente:

```
traefik.http.middlewares.strex-redirect.redirectregex.regex=^(http|https)://(?:www\.)?(.+)
traefik.http.middlewares.strex-redirect.redirectregex.replacement=${1}://${2}
traefik.http.middlewares.strex-redirect.redirectregex.permanent=true
coolify.traefik.middlewares=strex-redirect
```

`permanent=true` es lo que fuerza el **301**.

Fuente: [Coolify Docs — Redirects](https://coolify.io/docs/knowledge-base/proxy/traefik/redirects)

---

## Anexo B — Riesgos a tener presentes

| Riesgo | Mitigación |
|---|---|
| Tocar el TXT existente rompe Google Workspace → **se cae el correo** | Solo **añadir** TXT, jamás reemplazar el de google-site-verification |
| El VPS aloja otros proyectos (clubkabanna) | Tocar **solo** el servicio de strexholdings; no reiniciar Traefik globalmente |
| Redirect 302 en vez de 301 | Verificar en Paso 3; corregir con Anexo A |
| Cert de Let's Encrypt caduca el 2026-11-02 | Se renueva solo; si falla, revisar que el puerto 80 acepte el challenge |
| Desplegar sin revisar el icono de Instagram | Previsualizar en local antes del merge (Paso 2) |
