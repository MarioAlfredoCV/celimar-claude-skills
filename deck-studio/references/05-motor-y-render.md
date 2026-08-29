# 05 · Motor y render

El motor convierte tus láminas HTML en un `.pptx` de imágenes (y luego PDF). Es autónomo.

## Dependencias — cómo se preparan

**El motor solo viene precargado en la nube** (Cowork y Chat): ahí este apartado es solo confirmación, no hay
nada que instalar. **En Claude Code** (versión desktop y versión CLI, ambas corriendo en la máquina del
usuario) el motor no viene de fábrica — lo instala el **Paso 0** del `SKILL.md`, corriendo una sola vez:
```bash
node scripts/ensure_engine.mjs
```
Es idempotente (no reinstala lo que ya está) y deja listas las tres piezas:
- **Node.js** + `pptxgenjs` + `playwright`, instalados en el **`node_modules` de esta carpeta de la skill** —
  nunca en la carpeta del deck ni en una raíz de proyecto. `render_deck.mjs` es un script fijo que vive en
  `scripts/` y resuelve sus imports desde su propia ubicación, así que aunque un uso automatizado (p. ej.
  n8n → Claude Code CLI headless) tenga `pptxgenjs` preinstalado en una raíz de proyecto para otras skills,
  deck-studio igual instala y usa el suyo propio.
- Un **Chromium** para Playwright, cuyo build debe casar con la versión de `playwright` instalada — un
  desajuste entre ambos le impide lanzarlo. `ensure_engine.mjs` lo instala con `playwright install chromium`
  (no `npx`) precisamente para no arriesgar una versión distinta a la ya instalada; el motor lo **detecta**
  en el entorno en cada render (ver abajo).
- **Python 3** + `img2pdf` + `python-pptx`. Sin `img2pdf`, `export_pdf.py` cae a `Pillow` como respaldo — en
  **Windows ese respaldo degrada el PDF a 256 colores** (paleta indexada); `img2pdf` es el que da PDF sin
  pérdida.

Si necesitas instalarlo a mano (poco común — normalmente ya lo resolvió el Paso 0): `npm install pptxgenjs
playwright` + `playwright install chromium`, y `pip install img2pdf python-pptx`.

**Segunda causa de fallo, confirmada en pruebas reales — bibliotecas de sistema faltantes.** Un Chromium
recién descargado (versión ya correcta) puede seguir sin lanzar si al sandbox le falta una biblioteca de
sistema (típicamente de X11) que normalmente se instala con `apt-get install`, y que un entorno sin
privilegios de root no puede instalar así. `ensure_engine.mjs` la detecta (corre `ldd` sobre el binario de
Chromium, ve qué falta) y la repara **sin root**: `apt-get download <paquete>` (descarga el `.deb` sin
instalarlo — esto sí funciona sin privilegios) + `dpkg-deb -x` (lo extrae sin instalarlo) y copia la
biblioteca a `.local-libs/lib/` dentro de esta misma carpeta; `render_deck.mjs` la agrega a
`LD_LIBRARY_PATH` al lanzar Chromium. No se toca el sistema en ningún momento. Cubre el conjunto habitual
de bibliotecas gráficas de Chromium (X11, GTK, Pango, etc.); si aparece una que no reconoce, lo dice
explícitamente en vez de fallar en silencio.

## Flujo de comandos
```bash
# 1) Renderiza las láminas HTML → PNG (2×) → PPTX de imágenes
node scripts/render_deck.mjs --in <dir_html> --out deck.pptx        # --scale 2 por defecto

# 2) QA del paquete
python3 scripts/check_deck.py deck.pptx --png deck_png

# 3) PDF (tras la aceptación del usuario)
python3 scripts/export_pdf.py --png deck_png --out deck.pdf
```
`render_deck.mjs` lee los `*.html` del directorio **en orden alfabético** — nómbralos `01.html`, `02.html`, … Deja
los PNG en `<out>_png/` (o donde indique `--png`).

## Detección del navegador
`render_deck.mjs` usa, en orden: `DECK_STUDIO_CHROMIUM` (variable de entorno, override explícito) → el
Chromium que Playwright ya resuelve solo (`chromium.executablePath()`) — no se escanean carpetas a mano,
porque el nombre de la subcarpeta del binario ha cambiado entre versiones de Playwright (p. ej.
"chrome-linux" vs "chrome-linux64"), y confiar en `executablePath()` evita que ese detalle interno rompa
la detección. Si el navegador no lanza, imprime la instrucción de correr `node scripts/ensure_engine.mjs`.
Para forzar un binario concreto:
```bash
export DECK_STUDIO_CHROMIUM=/ruta/a/chrome
```

## Fuentes
- **Google Fonts por `<link>`** en cada HTML (el motor espera `document.fonts.ready` antes de capturar):
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  ```
  Requiere red durante el render. **Sin red**, usa fuentes web-safe (Arial, Georgia, Helvetica, Times) o incrusta
  la fuente como `@font-face` con un `data:` URI para que el render sea 100% offline y reproducible.
- Da SIEMPRE una pila de respaldo real (`font-family: 'Fraunces', Georgia, serif`).

## Resolución
`--scale 2` → cada lámina se captura a **3200×1800** (nítida para proyección y PDF). Sube a 3 para impresión;
baja a 1 para pruebas rápidas.

## Solución de problemas
- **"No se pudo iniciar Chromium"**: corre `node scripts/ensure_engine.mjs` — intenta instalar el navegador
  y, si sigue sin lanzar, repara bibliotecas de sistema faltantes sin root (ver arriba). Si acabas de
  actualizar `playwright` a mano, el Chromium viejo puede no casar con la nueva versión — deja que
  `ensure_engine.mjs` lo resuelva. Si aun reparando las bibliotecas sigue sin lanzar, el mensaje final dice
  exactamente qué falta y sin mapeo conocido; hace falta un administrador con `apt-get install`. Alternativa:
  exporta `DECK_STUDIO_CHROMIUM` apuntando a un binario ya funcional. En Linux headless el motor ya pasa
  `--no-sandbox`.
- **La fuente no aparece** (se ve Arial): faltó red o el `<link>` es incorrecto; verifica el nombre en Google
  Fonts o incrusta la fuente. Vuelve a renderizar.
- **Texto cortado / se sale**: el HTML desbordó la zona segura; ajústalo y re-renderiza solo esa lámina.
- **Colores lavados**: el motor fuerza `--force-color-profile=srgb`; usa hex sRGB.
- **El .pptx pesa mucho**: son imágenes; baja `--scale` o comprime los PNG antes de empaquetar.
