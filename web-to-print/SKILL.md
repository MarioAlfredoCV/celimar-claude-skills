---
name: "web-to-print"
description: "Convierte cualquier página web en un artículo editorial limpio con resumen IA al inicio, entregado como PDF en tamaño carta con tipografía Bespoke Sans. ACTIVAR cuando el usuario solicite: imprimir una página, guardar un artículo como PDF, \"convierte esta página a PDF\", \"quiero guardar este artículo en PDF\", \"genera una versión imprimible\", \"limpia esta página para imprimir\", o cuando esté usando la extensión de Claude para Chrome y quiera guardar el contenido de la página activa como PDF limpio. También activar si el usuario proporciona una URL y pide una versión limpia, editorial o imprimible de su contenido. Activar incluso si el usuario no menciona explícitamente \"skill\" o \"web-to-print\" — basta con que la intención sea convertir una página web a PDF."
---

# web-to-print

Convierte páginas web en artículos editoriales limpios en PDF.
Siempre tamaño carta. Siempre con resumen IA al inicio. Siempre con Bespoke Sans.
El output debe resistir la revisión de un lector crítico y perfeccionista.

---

## Paso 0 — Leer font-brand

Antes de generar cualquier output, leer el skill `font-celimar-brand` para aplicar Bespoke Sans.

- Para **PDF via WeasyPrint** (Chat) o **Chromium headless** (Claude Code local): usar la sección **HTML @font-face** del
  reference file de Bespoke Sans → embeber fonts como base64 en el HTML intermedio.
- Para **Chrome extension con bash disponible**: leer los archivos .otf y embeber como
  base64 vía `javascript_tool`.
- Para **Chrome extension sin bash**: usar Inter (Google Fonts CDN) como alternativa.
  Notificar al usuario esta limitación al final.

Rutas de fonts (probar en orden):
```
<HOME>/.claude/skills/font-celimar-brand/assets/fonts/BespokeSans/   ← Claude Code local (prioridad; skill de fuentes propia del autor)
/mnt/skills/user/font-brand/assets/fonts/BespokeSans/                        ← Claude Chat (nube)
```

Si ninguna de esas rutas existe (no tienes la skill de fuentes de marca), usa **Inter** (Google Fonts) como fuente alternativa y avísalo al usuario al final.

---

## Paso 1 — Detectar contexto de ejecución

| Señal disponible | Contexto |
|---|---|
| Herramientas de browser activas (`navigate`, `read_page`, `javascript_tool`) | **A — Chrome extension** |
| `bash_tool` + `present_files`, sin herramientas de browser | **B — Claude Chat** |
| `bash_tool` + carpeta de proyecto activa (Cowork, ya no se usa) | **C — Claude Cowork** |
| Claude Code local en Windows (Bash/PowerShell + Read/Write) | **D — Claude Code local** |

---

## Contexto A — Claude en Chrome (extensión)

### A1. Extraer contenido de la página activa

Usar `get_page_text` + `read_page` para obtener título, subtítulo, autor, fecha, cuerpo,
URL, imágenes editoriales, tablas.

### A2. Generar resumen editorial (ver sección "Resumen Editorial")

### A3. Tipografía

**Si bash_tool disponible:** leer BespokeSans-*.otf → base64 → inyectar vía `javascript_tool`
**Si no:** cargar Inter desde Google Fonts CDN como fallback.

### A4. Inyectar CSS editorial + limpieza de UI

Usar `javascript_tool`. Ver especificación CSS completa en sección "Formato Visual".

### A5. Insertar resumen al inicio del artículo

### A6. Intentar impresión automática

```javascript
window.print();
```

### A7. Fallback si la impresión falla

> "La página ya está reformateada. Presiona Ctrl+P → Guardar como PDF →
> Carta → desactiva encabezados/pies del navegador → Guardar."

---

## Contexto B — Claude Chat

### B1. Verificar URL

Si no se proporcionó → solicitarla. No proceder sin ella.

### B2. Obtener y parsear contenido

```python
import requests
from bs4 import BeautifulSoup

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
resp = requests.get(url, headers=headers, timeout=15)
soup = BeautifulSoup(resp.text, 'html.parser')
```

Si 401/403/paywall → informar al usuario y detener.

### B3. Extraer solo el contenido editorial

No usar el `<article>` completo — contiene bios de autor, sidebars y otros elementos UI.
Usar la función `extract_editorial_section()`:

