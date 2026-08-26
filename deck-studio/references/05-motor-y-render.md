# 05 · Motor y render

El motor convierte tus láminas HTML en un `.pptx` de imágenes (y luego PDF). Es autónomo.

## Dependencias (todo libre)
- **Node.js** + `pptxgenjs` + `playwright`  → `npm install pptxgenjs playwright`
- Un **Chromium** para Playwright. El motor lo **detecta** en el entorno (ver abajo); si no hay ninguno:
  `npx playwright install chromium` (descarga ~150 MB, una sola vez).
- **Python 3** + `img2pdf` (o `Pillow`) para el PDF → `pip install img2pdf` · + `python-pptx` para el QA.

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
`render_deck.mjs` prueba, en orden: `DECK_STUDIO_CHROMIUM` (variable de entorno) → `/opt/pw-browsers/chromium`
(symlink típico en Cowork) → `chromium-*/chrome-linux/chrome` bajo `PLAYWRIGHT_BROWSERS_PATH` → el navegador propio
de Playwright. Si todo falla, imprime la instrucción de `npx playwright install chromium`. Para forzar uno:
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
- **"No se pudo iniciar Chromium"**: instala el navegador (`npx playwright install chromium`) o exporta
  `DECK_STUDIO_CHROMIUM`. En Linux headless el motor ya pasa `--no-sandbox`.
- **La fuente no aparece** (se ve Arial): faltó red o el `<link>` es incorrecto; verifica el nombre en Google
  Fonts o incrusta la fuente. Vuelve a renderizar.
- **Texto cortado / se sale**: el HTML desbordó la zona segura; ajústalo y re-renderiza solo esa lámina.
- **Colores lavados**: el motor fuerza `--force-color-profile=srgb`; usa hex sRGB.
- **El .pptx pesa mucho**: son imágenes; baja `--scale` o comprime los PNG antes de empaquetar.
