# 07 · Motor de generación (pptxgenjs) y render

Esta skill es **autónoma**: no depende de ninguna skill de terceros. Genera el `.pptx` con `pptxgenjs`
(librería open source, MIT) y controla la calidad con el validador propio `scripts/validate_deck.py`
más el render con LibreOffice + poppler. Todo lo de abajo es conocimiento técnico del motor, incluido
aquí para que la skill funcione sin buscar nada fuera.

## Dependencias (todas libres)

- **Node.js + `pptxgenjs`** para generar el deck. **No se instala a mano:** el Paso 0 corre
  `scripts/ensure_engine.mjs` (idempotente, con resolución de Node hacia la carpeta del deck y sus padres),
  que instala `pptxgenjs` solo si no resuelve por ningún lado. Como arreglo manual suelto valdría
  `npm install pptxgenjs` en la carpeta desde donde corre el script.
- **Python 3 + `python-pptx` + `lxml`** para el validador. Si faltan: `pip install python-pptx lxml`.
- **LibreOffice** (`soffice`) y **poppler** (`pdftoppm`) para render a imágenes en el QA visual.

**Dónde vive el motor.** En **Cowork** y en **Chat** (claude.ai) `pptxgenjs` ya viene en el entorno de
ejecución. En **Claude Code** —tanto la **versión desktop** como la **versión CLI**, que corren en la
máquina del usuario— el motor **no viene preinstalado**: por eso el Paso 0 lo instala automáticamente en la
carpeta del deck (o lo hereda de esa misma carpeta o de una raíz superior si ya está preinstalado). No es una
diferencia entre desktop y CLI (ambas parten sin el motor), sino entre correr en la nube (Cowork/Chat, con
motor) y correr en la máquina del usuario (Claude Code, sin motor hasta que el Paso 0 lo resuelve).

## Gotchas de pptxgenjs (evita archivos que PowerPoint rechaza)

- **Fija `pres.layout` ANTES de añadir láminas.** Usa `"LAYOUT_WIDE"` (13.33" × 7.5"). El default es
  10" × 5.625"; las coordenadas fuera del lienzo se escriben pero la forma no aparece.
- **Colores hex: sin `#`, exactamente 6 dígitos.** `color:"FF0000"`. Un `#` o 8 dígitos (alpha embebido)
  **corrompen** el archivo. Para translucidez: `transparency: 0-100` en rellenos/imágenes, `opacity: 0.0-1.0`
  en sombras.
- **No compartas un mismo objeto de opciones entre dos llamadas `add*`** — pptxgenjs lo muta (convierte a
  EMU). Construye un objeto nuevo cada vez.
- **`isTextBox: true` en cada `addText`** — sin él, el cuadro no lleva `txBox="1"` y los lectores de pantalla
  lo anuncian como "gráfico". El validador lo marca.
- **`margin: 0`** cuando el texto deba alinear con una forma, línea o ícono en la misma x.
- **Sombra `offset ≥ 0`** (un offset negativo corrompe; para sombra hacia arriba usa `angle: 270`).
- **`charSpacing`**, no `letterSpacing` (este se ignora en silencio).
- **Viñetas**: `bullet: true` por ítem (nunca un `•` literal); `breakLine: true` en todos menos el último;
  espacia con `paraSpaceAfter`, no con `lineSpacing`.
- **Un `new pptxgen()` por archivo**; nunca reutilices la instancia.
- **`rectRadius` solo en `ROUNDED_RECTANGLE`.** Los degradados no se soportan: usa una imagen de fondo.
- **Notas del orador** en `slide.addNotes("...")`, no en un cuadro de texto en la lámina.
- **No reordenes los hijos de `<p:presentation>`**: pptxgenjs escribe `<p:notesMasterIdLst>` justo tras
  `<p:sldIdLst>`; moverlo hace el deck inabrible (el validador lo detecta).

## Gráficos nativos (editables) — vestirlos siempre

Los gráficos salen "pelados" por defecto; configúralos:

- `showTitle`+`title`, `showValue:true`+`dataLabelPosition`, `chartColors:[...]` de tu paleta.
- Marco atenuado: `catAxisLabelColor`/`valAxisLabelColor` suaves, `valGridLine:{color,size}` tenue,
  `catGridLine:{style:"none"}`, `showLegend:false` para una sola serie (mejor etiqueta directa).
- Para **una sola serie de barras**, `chartColors` colorea cada barra: úsalo para poner el foco en el acento
  y el resto en gris.
- **Apiladas**: `dataLabelPosition` debe ser `ctr`/`inEnd`/`inBase` — `outEnd` **corrompe** (el validador lo marca).
- **Combo con eje secundario**: declara `valAxes` **y** `catAxes` (dos entradas cada uno), o PowerPoint
  descarta el gráfico.
- **Iconos**: renderiza `react-icons` a SVG, rasteriza con `sharp` a ≥256px y colócalo con
  `addImage({ data:"image/png;base64,"+buf.toString("base64") })` (el prefijo es obligatorio).

## Edición de una plantilla `.potx`/`.pptx` del usuario

Un `.pptx` es un ZIP de XML. Para editar respetando el estilo del usuario:
`unzip → editar ppt/slides/slideN.xml → rezip` (comprime desde DENTRO de la carpeta). Al reemplazar texto en
una plantilla, borra los grupos sobrantes (si la plantilla muestra 4 y tienes 3, elimina el 4.º completo),
usa un `<a:p>` por ítem, y añade `xml:space="preserve"` al `<a:t>` con espacios al inicio/fin. Parsea con
`defusedxml.minidom` (no `xml.etree`, que reescribe prefijos de namespace y corrompe el deck).

## Render a imágenes (para el QA visual)

```bash
soffice --headless --convert-to pdf deck.pptx        # si 'soffice' cuelga en un sandbox, usa --nofirststartwizard o un HOME temporal
rm -f slide-*.jpg
pdftoppm -jpeg -r 150 deck.pdf slide
ls -1 "$PWD"/slide-*.jpg
```

Abre las imágenes y revísalas (ver `references/06`). Tras corregir, regenera el PDF antes de volver a `pdftoppm`.