```python
def extract_editorial_section(article):
    """
    Extrae el contenedor más puro de contenido editorial.
    Prioridad: <section class='article-body'> → sección más larga →
    div más largo → article completo como fallback.
    """
    # 1. Buscar sección semántica 'article-body'
    for child in article.children:
        if not isinstance(child, Tag): continue
        classes = ' '.join(child.get('class') or [])
        if child.name == 'section' and 'article-body' in classes.lower():
            return child

    # 2. Sección directa más larga por texto
    sections = [(len(c.get_text()), c) for c in article.children
                if isinstance(c, Tag) and c.name == 'section']
    if sections:
        return sorted(sections, reverse=True)[0][1]

    # 3. Div directo más largo
    divs = [(len(c.get_text()), c) for c in article.children
            if isinstance(c, Tag) and c.name == 'div']
    if divs:
        return sorted(divs, reverse=True)[0][1]

    return article
```

### B4. Eliminar tags no editoriales

```python
REMOVE_TAGS = ['nav', 'aside', 'script', 'style', 'iframe', 'button', 'form',
               'noscript', 'svg', 'header', 'footer', 'input', 'select',
               'textarea', 'label', 'canvas', 'video', 'audio']
for tag in REMOVE_TAGS:
    for el in content.find_all(tag): el.decompose()
```

### B5. Incrustar imágenes ANTES de la limpieza por clases

**CRÍTICO: las imágenes deben embeberse ANTES de eliminar elementos por clase.**
De lo contrario, la limpieza puede eliminar contenedores que envuelven las imágenes.

```python
imagenes_fallidas = []
imgs_ok = 0

for img in list(content.find_all('img')):
    if not isinstance(img, Tag): continue
    src = (img.get('src') or img.get('data-src') or
           img.get('data-lazy-src') or img.get('data-original'))
    if not src:
        img.decompose(); continue
    if src.startswith('data:'):
        imgs_ok += 1; continue
    # Omitir píxeles de tracking
    try:
        if int(img.get('width', 100)) < 50 or int(img.get('height', 100)) < 50:
            img.decompose(); continue
    except: pass
    try:
        r = requests.get(urljoin(url, src), timeout=8, headers=headers)
        if r.status_code == 200:
            ct = r.headers.get('content-type', 'image/jpeg').split(';')[0]
            if 'text' in ct or 'javascript' in ct:
                img.decompose(); continue
            b64 = base64.b64encode(r.content).decode()
            img['src'] = f"data:{ct};base64,{b64}"
            img['style'] = ('max-width:100%; max-height:320px; width:auto; height:auto; '
                           'display:block; margin:14px auto; object-fit:contain;')
            for a in ['data-src','data-lazy-src','data-original','loading',
                     'srcset','data-srcset','class','id']:
                if img.has_attr(a): del img[a]
            imgs_ok += 1
        else:
            imagenes_fallidas.append(src); img.decompose()
    except:
        imagenes_fallidas.append(src); img.decompose()
```

### B6. Criterio editorial: eliminar bios de autor

> **Juicio editorial, no regla mecánica.** Un lector crítico detecta de inmediato
> una foto de autor huérfana con el texto "By" separado en otra página. Estos elementos
> son UI del sitio web, no contenido editorial. Deben eliminarse siempre.

```python
def is_author_bio(el):
    """
    Detecta y marca para eliminar los bloques bio/byline de autor.
    Son UI del sitio, no contenido editorial — el autor ya aparece
    en la línea de metadatos que generamos nosotros.
    """
    if not isinstance(el, Tag): return False
    classes = ' '.join(el.get('class') or [])
    el_id = el.get('id') or ''
    combined = (classes + ' ' + el_id).lower()

    # Patrón 1: clases explícitas de UI de autor
    AUTHOR_UI_PATTERNS = [
        r'author-bio', r'author-box', r'author-card', r'author-profile',
        r'author-img', r'author-header', r'article-header-comp',
        r'byline', r'w-author', r'with-excerpt', r'contributor'
    ]
    if any(re.search(p, combined) for p in AUTHOR_UI_PATTERNS):
        return True

    # Patrón 2: elemento corto que combina imagen + texto "By"/"Written by"
    text = el.get_text(strip=True)
    if el.find('img') and len(text) < 400:
        if re.search(r'\bby\b', text.lower()) or 'written by' in text.lower():
            return True

    return False
```

### B7. Limpieza quirúrgica de UI restante

