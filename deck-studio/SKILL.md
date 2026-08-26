---
name: deck-studio
description: >-
  Genera presentaciones de MÁXIMO impacto visual renderizando cada lámina como HTML por navegador
  (Chromium headless) y empaquetándola como imagen a pantalla completa en un .pptx — y, al aceptarse,
  en PDF. El resultado NO es editable en PowerPoint (cada lámina es una imagen); a cambio da control total
  de tipografía, color, composición y detalle, imposible con gráficos nativos. Actívala cuando el usuario
  pida una presentación "de alto impacto", "impactante", "para escenario", "pitch de inversión", "keynote",
  "premium", "que impresione", o cuando la fidelidad visual importe más que poder editar el archivo. Triggers:
  "deck de impacto", "presentación premium", "pitch para inversores", "keynote", "algo que impacte", "deck-studio".
  Es autónoma (Node + pptxgenjs + Playwright/Chromium; Python + Pillow/img2pdf para el PDF) y agnóstica de
  marca. Para editar el texto luego en PowerPoint NO uses esta skill: usa una skill de PPTX editable.
---

# deck-studio — Presentaciones de alto impacto (HTML → imagen → PPTX)

## Qué es y cuándo usarla

deck-studio compone cada lámina como una **página HTML de 1600×900**, la renderiza con **Chromium headless**
a un PNG de alta resolución y la empaqueta como **imagen a pantalla completa** en un `.pptx` (opcionalmente
PDF). Ganas **fidelidad visual total** —tipografía fina, composición libre, gradientes, formas, tratamiento
de imágenes—; pierdes la **editabilidad** (la lámina es una imagen: para cambiar un dato hay que regenerar).

- **Úsala cuando** el impacto manda: pitch de inversión, keynote, portada/cierre, deck de marca, escenario,
  algo que deba "verse increíble" y no se vaya a editar en PowerPoint.
- **NO la uses cuando** el usuario necesita editar el texto/números luego en PowerPoint, o quiere gráficos
  nativos manipulables → para eso, una skill de PPTX **editable**. Si hay duda, **pregúntalo** (Paso 0).
- **Es autónoma y agnóstica de marca.** Para vestir el deck con la identidad de una empresa, se invoca en
  paralelo la skill de marca correspondiente; esta no la menciona ni depende de ella.

## Principio rector

**Impacto visual al servicio del mensaje, no de la decoración.** La libertad del HTML no es excusa para
recargar: el texto sigue siendo mínimo ("glance media": una idea captable en ~3 s), el argumento sigue siendo
sólido, y cada lámina gasta su audacia en **un** elemento memorable. Un deck bonito que no comunica es un
fracaso caro.

## No al "look de IA" (calibración obligatoria)

El diseño generado por IA tiende a caer en tres clichés; **evítalos** salvo que el usuario los pida:
1. fondo crema (~`#F4F1EA`) + serif de alto contraste + acento terracota (~`#D97757`);
2. fondo casi negro + un único acento verde ácido o bermellón;
3. estilo periódico: filetes finos, cero radios, columnas densas.
Aparecen "por defecto" sin importar el tema. Elige una dirección **específica para este contenido** (ver la
galería de estilos), y si un eje queda libre, no lo gastes en uno de esos defaults.

## El flujo (8 pasos)

### Paso 0 — ¿Es el formato correcto?
Confirma que el usuario acepta un deck **no editable** (imágenes). Si necesita editarlo en PowerPoint, deriva a
una skill de PPTX editable. Confirma también que produces PPTX de imágenes (PDF al final, si lo acepta).

### Paso 1 — Contenido y voz  → `references/01-contenido-y-voz.md`
Fija el argumento **en texto** antes de diseñar: audiencia y propósito, Idea Gobernante, una idea por lámina,
títulos que afirman, y **texto mínimo** (aquí más que nunca). El mismo rigor de una buena presentación, con la
densidad bajada al máximo porque el vehículo es visual.

