# 05 · Motor y render

El motor convierte tu infografía HTML (un solo lienzo, ancho fijo y alto libre) en un PNG de alta
resolución capturando el contenido completo — y, si lo pides, un PDF de una página. Es autónomo.

## Dependencias — cómo se preparan

**El motor solo viene precargado en la nube** (Cowork y Chat): ahí este apartado es solo confirmación.
**En Claude Code** (versión desktop y versión CLI, en la máquina del usuario) el motor no viene de
fábrica — lo instala el **Paso 0** del `SKILL.md`, corriendo una sola vez:
```bash
node scripts/ensure_engine.mjs
```
Es idempotente y deja listas las dos piezas (esta skill no usa `pptxgenjs` ni `python-pptx` — no hay
`.pptx`):
- **Node.js** + `playwright`, instalados en el `node_modules` de esta carpeta de la skill — nunca en la
  carpeta de la infografía ni en una raíz de proyecto, por la misma razón que en deck-studio:
  `render_infographic.mjs` es un script fijo que resuelve sus imports desde su propia ubicación.
- Un **Chromium** para Playwright (mismo mecanismo de detección que deck-studio) y **Python 3** +
  `img2pdf` para el PDF (sin `img2pdf`, no hay respaldo — instálalo con `ensure_engine.mjs`).

**Segunda causa de fallo, confirmada en pruebas reales — bibliotecas de sistema faltantes.** Un Chromium
recién descargado (versión ya correcta) puede seguir sin lanzar si al sandbox le falta una biblioteca de
sistema (típicamente de X11) que normalmente se instala con `apt-get install`, y que un entorno sin
privilegios de root no puede instalar así. `ensure_engine.mjs` la detecta (corre `ldd` sobre el binario
de Chromium, ve qué falta) y la repara **sin root**: `apt-get download <paquete>` (descarga el `.deb` sin
instalarlo — esto sí funciona sin privilegios) + `dpkg-deb -x` (lo extrae sin instalarlo) y copia la
biblioteca a `.local-libs/lib/` dentro de esta misma carpeta; `render_infographic.mjs` la agrega a
`LD_LIBRARY_PATH` al lanzar Chromium. No se toca el sistema en ningún momento. Cubre el conjunto habitual
de bibliotecas gráficas de Chromium (X11, GTK, Pango, etc.); si aparece una que no reconoce, lo dice
explícitamente en vez de fallar en silencio.

## Flujo de comandos
```bash
# 1) Renderiza LA infografía (un solo HTML) → PNG de alta resolución, alto capturado completo
node scripts/render_infographic.mjs --in infografia.html --out infografia.png   # --width 1200 --scale 2 por defecto

# 2) QA técnico (dimensiones, ancho esperado) — el PNG sale a --width × --scale, no en CSS px crudos
python3 scripts/check_infographic.py infografia.png --width 1200   # añade --scale N si no usaste el 2 por defecto

# 3) PDF (tras la aceptación del usuario)
python3 scripts/export_pdf.py --png infografia.png --out infografia.pdf
```
A diferencia de deck-studio, aquí **no hay carpeta de láminas numeradas** — es un solo archivo HTML, y
el motor captura su alto real con el `fullPage` screenshot de Playwright: no hace falta medir ni fijar
el alto a mano, y nada se recorta aunque el contenido sea muy largo.

## Ancho del lienzo
El contrato por defecto es **1200px** (`assets/canvas-frame.css` lo fija igual). Si necesitas otro
ancho —por ejemplo, un formato de impresión con medida exacta— cambia `--width` en el render Y el
`width` en el CSS **a la vez**; deben coincidir, o el aviso de `render_infographic.mjs` te lo señala.

## Detección del navegador
Mismo mecanismo que deck-studio: `INFOGRAPHIC_STUDIO_CHROMIUM` (variable de entorno) →
`/opt/pw-browsers/chromium` → `chromium-*/chrome-linux/chrome` bajo `PLAYWRIGHT_BROWSERS_PATH` → el
navegador propio de Playwright. Si todo falla, corre `node scripts/ensure_engine.mjs`. Para forzar uno:
```bash
export INFOGRAPHIC_STUDIO_CHROMIUM=/ruta/a/chrome
```

## Fuentes
- **Google Fonts por `<link>`** en el HTML (el motor espera `document.fonts.ready` antes de capturar).
  Requiere red durante el render. **Sin red**, usa fuentes web-safe o incrústalas como `@font-face` con
  un `data:` URI para un render 100% offline.
- Da SIEMPRE una pila de respaldo real.

## Resolución
`--scale 2` (default) captura a 2× — nítido para pantalla y redes. Sube a **3** para impresión de
calidad; baja a 1 solo para pruebas rápidas (el archivo pesa menos, pero pierde nitidez).

## Solución de problemas
- **"No se pudo iniciar Chromium"**: corre `node scripts/ensure_engine.mjs` — intenta instalar el
  navegador y, si sigue sin lanzar, repara bibliotecas de sistema faltantes sin root (ver arriba). Si aun
  así falla, el mensaje final te dice exactamente qué biblioteca falta y no tiene mapeo conocido; hace
  falta que alguien con privilegios de administrador corra `apt-get install` para esa biblioteca puntual.
  Alternativa: exporta `INFOGRAPHIC_STUDIO_CHROMIUM` apuntando a un binario ya funcional.
- **El PNG sale más bajo de lo esperado / contenido cortado**: revisa que no haya un `overflow: hidden`
  con altura fija en `html`, `body` o `.canvas` en tu HTML — el contrato de `canvas-frame.css` deja el
  alto libre a propósito; un `height` fijo en tu propio CSS lo anula y trunca la captura.
- **El ancho renderizado no coincide con `--width`**: `render_infographic.mjs` avisa cuando esto pasa —
  usualmente es un `width` distinto puesto a mano en el HTML; hazlo coincidir con `canvas-frame.css`.
- **La fuente no aparece**: faltó red o el `<link>` es incorrecto; verifica el nombre en Google Fonts o
  incrusta la fuente.
- **El PNG pesa mucho**: baja `--scale`, o considera si la pieza es demasiado larga para su propio bien
  (ver `references/01`, densidad).