```python
KILL_PATTERNS = [
    r'sidebar', r'cookie', r'popup', r'modal', r'social-share',
    r'newsletter', r'subscribe', r'breadcrumb', r'sentinel',
    r'article-tags', r'related-posts', r'single-image-modal',
    r'swiper', r'lightbox', r'paywall', r'promo', r'\bads\b',
    r'download-widget', r'tag-interaction', r'user-box',
    r'quick-action', r'gallery-lightbox', r'adsninja'
]

to_remove = []
for el in content.find_all(True):
    if not isinstance(el, Tag): continue
    if is_author_bio(el):
        to_remove.append(el); continue
    # Proteger elementos que ya tienen imágenes embebidas
    if el.find('img') and el.find('img').get('src', '').startswith('data:'):
        continue
    classes = ' '.join(el.get('class') or [])
    el_id = el.get('id') or ''
    combined = (classes + ' ' + el_id).lower()
    if any(re.search(p, combined) for p in KILL_PATTERNS):
        to_remove.append(el)
    # Widgets de precio/descarga
    if el.name in ['div', 'section']:
        text = el.get_text(strip=True).lower()
        if len(text) < 250 and ('download for free' in text or
           ('price' in text and 'free' in text)):
            to_remove.append(el)

for el in to_remove:
    try: el.decompose()
    except: pass
```

### B8. Criterio editorial: prevenir imágenes huérfanas

> **Juicio editorial.** Una imagen sola en la parte inferior o superior de una página,
> separada de su caption o de su contexto, denota un documento sin revisión.
> Toda imagen debe ir envuelta en un contenedor con `page-break-inside: avoid`.
> Si la imagen tiene un caption inmediatamente siguiente, se incluye dentro del mismo
> contenedor para garantizar que nunca se separen.

```python
for img in content.find_all('img'):
    if not isinstance(img, Tag): continue
    parent = img.parent
    if parent and parent.name not in ['figure']:
        wrapper = soup.new_tag('div', **{'class': 'img-wrapper'})
        img.insert_before(wrapper)
        wrapper.append(img.extract())
        # Incluir caption inmediato si existe
        next_el = wrapper.next_sibling
        if isinstance(next_el, Tag):
            text = next_el.get_text(strip=True)
            if (next_el.name in ['p', 'figcaption', 'em', 'span'] and
                len(text) < 200 and
                any(w in text.lower() for w in ['credit:', 'source:', 'photo:', 'image:',
                                                  '©', 'courtesy'])):
                wrapper.append(next_el.extract())
```

### B9. Limpiar atributos

```python
KEEP_ATTRS = {
    'img': ['src', 'alt', 'style'],
    'a': ['href'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan'],
    'div': ['class'],  # solo para nuestros img-wrapper
}
for el in content.find_all(True):
    if not isinstance(el, Tag): continue
    if el.name == 'div' and 'img-wrapper' in ' '.join(el.get('class') or []):
        continue  # Preservar nuestro wrapper
    allowed = KEEP_ATTRS.get(el.name, [])
    for a in list(el.attrs.keys()):
        if a not in allowed: del el[a]
```

### B10. Embeber tipografía Bespoke Sans

Seguir la sección **HTML @font-face** del reference file de Bespoke Sans en font-brand.
Embeber: Regular (400), Italic (400i), Medium (500), Bold (700), Extrabold (800), Light (300).

### B11. Construir HTML intermedio

El HTML incluye:
- `@font-face` de Bespoke Sans (base64)
- CSS reset hard sobre todo el contenido del artículo
- `@page { size: letter; margin: 2cm 2.5cm; }`
- Bloque visual del resumen editorial al inicio
- Contenido editorial extraído y limpio
- Pie con URL · Autor · Fecha

### B12. Convertir a PDF con WeasyPrint

```python
# pip install weasyprint beautifulsoup4 --break-system-packages
from weasyprint import HTML as WH
import re, os

slug = re.sub(r'[^\w\s-]', '', title.lower())
slug = re.sub(r'[\s_-]+', '-', slug).strip('-')[:50]
output_path = f'/mnt/user-data/outputs/{slug}.pdf'

WH(string=html_content).write_pdf(output_path)
```

### B13. Entregar al usuario

Usar `present_files` con el PDF.
Si hubo imágenes fallidas → mencionarlo brevemente:
*"No se pudieron descargar N imagen(es) por restricción del servidor."*

---

## Contexto C — Claude Cowork

Mismo flujo que Chat (pasos B1–B12), con estas diferencias:

- Guardar directamente en la carpeta activa del proyecto (no `present_files`)
- Confirmar la ruta exacta al usuario

---

## Contexto D — Claude Code local (Windows)

Mismo flujo editorial que Chat (pasos B1–B11: extraer, limpiar, resumen, HTML intermedio con
`@font-face` de Bespoke Sans en base64), con estas diferencias:

- **Tipografía:** leer los `.otf` de `<HOME>/.claude/skills/font-celimar-brand/assets/fonts/BespokeSans/`.
- **Conversión a PDF:** **no hay WeasyPrint** (requiere GTK en Windows); el render con Chromium se probó el 30-sep-2026. Usar **Chromium headless de Playwright**,
  ya instalado para `deck-studio`/`infographic-studio` (si falta, correr su `scripts/ensure_engine.mjs`):

```js
// node render_pdf.mjs  (ejecutar con cwd = carpeta de la skill deck-studio para resolver 'playwright')
import { chromium } from 'file:///<HOME>/.claude/skills/deck-studio/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
const b = await chromium.launch();
const pg = await b.newPage();
await pg.goto(pathToFileURL('RUTA/articulo.html').href, { waitUntil: 'networkidle' });
await pg.pdf({ path: 'RUTA/articulo.pdf', format: 'Letter',
               margin: { top: '2cm', bottom: '2cm', left: '2.5cm', right: '2.5cm' },
               printBackground: true, preferCSSPageSize: true });
await b.close();
```

- **Dónde guardar:** en una **subcarpeta propia del trabajo**; **pregunta la ubicación** al usuario antes de guardar.
- **Entrega:** confirmar la ruta exacta del PDF (o enviarlo con `SendUserFile`). No existe `present_files`.
- Pasos 0–B11 y los criterios editoriales de abajo aplican igual; donde diga `/mnt/user-data/outputs` o
  `present_files`, usar lo anterior.

---

## Resumen Editorial

Siempre al inicio. Bloque visualmente diferenciado: fondo `#f5f5f5`, borde izquierdo
`3px solid #333`, padding 16px 18px.

| Sección | Contenido |
|---|---|
| **Temática** | Una línea: de qué trata la página |
| **Puntos principales** | Lista de 4–8 ítems |
| **Síntesis** | 100–150 palabras: cómo el artículo relaciona los puntos y mensajes hacia la conclusión |
| **Conclusión** | 2–3 oraciones |

Etiqueta: **"RESUMEN EDITORIAL"** — BespokeSans-Medium, 8pt, `letter-spacing: 2px`,
color `#666`, mayúsculas.

---

## Criterios Editoriales de Calidad

> Estos criterios son juicio experto, no reglas mecánicas. El objetivo es que el PDF
> resista la revisión de un lector crítico y perfeccionista.

### Prevención de huérfanos

| Situación | Causa | Solución aplicada |
|---|---|---|
| Foto de autor + "By" separados de la página siguiente | Bio de autor no eliminada | `is_author_bio()` elimina todo el bloque |
| Imagen al final de página sin contexto | Sin `page-break-inside` | `.img-wrapper { page-break-inside: avoid }` |
| H2/H3 al final de página sin texto siguiente | Sin `page-break-after` | `h2, h3 { page-break-after: avoid }` |
| Párrafo que empieza con 1 línea y sigue en otra página | Widows | `p { widows: 3; orphans: 3 }` |
| Caption separado de su imagen | Sin wrapper | Caption incluido en `.img-wrapper` |
| Caja con fondo/borde (callout, recuadro de resumen, tarjeta) empujada entera a la página siguiente, dejando hueco en blanco arriba | `page-break-inside: avoid` puesto en un contenedor que a veces mide más que una página completa | Proteger solo el clúster corto de cabecera (título o etiqueta) con su propio `page-break-inside: avoid; page-break-after: avoid`; dejar que el resto (párrafos, viñetas) fluya con normalidad |

### Regla de cajas que pueden medir más de una página

> **Juicio editorial.** `page-break-inside: avoid` funciona bien en cajas que SIEMPRE
> caben en el espacio que resta de una página — una imagen, una nota corta. Puesto en
> una caja que a veces mide más que eso (un recuadro de puntos clave con muchos ítems,
> una tarjeta con un resumen largo), el motor de render no puede encogerla: si no cabe
> completa donde está, la manda entera a la página siguiente. Eso rompe el documento
> por partida doble — dejando la página anterior con un hueco en blanco, sin siquiera
> evitar un huérfano real, porque el contenido igual termina partiéndose, solo que en
> un punto peor. Este defecto pasó inadvertido en varias rondas de revisión porque el
> síntoma (hueco en blanco) se nota menos que un huérfano — conviene revisar
> específicamente por esto al validar cualquier PDF con recuadros o tarjetas largas.