### Paso 2 — Elegir el estilo visual  → `references/02-galeria-estilos.md`
Escoge del catálogo el estilo cuyo carácter sirva a ESTE tema (no el default). Un estilo = paleta (4–6 hex
nombrados) + tipografía (display + cuerpo + utilidad) + motivo/signature + tratamiento de fondo. Compromete
la audacia en el elemento signature; el resto, disciplinado.

### Paso 3 — Layout por lámina  → `references/03-layout-y-plantillas.md`
Para cada lámina elige un arquetipo (portada, afirmación, dato-héroe, comparación, cita, cierre, sección…),
respeta el **contrato 1600×900** y la **zona segura**, y define la jerarquía. Varía los arquetipos.

### Paso 4 — Código o imagen  → `references/04-decision-imagenes.md`
Decide con criterio si la lámina se resuelve **por código** (HTML/CSS/SVG — el default) o **con una imagen**
(foto/ilustración). Claude no genera imágenes: si hace falta una y no hay generador disponible, deja un
**placeholder de diseño + el prompt sugerido** para que el usuario la reemplace.

### Paso 5 — Construir el HTML
Escribe un archivo `NN.html` por lámina (`01.html`, `02.html`, …) en un directorio de trabajo. Cada uno carga
`assets/slide-frame.css` (contrato + zona segura) y luego el bloque `<style>` del estilo elegido. Fuentes: web-safe
o Google Fonts por `<link>` (ver `references/05`).

### Paso 6 — Render y empaque  → `references/05-motor-y-render.md`
```bash
node scripts/render_deck.mjs --in <dir_html> --out deck.pptx     # HTML → PNG (Chromium) → PPTX de imágenes
```

### Paso 7 — QA y entrega  → `references/06-proceso-qa.md`
Revisa **cada PNG** (mirada fresca): overflow, contraste, jerarquía, que nada se salga de la zona segura.
Corre `python3 scripts/check_deck.py deck.pptx --png <dir_png>`. Entrega el PPTX y **pide revisión**; cuando el
usuario lo dé por aceptado, ofrece el PDF:
```bash
python3 scripts/export_pdf.py --png <dir_png> --out deck.pdf
```

## Reglas duras

- **Lienzo 1600×900**; contenido primario dentro de la **zona segura** (el fondo puede ir a sangre, el texto no).
- **Texto mínimo** por lámina (glance media); una idea + un foco.
- **Un elemento signature** por lámina; el resto, quieto. Nada de decoración que no sirva al mensaje.
- **Cero clichés de IA** (los tres de arriba), salvo pedido explícito.
- **Contraste alto** texto/fondo (apunta a WCAG AA: 4.5:1 / 3:1); el color no es el único portador de significado.
- **Estilos propios**: no copies estilos de otras herramientas; deriva cada color y tipo del tema.
- **Resultado no editable**: dilo claramente al entregar; ofrece regenerar ante cualquier cambio.

## Autonomía y dependencias

No depende de ninguna otra skill. Requiere (todo libre): **Node** + `pptxgenjs` + `playwright` (con un
**Chromium**; el motor detecta el del entorno o instálalo con `npx playwright install chromium`), y **Python** +
`img2pdf` (o `Pillow`) para el PDF y `python-pptx` para el QA. Detalles en `references/05-motor-y-render.md`.

## Archivos de referencia

- `references/01-contenido-y-voz.md` — argumento en texto, una idea, títulos, texto mínimo (glance media).
- `references/02-galeria-estilos.md` — 8 estilos visuales propios (paleta, tipografía, signature, cuándo usar).
- `references/03-layout-y-plantillas.md` — contrato 1600×900, zona segura y arquetipos de lámina.
- `references/04-decision-imagenes.md` — criterio código-vs-imagen y el adaptador de imágenes opcional.
- `references/05-motor-y-render.md` — cómo correr el motor (Chromium, fuentes, PPTX, PDF) y solución de problemas.
- `references/06-proceso-qa.md` — proceso completo, QA visual + `check_deck.py`, y checklist.
