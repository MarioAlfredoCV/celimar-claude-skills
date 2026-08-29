# 04 · Código o imagen: decisión con criterio

infographic-studio resuelve los visuales **por código (HTML/CSS/SVG) por defecto**, y usa **imágenes**
(fotos o ilustraciones) solo cuando la sección claramente gana con ellas y hay con qué producirlas.
**Claude no genera imágenes**; por eso el diseño está pensado para funcionar igual con o sin un
generador disponible.

## El criterio (evaluar por sección)

Elige **imagen** solo si se cumplen varias de estas; en caso de duda, **código**:
- La sección es un **encabezado, un cierre o un momento emotivo** donde una foto a sangre carga el tono.
- El tema es **tangible y fotogénico** (un producto, un lugar, personas) y una foto dice lo que el texto no.
- El **estilo elegido** lo pide (p. ej. "Papel Humanista" con retrato tratado, "Imagen a sangre + overlay").
- Priorizas **velocidad** sobre control fino y tienes un generador o un banco de imágenes a mano.
- El contenido es **geográfico o de sistema complejo** (un mapa real, un diagrama con muchos elementos)
  donde el CSS puro rendiría mal (ver `references/03`, tipo de sección "Mapa o diagrama").

Elige **código** cuando: es una sección de **datos, proceso, comparación o afirmación**; necesitas
**control de marca** y consistencia; no hay generador disponible; o quieres que la pieza sea **100%
reproducible** por quien la instale. El código gana en precisión, edición y coherencia; la foto gana en
carga emocional y realismo.

## Tres vías para las imágenes

1. **Imágenes del usuario** (fotos del cliente, banco propio): colócalas a sangre (`.bleed`) con
   tratamiento — `object-fit: cover`, duotono (filtro CSS o mezcla), y un `.overlay`
   (degradado/capa de color a baja opacidad) para asegurar contraste del texto encima. No depende de IA.

2. **Placeholder de diseño + prompt** (cuando conviene una imagen y no hay generador): en el hueco, pon
   un bloque tratado (gradiente/forma/patrón del estilo) y **anota el prompt sugerido** para que el
   usuario la genere donde prefiera y la reemplace. Deja el hueco marcado en el HTML:
   ```html
   <div class="bleed placeholder" data-image-prompt="Vista aérea de un bosque de niebla,
        luz difusa, tonos verde profundo, estilo documental, 16:9"></div>
   ```
   Entrega la infografía completa igual, y lista aparte los prompts por sección para que el usuario los use.

3. **Adaptador de generador (opcional)**: si en la sesión hay una herramienta/MCP de generación de
   imágenes, o el usuario aporta una API key de un generador (OpenAI, Gemini, etc.), genera la imagen
   para cada `data-image-prompt`, guárdala junto al HTML y sustituye el placeholder por
   `<img class="bleed" src="…">` antes de renderizar. Es un **punto de extensión**, no un requisito: sin
   él, la vía 2 mantiene la pieza completa y portable.

## Honestidad y portabilidad
- La skill **no** incrusta ningún generador de imágenes (rompería la autonomía y exigiría claves de terceros).
- Por defecto, la infografía sale **completa y reproducible** con código + placeholders; las imágenes IA
  son un **plus** cuando el entorno las ofrece.
- Nunca dependas de una imagen para que la sección comunique: el texto y la composición deben
  sostenerla aunque la imagen falte o no llegue.