La solución no es aplicar `avoid` a la caja completa, sino solo a su cabecera:

```css
/* MAL: si .callout mide más que una página, la empuja entera a la siguiente */
.callout { page-break-inside: avoid; }

/* BIEN: protege solo que la etiqueta nunca quede sola sin nada debajo,
   el resto de la caja fluye como cualquier otro contenido */
.callout .label { page-break-after: avoid; }
```

El fondo y el borde de la caja se cortan limpio en el salto de página sin ninguna
propiedad adicional — es el comportamiento por defecto de WeasyPrint y de los
navegadores, no hace falta `box-decoration-break: clone` ni nada parecido.

Reserva `page-break-before: always` para separadores de nivel "capítulo" de verdad
(el inicio de una sección mayor del documento) — ahí sí es una decisión editorial
consciente aceptar que la página anterior quede incompleta, a cambio de que la sección
nueva abra siempre con una página propia.

### Regla de detección de contenido editorial puro

No usar el `<article>` completo — contiene bios, sidebars y widgets. Extraer solo el
contenedor más largo (función `extract_editorial_section()`).

### Regla de limpieza de imágenes

Embeber imágenes SIEMPRE antes de cualquier limpieza por clases. Si se hace al revés,
los contenedores padres de imágenes pueden ser eliminados antes de que se procesen.

---

## Formato Visual del PDF

| Elemento | Especificación |
|---|---|
| **Fuente base** | Bespoke Sans (via font-brand) |
| **Papel** | Carta — 8.5" × 11" — siempre |
| **Márgenes** | 2.5 cm laterales · 2 cm sup/inf |
| **Cuerpo** | Regular 400 · 11pt · justificado · leading 1.65 |
| **H1 / Título** | Extrabold 800 · 22pt |
| **Subtítulo** | Medium Italic 500 · 14pt |
| **H2** | Bold 700 · 14pt · línea divisoria 1px #ccc |
| **H3** | Medium 500 · 12pt |
| **Caption** | Light 300 · 9pt · centrado · cursiva |
| **Header de página** | Nombre del medio (Light 300 · 8pt · gris #888) |
| **Pie de artículo** | URL · Autor · Fecha (Light 300 · 9pt) |
| **Tabla header** | Bold 700 · 9pt · fondo #eeeeee |
| **Tabla body** | Regular 400 · 9pt |
| **Código** | Courier New · 9pt · fondo #f5f5f5 |

### CSS reset obligatorio

```css
article, article *, section, section * {
  border: none;
  outline: none;
  box-shadow: none;
  background: transparent;
  color: inherit;
}
```

Sin este reset, los estilos del sitio original producen bordes, fondos y colores
inesperados que revelan el origen web del documento.

---

## Qué Eliminar

Pop-ups · cookies banners · publicidad · barra de navegación · sidebar · footer
· botones sociales · overlays · formularios de suscripción · comentarios
· artículos relacionados · bios de autor (foto + nombre + bio text)
· widgets de descarga/precio · lightboxes · sliders · cualquier elemento fuera
del cuerpo editorial puro del artículo.

## Manejo de Elementos Visuales

| Elemento | Acción |
|---|---|
| Imágenes editoriales | Embeber base64 PRIMERO, antes de limpieza por clases |
| Infografías | Igual; `max-height: 320px; object-fit: contain` |
| Tablas | Preservar estructura; `border-collapse: collapse` |
| Código | Monospace · fondo gris · `white-space: pre-wrap` |
| Imagen no descargable | Omitir → informar al usuario al finalizar |

---

## Errores y Fallbacks

| Situación | Acción |
|---|---|
| WeasyPrint no instalado | `pip install weasyprint --break-system-packages` |
| BeautifulSoup no instalado | `pip install beautifulsoup4 --break-system-packages` |
| Página detrás de paywall/login | Informar al usuario; no proceder |
| URL inaccesible (403, 404, timeout) | Informar con código de error |
| `window.print()` no responde (Chrome) | Seguir paso A7 |
| SPA con JS pesado | Extraer HTML estático; avisar si parece incompleto |

